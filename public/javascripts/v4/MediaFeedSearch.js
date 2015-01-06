Class('MediaFeedSearch').inherits(Widget)({
    prototype     : {
        image       : true,
        video       : true,
        link        : true,
        types       : ['image', 'video', 'link'],
        delayedEvent : null,
        init : function(config) {
            Widget.prototype.init.call(this, config);

            var mediaFeedSearch = this;

            mediaFeedSearch.element.find('.results-feedback').hide();
            mediaFeedSearch.element.find('.search-clear').hide();

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

                    mediaFeedSearch.search();

                    CV.voicesContainer.delayedEvent.dispatch('isotope-relayout');
                });
            });

            this.element.find('.voice-tags input').bind('click', function() {
                mediaFeedSearch.search();
            });

            this.delayedEvent = new DelayedEventEmitter({waitingTime : 300});

            this.element.find('input.search').bind('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();     
                };

                mediaFeedSearch.delayedEvent.dispatch('search');
            });

            this.delayedEvent.bind('search', function() {

                mediaFeedSearch.search();
            });

            this.element.find('.search-clear').bind('click', function() {
                mediaFeedSearch.reset();
            });
        },

        reset : function() {
            this.element.find('input.search').val('');

            this.element.find('.found').html(0);

            this.search();
        },

        search : function () {
            var mediaFeedSearch = this;
            
            var voices = CV.voicesContainer.children;

            var elements = [];

            var removedElements = [];
            
            var result = [];
            
            var query = this.element.find('input.search').val();

            query = query.toLowerCase();

            var tagElements = this.element.find('ul.voice-tags input');

            var tags = [];

            _.each(tagElements, function(tagElement) {
                if (tagElement.checked) {
                    tags.push(tagElement.getAttribute('data-tag'));
                };
            });

            _.each(voices, function(voice) {
                removedElements.push(voice.element);
                voice.deactivate();
            });

            CV.voicesContainer.element.isotope('remove', removedElements);

            var shouldShow = false;

            _.each(CV.voicesContainer.children, function(voice) {
                if (mediaFeedSearch.types.indexOf(voice.sourceType) !== -1) {
                    var voiceTitle          = voice.title.toLowerCase();
                    var voiceDescription    = voice.description.toLowerCase();
                    
                    shouldShow = true;

                    if (query !== '') {
                        if (voiceTitle.search(query) !== -1 || voiceDescription.search(query) !== -1) {
                            shouldShow = true;
                        } else {
                            shouldShow = false;
                        }   
                    }
                } else {
                    shouldShow = false;
                }

                var hasTags = false

                if (tags.length === 0) {
                    hasTags = true;
                } else {
                    for (var i = 0; i < voice.tags.length; i++) {
                        var tag = voice.tags[i];
                        if (tags.indexOf(tag) !== -1) {
                            hasTags = true;
                            break;
                        } else {
                            hasTags = false;
                        }
                    };
                    
                }

                if (shouldShow && hasTags) {
                    result.push(voice);
                };
            });

            CV.voicesContainer.filteredResults = result;

            var foundCount = result.length;

            if (result.length === voices.length) {
                foundCount = 0;
            }

            mediaFeedSearch.element.find('.found').html(foundCount);

            if (query === '') {
                mediaFeedSearch.element.find('.results-feedback').hide();
                mediaFeedSearch.element.find('.search-clear').hide();
            } else {
                mediaFeedSearch.element.find('.results-feedback').show();
                mediaFeedSearch.element.find('.search-clear').show();
            }
            
            CV.voicesContainer.currentPage = 1;

           
            CV.timeline.update();

            CV.timeline.debouncePositionUpdate();

            result = result.slice(0, 59);

            _.each(result, function(voice) {
                elements.push(voice.element)
                voice.activate();

                _.defer(function() {
                    if ($(voice.element).visible(true)) {
                        voice.setImage();
                    };
                });
            });

            CV.voicesContainer.element.isotope('appended', elements);

            CV.voicesContainer.element.isotope('layout');
        }
    }
});
