import Svg, { Ellipse } from 'react-native-svg';
export function Mame({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="35" cy="50" rx="12" ry="18" fill="#66BB6A" /><Ellipse cx="55" cy="45" rx="12" ry="18" fill="#81C784" /><Ellipse cx="50" cy="65" rx="10" ry="15" fill="#4CAF50" /></Svg>);
}
