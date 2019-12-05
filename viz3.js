var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var svg = d3.select("body")
    .append("svg")
    .style("cursor", "move");

svg.attr("viewBox", "50 10 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin");

var zoom = d3.zoom()
    .on("zoom", function () {
        var transform = d3.zoomTransform(this);
        map.attr("transform", transform);
    });

svg.call(zoom);

var map = svg.append("g")
    .attr("class", "map");

d3.queue()
    .defer(d3.json, "./data/countries_topo.json")
    .defer(d3.json, "./data/HDI.json")
    .await(function (error, world, data) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
        }
        else {
            // console.log(world)
            drawMap(world, data);
        }
    });

function drawMap(world, data) {
    // geoMercator 
    
    var projection = d3.geoMercator() //d3.geoOrthographic()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    // geoPath projection
    var path = d3.geoPath().projection(projection);

    //colors for population metrics
    var color = d3.scaleThreshold()
        .domain([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.90, 0.95])
        .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);

    var features = topojson.feature(world, world.objects.countries).features;
    
    var populationById = {};
    console.log(data)

    data.forEach(function (d) {
        // console.log(d["Human Development Index (HDI) Female"])
        populationById[d.Country] = {
            "Overall HDI": d["HDI"],
            "Female HDI":  d["Human Development Index (HDI) Female"],
            "Male HDI": d["Human Development Index (HDI) Male"]
        }
    });

    console.log(populationById)

    features.forEach(function (d) {
        d.details = populationById[d.properties.name_long] ? populationById[d.properties.name_long] : {};

    });

    map.append("g")
        .selectAll("path")
        .data(features)
        .enter().append("path")
        .attr("name", function (d) {
            return d.properties.name_long;
        })
        .attr("id", function (d) {
            return d.id;
        })
        .attr("d", path)
        .style("fill", function (d) {
            return d.details && d.details["Overall HDI"] ? color(d.details["Overall HDI"]) : undefined;
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("cursor", "pointer");

            d3.select(".country")
                .text( d.details && d.details["Overall HDI"] &&  d.properties.name_long + "\n" + d.details["Overall HDI"] || "¯\\_(ツ)_/¯");

            d3.select(".females")
                .text(d.details && d.details["Female HDI"] && "Female HDI " + d.details["Female HDI"] || "¯\\_(ツ)_/¯");

            d3.select(".males")
                .text(d.details && d.details["Male HDI"] && "Male HDI " + d.details["Male HDI"] || "¯\\_(ツ)_/¯");

            d3.select('.details')
                .style('visibility', "visible")
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", 0.25);

            d3.select('.details')
                .style('visibility', "hidden");
        });
}