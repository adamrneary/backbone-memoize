;(function(_, Backbone) {
'use strict';

Backbone.Memoize = function(Klass, methods) {
  if (!methods || !methods.length) throw new TypeError('`methods` require');
  if (Klass.prototype._memoized) throw new TypeError('Class is already memoized');

  _.forEach(methods, function(methodName) {
    var method = Klass.prototype[methodName];
    if (!_.isFunction(method)) throw new TypeError('`' + methodName + '` has to be a function');

    Klass.prototype[methodName] = function() {
      var key = getKey(methodName, arguments);
      return hasKey(this, key) ?
         this._memoize[key] :
        (this._memoize[key] = method.apply(this, arguments));
    };
  });

  Klass.prototype._memoized = true;
};

function getKey(name, args) {
  args = _.toArray(args).join('~');
  return name + args;
}

function hasKey(entry, key) {
  if (!entry._memoize) setup(entry);
  return _.has(entry._memoize, key);
}

function setup(entry) {
  entry._memoize = {};
  var reset = function() { entry._memoize = {} };

  if (entry instanceof Backbone.Collection)
    entry.on('add change remove', reset);
  else
    entry.on('change', reset);
}

}).call(this, _, Backbone);
