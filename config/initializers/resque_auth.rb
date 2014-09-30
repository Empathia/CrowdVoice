Resque::Server.use(Rack::Auth::Basic) do |user, password|
  password == "fr3sh0ut"
end
Resque::Plugins::Timeout.timeout = 120
