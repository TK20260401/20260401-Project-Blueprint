import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Suika({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="50" cy="50" r="35" fill="#388E3C" /><Circle cx="50" cy="50" r="28" fill="#E53935" /><Ellipse cx="42" cy="45" rx="2" ry="3" fill="#1A1A1A" /><Ellipse cx="55" cy="50" rx="2" ry="3" fill="#1A1A1A" /><Ellipse cx="48" cy="58" rx="2" ry="3" fill="#1A1A1A" /></Svg>);
}
