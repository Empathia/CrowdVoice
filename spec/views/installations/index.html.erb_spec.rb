require 'spec_helper'

describe "installations/index" do
  before(:each) do
    assign(:installations, [
      stub_model(Installation,
        :name => "Name"
      ),
      stub_model(Installation,
        :name => "Name"
      )
    ])
  end

  it "renders a list of installations" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
  end
end
