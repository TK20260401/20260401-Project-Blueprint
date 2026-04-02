class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        // DOMの取得
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.clearBtn = document.getElementById('clearBtn');
        this.totalCount = document.getElementById('totalCount');
        this.completeCount = document.getElementById('completeCount');

        // イベントリスナーの登録
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.clearBtn.addEventListener('click', () => this.clearCompleted());

        // ローカルストレージからデータを読み込む
        this.loadTodos();
        this.render();
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            alert('タスクを入力してください');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString('ja-JP')
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.todoInput.focus();
        this.saveTodos();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    clearCompleted() {
        const completed = this.todos.filter(todo => todo.completed);
        
        if (completed.length === 0) {
            alert('完了したタスクはありません');
            return;
        }

        if (confirm(`${completed.length}個の完了タスクを削除しますか？`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.render();
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        if (stored) {
            try {
                this.todos = JSON.parse(stored);
            } catch (e) {
                console.error('ローカルストレージの読み込みに失敗しました:', e);
                this.todos = [];
            }
        }
    }

    render() {
        // リストをクリア
        this.todoList.innerHTML = '';

        // タスクがない場合
        if (this.todos.length === 0) {
            this.todoList.innerHTML = '<div class="empty-state"><p>📭 タスクはまだありません</p></div>';
            this.totalCount.textContent = '0';
            this.completeCount.textContent = '0';
            this.clearBtn.disabled = true;
            return;
        }

        // 統計情報の更新
        const completedCount = this.todos.filter(todo => todo.completed).length;
        this.totalCount.textContent = this.todos.length;
        this.completeCount.textContent = completedCount;
        this.clearBtn.disabled = completedCount === 0;

        // リストの描画
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox"
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">削除</button>
            `;

            // チェックボックスのイベント
            li.querySelector('.todo-checkbox').addEventListener('change', () => {
                this.toggleTodo(todo.id);
            });

            // 削除ボタンのイベント
            li.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteTodo(todo.id);
            });

            this.todoList.appendChild(li);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
