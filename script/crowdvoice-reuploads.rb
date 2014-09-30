[
  'united-states-crimes-at-guantanamo-bay',
  'female-genital-mutilation',
  'drug-war-in-mexico',
  'protests-in-tunisia',
  'sexual-harassment-in-egypt',
  'honor-crimes-in-the-middle-east',
  'political-repression-in-burmas-elections',
  'human-rights-crackdown-in-bahrain',
  'protests-in-kashmir',
  'disparity-in-kenya',
  'tamil-rights-in-sri-lanka',
  'gender-based-violence-in-haiti',
  'lgbt-rights-in-uganda',
  'croatian-activists-arrested-in-protest-against-destruction-of-city-center',
  'justice-for-oscar-grant',
  'restrictions-on-religious-freedom-in-uzbekistan',
  'protesters-want-independence-for-catalonia',
  'repression-of-dissent-in-russia',
  'protests-over-fuel-costs-in-india',
  'us-torture-in-bagram-prison-afghanistan',
  'womens-rights-in-iraq',
  'gaza/israeli-raid-on-gaza-flotilla',
  'human-rights-violations-in-sudan',
  'emergency-law-and-police-brutality-in-egypt',
  'violation-of-human-rights-in-north-korea',
  'kyrgyzstans-interim-government-unable-to-squelch-ethnic-violence',
  'censorship-in-china',
  'opposition-protests-in-iran'
].each do |slug|

  voice = Voice.find_by_slug(slug)
  filename = Rails.root.join("log/#{slug}.reupload")
  File.new(filename, 'w').close unless File.exists?(filename)
  puts "logging at #{filename}"
  voice.posts.find_in_batches(:batch_size => 100) do |batch|
    processed = File.read(filename).split
    batch.each do |post|
      next if processed.include?(post.id.to_s)
      begin
        if Post.is_url_reachable?(post.source_url)
          post.send :scrape_source
          post.store_image!
          post.save
          File.open(filename, 'a') do |file|
            file.puts post.id
          end
          # puts "Post #{post.id} done"
        else
          post.destroy
          # puts "Post #{post.id} deleted"  
        end
      rescue StandardError, Timeout::Error => e
        post.destroy
        # puts "Err #{post.id}, deleted. #{e}"
      end
      sleep 1
    end
  end if voice
  puts "Voice #{slug} done"
end
