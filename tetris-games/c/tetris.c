/*
 * テトリス - C言語版
 * ターミナル(ncurses)またはEmscripten(WASM)でビルド可能
 *
 * ターミナルビルド: gcc -o tetris tetris.c -lncurses
 * WASMビルド: emcc tetris.c -o tetris.js -s USE_SDL=2
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define COLS 10
#define ROWS 20
#define NUM_TYPES 7

/* テトリミノの色ID */
typedef enum { EMPTY=0, I_PIECE=1, O_PIECE=2, T_PIECE=3,
               S_PIECE=4, Z_PIECE=5, J_PIECE=6, L_PIECE=7 } PieceType;

/* ゲーム状態 */
typedef struct {
    int board[ROWS][COLS];
    int current[4][4];
    int current_size;
    int cx, cy;
    int score;
    int lines;
    int level;
    int game_over;
    int drop_interval;
    int bag[7];
    int bag_index;
} Game;

/* テトリミノの形状 (4x4最大) */
static const int SHAPES[8][4][4] = {
    {{0}}, /* 未使用 */
    {{0,0,0,0},{1,1,1,1},{0,0,0,0},{0,0,0,0}}, /* I */
    {{2,2,0,0},{2,2,0,0},{0,0,0,0},{0,0,0,0}}, /* O */
    {{0,3,0,0},{3,3,3,0},{0,0,0,0},{0,0,0,0}}, /* T */
    {{0,4,4,0},{4,4,0,0},{0,0,0,0},{0,0,0,0}}, /* S */
    {{5,5,0,0},{0,5,5,0},{0,0,0,0},{0,0,0,0}}, /* Z */
    {{6,0,0,0},{6,6,6,0},{0,0,0,0},{0,0,0,0}}, /* J */
    {{0,0,7,0},{7,7,7,0},{0,0,0,0},{0,0,0,0}}, /* L */
};

static const int SHAPE_SIZES[8] = {0, 4, 2, 3, 3, 3, 3, 3};

/* Fisher-Yatesシャッフル */
void shuffle_bag(Game *g) {
    for (int i = 0; i < 7; i++) g->bag[i] = i + 1;
    for (int i = 6; i > 0; i--) {
        int j = rand() % (i + 1);
        int tmp = g->bag[i];
        g->bag[i] = g->bag[j];
        g->bag[j] = tmp;
    }
    g->bag_index = 0;
}

int next_piece_type(Game *g) {
    if (g->bag_index >= 7) shuffle_bag(g);
    return g->bag[g->bag_index++];
}

/* 衝突判定 */
int collides(Game *g, int piece[4][4], int size, int px, int py) {
    for (int y = 0; y < size; y++) {
        for (int x = 0; x < size; x++) {
            if (piece[y][x]) {
                int nx = px + x, ny = py + y;
                if (nx < 0 || nx >= COLS || ny >= ROWS) return 1;
                if (ny >= 0 && g->board[ny][nx]) return 1;
            }
        }
    }
    return 0;
}

/* ピース生成 */
void spawn(Game *g) {
    int type = next_piece_type(g);
    g->current_size = SHAPE_SIZES[type];
    for (int y = 0; y < 4; y++)
        for (int x = 0; x < 4; x++)
            g->current[y][x] = SHAPES[type][y][x];
    g->cx = (COLS - g->current_size) / 2;
    g->cy = 0;
    if (collides(g, g->current, g->current_size, g->cx, g->cy))
        g->game_over = 1;
}

/* ピースをボードに固定 */
void merge(Game *g) {
    for (int y = 0; y < g->current_size; y++)
        for (int x = 0; x < g->current_size; x++)
            if (g->current[y][x])
                g->board[g->cy + y][g->cx + x] = g->current[y][x];
}

/* ライン消去 */
void clear_lines(Game *g) {
    int cleared = 0;
    for (int y = ROWS - 1; y >= 0; y--) {
        int full = 1;
        for (int x = 0; x < COLS; x++)
            if (!g->board[y][x]) { full = 0; break; }
        if (full) {
            for (int r = y; r > 0; r--)
                memcpy(g->board[r], g->board[r-1], sizeof(int) * COLS);
            memset(g->board[0], 0, sizeof(int) * COLS);
            cleared++;
            y++; /* 同じ行を再チェック */
        }
    }
    if (cleared) {
        int pts[] = {0, 100, 300, 500, 800};
        g->score += pts[cleared] * g->level;
        g->lines += cleared;
        g->level = g->lines / 10 + 1;
        g->drop_interval = 1000 - (g->level - 1) * 80;
        if (g->drop_interval < 100) g->drop_interval = 100;
    }
}

/* 回転 (時計回り) */
void rotate(Game *g) {
    int size = g->current_size;
    int rotated[4][4] = {0};
    for (int y = 0; y < size; y++)
        for (int x = 0; x < size; x++)
            rotated[x][size-1-y] = g->current[y][x];
    int kicks[] = {0, -1, 1, -2, 2};
    for (int i = 0; i < 5; i++) {
        if (!collides(g, rotated, size, g->cx + kicks[i], g->cy)) {
            memcpy(g->current, rotated, sizeof(g->current));
            g->cx += kicks[i];
            return;
        }
    }
}

/* 移動 */
void move_horizontal(Game *g, int dx) {
    if (!collides(g, g->current, g->current_size, g->cx + dx, g->cy))
        g->cx += dx;
}

int move_down(Game *g) {
    if (!collides(g, g->current, g->current_size, g->cx, g->cy + 1)) {
        g->cy++;
        return 1;
    }
    return 0;
}

void hard_drop(Game *g) {
    while (!collides(g, g->current, g->current_size, g->cx, g->cy + 1)) {
        g->cy++;
        g->score += 2;
    }
    merge(g);
    clear_lines(g);
    spawn(g);
}

int ghost_y(Game *g) {
    int gy = g->cy;
    while (!collides(g, g->current, g->current_size, g->cx, gy + 1)) gy++;
    return gy;
}

/* ゲーム初期化 */
void game_init(Game *g) {
    memset(g, 0, sizeof(Game));
    g->drop_interval = 1000;
    g->level = 1;
    g->bag_index = 7; /* 最初のspawnでシャッフルを誘発 */
    srand((unsigned)time(NULL));
    spawn(g);
}

/* 入力処理 (キーコード) */
void handle_key(Game *g, int key) {
    if (g->game_over) {
        if (key == ' ') game_init(g);
        return;
    }
    switch (key) {
        case 'h': case 4: move_horizontal(g, -1); break; /* 左 */
        case 'l': case 5: move_horizontal(g,  1); break; /* 右 */
        case 'j': case 2: move_down(g); g->score += 1; break; /* 下 */
        case 'k': case 3: rotate(g); break; /* 回転 */
        case ' ':         hard_drop(g); break;
    }
}

/* 自動落下 (戻り値: ピースが着地したか) */
int tick(Game *g) {
    if (g->game_over) return 0;
    if (!move_down(g)) {
        merge(g);
        clear_lines(g);
        spawn(g);
        return 1;
    }
    return 0;
}
