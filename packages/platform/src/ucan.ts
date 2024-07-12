import * as ucans from '@ucans/ucans'
import { ORG_DID } from './constants'
import { User, UserRole } from '@medihacks/prisma'
import { prisma } from './prisma'

export const generateUCAN = async (user: User) => {
  const keypair = await ucans.EdKeypair.create()
  const ucan = await ucans.build({
    audience: ORG_DID,
    issuer: keypair,
    capabilities: [
      {
        with: { scheme: 'fs', hierPart: `//${user.id}` },
        can: { namespace: 'filebase', segments: ['OPEN', 'LIST'] }
      }
    ],
    expiration: new Date().setHours(new Date().getHours() + 1), // 1 hr
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

export const verifyUCAN = async (token: string) => {
  const result = await ucans.verify(token, {
    audience: ORG_DID,
    isRevoked: (ucan) =>
      prisma.authToken
        .findUniqueOrThrow({
          where: {
            authToken: token,
            user: {
              id: ucan.payload.fct?.[0].userId as string,
              role: ucan.payload.fct?.[0].role as UserRole,
              privyDid: ucan.payload.fct?.[0].privyDid as string
            }
          }
        })
        .then(() => false)
        .catch(() => true),
    requiredCapabilities: [
      {
        capability: {
          with: { scheme: 'mailto', hierPart: 'boris@fission.codes' },
          can: { namespace: 'msg', segments: ['SEND'] }
        },
        rootIssuer: ORG_DID
      }
    ]
  })
  return result.ok
}
