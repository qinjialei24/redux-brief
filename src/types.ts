// eslint-disable-next-line functional/no-return-void
 type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer _U) => void ? (a: A1) => void : unknown;
 type GetFirstArgOfObj<T> = {
  readonly [P in keyof T]: GetFirstArgFn<T[P]>;
};
export type HandleReducerMap<T> = {
  readonly [P in keyof T]: GetFirstArgOfObj<T[P]>;
};
export type HandleActionMap<T> = {
  readonly [P in keyof T]: {
    readonly [P2 in keyof T[P]]: string
  }
}
