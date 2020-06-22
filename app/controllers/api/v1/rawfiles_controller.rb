class Api::V1::RawfilesController < ApplicationController
  load_and_authorize_resource

  before_action :set_rawfile, only: [:show]

  def upload
    tempfile = params[:file].tempfile
    original_filename = params[:file].original_filename
    content_type = params[:file].content_type
    mtime = Time.at(params[:last_modified].to_i/1000)

    storage_root = File.join("#{Rails.root}", "storage")
    filename = original_filename
    file_path = File.join(storage_root, filename)
    index = 0
    while File.exists?(file_path)
      index = index + 1
      filename = original_filename + '.' + index.to_s
      file_path = File.join(storage_root, filename)
    end

    Rawfile.where(size: tempfile.size,
                  content_type: content_type).each do |cmp_file|
      if FileUtils.cmp(File.join(storage_root, cmp_file.filename), tempfile.path)
        # File was already uploaded: render original
        render json: cmp_file

        return
      end
    end

    # File was not found: create in storage
    FileUtils.cp(tempfile.path, file_path)
    FileUtils.touch(file_path, mtime: mtime)

    rawfile = Rawfile.new(filename: filename,
                          orig_filename: original_filename,
                          content_type: content_type,
                          size: File.size(file_path))
    if rawfile.save
      render json: rawfile
    else
      render json: rawfile.errors
    end
  end


  def show
    render json: @rawfile
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rawfile
      @rawfile = Rawfile.find(params[:id])
    end
end
