import crypto from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { knex } from '../database'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*')

    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transactions = await knex('transactions')
      .where({ id, session_id: sessionId })
      .first()

    return { transactions }
  })

  app.post('/', async (request, replay) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      replay.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    const formattedAmount = type === 'credit' ? amount : amount * -1

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: formattedAmount,
      session_id: sessionId,
    })

    return replay.status(StatusCodes.CREATED).send()
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
}
