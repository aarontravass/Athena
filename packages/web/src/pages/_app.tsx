import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import PrivyProviders from './providers'
import './../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import client from './apollo-client'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <PrivyProviders>
        <Component {...pageProps} />
      </PrivyProviders>
    </ApolloProvider>
  )
}
