import { simpleStoreGenerators, simpleStore, generateSimpleStore } from 'index.js';

const makeEntityName = () => `random/${Math.round(Math.random() * 1000000000)}`;

describe('Simple Store', () => {
  test('alias', () => {
    expect(generateSimpleStore).toBe(simpleStoreGenerators);
  });

  test('simple store provides the expected tools', () => {
    const entityName = makeEntityName();
    const gen = simpleStoreGenerators(entityName);
    expect(gen).toHaveProperty('getActionCreators');
    expect(gen).toHaveProperty('getReducer');

    expect(gen()).toHaveProperty('set');
    expect(gen()).toHaveProperty('reducer');
    expect(gen()).not.toHaveProperty('update');
    expect(gen()).not.toHaveProperty('delete');
    expect(gen()).not.toHaveProperty('merge');
    expect(gen()).not.toHaveProperty('mergeDeep');
    expect(gen()).not.toHaveProperty('deleteAll');
    expect(gen()).not.toHaveProperty('clear');

    expect(gen.getReducer()).toBe(gen().reducer);

    expect(gen.getActionCreators().set).toBe(gen().set);
  });
  test('quick simple store provides the expected tools', () => {
    const entityName = makeEntityName();
    const gen = simpleStore(entityName);

    expect(gen).toHaveProperty('set');
    expect(gen).toHaveProperty('reducer');
    expect(gen).not.toHaveProperty('update');
    expect(gen).not.toHaveProperty('delete');
    expect(gen).not.toHaveProperty('merge');
    expect(gen).not.toHaveProperty('mergeDeep');
    expect(gen).not.toHaveProperty('deleteAll');
    expect(gen).not.toHaveProperty('clear');
  });

  test('Simple Stores are memoized', () => {
    const entityName = makeEntityName();
    const gen1 = simpleStoreGenerators(entityName);
    const gen2 = simpleStoreGenerators(entityName);
    const gen3 = simpleStore(entityName);

    expect(gen1).toBe(gen2);
    expect(gen3.set).toBe(gen1().set);
    expect(gen3.set).toBe(gen2().set);
    expect(gen3.reducer).toBe(gen1().reducer);
    expect(gen3.reducer).toBe(gen2().reducer);
  });

  test('memoized collections with different options throw an error', () => {
    expect(() => {
      const entityName = makeEntityName();
      const gen1 = simpleStoreGenerators(entityName);
      const gen2 = simpleStoreGenerators(entityName, { idKey: 'uuid' });
    }).toThrow();
  });

  describe('Simple Store action creators', () => {
    const entityName = makeEntityName();
    const actions = simpleStoreGenerators(entityName).getActionCreators();

    test('single entity set action creator', () => {
      expect(actions.set('hello')).toEqual({
        type: `REDEUCE:SIMPLE@@${entityName}@@SET`,
        payload: 'hello',
      });
    });
  });

  describe('reducers', () => {
    const state = 'hello world';

    // default

    test('default reducer call', () => {
      const entityName = makeEntityName();
      const { reducer } = simpleStoreGenerators(entityName)();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual(null);
      expect(reducer(state, { type: 'NOTHING' })).toEqual(state);
    });

    test('default value', () => {
      const entityName = makeEntityName();
      const { reducer } = simpleStoreGenerators(entityName, {
        defaultValue: 'thisIsADefaultValue',
      })();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual('thisIsADefaultValue');
    });

    // set

    test('set a simple value', () => {
      const entityName = makeEntityName();
      const value = 'world';
      const expected = value;

      const { set, reducer } = simpleStoreGenerators(entityName)();

      expect(reducer(state, set(value))).toEqual(expected);
    });
  });
});
