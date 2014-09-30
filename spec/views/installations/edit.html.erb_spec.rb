require 'spec_helper'

describe "installations/edit" do
  before(:each) do
    @installation = assign(:installation, stub_model(Installation,
      :name => "MyString"
    ))
  end

  it "renders the edit installation form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => installations_path(@installation), :method => "post" do
      assert_select "input#installation_name", :name => "installation[name]"
    end
  end
end
