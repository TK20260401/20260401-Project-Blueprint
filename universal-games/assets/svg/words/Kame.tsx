import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Kame({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="55" rx="28" ry="22" fill="#4CAF50" /><Ellipse cx="50" cy="55" rx="20" ry="15" fill="#388E3C" /><Circle cx="50" cy="30" r="10" fill="#66BB6A" /><Circle cx="46" cy="28" r="2" fill="#1A1A1A" /><Circle cx="54" cy="28" r="2" fill="#1A1A1A" /><Ellipse cx="25" cy="65" rx="6" ry="4" fill="#66BB6A" /><Ellipse cx="75" cy="65" rx="6" ry="4" fill="#66BB6A" /></Svg>);
}
