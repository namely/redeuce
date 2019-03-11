# Array Store

```js
const {
  reducer,

  set,
  delete,
  insert,
  clear,
  push,
  pop,
  unshift,
  shift
} = arrayStore(uniqueIdentifier, options);
```

## Options

### defaultValue

```js
const { set, reducer } = arrayStore('examples/array');
const store = createStore(reducer);
store.getState(); // []
```

```js
const { set, reducer } = arrayStore('examples/array', { defaultValue: ['hello'] });
const store = createStore(reducer);
store.getState(); // ['hello']
```

```js
const { set, reducer } = arrayStore('examples/array', { defaultValue: 42 });
const store = createStore(reducer);
store.getState(); // [42]
```

## Action Creators

### set

`set(value, index)`

```js
const { set, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2]
store.dispatch(set(1, 0)); // [1, 1, 2]
store.dispatch(set(3, 2)); // [1, 1, 3]
store.dispatch(set(2, 1)); // [1, 2, 3]
```

### delete

`delete(index)`

```js
const { delete: del, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2, 3, 4] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2, 3, 4]
store.dispatch(del(0)); // [1, 2, 3, 4]
store.dispatch(del(2)); // [1, 2, 4]
```

### insert

`insert(value, index)`

```js
const { insert, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2, 3, 4] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2, 3, 4]
store.dispatch(insert(1.5, 2)); // [0, 1, 1.5, 2, 3, 4]
store.dispatch(insert(2.5, 4)); // [0, 1, 1.5, 2, 2.5, 3, 4]
```

### clear

`clear()`

```js
const { clear, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2, 3, 4] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2, 3, 4]
store.dispatch(clear()); // []
```

### push

`push(value)`

```js
const { push, reducer } = arrayStore('examples/array');
const store = createStore(reducer);

store.getState(); // []
store.dispatch(push('hello')); // ['hello']
store.dispatch(push('cruel')); // ['hello', 'cruel']
store.dispatch(push('world')); // ['hello', 'cruel', 'world']
store.dispatch(push(1, 2, 3)); // ['hello', 'cruel', 'world', 1, 2, 3]
```

### pop

`pop()`

```js
const { pop, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2, 3, 4] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2, 3, 4]
store.dispatch(pop()); // [0, 1, 2, 3]
store.dispatch(pop()); // [0, 1, 2]
```

## unshift

`unshift(value)`

```js
const { unshift, reducer } = arrayStore('examples/array');
const store = createStore(reducer);

store.getState(); // []
store.dispatch(unshift(3)); // [3]
store.dispatch(unshift(2)); // [2, 3]
store.dispatch(unshift(1)); // [1, 2, 3]
store.dispatch(unshift(0)); // [0, 1, 2, 3]
store.dispatch(unshift(-3, -2, -1)); // [-3, -2, -1, 0, 1, 2, 3]
```

## shift

`shift()`

```js
const { shift, reducer } = arrayStore('examples/array', { defaultValue: [0, 1, 2, 3, 4] });
const store = createStore(reducer);

store.getState(); // [0, 1, 2, 3]
store.dispatch(shift()); // [1, 2, 3]
store.dispatch(shift()); // [2, 3]
store.dispatch(shift()); // [3]
```
