import {test, expect} from '@jest/globals';

import {app} from '../app';

test('app', async () => {
  const response = await app.inject({
    method: 'GET',
    url: '/',
  });

  expect(response.statusCode).toEqual(200);
});
