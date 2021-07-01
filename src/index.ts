import produce from 'immer';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { NAME_SPACE_FLAG, REDUCER_KEY } from './constant';
import { createModule } from './core';
import {
  HandleActionMap,
  HandleReducerMap,
  MutableObject,
  ReducerModuleConfig,
  RunParams,
  RunResult,
} from './types';
import { getKey } from './utils';

let _store: any;

export const _actionMap: Record<string, Record<string, string>> = {};
export const selectors: any = {};

/*
generate all actions and save in a map ，so you can use actions like actionMap.count.add,
it will be added namespace 'count/add' automatically

_actionMap`s shape:
* count:{
  add: "count/add"
  minus: "count/minus"
* }
* */
function generateActionMap(
  moduleName: string,
  actionName: string,
  actionNameWithNamespace: string
) {
  //todo 检查是否重复
  _actionMap[moduleName] = {
    ..._actionMap[moduleName],
    [actionName]: actionNameWithNamespace,
  };
}

type EnhanceReducerModuleParams = {
  namespace: string;
  state: unknown;
  action: { type: string; payload: unknown };
  reducer: Record<string, unknown>;
};

/*
 * enhance reducer
 * 1. add namespace
 * 2. add immer
 * */
function enhanceReducerModule(params: EnhanceReducerModuleParams) {
  const { state, action, reducer, namespace = '' } = params;
  return Object.keys(reducer)
    .map((key) => namespace + NAME_SPACE_FLAG + key)
    .includes(action.type)
    ? produce(state, (draft: EnhanceReducerModuleParams['state']) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return reducer[getKey(action.type)](action.payload, draft);
      })
    : state;
}

function createReducerModule(reducerModuleConfig: ReducerModuleConfig) {
  const { reducer, namespace } = reducerModuleConfig;
  const reducerModule = (
    state = reducerModuleConfig.state,
    action: EnhanceReducerModuleParams['action']
  ) =>
    enhanceReducerModule({
      state,
      action,
      reducer,
      namespace,
    });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  reducerModule[REDUCER_KEY] = getActionMap(reducer, namespace);
  return reducerModule;
}

function getActionMap(reducerModule: ReducerModuleConfig, namespace: string) {
  return Object.keys(reducerModule).reduce((actionMap, actionName) => {
    const actionNameWithNamespace = namespace + NAME_SPACE_FLAG + actionName;
    generateActionMap(namespace, actionName, actionNameWithNamespace);

    return {
      ...actionMap,
      [actionName]: (payload: any) => {
        _store.dispatch({
          type: actionNameWithNamespace,
          payload,
        });
      },
    };
  }, {});
}

export function mountReducerModules(store: any, reducerModules: any) {
  _store = store;
  Object.keys(reducerModules).forEach((moduleName) => {
    _store[moduleName] = reducerModules[moduleName][REDUCER_KEY];
  });
}

//generate all reducers and save in a map ，so you can call reducer like reducerMap.countModule.add()
function generateReducerMap<ReducerMap>(reducersToCombine: any): HandleReducerMap<ReducerMap> {
  const reducerMap: MutableObject = {};
  Object.keys(reducersToCombine).forEach((moduleName) => {
    reducerMap[moduleName] = reducersToCombine[moduleName][REDUCER_KEY];
  });
  return reducerMap as HandleReducerMap<ReducerMap>;
}

function processReducerModules<ReducerMap>(reducerModules: any) {
  const reducersToCombine: MutableObject = {};
  Object.keys(reducerModules).forEach((reducerName) => {
    const moduleSelectors = reducerModules[reducerName].selector;
    Object.keys(moduleSelectors).forEach(
      (key) => (selectors[key] = () => moduleSelectors[key](_store.getState()))
    );
    reducersToCombine[reducerName] = createReducerModule(reducerModules[reducerName]);
  });
  const reducerMap = generateReducerMap<ReducerMap>(reducersToCombine);
  return {
    reducersToCombine,
    reducerMap,
  };
}

function run<T>(options: RunParams<T>): RunResult<T> {
  const { modules, middlewares = [] } = options;
  const { reducersToCombine, reducerMap } = processReducerModules<T>(modules);
  const rootReducer = combineReducers(reducersToCombine as any);
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  ) as Store; // todo 环境变量,生产环境不打包 dev tools
  mountReducerModules(store, reducersToCombine);
  return {
    store,
    selectors,
    reducers: reducerMap,
    effects: {},
    actions: _actionMap as HandleActionMap<T>,
  };
}

export { createModule, run, useSelector, Provider };
