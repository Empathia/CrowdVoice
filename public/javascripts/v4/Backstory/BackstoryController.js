Class(CV, 'BackstoryController').includes(NodeSupport)({
    API_PATH : '/api/data.json?voice_id=',

    prototype : {
        /**
         * Boot the app.
         * @method run <public> [Function]
         * @argument backstoryWrapperElement <optional> The element to append the
         * whole backstory component.
         * return this [BackstoryController]
         */
        run : function run(backstoryWrapperElement) {
            var wrapper = backstoryWrapperElement || $(document.body);

            this.appendChild(new CV.BackstoryUIComponent({
                name : 'backstoryUIComponent',
                background : wrapper.dataset.background
            })).render(wrapper).showSpinner();

            window.CV.backstoryUIComponent = this.backstoryUIComponent;

            this._getDataModel(window.currentVoice.id, function(error, res) {
                var data;

                if (error) {
                    this.backstoryUIComponent.hideSpinner();
                    // report error ui, server, etc
                    return;
                }

                data = this._formatDataModel(res.events);
                CV.BackstoryRegistry.getInstance().set(data);

                this.backstoryUIComponent.updateUI().hideSpinner();
            }.bind(this));
        },

        /**
         * Request the backstory data to the server.
         * @method _getDataModel <private> [Function]
         * @argument voiceID <optional> [Number] The id of the voice from which we want
           to request the events (window.currentVoice.id)
         * @argument callback <required> [Function]
         * @return callback(error, response) [Function]
         */
        _getDataModel : function _getDataModel(voiceID, callback) {
            voiceID = voiceID || window.currentVoice.id;

            if (typeof callback !== "function") {
                console.log('_getDataModel required a function to return the results.')
                return;
            }

            $.ajax({
                url: this.constructor.API_PATH + voiceID,
                success : function(data, status, jqXHR) {
                    callback(null, data);
                },
                error : function(error) {
                    callback(error);
                }
            });
        },

        /**
         * Apply a new structure to out data-model and return it.
         * @method _formatDataModel <private> [Function]
         * @argument data <required> [Object]
         * @return result [Object]
         */
        _formatDataModel : function _formatDataModel(data) {
            var result = [];

            data.forEach(function(event) {
                var year, month, day, _year, _month, yearExists, monthExists;

                year = event.event_date.substring(0,4);
                month = event.event_date.substring(5,7);
                day = event.event_date.substring(8,10);

                /* extend event */
                event.day = day;
                event.month = month;
                event.year = year;

                yearExists = result.some(function(r) {
                    if (r['year'] == year) return _year = r;
                });

                if (!yearExists) {
                    result.push({year: year, months: [{ numeric: month, events: [event]}]});
                } else {
                    monthExists = _year.months.some(function(m) {
                        if (m.numeric == month) return _month = m;
                    });

                    if (!monthExists) _year.months.push({numeric: month, events: [event]});
                    else _month.events.push(event);
                }
            });

            result.sort(function(a, b) {
                if (a.year > b.year) return 1;
                if (a.year < b.year) return -1;
                return 0;
            }).forEach(function(e) {
                return e.months.sort(function(a, b) {
                    if (a.numeric > b.numeric) return 1;
                    if (a.numeric > b.numeric) return -1;
                    return 0;
                }).forEach(function(e) {
                    return e.events.sort(function(a, b) {
                        if (a.day > b.day) return 1;
                        if (a.day > b.day) return -1;
                        return 0;
                    });
                });
            });

            return result;
        }
    }
});

