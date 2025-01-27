import React from "react";

const AILoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-purple-500 rounded-full animate-ping"></div>
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-pink-500 rounded-full animate-bounce"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">AI</span>
        </div>
      </div>
    </div>
  );
};

export default AILoader;
