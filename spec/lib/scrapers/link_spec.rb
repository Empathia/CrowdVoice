require 'spec_helper'

describe Scrapers::Link do

  before(:each) do
    @link_url = "http://google.com"
    @invalid_url = "something invalid"
  end

  context "being created" do

    context 'with invalid url' do

      it "raise an exception" do
        lambda do
          Scrapers::Link.new(@invalid_url)
        end.should raise_error(Scrapers::Sources::Exceptions::UnrecognizedSource)
      end

    end

  end

  describe ".valid_url?" do

    it "tells if the given url is a valid URL" do
      Scrapers::Link.valid_url?(@link_url).should be_true
    end

    it "tells if the given url is an invalid URL" do
      Scrapers::Link.valid_url?(@invalid_url).should be_false
    end

  end

  describe "#scraper" do

    it "instantiates a new HTML scraper" do
      Scrapers::Link.new(@link_url).scraper.should be_instance_of(Scrapers::Sources::Html)
    end

  end

end
