Class(CV, 'BackstoryGalleryCarrousel').inherits(Widget)({
    HTML : '<ul></ul>',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
        },

        addThumbs : function addThumbs(data) {
            data.forEach(function(item) {
                this.appendChild(new CV.BackstoryGalleryThumb({
                    data: item
                })).render(this.element);
            }, this);

            return this;
        },

        activateFirst : function activateFirst() {
            this.children[0].activate();

            return this;
        },

        deactivateAll : function deactivateAll() {
            this.children.forEach(function(child) {
                child.deactivate();
            });
        }
    }
});
