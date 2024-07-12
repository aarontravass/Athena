import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'
import { removeFile } from '../../../filebase'

builder.mutationField('removeFile', (t) =>
  t.boolean({
    authScopes: {
      hasRole: UserRole.Doctor
    },
    args: {
      fileId: t.arg.id({ validate: { uuid: true } })
    },
    resolve: async (root, { fileId }, ctx) => {
      const patientFile = await prisma.patientFile.findFirst({
        where: {
          id: fileId
        }
      })
      if (!patientFile) throw new GraphQLError('File not found')
      const patient = await prisma.patientDoctor.findFirst({
        where: {
          doctorId: ctx.userId,
          patientId: patientFile.userId
        }
      })
      if (!patient) throw new GraphQLError('This patient is not part of your group')

      if (await removeFile({ patientFile })) {
        return prisma.patientFile
          .delete({
            where: {
              id: fileId
            }
          })
          .then(() => true)
          .catch(() => false)
      }

      return false
    }
  })
)
