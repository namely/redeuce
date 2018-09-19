export default (reducer, actionCreators) => {
  const fn = () => ({ reducer, ...actionCreators });
  fn.getReducer = () => reducer;
  fn.getActionCreators = () => actionCreators;

  return fn;
};
