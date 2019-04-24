# Redeuce API

## Base

```js
const {
  reducer,
  ...actionCreators,
} = generator(uniqueIdentifier, options);
```

### uniqueIdentifier

The `uniqueIdentifier` is needed by redeuce to create unique action types for its internal reducer.
It needs to be a string and can be anything as long as it is unique across all instances of `simpleStore`.
Technically, this can be anything. It will be useful for you as you look into the redux dev tools to see what actions are dispatched.

### options

Each generator can have it's own specific options, see each generator doc below for more details.

## Generators

- simpleStore - [api](./simpleStore.md)
- arrayStore - [api](./arrayStore.md)
- collectionStore - [api](./collectionStore.md)
