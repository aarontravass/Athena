import { UserRole } from '@medihacks/prisma'
import { builder } from '../../../builder'
import { User } from '../../../schema/User.schema'
import { prisma } from '../../../prisma'

builder.queryField('fetchPatients', (t) =>
  t.prismaField({
    type: [User],
    authScopes: {
      hasRole: UserRole.Doctor
    },
    resolve: async (query, root, _, ctx) =>
      prisma.user.findMany({
        where: {
          role: UserRole.Patient,
          id: {
            in: (
              await prisma.patientDoctor.findMany({
                where: {
                  doctorId: ctx.userId
                }
              })
            ).map((patientDoctor) => patientDoctor.patientId)
          }
        }
      })
  })
)
