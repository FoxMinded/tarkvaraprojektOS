module.exports = {
  'Test: variable not filled' : function (client) {
    client
    //generating a graph
		.url('http://tarkvaraprojektos.herokuapp.com/')
		.waitForElementPresent('body', 1000)
		.click('#markerButton')
		.pause(1000)
		.click('#map')
		.pause(1000)
		.click('select[id="datasets"] option[value="noaa_gfs_global_sflux_0.12d"]')
		.pause(2000)
		.assert.containsText('#datasets','GFS global weather forecast by NCEP. Near surface parameters.')
		//.click('select[id="varid"] option[value="Maximum_temperature_height_above_ground_3_Hour_Interval"]')
		.pause(2000)
		.click('#generateGraph')
        .assert.elementNotPresent('#chart0')
        .pause(1000)
		.end();
		
  },
  'Test2: Nothing filled from the form': function(client) {
    client
        .url('http://tarkvaraprojektos.herokuapp.com/')
		.waitForElementPresent('body', 1000)
        .click('#generateGraph')
        .assert.elementNotPresent('#chart0')
        .pause(1000)
		.end();
  }
};