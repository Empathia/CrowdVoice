Class('InfoWall')({
  prototype: {
    init: function(element, data) {
      // ELEMENT & DATA GATHERING
      var infoboxData, _i, _len, _ref;
      this.element                  = typeof element === 'string' ? $(element) : element;
      this.element.data('neon', this);
      this.infoboxesData            = data;
      this.infoboxStyle             = $('.infobox-style');
      this.navBar                   = $('.nav-bar');
      this.mainContainer            = $('.main-container');
      this.header                   = this.element.find('.voice-info');
      this.wallCont                 = this.element.find('.infobox-wall');
      this.wallPane                 = this.element.find('.infobox-pane');
      this.mainVoice                = this.element.find('.no-caption');
      this.voiceTools               = this.element.find('.no-caption .voice-info-tools li');
      this.overlay                  = this.element.find('.info-wall-overlay');
      this.voiceTitle               = this.mainContainer.find('.voice-title');
      this.infowallTooltip          = new Tooltip('.widget', { hover: true });
      this.blogWidget               = new BlogWidget();
      // preloading vars must be declared beore the infobox building, because the charts report their load pretty fast
      this.currentImages            = 0;
      this.currentCharts            = 0;
      _ref                          = this.infoboxesData;
      // call render for each infobox
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        infoboxData = _ref[_i];
        this.addInfobox(infoboxData);
      }
      //infobox size configuration
      this.infoboxWhiteSpace      = ((parseInt(this.element.find('.infobox').css('padding-right'), 10)) + (parseInt(this.element.find('.infobox').css('margin-right'), 10))) * 2;
      this.infoboxWidth           = (this.element.find('.infobox').width()) + this.infoboxWhiteSpace;
      this.infoboxMargin          = parseInt(this.wallCont.css('padding-right'), 10);
      this.infoboxPadding         = parseInt(this.element.find('.infobox').css('padding-right'), 10);
      //know how many stuff we are expecting
      this.totalImages            = this.wallPane.find('.infobox').find('.graphic img').length;
      this.totalCharts            = this.wallPane.find('.infobox').find('.graphic.high-chart').length;

      this.initSourcesScrollbars();
      this.bindEvents();
      this.updateLayout();
    },
    reportLoad: function(type) {
      switch (type) {
        case 'image':
          this.currentImages++;
          break;
        case 'chart':
          this.currentCharts++;
      }
      if (this.currentImages === this.totalImages && this.currentCharts === this.totalCharts) {
        return this.updateLayout();
      }
    },
    addInfobox: function(infoboxData) {
      var infobox;
      //InfoBox (json data, template selector, small chart-sidebar-version?)
      infobox = new InfoBox(infoboxData, '.infobox-template', false).render();
      return this.wallPane.append(infobox);
    },
    bindEvents: function() {
      var infoWall = this;

      // check for each image inside each infoboxes
      this.wallPane.find('.infobox').find('.graphic img').each(function(i, el) {
        el = $(el);
        // once the image loads, check if the conditions are met
        el.load(function() {
          // if not, then keep counting, this skips the element with load error
          infoWall.reportLoad('image');
        }).error(function() {
          infoWall.reportLoad('image');
          // trick the browser to make it bind the events before images are loaded
        }).attr('src', el.attr('src'));
      });

      $(window).bind('load smartresize', function() {
        infoWall.updateLayout();
      }).smartresize();

      this.wallPane.find('.infobox .sources-open').bind('click', function(event) {
        $(event.target).closest('.infobox').find('.sources-list-wrapper').addClass('show');
      });

      this.wallPane.find('.infobox .sources-back').bind('click', function(event) {
        $(event.target).closest('.sources-list-wrapper').removeClass('show');
      });
    },
    updateLayout: function() {
      var infoboxGaplessSize, isotopeCallback, minColumns, wallWidth,
        infoWall  = this;
      // get voices Sidebar size
      wallWidth                 = this.wallPane.width() - 15;
      // how many minimum columns fit?
      minColumns                = Math.floor(wallWidth / this.infoboxWidth);
      // how much space is needed?
      infoboxGaplessSize        = Math.floor(wallWidth / minColumns);
      infoboxGaplessSize        = (infoboxGaplessSize - this.infoboxWhiteSpace) - 2; //2px rounding compensate

      // resize boxes
      this.infoboxStyleTemplate = "<style class='infobox-style' type='text/css'>.infobox-wall .infobox { width: " + infoboxGaplessSize + "px }</style>";
      this.infoboxStyle.replaceWith(this.infoboxStyleTemplate);
      // since was replaced, update reference
      this.infoboxStyle         = $('.infobox-style');

      isotopeCallback = function(data, options) {
        var wallHeight = $(window).height() - infoWall.header.height();
        // set wall size so the scroll size sets correctly
        infoWall.wallCont.height(wallHeight);
        // resize wall pane so bottom infobox don't get masked
        infoWall.wallPane.height((_.max(options.masonry.colYs)));
        infoWall.overlay.fadeOut();
      };

      if (!this.wallPane.hasClass('isotope')) {
        this.wallPane.isotope({
          itemSelector      : '.infobox',
          animationEngine   : 'jquery',
          resizable         : false,
          transformsEnabled : false,
          resizesContainer  : false,
          getSortData       : {
            order : function($elem) {
              return $elem.attr('order');
            }
          },
          sortBy: 'order'
        }, isotopeCallback);
      } else {
        this.wallPane.isotope('reLayout', isotopeCallback);
      }

      this.updateSourcesScrollbars();
      infoWall.setNavigationBehaviors();
    },

    initSourcesScrollbars: function() {
        var _this = this;
        return this.wallPane.find('.infobox .scroll').each(function(i, el) {
            var $el = $(el);
            var infobox = $el.closest('.infobox');

            $el.height(infobox.find('.info').height() - infobox.find('.sources-list-wrapper .header').outerHeight());

            var scroll = $el.jScrollPane({
                autoReinitialise: false,
                contentWidth    : $el.width()
            });

            $el.data('scrollpane', scroll.data('jsp'));
        });
    },

    updateSourcesScrollbars: function() {
        var _this = this;
        return this.wallPane.find('.infobox .scroll').each(function(i, el) {
            var $el = $(el);
            var infobox = $el.closest('.infobox');

            $el.height(infobox.find('.info').height() - infobox.find('.sources-list-wrapper .header').outerHeight());
            if ($el.data().jsp !== undefined) $el.data().jsp.reinitialise();
        });
    },
    setNavigationBehaviors: function(){
      var infoWall = this, detachTimeout;
      if ( detachTimeout ){
          clearTimeout(detachTimeout);
      }
      detachTimeout = setTimeout(function(){
          if (window.innerWidth <= 480 && !infoWall.navBar.hasClass('detached')) {
              infoWall.navBar.addClass('detached').insertBefore(infoWall.mainContainer);
          } else if (window.innerWidth > 480 && infoWall.navBar.hasClass('detached')) {
              infoWall.navBar.insertBefore(infoWall.voiceTitle).removeClass('detached');
          }
      }, 100);
    }
  }
});
