import Svg, { Polygon } from 'react-native-svg';
export function Origami({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Polygon points="50,15 85,55 70,55 80,80 50,60 20,80 30,55 15,55" fill="#E53935" /><Polygon points="50,15 70,55 50,45 30,55" fill="#EF5350" /></Svg>);
}
