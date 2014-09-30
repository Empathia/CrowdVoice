require 'spec_helper'

describe Setting do

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:value) }

  it "should update setting Positive Threshold value through setter" do
    Setting.positive_threshold.should == 1
    Setting.positive_threshold = 5
    Setting.positive_threshold.should == 5
  end

  it "should update setting Negative Threshold value through setter" do
    Setting.negative_threshold.should == -1
    Setting.negative_threshold = 5
    Setting.negative_threshold.should == 5
  end

  it "should update setting Posts Per Page value through setter" do
    Setting.posts_per_page.should == 30
    Setting.posts_per_page = 45
    Setting.posts_per_page.should == 45
  end

end