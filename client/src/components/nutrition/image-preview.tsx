import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  return (
    <div id="image-preview-container" className="mb-4 animate-in fade-in">
      <div className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <img 
          id="image-preview" 
          src={imageUrl} 
          alt="Food image preview" 
          className="w-full h-auto max-h-64 object-contain bg-neutral-50 dark:bg-neutral-900"
        />
        <Button
          type="button"
          id="remove-image"
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-100 h-8 w-8 dark:bg-neutral-800 dark:hover:bg-neutral-700"
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
