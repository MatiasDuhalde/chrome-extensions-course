import { OpenWeatherTemperatureUnit, fetchOpenWeatherData } from '../utils/api';
import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities(['London', 'New York', 'Berlin']);
  setStoredOptions({
    homeCity: '',
    temperatureUnit: OpenWeatherTemperatureUnit.Metric,
    hasAutoOverlay: false,
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: 'Add %s to the list',
    id: 'weather-extension',
  });

  chrome.alarms.create({
    periodInMinutes: 60,
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, info.selectionText]);
  });
});

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    if (options.homeCity) {
      fetchOpenWeatherData(options.homeCity, options.temperatureUnit).then((data) => {
        chrome.action.setBadgeText({
          text: Math.round(data.main.temp).toString(),
        });
      });
    }
  });
});
