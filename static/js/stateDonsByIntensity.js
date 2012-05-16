var statePop = []
d3.csv("data/statepop.txt", function(popCSV){
  var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  statePop = popCSV.filter(function(el){
                        if (states.indexOf(el.state) < 0){
                        }
                        else{
                            return el.state;
                        }});})
statePop = statePop.sort(function(d1,d2){
                if(d1.state>d2.state){
                    return 1}
                else{
                    return -1}});

d3.csv("preprocessed-data/contb.csv", function handleCSV(csv) {
  var states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  
  // var states = csv.map(function(el){return el.contbr_st});
  var data = csv.filter(function(el){
                        if (states.indexOf(el.contbr_st) < 0){
                        }
                        else{
                            return el.contbr_st;
                        }});
      data = data.sort(function(d1,d2){
                if(d1.contbr_st>d2.contbr_st){
                    return 1}
                else{
                    return -1}});
    for (var j = 0; j < statePop.length; j++)
    {
        for (var k = 0; k < data.length; k++)
        {
            if (data[k].contbr_st == statePop[j].state)
            {
                data[k].contb_receipt_amt = data[k].contb_receipt_amt / statePop[j].population * 100;
            }
        }
    }
    var amts = data.map(function(el){return parseInt(el.contb_receipt_amt)});
    
    var scale = d3.scale.linear()
            .domain([0,d3.max(amts)])
            .range([255,40]);
    var stateToScale = {};  
    
    d3.select("div#stateDonsByIntensity")
        .append("text")
        .attr("id", "tip")
        .text("State:Total Donations"); 
        
    for (var i = 0; i < data.length; i=i+1){
        var scaledAmt = parseInt(scale(data[i].contb_receipt_amt)).toString(16);
        if (scaledAmt.length < 2){
            scaledAmt = "0" + scaledAmt;
        }
        stateToScale[data[i].contbr_st] = scaledAmt
        hexVal = scaledAmt + scaledAmt + "00";
        
        d3.select("div #stateDonsByIntensity")
          .select("#"+data[i].contbr_st)
          .style("fill","#"+hexVal)
          .on("mouseover", function(){d3.select(this)
                                        .style("fill","#"+stateToScale[this.id]+"00"+stateToScale[this.id])
                                        ;
                                      d3.select("div#stateDonsByIntensity").select("#tip").remove();
                                      d3.select("div#stateDonsByIntensity")
                                        .append("text")
                                            .attr("id", "tip")
                                            .attr("text-anchor", "start")
                                            .attr("font-size", "8")
                                            .text(this.id+":"+d3.format("f")(data[states.indexOf(this.id)].contb_receipt_amt)+" cents");
                                        })
          .on("mouseout", function(){d3.select(this)
                                        .style("fill","#"+stateToScale[this.id]+stateToScale[this.id]+"00");
                                        
                                      d3.select("div#stateDonsByIntensity").select("#tip").remove();
                                      d3.select("div#stateDonsByIntensity")
                                        .append("text")
                                        .attr("id", "tip")
                                        .text("State:Total Donations"); });
    }
});