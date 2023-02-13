import { knex as setupKnex, Knex } from 'knex'

export const config = {
  client: 'pg',
  connection: {
    port: 5432,
    host: '127.0.0.1',
    user: 'docker',
    password: 'docker',
    database: 'ignite-api-rest-nodejs',
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
} satisfies Knex.Config

export const knex = setupKnex(config)
