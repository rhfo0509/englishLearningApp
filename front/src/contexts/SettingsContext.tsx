import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Settings {
  voiceSpeed: number;
  language: string;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({children}: {children: ReactNode}) => {
  const [settings, setSettings] = useState<Settings>({
    voiceSpeed: 1.0,
    language: 'en',
  });

  useEffect(() => {
    (async () => {
      try {
        const settingsJson = await AsyncStorage.getItem('settings');
        if (settingsJson) {
          setSettings(JSON.parse(settingsJson));
        }
      } catch (error) {
        console.error('Failed to load settings: ', error);
      }
    })();
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings: ', error);
    }
  };

  return (
    <SettingsContext.Provider value={{settings, setSettings: saveSettings}}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const settingsContext = useContext(SettingsContext);
  if (!settingsContext) {
    throw new Error('SettingsContext.Provider is not found.');
  }
  return settingsContext;
};
