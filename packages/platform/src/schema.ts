// User
import './resolvers/User/queries/fetchUser'

// AuthToken
import './resolvers/AuthToken/mutations/createAuthToken'
import './resolvers/AuthToken/mutations/refreshAuthToken'

// PatientFile
import './resolvers/PatientFile/mutations/uploadFile'
import './resolvers/PatientFile/queries/fetchPatientFileBlob'
import './resolvers/PatientFile/queries/fetchPatientFiles'

import { builder } from './builder'

export const schema = builder.toSchema()
