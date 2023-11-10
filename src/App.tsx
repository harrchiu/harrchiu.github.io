import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import keyPressSound0 from './assets/typewriter_key_0.mp3';
import keyPressSound1 from './assets/typewriter_key_1.mp3';
import { DEFAULT_KEYPRESS_MS, KBKey } from './KBKey';

const KEYPRESS_SOUNDS = [keyPressSound0, keyPressSound1];

const keyboardKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
  [' '],
];
const rowOffsets = [0, 0, 100, 40, 0, 50];

interface IContent {
  text: string;
  speed?: number;
  postDelay?: number; // ms

  // content
  url?: string;

  // styling
  color?: string;
  bold?: boolean;
  italic?: boolean;
  glow?: boolean;
  underline?: boolean;
  font?: string;
}

const getTextElement = (content: IContent, charIndex?: number) => {
  if (!content) {
    return null;
  }

  const style = {
    color: content.color ?? undefined,
    fontWeight: content.bold ? 'bold' : undefined,
    fontStyle: content.italic ? 'italic' : undefined,
    textDecoration: content.underline ? 'underline' : undefined,
    fontFamily: content.font ?? undefined,
  };

  const renderedText = content.text.slice(0, charIndex);
  const className = content.glow ? 'glowing-text' : undefined;

  if (content.url) {
    return (
      <a
        href={content.url}
        style={{ ...style, color: 'black' }}
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
    // { text: `Hello.\n\n`, speed: 0.4, postDelay: 400 },
    // { text: `I am a `, speed: 3, postDelay: 1000 },
    // { text: `typewriter`, speed: 1.3, postDelay: 200, bold: true, italic: true, glow: true },
    // { text: `...`, speed: 0.5, postDelay: 1250 },

    {
      text: `Hello.\n\n`,
      speed: 1,
    },
    { text: `I am a `, speed: 50 },
    { text: `typewriter`, speed: 50, glow: true },

    { text: ` made by Harrison. \n`, postDelay: 200, speed: 10 },
    { text: `That is all he wanted to do, thanks.\n\n`, speed: 20 },

    { text: `Here is: `, speed: 10 },
    { text: `\n - his `, speed: 10 },
    { text: `resume`, speed: 10, url: `https://harrchiu.me/Harrison_Chiu_Resume.pdf` },
    { text: `\n - his `, speed: 10 },
    {
      text: `LinkedIn`,
      speed: 10,
      url: `https://www.linkedin.com/in/harrchiu/`,
      font: 'linkedin-font',
    },
    { text: `\n - his `, speed: 10 },
    { text: `GitHub`, speed: 10, url: `https://github.com/harrchiu` },
    { text: `\n - his email (harrchiu@gmail.com)`, speed: 10 },
    { text: `\n - my `, speed: 1, italic: true },
    { text: `GitHub??`, speed: 1, url: `https://github.com/harrchiu/portfolio` },
  ];

  const [keyCounters, setKeyCounters] = useState<{ [key: string]: number }>({});
  const [keypressSpeed, setKeypressSpeed] = useState(1);
  const [audiosPlaying, setAudiosPlaying] = useState(0);
  const [typedState, setTypedState] = useState({
    contentIndex: 0,
    charIndex: 0,
  });
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    handleKeyPress(e.key.toUpperCase());
  };

  const playSound = (sound: string) => {
    if (audiosPlaying >= 15) {
      return;
    }

    //   setAudiosPlaying((prev) => prev + 1);
    //   const audio = new Audio(sound);
    //   audio.play();

    //   audio.onended = () => {
    //     setAudiosPlaying((prev) => prev - 1);
    //   };
  };

  // animation triggering
  const handleKeyPress = (key: string) => {
    setKeyCounters((prevKeyCounters) => ({
      ...prevKeyCounters,
      [key]: (prevKeyCounters[key] ?? 0) + 1,
    }));
  };

  const getRenderedContent = () => {
    const { contentIndex, charIndex } = typedState;

    let renderedContent: React.ReactNode[] = [];
    for (let i = 0; i < contentIndex; i++) {
      renderedContent.push(getTextElement(fileContent[i]));
    }
    renderedContent.push(getTextElement(fileContent[contentIndex], charIndex));
    return renderedContent;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // time out to gradually show the filestring as if it's being typed
  useEffect(() => {
    localStorage.setItem('numVisits', (Number(localStorage.getItem('numVisits')) + 1).toString());

    let timeout = 0;
    for (let i = 0; i < fileContent.length; i++) {
      for (const char of fileContent[i].text) {
        const charSpeed = fileContent[i]?.speed ?? 1;
        timeout += DEFAULT_KEYPRESS_MS / charSpeed;
        // timeout += Math.random() * 50;
        timeoutsRef.current.push(
          setTimeout(() => {
            setKeypressSpeed(charSpeed);
            handleKeyPress(char.toUpperCase());
            setKeypressSpeed(1);
            setTypedState((prev) => ({ ...prev, charIndex: prev.charIndex + 1 }));
          }, timeout)
        );
      }
      timeout += fileContent[i]?.postDelay ?? 0;

      // set timeout for next content
      if (i !== fileContent.length - 1) {
        timeoutsRef.current.push(
          setTimeout(() => {
            setTypedState((prev) => ({
              ...prev,
              contentIndex: prev.contentIndex + 1,
              charIndex: 0,
            }));
          }, timeout)
        );
      }
    }
  }, []);

  useEffect(() => {
    playSound(KEYPRESS_SOUNDS[Math.floor(Math.random() * KEYPRESS_SOUNDS.length)]);
  }, [keyCounters]);

  return (
    <div className='App'>
      {Number(localStorage.getItem('numVisits')) > 1 && (
        <button
          className='skip-button'
          onClick={() => {
            setTypedState((_) => ({
              contentIndex: fileContent.length - 1,
              charIndex: fileContent.at(-1)!.text.length - 1,
            }));
            timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
          }}
        >
          Skip
        </button>
      )}
      <div className='typed-paper'>{getRenderedContent()}</div>
      <div className='keyboard-area'>
        {keyboardKeys.map((row, rowId) => {
          console.log(rowId);
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
                    key={`kb-key-${text}-${keyCounters[text] ?? 0}}`}
                    // do not render if not in map (initial render)
                    renderPress={text in keyCounters}
                    speed={keypressSpeed}
                    onClick={() => handleKeyPress(text)}
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
