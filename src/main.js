var grid = require('./grid.js');
var styles = require('./styles.js');
var _ = require('../lib/underscore.js');
var rezi = require('../lib/rezi.js');
var Genome = require('./genome.js');
var cellsContent = require('./content.js');

var app = function(){

  $('body').html(templates.wrapper);
  $('body').append(templates.controls);
  $('body').append(templates.savedDesignsOverlay);
  app.createTemplate();
  app.listeners();
};

app.listeners = function(){
  $('body').on('click', '.controls #love', function(){
    app.saveCurrentModel();
  });

  $('body').on('click', '.controls #next', function(){
    app.createTemplate();
  });

  $('body').on('click', '.controls #see-all-designs', function(){
    app.showSavedDesigns();
  });

  $('body').on('click', '.saved-designs .close', function(){
    app.hideSavedDesigns();
  });
  /*
  var KEYS = {L: 108, N: 110};
  $('body').keypress(function(e){
    if (e.which === KEYS.L){
      app.saveCurrentModel()
    } else if (e.which === KEYS.N) {
      app.createTemplate();
    }
  });
  */
};

app.saveCurrentModel = function(){
  html2canvas(document.getElementsByClassName('site-wrapper')[0], {
    background: app.currentModel.pageBackground,
    onrendered: function(canvas){
      var design ={
        canvas: canvas,
        code: rezi(styles(app.currentModel))
      };
      app.savedDesigns.push(design);
    }
  });
  app.genePool.push(app.currentModel);
};

app.currentModel;
app.genePool = [];
app.carryingCapacity = 10000;
app.content = cellsContent.all();
app.savedDesigns = [];

app.showSavedDesigns = function(){
      $(".saved-designs").animate({
        opacity: 1,
        zIndex: 5,
      }, 400, function() {
        $(".saved-designs").html('<span class="close">Close</span>');
        for (var i = 0; i < app.savedDesigns.length; i++) {
          document.getElementsByClassName('saved-designs')[0].appendChild(app.savedDesigns[i].canvas);
        }
        $("canvas").css({
          "zoom": "30%",
          "margin": "20px"
        });
      });
};

app.hideSavedDesigns = function(){
  $('.saved-designs').animate({
    opacity: 0,
    zIndex: -1
  }, 300, function(){
    $('.saved-designs').html('');
  });
};


app.createTemplate = function(){
  if (app.genePool > app.carryingCapacity) {
    app.genePool.splice(0, 1);
  }
  var genome = Genome(app.genePool);
  app.currentModel = genome;
  $('.site-wrapper').html(templates.grid(genome, app.content));
  var gridster = $('.gridster ul').gridster({
    widget_margins: [genome.margin, genome.margin],
      max_cols: 60,
      draggable: {
        stop: function(e, ui, $widget){
          app.currentModel.cells = this.serialize();
        }
      },
      resize: {
        enabled: true,
      stop: function(e, ui, $widget){
        app.currentModel.cells = this.serialize();
      }
      },
      widget_base_dimensions: [10, 15],
      helper: 'clone'
  }).data('gridster');  

  rezi(styles(genome));
};

var templates = {
  grid: grid,
  wrapper: '<div class="site-wrapper"></div>',
  controls: '<div class="controls"><button id="love">Love</button><button id="next">Next</button><button id="see-all-designs">See All</button></div>',
  savedDesignsOverlay: '<div class="saved-designs"></div>'
};

$(document).ready(function(){app();});

window.app = app;

module.exports = app;
