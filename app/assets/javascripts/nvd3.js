(function() {
    'use strict';

    function createGraph(options) {
        return nv.addGraph(createChart);
        function createChart() {
            var chart = nv.models.stackedAreaChart()
                .margin({right: 100})
                .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                //.transitionDuration(500)
                .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                .clipEdge(true);

            //Format x-axis labels with custom function.
            chart.xAxis
                .tickFormat(function(d) {
                    return d3.time.format('%x')(new Date(d))
                });

            chart.yAxis
                .tickFormat(d3.format(',.2f'));

            initd3(options.selector, options.data, chart)

            return chart;
        }
        function initd3(selector, data, chart) {
            var detached;
            if (!selector) {
                detached = document.createElement('div');
                (options.context || document.body).appendChild(detached);
            }
            d3.select(selector || detached)
                .append('svg')
                .datum(data)
                .call(chart);

            nv.utils.windowResize(chart.update);
        }
    }

    function create(options) {
        options = options || {};
        options.context = options.context || document.currentScript.parentNode;
        if(options.url) {
            d3.json(options.url, function(data) {
                options.data = data;
                createGraph(options)
            });
        } else if (options.data) {
            createGraph(options)
        }
    }

    // public API
    return {
        create: create
    };

})();
