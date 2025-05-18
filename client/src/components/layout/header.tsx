import { Link } from "wouter";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm dark:bg-neutral-900 dark:border-b dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top duration-500">
          <span className="material-icons text-primary-500">eco</span>
          <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            NutriScan AI
          </h1>
          <span className="text-xs text-neutral-500">by Srija Punna</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
