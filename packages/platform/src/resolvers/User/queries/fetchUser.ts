import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { User } from '../../../schema/User.schema'

builder.queryField('fetchUser', (t) =>
  t.prismaField({
    type: User,
    authScopes: {
      userRequired: true
    },
    nullable: true,
    resolve: (query, info, args, ctx) =>
      prisma.user.findUnique({
        where: {
          id: ctx.userId
        },
        ...query
      })
  })
)
