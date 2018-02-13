module QuestionsHelper
	
	def my_root_path
	  return "#{ActionController::Base.relative_url_root}/"
	end
	
	def url_for_public(path)
	  return "#{ActionController::Base.relative_url_root}/#{path}"
	end



	def default_meta_tags
	{
		charset: 'utf-8',
		site: Settings.site.name,
		reverse: true,
		title: Settings.site.meta.title,
		description: Settings.site.meta.description,
		keywords: Settings.site.meta.keywords,
		canonical: Settings.site.root_url,
	    viewport: 'width=375, initial-scale=1, user-scalable=no',
		og: {
			title: :title,
			type: Settings.site.meta.og.type,
			url: Settings.site.root_url,
			image: image_url(Settings.site.meta.og.image),
			site_name: Settings.site.name,
			description: Settings.site.meta.description,
			locale: 'ja_JP'
		}
	}
	end
end
