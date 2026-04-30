'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#263238',   // blueGrey[900]
      dark: '#37474f',   // blueGrey[800]
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: '"Noto Sans TC", sans-serif',
  },
});

export default theme;
