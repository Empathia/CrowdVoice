Class(CV, 'BackstoryUIComponent').inherits(Widget)({
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            console.log('ui component')

            this.appendChild(new CV.BackstoryBreadcrumb({
                name : 'breadcrumb',
                type : 'month'
            })).render(this.element);

            this.appendChild(new CV.BackstoryTimeline({
                name : 'timeline',
                background : this.background
            })).render(this.element);
        },

        showSpinner : function showSpinner() {
            console.log('show spinner')
            return this;
        },

        hideSpinner : function hideSpinner() {
            console.log('hide spinner')
            return this;
        },

        updateUI : function updateUI() {
            console.log('update ui')
            this.timeline.updateUI();
            this.breadcrumb.updateUI();
            return this;
        }
    }
});
