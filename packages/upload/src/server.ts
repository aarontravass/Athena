import Fastify from 'fastify'
import { PORT } from './constants'
import FastifyMultipart from '@fastify/multipart'
import { isTokenValid } from './utils'
import { uploadFile } from './filebase'
import { prisma } from './prisma'

const fastify = Fastify({
  logger: true
})
fastify.register(FastifyMultipart)

// Declare a route
fastify.get('/', (req, res) => {
  return res.status(200)
})

fastify.post('/upload', async (req, res) => {
  const token = (req.query as Record<string, string>).token
  const record = await isTokenValid(token)
  if (!record) return res.status(400).send({ message: 'Token is invalid or expired', success: false })
  const file = await req.file()

  if (!file) return res.status(400).send({ message: 'File not uploaded. Please try again.', success: false })

  const cid = await uploadFile({ file, user: record.user })
  if (!cid) return res.status(500).send({ message: 'Could not upload file', success: false })
  await prisma.patientFile.create({
    data: {
      ipfsCid: cid,
      userId: record.userId,
      fileName: file.filename,
      bucketName: record.userId
    }
  })
  await prisma.preSignedUrl.delete({
    where: {
      id: token
    }
  })
  return res.status(200).send({ success: true })
})

// Run the server!
fastify.listen({ port: PORT }, (err) => {
  if (err) throw err
  console.log(`server listening on ${PORT}`)
})
