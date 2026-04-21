import Svg, { Circle, Polygon, Rect } from 'react-native-svg';
export function Neko({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Polygon points="25,45 35,15 45,45" fill="#FFB74D" />
      <Polygon points="55,45 65,15 75,45" fill="#FFB74D" />
      <Circle cx="50" cy="55" r="28" fill="#FFB74D" />
      <Circle cx="40" cy="50" r="4" fill="#1A1A1A" />
      <Circle cx="60" cy="50" r="4" fill="#1A1A1A" />
      <Circle cx="50" cy="58" r="3" fill="#E91E63" />
      <Rect x="15" y="55" width="18" height="2" rx="1" fill="#333" />
      <Rect x="67" y="55" width="18" height="2" rx="1" fill="#333" />
    </Svg>
  );
}
