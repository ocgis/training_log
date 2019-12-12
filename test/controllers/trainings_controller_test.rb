require 'test_helper'

class TrainingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @training = trainings(:one)
  end

  test "should get index" do
    get trainings_url
    assert_response :success
  end

  test "should get new" do
    get new_training_url
    assert_response :success
  end

  test "should create training" do
    assert_difference('Training.count') do
      post trainings_url, params: { training: { altid: @training.altid, avg_pulse_bpm: @training.avg_pulse_bpm, date: @training.date, description: @training.description, distance_m: @training.distance_m, duration_s: @training.duration_s, energy_kcal: @training.energy_kcal, intensity: @training.intensity, kind: @training.kind, max_pulse_bpm: @training.max_pulse_bpm, person_id: @training.person_id } }
    end

    assert_redirected_to training_url(Training.last)
  end

  test "should show training" do
    get training_url(@training)
    assert_response :success
  end

  test "should get edit" do
    get edit_training_url(@training)
    assert_response :success
  end

  test "should update training" do
    patch training_url(@training), params: { training: { altid: @training.altid, avg_pulse_bpm: @training.avg_pulse_bpm, date: @training.date, description: @training.description, distance_m: @training.distance_m, duration_s: @training.duration_s, energy_kcal: @training.energy_kcal, intensity: @training.intensity, kind: @training.kind, max_pulse_bpm: @training.max_pulse_bpm, person_id: @training.person_id } }
    assert_redirected_to training_url(@training)
  end

  test "should destroy training" do
    assert_difference('Training.count', -1) do
      delete training_url(@training)
    end

    assert_redirected_to trainings_url
  end
end
