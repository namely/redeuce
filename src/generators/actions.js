export const SIMPLE = 'SIMPLE';
export const COLLECTION = 'COLLECTION';
export const ARRAY = 'ARRAY';
export const VERBS = {
  [SIMPLE]: {
    SET: { name: 'set' },
  },
  [COLLECTION]: {
    SET: { name: 'set' },
    UPDATE: { name: 'update' },
    DELETE: { name: 'delete' },
    MERGE: { name: 'merge' },
    MERGEDEEP: { name: 'mergeDeep' },
    DELETEALL: { name: 'deleteAll' },
    CLEAR: { name: 'clear' },
  },
  [ARRAY]: {
    SET: { name: 'set', arity: true },
    SETIN: { name: 'setIn', arity: true },
    DELETE: { name: 'delete' },
    INSERT: { name: 'insert', arity: true },
    CLEAR: { name: 'clear' },
    PUSH: { name: 'push', arity: true },
    POP: { name: 'pop', arity: true },
    UNSHIFT: { name: 'unshift', arity: true },
    SHIFT: { name: 'shift', arity: true },
  },
};

const generateActionType = (storeType, entityName, verb) =>
  `REDEUCE:${storeType}@@${entityName}@@${verb}`;
export const generateActionTypes = (storeType, entityId) =>
  Object.keys(VERBS[storeType]).reduce(
    (actionTypes, verb) => ({
      ...actionTypes,
      [verb]: generateActionType(storeType, entityId, verb),
    }),
    {},
  );

const generateActionCreator = (type, arity) => (...payload) =>
  arity ? { type, payload } : { type, payload: payload[0] };

export const generateActionCreators = (storeType, entityId) => {
  const actionTypes = generateActionTypes(storeType, entityId);
  return Object.keys(VERBS[storeType]).reduce((actionCreators, verb) => {
    const { name, arity } = VERBS[storeType][verb];

    return {
      ...actionCreators,
      [name]: generateActionCreator(actionTypes[verb], arity),
    };
  }, {});
};
