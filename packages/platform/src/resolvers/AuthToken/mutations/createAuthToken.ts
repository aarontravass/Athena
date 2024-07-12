import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { AuthToken } from '../../../schema/AuthToken.schema'
import { generateAuthAndRefreshTokens } from '../../../utils'
import { getUserFromPrivy } from '../../../privy'
import { createBucket } from '../../../filebase'
import { UserRoleEnum } from '../../../schema/UserRole.enum'

builder.mutationField('createAuthToken', (t) =>
  t.prismaField({
    type: AuthToken,
    authScopes: {
      newUser: true
    },
    args: {
      role: t.arg({ type: UserRoleEnum })
    },
    resolve: async (query, root, { role }, ctx) => {
      let user = await prisma.user.findFirst({
        where: {
          privyDid: ctx.privyDid
        }
      })
      if (!user) {
        const userData = await getUserFromPrivy(ctx.privyDid)
        if (!userData.email) throw new GraphQLError('Could not find email')
        user = await prisma.user.create({
          data: {
            privyDid: ctx.privyDid,
            name: userData.name,
            role,
            email: userData.email
          }
        })
        await createBucket(user.id)
        await prisma.patientStorage.create({
          data: {
            patientId: user.id,
            maxSpace: 500 * 1000 * 1000, // 500 MB
            usedSpace: 0
          }
        })
      }
      const { authToken, refreshToken } = await generateAuthAndRefreshTokens(user)

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
