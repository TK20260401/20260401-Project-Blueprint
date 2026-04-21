import Svg, { Ellipse, Circle, Polygon } from 'react-native-svg';
export function Medaka({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="45" cy="50" rx="25" ry="14" fill="#FF8A65" /><Polygon points="70,50 85,38 85,62" fill="#FF7043" /><Circle cx="35" cy="47" r="3" fill="#1A1A1A" /></Svg>);
}
