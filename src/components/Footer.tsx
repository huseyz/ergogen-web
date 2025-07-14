import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-1 px-4 text-center text-sm border-t border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <span>
            © {new Date().getFullYear()} Ergogen Web
          </span>
        </div>
        <div>
          <a 
            href="https://github.com/huseyz/ergogen-web" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            GitHub
          </a>
          <span className="mx-1">|</span>
          <a 
            href="https://docs.ergogen.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            Ergogen Docs
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
