import Svg, { Rect, Ellipse } from 'react-native-svg';
export function Sora({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="0" y="0" width="100" height="100" fill="#87CEEB" /><Ellipse cx="30" cy="40" rx="18" ry="10" fill="#FFFFFF" /><Ellipse cx="45" cy="35" rx="14" ry="10" fill="#FFFFFF" /><Ellipse cx="70" cy="60" rx="16" ry="9" fill="#FFFFFF" /><Ellipse cx="82" cy="55" rx="12" ry="9" fill="#FFFFFF" /></Svg>);
}
