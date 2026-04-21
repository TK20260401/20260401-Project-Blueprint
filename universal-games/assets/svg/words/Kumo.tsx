import Svg, { Ellipse } from 'react-native-svg';
export function Kumo({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="55" rx="35" ry="18" fill="#EEEEEE" /><Ellipse cx="35" cy="45" rx="20" ry="16" fill="#F5F5F5" /><Ellipse cx="60" cy="42" rx="22" ry="18" fill="#FAFAFA" /><Ellipse cx="45" cy="38" rx="16" ry="14" fill="#FFFFFF" /></Svg>);
}
