require 'net/imap'
require 'yaml'
require 'tmail'

module Scrapers
  module Sources
    class Email
      class EmailPost < Struct.new(:title, :description, :images, :voice_id); end

      attr_accessor :emails, :uids

      def initialize(pattern = ['NOT', 'DELETED'])
        @emails = []
        get_info(pattern)
      end

      def scrape(&block)
        # if !@emails.empty?
          yield @emails
        # else
        #   raise Sources::Exceptions::NotFound
        # end
      end

      def get_info(pattern)
        start_connection
        @uids = @imap.uid_search(pattern)  #must be a imap valid pattern

        @uids.each do |uid|
          envelope = @imap.uid_fetch(uid, 'ENVELOPE').first.attr['ENVELOPE']
          @mailers = { :voice => [envelope.to.first.mailbox, envelope.to.first.host].join('@'), :user => [envelope.from.first.mailbox, envelope.from.first.host].join('@'), :subject => envelope.subject}
          @uid = uid

          #getting the data need it
          title = envelope.subject
          voice_id = envelope.to.first.mailbox.split('+').last
          attch = TMail::Mail.parse( @imap.uid_fetch(uid, 'RFC822').first.attr['RFC822'] )
          images = get_attachments(attch)

          post = EmailPost.new(title, '', images, voice_id)
          @emails << post  if valid_post(post)
        end

        close_connection
        @emails
      end

      def start_connection
        @imap = Net::IMAP.new(APP_CONFIG[:email]['host'], APP_CONFIG[:email]['port'], APP_CONFIG[:email]['ssl'])
        @imap.login(APP_CONFIG[:email]['username'], APP_CONFIG[:email]['password'])
        @imap.select(APP_CONFIG[:email]['look_in_folder'])
      end

      def close_connection
        @imap.expunge
        @imap.logout
      end

      def valid_post(post)
        valid = false
        if !post.images.blank? && post.voice_id.to_i > 0
          valid = true
          move_to(@uid, APP_CONFIG[:email]['downloaded_mails_folder'])
        else
          move_to(@uid, APP_CONFIG[:email]['invalidated_mails_folder'])
        end
        valid
      end

      def get_attachments(attch)
        images = []
        if attch.attachments.length > 0
          attch.attachments.each do |file|
            if valid_attachment?(file)
              image = File.new("/tmp/#{Time.now.to_i}-#{file.original_filename}", 'w')
              image << file.read
              images << image
              image.close
            else
              send_invalid_image_notification unless attachment_size_correct?(file.length)
            end
          end
        end if attch && attch.attachments
        images
      end

      def valid_attachment?(attch)
        !attch.original_filename.match(/(jpe?g|png|gif)$/i).nil? && attachment_size_correct?(attch.length)
      end

      def attachment_size_correct?(size)
        size < APP_CONFIG[:email]['max_mail_size']
      end

      def send_invalid_image_notification
        NotifierMailer.imap_invalid_image(
          @mailers[:subject],
          @mailers[:user],
          @mailers[:voice]
        ).deliver
        nil
      end

      def move_to(msg_id, folder)
        @imap.uid_copy(msg_id, folder)
        @imap.uid_store(msg_id, "+FLAGS", [:Deleted])
      end

    end
  end
end
