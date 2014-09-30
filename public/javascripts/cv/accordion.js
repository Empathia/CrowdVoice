Class('Accordion')({
    prototype: {
        init: function(element) {
            this.element = typeof element == "string" ? $(element) : element;
            this.sidebarWrapper = $('.sidebar-wrapper');
            this._bindEvents();
        },

        _bindEvents: function () {
            var that = this;
            this.element.parent().click(function () {
                that.toggle($(this).children('span'));
            });
        },

        toggle: function (panel) {
            var content = panel.parent().next("ul");
            content.stop(false, true).slideToggle('fast', function() {
                if (!panel.hasClass('down-arrow')) {
                    content[0].style.overflow = "";
                }
            });
            panel.toggleClass('down-arrow');
            this.sidebarWrapper.trigger('sidebar.change');
        }
    }
});
