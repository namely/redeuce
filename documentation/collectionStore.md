# Collection Store

```js
const {
  reducer,

  set,
  update,
  delete,
  clear,
} = collectionStore(uniqueIdentifier, options);
```

## Options

### idKey

```js
const { set, reducer } = collectionStore('examples/collection');
const store = createStore(reducer);
store.getState(); // []
store.dispatch(set({ id: 1, name: 'user 1' })); // [{ id: 1, name: 'user 1'}]
store.dispatch(set({ uuid: 2, name: 'user 2' })); // [{ id: 1, name: 'user 1'}]
```

```js
const { set, reducer } = collectionStore('examples/collection', { idKey: 'uuid' });
const store = createStore(reducer);
store.getState(); // []
store.dispatch(set({ id: 1, name: 'user 1' })); // []
store.dispatch(set({ uuid: 2, name: 'user 2' })); // [{ uuid: 2, name: 'user 2'}]
```

### defaultValue

```js
const { set, reducer } = collectionStore('examples/collection');
const store = createStore(reducer);
store.getState(); // []
```

```js
const { set, reducer } = collectionStore('examples/collection', {
  defaultValue: [{ id: 1, name: 'user 1' }],
});
const store = createStore(reducer);
store.getState(); // [{ id: 1, name: 'user 1' }]
```

## Action Creators

### set

`set(object | array<object>)`

```js
const { set, reducer } = collectionStore('examples/collection');
const store = createStore(reducer);

store.getState(); // []
store.dispatch(set({ id: 1, n: '1' })); // [{ id: 1, n: '1' }]
store.dispatch(set([{ id: 2, n: '2' }, { id: 3, n: '3' }])); // [{ id: 1, n: '1' }, { id: 2, n: '2' }, { id: 3, n: '3' }]
store.dispatch(set({ id: 1, n: 'one' })); // [{ id: 2, n: '2' }, { id: 3, n: '3' }, { id: 1, n: 'one' }]
```

### update

`update(object | array<object>)`

```js
const { set, update, reducer } = collectionStore('examples/collection');
const store = createStore(reducer);

store.getState(); // []
store.dispatch(set([{ id: 1, n: '1' }, { id: 2, n: '2' }])); // [{ id: 1, n: '1' }, { id: 2, n: '2' }]
store.dispatch(update({ id: 1, v: 'one' })); // [{ id: 1, n: '1', v: 'one' }, { id: 2, n: '2' }]
store.dispatch(update([{ id: 1, v: 'ONE' }, { id: 2, v: 'TWO' }])); // [{ id: 1, n: '1', v: 'ONE' }, { id: 2, n: '2', v: 'TWO' }]
```

### delete

`delete(object | array<object>)`

```js
const { delete: del, reducer } = collectionStore('examples/collection', {
  defaultValue: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
});
const store = createStore(reducer);

store.getState(); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
store.dispatch(del({ id: 1 })); // [{ id: 2 }, { id: 3 }, { id: 4 }]
store.dispatch(del([{ id: 2 }, { id: 3 }])); // [{ id: 4 }]
```

### clear

`clear()`

```js
const { clear, reducer } = collectionStore('examples/collection', {
  defaultValue: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
});
const store = createStore(reducer);

store.getState(); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
store.dispatch(clear()); // []
```
