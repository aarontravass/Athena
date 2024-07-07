import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema'
import { PORT } from './constants'
import { extractContext } from './validation/auth'

const yoga = createYoga({
  schema,
  context: (req) => extractContext(req.request.headers)
})

const server = createServer(yoga)

server.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`)
})
