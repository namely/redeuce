import { generateSimpleStore } from 'index.js';

const makeEntityName = () => `random/${Math.round(Math.random() * 1000000000)}`;

describe('Simple Store', () => {
  test('simple store provides the expected tools', () => {
    const entityName = makeEntityName();
    const gen = generateSimpleStore(entityName);
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

  test('Simple Stores are memoized', () => {
    const entityName = makeEntityName();
    const gen1 = generateSimpleStore(entityName);
    const gen2 = generateSimpleStore(entityName);

    expect(gen1).toBe(gen2);
  });

  test('memoized collections with different options throw an error', () => {
    expect(() => {
      const entityName = makeEntityName();
      const gen1 = generateSimpleStore(entityName);
      const gen2 = generateSimpleStore(entityName, { idKey: 'uuid' });
    }).toThrow();
  });

  describe('Simple Store action creators', () => {
    const entityName = makeEntityName();
    const actions = generateSimpleStore(entityName).getActionCreators();

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
      const { reducer } = generateSimpleStore(entityName)();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual(undefined);
      expect(reducer(state, { type: 'NOTHING' })).toEqual(state);
    });

    test('default value', () => {
      const entityName = makeEntityName();
      const { reducer } = generateSimpleStore(entityName, {
        defaultValue: 'thisIsADefaultValue',
      })();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual('thisIsADefaultValue');
    });

    // set

    test('set a simple value', () => {
      const entityName = makeEntityName();
      const value = 'world';
      const expected = value;

      const { set, reducer } = generateSimpleStore(entityName)();

      expect(reducer(state, set(value))).toEqual(expected);
    });
  });
});
