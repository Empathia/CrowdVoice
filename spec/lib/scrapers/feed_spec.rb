require 'spec_helper'

describe Scrapers::Feed do

  before(:each) do
    @feed_url = "http://feeds.feedburner.com/nettuts"
    @invalid_url = "something invalid"
  end

  context "being created" do
    context 'with invalid url' do
      it "raise an exception" do
        lambda do
          Scrapers::Feed.new(@invalid_url)
        end.should raise_error(Scrapers::Sources::Exceptions::UnrecognizedSource)
      end
    end
  end

  describe ".valid_url?" do
    it "tells if the given url is a valid URL" do
      Scrapers::Feed.valid_url?(@feed_url).should be_true
    end

    it "tells if the given url is an invalid URL" do
      Scrapers::Feed.valid_url?(@invalid_url).should be_false
    end
  end

  describe "#scraper" do
    it "instancies a new HTML scraper" do
      Scrapers::Feed.new(@feed_url).scraper.should be_instance_of(Scrapers::Sources::Rss)
    end
  end

end