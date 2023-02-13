import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'pg',
  connection: {
    port: 5432,
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'ignite-api-rest-nodejs',
  },
})
