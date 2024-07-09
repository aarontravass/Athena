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

export const streamToBase64 = async (stream: NodeJS.ReadableStream) => {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('base64')
}
