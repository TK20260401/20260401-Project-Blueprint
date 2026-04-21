import Svg, { Ellipse, Rect, Circle } from 'react-native-svg';
export function Kasa({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="40" rx="35" ry="22" fill="#E53935" /><Rect x="48" y="40" width="4" height="40" rx="2" fill="#795548" /><Circle cx="50" cy="82" r="5" fill="#795548" /></Svg>);
}
