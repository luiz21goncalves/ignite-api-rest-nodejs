import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async () => {
  const transaction = await knex('transactions').select('*')

  return transaction
})

app
  .listen({ port: 3333 })
  .then((url) => console.log(`HTTP Server Running at ${url}`))
