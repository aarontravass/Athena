import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { PatientFile } from '../../../schema/PatientFile.schema'
import { prisma } from '../../../prisma'

builder.queryField('fetchPatientFiles', (t) =>
  t.prismaField({
    type: [PatientFile],
    authScopes: {
      hasRole: UserRole.Patient
    },
    resolve: (query, root, args, ctx) =>
      prisma.patientFile.findMany({
        where: {
          userId: ctx.userId
        },
        ...query
      })
  })
)
