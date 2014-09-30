# Read about factories at http://github.com/thoughtbot/factory_girl

Factory.define :announcement do |f|
  f.title "Test Announcement"
  f.content "Announcing that we have announcement support"
  f.url "http://localhost:3000"
  f.voice { |a| a.association(:voice) }
end
