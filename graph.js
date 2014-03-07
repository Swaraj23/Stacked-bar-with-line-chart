var margin = {top: 20, right: 20, bottom: 30, left: 35},
    width = 690 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .45);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#58585b","#00adef"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#charts").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { if(key != "cost") return key !== "key"; }));
  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) 
	{
		return {name: name, y0: y0, y1: y0 += +d[name]}; 
	});
    d.total = d.ages[d.ages.length - 1].y1;
	 d.cost = +d.cost; 
  });

  x.domain(data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width",45)
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });
	  
   var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + parseInt((i*100)-70)  + ",-18)"; });
   legend.append("rect")
      .attr("x", width - 103)
	  .attr("y",0)
      .attr("width", 6)
      .attr("height", 6)
      .style("fill", color);

   legend.append("text")
      .attr("x", width - 90)
      .attr("y", 3)
      .attr("dy", ".35em")
	  .style("font","0.75em HelveticaNeue")
	  .style("fill","#939597")
      .text(function(d) { return d; });
   

//Appending Line On Svg
	
var x1 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 1, 0.7);

var y1 = d3.scale.linear()
    .range([height, 0]);

var xAxis1 = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

var yAxis1 = d3.svg.axis()
    .scale(y1)
    .orient("right")
    .tickFormat(d3.format("3"));;

var line1 = d3.svg.line()
    .x(function(d) { return x1(d.key); })
    .y(function(d) { return y1(d.cost); });

  x1.domain(data.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return d.cost; })]);


  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ width +",0)")
      .call(yAxis1);
	  
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line1);

  svg.selectAll("scatter-dots")
  				.data(data)
  				.enter().append("svg:circle")
  				.attr("r", 3.5)
  				.attr("cx", function(d) { return x1(d.key); })   
  				.attr("cy", function(d) { return y1(d.cost); })
  				.attr("fill", "#d44a4c")
  				.attr("stroke", "#bcbec0");
      
	  
  var Legend1 = svg.selectAll('.legend1')
        .attr("transform", "translate(" + (width - 30) + ",0)")
        .data("Cost")
        .enter()
        .append('g')
        .attr('class', 'legend1');
	
	Legend1.append('line')
	     .attr('x1', width - 264)
	     .attr('x2', width - 248)
	     .attr('y1', -15)
	     .attr('y2', -15)
  		.attr("stroke", "#bcbec0");

    Legend1.append('circle')
        .attr('r', 3)
        .attr('cx', width - 256)
        .attr('cy',  -15)
		.attr("fill", "#d44a4c")
  		.attr("stroke", "#bcbec0");
	
    Legend1.append('text')
        .attr('x', width-244)
        .attr('y', -15)
      .attr("dy", ".35em")
	  .style("font","300 0.75em HelveticaNeue")
	  .style("fill","#939597")
        .text("Cost Per Call");
});
