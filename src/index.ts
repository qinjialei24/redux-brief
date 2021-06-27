import produce from 'immer';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { NAME_SPACE_FLAG } from './constant';
import { HandleActionMap, HandleReducerMap, MutableObject, RunParams, RunResult } from './types';
import { getKey } from './utils';

let _store: ReduxBriefStore;
const _actionMap: any = {};

const REDUCER_KEY = 'reducer';

function getActionMap(reducerModule: { readonly [x: string]: any }, namespace: string) {
  return Object.keys(reducerModule).reduce((actionMap, actionName) => {
    const actionNameWithNamespace = namespace + NAME_SPACE_FLAG + actionName;
    generateActionMap(namespace, actionName, actionNameWithNamespace);
    return {
      ...actionMap,
      [actionName]: (payload: any) => {
        _store.dispatch({
          type: actionNameWithNamespace,
          payload
        } as never);
      }
    };
  }, {});
}

function generateActionMap(moduleName: string, actionName: string, actionNameWithNamespace: string) {
  //todo 检查是否重复
  _actionMap[moduleName] = {
    ..._actionMap[moduleName],
    [actionName]: actionNameWithNamespace
  };
}


const withReducerModule = (reducerModule: ReduxBriefModule): Record<string, unknown> => {
  const { state, action, reducer, namespace = '' } = reducerModule;
  return Object.keys(reducer)
    .map((key) => namespace + NAME_SPACE_FLAG + key)
    .includes(action.type)
    ? produce(state, (draft: unknown) => reducer[getKey(action.type)](action.payload, draft))
    : state;
};


const createReduxBriefModule = (model: any) => {
  const { reducer, namespace } = model;
  const reducerModule = (state: ReduxBriefModule['state'] = model.state, action: ReduxBriefModule['action']) => withReducerModule({
    state,
    action,
    reducer,
    namespace
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  reducerModule[REDUCER_KEY] = getActionMap(reducer, namespace);
  return reducerModule;
};


const mountReducerModules = (
  store: ReduxBriefStore,
  reducerModules: any
) {
  _store = store;
  Object.keys(reducerModules).forEach((moduleName) => {
    _store[moduleName] = reducerModules[moduleName][REDUCER_KEY];
  });
}

//save all reducer in a map ，so you can call reducer like reducerMap.countModule.add()
function getReducerMap<ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> {
  const obj: MutableObject = {};
  Object.keys(betterReduxModules).forEach((moduleName) => {
    obj[moduleName] = betterReduxModules[moduleName][REDUCER_KEY];
  });
  return obj as HandleReducerMap<ReducerMap>;
};


function processReducerModules<ReducerMap>(reducerModules: any) {
  const reducersToCombine: MutableObject = {};
  Object.keys(reducerModules).forEach(reducerName => {
    reducersToCombine[reducerName] = createReducerModule(reducerModules[reducerName]);
  });
  const reducerMap = getReducerMap<ReducerMap>(reducersToCombine);
  return {
    reducersToCombine,
    reducerMap,
    actionMap: _actionMap as HandleActionMap<ReducerMap>
  };
}

function run<T>(options: RunParams<T>): RunResult<T> {
  const { modules, middlewares = [] } = options;
  const { reducersToCombine, reducerMap, actionMap } = processReducerModules<T>(modules);
  const rootReducer = combineReducers(reducersToCombine as any);
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares))) as Store; // todo 环境变量
  mountReducerModules(store, reducersToCombine);
  return {
    store,
    reducers: reducerMap,
    selectors: {},
    actions: actionMap//todo rename actions
  };
};

export {
  run,
  useSelector,
  Provider
};
