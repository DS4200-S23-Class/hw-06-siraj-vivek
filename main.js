// establishing constants for frame and graph sizes
const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 400; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const GRAPH_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const GRAPH_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// frame 1 for scatter plot on left
const SCATTER1_FRAME = d3.select("#scatter_01") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// frame 2 for scatter plot on in middle
const SCATTER2_FRAME = d3.select("#scatter_02") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");

// frame 1 for bar plot on right
const BAR_FRAME = d3.select("#bar_plot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");
//read in data 
d3.csv("data/iris.csv").then((data) => {

  const MAX_X_LENGTH = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
  const MAX_Y_LENGTH = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

// creates scale for data 
  const X_SCALE_LENGTH = d3.scaleLinear() 
                           .domain([0, (MAX_X_LENGTH + 1)]) 
                           .range([0, GRAPH_WIDTH]); 


  const Y_SCALE_LENGTH = d3.scaleLinear() 
                           .domain([0, (MAX_Y_LENGTH + 1)])  
                           .range([GRAPH_HEIGHT, 0]); 

  let scatter1 = SCATTER1_FRAME.selectAll("points") 
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "scatter")
        .attr("cx", (d) => { return (X_SCALE_LENGTH(d.Sepal_Length) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE_LENGTH(d.Petal_Length) + MARGINS.bottom); })
        .attr("r", 4)
        .attr("fill", function (d) {
          if(d.Species === "setosa") {
            return "#00BA38" 
          } else if (d.Species === "versicolor") {
            return "#F8766D"
          } else {
            return "#619CFF"
          }
        });

  // Add x and y axis to vis
  SCATTER1_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_LENGTH).ticks(10)) 
          .attr("font-size", '10px'); 

  SCATTER1_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.bottom + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE_LENGTH).ticks(10)) 
          .attr("font-size", '10px'); 

//establishes max values
  const MAX_X_WIDTH = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
  const MAX_Y_WIDTH = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

//establishes x and y scales using the maxes
  const X_SCALE_WIDTH = d3.scaleLinear() 
                          .domain([0, (MAX_X_WIDTH + 1)]) // add some padding  
                          .range([0, GRAPH_WIDTH]); 

  const Y_SCALE_WIDTH = d3.scaleLinear() 
                          .domain([0, (MAX_Y_WIDTH + 1)]) // add some padding  
                          .range([GRAPH_HEIGHT, 0]); 

  // actually creating the points
  let scatter2 = SCATTER2_FRAME.selectAll("points") 
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "scatter")
        .attr("cx", (d) => { return (X_SCALE_WIDTH(d.Sepal_Width) + MARGINS.left); })
        .attr("cy", (d) => { return (Y_SCALE_WIDTH(d.Petal_Width) + MARGINS.bottom); })
        .attr("r", 4)
        .attr("fill", function (d) {
          if(d.Species === "setosa") {
            return "#00BA38"
          } else if (d.Species === "versicolor") {
            return "#F8766D"
          } else {
            return "#99ccff"
          }
        });

  // Add x and y axis to vis
  SCATTER2_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE_WIDTH).ticks(10)) 
          .attr("font-size", '10px'); 

  SCATTER2_FRAME.append("g") 
        .attr("transform", "translate(" + MARGINS.bottom + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE_WIDTH).ticks(10)) 
          .attr("font-size", '10px'); 



    // creates scale functions 
    const X_SCALE_SPECIES = d3.scaleBand()   
                              .range([0, GRAPH_WIDTH])
                              .domain(data.map((d) => { return d.Species; }))
                              .padding(0.2); 

    const Y_SCALE_SPECIES = d3.scaleLinear()
                              .domain([0, 60])
                              .range([GRAPH_HEIGHT, 0]);

    // plot the bars with correct scales
    let bars = BAR_FRAME.selectAll("bars")  
        .data(data) // passed from .then  
        .enter()       
        .append("rect")
          .attr("class", "bar")  
          .attr("x", (d) => { return (X_SCALE_SPECIES(d.Species) + MARGINS.left); }) 
          .attr("y", 100) 
          .attr("width", X_SCALE_SPECIES.bandwidth())
          .attr("height", 250)
          .attr("fill", function (d) {
            if(d.Species === "setosa") {
            return "#00BA38"
          } else if (d.Species === "versicolor") {
            return "#F8766D"
          } else {
            return "#619CFF"
          }
          });

    // Add x and y axis to bar
    BAR_FRAME.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (GRAPH_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE_SPECIES).ticks(3)) 
            .attr("font-size", '10px'); 

    BAR_FRAME.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + 
                "," + (MARGINS.top) + ")") 
          .call(d3.axisLeft(Y_SCALE_SPECIES).ticks(12)) 
            .attr("font-size", '10px'); 

//adds brush to 2nd scatter plot
  SCATTER2_FRAME.call(d3.brush()                 
        .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]])
        .on("start brush", check_selection)
      );

  function check_selection(event) {
    let coords = event.selection;
    
    // applies new style to selection
    scatter1.classed("selected", function(d){ return isHighlighted(coords, (X_SCALE_WIDTH(d.Sepal_Width)+MARGINS.left), (Y_SCALE_WIDTH(d.Petal_Width)+MARGINS.bottom)) });
    scatter2.classed("selected", function(d){ return isHighlighted(coords, (X_SCALE_WIDTH(d.Sepal_Width)+MARGINS.left), (Y_SCALE_WIDTH(d.Petal_Width)+MARGINS.bottom)) });
    bars.classed("selected", function(d){ return isHighlighted(coords, (X_SCALE_WIDTH(d.Sepal_Width)+MARGINS.left), (Y_SCALE_WIDTH(d.Petal_Width)+MARGINS.bottom)) });
  }

  // check whether a point is in the selection or not
  function isHighlighted(coords, cx, cy) {
    let x0 = coords[0][0],
        x1 = coords[1][0],
        y0 = coords[0][1],
        y1 = coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }

});