'use client';
import { arEG, enUS } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700']
});

const theme = createTheme(
  {
    colorSchemes: { dark: true, light: true },
    components: {
      MuiAlert: {
        styleOverrides: {
          root: {
            variants: [
              {
                props: { severity: 'info' },
                style: {
                  backgroundColor: '#60a5fa'
                }
              }
            ]
          }
        }
      }
    },
    cssVariables: {
      colorSchemeSelector: 'class'
    },
    typography: {
      fontFamily: sourceSans3.style.fontFamily
    }
  },
  enUS,
  arEG
);

export default theme;
