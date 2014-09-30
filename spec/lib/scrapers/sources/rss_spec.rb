require 'spec_helper'

describe Scrapers::Sources::Rss do
  before(:each) do
    @feed_url = "http://feeds.feedburner.com/nettuts"
    @scraper = Scrapers::Sources::Rss.new(@feed_url)
  end

  it "gets info" do
    @scraper.scrape do |rss, last_rss|
      rss.instance_of?(Array).should == true
      rss.length.should > 0
      last_rss.instance_of?(DateTime).should == true
    end
  end

  context 'with an URL with invalid video id' do
    before(:each) do
      @invalid_url = "something invalid"
    end

    it "raise an exception" do
      lambda do
        @scraper = Scrapers::Sources::Rss.new(@invalid_url)
      end.should raise_error(Scrapers::Sources::Exceptions::UnrecognizedSource)
    end
  end

end