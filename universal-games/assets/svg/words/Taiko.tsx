import Svg, { Ellipse, Rect } from 'react-native-svg';
export function Taiko({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="25" y="30" width="50" height="40" rx="4" fill="#E53935" /><Ellipse cx="50" cy="30" rx="25" ry="10" fill="#FFCC80" /><Ellipse cx="50" cy="70" rx="25" ry="10" fill="#FFCC80" /><Rect x="12" y="20" width="4" height="35" rx="2" fill="#795548" transform="rotate(-30 14 37)" /><Rect x="84" y="20" width="4" height="35" rx="2" fill="#795548" transform="rotate(30 86 37)" /></Svg>);
}
