import modules, { Modules } from '../../examples/modules';
import { run } from '../index';

describe('index', () => {
  it('should run correctly', () => {
    run<Modules>({ modules });
  });
});
