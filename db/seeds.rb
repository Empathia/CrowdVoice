v = Voice.create!(:title => 'This is a test voice',
  :description => 'This is a test voice that is loaded on db/seeds.rb',
  :twitter_search => 'crowdvoice',
  :location => 'Mexico',
  :latitude => 23.634501,
  :longitude => -102.55278399999997,
  :sponsor => 'Greenpeace',
  :sponsor_slogan => 'Inspiring action for a green and peaceful future.',
  :logo => File.open("#{Rails.root}/public/images/bg/greenpeace.png"),
  :logo_link => 'http://greenpeace.org',
  :theme => 'green'
 )

Announcement.create!(:title => 'Daily News!',
                     :content => 'at somewhere.com',
                     :url => 'http://news.google.com',
                    :voice => v)

post1 = v.posts.create!(:source_url => 'http://google.com')
post2 = v.posts.create!(:source_url => 'http://freshout.us')
post3 = v.posts.create!(:source_url => 'https://www.youtube.com/watch?v=_dsSE94r3dA')
post3 = v.posts.create!(:source_url => 'http://www.undispatch.com/wp-content/uploads/2011/02/Screen-shot-2011-02-16-at-9.57.43-AM-e1297868494494.png')
post3 = v.posts.create!(:source_url => 'http://www.flickr.com/photos/edgarjs/5411637705/')
post3 = v.posts.create!(:source_url => 'http://twitpic.com/show/full/4qlahz.jpg')
post3 = v.posts.create!(:source_url => 'http://centers.law.nyu.edu/jeanmonnet/images/TL_map-world.jpg')
post3 = v.posts.create!(:source_url => 'http://twitpic.com/4qlahz')
post3 = v.posts.create!(:source_url => 'http://vimeo.com/22253725')
