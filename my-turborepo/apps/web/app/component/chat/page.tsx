import React from 'react';

const page = () => {
  return (
    <>
      {/* <div className='fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4'>
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
      </div> */}
    </>
  );
};

export default page;
