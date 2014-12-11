Class('SlideSection')({
    /**
     * Holds all SlideSection instances.
     * @property _slides <private> [Array]
     */
    _slides: [],

    /**
     * Close all instances sections.
     * @property _closeAll <private> [Function]
     * @return SlideSection
     */
    _closeAll : function _closeAll() {
        var i, length;

        length = this._slides.length;

        for (i = 0; i < length; i++) {
            this._slides[i]._close();
        }

        return this;
    },

    prototype: {
        /**
         * Holds the reference to the main button element.
         * @property element <public> [Object]
         */
        element : null,

        /**
         * Holds the reference to the main section to be opened/closed.
         * @property section <public> [Object]
         */
        section : null,

        duration : 200,

        /**
         * Holds the reference to the first input found, you we can autofocus
         * it when the section is opened.
         * @property _firstInput <private> [Object]
         */
        _firstInput : null,

        /**
         * Holds the refence to the cancel link.
         * @property _cancel <private> [Object]
         */
        _cancel : null,

        init : function init(config) {
            this.element = config.element;
            this.section = config.section;

            this._firstInput = this.section.find('input').first();
            this._cancel = this.section.find('.cancel');
            this.constructor._slides.push(this);

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            var slideSection = this;

            this.element.bind('click', function() {
                slideSection._toggle();

                return false;
            });

            this._cancel.bind('click', function() {
                slideSection._close();

                return false;
            });

            return this;
        },

        _open : function _open() {
            var slideSection = this;

            this.constructor._closeAll();
            this.section.slideDown(this.duration, function() {
                slideSection._firstInput.focus();
            });

            return this;
        },

        _close : function _close() {
            this.section.slideUp(this.duration);

            return this;
        },

        _toggle : function _toggle() {
            if (this.section.is(':visible')) {
                return this._close();
            }

            return this._open();
        }
    }
});
