import { arrayStoreGenerators, arrayStore } from 'index.js';

const makeEntityName = () => `random/${Math.round(Math.random() * 1000000000)}`;

describe('Array Store', () => {
  test('Array store provides the expected tools', () => {
    const entityName = makeEntityName();
    const generator = arrayStoreGenerators(entityName);
    const generated = generator();

    expect(generator).toHaveProperty('getActionCreators');
    expect(generator).toHaveProperty('getReducer');

    ['reducer', 'set', 'delete', 'insert', 'clear', 'push', 'pop', 'unshift', 'shift'].forEach(
      s => {
        expect(generated).toHaveProperty(s);
      },
    );

    expect(generator.getReducer()).toBe(generated.reducer);
    ['set', 'delete', 'insert', 'clear', 'push', 'pop', 'unshift', 'shift'].forEach(s => {
      expect(generator.getActionCreators()[s]).toBe(generated[s]);
    });
  });
  test('quick Array store provides the expected tools', () => {
    const entityName = makeEntityName();
    const gen = arrayStore(entityName);

    [('reducer', 'set', 'delete', 'insert', 'clear', 'push', 'pop', 'unshift', 'shift')].forEach(
      s => {
        expect(gen).toHaveProperty(s);
      },
    );
  });

  test('Array Stores are memoized', () => {
    const entityName = makeEntityName();
    const gen1 = arrayStoreGenerators(entityName);
    const gen2 = arrayStoreGenerators(entityName);
    const gen3 = arrayStore(entityName);

    expect(gen1).toBe(gen2);
    expect(gen3.set).toBe(gen1().set);
    expect(gen3.set).toBe(gen2().set);
    expect(gen3.reducer).toBe(gen1().reducer);
    expect(gen3.reducer).toBe(gen2().reducer);
  });

  test('memoized array with different options throw an error', () => {
    expect(() => {
      const entityName = makeEntityName();
      const gen1 = arrayStoreGenerators(entityName);
      const gen2 = arrayStoreGenerators(entityName, { defaultValue: 'uuid' });
    }).toThrow();
  });

  describe('Array Store action creators', () => {
    const entityName = makeEntityName();
    const actions = arrayStoreGenerators(entityName).getActionCreators();

    test('set', () => {
      expect(actions.set('hello', 2)).toEqual({
        type: `REDEUCE:ARRAY@@${entityName}@@SET`,
        payload: ['hello', 2],
      });
    });

    test('delete', () => {
      expect(actions.delete(2)).toEqual({
        type: `REDEUCE:ARRAY@@${entityName}@@DELETE`,
        payload: [2],
      });
    });

    test('insert', () => {
      expect(actions.insert('hello', 2)).toEqual({
        type: `REDEUCE:ARRAY@@${entityName}@@INSERT`,
        payload: ['hello', 2],
      });
    });

    test('clear', () => {
      expect(actions.clear()).toEqual({
        type: `REDEUCE:ARRAY@@${entityName}@@CLEAR`,
        payload: [],
      });
    });

    ['push', 'pop', 'unshift', 'shift'].forEach(verb => {
      test(`Array entity ${verb} action creator`, () => {
        expect(actions[verb]('hello')).toEqual({
          type: `REDEUCE:ARRAY@@${entityName}@@${verb.toUpperCase()}`,
          payload: ['hello'],
        });
      });
    });
  });

  describe('reducers', () => {
    const state = ['hello world'];

    test('default reducer call', () => {
      const entityName = makeEntityName();
      const { reducer } = arrayStore(entityName);

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual([]);
      expect(reducer(state, { type: 'NOTHING' })).toEqual(state);
    });

    test('default value', () => {
      const entityName = makeEntityName();
      const { reducer } = arrayStore(entityName, {
        defaultValue: ['hello'],
      });

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual(['hello']);
    });

    test('non array default value are automatically encapsulated in an array', () => {
      const entityName = makeEntityName();
      const { reducer } = arrayStore(entityName, {
        defaultValue: 'hello',
      });

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual(['hello']);
    });

    // set
    describe('set', () => {
      const entityName = makeEntityName();
      const { set, reducer } = arrayStore(entityName);

      test('set a value of the Array', () => {
        expect(reducer(['a'], set('b', 1))).toEqual(['a', 'b']);
        expect(reducer(['a'], set('b', 0))).toEqual(['b']);
        expect(reducer(['a', 'b'], set('b', 0))).toEqual(['b', 'b']);
      });
    });

    // delete
    describe('delete', () => {
      const entityName = makeEntityName();
      const { delete: del, reducer } = arrayStore(entityName);

      test('delete a value of the Array', () => {
        expect(reducer(['a'], del(0))).toEqual([]);
        expect(reducer(['a', 'b', 'c'], del(2))).toEqual(['a', 'b']);
        expect(reducer(['a', 'b', 'c'], del(1))).toEqual(['a', 'c']);
      });
    });

    // insert
    describe('insert', () => {
      const entityName = makeEntityName();
      const { insert, reducer } = arrayStore(entityName);

      test('insert a value in the Array', () => {
        expect(reducer(['a'], insert('b', 1))).toEqual(['a', 'b']);
        expect(reducer(['a'], insert('b', 0))).toEqual(['b', 'a']);
        expect(reducer(['a', 'b', 'c'], insert('aa', 1))).toEqual(['a', 'aa', 'b', 'c']);
      });
    });

    // clear
    describe('clear', () => {
      const entityName = makeEntityName();
      const { clear, reducer } = arrayStore(entityName);

      test('clear an Array', () => {
        expect(reducer(['a'], clear())).toEqual([]);
      });
      test('clear an Array ignore params', () => {
        expect(reducer(['a', 'b', 'c'], clear(1, 'aa'))).toEqual([]);
      });
    });

    // push
    describe('push', () => {
      const entityName = makeEntityName();
      const { push, reducer } = arrayStore(entityName);

      test('push a value into an Array', () => {
        expect(reducer(['a'], push('b'))).toEqual(['a', 'b']);
        expect(reducer(['a', 'b', 'c'], push('d'))).toEqual(['a', 'b', 'c', 'd']);
        expect(reducer(['a', 'b'], push('c', 'd', 'e'))).toEqual(['a', 'b', 'c', 'd', 'e']);
        expect(reducer(['a', 'b', 'c'], push())).toEqual(['a', 'b', 'c']);
        expect(reducer(['a', 'b', 'c'], push(undefined))).toEqual(['a', 'b', 'c', undefined]);
      });
    });

    // pop
    describe('pop', () => {
      const entityName = makeEntityName();
      const { pop, reducer } = arrayStore(entityName);

      test('pop an Array', () => {
        expect(reducer(['a'], pop())).toEqual([]);
        expect(reducer(['a', 'b', 'c'], pop())).toEqual(['a', 'b']);
      });
      test('pop an Array ignores params', () => {
        expect(reducer(['a', 'b', 'c'], pop('a'))).toEqual(['a', 'b']);
      });
    });

    // unshift
    describe('unshift', () => {
      const entityName = makeEntityName();
      const { unshift, reducer } = arrayStore(entityName);

      test('unshift a value into an Array', () => {
        expect(reducer(['a'], unshift('b'))).toEqual(['b', 'a']);
        expect(reducer(['b', 'c'], unshift('a'))).toEqual(['a', 'b', 'c']);
        expect(reducer(['c'], unshift('a', 'b'))).toEqual(['a', 'b', 'c']);
        expect(reducer(['a', 'b', 'c'], unshift())).toEqual(['a', 'b', 'c']);
        expect(reducer(['a', 'b', 'c'], unshift(undefined))).toEqual([undefined, 'a', 'b', 'c']);
      });
    });

    // shift
    describe('shift', () => {
      const entityName = makeEntityName();
      const { shift, reducer } = arrayStore(entityName);

      test('shift an Array', () => {
        expect(reducer(['a'], shift())).toEqual([]);
        expect(reducer(['a', 'b', 'c'], shift())).toEqual(['b', 'c']);
      });
      test('shift an Array ignores params', () => {
        expect(reducer(['a', 'b', 'c'], shift('c'))).toEqual(['b', 'c']);
      });
    });
  });
});
