Pokedex.Views = (Pokedex.Views || {});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    'submit form': 'savePokemon'
  },

  render: function () {
    var content = JST['pokemonForm']({});
    this.$el.html(content);
    return this;
  },

  savePokemon: function (event) {
    event.preventDefault();
    var pokemonPOJO = $(event.currentTarget).serializeJSON();
    var pokemon = new Pokedex.Models.Pokemon(pokemonPOJO.pokemon);
    pokemon.save({}, {
      success: function() {
        this.collection.add(pokemon);
        this.callback();
        Backbone.history.navigate('pokemon/' + pokemon.id, {trigger: true});
      }.bind(this)
    });
  }
});
