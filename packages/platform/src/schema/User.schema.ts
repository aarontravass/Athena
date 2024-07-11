import { builder } from '../builder'
import { PatientFile } from './PatientFile.schema'
import { PatientStorage } from './PatientStorage.schema'

export const User = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    patientFiles: t.relation('patientFiles', { nullable: true, type: PatientFile }),
    patientStorage: t.relation('patientStorage', { type: PatientStorage })
  })
})
