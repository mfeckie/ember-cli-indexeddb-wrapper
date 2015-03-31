

export function initialize(container, application) {
  application.inject('controller', 'myStore', 'service:myStore');
  application.inject('route', 'myStore', 'service:myStore');
}

export default {
  name: 'myStore',
  initialize: initialize
};
