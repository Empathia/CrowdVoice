Class(CV, 'BackstoryTimelineCards').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-cards">\
            <div class="cv-timeline-cards__carousel-wrapper">\
                <div class="cv-timeline-cards__carousel"></div>\
            </div>\
            <a href="#" class="cv-timeline-cards__arrow prev">\
                <i class="icon icon-arrow-left"></i>\
            </a>\
            <a href="#" class="cv-timeline-cards__arrow next">\
                <i class="icon icon-arrow-right"></i>\
            </a>\
        </div>\
    ',
    prototype : {
        _current : null,
        _carrouselElement : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.carrouselElement = this.element.find('.cv-timeline-cards__carousel');
            this._prevArrowElement = this.element.find('.cv-timeline-cards__arrow.prev');
            this._nextArrowElement = this.element.find('.cv-timeline-cards__arrow.next');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._prevArrowElement.bind('click', function(ev) {
                this.showPrevCard();
                return false;
            }.bind(this));

            this._nextArrowElement.bind('click', function(ev) {
                this.showNextCard();
                return false;
            }.bind(this));
        },

        start : function start() {
            var childrenLength = this.children.length;

            if (childrenLength) {
                this.showCardByIndex(0);

                if (childrenLength === 1) {
                    this._prevArrowElement.hide();
                    this._nextArrowElement.hide();
                }
            }

            return this;
        },

        showCardByIndex : function showCardByIndex(index) {
            this._current = index;
            this.carrouselElement.css('left', (index * 100 * -1) + "%");
            this.children[this._current].activate();
            this._updateArrowsState();

            return this;
        },

        showPrevCard : function showPrevCard() {
            if (this._current === 0) return;

            this.deactivateAllChildren().showCardByIndex(this._current -= 1);

            return this;
        },

        showNextCard : function showNextCard() {
            if (this._current === this.children.length - 1) return;

            this.deactivateAllChildren().showCardByIndex(this._current += 1);

            return this;
        },

        _updateArrowsState : function _updateArrowsState() {
            this._prevArrowElement.removeClass('disabled');
            this._nextArrowElement.removeClass('disabled');

            if (this._current === 0) this._prevArrowElement.addClass('disabled');
            if (this._current === this.children.length - 1) this._nextArrowElement.addClass('disabled');

            return this;
        },

        deactivateAllChildren : function deactivateAllChildren() {
            this.children.forEach(function(child) {
                child.deactivate();
            });

            return this;
        }
    }
});
