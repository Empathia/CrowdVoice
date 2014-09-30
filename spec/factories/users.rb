Factory.define :user do |f|
  f.sequence(:username) { |n| "foobar#{n}" }
  f.sequence(:email) { |n| "foo.bar.#{n}@example.com" }
  f.password "123456"
end
