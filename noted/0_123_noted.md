## 初始化

```sh
npx create-react-app train-ticket
```

## 调试插件

react-devtools

## 开启 eject
```sh
npm run eject
```

## 新特性

- Content
- ContextType
- lazy
- Suspense
- memo

### Context

- api
const {Provider,Consumer} = createContext(defaultParams)




### contextType

```tsx
class Leaf extends Component {
	static contextType = BatteryContext;
    render(){
    const battery = this.context;
    	return (
        	<h1>{battery}</h1>
        )
    }
}
```

### lazy & Suspense

- Webpack - Code Splitting
- import

```tsx
const About = lazy(()=>import(/* webpack chunk name */"./About"))

class App extends Component {
	render(){
		return (
			<div>
				<Suspense fallback={<div>loading</div>}>
					<About></About>
				</Suspense>
			</div>
		)
	}
}
```

### memo

未改变状态的子组件不做渲染

方法一：shouldComponentUpdate


```tsx
class Foo extends Component {
	shouldComponentUpdate(nextProps,nextState){
		if(nextProps.name === this.props.name) return false;

		return true;
	}
	render(){
		console.log("Foo render")
		return null
	}
}

class App extends Component {
	state = {count:0};
	render(){
		return (
			<div>
				<button onClick={()=>this.setState({count:count+1})}>add</button>
				<Foo name="Mike" />
			</div>
		)
	}
}
```

方法二：PureComponent
```tsx
class Foo extends PureComponent {
	render(){
		console.log("Foo render")
		return null
	}
}

class App extends Component {
	state = {count:0};
	render(){
		return (
			<div>
				<button onClick={()=>this.setState({count:count+1})}>add</button>
				<Foo name="Mike" />
			</div>
		)
	}
}
```

如果props属性是对象，即便父组件对象发生了变化，接收变化组件的子组件也没有更新：
```tsx
class Foo extends PureComponent {
	render(){
		console.log("Foo render")
		return <div>{this.props.person.age}</div>
	}
}

class App extends Component {
	state = {
		count:0,
		person:{
			age: 1
		}
	};
	render(){
		const person = this.state.person
		return (
			<div>
				<button onClick={()=>{
					person.age++;
					this.setState({person})
				}}>add</button>
				<Foo person={person} />
			</div>
		)
	}
}
```

> 只有 props 第一级的属性发生变化时，PureComponent 继承的组件才会发生变化

还有一种情况，当父组件传给子组件的属性没有发生变化，但是传递属性存在匿名函数时，父组件state的变化也会触发子组件的更新：

```tsx
class Foo extends PureComponent {
	render(){
		console.log("Foo render")
		return <div>{this.props.person.age}</div>
	}
}

class App extends Component {
	state = {
		count:0,
		person:{
			age: 1
		}
	};
	render(){
		const person = this.state.person
		return (
			<div>
				<button onClick={()=>{
					person.age++;
					this.setState({count:this.state.count+1})
				}}>add</button>
				<Foo person={person} cb={()=>{}} />
			</div>
		)
	}
}
```

解决办法,将匿名函数声明到组件：

```diff
class App extends Component {
	state = {...}
+	callback(){}
	render(){
		const person = this.state.person
		return (
			<div>
				<button onClick={()=>{
					person.age++;
					this.setState({count:this.state.count+1})
				}}>add</button>
+				<Foo person={person} cb={this.callback} />
			</div>
		)
	}
}
```

同时会产生另外一个问题，`callback`函数的this指针会出现问题，解决办法是通过箭头函数声明：
```diff
class App extends Component {
	state = {...}
+	callback=()=>{}
	render(){
		...
	}
}
```

方法三：memo

memo 包裹函数：

```tsx
const Foo = memo(function Foo(props){
	console.log("Foo render")
	return <div>{props.person.age}</div>
})
```

