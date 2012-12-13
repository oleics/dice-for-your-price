$(function() {
  
  // Players
  Lawnchair({name: 'players', record: 'player'}, function(players) {
    var $playerboxes = $('.playerboxes');
    
    var cycling = 0,
        isCycling = false;
    
    $('.show-settings').bind('click', function() {
      $('.settings').toggleClass('hide');
      $('.game').toggleClass('hide');
    });
    $('.stop-cycling').hide().bind('click', stopCycling);
    $('.start-cycling').bind('click', startCycling);
    
    // players.nuke();
    updatePlayerlist();
    
    function updatePlayerboxes() {
      var index = 0;
      $playerboxes.empty();
      
      players.all(function(records) {
        shuffle(records);
        _.each(records, function(player) {
          var $b = $playerboxes.find('#playerbox-'+player.key);
          if($b.length === 0) {
            $b = $('<div>')
              .addClass('playerbox')
              .text(player.name||player.key)
            ;
            $playerboxes.append($b);
          }
          $b.animate({
            // zIndex: ++index,
            top: ($playerboxes.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
            left: ($playerboxes.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
          });
        });
      });
    }
    
    function stackPlayerboxes() {
      $playerboxes.children().each(function(i, c) {
        $(c).animate({
          // zIndex: ++index,
          top: ($playerboxes.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
          left: ($playerboxes.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
        });
      });
    }
    
    function cycle() {
      if(!cycling) {
        isCycling = false;
        $('.start-cycling').show();
        return;
      }
      var $b = $playerboxes.children().last(),
          left = -1*($b.width()+dice(1, 5)),
          top = dice(1, 7),
          slowdown = cycling > 0 ? 1 : 1;
      $b.animate({
          top: '+=' + top,
          left: '+=' + left
        }, dice(slowdown * 150, slowdown * 300), function() {
          $b.detach().prependTo($playerboxes).animate({
              top: ($playerboxes.height() / 2) - ($b.height() / 2) + dice(-10, 10, 2),
              left: ($playerboxes.width() / 2) - ($b.width() / 2) + dice(-10, 10, 2)
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
      updatePlayerboxes();
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
    
    function updatePlayerlist() {
      var $l = $('.playerlist');
      $l.empty();
      players.each(function(player) {
        $l.append(
          $('<div>')
            .addClass('player')
            .append(
              $('<a>')
                .addClass('btn')
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
      updatePlayerboxes();
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
              $('<div>')
                .addClass('price')
                .append(
                  $('<a>')
                    .addClass('btn')
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
                    .addClass('btn')
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