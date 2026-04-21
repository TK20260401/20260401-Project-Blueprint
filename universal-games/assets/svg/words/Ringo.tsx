import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';
export function Ringo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="55" r="30" fill="#E53935" />
      <Rect x="48" y="18" width="4" height="15" rx="2" fill="#795548" />
      <Ellipse cx="56" cy="28" rx="8" ry="5" fill="#4CAF50" />
    </Svg>
  );
}
