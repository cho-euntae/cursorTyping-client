import { ChatRoom } from '../components/Chat/ChatRoom';

export default function ChatPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>채팅</h1>
      <ChatRoom />
    </div>
  );
}
