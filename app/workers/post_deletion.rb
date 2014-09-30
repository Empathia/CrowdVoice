class PostDeletion
  @queue = :posts
  def self.perform(voice_id, db_name)
    config= ActiveRecord::Base.connection.instance_variable_get("@config")
    ActiveRecord::Base.establish_connection(config.dup.update(:database => db_name))
    ActiveRecord::Base.connection
    Post.where(:voice_id => voice_id).find_each(:batch_size =>  10) do |post|
      post.destroy
    end
  end
end
