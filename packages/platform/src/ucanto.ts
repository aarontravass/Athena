import * as ucans from '@ucans/ucans'
import { ORG_DID } from './constants'
import { User } from '@medihacks/prisma'

export const generateUCAN = async (user: User) => {
  const keypair = await ucans.EdKeypair.create()
  const ucan = await ucans.build({
    audience: ORG_DID, // recipient DID
    issuer: keypair, // signing key
    capabilities: [
      // permissions for ucan
      {
        with: { scheme: 'wnfs', hierPart: '//boris.fission.name/public/photos/' },
        can: { namespace: 'wnfs', segments: ['OVERWRITE'] }
      },
      {
        with: { scheme: 'wnfs', hierPart: '//boris.fission.name/private/6m-mLXYuXi5m6vxgRTfJ7k_xzbmpk7LeD3qYt0TM1M0' },
        can: { namespace: 'wnfs', segments: ['APPEND'] }
      },
      {
        with: { scheme: 'mailto', hierPart: 'boris@fission.codes' },
        can: { namespace: 'msg', segments: ['SEND'] }
      }
    ],
    expiration: 60 * 60,
    facts: [
      {
        userId: user.id,
        role: user.role,
        privyDid: user.privyDid
      }
    ]
  })

  return ucans.encode(ucan)
}
