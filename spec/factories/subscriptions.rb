# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :subscription do |f|
  f.email "user@host.com"
  f.voice { |v| v.association :voice }
end
