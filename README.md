# redux-brief

> make redux easier to use

## 这个库是对 Redux的轻量级封装，完全兼容已有的 Redux 生态，相比直接使用 Redux ，有如下优点。

- 完全消除 action 的模板代码
- Typescript 类型安全
- 内置 immer，提升开发体验
- 使用 reducer 从未如此方便



## Quickstart

```
yarn add redux-brief
```
## API
###步骤1： 定义一个 Reducer 模块
```ts
export interface CountModule {
  namespace: 'count'
  state: {
    money: number
  }
  reducer: {
    add: (payload: number, state: CountModule['state']) => void
    minus: (payload: number, state: CountModule['state']) => void
  }
}

export const countModule: CountModule= {
  namespace: 'count',
  state: {
    money: 10,
  },
  reducer: {
    add(payload, state) {
      state.money += payload
    },
    minus(payload, state) {
      state.money -= 1
    },
  }
}
```

###步骤2： 生成 Store
```ts
import {countModule,CountModule} from "./modules/count";
import {run} from "redux-brief";
import thunk from 'redux-thunk'

interface ReduxBriefReducers {
  count:CountModule['reducer']
}

const {store,reducers} = run<ReduxBriefReducers>({
  modules:{
    count:countModule,
  },
  middlewares: [] // 例如 middlewares:[thunk，saga]，默认集成 redux-devtools-extension
})

export {
  store,
  reducers,
}
```

###步骤3： 挂载 Store 到根组件上
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "redux-brief";
import {store} from "./store"; // 引入步骤2生成的 store

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
```


### 组件内使用

```tsx
import React from 'react';
import { useSelector} from 'redux-brief'
import {reducers, store} from "./store";//引入步骤2生成的 store 和 reducers

 const money = useSelector((state: any) => state.count.money) // 获取值

 <button onClick = { ()=>{ reducers.count.add(1) } }> add </button>
 <span>{money}</span>
```

## TODO
- [ ] export api selectors
- [ ] export api actions
- [ ] better effect
- [ ] auto type infer
- [ ] code refactor


