import Fastify from 'fastify'
import { PORT } from './constants'
import FastifyMultipart from '@fastify/multipart'
import { isTokenValid } from './utils'
import { uploadFile } from './filebase'
import { prisma } from './prisma'
import FastifyCors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})
fastify.register(FastifyMultipart)
await fastify.register(FastifyCors, {
  origin: true,
  methods: ['POST', 'GET', 'HEAD']
})

fastify.get('/', () => 'hello world')

fastify.post('/upload', async (req, res) => {
  const token = (req.query as Record<string, string>).token
  const record = await isTokenValid(token)
  if (!record) return res.status(400).send({ message: 'Token is invalid or expired', success: false })
  const file = await req.file()

  if (!file) return res.status(400).send({ message: 'File not uploaded. Please try again.', success: false })
  file.filename = encodeURI(file.filename)
  const outHeaders = await uploadFile({ file, user: record.user })
  if (!outHeaders?.Metadata?.['cid']) return res.status(500).send({ message: 'Could not upload file', success: false })
  await prisma.patientFile.create({
    data: {
      ipfsCid: outHeaders.Metadata['cid'],
      userId: record.userId,
      fileName: file.filename,
      bucketName: record.userId
    }
  })
  await prisma.patientStorage.update({
    data: {
      usedSpace: {
        increment: outHeaders.ContentLength
      }
    },
    where: {
      patientId: record.userId
    }
  })
  await prisma.preSignedUrl.delete({
    where: {
      id: token
    }
  })
  return res.status(200).send({ success: true })
})

fastify.listen({ port: PORT }, (err) => {
  if (err) throw err
  console.log(`server listening on ${PORT}`)
})
