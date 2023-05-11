import '@/styles/globals.scss';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';
import { NextPage } from 'next';
import { initializeVioletjs } from '@violetio/violet-js';
import store from '@/redux/store';

const inter = Inter({ subsets: ['latin'] });

initializeVioletjs('/api');

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
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </main>
  );
}
