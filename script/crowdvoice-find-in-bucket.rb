require 'aws/s3'
require 'open-uri'

key = 'AKIAJC3NV3ED7ISPXTYQ'
secret = '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'

AWS::S3::Base.establish_connection!(
  :access_key_id => key,
  :secret_access_key => secret
)

buckets = AWS::S3::Service.buckets.select { |b| b.name =~ /^crowdvoice-installation/ }

buckets.each do |bucket|
  begin
    puts bucket.name if Net::HTTP.get_response(URI "https://#{bucket.name}.s3.amazonaws.com/uploads/post/image/1739493/thumb_760026168.jpg").code == "200"
  rescue => e
    # puts e
  end
end
