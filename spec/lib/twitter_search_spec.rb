require 'spec_helper'

describe TwitterSearch do

  describe "search" do
    it "should return an array of tweets" do
     TwitterSearch.search('twitter').length.should > 0
    end
  end

  describe "get_valid_urls" do
    it "should return an array of valid urls" do
      source = TwitterSearch.search('twitter')
      urls = TwitterSearch.get_valid_urls(source)
      urls.length.should > 0
    end

    it "shouldnt return an array of valid urls when the twitter_search last_tweet is the last" do
      source = TwitterSearch.search('twitter')
      last_tweet = source.last[:id]
      urls = TwitterSearch.get_valid_urls(source, last_tweet)
      urls.length.should == 0
    end
  end

  describe "get_last_response_with_url" do
    it "should get the last url valid" do
      response = TwitterSearch.send('get_last_response_with_url','http://j.mp/kSav73')
      response[:url].should == "http://img.xatakaciencia.com/2011/04/13749-w520.jpg"
    end
  end
end