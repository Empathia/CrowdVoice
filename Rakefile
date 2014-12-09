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

      puts "#{results.length} processed on Voice #{voice.id}"
    else
      puts "Skiping Voice #{voice.id}"
    end
  end
end


