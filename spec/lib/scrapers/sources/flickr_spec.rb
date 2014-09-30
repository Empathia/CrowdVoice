require 'spec_helper'

describe Scrapers::Sources::Flickr do
  before(:each) do
    url = "http://www.flickr.com/photos/thepretender/456448210/"
    @scraper = Scrapers::Sources::Flickr.new(APP_CONFIG[:flickr_key], url)
  end

  it "gets ID of the photo from URL" do
    @scraper.photo_id.should == '456448210'
  end

  it "gets info from Flickr API" do
    @scraper.scrape do |photo|
      photo.title.should == 'As The Sun hides, the Moon Rises'
      photo.description.should == 'As The Sun hides, the Moon Rises'
      photo.image_url.should == 'http://farm1.static.flickr.com/218/456448210_bd4b5196f5.jpg'
    end
  end

  context "with invalid photo id" do

    it "raises an InvalidResponse exception" do
      url = "http://www.flickr.com/photos/thepretender/00000000/"
      @scraper = Scrapers::Sources::Flickr.new(APP_CONFIG[:flickr_key], url)
      lambda do
        @scraper.scrape { }
      end.should raise_error(Scrapers::Sources::Exceptions::NotFound)
    end

  end

end
