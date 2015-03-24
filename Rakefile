# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

CrowdvoiceV2::Application.load_tasks

desc "Recreate post images"
task :recreate_images => :environment do
  logger = Logger.new("/data/crowdvoice/shared/log/recreate_versions.log")

  Voice.all.each do |voice|
    voice.posts.find_each do |post|
      begin
        post.image.recreate_versions! unless post.image.url == "https://s3.amazonaws.com/crowdvoice-production-bucket/link-default.png"
        logger.info "Success voice(#{voice.id}) post(#{post.id})"
      rescue => e
        logger.info "Failed voice(#{voice.id}) post(#{post.id}): #{e.inspect}"
      end
    end
  end
end

  
desc "Fetch tweets for voices"
task :fetch_tweets => :environment do
  logger = Logger.new("/data/crowdvoice/shared/log/fetch_tweets.log")

  locked = false

  if File.exists?('/tmp/fetching_tweets')
    logger.warn "Twitter Fetcher is already running, will check again in an hour..."
    locked = true
  end
  
  unless locked?
    FileUtils.touch('/tmp/fetching_tweets')
    voices = Voice.where(["last_tweet < ? OR last_twitter_error IS NOT null OR last_tweet IS null", 6.hour.ago])

    voices.each do |voice|
      voice.tweets.first() ? last_tweet = voice.tweets.first().id_str : last_tweet = nil
      
      if !voice.twitter_search.blank?
        
        logger.info "\n\n"
        logger.info "#{DateTime.now}"
        logger.info "Last: #{last_tweet} in Voice #{voice.id}"
        logger.info "Search term: #{voice.twitter_search}"

        term = voice.twitter_search
        if term[term.length - 3, term.length] == " OR"
          term = term[0, term - 3]
        end

        if term[term.length - 4, term.length] == " OR "
          term = term[0, term.length - 4]
        end

        if term[term.length - 4, term.length] == " AND"
          term = term[0, term.length - 4]
        end

        begin
          results = Twitter.search("#{term} exclude:retweets exclude:replies", {:since_id => last_tweet, :count => 20}).results

          logger.info "\n"
          logger.info "Processing #{results.length} results"

          results.each do |result|
            logger.info "Tweet date: #{result[:created_at]}"
            logger.info "Tweet: #{result[:text]}"
            
            
            tweet           = Tweet.new
            tweet[:id_str]  = result[:id]
            tweet[:text]    = result[:full_text]
            tweet[:voice_id]   = voice.id
            if tweet.save
              logger.info "SAVED!"

              logger.info "\n"
              
              urls = TwitterSearch.extract_tweet_urls(tweet)
              urls.each do |url|
                resolved_url = TwitterSearch.resolve_redirects(url)
                
                logger.info "Saving #{resolved_url}" if voice.posts.new(:source_url => url).save
              end
            else
              logger.error "Not saved!"
            end
          end

          voice.last_twitter_error = nil

          logger.info "#{results.length} processed on Voice #{voice.id}"  
        rescue Exception => e
          voice.last_twitter_error = e
          logger.error "Error #{e}"
        end
        
      else
        logger.warn "Skiping Voice #{voice.id}"
      end

      voice.last_tweet = DateTime.now
      voice.save
    end

    FileUtils.rm('/tmp/fetching_tweets')
  end
end


