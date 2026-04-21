import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { HeaderBar } from '../../components/shared/HeaderBar';
import { BigButton } from '../../components/shared/BigButton';
import { COLORS, SPACING, FONT_SIZES, FontSizeLevel, MIN_TAP_SIZE } from '../../lib/theme';
import { Settings, DEFAULT_SETTINGS, loadSettings, saveSettings } from '../../lib/settings';

const FONT_OPTIONS: { key: FontSizeLevel; label: string }[] = [
  { key: 'large', label: 'だい' },
  { key: 'xlarge', label: 'とくだい' },
  { key: 'xxlarge', label: 'ごくだい' },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  return (
    <View style={styles.container}>
      <HeaderBar title="せってい" showBack />

      <View style={styles.content}>
        {/* Font size */}
        <Text style={styles.sectionTitle}>もじの おおきさ</Text>
        <View style={styles.row}>
          {FONT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => update({ fontSize: opt.key })}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              style={[
                styles.chip,
                settings.fontSize === opt.key && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { fontSize: FONT_SIZES[opt.key].label },
                  settings.fontSize === opt.key && styles.chipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sound */}
        <Text style={styles.sectionTitle}>こうかおん</Text>
        <View style={styles.row}>
          <Pressable
            onPress={() => update({ soundEnabled: true })}
            style={[styles.chip, settings.soundEnabled && styles.chipActive]}
          >
            <Text style={[styles.chipText, settings.soundEnabled && styles.chipTextActive]}>ON</Text>
          </Pressable>
          <Pressable
            onPress={() => update({ soundEnabled: false })}
            style={[styles.chip, !settings.soundEnabled && styles.chipActive]}
          >
            <Text style={[styles.chipText, !settings.soundEnabled && styles.chipTextActive]}>OFF</Text>
          </Pressable>
        </View>

        {/* Save */}
        <Text style={styles.sectionTitle}>かんたんほぞん</Text>
        <View style={styles.row}>
          <Pressable
            onPress={() => update({ saveEnabled: true })}
            style={[styles.chip, settings.saveEnabled && styles.chipActive]}
          >
            <Text style={[styles.chipText, settings.saveEnabled && styles.chipTextActive]}>ON</Text>
          </Pressable>
          <Pressable
            onPress={() => update({ saveEnabled: false })}
            style={[styles.chip, !settings.saveEnabled && styles.chipActive]}
          >
            <Text style={[styles.chipText, !settings.saveEnabled && styles.chipTextActive]}>OFF</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  chip: {
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  chipText: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
