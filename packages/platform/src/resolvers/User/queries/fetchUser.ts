import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { User } from '../../../schema/User.schema'

builder.queryField('fetchUser', (t) =>
  t.prismaField({
    type: User,
    authScopes: {
      hasRole: UserRole.Patient
    },
    nullable: true,
    resolve: (query, root, args, ctx) =>
      prisma.user.findUnique({
        where: {
          id: ctx.userId
        },
        ...query
      })
  })
)
