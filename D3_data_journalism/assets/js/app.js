// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("scatter");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  // Define SVG area dimensions
  var svgWidth = 800;
  var svgHeight = 500;

  // Define the chart's margins as an object
  var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - margin.left - margin.right;
  var chartHeight = svgHeight - margin.top - margin.bottom;

  // Select body, append SVG area to it, and set its dimensions
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append a group area, then set its margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // // Configure a parseTime function which will return a new Date object from a string
  // var parseTime = d3.timeParse("%B");

  // Load data from miles-walked-this-month.csv
  d3.csv("assets/data/data.csv").then(function(data) {

    // Print the milesData
    console.log(data);

    // Format the date and cast the miles value to a number
    data.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.healthcare = +data.healthcare;
      data.poverty= +data.poverty;
      
      // console.log(data.age);
      // console.log(data.smokes);
    });

    // Configure a time scale with a range between 0 and the chartWidth
    // Set the domain for the xTimeScale function
    // d3.extent returns the an array containing the min and max values for the property specified
    var xTimeScale = d3.scaleLinear()
      .range([0, chartWidth])
      .domain([29, d3.max(data, data => data.age)]);

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var yLinearScale = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, data => data.smokes)]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // // Configure a drawLine function which will use our scales to plot the line's points
    // var drawLine = d3
    //   .line()
    //   .x(data => xTimeScale(data.age))
    //   .y(data => yLinearScale(data.smokes));

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "red ")
    .attr("stroke-width", ".5")
    .attr("stroke", "blue")
    .style("fill", "#69b3a2")
    .attr("fill", "rgb(117, 145, 197)")
    // .text(data.abbr) 
    .attr("opacity", "0.5");

    // // Add state labels to the points
    // var circleLabels = chartGroup.data(data).enter();

    // circleLabels.append("text")
    // .attr("x", function(d) { return d.smokes; })
    // .attr("y", function(d) { return d.age; })
    // .text(function(d) { return d.abbr; })
    // .attr("font-family", "sans-serif")
    // .attr("font-size", "100px")
    // // .attr("fill", "white");
    
    // WHAT I ADDED; I USED THE CODE ABOVE FOR THE CIRCLES, BUT CHANGED IT FOR TEXT
    // LINE 106 AND 107, "dx" and "dy" ARE VERY IMPORTANT
    var textGroup = chartGroup.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("dx", d => xTimeScale(d.age))
    .attr("dy", d => yLinearScale(d.smokes))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "black")
    .attr("text-anchor","middle");

    // // Create axes labels
    // chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left + 40)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .attr("class", "axisText")
    // .style("text-anchor", "middle")
    // .text("Smokes (%)");
  
    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //   .attr("class", "axisText")
    //   .style("text-anchor", "middle")
    //   .text("Ages (%)");

    // Append an SVG group element to the SVG area, create the left axis inside of it
    chartGroup.append("g")
      .classed("axis", true)
      .call(leftAxis);

    // Append an SVG group element to the SVG area, create the bottom axis inside of it
    // Translate the bottom axis to the bottom of the page
    chartGroup.append("g")
      .classed("axis", true)
      .attr("transform", "translate(0, " + chartHeight + ")")
      .call(bottomAxis);
    
    // Initialize tooltip
    var toolTip = d3.tip() 
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return  `${d.state}<br>Smoke: ${d.smokes}<br>Age: ${d.age}<br>`; 
    });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    }).catch(function(error) {
      console.log(error);
  });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
  

