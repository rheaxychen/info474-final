// Modified from amazing Youtube Tutorial https://www.youtube.com/watch?v=045-bsOsbJc

var dataHDI = 'no data';
var dataCountries = 'no data';

var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var svg = d3.select("body")
    .append("svg")
    .style("cursor", "move");

svg.attr("viewBox", "50 10 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin");

var map = svg.append("g")
    .attr("class", "map");

var zoom = d3.zoom()
    .on("zoom", function () {
        var transform = d3.zoomTransform(this);
        map.attr("transform", transform);
    });

var g = svg.append('g');

svg.call(zoom);

// d3.json("../../data/HDI.json", function(jsondata){
//         dataHDI = jsondata
//         //drawMap();
// })
// console.log(dataHDI);

var populationById = {};

d3.json("../../data/countries.json", function(d) {
        // console.log(d);
        d.features.forEach(function (p) {
            console.log(p.geometry);x
            populationById[p.Country] = {
                total: +d.total,
                females: +d.females,
                males: +d.males
            }
        });
        var geoProj = d3.geoMercator()
            .scale(150)
            .rotate([0, 0])
            .center([0, 42.313])
            .translate([width/2, height/2]);
        
        var geoPath = d3.geoPath()
            .projection(geoProj);
        
        g.selectAll('path')
            .data(d.features)
            .enter()
            .append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath);
        
        d3.json("../../data/HDI.json", function (d) {
            console.log(d[0].Country)
            console.log(d[0].HDI)
            g.selectAll('circle')
                .data(d.Country)
                // .enter()
                // .append('path')
                // .attr('fill', 'red')
                // .attr('stroke', '#999')
                // .attr('d', geoPath)
        })

        
    })

// function drawMap() {

//     // geoMercator projection
//     var projection = d3.geoMercator() //d3.geoOrthographic()
//         .scale(130)
//         .translate([width / 2, height / 1.5]);

//     // geoPath projection
//     var path = d3.geoPath().projection(projection);

//     //colors for population metrics
//     var color = d3.scaleThreshold()
//         .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
//         .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);

//     // var features = topojson.feature(dataHDI, dataCountries).features;
//     // //console.log(features);
//     // var populationById = {};

//     console.log(dataCountries)

//     // dataCountries.forEach(function (d) {
//     //     console.log(d);
//     //     populationById[d.Country] = {
//     //         total: +d.total,
//     //         females: +d.females,
//     //         males: +d.males
//     //     }
//     // });
//     // features.forEach(function (d) {
//     //     d.details = populationById[d.properties.name] ? populationById[d.properties.name] : {};
//     // });

//     // map.append("g")
//     //     .selectAll("path")
//     //     .data(features)
//     //     .enter().append("path")
//     //     .attr("name", function (d) {
//     //         return d.properties.name;
//     //     })
//     //     .attr("id", function (d) {
//     //         return d.id;
//     //     })
//     //     .attr("d", path)
//     //     .style("fill", function (d) {
//     //         return d.details && d.details.total ? color(d.details.total) : undefined;
//     //     })
//     //     .on('mouseover', function (d) {
//     //         d3.select(this)
//     //             .style("stroke", "white")
//     //             .style("stroke-width", 1)
//     //             .style("cursor", "pointer");

//     //         d3.select(".country")
//     //             .text(d.properties.name);

//     //         d3.select(".females")
//     //             .text(d.details && d.details.females && "Female " + d.details.females || "¯\\_(ツ)_/¯");

//     //         d3.select(".males")
//     //             .text(d.details && d.details.males && "Male " + d.details.males || "¯\\_(ツ)_/¯");

//     //         d3.select('.details')
//     //             .style('visibility', "visible")
//     //     })
//     //     .on('mouseout', function (d) {
//     //         d3.select(this)
//     //             .style("stroke", null)
//     //             .style("stroke-width", 0.25);

//     //         d3.select('.details')
//     //             .style('visibility', "hidden");
//     //     });
//     }