var key="?apikey=10efd8d786c74f93886d1a955afd758b";
var url="http://api.planetos.com/v1/datasets";

function populate(stndname,varname,htmlid){
	var options="";
	for(var i = 0; i < stndname.length; i++)
		options += '<option value='+varname[i]+'>'+(stndname[i]==null ? varname[i]:stndname[i])+'</option>';
	var def = "<option default class="+'default'+">"+'Select variable'+"</option>";
	$("#"+htmlid).html(def+options);
}
function getVariables(){
	var id=$("#datasets").val();
	if (id=="") return false;
	console.log(id); 
	var stndname =[];
	var varname = [];
	$.getJSON(url+"/"+id+key, function(data){
		console.log(data);
		for (var i = 0;i <data.Variables.length ; i++){
			if (data.Variables[i].isData)
				stndname.push(data.Variables[i].standardName);
				varname.push(data.Variables[i].name);
		}
		console.log(stndname);
		populate(stndname,varname,"varid");
			
	});
	$("#varid").attr("disabled",false);
}

function generateGraph(){
	var variable = $("#varid").val();
	if (variable=="") return false;
	var id = $("#datasets").val();
	var lat = latlngobj.lat; //latitude from latlngobj in displayMap.js  
	var lng = latlngobj.lng;
	var startDate = $("#StarT").val();
	var endDate = $("#end").val();
	if (startDate=="") isoStartDate="";
	else var isoStartDate = new Date(startDate).toISOString();
	if (endDate=="") isoEndDate="";
	else var isoEndDate = new Date(endDate).toISOString();
	console.log("start:"+startDate);
	var currenturl = url+"/"+id+"/point"+key+"&var="+variable+"&lat="+lat+"&lon="+lng+
						"&start="+isoStartDate+"&end="+isoEndDate+"&count=10";
	console.log(currenturl);
	$.getJSON(currenturl,function(data){
		var values=[];
		var time=[];
		for(var i=0;i<data.entries.length;i++){
			values.push(data.entries[i].data[variable]);
			time.push(data.entries[i].axes.time);
			var text = "<br>Input data is: "+data.entries[i].data[variable];
			$("#cont").append(text);
		}
		if (myChart!=null){
			myChart.destroy();
		}
		createGraph(values,time);
		$("#graph").attr("tabindex",0).focus();
	});
	$("#cont").text("");
}


var myChart;
function createGraph(values,time){
	var ctx = $("#chart");
	myChart = new Chart(ctx, {
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
				}
			}]
		}
	}
	});
}
