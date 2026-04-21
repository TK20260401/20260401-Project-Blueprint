import Svg, { Circle, Rect } from 'react-native-svg';
export function Dango({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="48" y="15" width="4" height="70" rx="2" fill="#795548" /><Circle cx="50" cy="25" r="12" fill="#FFB7C5" /><Circle cx="50" cy="50" r="12" fill="#FFFFFF" /><Circle cx="50" cy="75" r="12" fill="#81C784" /></Svg>);
}
