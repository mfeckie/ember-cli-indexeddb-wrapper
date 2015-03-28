

export function initialize(container, application) {
  application.inject('controller', 'my-store', 'service:my-store');
  application.inject('route', 'my-store', 'service:my-store');
}

export default {
  name: 'myStore',
  initialize: initialize
};
