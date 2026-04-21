import Svg, { Circle, Ellipse, Polygon } from 'react-native-svg';
export function Suzume({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="55" rx="22" ry="18" fill="#8D6E63" /><Circle cx="45" cy="42" r="14" fill="#A1887F" /><Circle cx="40" cy="40" r="3" fill="#1A1A1A" /><Polygon points="30,45 18,44 30,48" fill="#FF8F00" /></Svg>);
}
