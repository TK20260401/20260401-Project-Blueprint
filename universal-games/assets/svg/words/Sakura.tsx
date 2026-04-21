import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Sakura({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx="50" cy="35" rx="12" ry="18" fill="#FFB7C5" transform="rotate(0 50 50)" />
      <Ellipse cx="50" cy="35" rx="12" ry="18" fill="#FFB7C5" transform="rotate(72 50 50)" />
      <Ellipse cx="50" cy="35" rx="12" ry="18" fill="#FFB7C5" transform="rotate(144 50 50)" />
      <Ellipse cx="50" cy="35" rx="12" ry="18" fill="#FFB7C5" transform="rotate(216 50 50)" />
      <Ellipse cx="50" cy="35" rx="12" ry="18" fill="#FFB7C5" transform="rotate(288 50 50)" />
      <Circle cx="50" cy="50" r="8" fill="#FFD700" />
    </Svg>
  );
}
