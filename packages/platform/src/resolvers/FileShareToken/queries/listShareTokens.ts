import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { FileShareToken } from '../../../schema/FileShareToken.schema'
import { prisma } from '../../../prisma'

builder.queryField('listShareTokens', (t) =>
  t.prismaField({
    type: [FileShareToken],
    args: {
      fileId: t.arg.id({ validate: { uuid: true } })
    },
    authScopes: {
      hasRole: UserRole.Patient
    },
    resolve: (query, root, { fileId }, ctx) =>
      prisma.fileShareToken.findMany({
        where: {
          patientFileId: fileId,
          patientFile: {
            userId: ctx.userId
          }
        },
        ...query
      })
  })
)
