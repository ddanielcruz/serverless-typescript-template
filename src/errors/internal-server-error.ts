import { CustomError } from './custom-error'

export class InternalServerError extends CustomError {
  readonly statusCode = 500

  constructor(error: Error | string, code = 'UNKNOWN_ERROR') {
    if (typeof error === 'string') {
      error = new Error(error)
    }

    super(error.message, code, { name: error.name, stack: error.stack })
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }

  static normalize(error: unknown): CustomError {
    return error instanceof CustomError ? error : new InternalServerError(error as any)
  }

  serialize() {
    const { message, code } = this
    return { message, code }
  }
}
