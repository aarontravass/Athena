// User
import './resolvers/User/queries/fetchUser'
import './resolvers/User/queries/fetchPatients'
import './resolvers/User/mutations/addPatient'

// AuthToken
import './resolvers/AuthToken/mutations/createAuthToken'
import './resolvers/AuthToken/mutations/refreshAuthToken'
import './resolvers/AuthToken/mutations/deleteAuthToken'

// PatientFile
import './resolvers/PatientFile/mutations/uploadFile'
import './resolvers/PatientFile/queries/fetchPatientFileBlob'
import './resolvers/PatientFile/queries/fetchPatientFiles'

import { builder } from './builder'

export const schema = builder.toSchema()
