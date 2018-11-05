import { memoize, makeCallable } from './tools';

import { buildReducer, buildCollectionReducers } from './generators/reducers';
import { COLLECTION, generateActionTypes, generateActionCreators } from './generators/actions';

const generateCollectionStore = memoize((entityName, { idKey = 'id', defaultValue = [] } = {}) => {
  const actionTypes = generateActionTypes(COLLECTION, entityName);
  const actionCreators = generateActionCreators(COLLECTION, entityName);

  const reducer = buildReducer(buildCollectionReducers(actionTypes, idKey), defaultValue);

  return makeCallable(reducer, actionCreators);
});

export default generateCollectionStore;
export const collectionStore = (...args) => generateCollectionStore(...args)();
