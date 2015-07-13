require "json"
require "erb"

module Nvd3
  module Helper
    def line_chart(data_source, options = {})
      nvd3_chart "LineChart", data_source, options
    end

    def pie_chart(data_source, options = {})
      nvd3_chart "PieChart", data_source, options
    end

    def column_chart(data_source, options = {})
      nvd3_chart "ColumnChart", data_source, options
    end

    def bar_chart(data_source, options = {})
      nvd3_chart "BarChart", data_source, options
    end

    def area_chart(data_source, options = {})
      nvd3_chart "AreaChart", data_source, options
    end

    def geo_chart(data_source, options = {})
      nvd3_chart "GeoChart", data_source, options
    end

    def timeline(data_source, options = {})
      nvd3_chart "Timeline", data_source, options
    end

    private

    def nvd3_chart(klass, data_source, options)
      @chartkick_chart_id ||= 0
      options = nvd3_deep_merge(Nvd3.options, options)
      element_id = options.delete(:id) || "chart-#{@chartkick_chart_id += 1}"
      height = options.delete(:height) || "300px"
      # content_for: nil must override default
      content_for = options.key?(:content_for) ? options.delete(:content_for) : Nvd3.content_for

      html = (options.delete(:html) || %(<div id="%{id}" style="height: %{height}; text-align: center; color: #999; line-height: %{height}; font-size: 14px; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif;">Loading...</div>)) % {id: ERB::Util.html_escape(element_id), height: ERB::Util.html_escape(height)}

      js = <<JS
<script type="text/javascript">
  new Chartkick.#{klass}(#{element_id.to_json}, #{data_source.respond_to?(:chart_json) ? data_source.chart_json : data_source.to_json}, #{options.to_json});
</script>
JS
      if content_for
        content_for(content_for) { js.respond_to?(:html_safe) ? js.html_safe : js }
      else
        html += js
      end

      html.respond_to?(:html_safe) ? html.html_safe : html
    end

    # https://github.com/rails/rails/blob/master/activesupport/lib/active_support/core_ext/hash/deep_merge.rb
    def nvd3_deep_merge(hash_a, hash_b)
      hash_a = hash_a.dup
      hash_b.each_pair do |k, v|
        tv = hash_a[k]
        hash_a[k] = tv.is_a?(Hash) && v.is_a?(Hash) ? tv.deep_merge(v) : v
      end
      hash_a
    end
  end
end
