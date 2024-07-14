import * as ucans from '@ucans/ucans'
import { ED_SECRET_KEY, ORG_DID } from './constants'
import { User, UserRole } from '@athena/prisma'
import { prisma } from './prisma'
import { CustomContext } from './builder'

const keypair = ucans.EdKeypair.fromSecretKey(ED_SECRET_KEY!)

export const generateUCAN = async (user: User) => {
  const ucan = await ucans.build({
    audience: ORG_DID!,
    issuer: keypair,
    capabilities: [
      {
        with: { scheme: 'fs', hierPart: `//filebase` },
        can: { namespace: 'filebase', segments: ['OPEN'] }
      },
      {
        with: { scheme: 'fs', hierPart: `//filebase` },
        can: { namespace: 'filebase', segments: ['LIST'] }
      }
    ],
    expiration: new Date().setHours(new Date().getHours() + 1), // 1 hr
    facts: [
      {
        userId: user.id,
        role: user.role,
        privyDid: user.privyDid
      } as Partial<CustomContext>
    ]
  })

  return ucans.encode(ucan)
}

export const verifyUCAN = async ({ token, capability }: { token: string; capability: ucans.capability.Capability }) => {
  const result = await ucans.verify(token, {
    audience: ORG_DID!,
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
        capability,
        rootIssuer: keypair.did()
      }
    ]
  })
  return result.ok
}

export const parseUCAN = (token: string) => ucans.parse(token)
