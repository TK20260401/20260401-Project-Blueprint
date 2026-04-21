import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Panda({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="50" cy="55" r="30" fill="#FFFFFF" /><Circle cx="30" cy="30" r="12" fill="#1A1A1A" /><Circle cx="70" cy="30" r="12" fill="#1A1A1A" /><Ellipse cx="38" cy="50" rx="10" ry="8" fill="#1A1A1A" /><Ellipse cx="62" cy="50" rx="10" ry="8" fill="#1A1A1A" /><Circle cx="38" cy="49" r="3" fill="#FFFFFF" /><Circle cx="62" cy="49" r="3" fill="#FFFFFF" /><Ellipse cx="50" cy="60" rx="5" ry="4" fill="#1A1A1A" /></Svg>);
}
