if Rails.version >= "3.1"
  require "nvd3/engine"
else
  ActionView::Base.send :include, Nvd3::Helper
end
