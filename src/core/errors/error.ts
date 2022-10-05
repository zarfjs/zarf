import type { Errorlike } from "bun";
import { pick } from '../utils/choose'
import { HTTPStatusCodeMesssageKey } from '../constants/codes'
import { serverErrorFns } from './config'

type ErrorData = { [key: string]: any };

export class ZarfCustomError extends Error implements Errorlike {
  constructor(
    readonly message: string,
    readonly code: HTTPStatusCodeMesssageKey = 'InternalServerError',
    readonly data: ErrorData = {},
  ) {
    super();
  }
}

export class ZarfNotFoundError extends ZarfCustomError {
  constructor(originalUrl: string) {
    super(`Route '${originalUrl}' does not exist.`, 'NotFound');
    this.name = this.constructor.name;
  }
}

export class ZarfMethodNotAllowedError extends ZarfCustomError {
    constructor() {
      super(`Requested method is not allowed for the server.`, 'MethodNotAllowed');
      this.name = this.constructor.name;
    }
}

export class ZarfBadRequestError extends ZarfCustomError {
  constructor(errorData: ErrorData) {
    super('There were validation errors.', 'BadRequest', errorData);
    this.name = this.constructor.name;
  }
}

export class ZarfUnprocessableEntityError extends ZarfCustomError {
  constructor(errorData: ErrorData) {
      super('Unprocessable Entity', 'UnprocessableEntity', errorData);
      this.name = this.constructor.name;
  }
}

export const sendError = (error: Errorlike) => {
    const isErrorSafeForClient = error instanceof ZarfCustomError;
    const send = error.code ? serverErrorFns[error.code as HTTPStatusCodeMesssageKey] : serverErrorFns['InternalServerError']
    const { message, data } = isErrorSafeForClient
      ? pick(error, ['message', 'data'])
      : {
          message: 'Something went wrong!',
          data: {},
     };
    return send?.(JSON.stringify({ message, errors: data }, null, 0))
}
