Class('PaginationWidget').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver, index){
            this.element        = element;
            this.eventReceiver  = eventReceiver;
            this.itemIndex      = index;
            this.bindEvents();
        },
        bindEvents : function() {
            var that = this;
            this.element.bind('click', function(){
                that.eventReceiver.trigger('pagination:click', that.itemIndex);
            });
        }
    }
});