import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Daruma({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="55" rx="32" ry="35" fill="#E53935" /><Circle cx="50" cy="45" r="20" fill="#FFFFFF" /><Circle cx="42" cy="42" r="5" fill="#1A1A1A" /><Circle cx="58" cy="42" r="5" fill="#1A1A1A" /><Ellipse cx="50" cy="52" rx="4" ry="2" fill="#E53935" /></Svg>);
}
