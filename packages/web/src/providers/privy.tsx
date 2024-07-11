'use client'

import { PrivyProvider } from '@privy-io/react-auth'
// import { useRouter } from 'next/router'

export default function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  //   const router = useRouter()
  return (
    <PrivyProvider
      appId="clyc46ni909erd73r2x5o8xun"
      config={{
        appearance: {
          showWalletLoginFirst: false
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}
