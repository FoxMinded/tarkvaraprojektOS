module.exports = {
  'Test' : function (client) {
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
		.click('#generateGraph')
		.pause(5000)
		.assert.visible('#graph')
		.pause(5000)
		.click('#chart0')
		.pause(2000)
		.assert.visible('#myModal')
		.pause(5000)
		.end();
		
  }
};
