import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'

builder.mutationField('revokeShareToken', (t) =>
  t.boolean({
    authScopes: {
      hasRole: UserRole.Patient
    },
    args: {
      tokenId: t.arg.id({ validate: { uuid: true } })
    },
    resolve: (root, { tokenId }, ctx) =>
      prisma.fileShareToken
        .delete({
          where: {
            id: tokenId,
            patientFile: {
              userId: ctx.userId
            }
          }
        })
        .then(() => true)
        .catch(() => false)
  })
)
