;(function(_, Backbone) {
'use strict';

Backbone.Memoize = function(Klass, methods) {
  if (!methods || !methods.length) throw new TypeError('`methods` require');
  if (Klass.prototype._memoized) throw new TypeError('Class is already memoized');

  _.forEach(methods, function(methodName) {
    var method = Klass.prototype[methodName];
    if (!_.isFunction(method)) throw new TypeError('`' + method + '` has to be a function');

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

function hasKey(coll, key) {
  if (!coll._memoize) coll._memoize = {};
  return _.has(coll._memoize, key);
}

}).call(this, _, Backbone);
