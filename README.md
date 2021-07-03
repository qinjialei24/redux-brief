# redux-brief

> make redux easier to use

## 这个库是对 Redux 的轻量级封装，完全兼容已有的 Redux 生态，相比直接使用 Redux ，有如下优点。

- 完全消除 action 的模板代码
- Typescript 类型安全
- 内置 immer，提升开发体验
- 使用 reducer 更加方便

## Quickstart

```
yarn add redux-brief
```

## API

### 步骤 1： 定义 Reducer 模块

#### user 模块

```ts
import { createModule } from 'redux-brief';
export const namespace = 'user';
export const state = {
  name: '',
  age: 0,
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
  },
});
```

#### count 模块

```tsx
import { createModule } from 'redux-brief';
export const namespace = 'count';
export const state = {
  money: 10,
  count: 10,
  count2: '',
};

export const countModule = createModule({
  namespace,
  state,
  reducer: {
    add(payload: number, state) {
      state.money += payload;
    },
    add2(payload: string, state) {
      state.count2 += payload;
    },
    minus(payload: number, state) {
      state.money -= 1;
    },
  },
});
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
import { useSelector } from 'redux-brief';
import { AppState, reducers, store } from './store';

function App() {
  const money = useSelector((state: AppState) => state.count.money);
  const name = useSelector((state: AppState) => state.user.name);

  function minusAsync() {
    // 异步场景
    return (dispatch) => {
      setTimeout(() => {
        dispatch({
          type: 'count/minus',
        });
      }, 1000);
    };
  }

  const renderCount = () => {
    return (
      <div>
        <button
          onClick={() => {
            reducers.count.add(1);
          }}
        >
          {' '}
          加 1{' '}
        </button>

        <h1>money:{money}</h1>

        <button
          onClick={() => {
            store.dispatch(minusAsync() as any);
          }}
        >
          一秒后减 1
        </button>

        <button
          onClick={() => {
            reducers.user.setUserName('kobe bryant');
          }}
        >
          设置用户名
        </button>
        <h1>name:{name}</h1>
      </div>
    );
  };

  return <div className="App">{renderCount()}</div>;
}

export default App;
```

[完整 demo 项目链接](https://github.com/qinjialei24/xxxx)
