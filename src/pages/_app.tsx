import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../auth/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
