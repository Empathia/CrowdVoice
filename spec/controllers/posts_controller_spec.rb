require 'spec_helper'

describe PostsController do

  describe "POST 'create'" do

    def do_request(params = {})
      post :create, params.merge(:format => :json)
    end

    before do
      @voice = Factory(:voice)
      Voice.should_receive(:find_by_slug).with(@voice.slug).and_return(@voice)
      @post = Factory(:post)
      scraper = Scrapers::Sources::Html.new('http://example.com')
      Scrapers::Sources::Html.stub!(:new).and_return(scraper)
      scraper.stub!(:scrape).and_yield(Struct.new(:title, :description, :image_url).new('Example', 'desc example'))
    end

    it "finds context voice" do
      do_request :voice_id => @voice.slug, :post => { :source_url => 'http://google.com' }
    end

    it "creates a new post from given url" do
      do_request :voice_id => @voice.slug, :post => { :source_url => 'http://google.com' }
      assigns(:post).source_url.should == 'http://google.com'
    end

    context "when post saves successfully" do

      it "responds with status ok" do
        do_request :voice_id => @voice.slug, :post => { :title => 'Google', :source_url => 'http://google.com.mx' }
        response.status.should == 200
      end

    end

    context "when post url is already posted" do

      def do_request(params = {})
        post :create, params.merge(:format => :json)
      end

      it "responds with status unprocesable" do
        do_request :voice_id => @voice.slug, :post => { :source_url => @post.source_url }
        response.status.should == 422
      end

    end

  end

end
