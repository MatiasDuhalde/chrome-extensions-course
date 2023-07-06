import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  OpenWeatherData,
  OpenWeatherTemperatureUnit,
  fetchOpenWeatherData,
  getWeatherIconSrc,
} from '../../utils/api';
import './weather-card.css';

interface WeatherCardProps {
  city: string;
  onDelete?: () => void;
  temperatureUnit: OpenWeatherTemperatureUnit;
}

interface WeatherCardContainerProps {
  onDelete?: () => void;
}

const WeatherCardContainer: React.FC<PropsWithChildren<WeatherCardContainerProps>> = ({
  children,
  onDelete,
}) => {
  return (
    <Box mx={2} my={4}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {!!onDelete && (
            <Button variant="contained" color="secondary" onClick={onDelete}>
              <Typography className="weather-card-body">Delete</Typography>
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

enum WeatherCardState {
  Loading = 'loading',
  Error = 'error',
  Success = 'success',
}

export const WeatherCard = ({ city, onDelete, temperatureUnit }: WeatherCardProps) => {
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>(WeatherCardState.Loading);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchOpenWeatherData(city, temperatureUnit);
        setWeatherData(res);
        setCardState(WeatherCardState.Success);
      } catch (err) {
        console.log(err);
        setCardState(WeatherCardState.Error);
      }
    })();
  }, [city, temperatureUnit]);

  if (cardState === WeatherCardState.Loading || cardState === WeatherCardState.Error) {
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weather-card-title">{city}</Typography>
        <Typography className="weather-card-body">
          {cardState === WeatherCardState.Loading ? 'Loading...' : 'Error'}
        </Typography>
      </WeatherCardContainer>
    );
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container>
        <Grid item xs={6}>
          <Typography className="weather-card-title">{weatherData.name}</Typography>
          <Typography className="weather-card-temp">{Math.round(weatherData.main.temp)}</Typography>
          <Typography className="weather-card-body">
            Feels like: {Math.round(weatherData.main.feels_like)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {weatherData.weather.length > 0 && (
            <>
              <img src={getWeatherIconSrc(weatherData.weather[0].icon)} alt="weather icon" />
              <Typography className="weather-card-body">{weatherData.weather[0].main}</Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
  );
};
