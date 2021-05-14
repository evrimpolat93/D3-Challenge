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

// create varible to hold svg elements
const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

// defulat values for x and y axises 
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
}
// to locate ticks for y axis in left
function yRenderAxes(yNewScale, yAxis) {
    var leftAxis = d3.axisLeft(yNewScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// update cx values in the circle 
function xRenderCircle(circleGroup, xNewScale, xkey) {
    circleGroup.transition()
        .attr("cx", d => xNewScale(d[xkey]))
    return circleGroup

}
// update cy values in the circle 
function yRenderCircle(circleGroup, yNewScale, ykey) {
    circleGroup.transition()
        .attr("cy", d => yNewScale(d[ykey]))
    return circleGroup

}

// update x values in the text 
function xRenderTextCircle(textGroup, xNewScale, xkey) {
    textGroup.transition()
        .attr("x", d => xNewScale(d[xkey]))
    return textGroup

}

// update y values in the text 
function yRenderTextCircle(textGroup, yNewScale, ykey) {
    textGroup.transition()
        .attr("y", d => yNewScale(d[ykey]))
    return textGroup
}

// tooltip function to update citcle group with new one
function xUpdateToolTip(xkey, circleGroup) {


    var toolTip = d3.tip()
        // class from css
        .attr("class", "d3-tip")
        // how the toolTip far from the circle
        .offset([80, -60])
        .html(function (d) {
            newText = `${d.state} <br> ${xkey}: ${d[xkey]}<br> ${ykey}: ${d[ykey]}`
            return (newText)
        });
    circleGroup.call(toolTip)
    // function return to the event listner mouseover
    circleGroup.on("mouseover", function (data) {
        toolTip.show(data,this)
    })
        // onmouseout event
        .on("mouseout", function (data,index) {
            toolTip.hide(data);
        });
    return circleGroup;
}
// update ykey in tooltip 
function yUpdateToolTip(ykey, circleGroup) {


    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            newText = `${d.state} <br> ${xkey}: ${d[xkey]}<br> ${ykey}:  ${d[ykey]}`
            return (newText)
        });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function (data) {
        toolTip.show(data,this)
    })
        // onmouseout event
        .on("mouseout", function (data,index) {
            toolTip.hide(data);
        });
    return circleGroup;
}

// load the csv using d3 then create funtion has the data 
d3.csv("assets/data/data.csv").then(function (journalData) {
    // if (err) throw (err);
    console.log("data", journalData)

    // converts number from string to float
    journalData.forEach(function (data) {
        data.poverty = parseFloat(data.poverty)
        data.age = parseFloat(data.age)
        data.income = +data.income
        data.healthcare = parseFloat(data.healthcare)
        data.smokes = parseFloat(data.smokes)
        data.obesity = +data.obesity
        // console.log(data.poverty)


    })
    // return value in varible name 
    var xLinear = xAxisScale(journalData, xkey)
    var yLinear = yAxisScale(journalData, ykey)

    var bottomAxis = d3.axisBottom(xLinear);
    var leftAxis = d3.axisLeft(yLinear)

    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    var circleGroup = chartGroup.append("g").selectAll(".stateCircle")
        .data(journalData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinear(d[xkey]))
        .attr("cy", d => yLinear(d[ykey]))
        .attr("r", 10);

    var textGroup = chartGroup.append("g").selectAll(".stateText")
        .data(journalData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinear(d[xkey]))
        .attr("y", d => yLinear(d[ykey]))
        .text(d => d.abbr);

    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    // x axis title
    povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "active")
        .attr("value", "poverty") // value to grab for event listener
        .text("In Poverty %");

    ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("class", "inactive")
        .attr("value", "age") // value to grab for event listener
        .text("Age (Median)");

    incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("class", "inactive")
        .attr("value", "income") // value to grab for event listener
        .text("Houshold Income (Median)");
    // create group for y axis  labels 
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${(chartHeight / 2)}, ${0 - margin.left})`)
        // .attr("x", 0 - (chartHeight / 2))
        // .attr("y", 0 - margin.left +20)

        .attr("transform", "rotate(-90)")


    healthcareLabel = yLabelsGroup.append("text")
        .attr("x", -150)
        .attr("y", -30)
        .attr("class", "active")
        .attr("value", "healthcare")
        .text("Lack Healthcare %");

    smokesLabel = yLabelsGroup.append("text")
        .attr("x", -160)
        .attr("y", -50)
        .attr("class", "inactive")
        .attr("value", "smokes")
        .text("Smokes %");

    obesityLabel = yLabelsGroup.append("text")
        .attr("x", -160)
        .attr("y", -70)
        .attr("class", "inactive")
        .attr("value", "obesity")
        .text("Obese %");



    // updateToolTip function above csv import
    var textGroup = xUpdateToolTip(xkey, textGroup);
    var textGroup = yUpdateToolTip(ykey, textGroup);
    var circleGroup = xUpdateToolTip(xkey, circleGroup);
    var circleGroup = yUpdateToolTip(ykey, circleGroup);


    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            console.log(value)
            if (value !== xkey) {

                // replaces chosenXAxis with value
                xkey = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xAxisScale(journalData, xkey)

                // updates x axis with transition
                xAxis = xRenderAxes(xLinearScale, xAxis)

                // updates circles with new x values
                circleGroup = xRenderCircle(circleGroup, xLinearScale, xkey);

                // update texts with new x value 
                textGroup = xRenderTextCircle(textGroup, xLinearScale, xkey)

                // updates tooltips with new info
                circleGroup = xUpdateToolTip(xkey, circleGroup);

                // changes classes to change bold text
                if (xkey === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (xkey === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false)

                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);


                }

            }
        })
    yLabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== ykey) {

                // replaces chosenXAxis with value
                ykey = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yAxisScale(journalData, ykey)

                // updates x axis with transition
                yAxis = yRenderAxes(yLinearScale, yAxis)

                // updates circles with new x values
                circleGroup = yRenderCircle(circleGroup, yLinearScale, ykey)

                textGroup = yRenderTextCircle(textGroup, yLinearScale, ykey)


                // updates tooltips with new info
                circleGroup = yUpdateToolTip(ykey, circleGroup);


                // changes classes to change bold text
                if (ykey === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (ykey === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false)

                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

            }

        });



}).catch(function (error) {
    console.log(error);











})
