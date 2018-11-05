import { memoize, makeCallable } from './tools';

import { buildReducer, buildSimpleReducer } from './generators/reducers';
import { SIMPLE, generateActionTypes, generateActionCreators } from './generators/actions';

const generateSimpleStore = memoize((entityName, { defaultValue = null } = {}) => {
  const actionTypes = generateActionTypes(SIMPLE, entityName);
  const actionCreators = generateActionCreators(SIMPLE, entityName);

  const reducer = buildReducer(buildSimpleReducer(actionTypes), defaultValue);

  return makeCallable(reducer, actionCreators);
});

export const simpleStore = (...args) => generateSimpleStore(...args)();
export default generateSimpleStore;
