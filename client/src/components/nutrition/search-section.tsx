import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import VoiceIndicator from "./voice-indicator";
import ImagePreview from "./image-preview";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  uploadedImage: File | null;
  setUploadedImage: (file: File | null) => void;
  imagePreviewUrl: string | null;
  setImagePreviewUrl: (url: string | null) => void;
}

const SearchSection = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  uploadedImage,
  setUploadedImage,
  imagePreviewUrl,
  setImagePreviewUrl
}: SearchSectionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [bounceEffect, setBounceEffect] = useState(false);
  
  // Entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const { startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => {
      setSearchTerm(text);
      setIsListening(false);
      
      // Bounce button animation after voice recognition completes
      setBounceEffect(true);
      setTimeout(() => setBounceEffect(false), 1000);
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);
      setIsListening(false);
    }
  });

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
        
        // Bounce button animation after image upload
        setBounceEffect(true);
        setTimeout(() => setBounceEffect(false), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreviewUrl(null);
    
    // Reset the file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section 
      className={`max-w-3xl mx-auto mb-12 bg-white rounded-xl shadow-md p-6 dark:bg-neutral-800 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
      id="search-section"
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent transition-all duration-500">
        Find Food Information
      </h2>
      
      <div className="mb-6">
        {/* Text input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
            <span className="material-icons">search</span>
          </span>
          <input 
            type="text" 
            id="food-input" 
            placeholder="Enter a food name (e.g., apple, orange, watermelon, avocado)" 
            className="w-full pl-10 pr-24 py-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition bg-white dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {/* Voice input button */}
            <button 
              type="button" 
              id="voice-btn" 
              className={`p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-neutral-700 transition transform hover:scale-110 ${isListening ? 'text-secondary-500 animate-pulse' : 'text-neutral-600 hover:text-secondary-500'}`}
              title="Search with voice"
              onClick={handleVoiceClick}
            >
              <span className="material-icons">mic</span>
            </button>
            
            {/* Image upload button */}
            <label 
              htmlFor="image-upload" 
              className="p-2 text-neutral-600 hover:text-secondary-500 transition rounded-full hover:bg-secondary-50 dark:hover:bg-neutral-700 cursor-pointer transform hover:scale-110"
              title="Upload food image"
            >
              <span className="material-icons">image</span>
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Voice recording indicator */}
      {isListening && <VoiceIndicator />}
      
      {/* Image preview */}
      {imagePreviewUrl && (
        <ImagePreview 
          imageUrl={imagePreviewUrl} 
          onRemove={removeImage} 
        />
      )}
      
      {/* Analyze button */}
      <Button 
        type="button"
        id="analyze-btn"
        className={`w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-6 h-auto mt-4 text-lg shadow-lg transition-all transform ${bounceEffect ? 'animate-bounce' : 'hover:scale-105'}`}
        onClick={onSearch}
      >
        <span className="material-icons mr-2">analytics</span>
        Analyze Food
      </Button>
    </section>
  );
};

export default SearchSection;
