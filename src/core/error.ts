import { Errorlike } from "bun";
import { pick } from '../core/utils/choose'
import { badRequest, internalServerError, notFound, unprocessableEntity } from "./response/created";
import { RespCreatorRequestInit } from "./response/creator";
import { HTTPStatusCodeMesssageKey } from '../core/constants/codes'

type ErrorData = { [key: string]: any };

const errorFns: Partial<Record<HTTPStatusCodeMesssageKey, (body?: BodyInit | null, init?: RespCreatorRequestInit) => Response>> = {
    'InternalServerError': internalServerError,
    'NotFound': notFound,
    'BadRequest': badRequest,
    'UnprocessableEntity': unprocessableEntity
}

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
    const send = error.code ? errorFns[error.code as HTTPStatusCodeMesssageKey] : errorFns['InternalServerError']
    const { message, data } = isErrorSafeForClient
      ? pick(error, ['message', 'data'])
      : {
          message: 'Something went wrong!',
          data: {},
     };
    return send?.(JSON.stringify({ message, errors: data }, null, 0))
}
