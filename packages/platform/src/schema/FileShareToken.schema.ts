import { builder } from '../builder'

export const FileShareToken = builder.prismaObject('FileShareToken', {
  fields: (t) => ({
    id: t.exposeID('id'),
    token: t.exposeString('token'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    patientFile: t.relation('patientFile')
  })
})
