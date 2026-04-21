import Svg, { Circle, Rect } from 'react-native-svg';
export function Megane({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="32" cy="50" r="18" fill="none" stroke="#1A1A1A" strokeWidth="4" /><Circle cx="68" cy="50" r="18" fill="none" stroke="#1A1A1A" strokeWidth="4" /><Rect x="49" y="48" width="3" height="4" rx="1" fill="#1A1A1A" /><Rect x="8" y="48" width="8" height="3" rx="1" fill="#1A1A1A" /><Rect x="84" y="48" width="8" height="3" rx="1" fill="#1A1A1A" /></Svg>);
}
