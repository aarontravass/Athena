import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { AuthToken } from '../../../schema/AuthToken.schema'
import { generateAuthAndRefreshTokens } from '../../../utils'

builder.mutationField('refreshAuthToken', (t) =>
  t.prismaField({
    type: AuthToken,
    args: {
      refreshToken: t.arg.string()
    },
    resolve: async (query, root, { refreshToken }, ctx) => {
      const authToken = ctx.authToken
      const currentTokenRecord = await prisma.authToken.findFirst({
        where: {
          authToken,
          refreshToken
        },
        include: {
          user: true
        }
      })
      if (!currentTokenRecord) throw new GraphQLError('Refresh Token or Auth Token are invalid')
      return prisma.authToken.update({
        data: await generateAuthAndRefreshTokens(currentTokenRecord.user),
        where: {
          id: currentTokenRecord.id
        }
      })
    }
  })
)
