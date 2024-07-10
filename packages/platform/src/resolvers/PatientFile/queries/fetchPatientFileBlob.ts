import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'
import { fetchFileAsBase64 } from '../../../filebase'

builder.queryField('fetchPatientFileBlob', (t) =>
  t.string({
    args: {
      fileId: t.arg.id({ validate: { uuid: true } })
    },
    authScopes: {
      hasRole: UserRole.Patient
    },
    resolve: async (root, { fileId }, ctx) => {
      const patientFile = await prisma.patientFile.findFirst({
        where: {
          id: fileId,
          userId: ctx.userId
        }
      })
      if (!patientFile) throw new GraphQLError('Could not find file')

      return fetchFileAsBase64(patientFile)
    }
  })
)
