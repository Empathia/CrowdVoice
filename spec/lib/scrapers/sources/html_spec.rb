require 'spec_helper'

describe Scrapers::Sources::Html do
  before(:each) do
    url = "http://www.freshout.us"
    @scraper = Scrapers::Sources::Html.new(url)
  end

  it "gets an array of images from URL" do
    @scraper.images.instance_of?(Array).should == true
    @scraper.images.size.should > 0
  end

  it "gets info" do
    @scraper.scrape do |photo|
      photo.title.should == "San Francisco Web Development | Freshout"
      photo.description.should == "Freshout is a full service web application design and development agency that specializes in pioneering disruptive ideas on the web within rapid timelines."
      photo.image_url.should == "http://freshout.us/wp-content/themes/freshout/images/logo.png"
    end
  end

  context "with an URL with invalid info" do
    before(:each) do
      url = "https://gist.github.com/raw/621479/4b316ef8ebd1c45249bb8f1b9517633d964ad1b3/events.rb"
      @scraper = Scrapers::Sources::Html.new(url)
    end

    it "gets an array with a default image" do
      @scraper.images.instance_of?(Array).should == true
      @scraper.images.size.should > 0
      @scraper.images.first.should == Scrapers::Sources::Html::DEFAULT_IMAGE
    end

    it "gets empty info" do
      @scraper.title.should == Scrapers::Sources::Html::DEFAULT_TITLE
      @scraper.image_url.should == Scrapers::Sources::Html::DEFAULT_IMAGE
    end

  end

end
