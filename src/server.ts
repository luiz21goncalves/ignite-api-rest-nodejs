import fastify from 'fastify'

import { ENV } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes)

app
  .listen({ port: ENV.PORT })
  .then((url) => console.log(`HTTP Server Running at ${url}`))
