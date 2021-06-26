import produce from 'immer';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { NAME_SPACE_FLAG } from './constant';
import {
  HandleActionMap,
  HandleReducerMap, MutableObject,
  ReduxBriefModule, ReduxBriefStore,
  RunParams,
  RunResult
} from './types';
import { getKey } from './utils';

let _store: ReduxBriefStore;
const _actionMap: any = {};

const REDUCER_KEY = 'reducer';


const processReduxBriefModules = <ReducerMap>(reducerModules: any) => {
  const obj:Record<string, unknown> = {} ;
  Object.keys(reducerModules).forEach(reducerName => {
    obj[reducerName] = createReduxBriefModule(reducerModules[reducerName]);
  });
  const reducers = getReducerMap<ReducerMap>(obj);
  return {
    reduxBriefModules: obj,
    reducers,
    actionMap: _actionMap as HandleActionMap<ReducerMap>
  };
};

const getActionMap = (reducerModule: { readonly [x: string]: any }, namespace: string) =>
  Object.keys(reducerModule).reduce((actionMap, actionName) => {
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

const generateActionMap = (moduleName: string, actionName: string, actionNameWithNamespace: string) => {
  //todo 检查是否重复
  _actionMap[moduleName] = {
    ..._actionMap[moduleName],
    [actionName]: actionNameWithNamespace
  };
};



const withReducerModule = (reducerModule:ReduxBriefModule):Record<string, unknown> =>{
  const { state, action, reducer, namespace = '' } =reducerModule
  return  Object.keys(reducer)
    .map((key) => namespace + NAME_SPACE_FLAG + key)
    .includes(action.type)
    ? produce(state, (draft: unknown) => reducer[getKey(action.type)](action.payload, draft))
    : state;
}


const createReduxBriefModule = (model: any) => {
  const { reducer, namespace } = model;
  const reducerModule = (state:ReduxBriefModule['state'] = model.state, action: ReduxBriefModule['action']) => withReducerModule({
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
) => {
  _store = store;
  Object.keys(reducerModules).forEach((moduleName) => {
    _store[moduleName] = reducerModules[moduleName][REDUCER_KEY];
  });
};


const getReducerMap = <ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> => {
  const obj:MutableObject = {};
  Object.keys(betterReduxModules).forEach((moduleName) => {
    obj[moduleName] = betterReduxModules[moduleName][REDUCER_KEY];
  });
  return obj as HandleReducerMap<ReducerMap>;
};

const run = <T>(options: RunParams<T>): RunResult<T> => {
  const { modules, middlewares = [] } = options;
  const { reduxBriefModules, reducers, actionMap } = processReduxBriefModules<T>(modules);
  const rootReducer = combineReducers(reduxBriefModules as any);
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares))) as unknown as ReduxBriefStore; // todo 环境变量
  mountReducerModules(store, reduxBriefModules);

  return {
    store,
    reducers,
    selectors: {},
    actions: actionMap//todo rename actions
  };
};

export {
  run,
  useSelector,
  Provider
};
