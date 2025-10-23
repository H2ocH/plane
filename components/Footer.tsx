import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-auto border-t">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Trip Planner. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
