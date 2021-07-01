import { createModule } from '../../src';

import { AppState } from './index';

export const namespace = 'user';
export const state = {
  name: '',
  age: 0,
};

export const userModule = createModule({
  namespace,
  state,
  reducer: {
    setUserName(name: string, state) {
      state.name = name;
    },
    setAge(age: number, state) {
      state.age = age;
    },
  },
  selector: {
    selectUser: (state: AppState) => state.user,
  },
});

export default userModule;
