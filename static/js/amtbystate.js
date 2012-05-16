d3.csv("preprocessed-data/contb.csv", function handleCSV(csv) {
  // select revenues of CA companies
  var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  var data = csv.filter(function(el){
                        if (states.indexOf(el.contbr_st) < 0){
                            // console.log(el);
                        }
                        else{
                            return el.contbr_st;
                        }});
    // var states = data.map(function(el){return el.contbr_st});
    var amts = data.map(function(el){return parseInt(el.contb_receipt_amt)});
    // console.log(data);
    // console.log(states);
    // console.log(amts);

  var w = 240,
      h = 510,
      p = 40,
      x = d3.scale.linear()
                  .domain([0, d3.max(amts) * 1.01])
                  .range([0, w]),
      //domain has to be states, but then how do you deal with range?
      y = d3.scale.ordinal()
                  .domain(states)
                  .rangePoints([0,500]);

  var vis = d3.select("div #donByState")
              .append("svg")
              .attr("width", w + p * 2)
              .attr("height", h + p * 2)
              .append("g")
              .attr("transform", "translate(" + p + "," + p + ")");

  // axes
  var xAxis = d3.svg
                .axis()
                .scale(x)
                .ticks(5)
                .tickPadding(5);

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

  // draw the dots
  vis.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", 0)
     .attr("y", function(d){
                    return y(d.contbr_st)})
     .attr("width", function(d) { return x(d.contb_receipt_amt); })
     .attr("height", function(d) { return 10; })
     .on("mouseover", function(d, i){d3.select("div#donByState g.y")
                                        .append("text")
                                        .attr("id", "tip")
                                        .attr("x", x(d.contb_receipt_amt))
                                        .attr("y",y(d.contbr_st)+7)
                                        .attr("text-anchor", "start")
                                        .attr("font-size", "8")
                                        .text("$"+d3.format(",f")(d.contb_receipt_amt)); 
                                    d3.select(this).attr("fill", "red")})
     .on("mouseout", function(d, i){d3.select("g.y #tip").remove(); 
                                    d3.select(this).attr("fill", "black")});
});



