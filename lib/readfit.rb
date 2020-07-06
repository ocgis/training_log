class FitCallbacks
  def initialize
    @activity = {
      activities: [],
      sessions: [],
      records: [],
      laps: [],
      events: [],
      device_infos: [],
      user_profiles: []
    }
  end
  
  def print_msg(arg1)
    # puts 'print_msg: ' + arg1
  end

  def on_event(event)
    # puts 'on_event'
    @activity[:events].append(event)
  end

  def on_device_info(device_info)
    # puts 'on_device_info'
    @activity[:device_infos].append(device_info)
  end

  def on_user_profile(user_profile)
    # puts 'on_user_profile'
    @activity[:user_profiles].append(user_profile)
  end

  def on_record(record)
    # puts 'on_record'
    @activity[:records].append(record)
  end

  def on_lap(lap)
    # puts 'on_lap'
    @activity[:laps].append(lap)
  end

  def on_session(session)
    # puts 'on_session'
    @activity[:sessions].append(session)
  end

  def on_activity(activity)
    # puts 'on_activity'
    @activity[:activities].append(activity)
  end

  def activities
    return @activity
  end
end

def ReadFit(file_path)
  raw = IO.read(file_path)
  callbacks = FitCallbacks.new()
  parser = RubyFit::FitParser.new(callbacks)
  parser.parse(raw)
  return callbacks.activities
end
