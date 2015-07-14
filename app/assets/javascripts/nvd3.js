window.nvd3 = (function() {
    'use strict';

    var FORMAT = {
        DATE: function(d) {return d3.time.format('%x')(new Date(d));},
        TWO_STEPS: d3.format(',.2f')
    };

    var TYPE = {
        AREA_CHART: 0,
        LINE_CHART: 1
    };

    var defaultOptions = {
        type: TYPE.AREA_CHART,
        xAxis: FORMAT.DATE,
        yAxis: FORMAT.TWO_STEPS
    };

    function createGraph(options) {
        var createChart = function createChart() {
            var chart = nv.models.stackedAreaChart()
                .margin({right: 100})
                .x(function(d) { return d[0] })   //We can modify the data accessor functions...
                .y(function(d) { return d[1] })   //...in case your data is formatted differently.
                .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
                .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
                //.transitionDuration(500)
                .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                .clipEdge(true);

            if (options.xAxis) chart.xAxis.tickFormat(options.xAxis);
            if (options.yAxis) chart.yAxis.tickFormat(options.yAxis);

            initd3(options.selector, options.data, chart);

            return chart;
        };
        var initd3 = function initd3(selector, data, chart) {
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
        };
        return nv.addGraph(createChart);
    }

    function create(options) {
        options = merge(options, defaultOptions);
        options.context = options.context || document.currentScript.parentNode;
        if(options.url) {
            d3.json(options.url, function(data) {
                options.data = data;
                createGraph(options);
            });
        } else if (options.data) {
            createGraph(options);
        }
    }

    // public API
    return {
        create: create
    };

    // (private) helpers
    function isArray(variable) {
        return Object.prototype.toString.call(variable) === "[object Array]";
    }

    function isFunction(variable) {
        return variable instanceof Function;
    }

    function isPlainObject(variable) {
        return !isFunction(variable) && variable instanceof Object;
    }

    function extend(target, source) {
        var key;
        for (key in source) {
            if (isPlainObject(source[key]) || isArray(source[key])) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                extend(target[key], source[key]);
            } else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }

    function merge(obj1, obj2) {
        var target = {};
        extend(target, obj1);
        extend(target, obj2);
        return target;
    }

})();
