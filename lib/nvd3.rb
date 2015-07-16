require "nvd3/version"
require "nvd3/helper"
require "nvd3/rails" if defined?(Rails)
require "nvd3/sinatra" if defined?(Sinatra)

module Nvd3
  class << self
    attr_accessor :content_for
    attr_accessor :options
  end
  self.options = {}
end

