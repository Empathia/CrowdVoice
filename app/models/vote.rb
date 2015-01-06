class Vote < ActiveRecord::Base
  belongs_to :post
  belongs_to :user

  validates :ip_address,
    :presence => true

  after_save :update_vote_counters
  after_save :update_content_approval

  scope :get_vote, lambda{ |post, user, ip| where("post_id = :post and (user_id = :user or ip_address = :ip)", {:post => post, :user => user, :ip => ip}) }

  def positive?
    rating == 1
  end

  def negative?
    rating == -1
  end

  private

  # updates the counters of the content depending on the vote
  def update_vote_counters
    post[:positive_votes_count] = Vote.where(:post_id => post_id, :rating => 1).count
    post[:negative_votes_count] = Vote.where(:post_id => post_id, :rating => -1).count
    post[:overall_score] = post.positive_votes_count - post.negative_votes_count
  end

  # Approves content if overall_score is greater than zero
  def update_content_approval
    post.update_attributes(:approved => true) if post.overall_score >= Setting.positive_threshold.to_i
    post.update_attributes(:approved => false) if post.overall_score <= Setting.negative_threshold.to_i
  end

end