import Svg, { Rect, Ellipse } from 'react-native-svg';
export function Negi({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="45" y="50" width="10" height="40" rx="5" fill="#F5F5F5" /><Ellipse cx="50" cy="35" rx="8" ry="25" fill="#4CAF50" /><Ellipse cx="42" cy="30" rx="6" ry="20" fill="#66BB6A" transform="rotate(-15 42 30)" /></Svg>);
}
