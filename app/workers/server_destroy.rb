class ServerDestroy
  @queue = :server_destroy
  def self.perform(server_name)
    DataMover.destroy(server_name)
  end
end
