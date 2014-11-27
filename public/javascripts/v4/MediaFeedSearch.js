Class('MediaFeedSearch').inherits(Widget)({
    prototype     : {
        image       : true,
        video       : true,
        link        : true,
        types       : [],
        fuseOptions : {
            keys      : ['title', 'description'],
            threshold : 0.0,
            distance  : 0
        },
        fuse        : null,
        delayedEvent : null,
        init : function(config) {
            Widget.prototype.init.call(this, config);

            var mediaFeedSearch = this;

            // this.fuse = new Fuse(this.getEnabledVoices(), this.fuseOptions);

            var checkboxes = ['image', 'video', 'link'];

            checkboxes.forEach(function(checkbox) {
                mediaFeedSearch.element.find('input.' + checkbox).bind('click', function() {
                    if (this.checked) {
                        mediaFeedSearch[checkbox] = true;
                    } else {
                        mediaFeedSearch[checkbox] = false;
                    }

                    mediaFeedSearch.types = [];

                    _.each(checkboxes, function(cb) {
                        if (mediaFeedSearch[cb] === true) {
                            mediaFeedSearch.types.push(cb);
                        }
                    });

                    console.log('click', mediaFeedSearch.types)

                    mediaFeedSearch.search();

                    // mediaFeedSearch.dispatch(checkbox, {value : mediaFeedSearch[checkbox]});

                    // CV.voicesContainer.children.forEach(function(child) {
                    //     if (child.sourceType === checkbox) {
                    //         if (mediaFeedSearch[checkbox]) {
                    //             child.enable();
                    //         } else {
                    //             child.disable();
                    //         }
                    //     };
                    // });

                    CV.voicesContainer.delayedEvent.dispatch('isotope-relayout');
                });
            });

            this.delayedEvent = new DelayedEventEmitter({waitingTime : 300});

            this.element.find('input.search').bind('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();     
                };

                mediaFeedSearch.delayedEvent.dispatch('search');
            });

            this.delayedEvent.bind('search', function() {
                var value = mediaFeedSearch.element.find('input.search').val();

                if (value === '') {
                    mediaFeedSearch.reset();
                    return false;
                }

                mediaFeedSearch.search(value);
            });

            this.element.find('.search-clear').bind('click', function() {
                mediaFeedSearch.reset();
            });
        },

        getEnabledVoices : function() {
            var enabledVoices = CV.voicesContainer.children.filter(function(child) {
                if (child.active) {
                    return child;
                }
            });

            console.log('enabled voices: ', enabledVoices.length)

            return enabledVoices;
        },

        reloadFuse : function () {
            return;
            this.fuse = new Fuse(this.getEnabledVoices(), this.fuseOptions);

            var query = this.element.find('input.search').val();

            if (query !== '') {
                this.search(query);
            }
        },

        reset : function() {
            return;
            this.element.find('input.search').val('');

            this.element.find('.found').html(0);

            CV.voicesContainer.children.forEach(function(child) {
                child.enable();
            });

            CV.voicesContainer.element.isotope('reLayout');
        },

        search : function () {
            var mediaFeedSearch = this;
            
            var voices = CV.voicesContainer.children;

            var elements = [];

            var removedElements = [];
            
            var result = [];
            
            var query = this.element.find('input.search').val();

            _.each(voices, function(voice) {
                removedElements.push(voice.element[0]);
                voice.deactivate();
            });

            CV.voicesContainer.element.isotope('remove', removedElements);

            console.log('children', voices.length)

            _.each(voices, function(voice) {
                if (mediaFeedSearch.types.indexOf(voice.sourceType) !== -1) {
                    result.push(voice);
                } else {
                    voice.deactivate();
                }
            });

            console.log('result',result.length)

            CV.voicesContainer.filteredResults = result;

            // if (result.length ===) {};
            CV.voicesContainer.currentPage = 1;

            result = result.slice(0, 59);

            _.each(result, function(voice) {
                elements.push(voice.element[0])
                voice.activate();
            })

            // console.log(result, query)

            // CV.voicesContainer.children.forEach(function(child) {
            //     child.deactivate();
            // });

            // result.forEach(function(item) {
            //     // item && CV.voicesContainer.element.append(item.element);
            //     item.activate();
            // });

            // mediaFeedSearch.element.find('.found').html(result.length);

            CV.voicesContainer.element.isotope('appended', elements);

            // CV.voicesContainer.element.isotope('layout');
        }
    }
});
