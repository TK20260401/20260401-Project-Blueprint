import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, MIN_TAP_SIZE } from '../../lib/theme';

type Props = {
  title: string;
  fontSize?: number;
  showBack?: boolean;
  right?: React.ReactNode;
};

export function HeaderBar({ title, fontSize = 28, showBack = false, right }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="もどる"
          style={styles.backButton}
        >
          <Text style={[styles.backText, { fontSize }]}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={[styles.title, { fontSize }]} accessibilityRole="header">
        {title}
      </Text>
      {right ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: MIN_TAP_SIZE,
  },
});
