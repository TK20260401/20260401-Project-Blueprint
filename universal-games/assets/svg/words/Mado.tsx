import Svg, { Rect } from 'react-native-svg';
export function Mado({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="15" y="15" width="70" height="70" rx="4" fill="#87CEEB" stroke="#795548" strokeWidth="5" /><Rect x="48" y="15" width="4" height="70" fill="#795548" /><Rect x="15" y="48" width="70" height="4" fill="#795548" /></Svg>);
}
