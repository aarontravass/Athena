import { usePrivy } from '@privy-io/react-auth'

function LogoutButton() {
  const { ready, authenticated, logout } = usePrivy()
  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated)

  return (
    <button disabled={disableLogout} onClick={logout}>
      Log out
    </button>
  )
}
