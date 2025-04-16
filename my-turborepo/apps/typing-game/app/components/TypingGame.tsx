'use client';

import { useEffect } from 'react';
import { useTyping } from '../hooks/useTyping';

export function TypingGame() {
  const { text, targetText, stats, inputRef, handleInput, resetGame } = useTyping();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className='w-full max-w-2xl space-y-8'>
      <h1 className='text-4xl font-bold text-center text-gray-800'>타이핑 연습</h1>

      <div className='flex justify-center space-x-8'>
        <div className='text-center'>
          <p className='text-lg font-semibold text-gray-600'>WPM</p>
          <p className='text-3xl font-bold text-blue-600'>{stats.wpm}</p>
        </div>
        <div className='text-center'>
          <p className='text-lg font-semibold text-gray-600'>정확도</p>
          <p className='text-3xl font-bold text-green-600'>{stats.accuracy}%</p>
        </div>
      </div>

      <div className='p-4 bg-white rounded-lg shadow-md'>
        <p className='text-lg text-gray-800 mb-4 font-medium'>{targetText}</p>
        <input
          ref={inputRef}
          type='text'
          value={text}
          onChange={handleInput}
          className='w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none'
          placeholder='여기에 타이핑하세요...'
        />
      </div>

      <button
        onClick={resetGame}
        className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
        다시 시작
      </button>
    </div>
  );
}
