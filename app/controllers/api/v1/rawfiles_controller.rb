require 'readfit'

class Api::V1::RawfilesController < ApplicationController
  load_and_authorize_resource

  before_action :set_rawfile, only: [:show, :update]

  def upload
    rawfiles = []
    params[:files].each do |file|
      rawfiles.append(create_file(file))
    end
    render json: { rawfiles: rawfiles }
  end


  def show
    # FIXME: Check if this is a fitfile
    fitfile = ReadFit(full_path(@rawfile.filename))
    render json: @rawfile.all_attributes.update({fitfile: fitfile})
  end


  def index
    @rawfiles = Rawfile.all
    render json: @rawfiles
  end


  def update
    if @rawfile.update(rawfile_params)
      fitfile = ReadFit(full_path(@rawfile.filename))
      render json: @rawfile.all_attributes.update({fitfile: fitfile})
    else
      render json: @rawfile.errors
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rawfile
      @rawfile = Rawfile.find(params[:id])
    end

    def full_path(filename)
      return File.join("#{Rails.root}", "storage", filename)
    end

    def rawfile_params
      params.require(:rawfile).permit(:filename, :orig_filename, :content_type, :size, :training_id)
    end

    def create_file(file)
      tempfile = file[:file].tempfile
      original_filename = file[:file].original_filename
      content_type = file[:file].content_type
      mtime = Time.at(file[:last_modified].to_i/1000)

      filename = original_filename
      file_path = full_path(filename)
      index = 0
      while File.exists?(file_path)
        index = index + 1
        filename = original_filename + '.' + index.to_s
        file_path = full_path(filename)
      end

      Rawfile.where(size: tempfile.size,
                    content_type: content_type).each do |cmp_file|
        if FileUtils.cmp(full_path(cmp_file.filename), tempfile.path)
          # File was already uploaded: skip rest
          return cmp_file
        end
      end

      # File was not found: create in storage
      FileUtils.cp(tempfile.path, file_path)
      FileUtils.touch(file_path, mtime: mtime)

      rawfile = Rawfile.new(filename: filename,
                            orig_filename: original_filename,
                            content_type: content_type,
                            size: File.size(file_path))
      rawfile.save
      return rawfile
    end
end
