require 'spec_helper'

describe Scrapers::Sources::Twitpic do
  before(:each) do
    url = "http://twitpic.com/47jrpf"
    @scraper = Scrapers::Sources::Twitpic.new(url)
  end

  it "gets ID of the photo from URL" do
    @scraper.photo_id.should == '47jrpf'
  end

  it "gets info from twitpic" do
    @scraper.scrape do |photo|
      photo.title.should == 'Bourbon Street Awards 2011'
      photo.description.should == 'Bourbon Street Awards 2011'
      photo.image_url.should == 'http://twitpic.com/show/full/47jrpf'
    end
  end

  context "with invalid photo id" do

    it "raises an NotFound exception" do
      url = "http://twitpic.com/show/thumb/aaaaaa"
      @scraper = Scrapers::Sources::Twitpic.new(url)
      lambda do
        @scraper.scrape { }
      end.should raise_error(Scrapers::Sources::Exceptions::NotFound)
    end

  end

end
