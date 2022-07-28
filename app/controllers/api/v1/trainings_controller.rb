require 'readfit'

class Api::V1::TrainingsController < ApplicationController
  load_and_authorize_resource

  before_action :set_training, only: [:show, :edit, :update, :destroy]

  def index
  end

  def create
  end

  def show
    intervals_attributes = @training.intervals.map {
      |interval| interval.all_attributes.except('ix', 'training_id', 'created_at', 'updated_at').update({'_destroy' => 0 })
    }

    training_hash = @training.all_attributes.update({intervals_attributes: intervals_attributes })
    if not @training.route.nil?
      training_hash = training_hash.update({route: @training.route.all_attributes})
    end

    rawfiles = []
    @training.rawfiles.each do |rawfile|
      rawfile_hash = rawfile.attributes

      # FIXME: Check if this is a fitfile
      fitfile = ReadFit(full_path(rawfile_hash['filename']))
      rawfile_hash = rawfile_hash.update({fitfile: fitfile})
      rawfiles.append(rawfile_hash)
    end

    training_hash = training_hash.update({rawfiles: rawfiles})
    
    render json: training_hash
  end


  def create
    @training = Training.new(training_params)
    @training.person = current_user.people[0]

    if @training.save
      render json: @training
    else
      render json: @training.errors
    end
  end


  def update
    if @training.update(training_params)
      render json: @training
    else
      render json: @training.errors
    end
  end


  def destroy
  end


  def search
    date = params[:date].to_datetime.beginning_of_day

    trainings = Training.where("date >= :min AND date < :max", min: date, max: date.days_since(1))
    trainings_hash = trainings.map {
      |training| training.all_attributes
    }

    render json: {result: trainings_hash }
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_training
      @training = Training.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def training_params
      params.require(:training).permit(:kind, :date, :description, :duration_s, :distance_m, :max_pulse_bpm, :avg_pulse_bpm, :energy_kcal, :intensity, :altid, :route_id, :person_id, intervals_attributes: [:id, :duration_s, :distance_m, :comment, :_destroy])
    end

    # FIXME: Duplicated in rawfiles_controller
    def full_path(filename)
      return File.join("#{Rails.root}", "storage", filename)
    end
end
