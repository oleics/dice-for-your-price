function createOutcomes(cb) {
    
    // Outcomes
    Lawnchair({name: 'outcomes', record: 'outcome'}, function(outcomes) {
      // outcomes.nuke();
      var $l;
      
      function updateOutcomelist($_l) {
        if($_l) $l = $_l;
        $l.empty();
        outcomes.each(function(outcome) {
          $l.append(
            $('<div>')
              .addClass('outcome')
              .append(
                $('<span>').text((outcome.player.name || outcome.player.key)+': ')
              ).append(
                $('<span>').text(' ' + (outcome.price.name || outcome.price.key))
              )
          );
        });
      }
      
      _.extend(outcomes, {
        updateOutcomelist: updateOutcomelist
      });
      
      cb(outcomes);
    });
}