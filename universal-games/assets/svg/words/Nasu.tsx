import Svg, { Ellipse, Rect } from 'react-native-svg';
export function Nasu({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Rect x="40" y="15" width="20" height="12" rx="4" fill="#4CAF50" /><Ellipse cx="50" cy="55" rx="18" ry="30" fill="#7B1FA2" /></Svg>);
}
