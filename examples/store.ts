import { run } from '../src';

import modules, { Modules } from './modules';

const { store, reducers, selectors } = run<Modules>({ modules });
export { store, reducers };
