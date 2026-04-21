import Svg, { Rect, Ellipse } from 'react-native-svg';
export function Take({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="43" y="10" width="14" height="80" rx="7" fill="#4CAF50" /><Rect x="43" y="30" width="14" height="3" fill="#388E3C" /><Rect x="43" y="55" width="14" height="3" fill="#388E3C" /><Ellipse cx="65" cy="25" rx="15" ry="6" fill="#66BB6A" transform="rotate(-30 65 25)" /><Ellipse cx="30" cy="50" rx="15" ry="6" fill="#66BB6A" transform="rotate(30 30 50)" /></Svg>);
}
