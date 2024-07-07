// User
import './resolvers/User/mutations/registerUser'
import './resolvers/User/queries/fetchUser'

// AuthToken
import './resolvers/AuthToken/mutations/createAuthToken'

import { builder } from './builder'

export const schema = builder.toSchema()
