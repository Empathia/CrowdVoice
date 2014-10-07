Class('VoicesContainer').inherits(Widget)({
    ELEMENT_CLASS  : '',
    HTML           : '\
        <div class="voices-scroller scroll-primary">\
            <div class="voices-container initial-state">\
            </div>\
        </div>\
    ',
    prototype     : {
        init : function(config) {
        	Widget.prototype.init.call(this, config);
        },

        appendFromJSON : function(posts) {
            var voicesContainer = this;
            var elements = [];
            var voices   = [];

            posts.forEach(function(post) {
                if (post.post) {
                    post = post.post;
                }

                voice = new VoiceElement({
                    name          : 'post_' + post.id,
                    id            : post.id,
                    image         : post.image,
                    isAdmin       : false,
                    URL           : "",
                    apporved      : post.approved,
                    description   : post.description,
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

                window.voicesContainer.appendChild(voice);

                elements.push(voice.element[0]);
                voices.push(voice);
                
            });

            // for UI locking performance
            voices.forEach(function(voice) {
                voice.render(window.voicesContainer.element);
            })

            voicesContainer.element.isotope('appended', $(elements));
            Timeline.options.overlays.unbindEvents().bindEvents();
            Timeline.options.votes.unbindEvents().bindEvents();
            Timeline.afterFetchActions();
        }
    }
});