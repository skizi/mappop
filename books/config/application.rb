require_relative 'boot'

require 'rails/all'

#クロスドメイン対策
# require 'rack'
# require 'rack/cors'


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Books
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.


	#クロスドメイン対策
	# config.action_dispatch.default_headers = {
	#   'Access-Control-Allow-Credentials' => 'true',
	#   'Access-Control-Allow-Origin' => 'http://localhost',
	#   'Access-Control-Request-Method' => '*'
	# }

	# config.middleware.insert_before 0, Rack::Cors do
	#   allow do
	#     origins 'localhost'
	#     resource '*', :headers => :any, :methods => [:get, :post, :options]
	#   end
	# end
	
	# Rails.application.config.middleware.insert_before 0, Rack::Cors do
	#   allow do
	#     origins '*'

	#     resource '*',
	#       headers: :any,
	#       methods: [:get, :post, :put, :patch, :delete, :options, :head]
	#   end
	# end
  end
end
