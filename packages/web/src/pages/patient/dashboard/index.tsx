import { useRouter } from 'next/router'

import { usePrivy } from '@privy-io/react-auth'
import DashboardLayout from '@/components/layouts/dashboard'
import { ReactElement, ReactNode } from 'react'
import { NextPageWithLayout } from '@/pages/_app'
import { AuthProvider } from '@/providers/auth'
import StoreProvider from '@/providers/store'

const PatientDashboard: NextPageWithLayout = () => {
  const { ready, authenticated, user } = usePrivy()
  console.log(user)
  const router = useRouter()

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <></>
  }

  if (ready && !authenticated) {
    // Replace this code with however you'd like to handle an unauthenticated user
    // As an example, you might redirect them to a login page
    router.push('/login')
  }

  if (ready && authenticated) {
    // Replace this code with however you'd like to handle an authenticated user
    return <p>User {user?.email?.address} is logged in.</p>
  }
}

PatientDashboard.getLayout = function getLayout(children: ReactElement) {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default PatientDashboard
