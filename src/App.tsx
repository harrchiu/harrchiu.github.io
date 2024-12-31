import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import keyPressSound0 from './assets/typewriter_key_0.wav';
import keyPressSound1 from './assets/typewriter_key_1.mp3';
import keyPressSound2 from './assets/typewriter_key_2.wav';
import keyPressFinished from './assets/typewriter_key_finished.wav';
import { DEFAULT_KEYPRESS_MS, KBKey } from './KBKey';

const KEYPRESS_SOUNDS = [keyPressSound0, keyPressSound1, keyPressSound2];

const keyboardKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
  [' '],
];
const rowOffsets = [0, 0, 100, 40, 40];

interface IContent {
  text: string;
  speed?: number;
  postDelay?: number; // ms

  // content
  url?: string;

  // styling
  style?: React.CSSProperties;
  glow?: boolean;

  // perma styles until changed again
  // but only takes effect on the NEXT one........
  overrideStyles?: React.CSSProperties;
}

const getTextElement = (
  content: IContent,
  charIndex: number,
  overrideStyles: React.CSSProperties,
  key: string
) => {
  if (!content) {
    return null;
  }

  const style = {
    ...overrideStyles,
    ...content.style,
  };

  const renderedText = content.text.slice(0, charIndex);
  const className = content.glow ? 'glowing-text' : undefined;

  if (content.url) {
    return (
      <a
        href={content.url}
        style={{ ...style }}
        target='_blank'
        rel='noopener noreferrer'
        className={className}
        key={key}
      >
        {renderedText}
      </a>
    );
  }
  return (
    <span style={style} className={className} key={key}>
      {renderedText}
    </span>
  );
};

function App() {
  const [isPageActive, setIsPageActive] = useState(false);
  const [keyCounters, setKeyCounters] = useState<{ [key: string]: number }>({});
  const [typedState, setTypedState] = useState({
    contentIndex: 0,
    charIndex: 0,
  });
  const [keypressSpeed, setKeypressSpeed] = useState(1);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const [audiosPlaying, setAudiosPlaying] = useState(0);
  const [hasFinishedSoundBeenPlayed, setHasFinishedSoundBeenPlayed] = useState(false);

  const fileContent: IContent[] = [
    { text: `H`, speed: 0.4, postDelay: 650 },
    { text: `ello`, speed: 1, postDelay: 100 },
    { text: `.`, speed: 0.4, postDelay: 400 },
    { text: `\n\nI am a `, speed: 3, postDelay: 800 },
    {
      text: `typewriter`,
      speed: 1.3,
      postDelay: 200,
      style: {
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
      glow: true,
    },
    { text: `...`, speed: 0.5, postDelay: 1250 },
    { text: ` made by Harrison. \n`, postDelay: 400, speed: 10 },
    { text: `That's all he wanted to do, thanks.\n\n`, speed: 20 },

    {
      text: `Here is: `,
      speed: 10,
      overrideStyles: { lineHeight: 1.4, fontSize: 17 },
    },
    { text: `\n - his `, speed: 10 },
    { text: `resume`, speed: 10, url: `https://harrchiu.github.io/Harrison_Chiu_Resume.pdf` },
    { text: `\n - his `, speed: 10 },
    {
      text: `LinkedIn`,
      speed: 10,
      url: `https://www.linkedin.com/in/harrchiu/`,
      style: { fontFamily: 'linkedin-font' },
    },
    { text: `\n - his `, speed: 10 },
    { text: `GitHub`, speed: 10, url: `https://github.com/harrchiu` },
    { text: `\n - his email (harrchiu@gmail.com)\n`, speed: 10 },
    { text: `- `, speed: 8 },
    { text: `me`, speed: 2, url: `https://github.com/harrchiu/portfolio` },

    { text: `\n- `, speed: 8, postDelay: 150 },
    {
      text: `hoarder 🟧`,
      speed: 1,
      url: `https://playhoarder.com`,
      style: { fontWeight: 'bold' },
      postDelay: 1000,
    },

    { text: ` - (thanks for playi`, style: { fontSize: 14 }, speed: 15 },
    { text: `ng`, style: { fontSize: 14 }, speed: 3, postDelay: 350 },
    { text: `)`, style: { fontSize: 14 }, speed: 3 },
  ];

  const handleKeyDown = (e: KeyboardEvent) => {
    handleKeyPress(e.key.toUpperCase());
    setIsPageActive(true);
  };

  const playSound = (sound: string) => {
    const isFinished =
      typedState.contentIndex === fileContent.length - 1 &&
      typedState.charIndex === fileContent.at(-1)!.text.length;
    if (isFinished && !hasFinishedSoundBeenPlayed) {
      setHasFinishedSoundBeenPlayed(true);
      const audio = new Audio(keyPressFinished);
      audio.volume = 1.0;
      audio.play();
      return;
    }

    if (audiosPlaying >= 10) {
      return;
    }

    setAudiosPlaying((prev) => prev + 1);
    const audio = new Audio(sound);
    audio.volume = 0.85 - Math.pow(audiosPlaying / 15, 2);
    audio.play();

    audio.onended = () => {
      setAudiosPlaying((prev) => prev - 1);
    };
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
    let overrideStyles: React.CSSProperties = {};
    for (let i = 0; i <= contentIndex; i++) {
      const textLength = i === contentIndex ? charIndex : fileContent[i].text.length;
      console.log(fileContent[i], overrideStyles);
      renderedContent.push(
        getTextElement(fileContent[i], textLength, overrideStyles, i.toString())
      );
      if (fileContent[i].overrideStyles) {
        overrideStyles = fileContent[i].overrideStyles!;
      }
    }
    return renderedContent;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', () => {
      setIsPageActive(true);
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // time out to gradually show the filestring as if it's being typed
  useEffect(() => {
    if (!isPageActive) {
      return;
    }

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
  }, [isPageActive]);

  useEffect(() => {
    if (isPageActive) {
      playSound(KEYPRESS_SOUNDS[Math.floor(Math.random() * KEYPRESS_SOUNDS.length)]);
    }
  }, [keyCounters]);

  return (
    <div className='App'>
      {!isPageActive && (
        <div className='active-prompt'>
          <div className='active-prompt__text'>Click anywhere to start the typewriter!</div>
        </div>
      )}
      <button
        className='skip-button'
        onClick={() => {
          setTypedState((_) => ({
            contentIndex: fileContent.length - 1,
            charIndex: fileContent.at(-1)!.text.length,
          }));
          handleKeyPress(fileContent.at(-1)!.text.at(-1)!.toUpperCase());
          timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        }}
        disabled={
          typedState.contentIndex === fileContent.length - 1 &&
          typedState.charIndex === fileContent.at(-1)!.text.length
        }
      >
        Skip
      </button>
      <div className='typed-paper'>{getRenderedContent()}</div>
      <div className='keyboard-area'>
        {keyboardKeys.map((row, rowId) => {
          return (
            <div
              className='keyboard-row'
              key={`kb-row-${rowId}`}
              style={{ marginLeft: `${rowOffsets[rowId]}px` }}
            >
              {row.map((_, colId) => {
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
