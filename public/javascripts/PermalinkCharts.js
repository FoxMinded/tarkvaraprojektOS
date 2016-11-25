function baseConfig(i,values,time,input){
	console.log("I am in basegraph now. Input object:");
	var style= input.style;
	var color=randomColor();
	//var ctx = $("#"+id);
	
	var myChart =  {
	type: input.style,
	datasetName : input.id,
	data: {
		labels: time,
		datasets: [{
			type: input.style,
			label: input.prettyVariable, // see peaks andma mulle muutuja nime
			data: values,
			yAxisID:"y-axis-0",
			fill:false,
			backgroundColor:color,
			borderColor:color,
		}]
	},
	options: {
		responsive:true,
		maintainAspectRatio:false,
		scales: {
			yAxes: [{
				ticks: {
					//beginAtZero:true
					//min:Math.round(Math.min(...values)-1),
				},
				scaleLabel: {
					display:true,
					labelString:input.unit 
				}
			},
			{
				ticks: {
					//beginAtZero:fromzero
				},
				scaleLabel: {
					display:true,
					labelString:""
				},
				id:"y-axis-1",
				display:false,
				position:"right",
			}]
		}
	}
	};
	graphList["chart"+i]=(myChart);
	
	if (countGraphObj(graphList)== dataList.length){
		var graphListTwin=[]
		for (obj in graphList){
			graphListTwin.push(graphList[obj]);
		}
	//console.log("graphList jõudis dataListile järele");
	graphListTwin.reduce(makeOneMultigraph);
	}
	
}
function countGraphObj(){
	length=0;
	for (obj in graphList){
		length+=1;
	}
	return length;
}
function returnMeGraph(input,num){
	//console.log("in returnGraph and got:");
	//console.log(input[0].id);
	input=input[0];
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
		var len = data.entries.length>20 ? 20 : data.entries.length;
		for(var i=0;i<len;i++){ 
			//not taking the values with null values
			if (data.entries[i].data[input.variable]!= null){
				values.push(data.entries[i].data[input.variable]);
				time.push(data.entries[i].axes.time);}
			}
			// if there are only null values in the query
			if (values.length==0){
				checkingValuesFromAPI1();
				return;
			}
		// I AM GOING TO TRY TO JUST CREATE CONFIG OBJECTS (not chart objects)
		//var canvasid = createCanvas("#dummyDiv", false);
		//<---ma ei tea veel kas mul seda üldse vaja on...
		//var divid = "canvasdiv" +num;
		//$("<div>").attr({id:divid}).appendTo("#dummyDiv");
		//$("<canvas>").attr({id:canvasid}).click(modalFunc).appendTo("#"+divid); // If it is not visible, there is no use of click method
		// shady stuff ends here--->
		var modtime = modTime(time);
		baseConfig(num,values,modtime,input);});
}
function makeOneMultigraph(one, end){
	return multigraphs(one, end);
}

function doGraphs(arr){
	//console.log("I am in doGraphs now");
	for (i in arr){
		 // OKEI, SEE ON OBJEKT
		// here I will create the graph and add it to graphList
		returnMeGraph(arr[i], i);/* Will make API request and send to baseGraph 
									where it will be made as chart.config object and put to 
									graphList*/
		//console.log(obj);
	}
	// NOW I CAN MAYBE USE REDUCE TO GET 1 combined multigraph
	
		
}
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
		// so this should be like input objects
		inputObject={id:ids[i], variable:variables[i],prettyVariable: prettyVariable[i], lat:lats[i],lng: lngs[i], start:starts[i], end:ends[i], style:style[i], unit:unit[i], multigraph:false}
        dataList[i]=inputObject; // now i need to generate the graphs and put them to graphList-> Context: dummyDiv
		return [inputObject];
    });
	doGraphs(graafikud);
	// NOW I NEED TO GENERATE THE CHART OBJECTS. THIS IS GOING TO BE INTERESTING.
	// They are all going to the graphList and dataList arrays because that's how it is in the multigraph function

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
		var len = data.entries.length>20 ? 20 : data.entries.length;
		for(var i=0;i<len;i++){
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