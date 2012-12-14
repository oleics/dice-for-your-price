function createGame(players, prices, outcomes, cb) {
  var $buttons, $renderarea,
      isCycling = false,
      isShuffling = false,
      cycling = 0,
      price = null;
  
  var game = {
    setGameButtonsArea: function($el) {
      $buttons = $el;
    },
    
    setGameRenderArea: function($el) {
      $renderarea = $el;
    },
    
    updateCards: updateCards,
    shuffleCards: shuffleCards,
    
    startCycling: startCycling,
    stopCycling: stopCycling,
    
    setPrice: setPrice
  };
  
  $('.stop-cycling').hide().bind('click', stopCycling);
  $('.start-cycling').hide().bind('click', startCycling);
  
  function setPrice(p) {
    price = p;
    $('.game-winner-area').hide();
    $('.game-price-area').text(price.name || price.key);
  }
  
  function updateCards() {
    var index = 0;
    $renderarea.empty();
    
    players.all(function(records) {
//      shuffle(records);
      _.each(records, function(player) {
        var $b = $renderarea.find('#card-'+player.key);
        if($b.length === 0) {
          $b = $('<div>')
            .addClass('card')
            .text(player.name||player.key)
            .data('key', player.key)
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
  
  function shuffleCards(num, cb) {
    isShuffling = true;
    cycling = 0;
    cb = cb || function() {};
    end();
    
    function end() {
      if(!--num) {
        isShuffling = false;
        return cb();
      }
      s(end);
    }
    
    function s(cb) {
      var $cards = Array.prototype.slice.call($renderarea.children(), 0);
      shuffle($cards);
      next();
      
      function next() {
        if($cards.length === 0) return cb();
        
        $card = $($cards.pop());
        
        var top = dice(1, 7),
            direction = dice(0,1) ? -1 : 1,
            left = direction*($card.width()+dice(1, 30));
        
        $card.animate({
          top: '+=' + top,
          left: '+=' + left
        }, dice(50, 150, 3), function() {
          $renderarea.append($card);
          
          $card.animate({
            // zIndex: ++index,
            top: ($renderarea.height() / 2) - ($card.height() / 2) + dice(-20, 20, 2),
            left: ($renderarea.width() / 2) - ($card.width() / 2) + dice(-20, 20, 2)
          }, dice(50, 150, 3), function() {
            next();
          });
        });
      }
    }
  }
  
  function cycle() {
    if(!cycling) {
      isCycling = false;
      if(!isShuffling) {
        players.get($renderarea.children().last().data('key'), function(player) {
          $('.game-winner-area').fadeIn('slow');
          game.onWinner(player, price);
        });
      }
      return;
    }
    var $b = $renderarea.children().last(),
        direction = dice(0,1) ? -1 : 1,
        left = direction*($b.width()+dice(1, 5)),
        top = dice(1, 7),
        slowdown = cycling > 0 ? 1 : 1;
    $b.animate({
        top: '+=' + top,
        left: '+=' + left
      }, dice(slowdown * 200, slowdown * 500, 5), function() {
        $b.detach().prependTo($renderarea).animate({
            top: ($renderarea.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
            left: ($renderarea.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
          }, dice(200, 500, 5), function() {
            if(cycling>0) --cycling;
            if(cycling === 0) {
            }
            cycle();
          })
        ;
      })
    ;
  }
  
  function startCycling() {
    $('.start-cycling').hide();
    $('.stop-cycling').show();
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