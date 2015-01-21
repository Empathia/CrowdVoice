#!/usr/bin/env ruby
require File.expand_path('config/environment.rb')

class Mailchimp < Thor
	desc "Send campaigns"
	cattr_reader :list_id
    @@list_id = "b7a57bc096"
    cattr_reader :folder_id
    @@folder_id = "48405"


	def send
        Gibbon::API.api_key = "0c65b3972885f3fb7007ba52c668568d-us1"

        totals = Gibbon::API.campaigns.list()["total"] * 1.0

        pages = (totals / 1000).ceil

        pages = pages - 1;

        campaigns = []

        for i in 0..pages do
            campaigns.concat(Gibbon::API.campaigns.list({:limit => 1000, :start => i })["data"])
        end
        
		segment_id = nil
        campaigns.each do |campaign|
            
            if campaign["saved_segment"] && campaign["saved_segment"]["name"] == '338-daily'
                puts "Found #{campaign['id']}"
                
                Gibbon::API.campaigns.update({
                    :cid => campaign["id"],
                    :name => 'content',
                    :value => [{:html => '<html><body><h1>HOLA!</h1></body></html>'}]
                });nil

                Gibbon::API.campaigns.send({:cid => campaign['id']});nil

                segment_id = campaign["saved_segment"]["id"]

                puts segment_id

                Gibbon::API.campaigns.delete({:cid => campaign['id']});nil

                Gibbon::API.campaigns.create({
                  :type => "regular", 
                  :options => {
                    :list_id => list_id, 
                    :subject => "CrowdVoice #{ocurrence} Notification", 
                    :from_email => "director@mideastyouth.com", 
                    :from_name => "CrowdVoice Notifications", 
                    :generate_text => true,
                    :folder_id => folder_id
                  },
                  :segment_opts => {
                    :saved_segment_id => segment_id
                  },
                  :content => {
                    :html => "<html><body><h1>HOLA!</h1></body></html>"
                  }
                });nil

                break
            
            end
        end

	end
end