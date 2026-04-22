import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { useTheme, type Palette } from "../theme";
import { rf } from "../lib/responsive";
import RpgButton from "../components/RpgButton";
import RpgCard from "../components/RpgCard";
import { supabase } from "../lib/supabase";
import { getSession } from "../lib/session";

type Props = {
  onBack: () => void;
  onSkip: () => void;
};

type MessageTone = "casual" | "polite" | "fun";

const TONE_LABELS: Record<MessageTone, string> = {
  casual: "カジュアル",
  polite: "ていねい",
  fun: "おもしろ",
};

const TONE_EMOJI: Record<MessageTone, string> = {
  casual: "\u{1F44B}",
  polite: "\u{1F4E9}",
  fun: "\u{1F389}",
};

function buildMessage(words: string[], tone: MessageTone): string {
  const wordsStr = words.join("  ");
  switch (tone) {
    case "casual":
      return (
        `ジョブサガ はじめたよ！\n` +
        `いっしょに つかおう！\n\n` +
        `あいことば: ${wordsStr}\n\n` +
        `アプリをひらいて「おやとして さんかする」から あいことばを いれてね`
      );
    case "polite":
      return (
        `ジョブサガを はじめました。\n` +
        `おうちの ひとも さんかしてください。\n\n` +
        `あいことば: ${wordsStr}\n\n` +
        `アプリを ひらいて「おやとして さんかする」から\nあいことばを にゅうりょくしてください`
      );
    case "fun":
      return (
        `\u{2728} ぼうけんしゃ ぼしゅうちゅう！ \u{2728}\n` +
        `ジョブサガの せかいで まってるよ！\n\n` +
        `ひみつの あいことば: ${wordsStr}\n\n` +
        `アプリを ひらいて「おやとして さんかする」で\nあいことばを となえよう！`
      );
  }
}

