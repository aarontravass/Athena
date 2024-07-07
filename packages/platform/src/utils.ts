import { User } from '@medihacks/prisma'
import jsonwebtoken from 'jsonwebtoken'
import { JWT_KEY } from './constants'
import { JWTPayload } from './types'
import { randomUUID } from 'crypto'

export const generateAuthAndRefreshTokens = (user: User) => {
  const authToken = jsonwebtoken.sign(
    {
      userId: user.id,
      role: user.role,
      privyDid: user.privyDid
    } as JWTPayload,
    JWT_KEY!,
    {
      algorithm: 'HS256',
      issuer: 'medihacks'
    }
  )
  const refreshToken = randomUUID() as string
  return { authToken, refreshToken }
}
