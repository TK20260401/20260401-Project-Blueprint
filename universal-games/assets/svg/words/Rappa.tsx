import Svg, { Rect, Circle, Ellipse } from 'react-native-svg';
export function Rappa({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="20" y="45" width="35" height="10" rx="3" fill="#FFD700" /><Ellipse cx="75" cy="50" rx="18" ry="25" fill="#FFC107" /><Circle cx="18" cy="50" r="5" fill="#FFA000" /></Svg>);
}
