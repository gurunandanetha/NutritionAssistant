import { useEffect, useState } from 'react';

const VoiceIndicator = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    // Create animated dots effect
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      id="voice-indicator" 
      className="mb-4 py-3 px-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg flex items-center justify-center space-x-4 dark:from-secondary-900/20 dark:to-secondary-800/20 animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="flex space-x-1">
        {/* Voice wave animation */}
        <div className="flex items-center space-x-[2px]">
          <div className="w-1 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-3 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
          <div className="w-1 h-4 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-1 h-6 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-1 h-8 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          <div className="w-1 h-4 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '500ms' }}></div>
          <div className="w-1 h-3 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
          <div className="w-1 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '700ms' }}></div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-secondary-700 font-medium dark:text-secondary-300">
          Listening{dots}
        </span>
        <span className="text-xs text-secondary-500 dark:text-secondary-400">
          Say a food name clearly
        </span>
      </div>
    </div>
  );
};

export default VoiceIndicator;
