Class('Excerpt')({
    prototype: {
        init: function (element, options) {
            this.options = {
                showChar     : 121,
                ellipsestext : window.innerWidth <= 460 ? ' - ' : '...',
                moreText     : '.more-quote'
            };
            $.extend(this.options, options);
            this.element        = typeof element == "string" ? $(element) : element;
            this.quote          = this.element.children('em');
            this.quoteCont      = this.quote.html();
            this.button         = this.element.children('em').next('a');
            this.moreText       = $(this.options.moreText);
            this.userWindow     = $(window);
            this._getExcerptLength();
            this._createExcerpt();
            this.element.removeClass('initial-state');
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;

            this.button.click(function () {
                that.toggleExcerpt();
            });
            this.element.bind('infobox:show', function(){
                that.showExcerpt();
            }).bind('infobox:hide', function(){
                that.hideExcerpt();
            });

            this.userWindow.bind('resize smartresize', function () {
               that._recalcExcerpt();
            });
        },
        _recalcExcerpt: function(){
            var that = this;

            clearTimeout(this.recalcTimeout);
            this.recalcTimeout = setTimeout(function(){
                that._getExcerptLength();
                !that.shown && that._createExcerpt();
            }, 100);
        },
        _getExcerptLength: function(){
            var that = this,
                windowWidth = window.innerWidth;
            if (windowWidth <= 845 && windowWidth > 769) {
                this.options.showChar = 100;
            } else if (windowWidth <= 769 && windowWidth > 601){
                this.options.showChar = 80;
            } else if (windowWidth <= 601 && windowWidth > 460){
                this.options.showChar = 50;
            } else if (windowWidth <= 460){
                this.options.showChar = 0;
            } else {
                this.options.showChar = 121;
            }
            return this;
        },
        _createExcerpt: function() {
            var that = this,
                characters = this.options.showChar,
                quote = this.quote,
                quoteCont = this.quoteCont,
                quoteSize = quoteCont.length,
                ellipsestext = this.options.ellipsestext,
                ellipsesSymbol = window.innerWidth <= 460 ? ' - ' : '...';

                quoteCont = quoteCont.replace('<span class="ellipsestext">'+ellipsestext+'</span><span class="more-quote">','')
                                    .replace('</span>','');

            if (quoteSize > this.options.showChar) {
                var c = quoteCont.substr(0, characters),
                    h = quoteCont.substr(characters, quoteSize - characters);
                quote.html(c + '<span class="ellipsestext">' + ellipsestext + '</span><span class="more-quote">' + h + '</span>');
                quote.show();
            } else {
                this.button.hide();
            }
            this.element.trigger('excerpt.toggle');
        },
        toggleExcerpt: function(){
            if ($('.more-quote').is(':hidden')) {
                this.showExcerpt();
            } else {
                this.hideExcerpt();
            }
            if ('smartresize' in this.userWindow) this.userWindow.smartresize();
        },
        showExcerpt: function(){
            if ($('.more-quote').is(':hidden')) {
                $('.more-quote').toggle();
                $('.ellipsestext').hide();
                this.button.children('span').text("Less");
                this.element.trigger('excerpt.toggle')
                    .removeClass('collapsed')
                    .addClass('expanded');
                this.shown = true;
            }
        },
        hideExcerpt: function(){
            if (!$('.more-quote').is(':hidden')) {
                $('.more-quote').toggle();
                $('.ellipsestext').show();
                this.button.children('span').text("More").show();
                this.element.trigger('excerpt.toggle')
                    .removeClass('expanded')
                    .addClass('collapsed');
                this.shown = false;
            }
        }
    }
});

