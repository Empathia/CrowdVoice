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
                    apporved      : post.approved,
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

                window.voicesContainer.appendChild(voice);

                elements.push(voice.element[0]);
                voices.push(voice);
                
            });

            // Render here for better UI performance
            voices.forEach(function(voice) {
                voice.element.css({
                    'display' : 'none'
                });

                voice.render(window.voicesContainer.element);
            })

            voicesContainer.element.isotope('appended', $(elements));
            Timeline.options.overlays.unbindEvents().bindEvents();
            Timeline.options.votes.unbindEvents().bindEvents();
            setTimeout(function() {
                $(elements).fadeIn(300);

                Timeline.afterFetchActions();
            }, 500);
        }
    }
});