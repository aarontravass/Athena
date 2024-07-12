// User
import './resolvers/User/queries/fetchUser'
import './resolvers/User/queries/fetchPatients'
import './resolvers/User/mutations/addPatient'
import './resolvers/User/queries/fetchAllPatients'

// AuthToken
import './resolvers/AuthToken/mutations/createAuthToken'
import './resolvers/AuthToken/mutations/refreshAuthToken'
import './resolvers/AuthToken/mutations/deleteAuthToken'

// PatientFile
import './resolvers/PatientFile/queries/fetchPatientFileBlob'
import './resolvers/PatientFile/queries/fetchPatientFiles'
import './resolvers/PatientFile/queries/viewSharedFileBlob'

// PatientStorage
import './resolvers/PatientStorage/queries/fetchPatientStorage'

// FileShareToken
import './resolvers/FileShareToken/mutations/createShareToken'
import './resolvers/FileShareToken/mutations/revokeShareToken'
import './resolvers/FileShareToken/queries/listShareTokens'

// PreSignedUrl
import './resolvers/PreSignedUrl/mutations/generatePreSignedUploadUrl'

import { builder } from './builder'

export const schema = builder.toSchema()
