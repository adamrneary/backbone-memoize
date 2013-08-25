describe('Backbone.Memoize', function() {
  var expect = window.chai.expect;
  var users;

  var User = Backbone.Model.extend({
    rating: function() {
      return this.factorial(this.get('rating'));
    },

    factorial: function(n) {
      return n <= 1 ? 1 : n * this.factorial(n - 1);
    }
  });

  var Users = Backbone.Collection.extend({
    model: User,
    initialize: function() {},

    best: function() {
      return this.max(function(user) { return user.rating() });
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

  Backbone.Memoize(User, ['rating', 'factorial']);
  Backbone.Memoize(Users, ['best', 'sales', 'byType']);

  beforeEach(function() {
    users = new Users([
      { id: 1, rating: 3, type: 'developer', name: 'Alex' },
      { id: 2, rating: 2, type: 'developer', name: 'John' },
      { id: 3, rating: 8, type: 'CEO',       name: 'Adam' },
      { id: 4, rating: 4, type: 'CTO',       name: 'Liza' },
      { id: 5, rating: 7, type: 'sales',     name: 'Anna' },
      { id: 6, rating: 0, type: 'sales',     name: 'Tobi' },
      { id: 7, rating: 1, type: 'developer', name: 'Rian' },
      { id: 8, rating: 6, type: 'QA',        name: 'Jess' }
    ]);
  });

  it('', function() {
    // body...
  });
});
