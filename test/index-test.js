describe('Backbone.Memoize', function() {
  var expect = window.chai.expect;
  var users;

  var User = Backbone.Model.extend({
    rating: function() {
      return this.collection.factorial(this.get('rating'));
    }
  });

  var Users = Backbone.Collection.extend({
    model: User,
    initialize: function() {},

    best: function() {
      return this.max(function(user) {
        return user.rating();
      });
    },

    factorial: function(n) {
      return n <= 1 ? 1 : n * this.factorial(n - 1);
    },

    byType: function(type) {
      return this.filter(function(user) {
        return user.get('type') === type;
      });
    }
  });

  Backbone.Memoize(User, ['rating']);
  Backbone.Memoize(Users, ['best', 'byType', 'factorial']);

  beforeEach(function() {
    users = new Users(_.shuffle([
      { id: 1, rating: 3, type: 'developer', name: 'Alex' },
      { id: 2, rating: 2, type: 'developer', name: 'John' },
      { id: 3, rating: 8, type: 'CEO',       name: 'Adam' },
      { id: 4, rating: 4, type: 'CTO',       name: 'Liza' },
      { id: 5, rating: 7, type: 'sales',     name: 'Anna' },
      { id: 6, rating: 0, type: 'sales',     name: 'Tobi' },
      { id: 7, rating: 1, type: 'developer', name: 'Rian' },
      { id: 8, rating: 6, type: 'QA',        name: 'Jess' }
    ]));
  });

  describe('validation', function() {
    it('does not applies twice', function() {
      expect(function() { Backbone.Memoize(User, ['rating']) }).throw(/already/);
    });

    it('throws error without second argument', function() {
      expect(function() { Backbone.Memoize(User) }).throw(/require/);
      expect(function() { Backbone.Memoize(User, {}) }).throw(/require/);
    });

    it('throws error for not existing methods or properties', function() {
      var Coll = Backbone.Collection.extend({});
      expect(function() { Backbone.Memoize(Coll, ['nothing']) }).throw(/function/);
      expect(function() { Backbone.Memoize(Coll, ['idAttribute']) }).throw(/function/);
    });
  });

  describe('static', function() {
    it('works with model', function() {
      var user = users.get(4);
      expect(user.rating()).equal(24);
      expect(user._memoize.rating).equal(24);
      expect(_.keys(user._memoize)).length(1);
    });

    it('works with collection', function() {
      expect(users.best().get('name')).equal('Adam');
      expect(_.keys(users._memoize)).include('factorial8');
      expect(users._memoize.best.id).equal(3);
      expect(_.keys(users._memoize)).length(10);
    });
  });

  describe('dynamic', function() {
    it('model handles `change` event', function() {
      var user = users.get(1);
      expect(user.rating()).equal(6);
      expect(_.keys(user._memoize)).length(1);

      user.set('rating', 2);
      expect(user.rating()).equal(2);
    });

    it('collection handles `add change remove` events', function() {
      expect(users.byType('sales')).length(2);
      expect(users.best().get('name')).equal('Adam');

      users.get(2).set('type', 'sales');
      expect(users.byType('sales')).length(3);

      users.add([
        { id: 10, rating: 5,  type: 'developer', name: 'Boris' },
        { id: 11, rating: 10, type: 'investor',  name: 'Alan' }
      ]);
      expect(users.best().get('name')).equal('Alan');

      users.remove([users.get(11), users.get(5), users.get(6)]);
      expect(users.byType('sales')).length(1);
      expect(users.best().get('name')).equal('Adam');
    });
  });
});
