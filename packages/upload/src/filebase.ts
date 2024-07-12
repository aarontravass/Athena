import { S3 } from '@aws-sdk/client-s3'
import { FILEBASE_ACCESS_KEY_ID, FILEBASE_S3_URL, FILEBASE_SECRET_ACCESS_KEY } from './constants'
import { User } from '@medihacks/prisma'
import type { MultipartFile } from '@fastify/multipart'

const client = new S3({
  region: 'us-east-1',
  endpoint: FILEBASE_S3_URL,
  credentials: {
    secretAccessKey: FILEBASE_SECRET_ACCESS_KEY,
    accessKeyId: FILEBASE_ACCESS_KEY_ID
  }
})

export const uploadFile = async ({ file, user }: { file: MultipartFile; user: User }) => {
  await client.putObject({ Body: await file.toBuffer(), Key: file.filename, Bucket: user.id })
  const out = await headObject({ fileName: file.filename, bucketName: user.id })
  return out?.Metadata?.['cid']
}

export const headObject = ({ bucketName, fileName }: { bucketName: string; fileName: string }) =>
  client.headObject({ Key: fileName, Bucket: bucketName }).catch(() => null)
