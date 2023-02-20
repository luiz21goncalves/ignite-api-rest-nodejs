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
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 2500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toStrictEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({
          title: 'New transaction',
          amount: '2500.00',
        }),
      ]),
    })
  })
})
