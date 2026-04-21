import Svg, { Rect, Ellipse } from 'react-native-svg';
export function Matsuri({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="38" y="10" width="24" height="60" rx="12" fill="#E53935" /><Rect x="42" y="40" width="16" height="8" rx="2" fill="#FFD700" /><Rect x="48" y="70" width="4" height="20" rx="2" fill="#795548" /></Svg>);
}
