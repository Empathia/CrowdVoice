require 'spec_helper'

describe "installations/show" do
  before(:each) do
    @installation = assign(:installation, stub_model(Installation,
      :name => "Name"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
  end
end
