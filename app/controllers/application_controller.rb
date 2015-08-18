class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  private 
  def check_logged_in
  	if session[:id] && session[:username]
  		return true
  	else 
  		flash[:warning]="Please login !"
  		redirect_to login_path
  		return false
  	end
  end

  def check_if_admin
    note=Note.find_by_id(params[:id])
    note.collaborations.each do |collab|
      if collab.user.id==session[:id] && collab.is_admin 
        #if it's admin of note => alright 
        return true
      end 
    end
    return false
  end

end
