'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@/lib/theme';

import { QueryClientProvider } from './query-client-provider';

export const RootProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <QueryClientProvider>{children}</QueryClientProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
};
