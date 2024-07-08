import { PRIVY_APP_ID, PRIVY_APP_SECRET } from './constants'
import { PrivyClient } from '@privy-io/server-auth'

const privy = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!)

export const getUserFromPrivy = async (privyDid: string) => {
  const data: { email?: string; name?: string } = {}
  const user = await privy.getUser(privyDid).catch(() => null)
  if (!user) return data

  let email: string | undefined, name: string | undefined
  for (const linkedAccount of user.linkedAccounts) {
    ;(email = undefined), (name = undefined)
    if (linkedAccount.type == 'email') email = linkedAccount.address
    else {
      switch (linkedAccount.type) {
        case 'apple_oauth':
          email = linkedAccount.email

          break
        case 'google_oauth':
          email = linkedAccount.email

          break
        case 'github_oauth':
          email = linkedAccount.email as string
          name = linkedAccount.name as string
          break
      }
    }
    if (email) data.email = email
    if (name) data.name = name
  }
  return data
}

export const verifyAuthToken = (authToken: string) => privy.verifyAuthToken(authToken)
