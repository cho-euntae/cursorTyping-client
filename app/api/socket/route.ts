import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

const ioHandler = (req: NextApiRequest, res: NextApiResponse & { socket: { server: any } }) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected');

      // 방 생성 이벤트
      socket.on('createRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`Room created: ${roomId}`);
      });

      // 방 참가 이벤트
      socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      // 채팅 메시지 이벤트
      socket.on('chatMessage', (data: { roomId: string; message: string; username: string }) => {
        console.log('Received chat message:', data); // 디버깅용 로그 추가
        io.to(data.roomId).emit('newMessage', {
          message: data.message,
          username: data.username,
          timestamp: new Date().toISOString(),
        });
      });

      // 타이핑 시작 이벤트
      socket.on('startTyping', (roomId: string) => {
        socket.to(roomId).emit('opponentStarted');
      });

      // 타이핑 진행 상황 이벤트
      socket.on(
        'typingProgress',
        (data: { roomId: string; progress: number; cpm: number; wpm: number; accuracy: number }) => {
          socket.to(data.roomId).emit('userProgress', {
            cpm: data.cpm,
            wpm: data.wpm,
            accuracy: data.accuracy,
          });
        },
      );

      // 연결 종료 이벤트
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
