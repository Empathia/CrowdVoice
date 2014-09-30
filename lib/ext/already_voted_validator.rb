# Validates the format of a url with simple regexp
class AlreadyVotedValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    vote = record.class.where("post_id = ? AND ip_address = ? AND created_at BETWEEN ? AND ?",
      record.post_id, record.ip_address, Time.now.beginning_of_day, Time.now.end_of_day)
    record.errors[:base] << "You already voted for this content" unless vote.empty?
  end
end