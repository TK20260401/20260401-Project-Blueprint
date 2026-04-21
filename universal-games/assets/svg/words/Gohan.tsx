import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';
export function Gohan({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx="50" cy="65" rx="35" ry="20" fill="#5D4037" />
      <Ellipse cx="50" cy="55" rx="30" ry="22" fill="#FFFFFF" />
      <Ellipse cx="50" cy="45" rx="28" ry="15" fill="#F5F5DC" />
    </Svg>
  );
}
