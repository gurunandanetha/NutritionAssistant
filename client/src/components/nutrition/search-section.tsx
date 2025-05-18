import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  
  const { startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => {
      setSearchTerm(text);
      setIsListening(false);
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
    <section className="max-w-3xl mx-auto mb-12 bg-white rounded-xl shadow-md p-6 dark:bg-neutral-800 animate-in fade-in" id="search-section">
      <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
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
            placeholder="Enter a food name (e.g., apple, chicken, quinoa)" 
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
              className={`p-2 rounded-full hover:bg-secondary-50 dark:hover:bg-neutral-700 transition ${isListening ? 'text-secondary-500' : 'text-neutral-600 hover:text-secondary-500'}`}
              title="Search with voice"
              onClick={handleVoiceClick}
            >
              <span className="material-icons">mic</span>
            </button>
            
            {/* Image upload button */}
            <label 
              htmlFor="image-upload" 
              className="p-2 text-neutral-600 hover:text-secondary-500 transition rounded-full hover:bg-secondary-50 dark:hover:bg-neutral-700 cursor-pointer"
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
      
      {/* Submit button */}
      <Button 
        type="button"
        id="search-btn"
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-6 h-auto"
        onClick={onSearch}
      >
        Get Nutrition Information
      </Button>
    </section>
  );
};

export default SearchSection;
