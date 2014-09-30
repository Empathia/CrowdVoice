require 'spec_helper'

describe Block do
  it { should belong_to(:voice) }
  it { should validate_presence_of(:name) }

  pending "add some examples to (or delete) #{__FILE__}"
end
