import { collectionStoreGenerators, collectionStore, generateCollectionStore } from 'index.js';

const makeEntityName = () => `random/${Math.round(Math.random() * 1000000000)}`;

describe('Collection Store', () => {
  test('alias', () => {
    expect(generateCollectionStore).toBe(collectionStoreGenerators);
  });

  test('collection provide the expected tools', () => {
    const entityName = makeEntityName();
    const gen = collectionStoreGenerators(entityName);
    expect(gen).toHaveProperty('getActionCreators');
    expect(gen).toHaveProperty('getReducer');

    expect(gen()).toHaveProperty('set');
    expect(gen()).toHaveProperty('update');
    expect(gen()).toHaveProperty('delete');
    expect(gen()).toHaveProperty('merge');
    expect(gen()).toHaveProperty('mergeDeep');
    expect(gen()).toHaveProperty('deleteAll');
    expect(gen()).toHaveProperty('clear');
    expect(gen()).toHaveProperty('reducer');

    expect(gen.getReducer()).toBe(gen().reducer);

    expect(gen.getActionCreators().set).toBe(gen().set);
    expect(gen.getActionCreators().update).toBe(gen().update);
    expect(gen.getActionCreators().delete).toBe(gen().delete);
    expect(gen.getActionCreators().merge).toBe(gen().merge);
    expect(gen.getActionCreators().mergeDeep).toBe(gen().mergeDeep);
    expect(gen.getActionCreators().deleteAll).toBe(gen().deleteAll);
    expect(gen.getActionCreators().clear).toBe(gen().clear);
  });

  test('quick collection provide the expected tools', () => {
    const entityName = makeEntityName();
    const gen = collectionStore(entityName);

    expect(gen).toHaveProperty('set');
    expect(gen).toHaveProperty('update');
    expect(gen).toHaveProperty('delete');
    expect(gen).toHaveProperty('merge');
    expect(gen).toHaveProperty('mergeDeep');
    expect(gen).toHaveProperty('deleteAll');
    expect(gen).toHaveProperty('clear');
    expect(gen).toHaveProperty('reducer');
  });

  test('collection are memoized', () => {
    const entityName = makeEntityName();
    const gen1 = collectionStoreGenerators(entityName);
    const gen2 = collectionStoreGenerators(entityName);
    const gen3 = collectionStore(entityName);

    expect(gen1).toBe(gen2);
    expect(gen3.reducer).toBe(gen1().reducer);
    expect(gen3.reducer).toBe(gen2().reducer);
  });

  test('memoized collections with different options throw an error', () => {
    expect(() => {
      const entityName = makeEntityName();
      const gen1 = collectionStoreGenerators(entityName);
      const gen2 = collectionStoreGenerators(entityName, { idKey: 'uuid' });
    }).toThrow();
  });

  describe('collection action creators', () => {
    const entityName = makeEntityName();
    const actions = collectionStoreGenerators(entityName).getActionCreators();

    test('single entity set action creator', () => {
      expect(actions.set('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@SET`,
        payload: 'hello',
      });
    });
    test('single update action creator', () => {
      expect(actions.update('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@UPDATE`,
        payload: 'hello',
      });
    });
    test('single delete action creator', () => {
      expect(actions.delete('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@DELETE`,
        payload: 'hello',
      });
    });

    test('bulk entities set action creator', () => {
      expect(actions.merge('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@MERGE`,
        payload: 'hello',
      });
    });
    test('bulk update action creator', () => {
      expect(actions.mergeDeep('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@MERGEDEEP`,
        payload: 'hello',
      });
    });
    test('bulk delete action creator', () => {
      expect(actions.deleteAll('hello')).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@DELETEALL`,
        payload: 'hello',
      });
    });
    test('clear action creator', () => {
      expect(actions.clear()).toEqual({
        type: `REDEUCE:COLLECTION@@${entityName}@@CLEAR`,
      });
    });
  });

  describe('reducers', () => {
    const state = [
      { id: 1, name: 'hello', value: 'world' },
      { id: 2, name: 'foo', value: 'bar', option: 'baz' },
    ];
    const stateUuid = state.map(({ id, ...props }) => ({ uuid: id, ...props }));

    // default

    test('default reducer call', () => {
      const entityName = makeEntityName();
      const { reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual([]);
    });

    test('default value', () => {
      const entityName = makeEntityName();
      const defaultValue = [{ id: 'yes' }];
      const { reducer } = collectionStoreGenerators(entityName, {
        defaultValue,
      })();

      expect(reducer(undefined, { type: 'NOTHING' })).toEqual(defaultValue);
    });

    // set Single

    test('set a single entity', () => {
      const entityName = makeEntityName();
      const entity = { id: 3, name: 'hello' };
      const expected = [...state, entity];

      const { set, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, set(entity))).toEqual(expected);
    });

    test('set a single entity: replace exisitng one', () => {
      const entityName = makeEntityName();
      const entity = { id: 1, newkey: 'modified' };
      const expected = [state[1], entity];

      const { set, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, set(entity))).toEqual(expected);
    });
    test('set a single entity: replace exisitng one - with a custom id key', () => {
      const entityName = makeEntityName();
      const entity = { uuid: 1, newkey: 'modified' };
      const expected = [stateUuid[1], entity];

      const { set, reducer } = collectionStoreGenerators(entityName, {
        idKey: 'uuid',
      })();

      expect(reducer(stateUuid, set(entity))).toEqual(expected);
    });
    test('set a single entity: it should ignore payloads with no id', () => {
      const entityName = makeEntityName();
      const entity = { name: 'hello' };
      const expected = state;

      const { set, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, set(entity))).toEqual(expected);
    });
    test('set a single entity ignore object with no custom id', () => {
      const entityName = makeEntityName();
      const entity = { id: 4, name: 'hello' };
      const expected = stateUuid;

      const { set, reducer } = collectionStoreGenerators(entityName, {
        idKey: 'uuid',
      })();

      expect(reducer(stateUuid, set(entity))).toEqual(expected);
    });

    // update Single

    test('update a single entity', () => {
      const entityName = makeEntityName();
      const entity = { id: 1, bar: 'baz' };
      const expected = [state[1], { ...state[0], bar: 'baz' }];

      const { update, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, update(entity))).toEqual(expected);
    });
    test('update a single entity with custom id key', () => {
      const entityName = makeEntityName();
      const entity = { uuid: 1, bar: 'baz' };
      const expected = [stateUuid[1], { ...stateUuid[0], bar: 'baz' }];

      const { update, reducer } = collectionStoreGenerators(entityName, {
        idKey: 'uuid',
      })();

      expect(reducer(stateUuid, update(entity))).toEqual(expected);
    });
    test('update a single entity: it should insert non exisiting id', () => {
      const entityName = makeEntityName();
      const entity = { id: 3, bar: 'baz' };
      const expected = [...state, entity];

      const { update, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, update(entity))).toEqual(expected);
    });
    test('update a single entity: it should ignore object with no id', () => {
      const entityName = makeEntityName();
      const entity = { id: 3, bar: 'baz' };
      const expected = [...state, entity];

      const { update, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, update(entity))).toEqual(expected);
    });

    // delete Single

    test('delete a single entity', () => {
      const entityName = makeEntityName();
      const entity = { id: 1 };
      const expected = [state[1]];

      const { reducer, ...actions } = collectionStoreGenerators(entityName)();

      expect(reducer(state, actions.delete(entity))).toEqual(expected);
    });

    test('delete ignore non existent', () => {
      const entityName = makeEntityName();
      const entity = { id: 4 };
      const expected = state;

      const { reducer, ...actions } = collectionStoreGenerators(entityName)();

      expect(reducer(state, actions.delete(entity))).toEqual(expected);
    });

    // set Bulk

    test('set a bulk of entities', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 3, name: 'hello' }, { id: 4, name: 'baz' }];
      const expected = [...state, ...entities];

      const { merge, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, merge(entities))).toEqual(expected);
    });
    test('set a bulk of entities: it should replace existing ones', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 2, name: 'hello' }, { id: 3, name: 'baz' }];
      const expected = [state[0], ...entities];

      const { merge, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, merge(entities))).toEqual(expected);
    });
    test('set a bulk of entities: it should ignore object with no id', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 2, name: 'hello' }, { id: 3, name: 'baz' }, { name: '4' }];
      const expected = [state[0], entities[0], entities[1]];

      const { merge, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, merge(entities))).toEqual(expected);
    });
    test('set a bulk of entities: ignore object with no custom id', () => {
      const entityName = makeEntityName();
      const entities = [{ uuid: 2, name: 'hello' }, { uuid: 3, name: 'baz' }, { id: 4, name: '4' }];
      const expected = [stateUuid[0], entities[0], entities[1]];

      const { merge, reducer } = collectionStoreGenerators(entityName, {
        idKey: 'uuid',
      })();

      expect(reducer(stateUuid, merge(entities))).toEqual(expected);
    });

    // update Bulk

    test('update a bulk of entities', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 1, newKey: 'newValue' }, { id: 2, newKey: 'newValue' }];
      const expected = [{ ...state[0], newKey: 'newValue' }, { ...state[1], newKey: 'newValue' }];

      const { mergeDeep, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, mergeDeep(entities))).toEqual(expected);
    });
    test('update a bulk of entities: it should inserts new ids', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 2, newKey: 'newValue' }, { id: 3, newKey: 'newValue' }];
      const expected = [
        state[0],
        { ...state[1], newKey: 'newValue' },
        { id: 3, newKey: 'newValue' },
      ];

      const { mergeDeep, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, mergeDeep(entities))).toEqual(expected);
    });

    // delete Bulk

    test('delete a bulk of entities', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 1, newKey: 'newValue' }, { id: 2, newKey: 'newValue' }];
      const expected = [];

      const { deleteAll, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, deleteAll(entities))).toEqual(expected);
    });
    test('delete a bulk of entities: it should ignore non existing ids', () => {
      const entityName = makeEntityName();
      const entities = [{ id: 3, newKey: 'newValue' }, { id: 4, newKey: 'newValue' }];
      const expected = state;

      const { deleteAll, reducer } = collectionStoreGenerators(entityName)();

      expect(reducer(state, deleteAll(entities))).toEqual(expected);
    });

    // clear

    test('clear all entities', () => {
      const entityName = makeEntityName();
      const expected = [];

      const { reducer, clear } = collectionStoreGenerators(entityName)();

      expect(reducer(state, clear())).toEqual(expected);
    });
  });
});
