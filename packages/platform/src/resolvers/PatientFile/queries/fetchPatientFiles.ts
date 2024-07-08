import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { PatientFile } from '../../../schema/PatientFile.schema'
import { prisma } from '../../../prisma'

builder.queryField('fetchPatientFiles', (t) =>
  t.prismaField({
    type: [PatientFile],
    authScopes: {
      userRequired: UserRole.Patient
    },
    resolve: (query, info, args, ctx) =>
      prisma.patientFile.findMany({
        where: {
          userId: ctx.userId
        },
        ...query
      })
  })
)