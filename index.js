;(function(_, Backbone) {
'use strict';

// Lazy-ass caches for Backbone collections and models.
// It works like [Underscore's memoize](http://documentcloud.github.io/underscore/#memoize)
// but invalidates with the appropriate Backbone events. This is especially
// useful for complex computations.
Backbone.Memoize = function(Klass, methods) {

  // Ensure that the passed parameters are valid.
  if (!methods || !methods.length) throw new TypeError('`Methods` is required.');
  if (Klass.prototype._memoized) throw new TypeError('Class is already memoized.');

  // `methods` is an array, so process each one
  _.forEach(methods, function(methodName) {

    // Retrieve the method from the class
    var method = Klass.prototype[methodName];

    // Ensure the method is a function
    if (!_.isFunction(method))
      throw new TypeError('`' + methodName + '` must be a function.');

    // Apply commonly-accepted memoize pattern
    Klass.prototype[methodName] = function() {
      var key = getKey(methodName, arguments);
      return hasKey(this, key) ?
         this._memoize[key] :
        (this._memoize[key] = method.apply(this, arguments));
    };
  });

  // Mark the class as memoized to throw an error on duplicate declaration
  Klass.prototype._memoized = true;
};

// Create a hash key to use for lookups
function getKey(name, args) {
  args = _.toArray(args).join('~');
  return name + args;
}

// Check the entry for the passed key
function hasKey(entry, key) {

  // first ensure that _memoize has been set up before checking
  if (!entry._memoize) setup(entry);

  // Check the object for the passed key
  return _.has(entry._memoize, key);
}

// Set up memoize structure
function setup(entry) {

  // Create hash for lookup
  entry._memoize = {};

  // Create simple reset function
  var reset = function() { entry._memoize = {} };

  // Bind entry to the appropriate events
  if (entry instanceof Backbone.Collection)
    entry.on('add change remove', reset);
  else
    entry.on('change', reset);
}

}).call(this, _, Backbone);
