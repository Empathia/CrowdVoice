require 'spec_helper'

describe "installations/new" do
  before(:each) do
    assign(:installation, stub_model(Installation,
      :name => "MyString"
    ).as_new_record)
  end

  it "renders new installation form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => installations_path, :method => "post" do
      assert_select "input#installation_name", :name => "installation[name]"
    end
  end
end
