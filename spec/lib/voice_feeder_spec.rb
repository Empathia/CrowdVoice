require 'spec_helper'

describe VoiceFeeder do

  describe "feed_voice" do
    before(:each) do
      @voice = Factory(:voice, :rss_feed => "http://feeds.feedburner.com/webdesigntuts", :twitter_search => 'tweet')
    end

    it "should create post from a rss feed and twitter search" do
      @voice.posts.length == 0
      VoiceFeeder.feed_voice(@voice.id)
      @voice.posts.length > 0
    end
  end

  describe "feed_voices" do
    before(:each) do
      @voices = []
      @voices << Factory(:voice, :rss_feed => "http://feeds.feedburner.com/nettuts", :twitter_search => 'twitter')
      @voices << Factory(:voice, :rss_feed => "http://feeds.feedburner.com/webdesigntuts", :twitter_search => 'tweet')
    end

    it "should crteate posts for the voices iterated from rss_feed and twitter_search" do
      VoiceFeeder.feed_voices
      @voices.each do |voice|
        voice.posts.length == 0
        voice.posts.length > 0
      end
    end
  end

end