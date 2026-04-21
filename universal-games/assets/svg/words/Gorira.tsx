import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Gorira({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="50" cy="55" r="30" fill="#424242" /><Circle cx="30" cy="40" r="8" fill="#424242" /><Circle cx="70" cy="40" r="8" fill="#424242" /><Circle cx="42" cy="48" r="4" fill="#FFFFFF" /><Circle cx="58" cy="48" r="4" fill="#FFFFFF" /><Circle cx="42" cy="48" r="2" fill="#1A1A1A" /><Circle cx="58" cy="48" r="2" fill="#1A1A1A" /><Ellipse cx="50" cy="62" rx="12" ry="8" fill="#757575" /></Svg>);
}
