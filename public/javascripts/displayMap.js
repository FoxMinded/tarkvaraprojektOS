
L.mapbox.accessToken = 'pk.eyJ1IjoicGxhbmV0b3MiLCJhIjoiZjZkNDE4MTE5NWNhOGYyMmZhZmNhMDQwMDg0YWMyNGUifQ.htlwo6U82iekTcpGtDR_dQ';

var map = L.mapbox.map('map',null,{ zoomControl:false }).setView([39.00,34,00],2);  		
var zoomControl = L.control.zoom({position:"topright"});
map.addControl(zoomControl);

var layer2 = L.mapbox.tileLayer('mapbox.light');
map.addLayer(layer2);

var featureGroup = L.featureGroup();
map.addLayer(featureGroup);


var polygonDraw = new L.Draw.Polygon(map);
var markerDraw = new L.Draw.Marker(map);

$("#polyButton").on("click",drawPolygon);
$("#markerButton").on("click",drawMarker);

function drawMarker(){
	markerDraw.enable();
	$("#markerButton").text("Remove mark");
	$("#markerButton").off('click').on('click', removeMarker);
}
function removeMarker(){
	$("#markerButton").text("Mark a point");
	
	featureGroup.removeLayer(layer);
	$("#coordinates").text("");
	$("#markerButton").off('click').on('click', drawMarker);
				
}

function drawPolygon(){
	polygonDraw.enable();
	$("#polyButton").text("Remove polygon").css({"background-color":"#707070"});
	$("#polyButton").off('click').on('click', removePolygon);
	
}
function removePolygon(){
	$("#polyButton").text("Draw polygon").css("background-color","#FCFCFC");
	
	featureGroup.removeLayer(layer);
	$("#polyButton").off('click').on('click', drawPolygon);
				
}




map.on("draw:drawstart", function(e){
	//console.log("drawstart");
});
map.on("draw:drawstop", function(e){
	$("#datasets").attr("disabled",false);
	//console.log("drawstop");
});
map.on("draw:drawvertex", function(e){
	console.log("drawvertex");
});
map.on("draw:editstart", function(e){
	console.log("editstart");
});
map.on("draw:editmove", function(e){
	console.log("editmove");
});
map.on("draw:editresize", function(e){
	console.log("editresize");
});
map.on("draw:editstop", function(e){
	console.log("editstop");
});
var layer = {};
var latlngobj = {
	lat :"",
	lng :"",
	draw : function(){
			return "( "+this.lat +", "+this.lng +" )";
	}
		
};
map.on('draw:created', function(e) {
	layer=e.layer;
	if(e.layerType=="marker"){
		e.layer.options.draggable=true;
		//console.log(e.layer.getLatLng());
		latlngobj.lat=Math.round(e.layer.getLatLng().lat*1000)/1000;
		latlngobj.lng=Math.round(e.layer.getLatLng().lng*1000)/1000;
		//console.log(latlngobj);
		displayCoord([e.layer.getLatLng()]);		
		e.layer.on("drag",function(e){
			//console.log("dragging");
			latlngobj.lat=Math.round(e.target.getLatLng().lat*1000)/1000;
			latlngobj.lng=Math.round(e.target.getLatLng().lng*1000)/1000;
			displayCoord([e.target.getLatLng()]);
					
		});
		featureGroup.addLayer(e.layer);
		return ;
	};
	e.layer.editing.enable();//after creating polygon, allow editing
	displayCoord(e.layer.getLatLngs());
	
	var area = L.GeometryUtil.geodesicArea(layer.getLatLngs())/1000000;
	$("#area").text(Math.round(area*100)/100);
	
	
	e.layer.on("edit",function(e){
		displayCoord(e.target.getLatLngs());
		var area = L.GeometryUtil.geodesicArea(layer.getLatLngs())/1000000;
		$("#area").text(Math.round(area*100)/100);
		
	});	
	
	featureGroup.addLayer(e.layer);
});


map.on('draw:edited', function (e) {
	console.log("edited");
	var layers = e.layers;    	
	layers.eachLayer(function (layer) {
		
	});
   
});

map.on("draw:deleted", function(e) {
	console.log("deleted");
	
});

function displayCoord(coord){
	var text="";
	/*
	for (var val of coord){
		text +="("+Math.round(val.lat * 1000) / 1000+", "
					+Math.round(val.lng*1000)/1000+") ";
		
	}
	*/
	$("#coordinates").text(latlngobj.draw());
}

