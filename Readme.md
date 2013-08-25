# Backbone.Memoize

  Lazy cache for backbone collections/models.
  It works like [underscore's memoize](http://documentcloud.github.io/underscore/#memoize),
  but resets cache after every event.

## Installation

    $ bower install backbone-memoize --save

  or include [index.js]() with `script` tag.

## Example

```js
var Users = Backbone.Collection.extend({
  initialize: function() {},

  best: function() {
    return this.max(function(user) {
      return user.get('revenue')
    });
  },

  sales: function() {
    return this.byType('sales');
  },

  byType: function(type) {
    return this.filter(function(user) {
      return user.get('type') === type;
    });
  }
});

Backbone.Memoize(Users, ['best', 'sales', 'byType']);

var users = new Users([]);
```

## Backbone.Memoize(Klass, methods)

  Make list of methods for selected Klass memoizable.
  It automatically detects instances of Backbone.Model or Backbone.Collection.

## Development

  * `npm install` - to install development depenencies
  * `npm test` - to ensure that all tests pass
  * `npm start` - to start watch server for test suite

## Licence

  [Activecell](http://activecell.com/), MIT
