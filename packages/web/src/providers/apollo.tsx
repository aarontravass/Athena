'use client'

import client from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'
// import { useRouter } from 'next/router'

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  //   const router = useRouter()
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
