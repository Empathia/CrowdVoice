Class('CaptionWidget').includes(Widget)({
    prototype : {
        init : function (element, eventReceiver, index){
            this.element        = element;
            this.eventReceiver  = eventReceiver;
            this.itemIndex      = index;
        }
    }
});