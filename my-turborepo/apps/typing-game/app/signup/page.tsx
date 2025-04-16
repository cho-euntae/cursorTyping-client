'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>회원가입</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                이메일
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='example@email.com'
              />
            </div>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                사용자 이름
              </label>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={formData.username}
                onChange={handleChange}
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='사용자 이름'
              />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                비밀번호
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='비밀번호'
              />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                비밀번호 확인
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className='mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                placeholder='비밀번호 확인'
              />
            </div>
          </div>

          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400'>
              {isLoading ? '처리중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
