import React from 'react';
import Navbar from './Navbar';
import { View } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <View className="app-shell">
      <Navbar />
      <View className="content">
        <View className="inner">
          {children}
        </View>
      </View>
    </View>
  );
}