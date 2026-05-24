import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© 2025 HealthyYou. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Terms of Service</a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;