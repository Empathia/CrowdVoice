Factory.define :post do |f|
  f.association(:voice)
  f.title "This is a post"
  f.description "This is an example post"
  f.sequence(:source_url) { |n| "http://google.com.mx##{n}" }
  f.source_type 'link'
end
