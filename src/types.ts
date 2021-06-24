import { Store } from 'redux';

// eslint-disable-next-line functional/no-return-void
type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer _U) => void ? (a: A1) => void : unknown;

type GetFirstArgOfObj<T> = {
  readonly [P in keyof T]: GetFirstArgFn<T[P]>;
};
export type HandleReducerMap<T> = { //todo rename
  readonly [P in keyof T]: GetFirstArgOfObj<T[P]>;
};
export type HandleActionMap<T> = {//todo rename
  readonly [P in keyof T]: {
    readonly [P2 in keyof T[P]]: string
  }
}

export type RunParams<ReducerModules> = {
  readonly modules: any,
  readonly middlewares?: readonly any[]
};

export type RunResult<ReducerModules> = {
  readonly store: Store
  readonly actions: Record<string, unknown>
  readonly selectors: Record<string, unknown>
  readonly reducers: HandleReducerMap<ReducerModules>
};

export type RunFunc<T> = {
  (options: RunParams<T>): RunResult<T>
};
