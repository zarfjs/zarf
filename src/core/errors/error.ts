import { Errorlike } from "bun";
import { pick } from '../utils/choose'
import { HTTPStatusCodeMesssageKey } from '../constants/codes'
import { serverErrorFns } from './config'

type ErrorData = { [key: string]: any };

export class BunTeaCustomError extends Error implements Errorlike {
  constructor(
    readonly message: string,
    readonly code: HTTPStatusCodeMesssageKey = 'InternalServerError',
    readonly data: ErrorData = {},
  ) {
    super();
  }
}

export class BunTeaNotFoundError extends BunTeaCustomError {
  constructor(originalUrl: string) {
    super(`Route '${originalUrl}' does not exist.`, 'NotFound');
    this.name = this.constructor.name;
  }
}

export class BunTeaMethodNotAllowedError extends BunTeaCustomError {
    constructor() {
      super(`Requested method is not allowed for the server.`, 'MethodNotAllowed');
      this.name = this.constructor.name;
    }
}

export class BunTeaBadRequestError extends BunTeaCustomError {
  constructor(errorData: ErrorData) {
    super('There were validation errors.', 'BadRequest', errorData);
    this.name = this.constructor.name;
  }
}

export class BunTeaUnprocessableEntityError extends BunTeaCustomError {
  constructor(errorData: ErrorData) {
      super('Unprocessable Entity', 'UnprocessableEntity', errorData);
      this.name = this.constructor.name;
  }
}

export const sendError = (error: Errorlike) => {
    const isErrorSafeForClient = error instanceof BunTeaCustomError;
    const send = error.code ? serverErrorFns[error.code as HTTPStatusCodeMesssageKey] : serverErrorFns['InternalServerError']
    const { message, data } = isErrorSafeForClient
      ? pick(error, ['message', 'data'])
      : {
          message: 'Something went wrong!',
          data: {},
     };
    return send?.(JSON.stringify({ message, errors: data }, null, 0))
}
