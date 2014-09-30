require 'spec_helper'

describe Scrapers::Image do

  before(:each) do
    @flickr_url = "http://www.flickr.com/photos/thepretender/456448210/"
    @twitpic_url = "http://twitpic.com/47jrpf"
    @yfrog = "http://yfrog.com/kg5ukdj"
    @raw_url = "http://s3.amazonaws.com/twitpic/photos/full/254544387.jpg?AWSAccessKeyId=0ZRYP5X5F6FSMBCCSE82&Expires=1299627534&Signature=h0%2BZ%2BClRTFlsmartPAAEmpKQBZg%3D"
    @not_image_url = "http://google.com"
  end

  context "being created" do

    context 'with invalid url' do

      it "raise an exception" do
        lambda do
          Scrapers::Image.new(@not_image_url)
        end.should raise_error(Scrapers::Sources::Exceptions::UnrecognizedSource)
      end

    end

  end

  describe ".valid_url?" do

    it "tells if the given url is from any known source" do
      Scrapers::Image.valid_url?(@flickr_url).should be_true
      Scrapers::Image.valid_url?(@twitpic_url).should be_true
      Scrapers::Image.valid_url?(@yfrog).should be_true
      Scrapers::Image.valid_url?(@raw_url).should be_true
      Scrapers::Image.valid_url?(@not_image_url).should be_false
    end

  end

  describe "#scraper" do

    it "detects url from flickr" do
      Scrapers::Image.new(@flickr_url).scraper.should be_instance_of(Scrapers::Sources::Flickr)
    end

    it "detects url from twitpic" do
      Scrapers::Image.new(@twitpic_url).scraper.should be_instance_of(Scrapers::Sources::Twitpic)
    end

    it "detects direct yfrog" do
      Scrapers::Image.new(@yfrog).scraper.should be_instance_of(Scrapers::Sources::Yfrog)
    end

    it "detects direct image url" do
      Scrapers::Image.new(@raw_url).scraper.should be_instance_of(Scrapers::Sources::RawImage)
    end

  end

end
