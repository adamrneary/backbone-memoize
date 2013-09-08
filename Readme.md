# Backbone.Memoize [![Build Status](https://circleci.com/gh/activecell/backbone-memoize.png)](https://circleci.com/gh/activecell/backbone-memoize)

  Lazy-ass caches for Backbone collections and models.
  It works like [Underscore's memoize](http://documentcloud.github.io/underscore/#memoize)
  but invalidates with the appropriate Backbone events. This is especially
  useful for complex computations.

## Installation

    $ bower install backbone-memoize --save

  or include [index.js](https://github.com/activecell/backbone-memoize/blob/master/index.js) with `script` tag.

## Example

```js
var Employees = Backbone.Collection.extend({
  initialize: function() {},

  best: function() {
    return this.max(function(user) {
      return this.factorial(user.get('rating'));
    });
  },

  // regular factorial implementation, as example of pure function
  factorial: function(n) {
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }
});

Backbone.Memoize(Employees, ['best', 'factorial'], {
  best: 'add remove change:rating', // setup specific events for method
  factorial: false // pure function and we never reset the cache
});

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

## Backbone.Memoize(Klass, methods, [options])

  Mark each method in the passed array as memoizable for the passed Klass.
  Backbone.Memoize will detect the appropriate Backbone.Collection and
  subscribe to `add`, `change`, and `remove` events.
  For classes other than Backbone.Collection it will only subscribe to `change`
  events.
  Also you can specify events with `options`. See example.
