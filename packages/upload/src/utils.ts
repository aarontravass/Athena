import { prisma } from './prisma'

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
