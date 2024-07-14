import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PrivyProviderWrapper from '@/providers/privy'
import ApolloProviderWrapper from '@/providers/apollo'
import StoreProvider from '@/providers/store'
import { AuthProvider } from '@/providers/auth'
import { APP_NAME_TITLE } from '@/helper/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: APP_NAME_TITLE,
  description: `Athena is the solution for today's 
  healthcare storage problems. 
  Built on top of IPFS, it ensures transparency and 
  easy data management for large amounts of patient data.`
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <StoreProvider>
            <AuthProvider>
              <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
            </AuthProvider>
          </StoreProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
