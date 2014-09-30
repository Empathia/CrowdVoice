require 'spec_helper'

describe Announcement do
  before(:each) do
    Factory.build :announcement
  end

  it { should belong_to(:voice) }
  
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:content) }
  it { should validate_presence_of(:voice_id) }
  
end
