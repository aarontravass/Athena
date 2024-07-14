import { UserRole } from '@athena/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'

builder.mutationField('addPatient', (t) =>
  t.boolean({
    authScopes: {
      hasRole: UserRole.Doctor
    },
    args: {
      patientId: t.arg.id({ validate: { uuid: true } })
    },
    resolve: async (root, { patientId }, ctx) => {
      const patient = await prisma.user.findFirst({
        where: {
          id: patientId,
          role: UserRole.Patient
        }
      })
      if (!patient) throw new GraphQLError('Patient not found')

      await prisma.patientDoctor.create({
        data: {
          patientId,
          doctorId: ctx.userId
        }
      })
      return true
    }
  })
)
