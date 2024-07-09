import { builder } from '../builder'

export const AuthToken = builder.prismaObject('AuthToken', {
  fields: (t) => ({
    authToken: t.exposeString('authToken'),
    refreshToken: t.exposeString('refreshToken')
  })
})
