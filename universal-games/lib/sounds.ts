import { Audio } from 'expo-av';

let hitSound: Audio.Sound | null = null;

export async function playHitSound(): Promise<void> {
  try {
    if (!hitSound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/hit.wav'),
        { shouldPlay: true }
      );
      hitSound = sound;
    } else {
      await hitSound.replayAsync();
    }
  } catch {
    // sound not available, skip silently
  }
}

export async function unloadSounds(): Promise<void> {
  if (hitSound) {
    await hitSound.unloadAsync();
    hitSound = null;
  }
}
