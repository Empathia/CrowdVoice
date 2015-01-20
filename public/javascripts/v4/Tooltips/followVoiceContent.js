Class(CV, 'FollowVoiceTooltipContent').inherits(Widget)({
    HTML : '\
        <form novalidate>\
            <strong class="title headline">Follow This Voice</strong>\
            <div class="info-wrapper">\
              <div class="options-group">\
                <p class="blog-widget-subtitle">Enter your email address</p>\
                <input type="email" class="cv-input cv-input--medium cv-input--dynamic-color cv-block"/>\
                <span class="error-email">Please enter a valid email address</span>\
              </div>\
              <div class="options-group radio-options-group clearfix">\
                <p class="blog-widget-subtitle">How Frecuently would you like to receive updates?</p>\
              </div>\
              <button type="submit" class="cv-button cv-button--medium cv-button--dynamic-color cv-uppercase">Follow this voice</button>\
            </div>\
            <div class="success-message">\
                <div class="table">\
                    <div class="cell">\
                        <p class="title">Thanks for subscribing!</p>\
                        <p class="small-text">If you already subscribed with this email your previous settings will be updated with these new ones.</p>\
                        <button class="js-ok-button cv-button cv-button--medium cv-button--dynamic-color cv-uppercase">Ok</button>\
                    </div>\
                </div>\
            </div>\
        </form>\
    ',
    prototype : {
        _emailRe : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        _radioOptionsGroupElement : null,
        _radioOptionsElements : null,
        _emailElement : null,
        _errorEmailMessage : null,
        _successMessageElement : null,
        init : function(config) {
            Widget.prototype.init.call(this, config);

            this._radioOptionsGroupElement = this.element.find('.radio-options-group');
            this._emailElement = this.element.find('input[type="email"]');
            this._errorEmailMessage = this.element.find('.error-email');
            this._successMessageElement = this.element.find('.success-message');
            this._okButton = this.element.find('.js-ok-button');

            this._setupElements()._bindEvents();
        },

        _setupElements : function _setupElements() {
            var radioFragment = document.createDocumentFragment();
            var optionsData = [
                {
                    label : 'Daily',
                    value : 'daily'
                },
                {
                    label : 'Weekly',
                    value : 'weekly'
                },
                {
                    label : 'Every 2 weeks',
                    value : 'biweekly'
                },
                {
                    label : 'Every month',
                    value : 'monthly'
                },
                {
                    label : 'Every 3 months',
                    value : 'quarterly'
                },
                {
                    label : 'Every 6 months',
                    value : 'biannual'
                },
                {
                    label : 'yearly',
                    value : 'annualy'
                }
            ];

            optionsData.forEach(function(option) {
                radioFragment.appendChild(this._createRadioOption(option.label, option.value));
            }, this);

            this._radioOptionsGroupElement.append(radioFragment);

            this._radioOptionsElements = this._radioOptionsGroupElement.find('input[type="radio"]');
            this._radioOptionsElements[0].setAttribute('checked', true);

            radioFragment = options = null;

            return this;
        },

        _bindEvents : function _bindEvents() {
            var followVoiceTooltip = this;

            this.element.bind('submit', function(ev) {
                ev.preventDefault();

                console.log('form submit');
                console.log('option selected =>', this._radioOptionsElements.filter(':checked').val());

                this.clearFormErrors();

                if (!this._emailRe.test()) {
                    this._showFormErrors();
                }

                // on success
                // this._successMessageElement.show();
            }.bind(this));

            this._emailElement.bind('keydown', function() {
                followVoiceTooltip.clearFormErrors();
            });

            this._okButton.bind('click', function() {
                CV.headerNavWidget.followVoiceTooltip.deactivate();
                this._successMessageElement.hide();
            });

            return this;
        },

        _createRadioOption : function _createRadioOption(labelText, value) {
            var label = document.createElement('label');
            var radio = document.createElement('input');
            var text = document.createElement('span');

            text.appendChild(document.createTextNode(labelText));
            text.className = "radio-options-label small-text";
            radio.setAttribute('type', 'radio');
            radio.setAttribute('name', 'follow-voice-updates-frequency');
            radio.setAttribute('value', value);

            label.appendChild(radio);
            label.appendChild(text);

            return label;
        },

        _showFormErrors : function _showFormErrors() {
            this._emailElement.addClass('error').focus();
            this._errorEmailMessage.show();

            return this;
        },

        clearFormErrors : function _learFormErrors() {
            this._emailElement.removeClass('error');
            this._errorEmailMessage.hide();

            return this;
        }
    }
});
