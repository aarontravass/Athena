import { User } from '@athena/prisma'
import { createDecipheriv, randomUUID } from 'node:crypto'
import { generateUCAN } from './ucan'
import { FILE_ENCRYPTION_KEY } from './constants'

export const generateAuthAndRefreshTokens = async (user: User) => {
  const authToken = await generateUCAN(user)
  const refreshToken = randomUUID() as string
  return { authToken, refreshToken }
}

export const streamToBase64 = async (stream: NodeJS.ReadableStream) => {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return decryptBuffer(Buffer.concat(chunks)).toString('base64')
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

export const decryptBuffer = (encryptedBuffer: Buffer) => {
  const iv = encryptedBuffer.subarray(0, 16)
  encryptedBuffer = encryptedBuffer.subarray(16)
  const key = Buffer.from(FILE_ENCRYPTION_KEY!, 'hex')
  const decipher = createDecipheriv('aes-256-ctr', key, iv)
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
}
