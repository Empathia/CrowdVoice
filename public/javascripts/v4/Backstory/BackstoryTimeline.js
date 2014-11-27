Class(CV, 'BackstoryTimeline').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-wrapper">\
            <div class="cv-timeline__background">\
                <div></div>\
            </div>\
            <div class="cv-timeline__info-mask"></div>\
            <div class="cv-timeline"></div>\
        </div>\
    ',
    prototype : {
        /**
         * Timeline element data holder
         * @property _data <private> [Object]
         */
        _data : null,

        /**
         * Holds the reference to the timeline element.
         * @property _timelineElement <private> [jQuery Object]
         */
        _timelineElement : null,

        /**
         * Holds the reference to the background element.
         * @property _backgroundElement <private> [jQuery Object]
         */
        _backgroundElement : null,

        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._backgroundElement = this.element.find('.cv-timeline__background > div');
            this._timelineElement = this.element.find('.cv-timeline');
            console.log('timeline');
        },

        /**
         * Setup the elements and instanciate its children.
         * @method updateUI <public> [Function]
         */
        updateUI : function updateUI() {
            this._data = CV.BackstoryRegistry.getInstance().get();

            this._backgroundElement[0].style.backgroundImage = 'url(' + this.background + ')';

            Object.keys(this._data).forEach(function(propertyName) {
                this.appendChild(new CV.BackstoryTimelineYear({
                    name : 'year-' + propertyName,
                    year : propertyName,
                    months : this._data[propertyName]
                })).render(this._timelineElement);
            }, this);

            return this;
        }
    }
});
