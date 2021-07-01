import { Store } from 'redux';

type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer _U) => void
  ? (a: A1) => void
  : unknown;

type GetFirstArgOfObj<T> = {
  readonly [P in keyof T]: GetFirstArgFn<T[P]>;
};
export type HandleReducerMap<T> = {
  readonly //todo rename
  [P in keyof T]: GetFirstArgOfObj<T[P]>;
};
export type HandleActionMap<T> = {
  readonly //todo rename

  [P in keyof T]: {
    readonly [P2 in keyof T[P]]: string;
  };
};

export type RunParams<ReducerModules> = {
  readonly modules: any;
  readonly middlewares?: readonly any[];
};

export type RunResult<ReducerModules> = {
  readonly store: Store;
  readonly actions: HandleActionMap<ReducerModules>;
  readonly reducers: HandleReducerMap<ReducerModules>;
  readonly selectors: Record<string, unknown>;
  readonly effects: Record<string, unknown>;
};

export type RunFunc<T> = {
  (options: RunParams<T>): RunResult<T>;
};

export type MutableObject = Record<string, unknown>;

export type ReducerModuleConfig = {
  namespace: string;
  state: unknown;
  reducer: Record<string, unknown>;
};
