import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async () => {
  const test = await knex('pg_catalog.pg_tables').select('*')

  return test
})

app
  .listen({ port: 3333 })
  .then((url) => console.log(`HTTP Server Running at ${url}`))
