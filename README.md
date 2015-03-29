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


## Running Tests

* `ember test`
* `ember test --server`

## Contributions

Contributions for bug fixes are welcome with tests and documentation.  Please reach out to me if your are thinking about adding a feature before sending a pull request.  This reduces the likelihood of doing work that won't be merged, though if you're forking for your own project then of course knock yourself out and go crazy!

If you want to make a suggestion, please open an issue on Github.

Whatever happens, remember, **I put this out her for free**, so if you don't like, don't agree or it doesn't work the way you want - please still be polite and constructive.
