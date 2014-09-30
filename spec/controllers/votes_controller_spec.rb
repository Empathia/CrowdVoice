require 'spec_helper'

describe VotesController do
  before(:all) do
    @voice = Factory :voice
    @post = Factory :post, {:voice_id => @voice.id}
  end

  describe "POST 'create'" do
    def do_request(params = {})
      post :create, params.merge(:format => :json)
    end

    it "should create a post vote" do
      do_request :voice_id => @voice.id, :post_id => @post.id
      @post.votes.length.should == 1
    end

    it "shouldnt create a post vote with and wrong post id" do
      lambda do
        do_request :voice_id => @voice.id, :post_id => 10
      end.should raise_error(ActiveRecord::RecordNotFound)
    end

    it "shouldnt create a post vote for the same user twice" do
      do_request :voice_id => @voice.id, :post_id => @post.id
      @post.votes.length.should == 1
    end
  end

  describe "DELETE 'destroy'" do
    it "should destroy a post vote" do
      delete :destroy, :id => @post.votes.first.id
      @post.reload.votes.length.should == 0
    end
  end
end
