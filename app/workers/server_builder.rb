class ServerBuilder
  @queue = :install_queue
  def self.perform(user_id, server_name)
    user = User.find_by_id(user_id)
    installation = DataMover.new(user_id, server_name)
    installation.run
  end
end
