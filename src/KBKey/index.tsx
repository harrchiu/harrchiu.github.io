import React, { useEffect, useState } from 'react';
import './KBKey.css';

export const DEFAULT_KEYPRESS_MS = 200;

const KBKey: React.FC<{
  text: string;
  speed: number;
  renderPress: boolean;
  onClick: () => void;
}> = ({ text, speed, renderPress, onClick }) => {
  const spaceCls = text === ' ' ? 'space-key' : '';
  return (
    <div
      className={`keyboard-key ${renderPress && 'roll-out'}`}
      style={{
        animationDuration: `${DEFAULT_KEYPRESS_MS / speed / 1000}s`,
        animationTimingFunction: 'easy-in-out',
      }}
      onClick={onClick}
    >
      {/* <div className='keyboard-key-rod' /> */}
      <div className={`keyboard-key-bottom-circle ${spaceCls}`} />
      <div className={`keyboard-key-rect ${spaceCls}`} />
      <div className={`keyboard-key-top-circle ${spaceCls}`}>{text}</div>
    </div>
  );
};

export { KBKey };
