import { GraphQLError } from 'graphql'
import { builder } from '../../../builder'
import { prisma } from '../../../prisma'
import { fetchFileAsBase64 } from '../../../filebase'

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

      return fetchFileAsBase64(shareToken.patientFile)
    }
  })
)
