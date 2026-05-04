import { createHash, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

export const SCHEDULE_TASK_TOKEN_HEADER = 'X-Schedule-Task-Token';

function configuredTaskToken() {
  return process.env.SCHEDULE_TASK_API_TOKEN?.trim() ?? '';
}

function requestTaskToken(request: Request) {
  const headerToken = request.headers.get(SCHEDULE_TASK_TOKEN_HEADER);
  if (headerToken) return headerToken.trim();

  const authorization = request.headers.get('Authorization') ?? '';
  const bearerPrefix = 'Bearer ';
  if (authorization.startsWith(bearerPrefix)) {
    return authorization.slice(bearerPrefix.length).trim();
  }

  return '';
}

function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

export function isValidTaskApiToken(token: string) {
  const expected = configuredTaskToken();
  if (!expected || !token) return false;

  return timingSafeEqual(sha256(token), sha256(expected));
}

export function authorizeTaskRequest(request: Request) {
  if (!configuredTaskToken()) {
    console.error('SCHEDULE_TASK_API_TOKEN is not configured');
    return NextResponse.json(
      { ok: false, error: 'Task API token is not configured' },
      { status: 503 }
    );
  }

  if (!isValidTaskApiToken(requestTaskToken(request))) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      {
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer' },
      }
    );
  }

  return null;
}
