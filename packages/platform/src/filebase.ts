import { S3 } from '@aws-sdk/client-s3'
import { FILEBASE_ACCESS_KEY_ID, FILEBASE_S3_URL, FILEBASE_SECRET_ACCESS_KEY } from './constants'
import { PatientFile, User } from '@medihacks/prisma'
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

export const uploadFile = async ({ file, user }: { file: File; user: User }) => {
  await client.putObject({ Body: await file.text(), Key: file.name, Bucket: user.id })
  const out = await client.headObject({ Bucket: user.id, Key: file.name })
  return out.Metadata?.['cid']
}

export const fetchFileAsBase64 = async (patientFile: PatientFile) => {
  const data = await client.getObject({ Bucket: patientFile.userId, Key: patientFile.fileName })
  if (!data.Body) throw new GraphQLError('File not found')
  return streamToBase64(data.Body)
}

export const removeFile = async ({ patientFile }: { patientFile: PatientFile }) =>
  client
    .deleteObject({ Key: patientFile.userId, Bucket: patientFile.bucketName })
    .then(() => true)
    .catch(() => false)
