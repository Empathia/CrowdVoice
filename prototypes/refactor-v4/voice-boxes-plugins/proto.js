window.onload = function() {

    var $container  = $('ul'),
        $items      = $container.find('li');


    /* ---- ISOTOPE ---- */
    // $container.isotope({
    //     itemSelector : 'li',
    //     masonry: {
    //         columnWidth: 230
    //     }
    // });


    /* ---- MASONRY ---- */
    new Masonry( document.querySelector('ul'), {
      columnWidth: 230,
      itemSelector: 'li'
    });

    // $container.masonry({
    //   columnWidth: 230,
    //   itemSelector: 'li'
    // });


    /* ---- WOODMARK ---- */
    // $items.wookmark({
    //     autoResize: true,
    //     container: $container,
    //     itemWidth: 210,
    //     offset: 15,
    // });
}
