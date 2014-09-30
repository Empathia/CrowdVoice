require 'spec_helper'

describe Scrapers::Sources::YouTube do

  before(:each) do
    url = "http://www.youtube.com/watch?v=yHXwIywGxFs"
    @scraper = Scrapers::Sources::YouTube.new(url)
  end

  it "gets info" do
    @scraper.scrape do |video|
      video.title.should == "Train FAIL"
      video.description.should == ""
      video.image_url.should == "http://i.ytimg.com/vi/yHXwIywGxFs/0.jpg"
    end
  end

  context 'with an URL with invalid video id' do
    before(:each) do
      url = "https://www.youtube.com/watch?v=00000000"
      @scraper = Scrapers::Sources::YouTube.new(url)
    end

    it "raise an exception" do
      lambda do
        @scraper.scrape do |video|
        end

      end.should raise_error(Scrapers::Sources::Exceptions::NotFound)
    end
  end
end
