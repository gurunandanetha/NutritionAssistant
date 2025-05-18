import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm dark:bg-neutral-900 dark:border-b dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-primary-500">eco</span>
          <h1 className="text-xl font-semibold">NutriScan AI</h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link href="/" className="font-medium hover:text-primary-600 transition">Home</Link></li>
            <li><a href="#" className="font-medium hover:text-primary-600 transition">About</a></li>
            <li><a href="#" className="font-medium hover:text-primary-600 transition">Help</a></li>
          </ul>
        </nav>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <span className="material-icons">menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="mt-8">
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/" 
                    className="block font-medium hover:text-primary-600 transition py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#" className="block font-medium hover:text-primary-600 transition py-2">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="block font-medium hover:text-primary-600 transition py-2">
                    Help
                  </a>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
