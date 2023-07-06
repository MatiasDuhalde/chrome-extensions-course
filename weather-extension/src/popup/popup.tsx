import '@fontsource/roboto';
import AddIcon from '@mui/icons-material/Add';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeatherCard } from '../components/weather-card';
import { OpenWeatherTemperatureUnit } from '../utils/api';
import { Messages } from '../utils/messages';
import {
  LocalStorageOptions,
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';
import './popup.css';

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>('');
  const [options, setOptions] = useState<LocalStorageOptions>(null);

  useEffect(() => {
    (async () => {
      setCities(await getStoredCities());
      setOptions(await getStoredOptions());
    })();
  }, []);

  const handleCityButtonClick = async () => {
    if (cityInput.length === 0 || cities.includes(cityInput)) {
      return;
    }
    const updatedCities = [...cities, cityInput];
    await setStoredCities(updatedCities);
    setCities(updatedCities);
    setCityInput('');
  };

  const handleCityDeleteButtonClick = (index: number) => async () => {
    const updatedCities = cities.filter((_, i) => i !== index);
    await setStoredCities(updatedCities);
    setCities(updatedCities);
  };

  const handleTemperatureUnitButtonClick = useCallback(async () => {
    const updatedOptions = {
      ...options,
      temperatureUnit:
        options?.temperatureUnit === OpenWeatherTemperatureUnit.Metric
          ? OpenWeatherTemperatureUnit.Imperial
          : OpenWeatherTemperatureUnit.Metric,
    };

    setOptions(updatedOptions);
    await setStoredOptions(updatedOptions);
  }, [options]);

  const handleOverlayButtonClick = useCallback(async () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      },
    );
  }, []);

  return (
    <Box mx={2} my={4}>
      <Grid container>
        <Grid item>
          <Paper>
            <Box px={3} py={1}>
              <InputBase
                placeholder="Add city"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={1}>
              <IconButton onClick={handleTemperatureUnitButtonClick}>
                {options?.temperatureUnit === OpenWeatherTemperatureUnit.Metric ? '°C' : '°F'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py={1}>
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {!!options?.homeCity && (
        <WeatherCard city={options.homeCity} temperatureUnit={options?.temperatureUnit} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          key={index}
          onDelete={handleCityDeleteButtonClick(index)}
          temperatureUnit={options?.temperatureUnit}
        />
      ))}
      <Box height={4} />
    </Box>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
createRoot(root).render(<App />);
