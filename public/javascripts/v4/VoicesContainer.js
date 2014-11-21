Class('VoicesContainer').inherits(Widget)({
    ELEMENT_CLASS  : '',
    HTML           : '\
        <div class="voices-scroller scroll-primary">\
            <div class="voices-container initial-state">\
            </div>\
        </div>\
    ',
    prototype     : {
        fuse            : null,
        delayedEvent    : null,
        perPage         : 60,
        preloadedVoices : [],
        voicesToRender  : [],
        lastVoiceIndex  : 0,
        currentPage     : 0,
        init : function(config) {
            Widget.prototype.init.call(this, config);
            var voicesContainer = this;

            this.delayedEvent = new DelayedEventEmitter();

            this.delayedEvent.bind('isotope-relayout', function(){
                voicesContainer.element.isotope('reLayout');

                var keepFetching = true;

                while (voicesContainer.element.height() <= voicesContainer.element.parent().height() && keepFetching) {
                    voicesContainer.getNextPage(function(){
                        voicesContainer.renderPages();
                        CV.mediaFeedSearch.reloadFuse();
                    });

                    if (voicesContainer.lastVoiceIndex === (voicesContainer.preloadedVoices.length - 1)) {
                        keepFetching = false;
                    }
                }
            });


        },

        goToDate : function(date) {
            var voicesContainer = this;

            var gotDate = false,
                dateIsRendered = false;

            var date = date.match(/[\d]{4}-[\d]{2}/);

            for (var i = 0; i < voicesContainer.children.length; i++) {
                var child = voicesContainer.children[i];
                var voiceDate = child.createdAt.match(/[\d]{4}-[\d]{2}/);

                if (date[0] == voiceDate[0]) {
                    dateIsRendered = true;
                    gotDate = true;
                    break;

                }
            };

            if (dateIsRendered) {
                voicesContainer.element.parent().animate({ scrollTop: child.element.position().top }, "fast", function() {
                    CV.timeline.updateSliderPosition();
                });
                CV.timeline.afterFetchActions();

                return
            };

            while (!gotDate) {
                voicesContainer.getNextPage();

                for (var i = 0; i < voicesContainer.voicesToRender.length; i++) {
                    var voice = voicesContainer.voicesToRender[i].post;

                    var voiceDate = voice.created_at.match(/[\d]{4}-[\d]{2}/);

                    if (date[0] == voiceDate[0]) {
                        gotDate = true;
                        break;
                    }

                };

                if (voicesContainer.lastVoiceIndex === (voicesContainer.preloadedVoices.length - 1)) {
                    gotDate = true;
                }

                if (gotDate) {
                    voicesContainer.renderPages(function() {
                        voicesContainer.element.parent().animate({ scrollTop: $("div[data-post-id='" + voice.id + "']").position().top }, "fast", function() {
                            CV.timeline.updateSliderPosition();
                        });
                    });
                };
            }
        },

        getNextPage : function(callback) {
            var voicesContainer = this;
            var last;

            if (this.preloadedVoices.length < this.perPage * this.currentPage) {
                last = this.preloadedVoices.length - 1
            } else {
                last = this.perPage * this.currentPage;

                if (last > (this.preloadedVoices.length - 1)) {
                    last = this.preloadedVoices.length - 1;
                }
            }

            this.voicesToRender = this.voicesToRender.concat(this.preloadedVoices.splice(this.lastVoiceIndex, this.perPage));

            this.lastVoiceIndex = last;
            this.currentPage++;

            if (callback) {
                callback();
            }
        },

        renderPages : function(callback) {
            var voicesContainer = this;
            var elements = [];
            var fragment = document.createDocumentFragment();

            this.voicesToRender.forEach(function(post) {
                if (post.post) {
                    post = post.post;
                }

                voice = new VoiceElement({
                    name          : 'post_' + post.id,
                    id            : post.id,
                    image         : post.image,
                    approved      : post.approved,
                    description   : CV.getExcerpt(post.description, 250),
                    imageWidth    : post.image_width,
                    imageHeight   : post.image_height,
                    negativeVotes : post.negative_votes_count,
                    positiveVotes : post.positive_votes_count,
                    overallScore  : post.overall_score,
                    sourceService : post.source_service,
                    sourceType    : post.source_type,
                    sourceURL     : post.source_url,
                    title         : post.title,
                    voiceID       : post.voice_id,
                    createdAt     : post.created_at,
                    timeAgo       : post.created_at,
                    service       : post.source_url
                });

                voice.disabled = CV.mediaFeedSearch[voice.sourceType] ? false : true;

                voicesContainer.appendChild(voice);

                elements.push(voice.element[0]);
                fragment.appendChild(voice.element[0]);

            });

            voicesContainer.element[0].appendChild(fragment);    
            
            if (window.isotopeReady) {
                voicesContainer.element.isotope('appended', $(elements));
            }

            CV.timeline.options.votes.unbindEvents().bindEvents();
            
            setTimeout(function() {
                CV.timeline.afterFetchActions();

                if (callback) {
                    callback();
                }

            }, 1000);

            this.voicesToRender = [];
        }
    }
});
