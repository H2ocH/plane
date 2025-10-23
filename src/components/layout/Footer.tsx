import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t mt-auto bg-background">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AI Trip Planner. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
