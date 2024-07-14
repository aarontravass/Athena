import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { fetchFileAsBase64 } from '../../../filebase'
import jsonwebtoken from 'jsonwebtoken'
import { FILE_TOKEN_JWT_KEY } from '../../../constants'

builder.queryField('viewSharedFileBlob', (t) =>
  t.string({
    args: {
      token: t.arg.string()
    },
    resolve: async (root, { token }) => {
      const shareToken = await prisma.fileShareToken.findUnique({
        where: { token },
        include: {
          patientFile: true
        }
      })
      if (!shareToken) throw new GraphQLError('You do not have access to view this resource!')

      try {
        jsonwebtoken.verify(token, FILE_TOKEN_JWT_KEY!, {
          issuer: 'athena'
        })
        return fetchFileAsBase64(shareToken.patientFile)
      } catch (error) {
        throw new GraphQLError('This link has expired')
      }
    }
  })
)
