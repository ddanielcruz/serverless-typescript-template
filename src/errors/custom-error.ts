interface SerializedCustomError<T = unknown> {
  message: string
  code: string
  data?: T
}

export abstract class CustomError<T = unknown> extends Error {
  abstract readonly statusCode: number

  constructor(message: string, readonly code: string, readonly data?: T) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serialize(): SerializedCustomError<T> {
    const { message, code, data } = this
    return { message, code, data }
  }
}
