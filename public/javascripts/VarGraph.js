var key="?apikey=10efd8d786c74f93886d1a955afd758b";
var url="http://api.planetos.com/v1/datasets";


function populate(stndname,varname,htmlid){
	var options="";
	for(var i = 0; i < stndname.length; i++)
		options += '<option value='+varname[i]+'>'+(stndname[i]==null ? varname[i]:varname[i])+'</option>';
	var def = "<option value="+'default'+" class="+'default'+">"+'Select variable'+"</option>";
	$("#"+htmlid).html(def+options);
}
function getVariables(){
	$("#datasets").css("border", "");
	var id=$("#datasets").val();
	if (id=="") return false;
	console.log(id); 
	var stndname =[];
	var varname = [];
	$.getJSON(url+"/"+id+key, function(data){
		for (var i = 0;i <data.Variables.length ; i++){
			if (data.Variables[i].isData) {
				stndname.push(data.Variables[i].standardName);
				varname.push(data.Variables[i].name);
			}
		}
		populate(stndname,varname,"varid");	
	});
	$("#varid").attr("disabled",false);
}
var nextcanvasnr =0;
function createCanvas(){
	var canvasid = "chart" +nextcanvasnr;
	var divid = "canvasdiv" +nextcanvasnr;
	
	$("<div>").attr({id:divid}).click(modalFunc).appendTo("#graph");
	$("<canvas>").attr({id:canvasid}).appendTo("#"+divid);
	
	nextcanvasnr++;
	return canvasid;
}

var currentevent;
function modalFunc(event){
	currentevent = event;
	var targetid = event.target.id;
	var ctx = $("#modalcontent");
	var newgraph = new Chart(ctx,graphList[targetid].config);
	$("#myModal").css("display","block");
	$(".close").click(function(){
		$("#myModal").css("display","none");
		newgraph.destroy();
	});
	
	$("#myModal").click(function(e){
		if (e.target.id == "myModal"){
			$("#myModal").css("display","none");
			newgraph.destroy();
		}

		
	});
	$("#remove").click(function(){
		removegraph(newgraph);
	});
	
	/*
	window.onclick =function(event){
		if (event.target == $("#myModal")[0]){
			$("#myModal").css("display","none");
			newgraph.destroy();
		}
	}
	*/
}

function removegraph(newgraph){
	newgraph.destroy();
	var chartid = currentevent.target.id;
	console.log("canvasdiv"+chartid.substring(5));
	$("#canvasdiv"+chartid.substring(5)).remove();
	delete graphList[chartid];
	if (Object.keys(graphList).length==0){
		$("#graph").hide();
	}
	$("#myModal").css("display","none");
	console.log(graphList);
	$("#mapgraph").focus();
	
}

function generateGraph(){
	var input = getValues();
	if (!input){
		return false;
	}
	
	var currenturl = url+"/"+input.id+"/point"+key+"&var="+input.variable+"&lat="+
						input.lat+"&lon="+input.lng+
						"&start="+input.start+"&end="+input.end+"&count=20";
	console.log(currenturl);
	$.getJSON(currenturl,function(data){
		var values=[];
		var time=[];
		
		for(var i=0;i<data.entries.length;i++){
			values.push(data.entries[i].data[input.variable]);
			time.push(data.entries[i].axes.time);
		
		}
		/*
		if (lastGraph!=null && moregraphs==false){
			lastGraph.data.datasets[0].data=values;
			lastGraph.data.labels=time;
			
			var graphType = $("input[name=optradio]:checked").val();
			var data = lastGraph.data;
			var ctx = lastGraph.chart.canvas;
			lastGraph.destroy();
			lastGraph=new Chart(ctx,{
				type: graphType,
				data:data,
			});

			lastGraph.update();
			console.log(lastGraph);
			//$("#mapgraph").animate({ scrollTop: $("#"+canvasid).offset().top}, "slow");
			return false;
		}
		*/
		
		var canvasid = createCanvas();
		var modtime = modTime(time);
		createGraph(canvasid,values,modtime);
		moregraphs=false;
		$("#graph").show();
		//location.href="#"+canvasid;
		$("#mapgraph").animate({ scrollTop: $("#"+canvasid).offset().top}, "slow");
		
		$("#mapgraph").focus();
		console.log(graphList);
		
	});
}

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
function getValues(){
	var start = $("#StarT").val();
	var end = $("#end").val();
	var isoStart = "";
	var isoEnd ="";
	var other=new Date(start);
	var other2=new Date(end);
	if (other >other2){
		alert ("check the dates");
		return false;
	}
	if (start!="")isoStart= new Date(other.getTime()- other.getTimezoneOffset()*60000).toISOString();
	if (end!="") isoEnd = new Date(other2.getTime()- other2.getTimezoneOffset()*60000).toISOString();
	var lat = latlngobj.lat;
	var lng = latlngobj.lng;
	if (lat ==""){
		$("#mapdiv").css("border", "solid red");
		return false;
	}
	var id = $("#datasets").val();
	if (id=="default"){
		$("#datasets").css("border", "solid red");
		return false;
	}
	var variable = $("#varid").val();
	if (variable=="default"){
		$("#varid").css("border", "solid red");
		return false;
	}

	
	return {
		id : id,
		variable : variable,
		lat : lat,
		lng : lng,
		start : isoStart,
		end : isoEnd,
		
	};	
}
$("#varid").on('change', function() {
	$("#varid").css("border", "");
});


var moregraphs=false;
function generateNewGraph(){
	$("select#datasets").val("default");
	$("select#varid").val("default");
	$("#StarT").val("");
	$("#end").val("");
	removeMarker();
	$("#mapgraph").animate({ scrollTop: 0 }, "slow");
	//window.scrollTo(0, 0);
	$("#datasets").attr("disabled",true);
	$("#varid").attr("disabled",true);
	moregraphs=true;
	
	
}
var graphList= {};
//var lastGraph;
function createGraph(id,values,time){
	var ctx = $("#"+id);
	var graphType = $("input[name=optradio]:checked").val();
	var myChart = new Chart(ctx, {
	type: graphType,
	data: {
		labels: time,
		datasets: [{
			label: $("#varid").val(),
			data: values,
			
		}]
	},
	options: {
		responsive:true,
		maintainAspectRatio:false,
		scales: {
			yAxes: [{
				ticks: {
					//beginAtZero:true
				},
				scaleLabel: {
					display:true,
					labelString:"test"
				}
			}]
		}
	}
	});
	graphList[id]=myChart;
	//lastGraph=myChart;
}

/*
function createGraph(id,values,time){
	var ctx = $("#"+id);
	var myChart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: time,
		datasets: [{
			type:"bar",
			label: "bar label",
			data: values,
			},
			{
			type:"line",
			label: "line label",
			data: values,
			}
			]
		},
	options: {
		responsive:true,
		maintainAspectRatio:false,
		scales: {
			yAxes: [{
				ticks: {
					//beginAtZero:true
				},
				scaleLabel: {
					display:true,
					labelString:"test"
				}
			}]
		}
	}
	});
	graphList.push(myChart);
	lastGraph=myChart;
}
*/