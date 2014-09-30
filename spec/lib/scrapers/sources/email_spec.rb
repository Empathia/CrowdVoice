require 'spec_helper'

describe Scrapers::Sources::Email do
  include EmailHelper

  before(:all) do
    # Scrapping the email to get the emails
    @scrapper = Scrapers::Sources::Email.new()
    @scrapper.scrape{|voice| @voice_posts = voice }
  end

  after(:all) do
    restore_emails
  end

  it "should invalidate the emails with wrong files of too big" do
  end

  it "should move the invalid emails to invalidated_mail folder" do
    sleep(5)
    imap = email_connection_start
    ids = get_emails_on(imap, APP_CONFIG[:email]['invalidated_mails_folder'])
    ids.length.should == 3
    email_connection_close(imap)
  end

  it "should move the valid emails to downloaded_mail folder" do
    sleep(5)
    imap = email_connection_start
    ids = get_emails_on(imap, APP_CONFIG[:email]['downloaded_mails_folder'])
    ids.length.should == 2
    email_connection_close(imap)
  end

  it "should return an array of valid voice posts" do
    @voice_posts.instance_of?(Array).should == true
    @voice_posts.length.should == 2
  end

  it "should get the info for each voice post" do
    @voice_posts.each do |post|
      post.images.each do |image|
        image.instance_of?(File).should == true
        image.length.should < APP_CONFIG[:email]['max_mail_size']
      end
      post.title.blank?.should == false
    end
  end

end