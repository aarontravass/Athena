import { UserRole } from '@medihacks/prisma'
import { builder } from '../builder'

export const UserRoleEnum = builder.enumType(UserRole, {
  name: 'UserRole'
})
