import { builder } from '../builder'
import { FileShareToken } from './FileShareToken.schema'

export const PatientFile = builder.prismaObject('PatientFile', {
  fields: (t) => ({
    id: t.exposeID('id'),
    ipfsCid: t.exposeString('ipfsCid'),
    fileName: t.exposeString('fileName'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    base64: t.string({ nullable: true, resolve: () => '' }),
    user: t.relation('user'),
    fileShareTokens: t.relation('fileShareTokens', { type: FileShareToken })
  })
})

export const FileWithBase64 = builder.objectRef<{ base64: string; fileName: string }>('FileWithBase64').implement({
  fields: (t) => ({
    base64: t.exposeString('base64'),
    fileName: t.exposeString('fileName')
  })
})
