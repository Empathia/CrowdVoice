require 'spec_helper'

describe Post do
  it { should belong_to(:voice) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:source_type) }

  # it { should validate_presence_of(:source_url) }
  # it { should validate_uniqueness_of(:source_url).case_insensitive }

  context "being created" do

    def create_post(attrs = {})
      record = Post.new(attrs)
      flunk record.errors.full_messages unless record.save
      record
    end

    it "fetchs meta data from source" do
      @post = create_post(:source_url => "http://freshout.us##{rand(10)}")
      @post.title.should == 'San Francisco Web Development | Freshout'
      @post.description.should == 'Freshout is a full service web application design and development agency that specializes in pioneering disruptive ideas on the web within rapid timelines.'
    end

    it "should not validate the source url when image column isn't empty" do
      post = create_post(:title => 'test', :image => File.open("spec/factories/images/voice.jpg"))
      post.new_record?.should == false
    end

    it "should validate the source url when image column is empty" do
      post = create_post(:title => 'test2', :source_url => "http://freshout.us##{rand(10)}")
      post.new_record?.should == false
    end

    it "should validate the duplicity of source url" do
        lambda do
          post1 = Factory.create(:post, :voice_id => 1, :source_url => "http://freshout.us#")
          post2 = Factory.create(:post, :voice_id => 1, :source_url => "http://freshout.us#")
        end.should raise_error(ActiveRecord::RecordInvalid)
    end

    it "should get a list of related tags" do
        post = create_post(:title => 'frog', :source_url => "http://freshout.us##{rand(10)}")
        post.tag_list.length.should > 0
    end

  end

  describe ".detect_type" do

    it "detects YouTube video url" do
      url = "https://www.youtube.com/watch?v=_dsSE94r3dA"
      Post.detect_type(url).should == 'video'
    end

    it "detects Vimeo video urls" do
      url = "http://vimeo.com/20732587"
      Post.detect_type(url).should == 'video'
    end

    it "detects Flickr image urls" do
      url = "http://www.flickr.com/photos/thepretender/456448210/"
      Post.detect_type(url).should == 'image'
    end

    it "detects Twitpic image urls" do
      url = "http://twitpic.com/47jrpf"
      Post.detect_type(url).should == 'image'
    end

    it "detects Yfrog image urls" do
      url = "http://yfrog.com/kg5ukdj"
      Post.detect_type(url).should == 'image'
    end

    it "detects raw image urls" do
      url = "http://s3.amazonaws.com/twitpic/photos/full/254544387.jpg?AWSAccessKeyId=0ZRYP5X5F6FSMBCCSE82&Expires=1299627534&Signature=h0%2BZ%2BClRTFlsmartPAAEmpKQBZg%3D"
      Post.detect_type(url).should == 'image'
    end

    it "detects link urls" do
      url = "http://crowdvoice.org"
      Post.detect_type(url).should == 'link'
    end

    it "doesn't detect invalid urls" do
      url = "something that is not a url"
      Post.detect_type(url).should be_nil
    end

  end

end
