import React, { useState } from 'react';

const ChatMessage = ({ message, onFeedback }) => {
  const [rated, setRated] = useState(false);
  const [selection, setSelection] = useState(null);

  const handleFeedbackClick = (isLike) => {
    if (rated) return;
    setRated(true);
    setSelection(isLike ? 'like' : 'dislike');
    onFeedback(message.id, isLike);
  };

  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-[#4471a1] text-white flex items-center justify-center text-xl flex-shrink-0">
          <i className="fa-solid fa-robot"></i>
        </div>
      )}
      <div className="max-w-[75%] flex flex-col">
        <div
          className={`message-bubble p-3 px-5 rounded-2xl text-white ${
            isUser
              ? 'bg-[#415a77] rounded-br-md'
              : 'bg-[#415a77] rounded-bl-md'
          }`}
        >
          {message.text}
        </div>
        {!isUser && message.id && (
          <div className="feedback-icons mt-2 flex gap-3">
            <button
              onClick={() => handleFeedbackClick(true)}
              className={`transform transition-all duration-200 active:scale-90 ${selection === 'like' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
              disabled={rated}
            >
              <i className="fa-solid fa-thumbs-up"></i>
            </button>
            <button
              onClick={() => handleFeedbackClick(false)}
              className={`transform transition-all duration-200 active:scale-90 ${selection === 'dislike' ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
              disabled={rated}
            >
              <i className="fa-solid fa-thumbs-down"></i>
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-[#4471a1] text-white flex items-center justify-center text-xl flex-shrink-0">
          <i className="fa-solid fa-user"></i>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
