class Note < ActiveRecord::Base
	has_many :collaborations
	has_many :users,:through=>:collaborations

	has_many :tags_handlers
	has_many :tags,:through=>:tags_handlers
	
	has_many :notifications

	validates :content,presence: true

	scope :recent_notes,lambda { order("notes.created_at DESC") }

	#active record callbacks
	before_destroy :destroy_related_tags,:destroy_related_notifications
	after_update :touch_tags
	private
	def destroy_related_tags
		self.tags.each do |tag|
			tag.destroy
		end
	end

	def destroy_related_notifications
		self.notifications.each do |notification|
			notification.destroy
		end
	end
	def touch_tags
		self.tags.each do |tag|
			tag.touch
		end
	end

end
