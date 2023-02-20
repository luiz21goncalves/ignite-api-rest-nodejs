import { execSync } from 'node:child_process'

import request from 'supertest'
import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'

import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('pnpm run knex migrate:rollback --all')
    execSync('pnpm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toStrictEqual({})
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2500,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(listTransactionsResponse.statusCode).toEqual(200)
    expect(listTransactionsResponse.body).toStrictEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({
          title: 'New transaction',
          amount: '2500.00',
        }),
      ]),
    })
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 500,
        type: 'debit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionsResponse.statusCode).toEqual(200)
    expect(getTransactionsResponse.body).toStrictEqual({
      transaction: expect.objectContaining({
        title: 'New transaction',
        amount: '-500.00',
      }),
    })
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2500,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'New transaction',
        amount: 1500,
        type: 'debit',
      })
      .expect(201)

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.statusCode).toEqual(200)
    expect(summaryResponse.body).toStrictEqual({
      summary: { amount: '1000.00' },
    })
  })

  it('should not be able to list all transactions without a session cookie', async () => {
    const listTransactionsResponse = await request(app.server).get(
      '/transactions',
    )

    expect(listTransactionsResponse.statusCode).toEqual(401)
    expect(listTransactionsResponse.body).toStrictEqual({
      statusCode: 401,
      error: 'Unauthorized',
    })
  })
})
