import { CustomContext } from '../builder'
import { verifyAuthToken } from '../privy'
import { prisma } from '../prisma'
import { parseUCAN, verifyUCAN } from '../ucan'
import { UserRole } from '@athena/prisma'

export const fetchPrivyDidFromAuth = (authToken: string) =>
  verifyAuthToken(authToken)
    .then((payload) => payload.userId)
    .catch(() => null)

const verifyToken = async (token: string): Promise<Partial<CustomContext> | null> => {
  try {
    const res = await verifyUCAN({
      token,
      capability: {
        with: { scheme: 'fs', hierPart: `//filebase` },
        can: { namespace: 'filebase', segments: ['OPEN'] }
      }
    })
    if (!res) return null

    const parsedValue = parseUCAN(token)

    return { ...parsedValue.payload.fct?.[0], isPrivyAuth: false, authToken: token }
  } catch (error) {
    return null
  }
}

export const extractContext = async (headers: Headers): Promise<Partial<CustomContext>> => {
  try {
    const authToken = headers.get('authorization')?.replace('Bearer ', '') ?? ''
    const ctx = await verifyToken(authToken)
    if (ctx) return ctx
    const privyDid = await fetchPrivyDidFromAuth(authToken)
    if (!privyDid) return {}
    const user = await prisma.user.findFirst({
      where: {
        privyDid
      }
    })
    return { isPrivyAuth: true, authToken, userId: user?.id, privyDid }
  } catch (error) {
    return {}
  }
}

export const hasRole = ({ role, ctx }: { role: UserRole; ctx: CustomContext }) =>
  prisma.user
    .findUniqueOrThrow({
      where: {
        id: ctx.userId,
        role
      }
    })
    .then(() => true)
    .catch(() => false)
