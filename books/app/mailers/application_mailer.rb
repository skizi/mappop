class ApplicationMailer < ActionMailer::Base
  default from:     "MapPop運営局",
          reply_to: "skizi3024@gmail.com"
  layout 'mailer'
end
