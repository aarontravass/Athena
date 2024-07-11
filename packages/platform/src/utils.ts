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

export const formatFileSize = (storageSpaceInBytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitsIndex = 0
  while (storageSpaceInBytes >= 1000.0) {
    storageSpaceInBytes /= 1000.0
    unitsIndex++
  }
  return storageSpaceInBytes.toFixed(2) + units[unitsIndex]
}
