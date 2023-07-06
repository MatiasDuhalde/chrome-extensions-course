import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalStorageOptions, getStoredOptions, setStoredOptions } from '../utils/storage';
import './options.css';

enum FormState {
  Loading = 'loading',
  Error = 'error',
  Ready = 'ready',
}

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions>(null);
  const [formState, setFormState] = useState<FormState>(FormState.Ready);

  useEffect(() => {
    (async () => {
      setOptions(await getStoredOptions());
    })();
  }, []);

  const handleHomeCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity,
    });
  };

  const handleHasOverlayToggle = (value: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay: value,
    });
  };

  const handleSaveButtonClick = useCallback(async () => {
    setFormState(FormState.Loading);
    await setStoredOptions(options);
    setTimeout(() => {
      setFormState(FormState.Ready);
    }, 1000);
  }, [options]);

  const isFieldsDisabled = formState === FormState.Loading;

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <Typography variant="h4" component="div">
                Weather Extension Options
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Home city"
                placeholder="Enter a home city"
                value={options?.homeCity ?? ''}
                onChange={(event) => handleHomeCityChange(event.target.value)}
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                Toggle auto overlay
              </Typography>
              <Switch
                checked={options?.hasAutoOverlay ?? false}
                onChange={(event) => handleHasOverlayToggle(event.target.checked)}
                value={options?.hasAutoOverlay ?? false}
                disabled={isFieldsDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveButtonClick}
                disabled={isFieldsDisabled}
              >
                {formState === FormState.Loading ? 'Saving...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
createRoot(root).render(<App />);
