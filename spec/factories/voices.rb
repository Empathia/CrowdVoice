Factory.define :voice do |f|
  f.title "My voice example"
  f.description "This is an example voice"
  f.theme "green"
  f.association(:user)
end
