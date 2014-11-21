Class(CV, 'BackstoryController').includes(NodeSupport)({
    API_PATH : '/api/data.json?voice_id=',

    prototype : {
        _model : null,

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

            this._getDataModel(window.currentVoice.id, function(error, res) {
                var data;

                if (error) {
                    this.backstoryUIComponent.hideSpinner();
                    // report error ui, server, etc
                    return;
                }

                data = this._formatDataModel(res.events);

                CV.BackstoryRegistry.getInstance().set(data);
                this._model = CV.BackstoryRegistry.getInstance().get();

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
            var result = {};

            data.forEach(function(event) {
                var year, month;

                year = event.event_date.substring(0,4);
                month = event.event_date.substring(5,7);

                if (!result[year]) {
                    result[year] = {};
                }

                if (!result[year][month]) {
                    result[year][month] = [];
                }

                result[year][month].push(event);
            });

            return result;
        }
    }
});

