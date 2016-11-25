var key="?apikey=10efd8d786c74f93886d1a955afd758b";
var url="http://api.planetos.com/v1/datasets";

//puts variable names in the dropdown menu
function populate(stndname,varname,htmlid){
	var options="";
	for(var i = 0; i < stndname.length; i++)
		options += '<option value='+varname[i]+'>'+(stndname[i]==null ? varname[i]:stndname[i])+'</option>';
	var def = "<option value=''>Select variable</option>";
	$("#"+htmlid).html(def+options);
}

//gets variable names that correspond to the  dataset name
var units=[];
var geolayer = L.geoJson();
function getVariables(value,text){
	geolayer.clearLayers();
	$(".s2").dropdown("clear");
	$("#datasets").css("border", "");
	var id=value
	if (id=="") return false;
	console.log(id); 
	var stndname =[];
	var varname = [];
	units=[];
	console.log(url+"/"+id+key);
	$.getJSON(url+"/"+id+key, function(data){
		var geojson= {
			"type": data.SpatialExtent.type,
			"coordinates": data.SpatialExtent.coordinates
		};
		geolayer.addData(geojson);
		for (var i = 0;i <data.Variables.length ; i++){
			if (data.Variables[i].isData) {
				stndname.push(data.Variables[i].longName);
				varname.push(data.Variables[i].name);
				units.push(data.Variables[i].unit);
			}
		}
		populate(stndname,varname,"varid");	
	});
	map.addLayer(geolayer);
	$("#varid").attr("disabled",false);
	$(".s2").removeClass("disabled");
}
//creates a reference for each chart object
var nextcanvasnr =0;
function createCanvas(){
	var canvasid = "chart" +nextcanvasnr;
	var divid = "canvasdiv" +nextcanvasnr;
	
	$("<div>").attr({id:divid}).appendTo("#graph");
	$("<canvas>").attr({id:canvasid}).click(modalFunc).appendTo("#"+divid); // Maybe I need to alter this a bit too
	nextcanvasnr++;
	return canvasid;
}
// the modal screen opens up that takes from the targetid
function modalFunc(event){
	var targetid = event.target.id;
	if (Object.keys(combchart).length !== 0){
		var previd = Object.keys(combchart)[0];
		multigraphs(combchart[previd].config,graphList[targetid.slice(0,-1)].config);
		combchart={};
		$("#myModal2").css("display","none");
		$("#combgraph").empty();
		console.log("olemasolevad graafid: ", graphList);
		return false;
	}
	
	if(dataList[targetid].multigraph==false){
		$("#d1").html('<b>Dataset</b>:<a href="http://data.planetos.com/datasets/'+dataList[targetid].id+'">'+dataList[targetid].id+"</a>")
		$("#a1").html('<a class="ui grey tag label">'+"Area:"+"("+dataList[targetid].lng+";"+dataList[targetid].lat+")</a>");
		//when in modal view make a new query to api about the general info on dataset
		var datasetUrl = url+"/"+dataList[targetid].id+""+key;
	
		$.getJSON(datasetUrl,function(data){
			var title= data.Title;
			var source= data.Source;
			var category= data.Categories; 
			var allLabels='<a class="ui purple tag label">'+source+'</a>'
			for (i in category){
				allLabels+='<a class="ui teal tag label">'+category[i]+'</a>';
			}
			$("#labels").html(allLabels);

		});
	}
	else{
	//1.datasetid eraldada ja linkidena manada
		let datasets=dataList[targetid].id;
		datasets= datasets.split(",");
		datasets= Array.from(new Set(datasets));
		let links=""
		for (d in datasets){
			if (datasets[d]!="undefined"){
				links+='<a href="http://data.planetos.com/datasets/'+datasets[d]+'">'+datasets[d]+"</a>,"}
			}
			links=links.substring(0, links.length - 1)
			$("#d1").html('<b>datasets</b>:'+links);
		}


		var ctx = $("#modalcontent");
		var newgraph = new Chart(ctx,graphList[targetid].config);
		$("#myModal").css("display","block");
		
		$('.close').off('click')
		$(".close").click(function(){
			$('#linkAddress1').clone().attr('type','hidden').insertAfter('#linkAddress1').prev().remove();
			$("#myModal").css("display","none");
			$("#myModal2").css("display", "none");
			newgraph.destroy();
			combchart={};
			$("#combgraph").empty();
		});
		
		$("#myModal, #myModal2").click(function(e){
			if (e.target.id == "myModal" || e.target.id=="myModal2"){
				$('#linkAddress1').clone().attr('type','hidden').insertAfter('#linkAddress1').prev().remove();
				$("#myModal").css("display","none");
				$("#myModal2").css("display","none");
				newgraph.destroy();
				combchart={};
				$("#combgraph").empty();	
			}
		});
		$("#remove").off('click');
		$("#remove").click(function(){
			removegraph(targetid,newgraph);
		});
		$("#getLink1").off('click');
		$("#getLink1").click(function(){
			getLink(targetid);
		});
		$("#combine").off("click");
		$("#combine").click(function(){
			var num = 0;
			//ehitab mymodal2 olemasolevatest graafidest
			for (var i=0;i<Object.keys(graphList).length;i++){
				var canvasid= Object.keys(graphList)[i];
				//kui graafikus on vaid 1 element, siis on modal tühi
				if (canvasid != targetid){
					var divid= "canvasdiv"+canvasid.substring(5)+num;
					$("<div>").attr({id:divid}).appendTo("#combgraph");
					$("<canvas>").attr({id:canvasid+num}).click(modalFunc).appendTo("#"+divid);
					var ctx = $("#"+canvasid+num);
					var copygraph = new Chart(ctx,graphList[canvasid].config);}
				}
			//if the the modal view is empty then the modal view is shut and message would appear in the main view'
			if (Object.keys(graphList).length==1 && Object.keys(graphList)[0]==targetid){
				console.log("the modal view is empty");
				$("#myModal").css("display","none");
				$("#myModal2").css("display","none");
				//want to change the p elements value
				$("#feedback").html("Nothing to combine the graph with!");
				$("#feedback").css('visibility', 'visible');
				setTimeout(fadeMessage,7000)
				return;
			}
			combine(targetid,newgraph);
			$("#myModal2").css("display","block");
		});
	}
