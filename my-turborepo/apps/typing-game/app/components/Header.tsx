'use client';

import Link from 'next/link';

export function Header() {
  // TODO: 실제 인증 상태 관리 추가 필요
  const isLoggedIn = false;

  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
        {/* 로고 */}
        <Link href='/' className='text-2xl font-bold text-blue-600'>
          TypeMaster
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className='hidden md:flex items-center space-x-6'>
          <Link href='/practice' className='text-gray-600 hover:text-blue-600'>
            연습하기
          </Link>
          <Link href='/ranking' className='text-gray-600 hover:text-blue-600'>
            랭킹
          </Link>
          <Link href='/chat' className='text-gray-600 hover:text-blue-600'>
            채팅
          </Link>
          <Link href='/profile' className='text-gray-600 hover:text-blue-600'>
            프로필
          </Link>
        </nav>

        {/* 인증 버튼 */}
        <div className='flex items-center space-x-4'>
          {isLoggedIn ? (
            <button
              onClick={() => {
                /* TODO: 로그아웃 처리 */
              }}
              className='px-4 py-2 text-gray-600 hover:text-blue-600'>
              로그아웃
            </button>
          ) : (
            <>
              <Link href='/login' className='px-4 py-2 text-gray-600 hover:text-blue-600'>
                로그인
              </Link>
              <Link href='/signup' className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
