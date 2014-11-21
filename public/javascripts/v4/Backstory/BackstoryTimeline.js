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
        _data : null,
        timelineElement : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.backgroundElement = this.element.find('.cv-timeline__background > div');
            this.timelineElement = this.element.find('.cv-timeline');
            console.log('timeline');
        },

        updateUI : function updateUI() {
            this._data = CV.BackstoryRegistry.getInstance().get();

            this.backgroundElement[0].style.backgroundImage = 'url(' + this.background + ')';

            Object.keys(this._data).forEach(function(propertyName) {
                this.appendChild(new CV.BackstoryTimelineYear({
                    name : 'year-' + propertyName,
                    year : propertyName,
                    months : this._data[propertyName]
                })).render(this.timelineElement);
            }, this);
        }
    }
});
