import { UserRole } from '@athena/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { GraphQLError } from 'graphql'
import jsonwebtoken from 'jsonwebtoken'
import { FILE_TOKEN_JWT_KEY, CLIENT_URL } from '../../../constants'

builder.mutationField('createShareToken', (t) =>
  t.string({
    args: {
      fileId: t.arg.id({ validate: { uuid: true } }),
      ttl: t.arg.int({ validate: { max: 60 * 60 * 60, min: 60 * 30 } })
    },
    authScopes: {
      hasRole: UserRole.Patient
    },
    resolve: async (root, { fileId, ttl }, ctx) => {
      const file = await prisma.patientFile.findUnique({
        where: {
          id: fileId,
          userId: ctx.userId
        }
      })
      if (!file) throw new GraphQLError('File not found')
      const token = jsonwebtoken.sign(
        {
          fileId,
          userId: ctx.userId
        },
        FILE_TOKEN_JWT_KEY!,
        {
          issuer: 'athena',
          expiresIn: ttl
        }
      )
      await prisma.fileShareToken.create({
        data: {
          token,
          patientFileId: fileId
        }
      })
      const url = new URL(`${CLIENT_URL}/patientFile/view`)
      url.searchParams.set('token', token)
      return url.toString()
    }
  })
)
