function createGame(players, prices, outcomes, cb) {
  var $buttons, $renderarea,
      isCycling = false,
      cycling = 0;
  
  var game = {
    setGameButtonsArea: function($el) {
      $buttons = $el;
    },
    
    setGameRenderArea: function($el) {
      $renderarea = $el;
    },
    
    updateCards: updateCards,
    
    startCycling: startCycling,
    stopCycling: stopCycling
  };
  
  $('.stop-cycling').hide().bind('click', stopCycling);
  $('.start-cycling').bind('click', startCycling);
  
  function updateCards() {
    var index = 0;
    $renderarea.empty();
    
    players.all(function(records) {
      shuffle(records);
      _.each(records, function(player) {
        var $b = $renderarea.find('#playerbox-'+player.key);
        if($b.length === 0) {
          $b = $('<div>')
            .addClass('playerbox')
            .text(player.name||player.key)
          ;
          $renderarea.append($b);
        }
        $b.animate({
          // zIndex: ++index,
          top: ($renderarea.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
          left: ($renderarea.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
        });
      });
    });
  }
  
  function cycle() {
    if(!cycling) {
      isCycling = false;
      $('.start-cycling').show();
      return;
    }
    var $b = $renderarea.children().last(),
        left = -1*($b.width()+dice(1, 5)),
        top = dice(1, 7),
        slowdown = cycling > 0 ? 1 : 1;
    $b.animate({
        top: '+=' + top,
        left: '+=' + left
      }, dice(slowdown * 150, slowdown * 300), function() {
        $b.detach().prependTo($renderarea).animate({
            top: ($renderarea.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
            left: ($renderarea.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
          }, dice(200, 300), function() {
            if(cycling>0) --cycling;
            cycle();
          })
        ;
      })
    ;
  }
  
  function startCycling() {
    $('.start-cycling').hide();
    $('.stop-cycling').show();
    updateCards();
    cycling = -1;
    if(!isCycling) {
      isCycling = true;
      cycle();
    }
  }
  
  function stopCycling() {
    $('.stop-cycling').hide();
    cycling = dice(5, 15);
  }
  
  cb(game);
}