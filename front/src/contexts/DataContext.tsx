import React, {createContext, useContext, useState, ReactNode} from 'react';

interface DataContextType {
  category: any[]; // Replace 'any' with specific type if known
  chapter: any[]; // Replace 'any' with specific type if known
  setCategory: (category: any[]) => void;
  setChapter: (chapter: any[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataContextProvider = ({children}: {children: ReactNode}) => {
  const [category, setCategory] = useState<any[]>([]);
  const [chapter, setChapter] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{category, chapter, setCategory, setChapter}}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('DataContext.Provider is not found');
  }
  return context;
};
