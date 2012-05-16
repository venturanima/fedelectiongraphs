d3.csv("preprocessed-data/donsBySize.csv", function handleCSV(csv) {
  var small = csv.map(function(el) { 
                          return parseInt(el.small) });
  var large = csv.map(function(el) { 
                          return parseInt(el.large) });
  
  var demoData = [small[0], large[0]]
  var repubData = [small[1], large[1]]
  // console.log(data)
  
  var w = 235,
      h = 500,
      p = 45,
      // x = d3.scale.linear()
                  // .domain([0, d3.max(data) * 1.01])
                  // .range([0, w]),
      // y = d3.scale.ordinal()
                  // .domain(parties)
                  // .range([h/4,3*h/4]);
      x = d3.scale.ordinal()
            .domain(["Under $75", "Over $75"])
            .range([0,w/4]),
      y = d3.scale.linear()
            .domain([0,d3.max(large)*1.01])
            .range([h,0])

  var vis = d3.select("div #donsBySize")
              .append("svg")
              .attr("width", w + p * 2)
              .attr("height", h + p * 2)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");


  var xAxis = d3.svg
                .axis()
                .scale(x);

  var yAxis = d3.svg
                .axis()
                .scale(y)
                .orient("left"); 
  // x axis
  vis.append("g")
    .attr("class", "x")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);
  // y axis
  vis.append("g")
    .attr("class", "y")
    .call(yAxis);

    d3.select("div#donsBySize g.x")
      .append("text")
      .attr("id","tip")
      .attr("x",w/4)
      .attr("y",-h-5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12")
      .text("Democrat")
  vis.selectAll("rect")
     .data(demoData)
     .enter()
     .append("rect")
     .attr("x", x)
     .attr("y", y)
     .attr("width", w/4)
     .attr("height", function(d){return h-y(d)})
     .style("fill", "blue")
     .on("mouseover", function(d,i){vis.selectAll("rect")
                                       .transition()
                                       .duration(500)
                                          .style("fill", "red")
                                          .attr("y", function(d,i){return y(repubData[i])})
                                          .attr("height", function(d,i){return h-y(repubData[i])});
                                    d3.select("g.x #tip").remove(); 
                                    d3.select("div#donsBySize g.x")
                                      .append("text")
                                      .attr("id","tip")
                                      .attr("x",w/4)
                                      .attr("y",-h-5)
                                      .attr("text-anchor", "middle")
                                      .attr("font-size", "12")
                                      .text("Republican");
                                      })
     .on("mouseout", function(d,i){vis.selectAll("rect")
                                       .transition()
                                       .duration(1000)
                                          .style("fill", "blue")
                                          .attr("y", y)
                                          .attr("height", function(d){return h-y(d)});
                                    d3.select("g.x #tip").remove(); 
                                    d3.select("div#donsBySize g.x")
                                      .append("text")
                                      .attr("id","tip")
                                      .attr("x",w/4)
                                      .attr("y",-h-5)
                                      .attr("text-anchor", "middle")
                                      .attr("font-size", "12")
                                      .text("Democrat");
     });
     // .transition()
     // .duration(3000)
     // .delay(3000)
        // .style("fill", "green")
        // .attr("y", function(d,i){return y(large[i])})
        // .attr("height", function(d,i){return h-y(large[i])})
     // ;
     // .on("mouseover", function(d, i){d3.select("div#donsBySize g.x")
                                        // .append("text")
                                        // .attr("id", "tip")
                                        // .attr("x", x(d)+5)
                                        // .attr("y", -h-5)
                                        // .attr("text-anchor", "start")
                                        // .attr("font-size", "8")
                                        // .text(d3.format(",")(d)); 
                                     // d3.select(this).attr("fill", "red")})
     // .on("mouseout", function(d, i){d3.select("g.x #tip").remove(); 
                                    // d3.select(this).attr("fill", "black")});
});