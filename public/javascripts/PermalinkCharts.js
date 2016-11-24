function getBits(input){
    ids= input.id.split(",");
    variables= input.variable.split(",");
    prettyVariable= input.prettyVariable.split(",");
    lats= input.lat.split(",,");
    lngs= input.lng.split(",,");
    starts= input.start.split(",");
    ends= input.end.split(",");
    style= input.style.split(",");
    unit= input.unit.split(",");
    // now I could get all the single graphs by zipping all of these things together :)
    var graafikud = ids.map(function (e, i) {
        return [ids[i], variables[i], prettyVariable[i], lats[i], lngs[i], starts[i], ends[i], style[i], unit[i]];
    });
    // Siis on mul käes üksikud graafikud. 
    // kõigepealt teeksin chart objektid neist kõigist, siis chart.configi söödaksin sisse assotsiatsiivselt
    // reduce meetodiga ning siis saaksin tulemuseks ühe graafiku
	return graafikud;
}
// okay, so do I need to duplicate other methods as well or I can just use them?
function generateGraphPermaVersion(input){
	input=decode(input);
	input=JSON.parse(input);
	if (input.multigraph){
		// do sth different
		console.log("found a multigraph");
		var arrOfBasegraphs= getBits(input)
		console.log(arrOfBasegraphs);
		return;
	}
	var currenturl = url+"/"+input.id+"/point"+key+"&var="+input.variable+"&lat="+
						input.lat+"&lon="+input.lng+
						"&start="+input.start+"&end="+input.end+"&count=20";	
	$.getJSON(currenturl,function(data){
		var values=[];
		var time=[];
		// if there are no values in the query
		if (data.message=="Provided filter does not contain any data"){
			checkingValuesFromAPI1();
			return; //nothing to generate a graph of
		}
		for(var i=0;i<data.entries.length;i++){
			//not taking the values with null values
			if (data.entries[i].data[input.variable]!= null){
				values.push(data.entries[i].data[input.variable]);
				time.push(data.entries[i].axes.time);}
		}
		if (values.length==0){
				checkingValuesFromAPI1();
				return;
		}
		
		var canvasid = createCanvas();
		var modtime = modTime(time);
		createGraph(canvasid,values,modtime,input);
		moregraphs=false;
		$("#graph").show();
		$("#mapgraph").animate({ scrollTop: $("#"+canvasid).position().top}, "slow");
		$("#mapgraph").focus();	
	});
}