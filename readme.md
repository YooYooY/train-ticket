# react hook 重构去哪儿网

使用 react hook 重构去哪儿购票网站，来自 [React劲爆新特性Hooks](https://coding.imooc.com/class/348.html)

## 目标

使用 reack hook 熟练开发项目。
 
## 难点

 项目中最复杂的应该是时间滑动条组件了，涵盖了大部分 reack hook 的使用技巧，掌握它基本上其它组件都能独立完成了，原项目对滑块的实现逻辑太过冗余繁琐，我这里对它进行了重新改造优化，顺便修复了其中的bug。
 
 ### 改造时间选择滑块
 
 时间滑块组件位于查询页面，组件 `query/components/Slider`。
 
 ### 需求
 
 根据用户传入开始时间和结束时间参数（0h-24h），渲染时间选择滑块，用户拖动`开始/结束`滑块按钮选择时间， 拖动完成后，发送（emit）结果给父组件处理。
 
 ### 参数
 - 开始时间（currentStartHours）
 - 结束时间（currentEndHours）
 - 修改开始时间回调（onStartChanged）
 - 修改结束时间回调（onEndChanged）


### 自定义hook

自定义hook `useSlider`:

参数：
- options
    - minNum 最小时间
    - maxNum 最大时间
    - startNum 开始时间
    - sliderEl 滑块 element
- onChange 时间修改后回调

```jsx
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

// 时间转化成滑块数值
const timeToNum = (time, total) =>
    total <= 0 ? 0 : Math.round((time / 24) * total);
// 滑块数值转化成时间
const numToTime = (num, total) =>
    total <= 0 ? 0 : Math.round((num / total) * 24);

export const useSlider = ({ minNum, maxNum, startNum, sliderEl }, onChange) => {
    
    // 转换时间为滑块数值
    const timeToSliderNum = useMemo(() => timeToNum(startNum, maxNum), [
        maxNum,
        startNum,
    ]);
    
    // 转换滑块数值为时间
    const slideNumToTime = useCallback(
        (distance) => numToTime(distance, maxNum),
        [maxNum]
    );
    
    let start = 0;
    let distance = useRef(() => timeToSliderNum);
    let tmpDistance = timeToSliderNum;
    const [sliderNum, setSliderNum] = useState(() => distance.current);

    // 触摸开始
    const touchStart = (e) => {
        e.preventDefault();
        const { clientX } = e.targetTouches[0];
        start = clientX;
        e.target.addEventListener('touchmove', touchMove, false);
        e.target.addEventListener('touchend', touchEnd, false);
    };
    
    // 移动滑块
    const touchMove = (e) => {
        e.preventDefault();
        const { clientX } = e.targetTouches[0];
        tmpDistance = parseInt(clientX - start + distance.current);
        if (tmpDistance <= minNum) tmpDistance = minNum;
        if (tmpDistance >= maxNum) tmpDistance = maxNum;

        setSliderNum(tmpDistance);

        sliderEl.style.transform = `translateX(${tmpDistance}px)`;
    };
    
    // 滑块结束
    const touchEnd = (e) => {
        e.preventDefault();
        distance.current = tmpDistance;

        const t = slideNumToTime(tmpDistance);
        onChange(t);

        e.target.removeEventListener('touchmove', touchMove, false);
        e.target.removeEventListener('touchend', touchEnd, false);
    };
    
    // 定义副作用，初始化事件
    useEffect(() => {
        if (sliderEl) {
            sliderEl.addEventListener('touchstart', touchStart);
        }
        return () => {
            if (sliderEl) {
                sliderEl.removeEventListener('touchstart', touchStart);
            }
        };
    }, [sliderEl]);
    
    // 定义副作用，初始化滑块参数
    useEffect(() => {
        if (sliderEl) {
            distance.current = timeToSliderNum;
            setSliderNum(timeToSliderNum);
            sliderEl.style.transform = `translateX(${distance.current}px)`;
        }
    }, [sliderEl, startNum]);

    // 格式化时间数据
    const formatTime = useMemo(() => {
        if (maxNum <= 0) return `${startNum}:00`.padStart(5, '0');
        return (numToTime(sliderNum, maxNum) + ':00').padStart(5, '0');
    }, [startNum, sliderNum]);

    return formatTime;
};
```

### 滑块组件

```jsx
import React, { useRef, useEffect, useState, memo } from 'react'
import './MySlider.css'
import { useSlider } from '../../hooks/useSlider'

export default memo(function MySlider(props) {
  const {
    currentStartHours,
    currentEndHours,
    onStartChanged,
    onEndChanged,
  } = props;
  
  const starRef = useRef()
  const endRef = useRef()
  const slideRef = useRef()

  // 获取滑块节点长度
  const [maxNum, setMaxNum] = useState(0)
    
  //开始滑块按钮
  const startSlider = useSlider(
      {
      minNum: 0,
      maxNum,
      startNum: currentStartHours,
      sliderEl: starRef.current,
    },
    onStartChanged
  )

  //结束滑块按钮
  const endSlider = useSlider(
    {
      minNum: 0,
      maxNum,
      startNum: currentEndHours,
      sliderEl: endRef.current,
    },
    onEndChanged
  )
  
  // 副作用，初始化获取滑块节点长度
  useEffect(() => {
    const sliderWidth = slideRef.current.clientWidth - 30
    setMaxNum(sliderWidth)
  }, [])

  return (
    <div className="option">
      <div className="slideBox" ref={slideRef}>
        <div className="line"></div>
        <span className="btn" ref={starRef}>
          <i>{startSlider}</i>
        </span>
        <span className="btn" ref={endRef}>
          <i>{endSlider}</i>
        </span>
      </div>
    </div>
  )
})
```

## 复习巩固

### 优化技巧

- 对于纯属性输入的组件，一般可以使用 `React.memo` 进行优化。
- 对于会影响子组件重新渲染的方法，使用`useMemo`和`useCallback`包裹，并添加对应依赖项，避免重复执行没必要的方法。

通过这个项目，对`useMemo`和`useCallback`的区别和作用有了更深刻的理解，`useMemo`返回依赖参数，`useCallback`返回依赖函数，可以类比vue中的计算属性`computed`。

> 记住，传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo

### useMemo 和 useCallback 的区别

`useMemo` 和 `useCallback` 接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于 `useMemo` 返回的是函数运行的结果， `useCallback` 返回的是函数。

### useMemo 和 memo 的区别

`useMemo`在某些情况下不希望组件对所有 props 做浅比较，只想实现局部 Pure 功能，即只想对特定的 props 做比较，并决定是否局部更新

### 异步加载组件

Suspense 配合 lazy 加载异步组件。

例如弹出框组件，在用户点击打开弹框按钮时，再异步加载组件，节省开销，使用如下：

```js
import React, { lazy, Suspense } from 'react';

const Modal = lazy(() => import('./Modal.jsx'));

// 组件调用
<Suspense fallback={<div>loading</div>}>
    <Modal {...params} />
</Suspense>
```

### useContext

对于嵌套层级深的组件传参，采用useContext简化

```js
import { createContext } from 'react';

export const TrainContext = createContext();

// 父组件
<TrainContext.Provider value={params}>
    <Candidate />
</TrainContext.Provider>

// 嵌套子组件
const Child = (props)=>{
    const params = useContext(TrainContext);
}
```

### useReducer

参考文档：[usereducer](https://reactjs.org/docs/hooks-reference.html#usereducer)

组件定义的 `useState` 特别多难以维护，使用 `useReducer` 在组件内部管理状态：

```js
import React, { useReducer } from 'react';

function myReducer(state, action) {
    const { type, payload } = action;

    switch (type) {
        case 'toggle':
            return {...state, open: !state.open};
        case 'reset':
            return {};
        default:
    }
    return state;
}

// 组件内部
const [state, dispatch]=useReducer(myReducer,{open:false})
```

### useRef

useRef不仅可以用来管理`DOM ref`，它还相当于 this , 可以存放任何变量，解决闭包带来的不方便性。


1.闭包问题：

点击按钮后，再点击弹窗，接着再点按钮，弹框结果是1。

```jsx
import React, { useState, useEffect } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)

  const handleCount = () => {
    setTimeout(() => {
      alert('current count: ' + count)
    }, 3000);
  }

  return (
    <div>
      <p>current count: { count }</p>
      <button onClick={() => setCount(count + 1)}>加</button>
      <button onClick={() => handleCount()}>弹框显示</button>
    </div>
  )
}
```

> 当我们更新状态的时候, React 会重新渲染组件, 每一次渲染都会拿到独立的 count 状态,  并重新渲染一个  handleCount 函数.  每一个 handleCount 里面都有它自己的 count 。

useRef 改造：

```js
const Counter = () => {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
  })

  const handleCount = () => {
    setTimeout(() => {
      alert('current count: ' + countRef.current)
    }, 3000);
  }

  //...
}
```

2、变更 `.current` 属性不会引发组件重新渲染，根据这个特性可以获取状态的前一个值：

```js
const Counter = () => {
  const [count, setCount] = useState(0)
  const preCountRef = useRef(count)

  useEffect(() => {
    preCountRef.current = count
  })

  return (
    <div>
      <p>pre count: { preCountRef.current }</p>
      <p>current count: { count }</p>
      <button onClick={() => setCount(count + 1)}>加</button>
    </div>
  )
}
```

3.操作 Dom 节点，类似 createRef()：

```js
import React, { useRef } from 'react'

const TextInput = () => {
  const inputEl = useRef(null)

  const onFocusClick = () => {
    if(inputEl && inputEl.current) {
      inputEl.current.focus()
    } 
  }

  return (
    <div>
      <input type="text" ref={inputEl}/>
      <button onClick={onFocusClick}>Focus the input</button>
    </div>
  )
}
```

文章参考：

[Typescript+React hooks开发](https://github.com/vortesnail/blog/issues/13)