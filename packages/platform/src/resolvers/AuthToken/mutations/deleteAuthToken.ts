import { builder } from '../../../builder'
import { prisma } from '../../../prisma'

builder.mutationField('deleteAuthToken', (t) =>
  t.boolean({
    authScopes: {
      userRequired: true
    },
    args: {
      refreshToken: t.arg.string()
    },
    resolve: (root, { refreshToken }, ctx) =>
      prisma.authToken
        .delete({
          where: {
            authToken: ctx.authToken,
            refreshToken
          }
        })
        .then(() => true)
        .catch(() => false)
  })
)
