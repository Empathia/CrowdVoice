class EventSeed
  def initialize
    1.upto(30) do |n|
      voice = Voice.last
      event = Event.create(
        :voice_id => voice.id,
        :name => "event_#{n}",
        :description => "Lorem Ipsum is simply dummy text of the <a class='mention' data-reference='bs-#{(1..30).to_a.sample}'>printing and typesetting</a> industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        :background_image => File.open("#{Rails.root}/public/images/img-1.png"),
        :event_date => EventSeed.rand_time(30.days.ago),
        :is_event => (0..1).to_a.sample
        )
        event.related_images.create!(:image=>File.open("#{Rails.root}/public/images/img-2.png"), :related_to => (1..30).to_a.sample)
        event.related_images.create!(:image=>File.open("#{Rails.root}/public/images/img-3.png"), :related_to => (1..30).to_a.sample)
        event.related_images.create!(:image=>File.open("#{Rails.root}/public/images/img-4.png"), :related_to => (1..30).to_a.sample)
        event.related_videos.create!(:url=>"https://www.youtube.com/watch?v=_dsSE94r3dA", :related_to => (1..30).to_a.sample)
    end
  end

  def self.rand_time(from, to=Time.now)
    Time.at(rand_in_range(from.to_f, to.to_f))
  end
  def self.rand_in_range(from, to)
    rand * (to - from) + from
  end
end
