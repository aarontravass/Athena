import { User } from '@medihacks/prisma'
import { randomUUID } from 'crypto'
import { generateUCAN } from './ucan'

export const generateAuthAndRefreshTokens = async (user: User) => {
  const authToken = await generateUCAN(user)
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
