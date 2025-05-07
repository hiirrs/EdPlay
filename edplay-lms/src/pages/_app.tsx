import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import '~/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Halaman yang tidak memerlukan autentikasi
const publicPages = ['/masuk', '/daftar'];

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Cek apakah halaman saat ini adalah halaman publik
  const isPublicPage = publicPages.includes(router.pathname);
  
  const { data: userData, isError } = trpc.auth.getSession.useQuery(undefined, {
    // Tidak perlu melakukan query jika di halaman publik
    enabled: typeof window !== 'undefined' && !isPublicPage,
    // Jangan retry jika mendapat error unauthorized (user belum login)
    retry: false,
  });
  
  useEffect(() => {
    // Fungsi untuk memeriksa autentikasi
    const checkAuth = () => {
      // Jika halaman saat ini adalah halaman publik, tidak perlu melakukan pengecekan token
      if (isPublicPage) {
        setLoading(false);
        return;
      }
      
      // Jika terjadi error pada query (unauthorized) atau userData undefined tapi bukan halaman publik
      if (isError || (userData === undefined && !isPublicPage)) {
        // Redirect ke halaman login
        router.push('/masuk');
      }
      
      // Set loading menjadi false
      setLoading(false);
    };
    
    checkAuth();
  }, [router, router.pathname, userData, isError, isPublicPage]);
  
  // Tampilkan loading saat memeriksa autentikasi
  if (loading && !isPublicPage) {
    return <div>Loading...</div>;
  }
  
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(
  <>
    <Component {...pageProps} />
    <Toaster position="top-right" />
  </>);
}) as AppType;

export default trpc.withTRPC(MyApp);