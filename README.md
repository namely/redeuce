# Redeuce

`redeuce` is a collection of tools that generates micro redux store.

Let's take as an example a redux store designed as follow:

```json
{
  "ui": {
    "isLoading": false,
    "filter": ""
  },
  "db": {
    "users": [
      { "id": 1, "firstname": "john", "lastname": "doe" },
      { "id": 2, "firstname": "thi", "lastname": "tran" }
    ],
    "messages": [
      { "mId": 1, "message": "hello", "senderId": 1 },
      { "mId": 2, "message": "sup?", "senderId": 2 }
    ]
  }
}
```

Redeuce will help you splitting this store into 4 easily manageable sub part.

- `ui` that consist of two simple keys:
  - `isLoading`
  - `filter`
- `db` that consists of two collection keys:
  - `users`
  - `messages`

## simpleStore

Let's first take a look at the simple keys: `isLoading` and `filter`.
A `simpleStore` will generate a reducer and a single action-creator associated to set the value.

```js
// /store/ui.js
import { combineReducers } from 'redux';
import { simpleStore } from 'redeuce';

// 'ui/isLoading' is a unique identifier for this store.
// it can be anything, as long as it is unique.
const { set: setIsLoading, reducer: isLoading } = simpleStore('ui/isLoading', {
  defaultValue: true,
});
const { set: setFilter, reducer: filter } = simpleStore('ui/filter');

// action creators
export { setIsLoading, setFilter };
// reducer creators
export default combineReducers({
  isLoading,
  filter,
});
```

From there, you have a reducer to use in your store and 2 action-creators to update the loading/ready keys in your store. No need to create action-types or switch cases in a reducer. `redeuce` generates all that for you.

```js
// /index.js
import { createStore } from 'redux';
import ui, { setIsLoading, setFilter } from './store/ui';

const store = createStore({ ui });
console.log(store.getState()); // { ui: { isLoading: true, filter: null }

store.dispatch(setIsLoading(false));
console.log(store.getState()); // { ui: { isLoading: false, filter: null }

store.dispatch(setFilter('name'));
console.log(store.getState()); // { ui: { isLoading: false, filter: 'name' }
```

## collectionStore

A collection is an array of object that can be identified by a common key.
That common key is configurable, but will be defaulted as `id`.

```js
// /store/db.js
import { combineReducers } from 'redux';
import { collectionStore } from 'redeuce';

const { set: setUser, merge: mergeUsers, reducer: users } = collectionStore('db/users');
const {
  set: setMessage,
  delete: deleteMessage,
  mergeDeep: mergeDeepMessages,
  reducer: messages,
} = collectionStore('db/messages', { idkey: 'mId' });

// action creators
export { setUser, mergeUsers, setMessage, deleteMessage, mergeDeepMessages };
// reducer creators
export default combineReducers({
  users,
  messages,
});
```

We just created some powerful tools to manage our collections in a redux store:

```js
// /index.js
import { createStore } from 'redux';
import db,  setUser, mergeUsers, setMessage, deleteMessage, mergeDeepMessages } from './store/db';

const store = createStore({ db });
console.log(store.getState());
/*
{
  db: { users: [], messages: [] },
}
*/

store.dispatch(setUser({id: 1, name: 'john' }));
console.log(store.getState());/*
{
  db: { users: [{id: 1, name: 'john' }], messages: [] },
}
*/

store.dispatch(mergeUsers([{ id: 2, name: 'thi' }, {id: 3, name: 'Pedro' }]));
console.log(store.getState());
/*
{
  db: {
    users: [
      { id: 1, name: 'john' },
      { id: 2, name: 'thi' },
      { id: 3, name: 'Pedro' },
    ],
    messages: [] },
}
*/

store.dispatch(setMessage([{ mid: 1, message: 'hello' }]));
console.log(store.getState());
/*
{
  db: {
    users: [
      { id: 1, name: 'john' },
      { id: 2, name: 'thi' },
      { id: 3, name: 'Pedro' },
    ],
    messages: [
      { mid: 1, message: 'hello' },
    ]
  },
}
*/

store.dispatch(mergeDeepMessages([{ mid: 1, user: 1 }, { mid: 2, message: 'world' }]));
console.log(store.getState());
/*
{
  db: {
    users: [
      { id: 1, name: 'john' },
      { id: 2, name: 'thi' },
      { id: 3, name: 'Pedro' },
    ],
    messages: [
      { mid: 1, message: 'hello', user: 1 },
      { mid: 2, message: 'world' },
    ]
  },
}
*/
```

## what now?

- See the basic example (TODO)
- Read the full API (TODO)
