const VoiceIndicator = () => {
  return (
    <div id="voice-indicator" className="mb-4 p-3 bg-secondary-50 rounded-lg flex items-center justify-center space-x-2 dark:bg-secondary-900/20 animate-in fade-in">
      <span className="w-3 h-3 bg-secondary-500 rounded-full pulse"></span>
      <span className="text-secondary-700 font-medium dark:text-secondary-300">Listening... Speak now</span>
    </div>
  );
};

export default VoiceIndicator;
