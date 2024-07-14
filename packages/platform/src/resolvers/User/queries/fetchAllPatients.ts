import { UserRole } from '@athena/prisma'
import { builder } from '../../../builder'
import { User } from '../../../schema/User.schema'
import { prisma } from '../../../prisma'

builder.queryField('fetchAllPatients', (t) =>
  t.prismaField({
    type: [User],
    authScopes: {
      hasRole: UserRole.Doctor
    },
    resolve: (query) =>
      prisma.user.findMany({
        where: {
          role: UserRole.Patient
        },
        ...query
      })
  })
)
