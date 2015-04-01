Pokedex.Views = {};

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    'click li': 'selectPokemonFromList' //not .poke-list-item ???
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
  },


  addPokemonToList: function (pokemon) {
    var content = JST["pokemonListItem"]({pokemon: pokemon});
    this.$el.append(content);
  },

  refreshPokemon: function (options, callback) {
    this.collection.fetch({
      success: function() {
        this.render.bind(this)();
        if (callback) {
          callback();
        }
      }.bind(this)
    });
  },

  render: function () {
    this.$el.empty();
    this.collection.each(function(pokemon) {
      this.addPokemonToList(pokemon);
    }.bind(this));
    console.log("Index Render:  " + Date.now());
    return this;
  },

  selectPokemonFromList: function (event) {
    // var pokemon = this.collection.get($(event.currentTarget).data('id'));
    // var detailView = new Pokedex.Views.PokemonDetail({model: pokemon});
    var pokemonId = $(event.currentTarget).data('id');
    Backbone.history.navigate("pokemon/" + pokemonId, {trigger: true});

  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    'click li': 'selectToyFromList'
  },

  initialize: function() {
    this.listenTo(this.model.toys(), "add remove", this.render);
  },

  refreshPokemon: function (/*options,*/ callback) {
    this.model.fetch({
      success: function() {
        this.render();
        if(callback) {
          callback();
        }
      }.bind(this)
    });
  },

  render: function () {
    this.$el.html(JST["pokemonDetail"]({pokemon: this.model}));
    var ul = this.$('ul');
    this.model.toys().each(function(toy){
      ul.append(JST['toyListItem']({toy: toy}));
    }.bind(this));
    $('#pokedex .toy-detail').empty()
    return this;
  },

  selectToyFromList: function (event) {
    var toyId = $(event.currentTarget).data('id');
    Backbone.history.navigate('pokemon/' + this.model.id + '/toys/' + toyId, {trigger: true});
  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  render: function () {
    this.$el.html(JST['toyDetail']({toy: this.model, pokes: this.collection}));
  },

  events: {
    'change select': 'reassignToy'
  },

  reassignToy: function () {
    var oldPokemon = this.collection.get(this.model.get('pokemon_id'));
    oldPokemon.toys().remove(this.model);
    // this.model.set('pokemon_id', $(event.currentTarget).val());
    this.model.save({pokemon_id: this.$('select').val()}, {patch: true});
  }
});
