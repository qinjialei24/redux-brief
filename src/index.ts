import produce from 'immer';


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line functional/no-return-void
type GetFirstArgFn<F> = F extends (a: infer A1, ...args: infer U) => void ? (a: A1) => void : unknown;

type GetFirstArgOfObj<T> = { readonly
  [P in keyof T]: GetFirstArgFn<T[P]>;
};

export type HandleReducerMap<T> = { readonly
  [P in keyof T]: GetFirstArgOfObj<T[P]>;
};

const NAME_SPACE_SEPARATOR = '/';
const ACTION_NAME = 'action';

const getActionMap = (reducerModule: { readonly [x: string]: any; }, namespace: string, store: any) =>
  Object.keys(reducerModule).reduce((actionMap, actionName) => {
    const actionType = namespace + NAME_SPACE_SEPARATOR + actionName;
    return {
      ...actionMap,
      [actionName]: (payload: any) => {
        store.dispatch({
          type: actionType,
          payload,
        });
      },
    };
  }, {});

const getKey = (str: string) => str.substring(str.indexOf(NAME_SPACE_SEPARATOR) + 1, str.length + 1);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const withReducerModule = ({ state, action, reducer, namespace = '' }) =>
  Object.keys(reducer)
    .map((key) => namespace + NAME_SPACE_SEPARATOR + key)
    .includes(action.type)
    ? produce(state, (draft: any) => reducer[getKey(action.type)](action.payload, draft))
    : state;

export const generateReducerForCombine = (model: any, store: any): any => {
  const { reducer, namespace } = model;
  const reducerModule = (state = model.state, action: any) => withReducerModule({ state, action, reducer, namespace });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  reducerModule[ACTION_NAME] = getActionMap(reducer, namespace, store);
  return reducerModule;
};

export const setActionToStore = (
  store: { readonly [x: string]: any; },
  reducerModules: { readonly [x: string]: { readonly [x: string]: any; }; }
) => {
  Object.keys(reducerModules).forEach((moduleName) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    store[moduleName] = reducerModules[moduleName][ACTION_NAME];
  });
};

export const getReducerMap = <ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> => {
  const obj = {} as any;
  Object.keys(betterReduxModules).forEach((moduleName) => {
    // eslint-disable-next-line functional/immutable-data
    obj[moduleName] = betterReduxModules[moduleName][ACTION_NAME];
  });
  return obj as HandleReducerMap<ReducerMap>;
};

export const storeEnhancer = (createStore: (arg0: any, arg1: any, arg2: any) => any) => (
  reducer: any,
  preloadedState: any,
  enhancer: any
) => {
  const store = createStore(reducer, preloadedState, enhancer);
  const oldDispatch = store.dispatch;
  // eslint-disable-next-line functional/immutable-data
  store.dispatch = (typeOrAction: any, payload: any) =>
    typeof typeOrAction === 'object' ? oldDispatch(typeOrAction) : oldDispatch({ type: typeOrAction, payload });
  return store;
};

export const run = <ReducerMap>(
  reducerModules: any,
  store: any
) => {
  Object.keys(reducerModules).forEach((reducerName) => {
    // eslint-disable-next-line functional/immutable-data
     reducerModules[reducerName] = generateReducerForCombine(reducerModules[reducerName], store);
  });
  return getReducerMap<ReducerMap>(reducerModules)
};
