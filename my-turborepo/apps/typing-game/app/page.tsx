import { TypingGame } from './components/TypingGame';

export default function Home() {
  return (
    <main className='h-[calc(100vh-64px)] bg-gray-100'>
      {/* 히어로 섹션 */}
      <section className='h-1/6 bg-white flex items-center'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>타이핑 실력을 향상시켜보세요</h1>
            <p className='text-xl text-gray-600'>다양한 연습 문장으로 타자 속도와 정확도를 높여보세요</p>
          </div>
        </div>
      </section>

      {/* 타이핑 게임 섹션 */}
      <section className='h-5/6 flex items-center'>
        <div className='w-full mx-auto px-4 flex justify-center'>
          <TypingGame />
        </div>
      </section>
    </main>
  );
}
