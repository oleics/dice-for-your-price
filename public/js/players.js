
function createPlayers(cb) {
  // Players
  Lawnchair({name: 'players', record: 'player'}, function(players) {
    var $l;
    
    function updatePlayerlist($_l) {
      if($_l) $l = $_l;
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
                .bind('click', onRemovePlayer)
            ).append(
              $('<span>').text(' ' + (player.name || player.key))
            ).append(
              $('<span>').text(' ' + player.prices.join(', '))
            )
        );
      });
    }
    
    function onRemovePlayer() {
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
    
    _.extend(players, {
      updatePlayerlist: updatePlayerlist,
      onRemovePlayer: onRemovePlayer,
      onAddPlayer: onAddPlayer,
      randomPlayer: randomPlayer
    })
    
    cb(players);
  });
}
