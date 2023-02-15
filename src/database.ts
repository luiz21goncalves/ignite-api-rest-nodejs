import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'
import { ENV } from './env'

export const config = {
  client: 'pg',
  connection: ENV.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
} satisfies Knex.Config

export const knex = setupKnex(config)
