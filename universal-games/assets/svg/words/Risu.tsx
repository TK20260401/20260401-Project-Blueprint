import Svg, { Circle, Ellipse } from 'react-native-svg';
export function Risu({ size }: { size: number }) {
  return (<Svg width={size} height={size} viewBox="0 0 100 100"><Ellipse cx="50" cy="60" rx="18" ry="22" fill="#8D6E63" /><Circle cx="50" cy="38" r="15" fill="#A1887F" /><Circle cx="44" cy="35" r="3" fill="#1A1A1A" /><Circle cx="56" cy="35" r="3" fill="#1A1A1A" /><Ellipse cx="50" cy="42" rx="3" ry="2" fill="#E91E63" /><Ellipse cx="70" cy="55" rx="12" ry="20" fill="#8D6E63" transform="rotate(30 70 55)" /></Svg>);
}
