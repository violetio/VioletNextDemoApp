import '@/styles/globals.scss';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';
import { NextPage } from 'next';
import store from '@/redux/store';
import AppHeader from '@/components/AppHeader/AppHeader';

const inter = Inter({ subsets: ['latin'] });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <main className={inter.className}>
      <Provider store={store}>
        <AppHeader />
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </main>
  );
}
