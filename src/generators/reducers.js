const sortByKeyName = keyName => (a, b) => a[keyName] > b[keyName];
const getKeyNameValues = (entities, keyName) =>
  entities.map(({ [keyName]: id }) => id);

const filterByKeyname = (entities, keyName) =>
  entities.filter(({ [keyName]: id }) => id !== undefined);

const filterWithoutIndexes = (entities, indexes, keyName) =>
  entities.filter(({ [keyName]: id }) => indexes.indexOf(id) === -1);

const filterByIndexes = (entities, indexes, keyName) =>
  entities.filter(({ [keyName]: id }) => indexes.indexOf(id) > -1);

const findOneByIndex = (entities, keyName, uniqueId) =>
  entities.find(({ [keyName]: id }) => id === uniqueId);

export const buildReducer = (reducers, defaultValue) => (
  state = defaultValue,
  { type, payload }
) => (reducers[type] ? reducers[type](state, payload) : state);

const asArray = o => [].concat(o);

export const buildCollectionReducers = (actionTypes, keyName) => {
  const {
    SET,
    UPDATE,
    DELETE,
    MERGE,
    MERGEDEEP,
    DELETEALL,
    CLEAR
  } = actionTypes;

  // Reducer to SET a list of objects in the store
  const setReducer = (state, payload) => {
    const filteredPayload = filterByKeyname(asArray(payload), keyName);
    const setIndexes = getKeyNameValues(filteredPayload, keyName);

    return [
      // the list of objects from the previous state that are not to be replaced
      ...filterWithoutIndexes(state, setIndexes, keyName),
      // the list of new objects
      ...filteredPayload
    ].sort(sortByKeyName(keyName));
  };

  // Reducer to UPDATE a list of objects in the store
  const updateReducer = (state, payload) => {
    const filteredPayload = filterByKeyname(asArray(payload), keyName);
    const updateIndexes = getKeyNameValues(filteredPayload, keyName);
    const existingIndexes = getKeyNameValues(state, keyName);

    return [
      // the list of objects from the previous state that are not to be updated
      ...filterWithoutIndexes(state, updateIndexes, keyName),
      // the list of objects from the previous state that have to be updated
      // mapped to be merged with the new version
      ...filterByIndexes(state, updateIndexes, keyName).map(obj => ({
        ...obj,
        ...findOneByIndex(filteredPayload, keyName, obj[keyName])
      })),
      // the list new objects that are not existing in the previous state
      ...filterWithoutIndexes(filteredPayload, existingIndexes, keyName)
    ].sort(sortByKeyName(keyName));
  };

  // Reducer to DELETE a list of objects in the store
  const deleteReducer = (state, payload) => {
    const filteredPayload = filterByKeyname(asArray(payload), keyName);
    const setIndexes = getKeyNameValues(filteredPayload, keyName);

    return [
      // the list of objects from the previous state that are not to be deleted
      ...filterWithoutIndexes(state, setIndexes, keyName)
    ].sort(sortByKeyName(keyName));
  };

  const clearReducer = () => [];

  return {
    [SET]: setReducer,
    [UPDATE]: updateReducer,
    [DELETE]: deleteReducer,
    [MERGE]: setReducer,
    [MERGEDEEP]: updateReducer,
    [DELETEALL]: deleteReducer,
    [CLEAR]: clearReducer
  };
};

export const buildSimpleReducer = actionTypes => {
  const { SET } = actionTypes;

  // Reducer to SET a list of objects in the store
  const setReducer = (_, payload) => payload;

  return {
    [SET]: setReducer
  };
};
