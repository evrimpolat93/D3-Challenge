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
