[![Build Status](https://travis-ci.org/mfeckie/ember-cli-indexeddb-wrapper.svg?branch=master)](https://travis-ci.org/mfeckie/ember-cli-indexeddb-wrapper)

# Ember CLI IndexedDB Wrapper

This addon provides a thin wrapper around IndexedDB to easily use in your projects.

Ember Data is not currently supported.

## Installation

* `ember install:addon ember-cli-indexeddb-wrapper`
* `ember g indexeddb-service <service-name>`

This will then generate a file which you can use to configure the service



```js
// Filename app/services/my-store.js
import IndexedDBStore from 'ember-cli-indexeddb-wrapper/services/indexeddb-store';

export default IndexedDBStore.extend({
  databaseNamespace: 'stuff',
  version: 1,
  objectStores: ['superheroes']
});
```

* **optional** `ember g initializer <service-name>`

Which will generate an initializer.  Add `application.inject` calls to make the service available in the areas you wish, controllers and routes in the example below.

```js
// Filename app/initializers/indexeddb-store.js

export function initialize(container, application) {
  application.inject('controller', 'my-store', 'service:my-store');
  application.inject('route', 'my-store', 'service:my-store');
}

export default {
  name: 'myStore',
  initialize: initialize
};

```
This allows you to use the service with the Ember injector.

```js
// Filename app/routes/application.js

import Ember from 'ember';

export default Ember.Route.extend({
  myStore: Ember.inject.service(),
  model: function () {
    return this.get('myStore').getOne('superheroes',1);
  }
});

```
## Usage

After you've get things set up it should be fairly straightforward to use.  All public methods return promises, so you know what to do with them.

Saving a record or records.  The `save` method takes two parameters, `storeName` and `thing(s)`` to persist.  `thing(s)` can be a single object or an array of objects.

```js
// Filename app/controller/thing.js

import Ember from 'ember';

export default Ember.Route.extend({
  myStore: Ember.inject.service(),
  actions: {
    save: function (stuff) {
      var self = this;
      self.set('saving', true);
      this.get('myStore').save('superheroes', stuff).then(function () {
        self.set('saving', false);
      }, function (err) {
        self.set('errorMessage', 'Failed to save...');
      });
    }
  }
});

```




## Running Tests

* `ember test`
* `ember test --server`

## Contributions

Contributions for bug fixes are welcome with tests and documentation.  Please reach out to me if you're thinking about adding a feature before sending a pull request.  This reduces the likelihood of doing work that won't be merged. If you're forking for your own project then of course knock yourself out and go crazy!

If you want to make a suggestion, please open an issue on Github.

Whatever happens, remember, **I put this out her for free**, so if you don't like, don't agree or it doesn't work the way you want - please still be polite and constructive.
