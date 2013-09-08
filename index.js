/**
 * Lazy-ass caches for Backbone collections and models.
 * It works like [Underscore's memoize](http://documentcloud.github.io/underscore/#memoize)
 * but invalidates with the appropriate Backbone events. This is especially
 * useful for complex computations.
 */

;(function(_, Backbone) {
'use strict';

Backbone.Memoize = function(Klass, methods, options) {
  // Ensure that the passed parameters are valid.
  if (!methods || !methods.length) throw new TypeError('`Methods` is required.');
  if (Klass.prototype._memoized) throw new TypeError('Class is already memoized.');
  if (_.isUndefined(options)) options = {};

  // `methods` is an array, so process each one
  _.forEach(methods, function(name) {
    // Retrieve the method from the class
    var method = Klass.prototype[name];

    // Ensure the method is a function
    if (!_.isFunction(method))
      throw new TypeError('`' + name + '` must be a function.');

    // Apply commonly-accepted memoize pattern
    Klass.prototype[name] = function() {
      var key = getKey(name, arguments);
      if (!this._memoize) setup(this, methods, options);

      return _.has(this._memoize, key) ?
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

// Set up memoize structure
function setup(entry, methods, options) {
  // Create hash for lookup
  entry._memoize = {};
  if (options === false) return;

  // Bind entry to the appropriate events
  var defaults = entry instanceof Backbone.Collection ?
    ['add', 'change', 'remove'] : ['change'];
  var events   = getEvents(methods, options, defaults);

  _.forEach(_.keys(events), function(event) {
    entry.on(event, reset(events[event], entry));
  });
}

function getEvents(methods, options, defaults) {
  var res = {};
  _.forEach(methods, function(name) {
    if (options[name] === false) return;
    var events = _.isUndefined(options[name]) ? defaults : options[name].split(' ');
    _.forEach(events, function(event) {
      if (!res[event]) res[event] = [];
      res[event].push(name);
    });
  });
  return res;
}

function reset(prefixes, entry) {
  return function() {
    _.forEach(prefixes, function(prefix) {
      prefix = new RegExp('^' + prefix);
      _.forEach(_.keys(entry._memoize), function(key) {
        if (prefix.test(key)) delete entry._memoize[key];
      });
    });
  };
}

}).call(this, _, Backbone);
