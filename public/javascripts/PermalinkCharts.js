function baseConfig(i,values,time,input){
	var style= input.style;
	var color=randomColor();
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
	
	if (countGraphObj(graphList)== countGraphObj(dataList)){
		var graphListTwin=[]
		for (obj in graphList){
			graphListTwin.push(graphList[obj]);
		}
	graphListTwin.reduce(makeOneMultigraph);
	}
	
}
function countGraphObj(arr){
	length=0;
	for (obj in arr){
		length+=1;
	}
	return length;
}
function returnMeGraph(input,num){
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
		var modtime = modTime(time);
		baseConfig(num,values,modtime,input);});
}
function makeOneMultigraph(one, end){
	return multigraphs(one, end);
}

function doGraphs(arr){
	for (i in arr){
		returnMeGraph(arr[i], i);
	}
	
	
		
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
        dataList["chart"+nextcanvasnr]=inputObject; // now i need to generate the graphs and put them to graphList-> Context: dummyDiv
		nextcanvasnr++;
		return inputObject;
    });
	doGraphs(graafikud);
	return graafikud;
}
function notValid(){
	$("#feedback").html("Invalid link!");
	$("#feedback").css('visibility', 'visible');
	setTimeout(fadeMessage,7000);	
}
// okay, so do I need to duplicate other methods as well or I can just use them?
function generateGraphPermaVersion(input){
	input=decode(input);
	input=replaceChar(input,"!","/")
	/*
	*  Kui pole õige, siis ei hakka midagi genereerima, vaid anname feedback-i kasutajale
	*/
	try{
	input=JSON.parse(input);
	// kas on ikka õige json-i objekt?
	if(input.hasOwnProperty('variable')&&input.hasOwnProperty('id')&&input.hasOwnProperty('prettyVariable')&&input.hasOwnProperty('multigraph')&&
	input.hasOwnProperty('unit')&&input.hasOwnProperty('style')&& input.hasOwnProperty('end')&&input.hasOwnProperty('start')&&input.hasOwnProperty('lat')&&input.hasOwnProperty('lng')==false){
		return;
	}
	}
	catch(err){
		return;
	}
	if (input.multigraph){
		getBits(input)
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