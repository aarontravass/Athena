import { builder } from '../builder'
import { FileShareToken } from './FileShareToken.schema'

export const PatientFile = builder.prismaObject('PatientFile', {
  fields: (t) => ({
    id: t.exposeID('id'),
    ipfsCid: t.exposeString('ipfsCid'),
    fileName: t.exposeString('fileName'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    user: t.relation('user'),
    fileShareTokens: t.relation('fileShareTokens', { type: FileShareToken })
  })
})
