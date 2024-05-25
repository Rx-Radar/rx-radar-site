// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-[#cccccc] py-5 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-bold">RxRadar</h1>
          </div>
          <div className="mb-4 md:mb-0">
            <p>Contact us at: <a href="mailto:rxradarcontact@gmail.com" className="text-blue-400">rxradarcontact@gmail.com</a></p>
            <p>Call us: <a href="tel:+12037674296" className="text-blue-400">+1 (203) 767-4296</a></p>
          </div>
          <div>
            <p>&copy; {currentYear} RxRadar. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
