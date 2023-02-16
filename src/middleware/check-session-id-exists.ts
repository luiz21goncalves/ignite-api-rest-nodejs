import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export async function checkSessionIdExists(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return replay.status(StatusCodes.UNAUTHORIZED).send({
      statusCode: StatusCodes.UNAUTHORIZED,
      error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    })
  }
}
