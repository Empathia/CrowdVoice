Factory.define :vote do |f|
  f.ip_address Time.now.tv_sec
  f.rating 1
  f.association :post, :factory => :post, :source_type => 'link'
end