// @TODO: YOUR CODE HERE!
// create margin around the chart
var margin = { top: 10, right: 30, bottom: 100, left: 100 };

// svg size
var svgWidth = 800;
var svgHeight = 500;

// chart size
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// append svg object to the body

var svg = d3.select("#scatter").append("svg").attr("width", svgWidth)
    .attr("height", svgHeight)

// create variable to hold svg elements
const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

// default values for x and y axises 
var xkey = "poverty";
var ykey = "healthcare";


// function to put ticks values in x axis with the name of database 
function xAxisScale(journalData, xkey) {
    xScale = d3.scaleLinear()
        .domain([d3.min(journalData, d => d[xkey]) * 0.8
            , d3.max(journalData, d => d[xkey]) * 1.2])
        .range([0, chartWidth])
    return xScale

}

// function to put ticks values in y axis with the name of database 
function yAxisScale(journalData, ykey) {
    yScale = d3.scaleLinear()
        .domain([d3.min(journalData, d => d[ykey]) * 0.8,
        d3.max(journalData, d => d[ykey]) * 1.2])
        .range([chartHeight, 0])
    return yScale
}

// to locate ticks for x axis in bottom
function xRenderAxes(xNewScale, xAxis) {
    var bottomAxis = d3.axisBottom(xNewScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;

// to locate ticks for y axis in left
function yRenderAxes(yNewScale, yAxis) {
    var leftAxis = d3.axisLeft(yNewScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

