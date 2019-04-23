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
} from './defaults';
export default class Settings extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }
  handleChange(e) {
    const input = e.target;
    let key = input.name;
    let value = input.value;
    if (['count', 'vowels'].includes(key)) {
      value = parseInt(input.value, 10);
    } else if (key === 'unique') {
      value = input.checked;
    } else {
      const chars = this.props.possibleChars.map(char => {
        if (char.name === key) {
          return {
            ...char,
            pref: parseInt(value, 10),
          };
        }
        return char;
      });
      value = JSON.stringify(chars);
      key = 'possibleChars';
    }
    this.props.update(key, value);
  }
  render() {
    const { count, vowels, unique, possibleChars } = this.props;
    return (
      <div className="wrapper">
        <button
          type="button"
          onClick={() =>
            this.setState(state => ({
              isOpen: !state.isOpen,
            }))}
        >
          Settings
        </button>
        {this.state.isOpen &&
          <div className="settings">
            <div className="basic">
              <label>
                <input
                  type="number"
                  name="count"
                  min={MIN_COUNT}
                  max={MAX_COUNT}
                  defaultValue={count}
                  onChange={e => this.handleChange(e)}
                />{' '}
                characters,
              </label>
              <label>
                of which{' '}
                <input
                  type="number"
                  name="vowels"
                  min={MIN_VOWELS}
                  max={MAX_VOWELS}
                  defaultValue={vowels}
                  onChange={e => this.handleChange(e)}
                />{' '}
                vowels
              </label>
              <label>
                and{' '}
                <input
                  type="checkbox"
                  name="unique"
                  defaultChecked={unique}
                  onChange={e => this.handleChange(e)}
                />{' '}
                all characters unique
              </label>
            </div>
            <h4>Preferences</h4>
            <div className="preference">
              {possibleChars.map((char, i) => {
                return (
                  <span key={char.name + i} className="pref-char">
                    {char.name}
                    <br />
                    <input
                      type="number"
                      name={char.name}
                      defaultValue={char.pref}
                      onChange={e => this.handleChange(e)}
                    />
                  </span>
                );
              })}
            </div>
          </div>}
        <style jsx>{`
          .wrapper {
            width: 80vw;
            max-width: 800px;
            margin: 100px auto 50px;
          }
          button {
            min-width: 120px;
            padding: 10px;
            border: 0;
            border-radius: 5px;
            background: gray;
            color: #fff;
            font-size: 15px;
          }
          button:active {
            background: #979797;
          }
          .basic {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin: 30px 0;
          }
          input[type="number"] {
            width: 40px;
            margin-right: 5px;
            padding: 8px 10px;
            font-size: 16px;
          }
          input[type="checkbox"] {
            font-size: 16px;
          }
          .preference {
            display: flex;
            flex-wrap: wrap;
          }
          .pref-char {
            margin-bottom: 15px;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}
