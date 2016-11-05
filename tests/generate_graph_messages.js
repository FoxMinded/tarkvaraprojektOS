/*
*       TODO: add one test about wrong area (sea dataset in land); combine graph when only 1 graph exists 
*/
module.exports = {
  'Predicitive dataset: wrong dates' : function (client) {
    client
		.url('http://tarkvaraprojektos.herokuapp.com/')
		.waitForElementPresent('body', 1000)
		.click('#markerButton')
		.pause(1000)
		.click('#map')
		.pause(1000)
		.click('select[id="datasets"] option[value="noaa_gfs_global_sflux_0.12d"]')
		.pause(2000)
		.assert.containsText('#datasets','GFS global weather forecast by NCEP. Near surface parameters.')
		.click('select[id="varid"] option[value="Maximum_temperature_height_above_ground_3_Hour_Interval"]')
		.pause(2000)
		.assert.containsText('#varid','Maximum temperature (3_Hour Interval) @ Specified height level above ground')
		.pause(2000)
        //aeg
        .setValue('#StarT','10/10/2016')
        .setValue('#end','10/26/2016')
		.click('#generateGraph')
		.assert.elementPresent('#feedback')
		
		.pause(500)
		.end();
		
  }
};