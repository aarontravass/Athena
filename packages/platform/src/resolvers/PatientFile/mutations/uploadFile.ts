import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { PatientFile } from '../../../schema/PatientFile.schema'
import { createBucket, uploadFile } from '../../../filebase'
import { UserRole } from '@medihacks/prisma'

builder.mutationField('uploadFile', (t) =>
  t.prismaField({
    type: PatientFile,
    args: {
      file: t.arg({ type: 'File' }),
      userId: t.arg.id({ validate: { uuid: true } })
    },
    authScopes: {
      hasRole: UserRole.Doctor
    },
    resolve: async (query, root, { file, userId }) => {
      const user = await prisma.user.findFirst({
        where: {
          id: userId
        },
        include: {
          patientStorage: true
        }
      })
      if (!user) throw new GraphQLError('User not found')
      await createBucket(user.id)
      const cid = await uploadFile({ file, user })
      if (!cid) throw new GraphQLError('Could not upload file')
      return prisma.patientFile
        .create({
          data: {
            userId,
            ipfsCid: cid,
            bucketName: userId,
            fileName: file.name
          }
        })
        .then(async (patientFile) => {
          await prisma.patientStorage.update({
            data: {
              usedSpace: {
                increment: file.size
              }
            },
            where: {
              patientId: userId
            }
          })

          return patientFile
        })
    }
  })
)
