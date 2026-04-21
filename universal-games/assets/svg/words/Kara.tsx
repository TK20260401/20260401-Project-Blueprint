import Svg, { Ellipse, Circle } from 'react-native-svg';
export function Kara({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="55" rx="30" ry="25" fill="#FFCC80" /><Ellipse cx="50" cy="50" rx="25" ry="20" fill="#FFE0B2" /><Circle cx="42" cy="48" r="4" fill="#FFB74D" /><Circle cx="55" cy="52" r="3" fill="#FFB74D" /></Svg>);
}
