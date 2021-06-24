import produce from 'immer';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { NAME_SPACE_FLAG } from './constant';
import {
  HandleActionMap,
  HandleReducerMap,
  RunParams,
  RunResult
} from './types';
import { getKey } from './utils';

// eslint-disable-next-line functional/no-let
let _store: any = {}
const _actionMap: any = {}

const REDUCER_KEY = 'reducer';


 const processReducerModules = <ReducerMap>(reducerModules: any) => {
  const obj = {} as any
  Object.keys(reducerModules).forEach(reducerName => {
    // eslint-disable-next-line functional/immutable-data
    obj[reducerName] = createModel(reducerModules[reducerName])
  })
  const reducers = getReducerMap<ReducerMap>(obj);

  return {
    reduxBriefModules: obj,
    reducers,
    actionMap:_actionMap as HandleActionMap<ReducerMap>
  }
}

const getActionMap = (reducerModule: { readonly [x: string]: any }, namespace: string) =>
  Object.keys(reducerModule).reduce((actionMap, actionName) => {
    const actionNameWithNamespace = namespace + NAME_SPACE_FLAG + actionName;
    generateActionMap(namespace, actionName, actionNameWithNamespace)
    return {
      ...actionMap,
      [actionName]: (payload: any) => {
        _store.dispatch({
          type: actionNameWithNamespace,
          payload,
        } as never);
      },
    };
  }, {});

const generateActionMap = (moduleName: string, actionName: string, actionNameWithNamespace: string) => {
  //todo 检查是否重复
  // eslint-disable-next-line functional/immutable-data
  _actionMap[moduleName] = {
    ..._actionMap[moduleName],
    [actionName]: actionNameWithNamespace
  }
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const withReducerModule = ({state, action, reducer, namespace = ''}) =>
  Object.keys(reducer)
    .map((key) => namespace + NAME_SPACE_FLAG + key)
    .includes(action.type)
    ? produce(state, (draft: any) => reducer[getKey(action.type)](action.payload, draft))
    : state;

 const createModel = (model: any) => {
  const {reducer, namespace} = model;
  const reducerModule = (state = model.state, action: any) => withReducerModule({state, action, reducer, namespace});
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  reducerModule[REDUCER_KEY] = getActionMap(reducer, namespace);
  return reducerModule;
};


 const mountReducerModules = (
  store: { readonly [x: string]: any },
  reducerModules: { readonly [x: string]: { readonly [x: string]: any } }
) => {
  _store = store
  Object.keys(reducerModules).forEach((moduleName) => {
    // eslint-disable-next-line functional/immutable-data
    _store[moduleName] = reducerModules[moduleName][REDUCER_KEY];
  });
};



 const getReducerMap = <ReducerMap>(betterReduxModules: any): HandleReducerMap<ReducerMap> => {
  const obj = {} as any;
  Object.keys(betterReduxModules).forEach((moduleName) => {
    // eslint-disable-next-line functional/immutable-data
    obj[moduleName] = betterReduxModules[moduleName][REDUCER_KEY];
  });
  return obj as HandleReducerMap<ReducerMap>;
};

 const run= <T>(options:RunParams<T>):RunResult<T> =>{
   const {modules,middlewares=[]} =options

   const {reduxBriefModules,reducers,actionMap} = processReducerModules<T>(modules)
   const rootReducer = combineReducers(reduxBriefModules);
   const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares))) as Store;
   mountReducerModules(store, reduxBriefModules);

   return {
     store,
     reducers,
     selectors:{},
     actions:actionMap//todo rename actions
  }
 }

export {
  run,
}
