module Scrapers
  module Sources
    module Exceptions
      class NotFound < StandardError; end
      class UnrecognizedSource < StandardError; end
    end
  end
end
