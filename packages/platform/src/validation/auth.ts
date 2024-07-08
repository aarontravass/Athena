import { CustomContext } from '../builder'
import { verifyAuthToken } from '../privy'
import jsonwebtoken from 'jsonwebtoken'
import { JWT_KEY } from '../constants'
import { JWTPayload } from '../types'
import { prisma } from '../prisma'

export const fetchPrivyDidFromAuth = (authToken: string) =>
  verifyAuthToken(authToken)
    .then((payload) => payload.userId)
    .catch(() => null)

export const userRequired = () => {
  return true
}

export const newUser = () => {
  return true
}

const verifyToken = async (authToken: string): Promise<Partial<CustomContext> | null> => {
  try {
    const payload = jsonwebtoken.verify(authToken, JWT_KEY!, {
      algorithms: ['HS256'],
      issuer: 'medihacks'
    }) as JWTPayload
    return { ...payload, isPrivyAuth: false, authToken }
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
