[英文版本](./README.md)

# redux-brief

> make redux easier to use ,inspired by vuex,rematch

## 这个库是对 Redux 的轻量级封装，可以兼容已有的 Redux 生态，相比直接使用 Redux ，有如下优点。

- 完全消除 action 的模板代码
- Typescript 类型安全
- 内置 immer，提升开发体验
- 使用 reducer 更加方便
- 兼容已有redux生态，例如redux devtools

## Quickstart

```
pnpm add redux-brief
```

## API

### 步骤 1： 定义 Reducer 模块

#### user 模块

```ts
interface Info{
  name:string
  age:number
}

import { createModule } from 'redux-brief';
export const namespace = 'user';
export const state = {
  name: '',
  age: 0,
  // you can use `as` to use your type define
  info:{
    name: '',
    age: 0
  } as Info
};

export const userModule = createModule({
  namespace,
  state,
  reducer: {
    setUserName(name: string, state) {
      state.name = name;
    },
    setAge(age: number, state) {
      state.age = age;
    },
    setInfo(info: Info, state) {
      state.info = info;
    },
  },
});
```

#### count 模块

```tsx
import {createModule} from "../../redux-brief";
import {reducers} from "../index";

const state = {
    money: 10,
    count: 10,
    count2: '',
}

const namespace = 'count'

export const countModule = createModule({
        namespace,
        state,
        reducer: { //
            add(payload: number, state) {
                state.money += payload
            },
            add2(payload: string, state) {
                state.count2 += payload
            },
            minus(payload: number, state) {
                state.money -= payload
            },
        },
        effect:{//处理异步
           asyncAdd(payload:number){
               setTimeout(() => {
                   reducers.count.add(payload)
               },1000)
           }
        }
    }
)

export type CountModuleState ={
    [namespace]: typeof state
}
```

### 步骤 2： 生成 Store

```ts
import { run } from 'redux-brief';
import thunk from 'redux-thunk';
import {
  countModule,
  namespace as countNamespace,
  state as countState,
} from './modules/count';
import {
  userModule,
  namesapce as userNamespace,
  state as userState,
} from './modules/user';

const modules = {
  [countNamespace]: countModule,
  [userNamespace]: userModule,
};

export const appState = {
  [countNamespace]: countState,
  [userNamespace]: userState,
};

export type AppState = typeof appState;
export type Modules = typeof modules;
const { store, reducers } = run<Modules>({ modules });
export { store, reducers };
```

### 步骤 3： 挂载 Store 到根组件上

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'redux-brief';
import { store } from './store'; // 引入步骤2生成的 store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### 组件内使用

```tsx
import React from 'react';
import {actions, AppState, effects, reducers, store} from "./store";
import {useSelector} from "react-redux";

function App() {
    const money = useSelector((state: AppState) => state.count.money)
    const name = useSelector((state: AppState) => state.user.name)

    const renderCount = () => {
        return (
            <div style={{border:'1px solid',padding:'10px'}}>
                <button onClick={() => {
                    reducers.count.add(2)
                }}>
                    加
                </button>
                <h1>money:{money}</h1>
                <button onClick={() => {
                // 异步场景
                   effects.count.asyncAdd(10)
                }}>
                    异步➕
                </button>
                <h1>name:{name}</h1>
            </div>
        )
    }

    return (
        <div className="App">
            {renderCount()}
        </div>
    );
}

export default App;
```

## 注意点

- module 内的 reducer 内不能调用 reducers ，请写在 effect 内

```tsx
export const countModule = createModule({
  namespace,
  state,
  reducer: {
    add(payload: number, state) {
      state.money += payload;
    
      //这行会报错， 因为 redux 限制当存在某一 reducer 执行中，无法同时执行其他 reducer，
      //相关资料 https://www.jianshu.com/p/69136da080fb
      reducers.user.setUserName('ssss') 

    },
  },
});
```

[完整 demo 项目链接](https://github.com/qinjialei24/redux-brief-demo)
