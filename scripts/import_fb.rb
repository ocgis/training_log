# coding: utf-8
require 'pp'

puts "FP importer started"


def str2seconds(str)
  mm_min_match = /^(\d+) min$/.match(str)
  if mm_min_match
    return mm_min_match[1].to_i * 60
  end

  hh_mm_ss_match = /^(\d\d):(\d\d):(\d\d)$/.match(str)
  if hh_mm_ss_match
    return (hh_mm_ss_match[1].to_i * 24 + hh_mm_ss_match[2].to_i) * 60 + hh_mm_ss_match[3].to_i
  end

  raise 'Could not convert "%s" to seconds' % str
end


def str2meters(str)
  if str == ''
    return nil
  end

  n_km_match = /^(\d+) km$/.match(str)
  if n_km_match
    return n_km_match[1].to_i * 1000
  end

  n_n_km_match = /^(\d+),(\d+) km$/.match(str)
  if n_n_km_match
    meters = (n_n_km_match[2] + '00')[0..2].to_i
    return n_n_km_match[1].to_i * 1000 + meters
  end

  raise 'Could not convert "%s" to meters' % str
end


def str2kcal(str)
  if str == ''
    return nil
  end

  n_kcal_match = /^(\d+) kcal$/.match(str)
  if n_kcal_match
    return n_kcal_match[1].to_i
  end

  raise 'Could not convert "%s" to meters' % str
end


def str2bpm(str)
  if str == ''
    return nil
  end

  n_bpm_match = /^(\d+) slag\/min$/.match(str)
  if n_bpm_match
    return n_bpm_match[1].to_i
  end

  raise 'Could not convert "%s" to meters' % str
end


def get_person_id(doc)
  avatar_tag = doc.xpath('//img[@id="ctl00_ctl00_MainContentPlaceHolder_PersonNavigation1_PhotoImage"]')
  if avatar_tag.size != 1
    raise "Could not get person id"
  end
  user_match = /\/(\d+)\./.match(avatar_tag[0]['src'])
  return user_match[1].to_i
end


def import_fb_training(person_hash, path)
  puts "About to parse training from " + path
  doc = Nokogiri::HTML(open(path))

  training_person_id = get_person_id(doc)

  if not person_hash.key? training_person_id
    raise "Training is for person %d, not person %d" % [training_person_id, person_id]
  end
  person_obj = person_hash[training_person_id]

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
  training['altid'] = meta_dict['og:url'].split('=')[-1].to_i
  training['kind'] = meta_dict['og:title'].split(' ')[0]
  training['date'] = meta_dict['og:title'].split(' ')[1]
  training['description'] = meta_dict['og:description']

  sub_header = doc.xpath('//h2[@id="ctl00_ctl00_MainContentPlaceHolder_MainContentPlaceHolder_SubHeader"]')
  time = sub_header.text.split(') ')[-1]
  training['duration_s'] = str2seconds(time)

  doc.xpath('//div').each do |div|
    if div['class'] == 'TrainingProperty clrfix'
      # puts "INFO: Handle trainingProperty %s" % div
      div_dict = {}
      div.xpath('./div').each do |part|
        part_key = part['class']
        if part_key == 'Key'
          div_dict[part_key] = part.text
        else
          div_dict[part_key] = part
        end
      end
      key = div_dict['Key']

      int_map = {'Tempo:' => nil,
                 'Hastighet:' => nil,
                 'Intensitet:' => 'intensity'}
      pulse_map = {'Maxpuls:' => 'max_pulse_bpm',
                   'Snittpuls:' => 'avg_pulse_bpm'}

      if key == "Runda:"
        href = div_dict['Value'].children[0]['href']
        route_id = href.split('%3D')[-1]
      elsif key == "Sträcka:"
        training['distance_m'] = str2meters(div_dict['Value'].text)
      elsif key == "Kaloriförbrukning:"
        training['energy_kcal'] = str2kcal(div_dict['Value'].text)
      elsif pulse_map.key? key
        training[pulse_map[key]] = str2bpm(div_dict['Value'].text)
      elsif int_map.key? key
        if not int_map[key].nil?
          training[int_map[key]] = div_dict['Value'].text.to_i
        end
      else
        puts "ERROR: Can't map training property %s" % div_dict['Key']
      end
    else
      # puts "Don't know how to handle %s" % div
    end
  end

  tables = doc.xpath('//table')
  intervals = []
  tables.each do |table|
    # print(table)
    if table['id'] == "ctl00_ctl00_MainContentPlaceHolder_MainContentPlaceHolder_TrainingPropertiesDataList"
      # This should already be handled
      # table.xpath('./tr').each do |tr|
      #   # print('\t'.join([''.join(th.contents.strip(' \t\n\r')) for th in tr.find_all('th')]))
      #   td_list = tr.xpath('./td').map{|td| td.children}
      #   # print(td_list)
      #   # for td in td_list:
      #   # print(td)
      # end
    else
      puts "INFO: Handling table with id=%s class=%s" % [table['id'], table['class']]
      if table.xpath('.//div[@id="chartWrapper"]').size == 0
        table.xpath('./tr').each do |tr|
          tds = tr.xpath('./td').map{|td| td.text.strip}
          if tds.size > 0
            intervals.append({'duration_s': str2seconds(tds[0]),
                              'distance_m': str2meters(tds[1]),
                              # 'pace': tds[2],
                              # 'speed': tds[3],
                              'comment': tds[4]})
            # print('\t'.join([contents_to_text(th).strip() for th in tr.find_all('th')]))
            # print('\t'.join([contents_to_text(td).strip() for td in tr.find_all('td')]))
          end
        end
      else
        puts "INFO: Can't handle chart!"
      end
    end
    # print()
  end

  puts
  puts "Training:"
  pp training
  training_objs = Training.where({altid: training['altid']})
  if training_objs.length == 1
    training_obj = training_objs[0]
    training_obj.update(training)
    training_obj.save
    puts "Updated training %d with %s" % [training_obj.id, training]
  elsif training_objs.length == 0
    training_obj = Training.new(training)
    person_obj.trainings << training_obj
    puts "Created training %d with %s" % [training_obj.id, training]
  else
    raise "Found several trainings with id"
  end

  if not route_id.nil?
    puts "FIXME: Implement routes!"
    puts "Route: %d" % route_id
  end
  if intervals.size > 0
    puts "Intervals:"
    pp intervals
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

  person_id = get_person_id(doc)

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

  person_hash = { person_id => person_obj }

  # Now import trainings
  trainings_path = path.split('/')[0..-3].join('/') + '/training/show.aspx?TrainingID=*'
  Dir[trainings_path].each do |training_path|
    import_fb_training(person_hash, training_path)
    # return # FIXME
  end
end


ARGV.each do |path|
  import_fb_user(path)
end
