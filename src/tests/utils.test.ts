import { getKey } from '../utils';

describe('utils', () => {
  describe('getKey', () => {
    it('should return b', () => {
      expect(getKey('a/b')).toBe('b');
    });
  });
});
