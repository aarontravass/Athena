import { UserRole } from '@athena/prisma'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { UPLOAD_URL } from '../../../constants'

builder.mutationField('generatePreSignedUploadUrl', (t) =>
  t.string({
    authScopes: {
      hasRole: UserRole.Doctor
    },
    args: {
      userId: t.arg.id({ validate: { uuid: true } })
    },
    resolve: (root, { userId }) =>
      prisma.preSignedUrl
        .create({
          data: {
            userId,
            expiresAt: new Date(new Date().setMinutes(new Date().getMinutes() + 10000))
          }
        })
        .then((result) => {
          const url = new URL(`${UPLOAD_URL}/upload`)
          url.searchParams.set('token', result.id)
          return url.toString()
        })
  })
)
