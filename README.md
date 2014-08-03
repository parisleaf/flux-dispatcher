Dispatcher
----------

A Flux dispatcher, with promises.

Based on examples from Facebook's [Flux project](https://github.com/facebook/flux).

Usage
=====

```js

var Dispatcher = require('leaf-flux-dispatcher');

// Register a callback
callbackIndex1 = Dispatcher.register(function() {
  ...
});

// Wait for other callbacks to complete
callbackIndex2 = Dispatcher.register(function() {
  ...something async...
});

callbackIndex3 = Dispatcher.register(function() {
  Dispatcher.waitFor([callbackIndex2], function() {
    ...callback 2 has completed...
  });
});

// Or omit the callback and use the returned promise
// Enables use of co, suspend, etc.
callbackIndex4 = Dispatcher.register(function() {
  Dispatcher.waitFor([callbackIndex2]).then(function() {
    ...callback 2 has completed...
  });
});

```

Dependencies
------------

- react-tools, for es6 transforming
- es6-promise (if global Promise does not exist)

License
-------
MIT

Parisleaf
[http://parisleaf.com]()