import 'dotenv/config'

import { knex as setupKnex, Knex } from 'knex'

export const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
} satisfies Knex.Config

export const knex = setupKnex(config)
