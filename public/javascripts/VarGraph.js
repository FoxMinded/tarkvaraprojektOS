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

function createCanvas(){
	var canvasid = "chart" +$("canvas").length;
	var divid = "canvasdiv" +$("canvas").length;
	var canvasnr = $("canvas").length;
	$("<div>").attr({id:divid}).appendTo("#graph");
	$("<canvas>").attr({id:canvasid}).appendTo("#"+divid);
	
	
	return canvasid;
}
function generateGraph(){
	var input = getValues();
	
	var currenturl = url+"/"+input.id+"/point"+key+"&var="+input.variable+"&lat="+
						input.lat+"&lon="+input.lng+
						"&start="+input.start+"&end="+input.end+"&count=20";
	console.log(currenturl);
	$.getJSON(currenturl,function(data){
		var values=[];
		var time=[];
		
		for(var i=0;i<data.entries.length;i++){
			values.push(data.entries[i].data[input.variable]);
			time.push(new Date(data.entries[i].axes.time).toLocaleDateString());
		
		}
		
		
		if (lastGraph!=null && moregraphs==false){
			//lastGraph.destroy();
			lastGraph.data.datasets[0].data=values;
			lastGraph.data.datasets[1].data=values;
			lastGraph.data.labels=time;
			lastGraph.data.labels=time;
			lastGraph.update();
			
			return false;
		}
		
		var canvasid = createCanvas();
		createGraph(canvasid,values,time);
		moregraphs=false;
		$("#graph").show();
		location.href="#"+canvasid;
	});
}
function getValues(){
	var start = $("#start").val();
	var end = $("#end").val();
	var isoStart = "";
	var isoEnd ="";
	if (start!="") isoStart = new Date(start).toISOString();
	console.log(new Date(start));
	console.log(isoStart);
	if (end!="") isoEnd = new Date(end).toISOString();
	console.log(isoEnd);
	return {
		id : $("#datasets").val(),
		variable : $("#varid").val(),
		lat : latlngobj.lat,
		lng : latlngobj.lng,
		start : isoStart,
		end : isoEnd,
		
	};
	
}
var moregraphs=false;
function generateNewGraph(){
	$("select#datasets").val("default");
	$("select#varid").val("default");
	$("#start").val("");
	$("#end").val("");
	removeMarker();
	$("#mapgraph").animate({ scrollTop: 0 }, "slow");
	window.scrollTo(0, 0);
	$("#datasets").attr("disabled",true);
	$("#varid").attr("disabled",true);
	moregraphs=true;
	
	
}
var graphList= []
var lastGraph;
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
