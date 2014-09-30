module Nginx
  class ContentLengthFix
    def initialize(app)
      @app = app
    end

    def call(env)
      status, headers, response = @app.call(env)

      if status == 201
        headers["Content-Length"] = response.length.to_s
      end

      [status, headers, response]
    end
  end
end