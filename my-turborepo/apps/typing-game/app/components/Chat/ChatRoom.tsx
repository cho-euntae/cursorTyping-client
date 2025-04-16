'use client';

import { useState, useRef, useEffect } from 'react';
import { default as io } from 'socket.io-client';

interface Message {
  message: string;
  username: string;
  timestamp: string;
}

interface ChatMessage {
  roomId: string;
  message: string;
  username: string;
}

export function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('사용자' + Math.floor(Math.random() * 1000));
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roomId = 'public'; // 기본 공개 채팅방

  // 소켓 연결
  useEffect(() => {
    socketRef.current = io('http://localhost:4000');

    // 방 참여
    socketRef.current.emit('joinRoom', roomId);

    // 새 메시지 수신
    socketRef.current.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || !inputText.trim()) return;

    const chatMessage: ChatMessage = {
      roomId,
      message: inputText,
      username,
    };

    socketRef.current.emit('chatMessage', chatMessage);
    setInputText('');
  };

  return (
    <div className='flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-lg shadow-md'>
      {/* 채팅방 정보 */}
      <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold'>공개 채팅방</h2>
        <p className='text-sm text-gray-500'>접속자: {username}</p>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}>
            <div className='flex flex-col max-w-[70%] space-y-1'>
              {message.username !== username && <span className='text-sm text-gray-500'>{message.username}</span>}
              <div
                className={`rounded-lg p-3 ${
                  message.username === username ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                <p>{message.message}</p>
                <p className='text-xs mt-1 opacity-70'>{new Date(message.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className='border-t p-4'>
        <div className='flex space-x-2'>
          <input
            type='text'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder='메시지를 입력하세요...'
            className='flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500'
          />
          <button
            onClick={sendMessage}
            className='px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
