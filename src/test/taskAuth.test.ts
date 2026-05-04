import { afterEach, describe, expect, it } from 'vitest';
import {
  authorizeTaskRequest,
  isValidTaskApiToken,
  SCHEDULE_TASK_TOKEN_HEADER,
} from '@/app/api/tasks/auth';

const originalToken = process.env.SCHEDULE_TASK_API_TOKEN;

function taskRequest(headers: HeadersInit = {}) {
  return new Request('http://localhost:3000/api/tasks/line', {
    method: 'POST',
    headers,
  });
}

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env.SCHEDULE_TASK_API_TOKEN;
  } else {
    process.env.SCHEDULE_TASK_API_TOKEN = originalToken;
  }
});

describe('task API auth', () => {
  it('fails closed when no task API token is configured', async () => {
    delete process.env.SCHEDULE_TASK_API_TOKEN;

    const response = authorizeTaskRequest(taskRequest());

    expect(response?.status).toBe(503);
    await expect(response?.json()).resolves.toMatchObject({
      ok: false,
      error: 'Task API token is not configured',
    });
  });

  it('rejects a missing or wrong token', () => {
    process.env.SCHEDULE_TASK_API_TOKEN = 'known-secret';

    expect(authorizeTaskRequest(taskRequest())?.status).toBe(401);
    expect(
      authorizeTaskRequest(taskRequest({ [SCHEDULE_TASK_TOKEN_HEADER]: 'wrong-secret' }))?.status
    ).toBe(401);
  });

  it('accepts the scheduler token header', () => {
    process.env.SCHEDULE_TASK_API_TOKEN = 'known-secret';

    expect(
      authorizeTaskRequest(taskRequest({ [SCHEDULE_TASK_TOKEN_HEADER]: 'known-secret' }))
    ).toBeNull();
  });

  it('accepts an authorization bearer token for manual runs', () => {
    process.env.SCHEDULE_TASK_API_TOKEN = 'known-secret';

    expect(
      authorizeTaskRequest(taskRequest({ Authorization: 'Bearer known-secret' }))
    ).toBeNull();
  });

  it('compares token values without requiring equal input lengths', () => {
    process.env.SCHEDULE_TASK_API_TOKEN = 'known-secret';

    expect(isValidTaskApiToken('known-secret')).toBe(true);
    expect(isValidTaskApiToken('short')).toBe(false);
  });
});
