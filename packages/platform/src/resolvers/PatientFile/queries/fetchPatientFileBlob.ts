import { UserRole } from '@athena/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'
import { fetchFileAsBase64 } from '../../../filebase'
import { FileWithBase64 } from '../../../schema/PatientFile.schema'

builder.queryField('fetchPatientFileBlob', (t) =>
  t.field({
    args: {
      fileId: t.arg.id({ validate: { uuid: true } })
    },
    authScopes: {
      hasRole: UserRole.Patient
    },
    type: FileWithBase64,
    resolve: async (root, { fileId }, ctx) => {
      const patientFile = await prisma.patientFile.findFirst({
        where: {
          id: fileId,
          userId: ctx.userId
        }
      })
      if (!patientFile) throw new GraphQLError('Could not find file')
      return { ...patientFile, base64: await fetchFileAsBase64(patientFile) }
    }
  })
)
