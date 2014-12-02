Class(CV, 'FlashMessage').inherits(Widget)({
    prototype : {
        closeBtn: null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);
       
            this.closeBtn = this.closeBtn || this.element.find('.close-message');

            this._bindEvents();
        },

        _bindEvents: function _bindEvents() {
            this.closeBtn.click(function () {
                this.close();
                return false;
            }.bind(this));

            return this;
        },

        close : function close() {
            var flashMessage = this;
            
            this.element.slideUp(200, function () {
                flashMessage.element.trigger('flash.close');
            });

            return this;
        }
    }
});
