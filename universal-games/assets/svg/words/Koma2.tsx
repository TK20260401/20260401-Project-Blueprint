import Svg, { Ellipse, Polygon, Circle } from 'react-native-svg';
export function Koma2({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="45" rx="25" ry="15" fill="#9C27B0" /><Polygon points="50,85 30,50 70,50" fill="#BA68C8" /><Circle cx="50" cy="42" r="8" fill="#FFD700" /></Svg>);
}
