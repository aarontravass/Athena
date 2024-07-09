import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { getUserFromPrivy } from '../../../privy'
import { User } from '../../../schema/User.schema'
import { prisma } from '../../../prisma'
import { PrismaClientKnownRequestError } from '@medihacks/prisma/dist/runtime/library'
import { createBucket } from '../../../filebase'
import { UserRoleEnum } from '../../../schema/UserRole.enum'

builder.mutationField('registerUser', (t) =>
  t.prismaField({
    type: User,
    args: {
      role: t.arg({ type: UserRoleEnum })
    },
    resolve: async (query, root, { role }, ctx) => {
      const userData = await getUserFromPrivy(ctx.privyDid)
      if (!userData.email) throw new GraphQLError('Could not find email')

      return prisma.user
        .create({
          data: {
            privyDid: ctx.privyDid,
            name: userData.name,
            role,
            email: userData.email
          },
          ...query
        })
        .then(async (user) => {
          await createBucket(user.id)
          return user
        })
        .catch((error: PrismaClientKnownRequestError) => {
          if (error.code == 'P2002') throw new GraphQLError('User already exists')
          throw new GraphQLError(error.message)
        })
    }
  })
)
