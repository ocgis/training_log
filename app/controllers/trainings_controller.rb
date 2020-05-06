class TrainingsController < ApplicationController

  load_and_authorize_resource

  before_action :set_training, only: [:show, :edit, :update, :destroy]

  # GET /trainings
  # GET /trainings.json
  def index
    @trainings = Training.all.order(date: :desc)
  end

  # GET /trainings/1
  # GET /trainings/1.json
  def show
  end

  # GET /trainings/new
  def new
    @training = Training.new
    @training.date = DateTime.now()
    @id = nil
    @training_hash = @training.attributes.except('id', 'duration_s', 'created_at', 'updated_at').update({'duration_hh_mm_ss' => @training.duration_hh_mm_ss,

                                                  'intervals_attributes' => @training.intervals.map { |interval| interval.attributes.except('duration_s', 'ix', 'training_id', 'created_at', 'updated_at').update({'duration_hh_mm_ss' => interval.duration_hh_mm_ss,
                                                                                                                                                                                                                  '_destroy' => 0 }) } })
  end

  # GET /trainings/1/edit
  def edit
    @id = @training.id
    @training_hash = @training.attributes.update({'duration_hh_mm_ss' => @training.duration_hh_mm_ss,

                                                  'intervals_attributes' => @training.intervals.map { |interval| interval.attributes.except('duration_s', 'ix', 'training_id', 'created_at', 'updated_at').update({'duration_hh_mm_ss' => interval.duration_hh_mm_ss,
                                                                                                                                                                                                                  '_destroy' => 0 }) } })
  end

  # POST /trainings
  # POST /trainings.json
  def create
    @training = Training.new(training_params)
    @training.person = current_user.people[0]

    respond_to do |format|
      if @training.save
        # format.html { redirect_to @training.person, notice: 'Training was successfully created.' }
        format.html { render :show, status: :created, location: @training.person }
        format.json { render :show, status: :created, location: @training.person }
      else
        format.html { render :new }
        format.json { render json: @training.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /trainings/1
  # PATCH/PUT /trainings/1.json
  def update
    respond_to do |format|
      if @training.update(training_params)
        # format.html { redirect_to @training, notice: 'Training was successfully updated.' }
        format.html { render :show, status: :ok, location: @training }
        format.json { render :show, status: :ok, location: @training }
      else
        format.html { render :edit }
        format.json { render json: @training.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /trainings/1
  # DELETE /trainings/1.json
  def destroy
    @training.destroy
    respond_to do |format|
      format.html { redirect_to trainings_url, notice: 'Training was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_training
      @training = Training.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def training_params
      params.require(:training).permit(:kind, :date, :description, :duration_hh_mm_ss, :distance_m, :max_pulse_bpm, :avg_pulse_bpm, :energy_kcal, :intensity, :altid, :route_id, :person_id, intervals_attributes: [:id, :duration_hh_mm_ss, :distance_m, :comment, :_destroy])
    end
end
