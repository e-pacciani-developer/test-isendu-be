import { Request, Response } from 'express';

export type TResponse<T = undefined> = Response<T | Error | { error: string }>;

export type GetRequest<
  PathParams = undefined,
  QueryParams = undefined
> = Request<PathParams, undefined, undefined, QueryParams>;
export type PutRequest<
  Body = undefined,
  PathParams = undefined,
  QueryParams = undefined
> = Request<PathParams, undefined, Body, QueryParams>;

export type PostRequest<
  Body = undefined,
  PathParams = undefined,
  QueryParams = undefined
> = Request<PathParams, undefined, Body, QueryParams>;

export type DeleteRequest<
  PathParams = undefined,
  QueryParams = undefined
> = Request<PathParams, undefined, undefined, QueryParams>;
