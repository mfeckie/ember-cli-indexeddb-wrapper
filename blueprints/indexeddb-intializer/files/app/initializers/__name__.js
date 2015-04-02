export function initialize(container, application) {
  application.inject('route', '<%= camelizedModuleName %>', 'service:<%= camelizedModuleName %>');
  application.inject('controller', '<%= camelizedModuleName %>', 'service:<%= camelizedModuleName %>');
}

export default {
  name: '<%= camelizedModuleName %>',
  initialize: initialize
};
