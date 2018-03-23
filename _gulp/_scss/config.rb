http_path = "/"
css_dir = "../books/app/assets/stylesheets"
sass_dir = "."
images_dir = "../books/app/assets/images"
#javascripts_dir = "htdocs/assets/scripts"
output_style = :compact
line_comments = false
relative_assets = true

# Make a copy of sprites with a name that has no uniqueness of the hash.
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end

# Replace in stylesheets generated references to sprites
# by their counterparts without the hash uniqueness.
on_stylesheet_saved do |filename|
  if File.exists?(filename)
    css = File.read filename
    File.open(filename, 'w+') do |f|
      f << css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png')
    end
  end
end

Encoding.default_external = "utf-8";

#require 'ceaser-easing'
#http_path = "/"
#css_dir = "CSSの出力場所"
#sass_dir = "SCSSの保存場所"
#images_dir = "画像の保存場所"
#javascripts_dir = "JavaScriptの保存場所"
#output_style = Sassの出力形式（:expanded or :nested or :compact or :compressed）
#line_comments = CSSにSCSSの行番号を出力するか（true or false）