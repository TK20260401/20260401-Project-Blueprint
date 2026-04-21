import Svg, { Circle } from 'react-native-svg';
export function Goma({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Circle cx="40" cy="40" r="5" fill="#5D4037" /><Circle cx="55" cy="35" r="4" fill="#6D4C41" /><Circle cx="60" cy="50" r="5" fill="#5D4037" /><Circle cx="45" cy="55" r="4" fill="#6D4C41" /><Circle cx="35" cy="60" r="5" fill="#5D4037" /><Circle cx="55" cy="65" r="4" fill="#6D4C41" /><Circle cx="50" cy="48" r="3" fill="#795548" /></Svg>);
}
