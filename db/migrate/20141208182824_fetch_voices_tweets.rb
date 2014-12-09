class FetchVoicesTweets < ActiveRecord::Migration
  def self.up
  	voices = Voice.where(:approved => true, :archived => false)

  	voices.each do |voice|
  		voice.tweets.first() ? last_tweet = voice.tweets.first().id_str : last_tweet = nil
      
      if !voice.twitter_search.blank?
        puts "Last: #{last_tweet}"
        puts "Search term: #{voice.twitter_search}"
        results = Twitter.search(voice.twitter_search, {:since_id => last_tweet, :count => 20}).results

        results.each do |result|
          tweet           = Tweet.new
          tweet[:id_str]  = result[:id]
          tweet[:text]    = result[:full_text]
          tweet[:voice_id]   = voice.id
          tweet.save
        end
        
        # urls = TwitterSearch.get_valid_urls(results)

        # urls.each do |url| 
        #   voice.posts.new(:source_url => url).save 
        # end

        # voice.expire_cache

        puts "#{results.length} processed on Voice #{voice.id}"
      else
        puts "Skiping Voice #{voice.id}"
      end
  	end
  end

  def self.down
  end
end
