import React, { useEffect, useState } from 'react';
import './App.css';
import { render } from '@testing-library/react';

const DEFAULT_KEYPRESS_MS = 200;

const KBKey: React.FC<{ text: string; isPressed: boolean; speed: number }> = ({
  text,
  isPressed,
  speed,
}) => {
  return (
    <div
      className={`keyboard-key ${isPressed && 'roll-out'}`}
      style={{
        animationDuration: isPressed ? `${DEFAULT_KEYPRESS_MS / speed / 1000}s` : undefined,
      }}
    >
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
  [' '],
];
const rowOffsets = [0, 0, 100, 40, 0, 50];

// programatically make dictionary of key positions
// let keyPositions: { [key: string]: { row: number; col: number } } = {};
// keyboardKeys.forEach((row, rowId) => {
//   row.forEach((key, colId) => {
//     keyPositions[key] = { row: rowId, col: colId };
//   });
// });

interface IContent {
  text: string;
  speed?: number;
  postDelay?: number; // ms

  // content
  url?: string;

  // styling
  bold?: boolean;
  italic?: boolean;
  glow?: boolean;
  underline?: boolean;
}

const getTextElement = (content: IContent, charIndex?: number) => {
  const style = {
    fontWeight: content.bold ? 'bold' : undefined,
    fontStyle: content.italic ? 'italic' : undefined,
    textDecoration: content.underline ? 'underline' : undefined,
  };

  const renderedText = content.text.slice(0, charIndex);
  const className = content.glow ? 'glowing-text' : undefined;

  if (content.url) {
    return (
      <a
        href={content.url}
        style={style}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
      >
        {renderedText}
      </a>
    );
  }
  return (
    <span style={style} className={className}>
      {renderedText}
    </span>
  );
};

function App() {
  const fileContent: IContent[] = [
    // { text: `Hello.\n\n`, speed: 2, postDelay: 400 },
    // { text: `I am a `, speed: 3, postDelay: 1000 },
    // { text: `typewriter`, speed: 1.3, postDelay: 200, bold: true, italic: true, glow: true },
    // { text: `...`, speed: 0.5, postDelay: 1250 },

    { text: `Hello.\n\n`, speed: 50 },
    { text: `I am a `, speed: 50 },
    { text: `typewriter`, speed: 50, glow: true },

    { text: ` made by Harrison. \n`, postDelay: 200, speed: 10 },
    { text: `That is all he wanted to do, thanks.\n\n`, speed: 20 },
    { text: `Here is: `, speed: 10 },
    { text: `\n - his `, speed: 10 },
    { text: `resume`, speed: 10, url: `https://harrchiu.me/Harrison_Chiu_Resume.pdf` },
    { text: `\n - his `, speed: 10 },
    { text: `linkedin`, speed: 10, url: `https://www.linkedin.com/in/harrchiu/` },
    { text: `\n - his `, speed: 10 },
    { text: `github`, speed: 10, url: `https://github.com/harrchiu` },
    { text: `\n - his email (harrchiu@gmail.com)`, speed: 10 },
    { text: `\n - my `, speed: 10, italic: true },
    { text: `github??`, speed: 10, url: `https://github.com/harrchiu/portfolio` },
  ];

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [typedState, setTypedState] = useState({
    contentIndex: 0,
    charIndex: 0,
  });

  const getRenderedContent = () => {
    const { contentIndex, charIndex } = typedState;

    let renderedContent: React.ReactNode[] = [];
    for (let i = 0; i < contentIndex; i++) {
      renderedContent.push(getTextElement(fileContent[i]));
    }
    renderedContent.push(getTextElement(fileContent[contentIndex], charIndex));
    return renderedContent;
  };

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
    for (let i = 0; i < fileContent.length; i++) {
      for (const char of fileContent[i].text) {
        timeout += DEFAULT_KEYPRESS_MS / (fileContent[i]?.speed ?? 1);
        setTimeout(() => {
          const newPressedKeys = new Set(pressedKeys);
          newPressedKeys.add(char.toUpperCase());
          setPressedKeys(newPressedKeys);
          setTypedState((prev) => ({ ...prev, charIndex: prev.charIndex + 1 }));
        }, timeout);
      }
      timeout += fileContent[i]?.postDelay ?? 0;

      // set timeout for next content
      if (i !== fileContent.length - 1) {
        setTimeout(() => {
          setTypedState((prev) => ({ ...prev, contentIndex: prev.contentIndex + 1, charIndex: 0 }));
        }, timeout);
      }
    }
  }, []);

  return (
    <div className='App'>
      <div className='typed-paper'>{getRenderedContent()}</div>
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
                  <KBKey
                    text={text}
                    isPressed={pressedKeys.has(text)}
                    key={`kb-key-${text}`}
                    speed={1}
                  />
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
