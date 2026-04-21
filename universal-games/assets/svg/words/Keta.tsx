import Svg, { Rect } from 'react-native-svg';
export function Keta({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="15" y="35" width="30" height="12" rx="2" fill="#8D6E63" /><Rect x="22" y="47" width="6" height="25" rx="1" fill="#795548" /><Rect x="34" y="47" width="6" height="25" rx="1" fill="#795548" /><Rect x="55" y="35" width="30" height="12" rx="2" fill="#8D6E63" /><Rect x="62" y="47" width="6" height="25" rx="1" fill="#795548" /><Rect x="74" y="47" width="6" height="25" rx="1" fill="#795548" /><Rect x="25" y="25" width="50" height="4" rx="1" fill="#E53935" /></Svg>);
}
