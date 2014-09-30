 # ==============================================================================
# SETUP
# ==============================================================================
cmd_prefix  = "GEM_HOME=#{status.gem_home} RACK_ENV=#{node.environment.framework_env} RAILS_ENV=#{node.environment.framework_env}"
pid_dir     = '/data/crowdvoice/shared/tmp/pids'
tmp_img_dir = '/data/crowdvoice/current/public/tmp'

# ==============================================================================
# CREATE PIDS DIR ONLY IF IT DOES NOT EXIST
# ==============================================================================
directory tmp_img_dir do
  owner app[:user]
  group app[:user]
  mode 0777
  always_run true
end


directory pid_dir do
  owner app[:user]
  group app[:user]
  mode 0777
  always_run true
end

execute 'Generate foreman environment file' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'echo \"#{cmd_prefix.split(' ').join('\n')}\" > .env'"
end

execute 'Run foreman to generate upstart services' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo foreman export upstart /etc/init -a crowdvoice -l /data/crowdvoice/current/log -u deploy -c resque=3'"
end

execute 'Stop resque jobs' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo stop crowdvoice'"
end

execute 'Start resque jobs' do
  always_run true
  owner app[:user]
  path current_path
  command "/bin/sh -l -c 'sudo start crowdvoice'"
end

execute 'Update javascripts and css' do
  always_run true
  owner app[:user]
  path release_path
  command "#{cmd_prefix} bundle exec jammit -f"
end

# execute 'Installing cron jobs' do
#   always_run true
#   owner app[:user]
#   path release_path
#   command "#{cmd_prefix} whenever --load-file cron/schedule.rb --set 'environment=#{node.environment.framework_env}' -w "
# end

execute 'Deploying to hoptoad' do
  always_run true
  owner app[:user]
  path release_path
  command "#{cmd_prefix} rake hoptoad:deploy TO=#{node.environment.framework_env}"
end

execute 'Migrate all databases' do
  always_run true
  owner app[:user]
  path release_path
  command "#{cmd_prefix} bundle exec rake migrations"
end

