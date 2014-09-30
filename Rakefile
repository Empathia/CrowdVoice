# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

CrowdvoiceV2::Application.load_tasks

desc "Recreate post images"
task :recreate_images => :environment do
  logger = Logger.new("/data/crowdvoice/shared/log/recreate_versions.log")

  Voice.all.each do |voice|
    voice.posts.find_each do |post|
      begin
        post.image.recreate_versions! unless post.image.url == "https://s3.amazonaws.com/crowdvoice-production-bucket/link-default.png"
        logger.info "Success voice(#{voice.id}) post(#{post.id})"
      rescue => e
        logger.info "Failed voice(#{voice.id}) post(#{post.id}): #{e.inspect}"
      end
    end
  end
end


