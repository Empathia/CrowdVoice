class VoiceFeeder
  def self.feed_voice(voice_id)
    voice = Voice.find(voice_id)
    puts voice.id
    puts voice.rss_feed
    puts voice.twitter_search
    voice.rss_feed.blank? ? Rails.logger.info("   - Rss empty.") : fetch_rss(voice)
    voice.twitter_search.blank? ? Rails.logger.info("    - Twitter search empty (shouldn't be).") : fetch_tweets(voice)
  end

  def self.feed_voices
    Voice.all.each do |voice|
      voice.rss_feed.blank? ? put("    - Rss empty.") : fetch_rss(voice)
      voice.twitter_search.blank? ? puts("    - Twitter search empty (shouldn't be).") : fetch_tweets(voice)
    end
  end

  # Scrappe the rss url and get all the valid links for create a post for the specific voice
  def self.fetch_rss(voice)
    @last_rss = ''
    Rails.logger.info "    - Scraping posts from: #{voice.rss_feed}"
    Scrapers::Sources::Rss.new(voice.rss_feed).scrape do |rss, last_rss|
      Rails.logger.info "    - Getting RSS scrape of #{rss.length} items"
      if ConnectionAdapter.connected_to != "crowdvoice_production"
        Rails.logger.info "    - Limiting RSS scraping to 500"
        @result = rss[0..499].map{|url| voice.posts.new(:source_url => url).save }
      else
        @result = rss.map{|url| voice.posts.new(:source_url => url).save }
      end
      @rss, @last_rss = rss, last_rss
    end
    Rails.logger.info "    - Updating last RSS attribute: #{@last_rss} - #{@last_rss && (voice.last_rss.nil? || (voice.last_rss <=> @last_rss) < 0)}"
    voice.update_attribute(:last_rss, @last_rss) if @last_rss && (voice.last_rss.nil? || (voice.last_rss <=> @last_rss) < 0)
    voice.expire_cache
  end

  # Gets the url valid from a search on twitter
  def self.fetch_tweets(voice)
    Rails.logger.info "    - Getting twitter search from: #{voice.twitter_search}"

    source = TwitterSearch.search(voice.twitter_search)

    last_tweet = source.last[:id] unless (source.nil? || source.empty?)

    urls = TwitterSearch.get_valid_urls(source, voice.last_tweet)

    Rails.logger.info "URLs : #{urls.to_json}"
    Rails.logger.info "    - Getting urls from twitter search"

    if ConnectionAdapter.connected_to != "crowdvoice_production"
      Rails.logger.info "    - Limiting Twitter scraping to 500"
      urls[0..499].map{ |url| voice.posts.new(:source_url => url).save }
    else
      urls.map{ |url| voice.posts.new(:source_url => url).save }
    end

    Rails.logger.info "    - Updating last RSS attribute: #{last_tweet} - #{last_tweet && (voice.last_tweet.nil? || (voice.last_tweet.to_i <=> last_tweet.to_i) < 0)}"

    voice.update_attribute(:last_tweet, last_tweet) if last_tweet && (voice.last_tweet.nil? || (voice.last_tweet.to_i <=> last_tweet.to_i) < 0)
    
    voice.expire_cache
  end
end
