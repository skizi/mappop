namespace :yahoo do
  desc "yahoo GeocodeAPIからplace情報をデータベースに保存する"
  task yahoo: :environment do
    Yahoo.get_map_data( keyword, min_lng, max_lng, min_lat, max_lat )
  end
end
