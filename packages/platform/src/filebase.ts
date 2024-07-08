import { S3 } from '@aws-sdk/client-s3'
import { FILEBASE_ACCESS_KEY_ID, FILEBASE_SECRET_ACCESS_KEY } from './constants'

const client = new S3({
  region: 'us-east-1',
  secretAccessKey: FILEBASE_SECRET_ACCESS_KEY,
  accessKeyId: FILEBASE_ACCESS_KEY_ID
})

export const createBucket = (bucketName: string) => client.createBucket({ Bucket: bucketName })
