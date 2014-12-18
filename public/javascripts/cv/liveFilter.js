Class('LiveFilter')({
    prototype: {
        init: function(input, container) {
            this.input = typeof input == 'string' ? $(input) : input;
            this.container = typeof container == 'string' ? $(container) : container;
            this.originalContent = this.container.html();
            this.itemsContainer = $('<ul />').insertAfter(this.container).hide();
            this.items = this.container.find('li').clone().appendTo(this.itemsContainer);
            this.clearBtn = $('.voice-search .clear-search');
            this.sidebarWrapper = $('.sidebar-wrapper');
            this._searchResultsTitle = $('<div class="sidebar-scroller__accordion-toggler"><h2>Search Results</h2></div>');

            this._bindEvents();
        },

        _bindEvents: function () {
            this.input.bind('keyup', function (ev) {
                this.filter(ev.target.value);

                if (ev.target.value === "" ) {
                  return this.clearBtn.hide();
                }

                this.clearBtn.show();
            }.bind(this));

            this.input.focusout(function () {
                this.clearBtn.addClass('invisible');
            }.bind(this));

             this.input.focus(function (ev) {
                 if (ev.target.value === "") {
                   this.clearBtn.hide();
                   this.clearBtn.removeClass('invisible');
                 }
                 else {
                   this.clearBtn.show();
                   this.clearBtn.removeClass('invisible');
                 };
            }.bind(this));

            this.clearBtn.click(function (ev) {
                this.input.focus();
                this.input.val('');
                this.filter("");
                this.clearBtn.hide();
            }.bind(this));

            return this;
        },

        filter: function (value) {
            var that = this;

            if(value == '') {
                this.container.html(this.originalContent);
                new Accordion('.sidebar-scroller__accordion-arrow');
            } else {
                var match = $.grep(this.items.clone(), function(item) {
                    var regex = new RegExp(value, 'i');
                    return regex.test( that.removeAccents($(item).text()) );
                });
                $('.sidebar-scroller__accordion-arrow').parent().unbind('click');
                this.container.html('').append(this._searchResultsTitle).append($('<ul/>').append(match));
            }
            this.sidebarWrapper.trigger('sidebar.change');
        },

        removeAccents: function (value){
            strArr = value.split('');
            strOut = new Array();
            var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = ['A','A','A','A','A','A','a','a','a','a','a','a','O','O','O','O','O','O','O','o','o','o','o','o','o','E','E','E','E','e','e','e','e','e','C','c','D','I','I','I','I','i','i','i','i','U','U','U','U','u','u','u','u','N','n','S','s','Y','y','y','Z','z'];
            for (var y = 0; y < strArr.length; y++) {
                if (accents.indexOf(strArr[y]) != -1) {
                    strOut[y] = accentsOut[accents.indexOf(strArr[y])];
                }
                else
                    strOut[y] = strArr[y];
            }
            strOut = strOut.join('');
            return strOut;
        }
    }
});
