require 'spec_helper'

describe Hyponyms do

  describe "list_for" do
    it "get a word list of synonims" do
      syns = Hyponyms.list_for 'frog frog'
      syns.length.should > 0
    end
  end

end
