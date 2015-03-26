export function initialize(container, application) {
  application.inject('controller', 'indexeddb-store', 'service:indexeddb-store');
}

export default {
  name: 'indexeddb-store',
  initialize: initialize
};
