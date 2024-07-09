import { usePrivy } from '@privy-io/react-auth'

import React from 'react'

const LogoutPage = () => {
  const { ready, authenticated, logout } = usePrivy()
  const disableLogout = !ready || (ready && !authenticated)

  return (
    <button disabled={disableLogout} onClick={logout}>
      Log out
    </button>
  )
}

export default LogoutPage
