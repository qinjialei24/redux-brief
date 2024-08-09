[中文版本](./README_CN.md)

# redux-brief

## Make redux easier to use ,inspired by vuex,rematch

This library is a lightweight encapsulation of Redux, compatible with the existing Redux ecosystem. Compared to using Redux directly, it offers several advantages:

- Completely eliminates boilerplate code for actions
- TypeScript type safety
- Built-in Immer for improved development experience
- Easier usage of reducers
- Compatibility with the existing Redux ecosystem, including Redux DevTools

## Quickstart

```
pnpm add redux-brief
```

## API

### Step 1: Define Reducer Modules

#### User Module

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

#### Count Module

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
        effect:{//handle asynchronous task
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

### Step 2: Generate the Store

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

### Step 3: Mount the Store onto the Root Component

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'redux-brief';
import { store } from './store'; // Import the store generated in step 2

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### Usage within Components

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
                    Add
                </button>
                <h1>money:{money}</h1>
                <button onClick={() => {
                // Asynchronous scenario
                   effects.count.asyncAdd(10)
                }}>
                    Async Add➕
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

## Caveats

- Reducers within a module cannot call reducers, these should be placed inside effects.

```tsx
export const countModule = createModule({
  namespace,
  state,
  reducer: {
    add(payload: number, state) {
      state.money += payload;
  
      // This line will cause an error because Redux restricts dispatching another action while a reducer is executing.
      // Related reference: https://www.jianshu.com/p/69136da080fb
      reducers.user.setUserName('ssss') 

    },
  },
});
```

[Link to the Complete Demo Project](https://github.com/qinjialei24/redux-brief-demo)
