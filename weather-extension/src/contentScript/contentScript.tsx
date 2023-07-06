import Card from '@mui/material/Card';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeatherCard } from '../components/weather-card';
import { Messages } from '../utils/messages';
import { LocalStorageOptions, getStoredOptions, setStoredOptions } from '../utils/storage';
import './contentScript.css';

type MessageListener = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => void;

const App: React.FC = () => {
  const [options, setOptions] = useState<LocalStorageOptions>(null);
  const currentListener = useRef<MessageListener>(null);

  useEffect(() => {
    (async () => {
      setOptions(await getStoredOptions());
    })();
  }, []);

  useEffect(() => {
    if (currentListener.current) {
      chrome.runtime.onMessage.removeListener(currentListener.current);
    }
    currentListener.current = (message: Messages) => {
      if (message === Messages.TOGGLE_OVERLAY) {
        setOptions({
          ...options,
          hasAutoOverlay: !options.hasAutoOverlay,
        });
      }
    };
    chrome.runtime.onMessage.addListener(currentListener.current);
  }, [options]);

  if (!options || !options.hasAutoOverlay || !options.homeCity) {
    return null;
  }

  const handleOnDelete = async () => {
    const updatedOptions = {
      ...options,
      hasAutoOverlay: false,
    };
    setOptions(updatedOptions);
    await setStoredOptions(updatedOptions);
  };

  return (
    <Card className="overlay-card">
      <WeatherCard
        city={options.homeCity}
        temperatureUnit={options.temperatureUnit}
        onDelete={handleOnDelete}
      />
    </Card>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
createRoot(root).render(<App />);
