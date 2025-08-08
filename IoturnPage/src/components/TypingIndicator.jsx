import React from 'react';

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-10 h-10 rounded-full bg-[#4471a1] text-white flex items-center justify-center text-xl flex-shrink-0">
      <i className="fa-solid fa-robot"></i>
    </div>
    <div className="message-bubble p-3 px-5 rounded-2xl bg-[#415a77]">
      <div className="typing-dots flex gap-1 items-center h-full">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
