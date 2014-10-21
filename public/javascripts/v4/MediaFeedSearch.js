Class('MediaFeedSearch').inherits(Widget)({
    prototype     : {
        image       : true,
        video       : true,
        link        : true,
        fuseOptions : {
            keys      : ['title', 'description'],
            threshold : 0.4
        },
        fuse        : null,
        delayedEvent : null,
        init : function(config) {
            Widget.prototype.init.call(this, config);

            var mediaFeedSearch = this;

            this.fuse = new Fuse(CV.voicesContainer.children, this.fuseOptions);

            var checkboxes = ['image', 'video', 'link'];

            checkboxes.forEach(function(checkbox) {
                mediaFeedSearch.element.find('input.' + checkbox).bind('click', function() {
                    if (this.checked) {
                        mediaFeedSearch[checkbox] = true;
                    } else {
                        mediaFeedSearch[checkbox] = false;
                    }

                    mediaFeedSearch.dispatch(checkbox, {value : mediaFeedSearch[checkbox]});
                });
            });

            this.delayedEvent = new DelayedEventEmitter({waitingTime : 300});

            this.element.find('input.search').bind('keyup', function(e) {
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

        reloadFuse : function () {
            this.fuse = new Fuse(CV.voicesContainer.children, this.fuseOptions);

            var query = this.element.find('input.search').val();

            if (query !== '') {
                this.search(query);
            }
        },

        reset : function() {
            this.element.find('input.search').val('');

            this.element.find('.found').html(0);

            CV.voicesContainer.children.forEach(function(child) {
                CV.voicesContainer.element.append(child.element);
            });

            CV.voicesContainer.element.isotope('reLayout');
        },

        search : function (query) {
            var mediaFeedSearch = this;

            var result = mediaFeedSearch.fuse.search(query);

            console.log(result, query)

            CV.voicesContainer.children.forEach(function(child) {
                child.element && child.element.detach();
            });

            result.forEach(function(item) {
                item && CV.voicesContainer.element.append(item.element);
            });

            mediaFeedSearch.element.find('.found').html(result.length);

            CV.voicesContainer.element.isotope('reLayout');
        }
    }
});
