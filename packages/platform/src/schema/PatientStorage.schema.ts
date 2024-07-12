import { builder } from '../builder'
import { formatFileSize } from '../utils'

export const PatientStorage = builder.prismaObject('PatientStorage', {
  fields: (t) => ({
    maxSpace: t.exposeFloat('maxSpace'),
    usedSpace: t.exposeFloat('usedSpace'),
    patient: t.relation('patient'),
    formattedUsedSpace: t.string({
      resolve: (root) => formatFileSize(root.usedSpace)
    }),
    formattedMaxSpace: t.string({
      resolve: (root) => formatFileSize(root.maxSpace)
    })
  })
})
