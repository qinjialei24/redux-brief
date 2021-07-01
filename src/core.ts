type Options<Namespace, State, Reducer, Selector> = {
  readonly namespace: Namespace;
  readonly state: State;
  readonly reducer: Reducer;
  readonly selector?: Selector;
};

export function createModule<
  Namespace extends string,
  State extends Record<string, unknown>,
  Reducer extends Record<string, (payload: never, state: State) => void>,
  Selector extends Record<string, (state: any) => any>
>(options: Options<Namespace, State, Reducer, Selector>) {
  return options as unknown as Reducer;
}
