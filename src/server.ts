import fastify from 'fastify'
import { knex } from './database'
import { ENV } from './env'

const app = fastify()

app.get('/', async () => {
  const transaction = await knex('transactions').select('*')

  return transaction
})

app
  .listen({ port: ENV.PORT })
  .then((url) => console.log(`HTTP Server Running at ${url}`))
