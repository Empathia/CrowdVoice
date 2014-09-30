task :migrations => :environment do
    DataMover.migrate_all_db
end

task :cleaning => :environment do
  posts.each do |post|
     begin
      post.destroy
     rescue => e
       puts "Post >>> #{post.id}"
       puts e.message
     end
    sleep 1
  end
end
