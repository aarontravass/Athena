import { FILE_ENCRYPTION_KEY } from './constants'
import { prisma } from './prisma'
import { randomBytes, createCipheriv } from 'node:crypto'

export const isTokenValid = (token: string) =>
  prisma.preSignedUrl
    .findUniqueOrThrow({
      where: {
        id: token,
        expiresAt: {
          gte: new Date()
        }
      },
      include: {
        user: true
      }
    })
    .catch(() => null)

export const encryptBuffer = (buffer: Buffer) => {
  const key = Buffer.from(FILE_ENCRYPTION_KEY!, 'hex')
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-ctr', key, iv)
  return Buffer.concat([iv, cipher.update(buffer), cipher.final()])
}
