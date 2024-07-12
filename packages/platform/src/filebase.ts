import { S3 } from '@aws-sdk/client-s3'
import { FILEBASE_ACCESS_KEY_ID, FILEBASE_S3_URL, FILEBASE_SECRET_ACCESS_KEY } from './constants'
import { PatientFile } from '@medihacks/prisma'
import { GraphQLError } from 'graphql'
import { streamToBase64 } from './utils'

const client = new S3({
  region: 'us-east-1',
  endpoint: FILEBASE_S3_URL,
  credentials: {
    secretAccessKey: FILEBASE_SECRET_ACCESS_KEY,
    accessKeyId: FILEBASE_ACCESS_KEY_ID
  }
})

export const createBucket = (bucketName: string) => client.createBucket({ Bucket: bucketName })

export const fetchFileAsBase64 = async (patientFile: PatientFile) => {
  const data = await client.getObject({ Bucket: patientFile.userId, Key: patientFile.fileName })
  if (!data.Body) throw new GraphQLError('File not found')
  return streamToBase64(data.Body as NodeJS.ReadableStream)
}

export const removeFile = async ({ patientFile }: { patientFile: PatientFile }) =>
  client
    .deleteObject({ Key: patientFile.userId, Bucket: patientFile.bucketName })
    .then(() => true)
    .catch(() => false)

export const headObject = ({ bucketName, fileName }: { bucketName: string; fileName: string }) =>
  client.headObject({ Key: fileName, Bucket: bucketName }).catch(() => null)
