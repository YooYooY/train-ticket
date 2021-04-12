## 规则配置

配置 react-hooks eslint

```sh
npm i eslint-plugin-react-hooks -D
```

```json
"eslintConfig": {
    "extends": [
        "react-app"
    ],
    "plugins": [
        "react-hooks"
    ],
    "rules": {
        "no-unused-vars": "off",
        "react-hooks/rules-of-hooks": "error"
    }
}
```

## useState

- 声明在组件最前面
- 初始值可通过函数返回
 
## useEffect

- componentDidMount
- componentDidUpdate
- componentWillUnmount

```js
useEffect(() => {
      effect
      return () => {
          cleanup
      }
  }, [input])
```

## createContext

```js
import React,{createContext, useContext, useState} from 'react'

const CountContext = createContext();

export default function App() {
    const [count,setCount]=  useState(0);
    return (
      <div>
        <button type="button" onClick={() => setCount(count + 1)}>
          +
        </button>
        <CountContext.Provider value={count}>
          <Counter></Counter>
        </CountContext.Provider>
      </div>
    )
}

function Counter(){
    const count = useContext(CountContext);
    return (
        <p>Count: {count}</p>
    )
}
```

## useMemo & useCallback

```js
const double = useMemo(() => {
    return count * 2
}, [count])

const double = useCallback(() => {
    console.log("do something")
}, [])
```

## useRef

- 获取子组件或者Dom元素

```js
const counterRef = useRef();

useEffect(()=>{
    console.log(counterRef.current);
})

<Counter ref={counterRef} onClick={onClick} count={count}></Counter>
```

- 同步不同渲染周期之间的需要共享的数据

```js
const it = useRef();

useEffect(()=>{
    it.current = setInterval(() => {
    // 因为每次拿到的都是第一次的count,所以设置count需要在回调函数中执行
    setCount(count=>(count + 1))
    }, 1000)
},[]);

useEffect(()=>{
    if (count >= 5) {
    clearInterval(it.current)
    }
})
```

## 自定义 Hooks


