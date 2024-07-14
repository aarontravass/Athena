import { UserRole } from '@athena/prisma'
import { builder } from '../builder'

export const UserRoleEnum = builder.enumType(UserRole, {
  name: 'UserRole'
})
