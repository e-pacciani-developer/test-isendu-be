import { Request, Response } from 'express';

export type TResponse<T = undefined> = Response<T | Error | { error: string }>;

export type GetRequest<PathParams = {}, QueryParams = {}> = Request<
  PathParams,
  undefined,
  undefined,
  QueryParams
>;
export type PutRequest<
  Body = undefined,
  PathParams = {},
  QueryParams = {}
> = Request<PathParams, undefined, Body, QueryParams>;

export type PostRequest<
  Body = undefined,
  PathParams = {},
  QueryParams = {}
> = Request<PathParams, undefined, Body, QueryParams>;

export type DeleteRequest<PathParams = {}, QueryParams = {}> = Request<
  PathParams,
  undefined,
  undefined,
  QueryParams
>;
