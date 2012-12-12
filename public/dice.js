$(function() {
  
  // Players
  Lawnchair({name: 'players', record: 'player'}, function(players) {
    // players.nuke();
    updatePlayerlist();
    
    function updatePlayerlist() {
      var $l = $('.playerlist');
      $l.empty();
      players.each(function(player) {
        $l.append(
          $('<div>').append(
            $('<a>')
              .css({cursor: 'pointer', color: '#999'})
              .text('x')
              .data('key', player.key)
              .bind('click', onPlayerRemove)
          ).append(
            $('<span>').text(' ' + (player.name || player.key))
          ).append(
            $('<span>').text(' ' + player.prices.join(', '))
          )
        );
      });
    }
    
    function onPlayerRemove() {
      players.remove($(this).data('key'), function() {
        updatePlayerlist();
      });
      return false;
    }
    
    function onAddPlayer() {
      var $el = $(this).find('.name');
      players.save({
        name: $el.val(),
        prices: []
      }, function() {
        $el.val('');
        updatePlayerlist();
      });
      return false;
    }
    
    $('.add-player').bind('submit', onAddPlayer);
    
    function randomPlayer(cb) {
      players.all(function(records) {
        if(records.length) {
          shuffle(records);
          players.get(records[dice(0, records.length-1)].key, function(player) {
            cb(player);
          });
        }
      });
    }
    
    // Outcomes
    Lawnchair({name: 'outcomes', record: 'outcome'}, function(outcomes) {
      // outcomes.nuke();
      updateOutcomes();
      
      function updateCurrentOutcome(outcome) {
        var $el = $('.current-outcome'),
            player;
        
        $el.css({
          padding: '50px 100px',
          margin: '5px 5px',
          backgroundColor: '#aaaaaa'
        });
        
        drama(dice(3, 10), function() {
          setOutcome(outcome, function() {
            $el.css({backgroundColor: '#aaffaa'});
          });
        });
        
        function drama(num, cb) {
          if(num === 0) return cb();
          randomPlayer(function(player) {
            setOutcome({
              price: outcome.price,
              player: player
            }, function() {
              drama(--num, cb);
            });
          });
        }
        
        function setOutcome(outcome, cb) {
          
          $el.find('.current').removeClass('current').fadeOut(dice(50, 800), function() {
            $(this).remove();
          }).end();
          
          $el.append(
              $('<div>')
                .hide()
                .addClass('current')
                .css('position', 'absolute')
                .append(
                  $('<span>').text((outcome.player.name || outcome.player.key)+': ')
                )
                .append(
                  $('<span>').text(' ' + (outcome.price.name || outcome.price.key))
                )
                .fadeIn(dice(50, 800), cb)
            )
          ;
        }
      }
      
      function updateOutcomes() {
        var $l = $('.outcomelist');
        $l.empty();
        outcomes.each(function(outcome) {
          $l.append(
            $('<div>').append(
              $('<span>').text((outcome.player.name || outcome.player.key)+': ')
            ).append(
              $('<span>').text(' ' + (outcome.price.name || outcome.price.key))
            )
          );
        });
      }
      
      // Prices
      Lawnchair({name: 'prices', record: 'price'}, function(prices) {
        // prices.nuke();
        updatePicelist();
        
        function updatePicelist() {
          var $l = $('.pricelist');
          $l.empty();
          prices.each(function(price) {
            $l.append(
              $('<div>').append(
                $('<a>')
                  .css({cursor: 'pointer', color: '#999'})
                  .text('x')
                  .data('key', price.key)
                  .bind('click', onPriceRemove)
              ).append(
                $('<span>').text(' ' + (price.num || 0) + ' * ')
              ).append(
                $('<span>')
                  .text(' ' + (price.name || price.key) + ' ')
              ).append(
                price.num > 0 ?
                $('<a>')
                  .css({cursor: 'pointer', color: '#999'})
                  .text('dice')
                  .data('key', price.key)
                  .bind('click', onDiceForPrice)
                : $('<span>')
              )
            );
          });
        }
        
        function onPriceRemove() {
          prices.remove($(this).data('key'), function() {
            updatePicelist();
          });
          return false;
        }
        
        function onAddPrice() {
          var $name = $(this).find('.name'),
              $num = $(this).find('.num');
          prices.save({
            name: $name.val(),
            num: $num.val()
          }, function() {
            $name.val('');
            $num.val('1');
            updatePicelist();
          });
          return false;
        }
        
        $('.add-price').bind('submit', onAddPrice);
        
        function onDiceForPrice() {
          updateOutcomes();
          prices.get($(this).data('key'), function(price) {
            // console.log(price);
            // console.log(outcomes);
            randomPlayer(function(player) {
              // console.log(player);
              --price.num;
              prices.save(price, function() {
                updatePicelist();
                outcomes.save({
                  price: price,
                  player: player
                }, function(outcome) {
                  updateCurrentOutcome(outcome);
                });
              });
            });
          });
        }
        
        // Nuke all
        $('.nuke').bind('click', function() {
          outcomes.nuke(updateOutcomes);
        });
      });
    });
  });
});