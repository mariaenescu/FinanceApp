import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="content">
        <div className="inner">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
