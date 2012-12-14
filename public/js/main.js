$(function() {
  var $formAddPlayer = $('.add-player'),
      $playerlist = $('.playerlist');
  
  createPlayers(function(players) {
    players.updatePlayerlist($playerlist);
    $formAddPlayer.bind('submit', players.onAddPlayer);
    
    var $formAddPrice = $('.add-price'),
        $pricelist = $('.pricelist');
    
    createPrices(function(prices) {
      prices.updatePricelist($pricelist);
      $formAddPrice.bind('submit', prices.onAddPrice);
      
      var $outcomelist = $('.outcomelist');
      
      createOutcomes(function(outcomes) {
        outcomes.updateOutcomelist($outcomelist);
        $('.nuke-outcomes').bind('click', function() {
          if(!confirm('Wirlich alle Gewinne löschen?')) return;
          if(!confirm('Nochmal: Wirlich alle Gewinne löschen? Diese Aktion ist nicht umkehrbar.')) return;
          outcomes.nuke();
          outcomes.updateOutcomelist();
        });
        
        createGame(players, prices, outcomes, function(game) {
          game.setGameButtonsArea($('.game-buttons-area'));
          game.setGameRenderArea($('.game-render-area'));
          game.updateCards();
          
          // 
          $('.shuffle-cards').bind('click', function() {
            $('.shuffle-cards').hide();
            $('.start-cycling').hide();
            $('.stop-cycling').hide();
            game.shuffleCards(3, function() {
              $('.shuffle-cards').show();
              $('.start-cycling').show();
              $('.stop-cycling').hide();
            });
          });
          
          // Toggle settings and game
          $('.show-settings').bind('click', function() {
            $('.settings').toggleClass('hide');
            $('.game').toggleClass('hide');
            if($('.settings').hasClass('hide')) {
              $(this).text('Settings').hide();
              game.updateCards();
            } else {
              $(this).text('Play').hide();
            }
          });
          
          $('.continue').bind('click', function() {
            $('.game').addClass('hide');
            $('.settings').removeClass('hide');
          });
          
          prices.onDiceForPrice = function(price) {
            $('.settings').addClass('hide');
            $('.game').removeClass('hide');
            $('.show-settings').text('Settings').hide();
            
            $('.shuffle-cards').hide();
            $('.start-cycling').hide();
            $('.stop-cycling').hide();
            $('.continue').hide();
            
            game.setPrice(price);
            
            game.updateCards();
            
            game.shuffleCards(dice(2, 5, 3), function() {
              $('.shuffle-cards').hide();
              $('.start-cycling').show();
              $('.stop-cycling').hide();
              $('.show-settings').hide();
              
              game.startCycling();
            });
          };
          
          // 
          game.onWinner = function(player, price) {
            console.log('onWinner', player, price);
            --price.num;
            prices.save(price, function() {
              prices.updatePricelist();
              
              players.remove(player.key, function() {
                players.updatePlayerlist();
                
                outcomes.save({
                  price: price,
                  player: player
                }, function(outcome) {
                  outcomes.updateOutcomelist();
                  $('.continue').show();
                });
              });
            });
          };
        });
      });
    });
  });
});