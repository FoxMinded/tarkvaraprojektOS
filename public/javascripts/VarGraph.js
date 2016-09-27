var key="?apikey=10efd8d786c74f93886d1a955afd758b";
var url="http://api.planetos.com/v1/datasets";
function getDatasets(){
	$.getJSON(url+key, function(data){
		console.log(data.slice(0,10));
		//$("#cont").append(data.slice(0,10));
		
		populate(data.slice(0,10),"listid");
	
	});
	
}


function populate(data,htmlid){
	options="";
	for(var i = 0; i < data.length; i++)
		options += '<option value="'+data[i]+'" />';

	$("#"+htmlid).html(options);
}
function getVariables(){
	var id = document.getElementById("datasets").value;
	if (id=="") return false;
	console.log(id); 
	var vararr =[]
	$.getJSON(url+"/"+id+key, function(data){
		console.log(data);
		for (var i = 0;i <data.Variables.length ; i++){
			if (data.Variables[i].isData)
				vararr.push(data.Variables[i].name);
		}
		console.log(vararr);
		populate(vararr,"varid");
			
	});
	
}

function showData(){
	var variable= document.getElementById("variables").value;
	if (variable=="") return false;
	var id = document.getElementById("datasets").value;
	var lat = latlngobj.lat; //latitude from latlngobj in displayMap.js  
	var lng = latlngobj.lng;
	var currenturl = url+"/"+id+"/point"+key+"&var="+variable+"&lat="+lat+"&lon="+lng+"&count=10";
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
	});
	$("#cont").text("");
}

Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.responsive = false;
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
