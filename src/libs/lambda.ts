import middy from '@middy/core'
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop'
import httpCors from '@middy/http-cors'
import jsonBodyParser from '@middy/http-json-body-parser'
import { normalizeHttpResponse } from '@middy/util'

import { InternalServerError } from '@/errors/internal-server-error'

type EventSource = 'api-gateway' | 'sqs'

const errorHandler = (): middy.MiddlewareObj => {
  return {
    onError: request => {
      if (request.response !== undefined) {
        return
      }

      const error = InternalServerError.normalize(request.error)
      if (process.env.NODE_ENV !== 'test') {
        console.error(error)
      }

      normalizeHttpResponse(request)
      request.response = {
        ...request.response,
        statusCode: error.statusCode,
        headers: {
          ...request.response.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error.serialize())
      }
    }
  }
}

export const middyfy = (handler: any, source: EventSource = 'api-gateway') => {
  const middleware = [doNotWaitForEmptyEventLoop()]
  if (source === 'api-gateway') {
    middleware.push(jsonBodyParser(), httpCors(), errorHandler())
  }

  return middy(handler).use(middleware)
}
