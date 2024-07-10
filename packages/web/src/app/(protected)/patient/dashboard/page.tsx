'use client'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

const PatientDashboard = () => {
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

export default PatientDashboard
