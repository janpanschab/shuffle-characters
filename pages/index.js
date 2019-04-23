import { Component } from 'react';
import {
  COUNT,
  MAX_COUNT,
  MAX_VOWELS,
  MIN_COUNT,
  MIN_VOWELS,
  POSSIBLE_CHARS,
  UNIQUE,
  VOWELS,
} from '../src/defaults';
import getRandomChars, { getHiddenState } from '../src/characters';
import Settings from '../src/Settings';
const STORE_NAMESPACE = 'random';
function storeItem(key, value) {
  localStorage.setItem(`${STORE_NAMESPACE}.${key}`, value);
}
function validateState(state) {
  if (state.count < MIN_COUNT || state.count > MAX_COUNT) {
    throw new Error(
      `Count should be number between ${MIN_COUNT} and ${MAX_COUNT}`,
    );
  }
  if (
    state.unique &&
    (state.vowels < MIN_VOWELS || state.vowels > MAX_VOWELS)
  ) {
    throw new Error(
      `Vowels should be number between ${MIN_VOWELS} and ${MAX_VOWELS}`,
    );
  }
}
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      count: COUNT,
      chars: [],
      isVisible: [],
      possibleChars: POSSIBLE_CHARS,
      unique: UNIQUE,
      vowels: VOWELS,
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.rehydrate();
    this.shuffle();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  rehydrate() {
    const count = parseInt(
      localStorage.getItem(`${STORE_NAMESPACE}.count`),
      10,
    );
    const vowels = parseInt(
      localStorage.getItem(`${STORE_NAMESPACE}.vowels`),
      10,
    );
    const unique = localStorage.getItem(`${STORE_NAMESPACE}.unique`) === 'true';
    const possibleChars = JSON.parse(
      localStorage.getItem(`${STORE_NAMESPACE}.possibleChars`),
    );
    const state = {};
    if (count) state.count = count;
    if (vowels) state.vowels = vowels;
    if (unique) state.unique = unique;
    if (possibleChars) state.possibleChars = possibleChars;
    this.setState(state);
  }
  shuffle() {
    if (!this._isMounted) return;
    this.setState(state => {
      return {
        chars: getRandomChars(
          state.count,
          state.possibleChars,
          state.unique,
          state.vowels,
        ),
        isVisible: getHiddenState(state.count),
      };
    });
    let currentIndex = 0;
    const interval = setInterval(() => {
      this.setState(state => ({
        isVisible: state.isVisible.map((item, i) => {
          if (currentIndex === i) {
            return true;
          }
          return item;
        }),
      }));
      if (currentIndex === this.state.count) {
        clearInterval(interval);
      }
      currentIndex += 1;
    }, 100);
  }
  updateState(key, value) {
    validateState({ ...this.state, [key]: value });
    this.setState({ [key]: JSON.parse(value) });
    storeItem(key, value);
    this.shuffle();
  }
  render() {
    const { chars, isVisible, ...state } = this.state;
    return (
      <div className="container">
        <div className="game">
          <p>
            {chars.map((char, i) =>
              <span
                key={char + i}
                className={`char ${isVisible[i] && 'visible'}`}
              >
                {char}
              </span>,
            )}
          </p>
          <button type="button" onClick={() => this.shuffle()}>
            Shuffle
          </button>
        </div>
        <Settings
          update={(key, value) => this.updateState(key, value)}
          {...state}
        />
        <style jsx>{`
          .game {
            text-align: center;
          }
          p {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 60px 0 40px;
            min-height: 76px;
            overflow: hidden;
          }
          .char {
            padding: 10px 20px;
            font-size: 48px;
            font-weight: bold;
            transition: transform 200ms cubic-bezier(.17, .67, .52, 1.64);
            transform: translateY(-100%);
          }
          .visible {
            transform: translateY(0);
          }
          button {
            min-width: 200px;
            padding: 15px;
            border: 0;
            border-radius: 7px;
            background: orange;
            color: #fff;
            font-size: 20px;
          }
          button:hover {
            background: #f90;
          }
          button:active {
            background: #d96;
          }
        `}</style>
        <style jsx global>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
              Helvetica, Arial, sans-serif, "Apple Color Emoji",
              "Segoe UI Emoji", "Segoe UI Symbol";
          }
          button {
            cursor: pointer;
          }
          button:focus {
            outline: 0;
          }
        `}</style>
      </div>
    );
  }
}
