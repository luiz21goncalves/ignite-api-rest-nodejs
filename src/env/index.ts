import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
})

const _env = envSchema.safeParse(process.env)

const isInvalidEnvSchema = _env.success === false

if (isInvalidEnvSchema) {
  console.log('Invalid environment variables.', _env.error.format())

  throw new Error(`Invalid environment variables.`)
}

export const ENV = _env.data
