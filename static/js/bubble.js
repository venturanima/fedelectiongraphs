d3.csv("preprocessed-data/numContb.csv", function handleCSV(csv) {
  // select revenues of CA companies
  
  var stateList = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  var data = csv.filter(function(el){return stateList.indexOf(el.contbr_st) > 0;});
  
  var states = data.map(function(el){return el.contbr_st});
  var amts = data.map(function(el){return parseInt(el.contb_receipt_amt)});
  var r = 7, 
      w = 580,
      h = 500,
      p = 20;
      
  var scale = d3.scale.linear()
                .domain([0,d3.max(amts)])
                .range([2,r])
  var maxRad = scale(d3.max(amts))
  // var yScale = d3.scale.linear()
                // .domain([0,d3.max(amts)])
                // .range([0,h])
  
  var vis = d3.select("div #bubble")
        .append("svg")
        .attr("width", w + p * 2)
        .attr("height", h + p * 2)
        .attr("class", "bubble");
        
    d3.select("div#bubble")
        .append("text")
        .attr("id", "tip")
        .text("State:Number of Donations"); 
  var xArray = [];
  var yArray = [];
  var node = vis.selectAll("g.node")
                .data(data)
                .enter()
                    .append("g")
                    .attr("class","node")
                    .attr("transform", function(d) { 
                                var x = Math.random() * (w-r*scale(d.contb_receipt_amt));
                                var y = Math.random() * (h-r*scale(d.contb_receipt_amt));
                                for (var i = 0; i < yArray.length; i++)
                                {
                                    if (Math.abs(y-yArray[i]) < 2*r*scale(d.contb_receipt_amt) && Math.abs(x-xArray[i]) < 2*r*scale(d.contb_receipt_amt))
                                    {
                                        x = Math.random() * (w-r*scale(d.contb_receipt_amt));
                                        y = Math.random() * (h-r*scale(d.contb_receipt_amt));
                                        i = 0
                                    }
                                }
                                xArray[xArray.length] = x;
                                if (x < r*scale(d.contb_receipt_amt)){
                                    x = x + r*scale(d.contb_receipt_amt)
                                    }
                                yArray[yArray.length] = y;
                                if (y < r*scale(d.contb_receipt_amt)){
                                    y = y + r*scale(d.contb_receipt_amt)
                                }
                                // console.log(y)
                                return "translate("+x+","+y+")";
                                });
      node.append("circle")
          .attr("r", function(d){return r*scale(d.contb_receipt_amt)})
          // .attr("cx",function(d) { 
                                // var x = Math.random() * (w-r*scale(d.contb_receipt_amt));
                                // if (x < r*scale(d.contb_receipt_amt)){
                                    // x = x + r*scale(d.contb_receipt_amt)
                                // }
                                // return  x})
          // .attr("cy",function(d) { 
                                // var y = Math.random() * (h-r*scale(d.contb_receipt_amt));
                                // if (y < r*scale(d.contb_receipt_amt)){
                                    // y = y + r*scale(d.contb_receipt_amt)
                                // }
                                // return  y })
          .style("fill","steelblue");
      node.append("text")
            .attr("text-anchor","middle")
            .text(function(d){return d.contbr_st})
      node.on("mouseover", function(d,i){
                                d3.select("div#bubble").select("#tip").remove(); 
                                d3.select("div#bubble")
                                    .append("text")
                                    .attr("id", "tip")
                                    .text(d.contbr_st+":"+d3.format(",f")(d.contb_receipt_amt)); 
                                d3.select(this).select("circle")
                                    .style("fill","green");
                                // console.log(d3.select(this).text())
                                // console.log(d3.select("div#kde"))
                            })
          .on("mouseout", function(d){
        
                                d3.select("div#bubble").select("#tip").remove(); 
                                d3.select("div#bubble")
                                    .append("text")
                                    .attr("id", "tip")
                                    .text("State:Number of Donations"); 
                                d3.select(this).select("circle")
                                    .style("fill","steelblue");
                                // console.log(d3.select(this).text())
                            })
});