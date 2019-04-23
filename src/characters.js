import { POSSIBLE_CHARS } from './defaults';
function createPool(chars) {
  return chars
    .map(char => {
      let str = '';
      for (let i = 0; i < char.pref; i++) {
        str += char.name;
      }
      return str;
    })
    .join('');
}
let pool;
let poolVowels;
let poolConsonants;
createPools(POSSIBLE_CHARS);
function createPools(possibleChars) {
  pool = createPool(possibleChars);
  poolVowels = createPool(possibleChars.filter(char => char.vowel));
  poolConsonants = createPool(possibleChars.filter(char => !char.vowel));
}
function getRandomChar() {
  return getRandomCharsFromPool(pool);
}
function getRandomVowel() {
  return getRandomCharsFromPool(poolVowels);
}
function getRandomConsonant() {
  return getRandomCharsFromPool(poolConsonants);
}
function getRandomCharsFromPool(pool) {
  return pool.charAt(Math.floor(Math.random() * pool.length));
}
function shuffleArray(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}
export default function getRandomChars(count, possibleChars, unique, vowels) {
  if (unique && possibleChars.length < count) {
    throw new Error('Too many characters');
  }
  createPools(possibleChars);
  const chars = [];
  while (chars.length < count) {
    let char;
    if (vowels !== undefined) {
      if (chars.length < vowels) {
        char = getRandomVowel();
      } else {
        char = getRandomConsonant();
      }
    } else {
      char = getRandomChar();
    }
    if (unique) {
      if (!chars.includes(char)) {
        chars.push(char);
      }
    } else {
      chars.push(char);
    }
    if (vowels !== undefined) {
      shuffleArray(chars);
    }
  }
  return chars;
}
export function getHiddenState(count) {
  let arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(false);
  }
  return arr;
}
