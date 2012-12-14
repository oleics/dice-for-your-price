function createPrices(cb) {
  
  // Prices
  Lawnchair({name: 'prices', record: 'price'}, function(prices) {
    // prices.nuke();
    var $l;
    
    function updatePricelist($_l) {
      if($_l) $l = $_l;
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
                .bind('click', onRemovePrice)
            ).append(
              $('<span>').text(' ' + (price.num || 0) + ' * ')
            ).append(
              $('<span>')
                .text(' ' + (price.name || price.key) + ' ')
            // ).append(
              // price.num > 0 ?
              // $('<a>')
                // .addClass('btn')
                // .text('dice')
                // .data('key', price.key)
                // .bind('click', onDiceForPrice)
              // : $('<span>')
            )
        );
      });
    }
    
    function onRemovePrice() {
      prices.remove($(this).data('key'), function() {
        updatePricelist();
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
        updatePricelist();
      });
      return false;
    }
    
    _.extend(prices, {
      updatePricelist: updatePricelist,
      onAddPrice: onAddPrice
    });
    
    cb(prices);
  });
}