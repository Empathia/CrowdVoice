require 'spec_helper'
require 'digest/md5'

describe Vote do

  before(:each) do
    @vote = Factory.build :vote
  end

  it 'should have a unique ip_address' do
    link = Factory.build :post, {:source_type => 'Link', :source_url => 'https://github.com/thoughtbot/factory_girl'}
    Factory :vote, :ip_address => '127.0.0.1', :post => link
    @vote.ip_address = '127.0.0.1'
    @vote.post = link

    @vote.should_not be_valid
  end

  it 'should have a content of any content type' do
    image = Factory :post, {:source_type => 'Image', :image => File.open("spec/factories/images/voice.jpg")}
    @vote.post = image
    @vote.save
    @vote.post.should == image
  end

  context 'update counters' do

    it 'should update positive vote counter' do
      @vote.rating = 1
      @vote.save
      @vote.post.reload.positive_votes_count.should == 1
    end

    it 'should update negative vote counter' do
      @vote.rating = -1
      @vote.save
      @vote.post.reload.negative_votes_count.should == 1
    end

    it 'should update overall score counter' do
      @vote.rating = -1
      @vote.save
      @vote.post.reload.overall_score.should == -1
    end
  end
end