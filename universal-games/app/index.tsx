import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { BigButton } from '../components/shared/BigButton';
import { COLORS, SPACING, MIN_TAP_SIZE } from '../lib/theme';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>あそびひろば</Text>
        <Pressable
          onPress={() => router.push('/settings')}
          accessibilityRole="button"
          accessibilityLabel="せってい"
          style={styles.settingsButton}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.games}>
        <BigButton
          label="もぐらたたき"
          onPress={() => router.push('/mogura')}
          color={COLORS.accent}
          fontSize={30}
          style={styles.gameButton}
        />
        <BigButton
          label="すうじトレイル"
          onPress={() => router.push('/trail')}
          color="#42A5F5"
          fontSize={28}
          style={styles.gameButton}
        />
        <BigButton
          label="ことばあそび"
          onPress={() => router.push('/kotoba')}
          color="#66BB6A"
          fontSize={28}
          style={styles.gameButton}
        />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: SPACING.lg,
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 32,
  },
  games: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  gameButton: {
    width: '100%',
    maxWidth: 400,
    minHeight: 100,
  },
  comingSoon: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 16,
    marginBottom: SPACING.xl,
  },
});
