module EmailHelper
  def email_connection_start
    imap = Net::IMAP.new(APP_CONFIG[:email]['host'], APP_CONFIG[:email]['port'], APP_CONFIG[:email]['ssl'])
    imap.login(APP_CONFIG[:email]['username'], APP_CONFIG[:email]['password'])
    imap
  end

  def email_connection_close(imap)
    imap.expunge
    imap.logout
  end

  def restore_emails
    # Restore all the emails, moving from the other folders
    imap = email_connection_start

    get_emails_on(imap, APP_CONFIG[:email]['invalidated_mails_folder']).each do |uid|
      imap.uid_copy(uid, 'INBOX')
      imap.uid_store(uid, "+FLAGS", [:Deleted])
    end

    get_emails_on(imap, APP_CONFIG[:email]['downloaded_mails_folder']).each do |uid|
      imap.uid_copy(uid, 'INBOX')
      imap.uid_store(uid, "+FLAGS", [:Deleted])
    end

    email_connection_close(imap)
  end

  def get_emails_on(imap, folder)
    imap.select(folder)
    ids = imap.uid_search(['NOT', 'DELETED'])
    ids
  end

end