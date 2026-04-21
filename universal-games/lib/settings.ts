import { FontSizeLevel } from './theme';
import { loadJSON, saveJSON } from './storage';

const SETTINGS_KEY = '@universal_games/settings';

export type Settings = {
  fontSize: FontSizeLevel;
  soundEnabled: boolean;
  bgmVolume: number;
  saveEnabled: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 'large',
  soundEnabled: true,
  bgmVolume: 50,
  saveEnabled: true,
};

export async function loadSettings(): Promise<Settings> {
  return loadJSON(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: Settings): Promise<void> {
  return saveJSON(SETTINGS_KEY, settings);
}
