import test from 'ava';

import { getKey } from './utils';

test('getKey', (t) => {
  t.is(getKey('a/b'),'b')
})
