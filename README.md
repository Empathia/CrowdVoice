# Crowdvoice v2

This is only the style for the crowdvoice site.

The core is powered by crowd_engine.


## For wordnet install go to:

https://gist.github.com/3098837

# Crowdvoice Server Installation

## Technical Server Information
Technical information about server configuration and distribution, the application app is under Rails 3.0.9

### Branches and server mapping

**Note**: all servers are in Ubuntu 10.04 LTS (Lucid Lynx)

    SERVER NAME         |    IP         | BRANCH     | ENVIRONMENT
    crowdvoice          | 173.203.58.89 | production | production
    crowdvoice.staging  | 50.57.231.31  | cloneapp   | staging

### Dependencies

* Nginx
* Unicorn
* Mysql
* Monit
* Imagemagic
* Redis
* Openssh
* Iptables
* Apparmor

### Background jobs
* **migrate\_database** : Fired when a user sign up a new installation and confirms email
* **create\_bucket** : It creates an S3 bucket dedicated to the new server
* **load\_dummy\_data** : It insert a dummy voice to show how it will see
* **destroy\_server** : It erases the database and the bucket of a custom installation

### Validations
* validate uniqueness of server name
* validate use of number,letters and underscores only
* validates whitelist of words (mysql, production, etc)
* A user can have many installations
## Usage

### Bucket naming
* The format is "crowdvoice-installation-" + _server name_

### Database naming
* The format is "crowdvoice_installation_" + _server name_

### The Admin can edit the following variables:
* Site name
* Logo
* Tagline
* Social Links (Twitter, Facebook)
* Title Intro Bar
* About Page (iframe of a doc)

### Database and Bucket switching
ConnectionAdapter.connect_to(request.subdomain) : It reads the subdomain and contrusct with it the bucket and DB name

### Setting the domain on mailer
set_mailer_host : It set the domain to the default settings of Actionmailer on each request

### Get the name of the installation
ActiveRecord::Base.connection.instance_variable_get("@config")[:database].gsub('crowdvoice_installation_', '')

### Restore the crowdvoice default connection
ConnectionAdapter.restore_connection