function fadeMessage(){
	$("#feedback").css('visibility', 'hidden')
}
function removegraph(id,newgraph){
	newgraph.destroy();
	var chartid = id;
	$("#canvasdiv"+chartid.substring(5)).remove();
	delete graphList[chartid];
	delete dataList[chartid];
	if (Object.keys(graphList).length==0){
		$("#graph").hide();
	}
	$("#myModal").css("display","none");
	console.log(graphList);
	$("#mapgraph").focus();
	
}
function decode(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
		});
	}

var combchart={};
function combine(id,newgraph){
	newgraph.destroy();
	$("#myModal").css("display","none");
	combchart[id] = graphList[id];
}
function checkingValuesFromAPI1(){
		$("#feedback").html(" The query to API didn't give any results!");
		$("#feedback").css('visibility', 'visible');
		setTimeout(fadeMessage,7000)
}

// gets values on the basis to do the chart
function generateGraph(){
	var input = getValues();
	if (!input){
		return false;
	}
	var currenturl = url+"/"+input.id+"/point"+key+"&var="+input.variable+"&lat="+
						input.lat+"&lon="+input.lng+
						"&start="+input.start+"&end="+input.end+"&count=20";
	//console.log(input);
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
		
		var canvasid = createCanvas();
		var modtime = modTime(time);
		createGraph(canvasid,values,modtime,input);
		moregraphs=false;
		$("#graph").show();
		$("#mapgraph").animate({ scrollTop: $("#"+canvasid).position().top}, "slow");
		
		$("#mapgraph").focus();
	//	console.log(graphList);
		
	});
}
//creates the right time format
function modTime(time){
	var modTime=[]
	for (var i =0;i<time.length;i++){
		var year = time[i].substring(0,4);
		var month = time[i].substring(5,7);
		var day = time[i].substring(8,10);
		var hours = time[i].substring(11,13);
		var minutes = time[i].substring(14,16);
		modTime.push(year+"/"+month+"/"+day+" "+hours+":"+minutes);
		
	}
	return modTime;
}
//will get the values from the form and 
function getValues(){
	var start = $("#StarT").val();
	var end = $("#end").val();
	var isoStart = "";
	var isoEnd ="";
	var other=new Date(start);
	var other2=new Date(end);
	var graphType = $("input[name=optradio]:checked").val();
	
	if (start!="")isoStart= new Date(other.getTime()- other.getTimezoneOffset()*60000).toISOString();
	if (end!="") isoEnd = new Date(other2.getTime()- other2.getTimezoneOffset()*60000).toISOString();
	var lat = latlngobj.lat;
	var lng = latlngobj.lng;
	// will paint borders red when no values are put by the user
	if (lat ==""){
		$("#mapdiv").css("border", "solid red");
		return false;
	}
	var id =$('#datasets').dropdown('get value');
	if (id==""){
		$("#datasets").css("border", "solid red");
		return false;
	}
	var variable = $(".s2").dropdown("get value");
	if (variable==""){
		$(".s2").css("border", "solid red");
		return false;
	}
	return {
		id : id,
		variable : variable,
		prettyVariable : $("#varid option[value='"+variable+"'] ").text(),
		lat : lat,
		lng : lng,
		start : isoStart,
		end : isoEnd,
		style : graphType,
		unit : units[(document.getElementById("varid").selectedIndex-1)],
		multigraph : false
	};	
}
$("#varid").on('change', function() {
	$(".s2").css("border", "");
});
var moregraphs=false;

