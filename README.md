# redux-brief

> make redux easier to use

## 这个库是对 Redux的轻量级封装，完全兼容已有的 Redux 生态，无需修改已有代码，相比直接使用 Redux ，有如下优点。

-

完全消除
action
的模板代码

-

Typescript
类型安全

-

内置
immer，提升开发体验

-

使用
reducer
从未如此方便

## Quickstart

```
yarn add redux-brief
```

# API

## 定义一个 Reducer 模块

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
```

## 生成 Store
```ts
import { countModule,CountModule } from "./modules/count";
import { run } from "redux-brief";


const {
  store,
  reducers,
  actions,
  selectors
} = run({
  modules: {
    count: countModule,
  },
  middlewares: []//例如 middlewares:[thunk，saga]，默认集成 redux-devtools-extension
})

```

## 使用

```
 import { useSelector } from "redux-brief";

 const money = useSelector((state: any) => state.count.money) // 获取值

 <button onClick = { ()=>{ reducers.count.add(1) } }> add </button>
 <span>{money}</span>
```

## TODO

- [ ] 
  export
  api
  selectors
- [ ] 
  export
  api
  actions
- [ ] 
  better
  effect
- [ ] 
  code
  refactor

