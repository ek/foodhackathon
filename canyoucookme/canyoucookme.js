if (Meteor.isClient) {
  
  Template.introduction.events({
    'click #start_button' : function () {
      changeStep(0);
      $("#arrows").show();
      $("#steps").show();
      $("#introduction").hide();
    }
  });

  var currentStepNumber = 0;

  changeStep = function(stepNumber) {
    
    if(stepNumber == -1) {
      // return to introduction
      $("#introduction").show();
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
  }

  var ingredients = [
    { name: 'Protiens', ingredients: 
      [ 
        { name: 'Beef', shortname: 'beef', selected: false },
        { name: 'Chicken', shortname: 'chicken', selected: false },
        { name: 'Pork', shortname: 'pork', selected: false },
        { name: 'Fish', shortname: 'fish', selected: false },
        { name: 'Lamb', shortname: 'lamb', selected: false },
        { name: 'Beans', shortname: 'beans', selected: false },
        { name: 'Tofu', shortname: 'tofu', selected: false  }
      ]
    },
    { name: 'Produce', ingredients: 
      [ 
        { name: 'Tomato', shortname: 'tomato', selected: false },
        { name: 'Carrot', shortname: 'carrot', selected: false },
        { name: 'Spinach', shortname: 'spinach', selected: false },
        { name: 'Potato', shortname: 'potato', selected: false },
        { name: 'Bell Pepper', shortname: 'bell_pepper', selected: false },
        { name: 'Mushrooms', shortname: 'mushrooms', selected: false },
        { name: 'Broccoli', shortname: 'broccoli', selected: false  }
      ]
    },
    { name: 'Grains', ingredients: 
      [ 
        { name: 'Pasta', shortname: 'pasta', selected: false },
        { name: 'Rice', shortname: 'rice', selected: false },
        { name: 'Bread', shortname: 'bread', selected: false },
        { name: 'Quinoa', shortname: 'quinoa', selected: false },
        { name: 'Cous Cous', shortname: 'cous_cous', selected: false },
        { name: 'Grits', shortname: 'grits', selected: false },
        { name: 'Tortilla', shortname: 'tortilla', selected: false  }
      ]
    },
    { name: 'Dairy', ingredients: 
      [ 
        { name: 'Cheddar Cheese', shortname: 'cheddar_cheese', selected: false },
        { name: 'Milk', shortname: 'milk', selected: false },
        { name: 'Parmesan Cheese', shortname: 'parmesan_cheese', selected: false },
        { name: 'Yogurt', shortname: 'yogurt', selected: false },
        { name: 'Egg', shortname: 'egg', selected: false },
        { name: 'Blue Cheese', shortname: 'blue_cheese', selected: false },
        { name: 'Mozzarella Cheese', shortname: 'mozzarella_cheese', selected: false  }
      ]
    },
    { name: 'Condiments', ingredients:
      [ 
        { name: 'Mustard', shortname: 'mustard', selected: false },
        { name: 'Red wine vinegar', shortname: 'red_wine_vinegar', selected: false },
        { name: 'Balsamic Vinegar', shortname: 'balsamic_vinegar', selected: false },
        { name: 'Maple Syrup', shortname: 'maple_syrup', selected: false },
        { name: 'Mayo', shortname: 'mayo', selected: false },
        { name: 'Peanut Butter', shortname: 'peanut_butter', selected: false },
        { name: 'Soy Sauce', shortname: 'soy_sauce', selected: false  }
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

  yummly = {
    yummly_app_id: "190058ae",
    yummly_app_key: "3cf06ca8c34982f0e8397d7eea914997",
    query: "",
    callYummlyAPI: function() {

      // add selected ingredients to query
      for(i=0;i<ingredients.length;i++) {
        for(j=0;j<ingredients[i].ingredients.length;j++) {
          ingred = ingredients[i].ingredients[j];
          if(ingred.selected == true) {
            this.query += ingredients[i].ingredients[j].name + ",";
          }
        }
      }

      this.query = "requirePictures=true&q=" + encodeURIComponent(this.query);

      console.log(this.query);

      $.ajax({
        dataType: 'JSONP',
        url: "https://api.yummly.com/v1/api/recipes?_app_id=" + this.yummly_app_id + "&_app_key=" + this.yummly_app_key + "&" + this.query,
        context: document.body
      }).done(function(data) {
        yummly.recipesHandler(data);
      });

    },

    recipesHandler: function(data) {
      console.log(data);
      htmlString = "";
      for(i=0;i<data.matches.length;i++) {
        m = data.matches[i];
        m.image_url = m.smallImageUrls[0];
        m.image_url = m.image_url.replace('.s.jpg','.xl.jpg');
        // insert template
        $("#steps").append(Meteor.render(function() {
          return Template.recipe(m);
        }));
      }
      $("#loading").show();
    }

  };
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
