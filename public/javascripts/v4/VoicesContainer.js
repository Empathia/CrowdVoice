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
                // voicesContainer.element.isotope('layout');
            });

            this.element.timeago('refresh');
        },

        goToDate : function(date) {
            var voicesContainer = this;

            var gotDate         = false,
                dateIsEnabled   = false,
                voiceIndex      = 0,
                foundVoice      = null;

            var date = date.match(/[\d]{4}-[\d]{2}/);

            for (var i = 0; i < voicesContainer.children.length; i++) {
                var child = voicesContainer.children[i];
                var voiceDate = child.createdAt.match(/[\d]{4}-[\d]{2}/);

                voiceIndex      = i;

                if (date[0] == voiceDate[0]) {
                    
                    foundVoice = child;
                    gotDate = true;
                    break;

                }
            };

            if (!child.active) {
                
                var voices = voicesContainer.children.slice(0, voiceIndex + 60);

                var elements = [];

                voices.forEach(function(voice) {
                    if (voice.active === false) {
                        elements.push(voice.element[0]);
                        voice.activate();
                    }
                });

                voicesContainer.element.isotope('appended', elements);
            } 
            
            voicesContainer.element.parent().animate({ scrollTop: foundVoice.element.position().top }, 1000, function() {
                CV.timeline.afterFetchActions();
                CV.timeline.updateSliderPosition();
            });
            
        },

        createVoiceWidgets : function(callback) {
            var voicesContainer = this;
            var fragment = document.createDocumentFragment();

            // this.voicesToRender = this.preloadedVoices;

            // this.preloadedVoices = this.preloadedVoices.slice(0, 59)

            this.preloadedVoices.forEach(function(post) {
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
                    timeAgo       : post.created_at,
                    createdAt     : post.created_at,
                    service       : post.source_url,
                    disabled      : true,
                    active        : false
                });

                // voice.deactivate();

                voicesContainer.appendChild(voice);

                fragment.appendChild(voice.element[0]);

            });

            voicesContainer.element[0].appendChild(fragment);    
            
            CV.timeline.options.votes.unbindEvents().bindEvents();
            
            if (callback) {
                callback();
            }

            this.voicesToRender = [];
        },

        enableNextPage : function(callback) {
            var elements = [];

            this.lastVoiceIndex = this.perPage * this.currentPage;

            if (this.lastVoiceIndex > this.children.length) {
                this.lastVoiceIndex = this.children.length;
            }

            var voices = this.children.slice(this.lastVoiceIndex, (this.perPage * (this.currentPage + 1)));

            voices.forEach(function(voice) {
                elements.push(voice.element[0]);
                voice.activate();  
            });

            
            this.element.isotope('appended', elements);

            this.element.timeago('refresh');

            this.currentPage++;
            
            if (callback) {
                callback();
            }
        }
    }
});
