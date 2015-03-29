import Ember from 'ember';

export default Ember.Route.extend({
  myStore: Ember.inject.service(),
  init: function () {
    var store = this.get('myStore');
    store.update('superheroes', 1, {name: 'Peter Parker', alias: 'Spider Man'});
    store.update('superheroes', 2, {name: 'Jean Grey', alias: 'Phoenix'});
  },
  model: function () {
    return this.get('myStore').getAll('superheroes');
  }
});
