# Backbone.Memoize

  Lazy-ass caches for Backbone collections and models.
  It works like [Underscore's memoize](http://documentcloud.github.io/underscore/#memoize)
  but invalidates with the appropriate Backbone events. This is especially
  useful for complex computations.

## Installation

    $ bower install backbone-memoize --save

  or include [index.js]() with `script` tag.

## Example

```js
var Employees = Backbone.Collection.extend({
  initialize: function() {},

  best: function() {
    return this.max(function(user) {
      return user.get('rating')
    });
  },

  byType: function(type) {
    return this.filter(function(user) {
      return user.get('type') === type;
    });
  }
});

Backbone.Memoize(Employees, ['best', 'sales']);

var employees = new Employees([
  { id: 1, rating: 8, type: 'CEO',       name: 'Adam' },
  { id: 2, rating: 4, type: 'CTO',       name: 'Liza' },
  { id: 3, rating: 7, type: 'sales',     name: 'Anna' },
  { id: 4, rating: 0, type: 'sales',     name: 'Tobi' },
  { id: 5, rating: 1, type: 'developer', name: 'Rian' },
  { id: 6, rating: 6, type: 'QA',        name: 'Jess' }
]);

// Functions work with all methods as usual, except now the results are stored
// in memory, and the app works much faster in cases where function execution
// is particularly expensive.
employees.best(); // User(1)

// Same result, but without expensive filtering
employees.best(); // User(1)

// When collection members are added, removed, or updated, the cache is reset
employees.get(5).set('rating', 10);
employees.best(); // User(5)
```

## Backbone.Memoize(Klass, methods)

  Mark each method in the passed array as memoizable for the passed Klass.
  Backbone.Memoize will detect the appropriate Backbone.Collection and
  subscribe to `add`, `change`, and `remove` events.
  For classes other than Backbone.Collection it will only subscribe to `change`
  events.