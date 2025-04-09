'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
const koreanSentences = [
  '오늘은 날씨가 참 좋네요.',
  '나는 매일 아침 커피를 마십니다.',
  '고양이는 창밖을 바라보고 있어요.',
  '프론트엔드 개발은 재미있지만 가끔 헷갈려요.',
  '운동을 하면 기분이 좋아져요.',
  '모든 일에는 때가 있는 법이죠.',
  '시간은 누구에게나 공평해요.',
  '책을 읽는 건 마음의 양식을 쌓는 일이에요.',
  '지하철은 출근 시간에 너무 혼잡해요.',
  '저녁 노을이 정말 예쁘네요.',
];
export default function Home() {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [_isHost, setIsHost] = useState(false); // 방 생성자 여부 확인 (나중에 추가)
  const [opponentProgress, setOpponentProgress] = useState({ cpm: 0, wpm: 0, accuracy: 100 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [wordCount, setWordCount] = useState(0);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Array<{ message: string; username: string; timestamp: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [username, setUsername] = useState('');

  async function getTexts() {
    console.log(language);
    if (language === 'ko') {
      return koreanSentences[Math.floor(Math.random() * koreanSentences.length)];
    } else {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      return data.content;
    }
  }

  // useEffect(() => {
  //   socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? '', {
  //     path: '/socket.io', // socket 서버의 path가 다르다면 이걸 맞춰야 함
  //     transports: ['websocket'], // polling 방지
  //   });

  //   socketRef.current.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  //   return () => {
  //     socketRef.current?.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    console.log('SOCKET URL:', process.env.NEXT_PUBLIC_SOCKET_URL);
    // Socket.IO 연결
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? '', {
      path: '/socket.io', // socket 서버의 path가 다르다면 이걸 맞춰야 함
      transports: ['websocket'], // polling 방지
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    // 새로운 메시지 수신
    socketRef.current.on('newMessage', (data: { message: string; username: string; timestamp: string }) => {
      console.log('Received new message:', data);
      setMessages((prev) => [...prev, data]);
    });

    // 랜덤 텍스트 선택
    getTexts().then((text) => setText(text));

    socketRef.current.on('userProgress', (data: any) => {
      setOpponentProgress({
        cpm: data.cpm,
        wpm: data.wpm,
        accuracy: data.accuracy,
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (!inputRoomId.trim()) {
      alert('방 ID를 입력해주세요!');
      return;
    }
    const newRoomId = inputRoomId;
    setRoomId(newRoomId);
    setIsHost(true);
    console.log(`createRoom: ${roomId}, socket.id: ${socketRef.current?.id}`);

    socketRef.current?.emit('createRoom', newRoomId);
    socketRef.current?.emit('joinRoom', newRoomId);

    // 방 생성 시 새로운 랜덤 텍스트 선택
    getTexts().then((text) => setText(text));
    setInput('');
    setStartTime(null);
    setCpm(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(30);
    setWordCount(0);
  };

  const joinRoom = () => {
    if (inputRoomId) {
      socketRef.current?.emit('joinRoom', inputRoomId);
      setRoomId(inputRoomId);
      setIsHost(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
      socketRef.current?.emit('startTyping', roomId);
    }

    // 단어 수 카운트 (공백으로 구분)
    const words = value.trim().split(/\s+/).length;
    setWordCount(words);

    setInput(value);

    // Calculate accuracy
    const correctChars = value.split('').filter((char, i) => char === text[i]).length;
    const accuracy = (correctChars / value.length) * 100;
    setAccuracy(Math.round(accuracy));

    // Calculate CPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const currentCpm = Math.round(value.length / timeElapsed);
      setCpm(currentCpm);
      const currentWpm = Math.round(value.length / timeElapsed);
      setWpm(currentWpm);

      // Send progress to other players
      socketRef.current?.emit('typingProgress', {
        roomId,
        progress: value.length / text.length,
        cpm: currentCpm,
        wpm: currentWpm,
        accuracy: Math.round(accuracy),
      });
    }
  };

  const menu = ['타이핑 테스트', '키 스트로크 연습', '고급'];
  const menus = () => {
    return menu.map((item, index) => (
      <li className='p-2 flex relative center cursor-pointer' key={index}>
        <a>{item}</a>
      </li>
    ));
  };

  useEffect(() => {
    if (input.length === text.length) {
      // 타이핑 완료 알림
      alert(`타이핑 완료!\n타이핑 속도: ${cpm}타/분\n정확도: ${accuracy}%\n총 타이핑 속도: ${wpm}타/분`);

      // 상태 초기화
      setInput('');
      setStartTime(null);
      setCpm(0);
      setWpm(0);
      setAccuracy(100);

      // 새로운 랜덤 텍스트 선택
      getTexts().then((text) => setText(text));
    }
  }, [input, text]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      alert(`시간 종료!\n총 입력한 단어 수: ${wordCount}\n타이핑 속도: ${cpm}타/분\n정확도: ${accuracy}%`);
      setInput('');
      setStartTime(null);
      setCpm(0);
      setWpm(0);
      setAccuracy(100);
      setTimeLeft(30);
      setWordCount(0);
      getTexts().then((text) => setText(text));
    }
  }, [timeLeft]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'));
    getTexts().then((text) => setText(text));
    setInput('');
    setStartTime(null);
    setCpm(0);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(30);
    setWordCount(0);
  };

  const sendMessage = () => {
    if (chatInput.trim() && username.trim() && roomId) {
      console.log('Sending message:', { roomId, message: chatInput, username });
      socketRef.current?.emit('chatMessage', {
        roomId,
        message: chatInput,
        username,
      });
      setChatInput('');
    }
  };

  return (
    <>
      <header className='flex h-[60] px-10 w-full center'>
        <div className='logo flex center'>
          <a href='/' className='flex items-center'>
            <Image className='block' src='/typing_logo.png' alt='Logo' width={50} height={50} />
            <span className='font-bold text-2xl'>Typing Speed Test</span>
          </a>
        </div>
        <div className='flex-1 menu ml-10 items-center h-full'>
          <ul className='flex min-w-[300px] h-full items-center font-600 list-none'>{menus()}</ul>
        </div>
        <div className='flex items-center'>
          <button onClick={toggleLanguage} className='px-4 py-2 bg-gray-500 text-white rounded-lg'>
            {language === 'ko' ? '한국어' : 'English'}
          </button>
        </div>
      </header>

      <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
        <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
          {/* <Image className='dark:invert' src='/next.svg' alt='Next.js logo' width={180} height={38} priority />
          <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
            <li className='mb-2'>
              Get started by editing{' '}
              <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold'>app/page.tsx</code>
              .
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className='flex gap-4 items-center flex-col sm:flex-row'></div> */}

          <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm'>
            <h1 className='text-4xl font-bold mb-8 text-center'>Test</h1>

            {!roomId && (
              <div className='flex gap-4 mb-8'>
                <button onClick={createRoom} className='px-4 py-2 bg-blue-500 text-white rounded-lg'>
                  방 만들기
                </button>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    placeholder='방 ID 입력'
                    className='px-4 py-2 border rounded-lg'
                  />
                  <button onClick={joinRoom} className='px-4 py-2 bg-green-500 text-white rounded-lg'>
                    참가하기
                  </button>
                </div>
              </div>
            )}

            {roomId && (
              <>
                <div className='mb-4 text-center'>
                  <div className='text-2xl font-bold'>{timeLeft}초</div>
                  <div className='text-lg'>입력한 단어 수: {wordCount}</div>
                </div>

                <div className='mb-8 p-4 border rounded-lg bg-gray-50 w-full max-w-2xl h-32 overflow-y-auto'>
                  <p className='text-lg whitespace-pre-wrap'>
                    {text.split('').map((char, index) => {
                      let className = '';
                      if (index < input.length) {
                        className = input[index] === char ? 'text-green-500' : 'text-red-500';
                      }
                      return (
                        <span key={index} className={className}>
                          {char}
                        </span>
                      );
                    })}
                  </p>
                </div>

                <div className='flex justify-center mb-8 w-full max-w-2xl'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={input}
                    onChange={handleInputChange}
                    className='w-full p-2 border rounded-lg'
                    placeholder='여기에 입력하세요...'
                  />
                </div>

                <div className='grid grid-cols-2 gap-8 text-lg'>
                  <div>
                    <h2 className='font-bold mb-2'>나의 통계</h2>
                    <div>타이핑 속도: {cpm}타/분</div>
                    <div>총 타이핑 속도: {wpm}타/분</div>
                    <div>정확도: {accuracy}%</div>
                  </div>
                  <div>
                    <h2 className='font-bold mb-2'>상대방 통계</h2>
                    <div>타이핑 속도: {opponentProgress.cpm}타/분</div>
                    <div>총 타이핑 속도: {opponentProgress.wpm}타/분</div>
                    <div>정확도: {opponentProgress.accuracy}%</div>
                  </div>
                </div>

                {/* 채팅 UI 추가 */}
                <div className='fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4'>
                  <div className='mb-4'>
                    <input
                      type='text'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder='사용자 이름'
                      className='w-full p-2 border rounded-lg mb-2'
                    />
                    <div className='h-48 overflow-y-auto mb-2 border rounded-lg p-2'>
                      {messages.map((msg, index) => (
                        <div key={index} className='mb-2'>
                          <span className='font-bold'>{msg.username}: </span>
                          <span>{msg.message}</span>
                          <span className='text-xs text-gray-500 ml-2'>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder='메시지를 입력하세요...'
                        className='flex-1 p-2 border rounded-lg'
                      />
                      <button onClick={sendMessage} className='px-4 py-2 bg-blue-500 text-white rounded-lg'>
                        전송
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>Footer</footer>
      </div>
    </>
  );
}
