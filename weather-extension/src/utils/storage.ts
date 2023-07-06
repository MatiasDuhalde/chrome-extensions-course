import { OpenWeatherTemperatureUnit } from './api';

export interface LocalStorage {
  cities?: string[];
  options?: LocalStorageOptions;
}

export interface LocalStorageOptions {
  hasAutoOverlay: boolean;
  homeCity: string;
  temperatureUnit: OpenWeatherTemperatureUnit;
}

export type LocalStorageKeys = keyof LocalStorage;

export function setStoredCities(cities: string[]): Promise<void> {
  const values: LocalStorage = {
    cities,
  };

  return new Promise((resolve) => {
    chrome.storage.local.set(values, resolve);
  });
}

export function getStoredCities(): Promise<string[]> {
  const keys: LocalStorageKeys[] = ['cities'];
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (values: LocalStorage) => {
      resolve(values.cities);
    });
  });
}

export function setStoredOptions(options: LocalStorageOptions): Promise<void> {
  const values: LocalStorage = {
    options,
  };

  return new Promise((resolve) => {
    chrome.storage.local.set(values, resolve);
  });
}

export function getStoredOptions(): Promise<LocalStorageOptions> {
  const keys: LocalStorageKeys[] = ['options'];
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (values: LocalStorage) => {
      resolve(values.options);
    });
  });
}
