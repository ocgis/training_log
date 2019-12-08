# coding: utf-8
require 'pp'

puts "FP importer started"

TRANSLATE_TP = {'Runda:' => 'route_id',
                'Tempo:' => 'pace',
                'Hastighet:' => 'speed',
                'Sträcka:' => 'distance'}

def import_fb_training(person_id, path)
  puts "About to parse training from " + path
  doc = Nokogiri::HTML(open(path))

  training = {}
  route_id = nil

  metas = doc.xpath('//meta')
  meta_dict = {}
  metas.each do |meta|
    property = meta['property']
    if property.nil?
      # puts 'WARNING: Could not handle meta %s' % meta
    else
      content = meta['content']
      if meta_dict.key?(property)
        puts 'DEBUG: meta = %s' % meta
        raise '%s already in meta_dict' % property
      end
      meta_dict[property] = content
    end
  end
  # puts meta_dict
  training['altid'] = meta_dict['og:url'].split('=')[-1]
  training['type'] = meta_dict['og:title'].split(' ')[0]
  training['date'] = meta_dict['og:title'].split(' ')[1]
  training['description'] = meta_dict['og:description']

  doc.xpath('//div').each do |div|
    if div['class'] == 'TrainingProperty clrfix'
      # puts "INFO: Handle trainingProperty %s" % div
      div_dict = {}
      div.xpath('//div').each do |part|
        part_key = part['class']
        if part_key == 'Key'
          div_dict[part_key] = part.text
        else
          div_dict[part_key] = part
        end
      end
      key = div_dict['Key']
      if TRANSLATE_TP.key?(key)
        if key == "Runda:"
          href = div_dict['Value'].children[0]['href']
          route_id = href.split('%3D')[-1]
        else
          training[TRANSLATE_TP[key]] = div_dict['Value'].text
        end
      else
        puts "ERROR: Can't map training property %s" % div_dict['Key']
      end
    else
      # puts "Don't know how to handle %s" % div
    end
  end

  puts
  puts "Training:"
  pp training
  if not route_id.nil?
    puts "Route: %d" % route_id
  end
  puts
end


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

  # Now import trainings
  trainings_path = path.split('/')[0..-3].join('/') + '/training/show.aspx?TrainingID=*'
  Dir[trainings_path].each do |training_path|
    import_fb_training(person_id, training_path)
    # return # FIXME
  end
end


ARGV.each do |path|
  import_fb_user(path)
end
