import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-8 mt-auto dark:bg-neutral-900 dark:border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-icons text-primary-500">eco</span>
              <span className="text-lg font-semibold">NutriScan AI</span>
            </div>
            <p className="text-neutral-600 mb-4 dark:text-neutral-400">
              Your personal AI nutrition assistant. Get instant information about any food's nutritional value and health implications.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/" className="hover:text-primary-600 transition">Home</Link></li>
              <li><a href="#" className="hover:text-primary-600 transition">About</a></li>
              <li><a href="#" className="hover:text-primary-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center">
                <span className="material-icons text-sm mr-2">email</span>
                <a href="mailto:info@nutriscanai.com" className="hover:text-primary-600 transition">info@nutriscanai.com</a>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-sm mr-2">language</span>
                <a href="#" className="hover:text-primary-600 transition">www.nutriscanai.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-neutral-500 text-sm dark:border-neutral-800 dark:text-neutral-500">
          <p>&copy; {new Date().getFullYear()} NutriScan AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
