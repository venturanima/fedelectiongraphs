d3.csv("preprocessed-data/donsByDate.csv", function handleCSV(csv) {
  // select revenues of CA companies
  
  var data = csv;
  
  var amts = data.map(function(el){return parseInt(el.contb_receipt_amt)});
  var w = 310,
      h = 500,
      p = 40;

  var vis = d3.select("div #donsByDate")
              .append("svg")
              .attr("width", w + p * 2)
              .attr("height", h + p * 2)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");
      
  var timeFormat = d3.time.format("%d-%b-%y"),
      utcFormat = d3.time.format.utc("%d-%b-%y");
  //+ turns the date object into milliseconds since unix epoch
  var datesMilli = data.map(function(el){return +timeFormat.parse(el.contb_receipt_dt)});
  //list of date objects
  var dates = data.map(function(el){return timeFormat.parse(el.contb_receipt_dt)});
  data = data.sort(function(d1,d2){return timeFormat.parse(d1.contb_receipt_dt)-timeFormat.parse(d2.contb_receipt_dt)})
  // console.log(data);
  //axes
  var xScale = d3.scale.linear()
                .domain([d3.min(dates),d3.max(dates)])
                .range([0,w]),
      yScale = d3.scale.linear()
                .domain([d3.min(amts),d3.max(amts)])
                .range([h,0]);
                
  // var line = d3.svg.line()
                // .x(function(d){return xScale(timeFormat.parse(d.contb_receipt_dt))})
                // .y(function(d){return yScale(d.contb_receipt_amt)});
    // vis.selectAll("path")
       // .data(data)
       // .enter().append("path")
       // .attr("d", line(data));
       
       //data is still unsorted by time
       var line = d3.svg.line()
                .x(function(d){return xScale(timeFormat.parse(d.contb_receipt_dt))})
                .y(function(d){return yScale(d.contb_receipt_amt)});
                // .interpolate("cardinal");
    // vis.selectAll("path")
       // .data(data)
       // .enter()
        // .append("path")
            // .attr("d", line(data))
            // .attr("fill","none");
            
    d3.select("div#donsByDate")
        .append("text")
        .attr("id","tip")
        .text("0 people donated on DD-MMM-YY");
        
    vis.selectAll("circle")
       .data(data)
       .enter()
        .append("circle")
            .attr("cx", function(d){return xScale(timeFormat.parse(d.contb_receipt_dt))})
            .attr("cy",function(d){return yScale(d.contb_receipt_amt)})
            .attr("r", 3)
            .on("mouseover", function(d,i){
                                        d3.select(this)
                                            .style("fill","red");
                                        d3.select("div#donsByDate").select("#tip").remove();
                                        d3.select("div#donsByDate")
                                            .append("text")
                                            .attr("id","tip")
                                            .text(d3.format(",f")(d.contb_receipt_amt) + " people donated on " + d.contb_receipt_dt);
                                    })
            .on("mouseout", function(d,i){
                                        d3.select(this).style("fill","black");
                        })
            ;
  // vis.selectAll("rect")
     // .data(data)
     // .enter()
     // .append("rect")
     // .attr("x", 0)
     // .attr("y", function(d){
                    // return y(d.contbr_st)})
     // .attr("width", function(d) { return x(d.contb_receipt_amt); })
     // .attr("height", function(d) { return 10; })
      
      
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];            
  var xAxis = d3.svg
                .axis()
                .scale(xScale)
                .ticks(5)
                .tickFormat(function(d){return monthNames[new Date(d).getMonth()]}),
      yAxis = d3.svg
                .axis()
                .scale(yScale)
                .orient("left")
                .ticks(5)
                .tickPadding(5);
  vis.append("g")
    .attr("class", "x")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);
  vis.append("g")
    .attr("class", "y")
    .call(yAxis); 
});