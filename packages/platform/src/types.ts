import { UserRole } from '@medihacks/prisma'

export type JWTPayload = {
  userId: string
  role: UserRole
  privyDid: string
}
