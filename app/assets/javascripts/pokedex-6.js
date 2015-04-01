Pokedex.Router = Backbone.Router.extend({
  routes: {
    '': 'pokemonIndex',
    'pokemon/:id': 'pokemonDetail',
    'pokemon/:pokemonId/toys/:toyId': 'toyDetail'
  },

  pokemonDetail: function (id, callback) {
    if(!this._pokemonIndex) {
      this.pokemonIndex(function() {
        this.pokemonDetail(id);
      }.bind(this));
    } else {
      var pokemon = this._pokemonIndex.collection.get(id);
      var detailView = new Pokedex.Views.PokemonDetail({model: pokemon});
      $("#pokedex .pokemon-detail").html(detailView.$el);
      detailView.refreshPokemon(callback);
    }
  },

  pokemonIndex: function (callback) {
    $(function () {
      this._pokemonIndex = new Pokedex.Views.PokemonIndex();
      this._pokemonIndex.refreshPokemon({}, callback);
      this.pokemonForm(this._pokemonIndex.render.bind(this._pokemonIndex));
      $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    }.bind(this));
  },

  toyDetail: function (pokemonId, toyId) {
    if(!this._pokemonIndex) {
      var self = this;
      self.pokemonIndex(function() {
        self.pokemonDetail(pokemonId, function() {
          self.toyDetail(pokemonId, toyId);
        });
      });
    } else {
      var pokemon = this._pokemonIndex.collection.get(pokemonId);
      var toy = pokemon.toys().get(toyId);
      var detailView = new Pokedex.Views.ToyDetail({
        model: toy,
        collection: this._pokemonIndex.collection
      });
      $("#pokedex .toy-detail").html(detailView.$el);
      detailView.render();
    }
  },

  pokemonForm: function (callback) {
    var pokemonForm = new Pokedex.Views.PokemonForm({
      model: new Pokedex.Models.Pokemon(),
      collection: this._pokemonIndex.collection
    });
    pokemonForm.callback = callback;
    pokemonForm.render();
    $('#pokedex .pokemon-form').html(pokemonForm.$el);
  }
});

$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
