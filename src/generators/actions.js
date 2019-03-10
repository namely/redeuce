export const SIMPLE = 'SIMPLE';
export const COLLECTION = 'COLLECTION';
export const ARRAY = 'ARRAY';
export const VERBS = {
  [SIMPLE]: {
    SET: 'set',
  },
  [COLLECTION]: {
    SET: 'set',
    UPDATE: 'update',
    DELETE: 'delete',
    MERGE: 'merge',
    MERGEDEEP: 'mergeDeep',
    DELETEALL: 'deleteAll',
    CLEAR: 'clear',
  },
  [ARRAY]: {
    SET: 'set',
    DELETE: 'delete',
    INSERT: 'insert',
    CLEAR: 'clear',
    PUSH: 'push',
    POP: 'pop',
    UNSHIFT: 'unshift',
    SHIFT: 'shift',
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

const generateActionCreator = type => (...payload) => ({ type, payload });
export const generateActionCreators = (storeType, entityId) => {
  const actionTypes = generateActionTypes(storeType, entityId);
  return Object.keys(VERBS[storeType]).reduce(
    (actionCreators, verb) => ({
      ...actionCreators,
      [VERBS[storeType][verb]]: generateActionCreator(actionTypes[verb]),
    }),
    {},
  );
};
