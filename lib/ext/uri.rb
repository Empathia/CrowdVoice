require 'uri'

module URI
  class << self

    def parse_with_safety(uri)
      parse_without_safety uri.gsub('[', '%5B').gsub(']', '%5D')
    end

    alias parse_without_safety parse
    alias parse parse_with_safety
  end
end