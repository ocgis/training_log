puts "FP importer started"

def import_fb_user(path)
  puts "About to parse " + path
  doc = Nokogiri::HTML(open(path))
  
  main_content = doc.xpath('//h1[@id="ctl00_ctl00_MainContentPlaceHolder_Header"]')
  if main_content.size != 1
    raise "Could not get person name"
  end
  person_name = main_content[0].content

  avatar_tag = doc.xpath('//img[@id="ctl00_ctl00_MainContentPlaceHolder_PersonNavigation1_PhotoImage"]')
  if avatar_tag.size != 1
    raise "Could not get person id"
  end
  user_match = /\/(\d+)\./.match(avatar_tag[0]['src'])
  person_id = user_match[1].to_i
  person_objs = Person.where({altid: person_id})
  if person_objs.length == 1
    person_obj = person_objs[0]
    person_obj.update({name: person_name})
    person_obj.save
    puts "Updated person %d with name %s and alt id %s" % [person_obj.id, person_name, person_id]
  elsif person_objs.length == 0
    person_obj = Person.new({name: person_name,
                             altid: person_id})
    person_obj.save
    puts "Created person %d with name %s and alt id %s" % [person_obj.id, person_name, person_id]
  else
    raise "Found several persons with id"
  end
end

ARGV.each do |path|
  import_fb_user(path)
end

