import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const Card = () => {
  return <div className='main-card'>hi</div>;
};

const KBKey: React.FC<{ text: string; isPressed: boolean }> = ({ text, isPressed }) => {
  return (
    <div className='keyboard-key'>
      <div className='keyboard-bottom-circle' style={{ marginTop: isPressed ? '20px' : 0 }} />
      <div className='keyboard-rect' style={{ marginTop: isPressed ? '20px' : 0 }} />
      <div className='keyboard-top-circle' style={{ marginTop: isPressed ? '20px' : 0 }}>
        {text}
      </div>
    </div>
  );
};

const keyboardKeys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];
// programatically make dictionary of key positions
let keyPositions: { [key: string]: { row: number; col: number } } = {};
keyboardKeys.forEach((row, rowId) => {
  row.forEach((key, colId) => {
    keyPositions[key] = { row: rowId, col: colId };
  });
});

function App() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

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

  return (
    <div className='App'>
      <div className='keyboard-area'>
        {keyboardKeys.map((row, rowId) => {
          return (
            <div className='keyboard-row' key={`kb-row-${rowId}`}>
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
