import { config as dotenvConfig } from 'dotenv'

dotenvConfig({ path: './.env.local' })

export const PORT = parseInt(process.env.PORT || '3000')
export const APP_ENV = process.env.APP_ENV
export const PRIVY_PUBLIC_KEY = process.env.PRIVY_PUBLIC_KEY
export const PRIVY_APP_ID = process.env.PRIVY_APP_ID
export const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET
export const FILEBASE_ACCESS_KEY_ID = process.env.FILEBASE_ACCESS_KEY_ID
export const FILEBASE_SECRET_ACCESS_KEY = process.env.FILEBASE_SECRET_ACCESS_KEY
export const FILEBASE_S3_URL = 'https://s3.filebase.com'
export const ORG_DID = process.env.ORG_DID
export const FILE_TOKEN_JWT_KEY = process.env.FILE_TOKEN_JWT_KEY
export const CLIENT_URL = process.env.CLIENT_URL
export const ED_SECRET_KEY = process.env.ED_SECRET_KEY
export const UPLOAD_URL = process.env.UPLOAD_URL
