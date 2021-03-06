if (Meteor.isClient) {
  
  Array.prototype.shuffle = function() {
    var i = this.length, j, tempi, tempj;
    if ( i == 0 ) return this;
    while ( --i ) {
       j       = Math.floor( Math.random() * ( i + 1 ) );
       tempi   = this[i];
       tempj   = this[j];
       this[i] = tempj;
       this[j] = tempi;
    }
    return this;
  }

  Template.introduction.events({
    'click #start_button' : function () {
      changeStep(0);
      $("#arrows").show();
      $("#steps").show();
      $("#introduction").hide();
      $('#headcontainer').hide();
      $('#banner').hide();
    }
  });

  var currentStepNumber = 0;

  changeStep = function(stepNumber) {
    
    if(stepNumber == -1) {
      // return to introduction
      $("#introduction").show();
      $('#headcontainer').show();
      $("#steps").hide();
      $("#arrows").hide();
    }
    if(stepNumber == 5) {
      // move on to yummly recipes
      yummly.callYummlyAPI();
      $("#arrows").hide();
      $("#loading").show();
    }

    currentStepNumber = stepNumber;

    // insert template
    $("#steps").html(Meteor.render(function() {
      return Template.step(ingredients[stepNumber]);
    }));

    $('#next').unbind();
    $('#previous').unbind();

    $('#next').click(function(  ) {
      // change step UI to next step
      changeStep(currentStepNumber + 1);
    });
    $('#previous').click(function(e) {
      // change step UI to previous step
      changeStep(currentStepNumber - 1);
    });
    $('.step_ingredients').hide();
    var masonryTimeout = window.setTimeout('runMasonry();', 200);

  }

  runMasonry = function() {
    $('.step_ingredients').show();
    $('.step_ingredients').masonry({
      // options
      itemSelector : '.ingredient',
      columnWidth : 250,
      animationOptions: {
        duration: 400
      }
    });
  }


  var ingredients = [
    { name: 'Protein', ingredients: 
      [ 
        { name: 'Ground Beef', shortname: 'ground-beef', selected: false, col: 'col1' },
        { name: 'Chicken', shortname: 'chicken-breast', selected: false, col: 'col1' },
        { name: 'Pork', shortname: 'pork-chop', selected: false, col: 'col1' },
        { name: 'Fish', shortname: 'salmon', selected: false, col: 'col1' },
        { name: 'Beef', shortname: 'steak', selected: false, col: 'col1' },
        { name: 'Beans', shortname: 'beans', selected: false, col: 'col1' },
        { name: 'Tofu', shortname: 'tofu', selected: false, col: 'col1'  }
      ]
    },
    { name: 'Produce', ingredients: 
      [ 
        { name: 'Tomato', shortname: 'tomato', selected: false, col: 'col1' },
        { name: 'Carrot', shortname: 'carrots', selected: false, col: 'col1' },
        { name: 'Spinach', shortname: 'spinach', selected: false, col: 'col1' },
        { name: 'Potato', shortname: 'potatoes', selected: false, col: 'col1' },
        { name: 'Bell Pepper', shortname: 'bell_pepper', selected: false, col: 'col1' },
        { name: 'Mushrooms', shortname: 'mushrooms', selected: false, col: 'col1' },
        { name: 'Broccoli', shortname: 'brocolli', selected: false, col: 'col1'  }
      ]
    },
    { name: 'Grain', ingredients: 
      [ 
        { name: 'Pasta', shortname: 'pasta', selected: false, col: 'col1' },
        { name: 'Rice', shortname: 'rice', selected: false, col: 'col1' },
        { name: 'Bread', shortname: 'bread', selected: false, col: 'col1' },
        { name: 'Quinoa', shortname: 'quinoa', selected: false, col: 'col1' },
        { name: 'Cous Cous', shortname: 'couscous', selected: false, col: 'col1' },
        { name: 'Grits', shortname: 'grits', selected: false, col: 'col1' },
        { name: 'Tortilla', shortname: 'tortillas', selected: false, col: 'col1'  }
      ]
    },
    { name: 'Dairy', ingredients: 
      [ 
        { name: 'Cheddar Cheese', shortname: 'cheddar-cheese', selected: false, col: 'col1' },
        { name: 'Milk', shortname: 'milk', selected: false, col: 'col1' },
        { name: 'Parmesan Cheese', shortname: 'parmesan-cheese', selected: false, col: 'col1' },
        { name: 'Yogurt', shortname: 'yogurt', selected: false, col: 'col1' },
        { name: 'Egg', shortname: 'egg', selected: false, col: 'col1' },
        { name: 'Blue Cheese', shortname: 'blue-cheese', selected: false, col: 'col1' },
        { name: 'Goat Cheese', shortname: 'goat-cheese', selected: false, col: 'col1'  }
      ]
    },
    { name: 'Condiment', ingredients:
      [ 
        { name: 'Mustard', shortname: 'mustard', selected: false, col: 'col1' },
        { name: 'Red wine vinegar', shortname: 'red-wine-vinegar', selected: false, col: 'col1' },
        { name: 'Balsamic Vinegar', shortname: 'balsamic-vinegar', selected: false, col: 'col1' },
        { name: 'Maple Syrup', shortname: 'maple-syrup', selected: false, col: 'col1' },
        { name: 'Mayo', shortname: 'mayonnaise', selected: false, col: 'col1' },
        { name: 'Peanut Butter', shortname: 'peanut-butter', selected: false, col: 'col1' },
        { name: 'Soy Sauce', shortname: 'soy-sauce', selected: false, col: 'col1'  }
      ]
    }
  ];

  Template.step.events({
    'click .ingredient' : function(e) {

      // check if the event target is an a tag
      if(e.target.nodeName.toLowerCase() != 'a') {
        // if not find parent a tag
        target = $(e.target).parent(".ingredient");
      } else {
        target = $(e.target);
      }
      id = target.attr('id');

      if(this.selected == true) {
        this.selected = false;
        target.children('.selected').removeClass('selected').addClass('unselected');
      } else {
        this.selected = true;
        target.children('.unselected').removeClass('unselected').addClass('selected');
      }
    }
  });


    Template.recipe.events({
      'click #try_again' : function () {
        $("#recipe").hide();
        $("#loading").show();
        yummly.refreshRecipe();
      },
      'click #start_over' : function () {
        $("#recipe").hide();
        changeStep(0);
      }
    });

  yummly = {

    yummly_app_id: "190058ae",
    yummly_app_key: "3cf06ca8c34982f0e8397d7eea914997",
    query_ingredients: [],
    query: "",
    query_length_limit: 10,
    
    callYummlyAPI: function() {

      this.prepareQueryIngredients(this.query_length_limit);

      this.query = "requirePictures=true&q=" + encodeURIComponent(this.query_ingredients.join(','));

      $.ajax({
        dataType: 'JSONP',
        url: "https://api.yummly.com/v1/api/recipes?_app_id=" + this.yummly_app_id + "&_app_key=" + this.yummly_app_key + "&" + this.query,
        context: document.body
      }).done(function(data) {
        yummly.recipesHandler(data);
      });

    },

    refreshRecipe: function() {
      this.query_length_limit = 10;
      $("#recipe").hide();
      $(".recipe").hide();
      yummly.callYummlyAPI();
    },

    getYummlyRecipeData: function(recipe_id) {

      $.ajax({
        dataType: 'JSONP',
        url: "http://api.yummly.com/v1/api/recipe/"+ recipe_id +"?_app_id=" + this.yummly_app_id + "&_app_key=" + this.yummly_app_key,
        context: document.body
      }).done(function(data) {
        yummly.recipeHandler(data);
      });

    },

    prepareQueryIngredients: function(max_length) {

      this.query_ingredients = [];

      // add selected ingredients to query
      for(i=0;i<ingredients.length;i++) {
        for(j=0;j<ingredients[i].ingredients.length;j++) {
          ingred = ingredients[i].ingredients[j];
          if(ingred.selected == true) {
            this.query_ingredients.push(ingredients[i].ingredients[j].name);
          }
        }
      }

      // this helps randomize the result
      this.query_ingredients.shuffle();

      if(this.query_ingredients.length > max_length) {
        this.query_ingredients.length = max_length;
      }

    },

    recipeHandler: function(data) {

      m = data;

      // insert template
      m.image_url = m.images[0].hostedLargeUrl;
      $(".recipe").html('');
      // insert template
      $("#steps").append(Meteor.render(function() {
        return Template.recipe(m);
      }));
      
      $("#loading").hide();

    },


    recipesHandler: function(data) {
      
      $("#nav").hide();

      htmlString = "";

      if(data.matches.length > 0) {
        console.log('found recipe(s) with '+ this.query_length_limit +' items in search.' );
        m = data.matches[0];
        this.getYummlyRecipeData(m.id);
      } else {
        // ZERO RESULTS!
        // remove selected parts of queue
        // add selected ingredients to query
        for(i=0;i<ingredients.length;i++) {
          for(j=0;j<ingredients[i].ingredients.length;j++) {
            ingred = ingredients[i].ingredients[j];
            if(ingred.selected == true) {
              this.query += ingredients[i].ingredients[j].name + ",";
            }
          }
        }

        // decrement the limit
        this.query_length_limit = this.query_length_limit - 1;

        yummly.callYummlyAPI();

      }
    }

  };
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
