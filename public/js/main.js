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
      
      createOutcomes(function(outcomes) {
        createGame(players, prices, outcomes, function(game) {
          game.setGameButtonsArea($('.game-buttons-area'));
          game.setGameRenderArea($('.game-render-area'));
          game.updateCards();
          
          $('.show-settings').bind('click', function() {
            $('.settings').toggleClass('hide');
            $('.game').toggleClass('hide');
          });
        });
      });
    });
    
    // var $outcomelist = $('.outcomelist');
    
    // createOutcomes(function(outcomes) {
      // outcomes.updateOutcomelist($outcomelist);
    // });
  });
});