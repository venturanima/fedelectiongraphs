d3.csv("preprocessed-data/donsByCand.csv", function handleCSV(csv) {
  var data = csv;
    var amts = data.map(function(el){return parseInt(el.contb_receipt_amt)});
    // console.log(data);
    // console.log(states);
    // console.log(amts);

  var w = 240,
      h = 100,
      p = 40,
      r = 80,
      color = d3.scale.category20();
      
      
  var vis = d3.select("div #donsByCand")
              .append("svg")
              .data([data])
                .attr("width", w + p * 2)
                .attr("height", h + p * 2);
              
  var pie = d3.layout.pie()
              .value(function(d){return d.contb_receipt_amt});
  var arc = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(r);
   
    d3.select("div #donsByCand")
      .append("text")
      .attr("id", "tip")
      .text("Candidate")           
      
  var arcs = vis.selectAll("g.arc")
                .data(pie)
                .enter()
                    .append("g")
                    .attr("class","arc")
                    .attr("transform","translate("+r+","+r+")");
      arcs.append("path")
          .style("stroke", "white")
          .style("stroke-width", "0.5")
          .style("fill", function(d,i){return color(i)})
          .attr("d",arc)
          .on("mouseover",function(d,i){
                    d3.select("div#donsByCand").select("#tip").remove(); 
                    d3.select("div #donsByCand")
                      .append("text")
                      .attr("id", "tip")
                      .text(d.data.cand_nm+":$"+d3.format(",f")(d.data.contb_receipt_amt))})
          .on("mouseout",function(d,i){
                    d3.select("div#donsByCand").select("#tip").remove(); 
                    d3.select("div #donsByCand")
                      .append("text")
                      .attr("id", "tip")
                      .text("Candidate")});
});



