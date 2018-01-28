module QuestionsHelper
	
	def my_root_path
	  return "#{ActionController::Base.relative_url_root}/"
	end
	
	def url_for_public(path)
	  return "#{ActionController::Base.relative_url_root}/#{path}"
	end
end
