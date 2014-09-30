jQuery(function () {
     var max = $('#max').val();  
     var min = $('#min').val();
     var maximo = $('#max-value').val();
     var minimo = $('#min-value').val();
     var rangeSlider = $('<div></div>') 
      .slider({
        min: -10, 
        max: 10, 
        step: 1, 
        values: [minimo, maximo], 
        range: true, 
        animate: true, 
        slide: function(e,ui) { 
          $('#min') 
            .val(minimo);
          $('#max') 
            .val(maximo);
           
          if (ui.values[0] > -1 || ui.values[1] < 1 ) {
            return false
          }
          $( "#max-value" ).val(ui.values[ 1 ]);
          $( "#min-value" ).val(ui.values[ 0 ]);
        } 
     });
      
     $('#voiting-treshold').after(rangeSlider).hide();
     
     $('.ui-slider-handle').first().addClass('handle-left');
     
});