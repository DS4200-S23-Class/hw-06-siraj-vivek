// <-- ************ GLOBAL CONSTANTS ************ -->
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const GRAPH_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const GRAPH_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// color generics
const COLOR = d3.scaleOrdinal()
                   .domain(["setosa", "versicolor", "virginica" ])
                   .range([ "#00BA38", "#F8766D", "#619CFF"]);



// <-- ************ SCATTER PLOT 1: Petal_Length vs Sepal_Length ************ -->
const SCATTER_01 = d3.select("#scatter-1")
                  .append("svg")
                  .attr("width", FRAME_WIDTH)
                  .attr("height", FRAME_HEIGHT)
                  .attr("class", "frame");

d3.csv("data/iris.csv").then((data) => { 

	// MAXIMUM X AND Y VALUEs
  const XMAX_01 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
  const YMAX_01 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

  // LINEAR SCALE TO MAP X AND Y VALS TO PIXELS
  const X_SCALE_01 = d3.scaleLinear() 
                    .domain([0, (XMAX_01 + 3)])
                    .range([0, GRAPH_WIDTH]);

  const Y_SCALE_01 = d3.scaleLinear() 
                    .domain([0, (YMAX_01 + 3)])
                    .range([GRAPH_HEIGHT, 0]);

  // PLOT POINTS
  SCATTER_01.selectAll("points") 
  let scatterPts01 = SCATTER_01.append("g")
  		.selectAll("points")  
      .data(data) // Passed from .then  
      .enter()       
      .append("circle")
      	    .attr("id", (d) => { return ("(" + d.Sepal_Length + ", " + d.Petal_Length + ")"); })
      	    .attr("cx", (d) => { return (X_SCALE_01(d.Sepal_Length) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE_01(d.Petal_Length) + MARGINS.top); }) 
            .attr("r", 5)
            .attr("fill", (d) => { return COLOR(d.Species); })
            .style("opacity", 0.5);

  // APPEND X and Y AXES  
  SCATTER_01.append("g") 
        .attr("transform", "translate(" + MARGINS.left + "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_01).ticks(9)) 
        .attr("font-size", "10px");

  SCATTER_01.append("g") 
        .attr("transform", "translate(" + MARGINS.top + "," + MARGINS.left + ")") 
        .call(d3.axisLeft(Y_SCALE_01).ticks(16)) 
        .attr("font-size", "10px");


// <-- ************ SCATTER PLOT 2: Petal_Width vs Sepal_Width ************ -->

  const SCATTER_02 = d3.select("#scatter-2")
                  .append("svg")
                  .attr("width", FRAME_WIDTH)
                  .attr("height", FRAME_HEIGHT)
                  .attr("class", "frame");

  // MAXIMUM X AND Y VALUEs
  const XMAX_02 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
  const YMAX_02 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

  // LINEAR SCALE TO MAP X AND Y VALS TO PIXELS
  const X_SCALE_02 = d3.scaleLinear() 
                    .domain([0, (XMAX_02 + 1)]) // Add some padding  
                    .range([0, GRAPH_WIDTH]);
  const Y_SCALE_02 = d3.scaleLinear() 
                    .domain([0, (YMAX_02 + 1)]) // Add some padding  
                    .range([GRAPH_HEIGHT, 0]);

  // PLOT POINTS
  SCATTER_02.selectAll("points") 
  let scatterPts02 = SCATTER_02.append("g")
  	.selectAll("points")
      .data(data) // Passed from .then  
      .enter()       
	    .append("circle")
	    .attr("id", (d) => { return ("(" + d.Sepal_Width + ", " + d.Petal_Width + ")"); })
	    .attr("cx", (d) => { return (X_SCALE_02(d.Sepal_Width) + MARGINS.left); }) 
	    .attr("cy", (d) => { return (Y_SCALE_02(d.Petal_Width) + MARGINS.top); }) 
	    .attr("r", 5)
	    .attr("fill", (d) => { return COLOR(d.Species); })
	    .style("opacity", 0.5);

  // ADD X and Y AXES 
  SCATTER_02.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_02).ticks(10)) 
          .attr("font-size", "10px");

  SCATTER_02.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + MARGINS.left + ")") 
        .call(d3.axisLeft(Y_SCALE_02).ticks(15)) 
          .attr("font-size", "10px");

  // ~~~~~~~~~ BRUSHING ~~~~~~~~~~~
  SCATTER_02.call( d3.brush()
          .extent( [ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ] )
          .on("start brush", brushTrigger)
        );

  // CHECK IF A DATA POINT IS HIGHLIGHTED
  function isHighlighted(coords, cx, cy) {
    let x0 = coords[0][0],
        x1 = coords[1][0],
        y0 = coords[0][1],
        y1 = coords[1][1];
        x0 <= cx;

    return x0 && cx <= x1 && y0 <= cy && cy <= y1;
  }

  // HIGHLIGHT IF BRUSH IS TRIGGERED
  function brushTrigger(event) {
    extent = event.selection;

    // CONNECTOR BETWEEN CHART AND BRUSH
    scatterPts02.classed("selected", function(d) { 
      return isHighlighted(extent, (X_SCALE_02(d.Sepal_Width) + MARGINS.left), (Y_SCALE_02(d.Petal_Width) + MARGINS.top))});
    scatterPts01.classed("selected", function(d) { 
      return isHighlighted(extent, (X_SCALE_02(d.Sepal_Width) + MARGINS.left), (Y_SCALE_02(d.Petal_Width) + MARGINS.top))});
    barPlot.classed("selected", function(d) { 
      return isHighlighted(extent, (X_SCALE_02(d.Sepal_Width) + MARGINS.left), (Y_SCALE_02(d.Petal_Width) + MARGINS.top))});
  }

  /*-------------------------------- BAR PLOT --------------------------------*/
  const BAR = d3.select('.bar')
  .attr("class", "bar-chart")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH);

// scales the data properly
const BAR_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const BAR_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const bar_data = [{"Species": "virginica", 'Count': 50},
                  {"Species": "versicolor", 'Count': 50},
                  {"Species": "setosa", 'Count': 50}]


const xScaleBar = d3.scaleBand().range([0, BAR_WIDTH]).padding(0.2);
const yScaleBar = d3.scaleLinear().range([BAR_HEIGHT, 0]);

xScaleBar.domain(bar_data.map((d) => {
  return d.Species
}));
yScaleBar.domain([0, d3.max(bar_data, (d) => {
  return d.Count
}) + 10])
// creates the actual bars

let bars = BAR.selectAll("bars")
  .data(bar_data)
  .enter()
  .append("rect")
  .attr("class", (d) => {
      return d.Species
  })
  .attr("x", (d) => {
      return (xScaleBar(d.Species) + MARGINS.left)
  })
  .attr("y", (d) => {
      return ( MARGINS.left + yScaleBar(d.Count))
  })
  .attr("width", xScaleBar.bandwidth())
  .attr("height", (d) => {
      return BAR_HEIGHT - yScaleBar(d.Count)
  });

BAR.append("g")
  .attr("transform", "translate(" + MARGINS.top + "," +
      (BAR_HEIGHT + MARGINS.top) + ")")
  .call(d3.axisBottom(xScaleBar).ticks(11))
  .attr("font-size", "15px");

BAR.append("g")
  .attr("transform", "translate(" +
      (MARGINS.left) + "," + (MARGINS.top) + ")")
  .call(d3.axisLeft(yScaleBar).ticks(11))
  .attr("font-size", "15px");

});




