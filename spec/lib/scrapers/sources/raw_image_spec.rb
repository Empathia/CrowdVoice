require 'spec_helper'

describe Scrapers::Sources::RawImage do
  before(:each) do
    url = "http://s3.amazonaws.com/twitpic/photos/full/254544387.jpg?AWSAccessKeyId=0ZRYP5X5F6FSMBCCSE82&Expires=1299627534&Signature=h0%2BZ%2BClRTFlsmartPAAEmpKQBZg%3D"
    @scraper = Scrapers::Sources::RawImage.new(url)
  end

  it "gets the filename of the url" do
    @scraper.filename.should == '254544387.jpg'
  end

  it "gets the extension of the filename" do
    @scraper.extension.should == 'jpg'
  end
end
