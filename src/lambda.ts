import type { Callback, Context, Handler } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { createNestApp } from './app.factory';

let cachedHandler: Handler;

function stripStageFromPath(path: string, stage: string): string {
  const prefix = `/${stage}`;
  if (!path.startsWith(prefix)) return path;
  const stripped = path.slice(prefix.length);
  return stripped.length > 0 ? stripped : '/';
}

/** HTTP API v2 envia /production/api/... — Nest espera /api/... */
function normalizeApiGatewayEvent(event: unknown): unknown {
  if (!event || typeof event !== 'object') return event;

  const stage = process.env.STAGE?.trim();
  if (!stage || stage === '$default') return event;

  const e = event as Record<string, unknown>;

  if (typeof e.rawPath === 'string') {
    e.rawPath = stripStageFromPath(e.rawPath, stage);
  }

  const requestContext = e.requestContext as { http?: { path?: string } } | undefined;
  if (requestContext?.http?.path) {
    requestContext.http.path = stripStageFromPath(requestContext.http.path, stage);
  }

  if (typeof e.path === 'string') {
    e.path = stripStageFromPath(e.path, stage);
  }

  return e;
}

async function bootstrap(): Promise<Handler> {
  const app = await createNestApp();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  cachedHandler = cachedHandler ?? (await bootstrap());
  return cachedHandler(normalizeApiGatewayEvent(event), context, callback);
};
