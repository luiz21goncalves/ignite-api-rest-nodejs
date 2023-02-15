import crypto from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, replay) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    const formattedAmount = type === 'credit' ? amount : amount * -1

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: formattedAmount,
    })

    return replay.status(StatusCodes.CREATED).send()
  })
}