function randomColor(){
	return "rgba("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+0.5+")";
}
var graphList= [];
var dataList=[];
//var lastGraph;


function createGraph(id,values,time,input){
	var index = document.getElementById("varid").selectedIndex;
	var lableName= $("#varid option[value='"+input.variable+"'] ").text()
	if (lableName==""){
		lableName= input.variable
	}
	var unit = units[(index-1)]; 
	if (unit == undefined){
		unit=input.unit;
		lableName= input.prettyVariable;
	}
	var graphType = input.style;
	var color=randomColor();
	var ctx = $("#"+id);
	var myChart = new Chart(ctx, {
	type: graphType,
	datasetName : input.id,
	data: {
		labels: time,
		datasets: [{
			type: graphType,
			label: lableName, // see peaks andma mulle muutuja nime
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
					labelString:unit 
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
	});
	graphList[id]=myChart;
	dataList[id]=input;
	//lastGraph=myChart;
}

function findingIndex(confPart){
	for (i in graphList){
		if (graphList[i].config==confPart|| graphList[i]==confPart){// I need to fix this here
			return i;
		}	}
	return -1;
}

function multigraphs(c1,c2){
	var inputID1=findingIndex(c1);
	var inputID2=findingIndex(c2)
	var id1=c1.datasetName;
	var id2=c2.datasetName;
	var id = createCanvas();
	var ctx = $("#"+id);
	var time1 = c1.data.labels;
	var time2 = c2.data.labels;
	var concattime = [...new Set(time1.concat(time2))].sort();
	var data1 = c1.data.datasets[0].data;
	var clone = JSON.parse(JSON.stringify(data1));
	for (var i=0;i<concattime.length;i++){
		if (time1.indexOf(concattime[i])===-1){
			clone.splice(i,0,NaN);
		}
		
	}
	//console.log("c1",clone);
	var label1 = c1.data.datasets[0].label;
	var type1 =c1.data.datasets[0].type;
	var fromzero=false;
	if (Math.max(...data1)<1) {
		fromzero=true;
	}
	var unit1 = c1.options.scales.yAxes[0].scaleLabel.labelString;
	var unit11 = c1.options.scales.yAxes[1].scaleLabel.labelString;
	var unit2 = c2.options.scales.yAxes[0].scaleLabel.labelString;
	var unit22 = c2.options.scales.yAxes[1].scaleLabel.labelString;

	var chart = new Chart(ctx,{
		type: "bar",
		datasetName : id1+","+id2,
		data: {
			labels: concattime,
			datasets: [{
				type: type1,
				label: label1,
				data: clone,
				yAxisID:"y-axis-0",
				fill:false,
				backgroundColor: c1.data.datasets[0].backgroundColor,
				borderColor: c1.data.datasets[0].borderColor,
				
			}]
		},
		options: {
			responsive:true,
			maintainAspectRatio:false,
			scales: {
				yAxes: [{
					ticks: {
						//beginAtZero:fromzero
					},
					scaleLabel: {
						display:true,
						labelString:unit1
					},
					id:"y-axis-0",
					
				},
				{
					ticks: {
						//beginAtZero:fromzero
					},
					scaleLabel: {
						display:true,
						labelString:unit11
					},
					id:"y-axis-1",
					display:false,
					position:"right",
				}]
			}
		}
	});
	
	if (c1.data.datasets.length>1){
		
		for (var i=1;i<c1.data.datasets.length;i++){
			var data11 = c1.data.datasets[i].data;
			var label11 = c1.data.datasets[i].label;
			var type11 = c1.data.datasets[i].type;
			var clone = JSON.parse(JSON.stringify(data11));
			for (var j=0;j<concattime.length;j++){
				if (time1.indexOf(concattime[j])===-1){
					clone.splice(j,0,NaN);
				}
		
			}
			console.log("data11 ", clone);
			
			var dataset = {
					fill:false,
					label:label11,
					type:type11,
					yAxisID:c1.data.datasets[i].yAxisID,
					data:clone,
					backgroundColor: c1.data.datasets[i].backgroundColor,
					borderColor: c1.data.datasets[i].borderColor,
			};
			if (c1.data.datasets[0].yAxisID===c1.data.datasets[i].yAxisID){
				chart.data.datasets.push(dataset);
				chart.update();
			}
			else { //chart 1's on 2 graafi ja mõlemal erinev ühik
				chart.options.scales.yAxes[i].display=true;
				chart.options.scales.yAxes[i].scaleLabel.labelString=unit11;
				chart.data.datasets.push(dataset);
				chart.update();
				
			}
		}
	}
	
	
	
	for (var i=0;i<c2.data.datasets.length;i++){
		var data2 = c2.data.datasets[i].data;
		var label2 = c2.data.datasets[i].label;
		var type2 = c2.data.datasets[i].type;
		var clone = JSON.parse(JSON.stringify(data2));
		for (var j=0;j<concattime.length;j++){
			if (time2.indexOf(concattime[j])===-1){
				clone.splice(j,0,NaN);
			}
		}
		//console.log("data2 ",clone);
		var dataset = {
				fill:false,
				label:label2,
				type:type2,
				yAxisID:c2.data.datasets[i].yAxisID,
				data:clone,
				backgroundColor: c2.data.datasets[i].backgroundColor,
				borderColor: c2.data.datasets[i].borderColor,
		};
		
		
		if (c2.data.datasets[i].yAxisID === c1.data.datasets[0].yAxisID){ //y-axis-0==y-axis-0
			console.log("c2 dataset on vaskapoolsel y-teljel");
			if ( unit2 === unit1 ){
				console.log("unit2 == unit1")
				chart.data.datasets.push(dataset);
				chart.update();
				continue;
			}
			else if (unit2 === unit11 || unit11==="") {
				dataset.yAxisID="y-axis-1";
				console.log("unit2==unit11 või unit11==''");
				chart.options.scales.yAxes[1].display=true;
				chart.options.scales.yAxes[1].scaleLabel.labelString=unit2;
				chart.data.datasets.push(dataset);
				chart.update();
				continue;
			}
			else {
				console.log("c2 dataset[i] ei saa panna kummalegi y-teljele");
				chart.destroy();
				$("#canvasdiv"+id.substring(5)).remove();
				$("#feedback").html("Can't add graph - units are different");
				$("#feedback").css('visibility', 'visible');
				setTimeout(fadeMessage,7000);
				return false;
			}
		}
		else { //y-axis-1==y-axis-1
			console.log("c2 dataset on parempoolsel y-teljel");
			if ( unit22 === unit1 ){
				console.log("unit22==unit1");
				dataset.yAxisID="y-axis-0"; //või c1.data.datasets[0].yAxisID - unit1 y-axis id
				chart.data.datasets.push(dataset);
				chart.update();
				continue;
			}
			else if (unit22 === unit11 || unit11==="") {
				console.log("unit22==unit11 või unit11==''");
				dataset.yAxisID="y-axis-1";
				chart.options.scales.yAxes[1].display=true;
				chart.options.scales.yAxes[1].scaleLabel.labelString=unit22;
				chart.data.datasets.push(dataset);
				chart.update();
				continue;
			}
			else {
				console.log("c2 dataset[i] ei saa panna kummalegi y-teljele");
				chart.destroy();
				$("#canvasdiv"+id.substring(5)).remove();
				return false;
			}
		}
	}
	var DATA1= dataList[inputID1]; // Why undefined?
	var DATA2= dataList[inputID2];
	graphList[id]=chart;
	dataList[id]={
		id : id1+","+id2,
		variable : DATA1.variable+","+DATA2.variable,
		prettyVariable: DATA1.prettyVariable+","+DATA2.prettyVariable,
		lat : DATA1.lat+",,"+DATA2.lat,
		lng : DATA1.lng+",,"+DATA2.lng,
		start : DATA1.start+","+DATA2.start,
		end : DATA1.end+","+DATA2.end,
		style : DATA1.style+","+DATA2.style,
		unit : DATA1.unit+","+DATA2.unit,
		multigraph : true
		
	};
	$("#mapgraph").animate({ scrollTop: $("#"+id).position().top}, "slow");
	return false;
}
function getLink(chartid){
	$('#linkAddress1').clone().attr('type','text').insertAfter('#linkAddress1').prev().remove();
	//$("#linkAddress1").css('type', 'text');
	var partData1=JSON.stringify(dataList[chartid]); 
	$("#linkAddress1").val("http://tarkvaraprojektos.herokuapp.com/"+partData1);
}