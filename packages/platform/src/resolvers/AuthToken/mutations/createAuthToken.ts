import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { AuthToken } from '../../../schema/AuthToken.schema'
import { generateAuthAndRefreshTokens } from '../../../utils'

builder.mutationField('createAuthToken', (t) =>
  t.prismaField({
    type: AuthToken,
    authScopes: {
      newUser: true
    },
    resolve: async (query, root, _, ctx) => {
      const user = await prisma.user.findFirst({
        where: {
          privyDid: ctx.privyDid
        }
      })
      if (!user) throw new GraphQLError('User not found')
      const { authToken, refreshToken } = generateAuthAndRefreshTokens(user)

      return prisma.authToken.create({
        data: {
          authToken,
          refreshToken,
          userId: user.id
        },
        ...query
      })
    }
  })
)
