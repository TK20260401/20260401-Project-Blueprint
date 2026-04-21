import Svg, { Rect, Circle } from 'react-native-svg';
export function Rajio({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="15" y="30" width="70" height="45" rx="6" fill="#8D6E63" /><Circle cx="40" cy="52" r="14" fill="#5D4037" /><Circle cx="40" cy="52" r="10" fill="#795548" /><Rect x="62" y="40" width="16" height="4" rx="2" fill="#FFD700" /><Rect x="62" y="50" width="16" height="4" rx="2" fill="#FFD700" /><Rect x="30" y="18" width="3" height="15" rx="1" fill="#9E9E9E" /></Svg>);
}
