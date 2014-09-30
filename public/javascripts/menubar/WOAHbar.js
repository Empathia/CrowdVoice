// <!-- START WOAHbar FOR DESKTOP  -->
var stub_showing = false;
 
    function woahbar_show() {
        if(stub_showing && $('.woahbar-stub').length > 0) {
          $('.woahbar-stub').slideUp('fast', function() {
            $('.woahbar').show('bounce', { times:3, distance:15 }, 300);
            $('#wrapper').animate({"marginTop": "52px"}, 300);
          });
        } else if($('.woahbar').length){
          $('.woahbar').show('bounce', { times:3, distance:15 }, 500);
          $('#wrapper').animate({"marginTop": "52px"}, 250);
        }
    }
 
    function woahbar_hide() { 
        $('.woahbar').slideUp('fast', function() {
          $('.woahbar-stub').show('bounce', { times:3, distance:15 }, 100);
          stub_showing = true;
        });
 
        if( $(window).width() > 1024 ) {
          $('#wrapper').animate({"marginTop": "0px"}, 250); // if width greater than 1024 pull up the #wrapper
        }
    }
 
    $(document).ready(function() {
        woahbar_show();
    });

// <!-- END WOAHbar FOR DESKTOP - START WOAHbar FOR MOBILE  -->

var mstub_showing = false;
 
    function mwoahbar_show() {
        if(mstub_showing && $('.woahbar-stub').length > 0) {
          $('.mwoahbar-stub').slideUp('fast', function() {
            $('.mwoahbar').show('bounce', { times:3, distance:15 }, 300);
            $('#wrapper').animate({"marginTop": "52px"}, 300);
          });
        } else if($('.woahbar').length){
          $('.mwoahbar').show('bounce', { times:3, distance:15 }, 500);
          $('#wrapper').animate({"marginTop": "52px"}, 250);
        }
    }
 
    function mwoahbar_hide() {
        $('.mwoahbar').slideUp('fast', function() {
          $('.mwoahbar-stub').show('bounce', { times:3, distance:15 }, 100);
          mstub_showing = true;
        });
 
        if( $(window).width() > 1024 ) {
          $('#wrapper').animate({"marginTop": "0px"}, 250); // if width greater than 1024 pull up the body
        }
    }
 
    $(document).ready(function() {
        mwoahbar_show();
    });