import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown,
  Omega
} from 'lucide-react';

const ChatMessage = ({ message, onFeedback }) => {
  const [rated, setRated] = useState(false);
  const [selection, setSelection] = useState(null);

  const handleFeedbackClick = (isLike) => {
    setRated(true);
    setSelection(isLike ? 'like' : 'dislike');
    onFeedback(message.id, isLike);
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
          <Omega size={24} />
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col rounded-lg ${
            isUser
              ? 'bg-slate-100'
              : 'bg-white border border-gray-200'
          }`}>
        <div
          className={`message-bubble p-3 px-4 text-gray-800`}
        >
          {message.text}
        </div>
        
        {!isUser && message.id && (
          <>
            <hr className='w-[95%] mx-auto border-gray-200' />
            <div className="p-2 px-4 feedback-icons flex gap-3">
              <button
                onClick={() => handleFeedbackClick(true)}
                className={`transform transition-all duration-200 active:scale-90 ${selection === 'like' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                disabled={rated}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleFeedbackClick(false)}
                className={`transform transition-all duration-200 active:scale-90 ${selection === 'dislike' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                disabled={rated}
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
