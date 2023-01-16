import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { Provider } from 'react-supabase';
import { SWRConfig } from 'swr';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { SessionContext } from '../lib/context';
import { useAuthSession } from '../lib/hooks';
import Dashboard from '../components/dashboard/Dashboard';
import AuthCheck from '../components/AuthCheck';
import { createTheme, NextUIProvider, styled } from '@nextui-org/react';

const theme = createTheme({
  type: 'light', // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: '#FFC9CA',
      primaryLightHover: '#fea3a5',
      primaryLightActive: '#FFC9CA',
      primaryLightContrast: '#F67171',
      primary: '#FFC9CA',
      primaryBorder: '#fb6e71',
      primaryBorderHover: '#FF595C',
      primarySolidHover: '#FF595C',
      primarySolidContrast: '#F67171',
      primaryShadow: '#FF595C',

      secondaryLight: '#f6f7f8',
      secondaryLightHover: '#ebecee',
      secondaryLightActive: '#ebecee',
      secondary: '#f6f7f8',
      secondaryLightContrast: '#62656b',
    },
    space: {},
    fonts: {
      sans: 'Outfit',
      mono: 'Outfit',
      serif: 'Outfit',
    },
  },
});

const StyledApp = styled('div', {
  fontFamily: 'Outfit',
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
);

function MyApp({ Component, pageProps }) {
  const session = useAuthSession();
  return (
    <div className="h-screen">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SessionContext.Provider value={{ session }}>
        <Provider value={supabase}>
          <Dashboard>
            <SWRConfig
              value={{
                fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
              }}
            >
              <AuthCheck>
                <NextUIProvider theme={theme}>
                  <UserProvider supabaseClient={supabaseClient}>
                    <StyledApp>
                      <Component {...pageProps} />
                    </StyledApp>
                    <Toaster position="bottom-right" />
                  </UserProvider>
                </NextUIProvider>
              </AuthCheck>
            </SWRConfig>
          </Dashboard>
        </Provider>
      </SessionContext.Provider>
    </div>
  );
}

export default MyApp;
