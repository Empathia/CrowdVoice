require 'spec_helper'

describe Scrapers::Video do

  before(:each) do
    @youtube_url = "https://www.youtube.com/watch?v=_dsSE94r3dA"
    @vimeo_url = "http://vimeo.com/20732587"
    @unknown_url = "http://google.com"
  end

  context "being created" do

    context 'with invalid url' do

      it "raise an exception" do
        lambda do
          Scrapers::Video.new(@unknown_url)
        end.should raise_error(Scrapers::Sources::Exceptions::UnrecognizedSource)
      end

    end

  end

  describe ".valid_url?" do

    it "tells if the given url is from any known source" do
      Scrapers::Video.valid_url?(@youtube_url).should be_true
      Scrapers::Video.valid_url?(@vimeo_url).should be_true
      Scrapers::Video.valid_url?(@unkown_url).should be_false
    end

  end

  describe "#scraper" do

    it "detects url from youtube" do
      Scrapers::Video.new(@youtube_url).scraper.should be_instance_of(Scrapers::Sources::YouTube)
    end

    it "detects url from vimeo" do
      Scrapers::Video.new(@vimeo_url).scraper.should be_instance_of(Scrapers::Sources::Vimeo)
    end

  end

end
