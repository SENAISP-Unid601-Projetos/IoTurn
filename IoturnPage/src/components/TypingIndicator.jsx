import React from 'react';
import { Omega } from 'lucide-react';

const TypingIndicator = () => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xl flex-shrink-0">
      <Omega size={24} />
    </div>
    <div className="message-bubble p-3 px-5 rounded-lg bg-white border border-gray-200">
      <div className="typing-dots flex gap-1 items-center h-full">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-wave"></span>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
