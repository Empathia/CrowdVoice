require 'spec_helper'

describe Scrapers::Sources::Vimeo do

  before(:each) do
    url = "http://vimeo.com/11229946"
    @scraper = Scrapers::Sources::Vimeo.new(url)
  end

  it "gets info" do
    @scraper.scrape do |video|
      video.title.should == "Lights Out"
      video.description.should == ""
      video.image_url.should == "http://b.vimeocdn.com/ts/611/339/61133956_200.jpg"
    end
  end

  context 'with an URL with invalid video id' do
    before(:each) do
      url = "http://vimeo.com/0000000000"
      @scraper = Scrapers::Sources::Vimeo.new(url)
    end

    it "raise an exception" do
      lambda do
        @scraper.scrape do |video|
        end

      end.should raise_error(Scrapers::Sources::Exceptions::NotFound)
    end
  end

end