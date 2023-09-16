import React, { useEffect, useState } from 'react';
import './App.css';

const KBKey: React.FC<{ text: string; isPressed: boolean }> = ({ text, isPressed }) => {
  //  style={{ marginTop: isPressed ? '20px' : 0 }}
  return (
    <div className={`keyboard-key ${isPressed && 'roll-out'}`}>
      <div className='keyboard-bottom-circle' />
      <div className='keyboard-rect' />
      <div className='keyboard-top-circle'>{text}</div>
    </div>
  );
};

const keyboardKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
];

const rowOffsets = [0, 0, 100, 40];

// programatically make dictionary of key positions
let keyPositions: { [key: string]: { row: number; col: number } } = {};
keyboardKeys.forEach((row, rowId) => {
  row.forEach((key, colId) => {
    keyPositions[key] = { row: rowId, col: colId };
  });
});

function App() {
  const fileString = ` Shall I compare thee to a summer's day?   
  Thou art more lovely and more temperate:
  Rough winds do shake the darling buds of May,
  And summer's lease hath all too short a date:
  Sometime too hot the eye of heaven shines,
  And often is his gold complexion dimm'd;
  And every fair from fair sometime declines,
  * The 154 sonnets Shakespeare wrote exemplify his talent for compressed writing and depth of thought. Generally thought to be (at least to some degree) autobiographical, many are in the nature of apostrophic generalities; a large number are addressed to a man, others to a "dark lady." The identity of these persons addressed has generated considerable conjecture and a torrent of controversy .
  By chance or nature's changing course untrimm'd;
  But thy eternal summer shall not fade,
  Nor lose possession of that fair thou owest,
  Nor shall Death brag thou wander'st in his shade,
  When in eternal lines to time thou grow'st;
      So long as men can breathe, or eyes can see,
      So long lives this, and this gives life to thee.
  `;
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [typedText, setTypedText] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.add(e.key.toUpperCase());
    setPressedKeys(newPressedKeys);
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.delete(e.key.toUpperCase());
    setPressedKeys(newPressedKeys);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  // time out to gradually show the filestring as if it's being typed
  useEffect(() => {
    let timeout = 0;
    for (let i = 0; i < fileString.length; i++) {
      timeout += 500; // + (Math.random() > 0.5 ? 50 : 0);
      console.log(timeout, i, fileString.length);
      setTimeout(() => {
        const newPressedKeys = new Set(pressedKeys);
        newPressedKeys.add(fileString[i].toUpperCase());
        setPressedKeys(newPressedKeys);
        setTypedText(fileString.slice(0, i + 1));
      }, timeout);
    }
  }, []);

  return (
    <div className='App'>
      <div className='typed-paper'>{typedText}</div>
      <div className='keyboard-area'>
        {keyboardKeys.map((row, rowId) => {
          return (
            <div
              className='keyboard-row'
              key={`kb-row-${rowId}`}
              style={{ marginLeft: `${rowOffsets[rowId]}px` }}
            >
              {row.map((key, colId) => {
                const text = keyboardKeys[rowId][colId];
                return (
                  <KBKey text={text} isPressed={pressedKeys.has(text)} key={`kb-key-${text}`} />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
