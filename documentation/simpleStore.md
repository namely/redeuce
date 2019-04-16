# Simple Store

```js
const {
  reducer,

  set,
} = arrayStore(uniqueIdentifier, options);
```

## Options

### defaultValue

```js
const { set, reducer } = simpleStore('examples/simple');
const store = createStore(reducer);
store.getState(); // null
```

```js
const { set, reducer } = simpleStore('examples/simple', { defaultValue: ['hello'] });
const store = createStore(reducer);
store.getState(); // ['hello']
```

```js
const { set, reducer } = simpleStore('examples/simple', { defaultValue: 42 });
const store = createStore(reducer);
store.getState(); // 42
```

## Action Creators

### set

`set(value, index)`

```js
const { set, reducer } = arrayStore('examples/simple');
const store = createStore(reducer);

store.getState(); // null
store.dispatch(set('hello'))); // 'hello'
store.dispatch(set(3)); // 3
store.dispatch(set(true)); // true
```
