import { countModule, namespace as countNamespace, state as countState } from './count';
import { userModule, namespace as userNamespace, state as userState } from './user';

const modules = {
  [userNamespace]: userModule,
  [countNamespace]: countModule,
};

export const appState = {
  [userNamespace]: userState,
  [countNamespace]: countState,
};

export type AppState = typeof appState;
export type Modules = typeof modules;
export default modules;
