import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { getUserFromPrivy } from '../../../privy'
import { User } from '../../../schema/User.schema'
import { prisma } from '../../../prisma'
import { UserRole } from '@medihacks/prisma'
import { PrismaClientKnownRequestError } from '@medihacks/prisma/dist/runtime/library'

builder.mutationField('registerUser', (t) =>
  t.prismaField({
    type: User,
    resolve: async (query, info, arg, ctx) => {
      const userData = await getUserFromPrivy(ctx.privyDid)
      if (!userData.email) throw new GraphQLError('Could not find email')

      return prisma.user
        .create({
          data: {
            privyDid: ctx.privyDid,
            name: userData.name,
            role: UserRole.Patient,
            email: userData.email
          },
          ...query
        })
        .catch((error: PrismaClientKnownRequestError) => {
          if (error.code == 'P2002') throw new GraphQLError('User already exists')
          throw new GraphQLError(error.message)
        })
    }
  })
)
