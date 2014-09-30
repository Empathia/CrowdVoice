(function() {

  Class('InfoPane')({
    prototype: {
      init: function(element) {
        this.element = typeof element === 'string' ? $(element) : element;
        this.element.data('neon', this);
        this.wallCont = this.element.find('.infobox-wall-container');
        this.wall = this.element.find('.infobox-wall');

        this.bindEvents();
      },
      bindEvents: function() {
        var _this = this;
        // $(window).smartresize(function() {
          // var paneSize = $('.main-container').width();
          // _this.wallCont.width(paneSize);
          // _this.wall.width(paneSize);
          // _this.wall.find('.jspContainer').width(paneSize);
          // _this.wall.find('.jspPane').width(paneSize);
          // return _this.element.trigger('infoPanel.toggle');
        // });
      }
    }
  });

}).call(this);
