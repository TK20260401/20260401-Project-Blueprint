import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Mikan({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="50" cy="55" r="28" fill="#FF9800" /><Ellipse cx="50" cy="28" rx="8" ry="5" fill="#4CAF50" /></Svg>);
}
