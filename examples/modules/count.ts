import { createModule } from '../../src';

import { AppState } from './index';

export const namespace = 'count';
export const state = {
  money: 10,
  count: 10,
  count2: '',
};

export const countModule = createModule({
  namespace,
  state,
  reducer: {
    add(payload: number, state) {
      state.money += payload;
    },
    add2(payload: string, state) {
      state.count2 += payload;
    },
    minus(payload: number, state) {
      state.money -= 1;
    },
  },
  selector: {
    selectCount: (state: AppState) => state.count,
  },
});

export default countModule;