export default function InviteParentScreen({ onBack, onSkip }: Props) {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [inviteWords, setInviteWords] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<MessageTone>("casual");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchInviteWords();
  }, []);

  async function fetchInviteWords() {
    try {
      const session = await getSession();
      if (!session?.familyId) throw new Error("セッションが見つかりません");

      const { data, error } = await supabase
        .from("otetsudai_families")
        .select("invite_words")
        .eq("id", session.familyId)
        .single();

      if (error) throw error;
      setInviteWords(data.invite_words ?? []);
    } catch (err: any) {
      Alert.alert("エラー", err.message || "あいことばの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  const handleShare = useCallback(async () => {
    if (!inviteWords) return;
    const message = buildMessage(inviteWords, selectedTone);
    try {
      await Share.share({
        message,
        ...(Platform.OS === "ios" ? { url: undefined } : {}),
      });
    } catch {
      // User cancelled - ignore
    }
  }, [inviteWords, selectedTone]);

  const handleCopyWords = useCallback(async () => {
    if (!inviteWords) return;
    // expo-clipboard がなくても Share で代用可能だが、
    // ここでは words をシェアシートに渡す
    try {
      await Share.share({ message: inviteWords.join("  ") });
    } catch {
      // cancelled
    }
  }, [inviteWords]);

  if (loading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (!inviteWords || inviteWords.length === 0) {
    return (
      <View
        style={[
          styles.screen,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="もどる"
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>{"\u2190"}</Text>
        </TouchableOpacity>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            あいことばが みつかりませんでした
          </Text>
        </View>
      </View>
    );
  }

  const qrData = JSON.stringify({ type: "otetsudai-invite", words: inviteWords });

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        accessibilityLabel="もどる"
        accessibilityRole="button"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backArrow}>{"\u2190"}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>おうちの ひとを よぼう！</Text>
        <Text style={styles.subtitle}>
          おやに このがめんを みせるか{"\n"}
          メッセージを おくってね
        </Text>

        {/* あいことばカード */}
        <RpgCard tier="gold" variant="compact" style={styles.wordsCard}>
          <Text style={styles.sectionLabel}>あいことば</Text>
          <View style={styles.wordsRow}>
            {inviteWords.map((word, i) => (
              <View key={i} style={styles.wordChip}>
                <Text style={styles.wordText}>{word}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleCopyWords}
            style={styles.copyButton}
            accessibilityLabel="あいことばをコピー"
            accessibilityRole="button"
          >
            <Text style={styles.copyButtonText}>
              あいことばを おくる
            </Text>
          </TouchableOpacity>
        </RpgCard>

        {/* QRコード */}
        <RpgCard tier="silver" variant="compact" style={styles.qrCard}>
          <Text style={styles.sectionLabel}>QRコード</Text>
          <Text style={styles.qrHint}>
            おやの スマホで よみとってね
          </Text>
          <View style={styles.qrWrap}>
            <View style={styles.qrBackground}>
              <QRCode
                value={qrData}
                size={160}
                backgroundColor="#FFFFFF"
                color={palette.primaryDark}
              />
            </View>
          </View>
        </RpgCard>

        {/* テキストシェア */}
        <RpgCard tier="silver" variant="compact" style={styles.shareCard}>
          <Text style={styles.sectionLabel}>メッセージで おくる</Text>

          <View style={styles.toneRow}>
            {(["casual", "polite", "fun"] as MessageTone[]).map((tone) => (
              <TouchableOpacity
                key={tone}
                onPress={() => setSelectedTone(tone)}
                style={[
                  styles.toneChip,
                  selectedTone === tone && styles.toneChipActive,
                ]}
                accessibilityLabel={TONE_LABELS[tone]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedTone === tone }}
              >
                <Text style={styles.toneEmoji}>{TONE_EMOJI[tone]}</Text>
                <Text
                  style={[
                    styles.toneText,
                    selectedTone === tone && styles.toneTextActive,
                  ]}
                >
                  {TONE_LABELS[tone]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              {buildMessage(inviteWords, selectedTone)}
            </Text>
          </View>

          <RpgButton
            tier="emerald"
            size="md"
            fullWidth
            onPress={handleShare}
            accessibilityLabel="メッセージをおくる"
          >
            <Text style={styles.shareButtonText}>
              おくる
            </Text>
          </RpgButton>
        </RpgCard>

        {/* スキップ */}
        <TouchableOpacity
          onPress={onSkip}
          style={styles.skipLink}
          accessibilityLabel="あとでやる"
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>あとで よぶ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function createStyles(p: Palette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: p.backgroundLanding,
      paddingHorizontal: 20,
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    backArrow: {
      fontSize: rf(24),
      color: p.primaryDark,
      fontWeight: "bold",
    },
    scrollContent: {
      alignItems: "center",
      paddingBottom: 32,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      fontSize: rf(16),
      color: p.textMuted,
      textAlign: "center",
    },
    title: {
      fontSize: rf(22),
      fontWeight: "800",
      color: p.primaryDark,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: rf(14),
      color: p.primary,
      marginBottom: 20,
      textAlign: "center",
      lineHeight: rf(22),
    },
    // あいことばカード
    wordsCard: {
      width: "100%",
      marginBottom: 16,
    },
    sectionLabel: {
      fontSize: rf(13),
      fontWeight: "bold",
      color: p.textMuted,
      marginBottom: 10,
      textAlign: "center",
      letterSpacing: 1,
    },
    wordsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginBottom: 14,
      flexWrap: "wrap",
    },
    wordChip: {
      backgroundColor: p.white,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: p.borderStrong,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    wordText: {
      fontSize: rf(18),
      fontWeight: "bold",
      color: p.primaryDark,
      letterSpacing: 1,
    },
    copyButton: {
      alignSelf: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: "center",
    },
    copyButtonText: {
      fontSize: rf(13),
      color: p.primary,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    // QR
    qrCard: {
      width: "100%",
      marginBottom: 16,
    },
    qrHint: {
      fontSize: rf(12),
      color: p.textMuted,
      textAlign: "center",
      marginBottom: 12,
    },
    qrWrap: {
      alignItems: "center",
    },
    qrBackground: {
      backgroundColor: "#FFFFFF",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
    },
    // シェア
    shareCard: {
      width: "100%",
      marginBottom: 20,
    },
    toneRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 14,
    },
    toneChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: p.surfaceMuted,
      borderWidth: 1.5,
      borderColor: "transparent",
      minHeight: 44,
    },
    toneChipActive: {
      borderColor: p.primary,
      backgroundColor: p.white,
    },
    toneEmoji: {
      fontSize: rf(16),
    },
    toneText: {
      fontSize: rf(12),
      color: p.textMuted,
      fontWeight: "600",
    },
    toneTextActive: {
      color: p.primaryDark,
    },
    previewBox: {
      backgroundColor: p.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.border,
      padding: 14,
      marginBottom: 14,
    },
    previewText: {
      fontSize: rf(13),
      color: p.textStrong,
      lineHeight: rf(20),
    },
    shareButtonText: {
      fontSize: rf(16),
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    // スキップ
    skipLink: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      minHeight: 44,
      justifyContent: "center",
    },
    skipText: {
      fontSize: rf(13),
      color: p.textMuted,
      textDecorationLine: "underline",
    },
  });
}
