import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [dots, setDots] = useState('');
  const [recognizedElements, setRecognizedElements] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate image recognition with animations
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      
      // Sample food elements to "detect" - this is just for UI animation
      // The actual detection happens on the server
      setRecognizedElements(['Fruit', 'Food', 'Fresh', 'Healthy']);
    }, 1500);
    
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => {
      clearTimeout(timer);
      clearInterval(dotsInterval);
    };
  }, []);
  
  return (
    <div id="image-preview-container" className="mb-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-md">
        <div className="relative">
          <img 
            id="image-preview" 
            src={imageUrl} 
            alt="Food image preview" 
            className={`w-full h-auto max-h-64 object-contain bg-neutral-50 dark:bg-neutral-900 transition-all duration-300 ${isAnalyzing ? 'filter blur-[1px]' : ''}`}
          />
          
          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
              <div className="flex flex-col items-center">
                <span className="material-icons animate-spin mb-2">image_search</span>
                <p className="text-sm font-medium">Analyzing image{dots}</p>
                <p className="text-xs mt-1">Identifying food items</p>
              </div>
            </div>
          )}
          
          {!isAnalyzing && recognizedElements.length > 0 && (
            <div className="absolute top-0 left-0 m-2">
              <div className="flex flex-wrap gap-1">
                {recognizedElements.map((element, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-500/80 text-white text-xs px-2 py-1 rounded-full animate-in fade-in duration-300"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {!isAnalyzing && (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center">
              <span className="material-icons text-green-500 mr-1 text-sm">check_circle</span>
              Image ready for analysis
            </p>
          </div>
        )}
        
        <Button
          type="button"
          id="remove-image"
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-100 h-8 w-8 dark:bg-neutral-800 dark:hover:bg-neutral-700 transform transition-transform hover:rotate-90"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <span className="material-icons text-neutral-500">close</span>
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
