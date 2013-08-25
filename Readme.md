# Backbone.Memoize

  Lazy cache for backbone collections/models.
  It works like [underscore's memoize](http://documentcloud.github.io/underscore/#memoize),
  but resets cache after every event. It especially useful for complex computations.

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

// work with all methods as usual, except now result is stored in memory
// and app works really fast.
employees.best(); // User(1)

// same result, but now without expensive filtering
employees.best(); // User(1)

// when you update data, cache reseted
employees.get(5).set('rating', 10);
employees.best(); // User(5)
```

## Backbone.Memoize(Klass, methods)

  Make list of methods for selected Klass memoizable.
  It detects Backbone.Collection and subscribes on 3 types of events: `add`, `change`, `remove`
  for other classes it just handles `change` event.

## Development

  * `npm install` - to install development depenencies
  * `npm test` - to ensure that all tests pass
  * `npm start` - to start watch server for test suite

## Licence

  [Activecell](http://activecell.com/), MIT
