import debug from 'debug';

/* eslint-disable */
const stateLogger = debug('setState:');
export default context => {
  const setState = context.setState;
  context.setState = function(nextState, cb) {
    stateLogger('Name: ', context.constructor.name);
    stateLogger('Old state: ', context.state);
    setState.apply(context, [
      nextState,
      () => {
        if (typeof cb === 'function') cb();
        stateLogger('New state: ', context.state);
      },
    ]);
  };
};
/* eslint-enable */
