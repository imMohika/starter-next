import type { ApiError } from "next/dist/server/api-utils";

export class HttpError extends Error {
  public readonly cause?: Error;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly url: string | undefined;
  public readonly method: string | undefined;

  constructor(opts: {
    url?: string;
    method?: string;
    message?: string;
    statusCode: number;
    cause?: Error;
  }) {
    const msg =
      opts.message ??
      `HTTP Error ${opts.statusCode}: ${opts.method} ${opts.url}`;

    super(opts.message ?? msg);

    this.name = "HttpError";
    this.cause = opts.cause;
    this.statusCode = opts.statusCode;
    this.url = opts.url;
    this.method = opts.method;
    this.message = msg;

    if (opts.cause instanceof Error && opts.cause.stack) {
      this.stack = opts.cause.stack;
    }
  }

  public static fromRequest(request: Request, response: Response) {
    return new HttpError({
      message: response.statusText,
      url: response.url,
      method: request.method,
      statusCode: response.status,
    });
  }

  public static fromApiError(request: Request, err: ApiError): HttpError {
    return new HttpError({
      message: err.message,
      statusCode: err.statusCode,
      url: request.url,
      method: request.method,
    });
  }
}
