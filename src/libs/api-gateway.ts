import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { FromSchema, JSONSchema } from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>
}

export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>

interface Response {
  data?: Record<string, unknown> | Array<Record<string, unknown>>
  statusCode?: number
}

export const formatJSONResponse = ({ statusCode, data }: Response = {}) => {
  if (!statusCode) {
    statusCode = data ? 200 : 204
  }

  return {
    statusCode,
    body: data ? JSON.stringify(data) : ''
  }
}
