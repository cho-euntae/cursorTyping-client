import { useState, useRef, ChangeEvent } from 'react';
import { PRACTICE_TEXTS } from '../constants/texts';

interface TypingStats {
  wpm: number;
  accuracy: number;
}

export const useTyping = () => {
  const [text, setText] = useState('');
  const [targetText, setTargetText] = useState(PRACTICE_TEXTS[0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({ wpm: 0, accuracy: 100 });
  const inputRef = useRef<HTMLInputElement>(null);

  const calculateStats = () => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = text.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed);

    const correctChars = text.split('').filter((char: string, i: number) => char === targetText[i]).length;
    const accuracy = Math.round((correctChars / text.length) * 100) || 100;

    setStats({ wpm, accuracy });
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (!startTime && newText) {
      setStartTime(Date.now());
    }

    calculateStats();

    if (newText === targetText) {
      setTimeout(() => {
        const nextText = PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)];
        setTargetText(nextText);
        setText('');
        setStartTime(null);
      }, 500);
    }
  };

  const resetGame = () => {
    setText('');
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 100 });
    const nextText = PRACTICE_TEXTS[Math.floor(Math.random() * PRACTICE_TEXTS.length)];
    setTargetText(nextText);
    inputRef.current?.focus();
  };

  return {
    text,
    targetText,
    stats,
    inputRef,
    handleInput,
    resetGame,
  };
};
