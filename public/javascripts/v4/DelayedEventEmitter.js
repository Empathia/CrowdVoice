Class('DelayedEventEmitter').includes(CustomEventSupport, NodeSupport)({

    WAITING_TIME : 100,

    prototype : {

        init : function(config) {

            for (var property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }

            this.eventCounters = {};

            if (!this.waitingTime) {
                this.waitingTime = this.constructor.WAITING_TIME;
            }

            return this;
        },

        dispatch : function(type, data) {
            var delayedEventEmitter = this;

            if (this.eventCounters[type]) {
                clearTimeout(this.eventCounters[type]);
            }

            this.eventCounters[type] = setTimeout(function() {
                CustomEventSupport.prototype.dispatch.call(delayedEventEmitter, type, data);
                clearTimeout(delayedEventEmitter.eventCounters[type]);
            }, this.waitingTime);
        }

    }
});
