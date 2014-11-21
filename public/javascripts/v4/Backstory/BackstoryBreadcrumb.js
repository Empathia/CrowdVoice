Class(CV, 'BackstoryBreadcrumb').inherits(Widget)({
    HTML : '\
        <div class="cv-timeline-breadcrum clearfix">\
            <div class="cv-timeline-breadcrum__title">Jump to</div>\
            <ul class="cv-timeline-breadcrum__points"></ul>\
        </div>\
    ',
    prototype : {
        data : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('breadcrum')

            this.pointsElement = this.element.find('.cv-timeline-breadcrum__points');
        },

        updateUI : function updateUI() {
            var year, months;

            this.data = CV.BackstoryRegistry.getInstance().get();

            Object.keys(this.data).forEach(function(propertyName) {
                year = propertyName;
                months = this.data[propertyName];

                Object.keys(months).forEach(function(propertyName) {
                    this.appendChild(new CV.BackstoryBreadcrumbItem({
                        name : year + '-' + propertyName,
                        year : year,
                        month : propertyName
                    })).render(this.pointsElement);
                }, this);
            }, this);
        }
    }
});

