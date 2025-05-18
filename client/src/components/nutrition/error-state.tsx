import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onTryAgain: () => void;
}

const ErrorState = ({ message, onTryAgain }: ErrorStateProps) => {
  return (
    <div id="error-container" className="max-w-3xl mx-auto py-12 text-center bg-white rounded-xl shadow-md dark:bg-neutral-800 animate-in fade-in">
      <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
      <h3 className="text-xl font-semibold mb-2 dark:text-white">Oops! Something went wrong</h3>
      <p className="text-neutral-600 mb-6 dark:text-neutral-300" id="error-message">{message}</p>
      <Button 
        type="button"
        id="try-again-btn"
        className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 h-auto"
        onClick={onTryAgain}
      >
        <span className="material-icons mr-2">refresh</span>
        <span>Try Again</span>
      </Button>
    </div>
  );
};

export default ErrorState;
