require 'spec_helper'

describe Voice do
  before(:each) do
    @voice = Factory(:voice)
  end

  it { should belong_to(:user) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:description) }
  %w[title description theme logo_link latitude longitude location
     map_url twitter_search featured archived background logo].each do |attr|
    it { should allow_mass_assignment_of(attr) }
   end
  %w[slug].each do |attr|
    it { should_not allow_mass_assignment_of(attr) }
  end

  it "allows value for theme with predefined themes" do
    Voice::THEMES.each do |theme|
      should allow_value(theme).for(:theme)
    end
  end

  it "doesn't allow value for theme that is not a predefine theme" do
    %w[gray cyan black white purple].each do |theme|
      should_not allow_value(theme).for(:theme)
    end
  end

  it "generates slug based on title" do
    @voice = Factory(:voice, :title => "Testing-slug-123")
    @voice.slug.should == 'testing-slug-123'
  end

  it "generates unique slug if one is already been taken" do
    Factory(:voice, :title => "This title is taken")
    @voice = Factory(:voice, :title => "This title is taken")
    @voice.slug.should == 'this-title-is-taken--2'
  end

  describe "#map_link" do
    it "builds google maps link with latitude and longitude" do
      @voice = Factory(:voice, :location => "Mexico")
      @voice.map_link.should == "http://maps.google.com/?q=Mexico"
    end

    it "prefers map_url over building the link" do
      @voice = Factory(:voice, :map_url => 'http://maps.google.com')
      @voice.map_link.should == 'http://maps.google.com'
    end
  end

  describe ".featured scope" do
    before do
      @featured = []
      3.times { @featured << Factory(:voice, :featured => true) }
    end

    it "filters only featured = true voices" do
      Voice.featured.should == @featured
    end
  end

  describe ".archived scope" do
    before do
      @archived = []
      3.times { @archived << Factory(:voice, :archived => true) }
    end

    it "filters only archived = true voices" do
      Voice.archived.should == @archived
    end
  end

  describe 'automatic feed' do
    it 'should add rss content after save' do
      @voice.rss_feed = nil
      @voice.posts = []
      @voice.save
      @voice.rss_feed = "http://news.google.com/news?pz=1&cf=all&ned=es_mx&hl=es&output=rss"
      @voice.save
      @voice.reload
      @voice.posts.should_not be_empty
    end

    it 'should add twitter links after save' do
      @voice.twitter_search = nil
      @voice.save
      @voice.twitter_search = "#google"
      @voice.posts = []
      @voice.save
      @voice.reload
      @voice.posts.should_not be_empty
    end
  end
end

