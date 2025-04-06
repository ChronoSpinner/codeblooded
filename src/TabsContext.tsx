"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
};