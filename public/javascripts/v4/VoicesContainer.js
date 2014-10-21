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
        lastVoiceIndex  : 0,
        currentPage     : 0,
        init : function(config) {
        	Widget.prototype.init.call(this, config);
            var voicesContainer = this;

            this.delayedEvent = new DelayedEventEmitter();

            this.delayedEvent.bind('isotope-relayout', function(){
                voicesContainer.element.isotope('reLayout');

                var keepFetching = true;

                while (voicesContainer.element.parent().height() == voicesContainer.element.parent()[0].scrollHeight && keepFetching) {
                    voicesContainer.appendNextPage();

                    if (voicesContainer.lastVoiceIndex === (voicesContainer.preloadedVoices.length - 1)) {
                        keepFetching = false;
                    }
                }
            });
        },

        goToDate : function(date) {
            var voicesContainer = this;
            var gotDate = false;

            var date = date.match(/[\d]{4}-[\d]{2}/);

            while (!gotDate) {
                voicesContainer.appendNextPage();

                for (var i = 0; i < voicesContainer.children.length; i++) {
                    var voice = voicesContainer.children[i];

                    var voiceDate = voice.createdAt.match(/[\d]{4}-[\d]{2}/);

                    if (date[0] == voiceDate[0]) {
                        gotDate = true;
                        break;
                    }

                };

                if (voicesContainer.lastVoiceIndex === (voicesContainer.preloadedVoices.length - 1)) {
                    gotDate = true;
                }

                if (gotDate) {
                    console.log('got date')
                    setTimeout(function() {
                        voicesContainer.element.parent().animate({ scrollTop: voicesContainer.element.height() - 2000 }, "slow");    
                    }, 500);
                };
            }
        },

        appendNextPage : function() {
            var voicesContainer = this;
            var elements = [];
            var voices   = [];
            var posts    = [];

            var last;

            if (this.preloadedVoices.length < this.perPage * this.currentPage) {
                last = this.preloadedVoices.length - 1
            } else {
                last = this.perPage * this.currentPage;

                if (last > (this.preloadedVoices.length - 1)) {
                    last = this.preloadedVoices.length - 1;
                }
            }

            posts = this.preloadedVoices.splice(this.lastVoiceIndex, this.perPage);

            posts.forEach(function(post) {
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
                    thumbURL      : post.image.thumb.url,
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
                
                // dont render here cause UI locking
                // voice.render(window.voicesContainer.element);

                voicesContainer.appendChild(voice);

                elements.push(voice.element[0]);
                voices.push(voice);
                
            });

            // Render here for better UI performance
            voices.forEach(function(voice) {
                // setTimeout(function(){
                    if (CV.mediaFeedSearch[voice.sourceType]) {
                        voice.render(voicesContainer.element);    
                    }
                // }, 100);
                
            });


            if (window.isotopeReady) {
                voicesContainer.element.isotope('appended', $(elements));
            }

            Timeline.options.overlays.unbindEvents().bindEvents();
            Timeline.options.votes.unbindEvents().bindEvents();
            setTimeout(function() {
                // $(elements).hide().fadeIn(600);

                Timeline.afterFetchActions();
            }, 500);

            this.lastVoiceIndex = last;
            this.currentPage++;
        }
    }
});