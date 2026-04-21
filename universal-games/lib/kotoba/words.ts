import { Sakura } from '../../assets/svg/words/Sakura';
import { Ringo } from '../../assets/svg/words/Ringo';
import { Gohan } from '../../assets/svg/words/Gohan';
import { Neko } from '../../assets/svg/words/Neko';
import { Koma } from '../../assets/svg/words/Koma';
import { Mame } from '../../assets/svg/words/Mame';
import { Medaka } from '../../assets/svg/words/Medaka';
import { Kasa } from '../../assets/svg/words/Kasa';
import { Sakana } from '../../assets/svg/words/Sakana';
import { Nasu } from '../../assets/svg/words/Nasu';
import { Suika } from '../../assets/svg/words/Suika';
import { Kara } from '../../assets/svg/words/Kara';
import { Rappa } from '../../assets/svg/words/Rappa';
import { Panda } from '../../assets/svg/words/Panda';
import { Daruma } from '../../assets/svg/words/Daruma';
import { Matsuri } from '../../assets/svg/words/Matsuri';
import { Risu } from '../../assets/svg/words/Risu';
import { Suzume } from '../../assets/svg/words/Suzume';
import { Megane } from '../../assets/svg/words/Megane';
import { Negi } from '../../assets/svg/words/Negi';
import { Goma } from '../../assets/svg/words/Goma';
import { Mado } from '../../assets/svg/words/Mado';
import { Dango } from '../../assets/svg/words/Dango';
import { Gorira } from '../../assets/svg/words/Gorira';
import { Rajio } from '../../assets/svg/words/Rajio';
import { Origami } from '../../assets/svg/words/Origami';
import { Mikan } from '../../assets/svg/words/Mikan';
import { Kame } from '../../assets/svg/words/Kame';
import { Sora } from '../../assets/svg/words/Sora';
import { Take } from '../../assets/svg/words/Take';
import { Keta } from '../../assets/svg/words/Keta';
import { Taiko } from '../../assets/svg/words/Taiko';
import { Koma2 } from '../../assets/svg/words/Koma2';
import { Kumo } from '../../assets/svg/words/Kumo';

export type WordCategory = 'animal' | 'food' | 'nature' | 'object' | 'vehicle';

export type Word = {
  id: string;
  hiragana: string;
  startsWith: string;
  endsWith: string;
  svg: React.FC<{ size: number }>;
  category: WordCategory;
};

export const WORDS: Word[] = [
  { id: 'sakura', hiragana: 'さくら', startsWith: 'さ', endsWith: 'ら', svg: Sakura, category: 'nature' },
  { id: 'ringo', hiragana: 'りんご', startsWith: 'り', endsWith: 'ご', svg: Ringo, category: 'food' },
  { id: 'gohan', hiragana: 'ごはん', startsWith: 'ご', endsWith: 'は', svg: Gohan, category: 'food' },
  { id: 'neko', hiragana: 'ねこ', startsWith: 'ね', endsWith: 'こ', svg: Neko, category: 'animal' },
  { id: 'koma', hiragana: 'こま', startsWith: 'こ', endsWith: 'ま', svg: Koma, category: 'object' },
  { id: 'mame', hiragana: 'まめ', startsWith: 'ま', endsWith: 'め', svg: Mame, category: 'food' },
  { id: 'medaka', hiragana: 'めだか', startsWith: 'め', endsWith: 'か', svg: Medaka, category: 'animal' },
  { id: 'kasa', hiragana: 'かさ', startsWith: 'か', endsWith: 'さ', svg: Kasa, category: 'object' },
  { id: 'sakana', hiragana: 'さかな', startsWith: 'さ', endsWith: 'な', svg: Sakana, category: 'food' },
  { id: 'nasu', hiragana: 'なす', startsWith: 'な', endsWith: 'す', svg: Nasu, category: 'food' },
  { id: 'suika', hiragana: 'すいか', startsWith: 'す', endsWith: 'か', svg: Suika, category: 'food' },
  { id: 'kara', hiragana: 'から', startsWith: 'か', endsWith: 'ら', svg: Kara, category: 'object' },
  { id: 'rappa', hiragana: 'らっぱ', startsWith: 'ら', endsWith: 'ぱ', svg: Rappa, category: 'object' },
  { id: 'panda', hiragana: 'ぱんだ', startsWith: 'ぱ', endsWith: 'だ', svg: Panda, category: 'animal' },
  { id: 'daruma', hiragana: 'だるま', startsWith: 'だ', endsWith: 'ま', svg: Daruma, category: 'object' },
  { id: 'matsuri', hiragana: 'まつり', startsWith: 'ま', endsWith: 'り', svg: Matsuri, category: 'object' },
  { id: 'risu', hiragana: 'りす', startsWith: 'り', endsWith: 'す', svg: Risu, category: 'animal' },
  { id: 'suzume', hiragana: 'すずめ', startsWith: 'す', endsWith: 'め', svg: Suzume, category: 'animal' },
  { id: 'megane', hiragana: 'めがね', startsWith: 'め', endsWith: 'ね', svg: Megane, category: 'object' },
  { id: 'negi', hiragana: 'ねぎ', startsWith: 'ね', endsWith: 'ぎ', svg: Negi, category: 'food' },
  { id: 'goma', hiragana: 'ごま', startsWith: 'ご', endsWith: 'ま', svg: Goma, category: 'food' },
  { id: 'mado', hiragana: 'まど', startsWith: 'ま', endsWith: 'ど', svg: Mado, category: 'object' },
  { id: 'dango', hiragana: 'だんご', startsWith: 'だ', endsWith: 'ご', svg: Dango, category: 'food' },
  { id: 'gorira', hiragana: 'ごりら', startsWith: 'ご', endsWith: 'ら', svg: Gorira, category: 'animal' },
  { id: 'rajio', hiragana: 'らじお', startsWith: 'ら', endsWith: 'お', svg: Rajio, category: 'object' },
  { id: 'origami', hiragana: 'おりがみ', startsWith: 'お', endsWith: 'み', svg: Origami, category: 'object' },
  { id: 'mikan', hiragana: 'みかん', startsWith: 'み', endsWith: 'か', svg: Mikan, category: 'food' },
  { id: 'kame', hiragana: 'かめ', startsWith: 'か', endsWith: 'め', svg: Kame, category: 'animal' },
  { id: 'sora', hiragana: 'そら', startsWith: 'そ', endsWith: 'ら', svg: Sora, category: 'nature' },
  { id: 'take', hiragana: 'たけ', startsWith: 'た', endsWith: 'け', svg: Take, category: 'nature' },
  { id: 'keta', hiragana: 'けた', startsWith: 'け', endsWith: 'た', svg: Keta, category: 'object' },
  { id: 'taiko', hiragana: 'たいこ', startsWith: 'た', endsWith: 'こ', svg: Taiko, category: 'object' },
  { id: 'kumo', hiragana: 'くも', startsWith: 'く', endsWith: 'も', svg: Kumo, category: 'nature' },
];
