import { useLogout, usePrivy } from '@privy-io/react-auth'

import React from 'react'

const LogoutPage = () => {
  const { ready, authenticated } = usePrivy()
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('Logout successful')
    }
  })
  const disableLogout = !ready || (ready && !authenticated)

  return (
    <button disabled={disableLogout} onClick={logout}>
      Log out
    </button>
  )
}

export default LogoutPage
