import Svg, { Ellipse, Circle, Polygon } from 'react-native-svg';
export function Sakana({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="45" cy="50" rx="28" ry="16" fill="#42A5F5" /><Polygon points="73,50 90,35 90,65" fill="#1E88E5" /><Circle cx="33" cy="47" r="4" fill="#FFFFFF" /><Circle cx="33" cy="47" r="2" fill="#1A1A1A" /></Svg>);
}
