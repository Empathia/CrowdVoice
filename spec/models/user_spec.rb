require 'spec_helper'

describe User do
  before(:each) do
    @user = Factory(:user)
  end

  it { should have_many(:voices) }
  it { should validate_presence_of(:username) }
  it { should validate_presence_of(:password) }
  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:username) }
  it { should validate_uniqueness_of(:email) }
  it { should_not allow_mass_assignment_of(:password_salt) }
  it { should_not allow_mass_assignment_of(:encrypted_password) }
  it { should allow_mass_assignment_of(:username) }
  it { should allow_mass_assignment_of(:email) }
  it { should allow_mass_assignment_of(:password) }

  it "encrypts password on saving" do
    @user.password_salt.should_not be_nil
    @user.encrypted_password.should_not be_nil
  end

  it "authenticates user with email and password" do
    User.authenticate(@user.email, '123456').should == @user
  end

  context "when passing invalid credentials" do

    it "doesn't authenticate user" do
      User.authenticate('aaaaa', 'aaaaaa').should be_nil
      User.authenticate(@user.email, 'aaaaaa').should be_nil
    end

  end

end

