puts "FP importer started"

def import_fb_user(path)
  puts "About to parse " + path
  doc = Nokogiri::HTML(open(path))
  puts doc
  
  main_content = doc.xpath('//h1[@id="ctl00_ctl00_MainContentPlaceHolder_Header"]')
  if main_content.size != 1
    raise "Could not get user name"
  end
  user_name = main_content[0].content

  avatar_tag = doc.xpath('//img[@id="ctl00_ctl00_MainContentPlaceHolder_PersonNavigation1_PhotoImage"]')
  puts avatar_tag
  puts avatar_tag.size
  puts avatar_tag[0]['src']
  puts avatar_tag[0].attributes
  user_match = /\/(\d+)\./.match(avatar_tag[0]['src'])
  user_id = user_match[1].to_i
  puts user_id
  puts user_name
end

ARGV.each do |path|
  import_fb_user(path)
end

