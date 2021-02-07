import {test, expect, describe} from '@jest/globals';

import {createApp} from '../app';

describe('app', () => {
  test('anonymous', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toEqual(200);
  });

  test('authenticated', async () => {
    const app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: 'Bearer x',
      },
    });

    expect(response.statusCode).toEqual(200);
  });
});
