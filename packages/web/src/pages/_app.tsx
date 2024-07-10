import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import PrivyProviders from '../providers/privy'
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import StoreProvider from '@/providers/store'
import { AuthProvider } from '@/providers/auth'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(
    <ApolloProvider client={client}>
      <PrivyProviders>
        <StoreProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </StoreProvider>
      </PrivyProviders>
    </ApolloProvider>
  )
}
