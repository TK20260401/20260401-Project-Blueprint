import Svg, { Polygon, Circle, Rect } from 'react-native-svg';
export function Koma({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Polygon points="50,15 75,75 25,75" fill="#E53935" /><Circle cx="50" cy="50" r="8" fill="#FFD700" /><Rect x="48" y="75" width="4" height="15" rx="2" fill="#795548" /></Svg>);
}
