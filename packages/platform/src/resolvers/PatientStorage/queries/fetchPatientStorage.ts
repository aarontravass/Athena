import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { PatientStorage } from '../../../schema/PatientStorage.schema'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'

builder.queryField('fetchPatientStorage', (t) =>
  t.prismaField({
    type: PatientStorage,
    args: {
      patientId: t.arg.id({ validate: { uuid: true } })
    },
    authScopes: {
      hasRole: UserRole.Doctor
    },
    nullable: true,
    resolve: async (query, root, { patientId }, ctx) => {
      const patientDoctor = await prisma.patientDoctor.findFirst({
        where: {
          patientId,
          doctorId: ctx.userId
        }
      })
      if (!patientDoctor) throw new GraphQLError('You have to be the doctor of this patient to view this resource')

      return prisma.patientStorage.findFirst({
        where: {
          patientId
        }
      })
    }
  })
)
