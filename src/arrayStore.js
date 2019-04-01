import { memoize, makeCallable } from './tools';

import { buildReducer, buildArrayReducers } from './generators/reducers';
import { ARRAY, generateActionTypes, generateActionCreators } from './generators/actions';

const generateArrayStore = memoize((entityName, { defaultValue = [] } = {}) => {
  const actionTypes = generateActionTypes(ARRAY, entityName);
  const actionCreators = generateActionCreators(ARRAY, entityName);

  const reducer = buildReducer(buildArrayReducers(actionTypes), [].concat(defaultValue));

  return makeCallable(reducer, actionCreators);
});

export default generateArrayStore;
export const arrayStore = (...args) => generateArrayStore(...args)();
