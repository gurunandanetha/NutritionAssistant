import { Link } from "wouter";
import { useTheme } from "@/components/ui/theme-provider";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure theme toggle only works client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm dark:bg-neutral-900 dark:border-b dark:border-neutral-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top duration-500">
          <span className="material-icons text-primary-500 animate-bounce">eco</span>
          <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            NutriScan AI
          </h1>
          <span className="text-xs text-neutral-500">by Srija Punna</span>
        </div>
        
        {mounted && (
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full transition-all duration-300 hover:scale-110"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-icons text-sm mr-1">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        )}
      </div>
      <div className="container mx-auto text-center">
        <p className="text-xs text-neutral-500">All rights reserved by Srija Punna | contact@srijapunna.com</p>
      </div>
    </header>
  );
};

export default Header;
