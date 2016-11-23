// okay, so do I need to duplicate other methods as well or I can just use them?
function generateGraphPermaVersion(input){
	input=decode(input);
	input=JSON.parse(input);
	var currenturl = url+"/"+input.id+"/point"+key+"&var="+input.variable+"&lat="+
						input.lat+"&lon="+input.lng+
						"&start="+input.start+"&end="+input.end+"&count=20";
	makeRequest(input.id, input.variable);
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