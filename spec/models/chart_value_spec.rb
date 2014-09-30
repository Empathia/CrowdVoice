require 'spec_helper'

describe ChartValue do
  it { should belong_to(:chart) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:value) }

  pending "add some examples to (or delete) #{__FILE__}"
end
