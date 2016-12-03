module.exports = {
  'Test: successfully combining 2 graphs' : function (client) {
    client
		.url('http://tarkvaraprojektos.herokuapp.com/')
		.waitForElementPresent('body', 1000)
		.click('#markerButton')
		.pause(1000)
		.click('#map')
		.pause(1000)
		.click("#datasets")
		.click("div.menu > div:nth-child(1)")
		.pause(2000)
		.click("div.ui.fluid.search.selection.dropdown.s2")
		.pause(2000)
		.click('#generateGraph')
		.pause(5000)
        //.click('select[id="datasets"] option[value="noaa_gfs_global_sflux_0.12d"]')
        //.pause.(1000)
		.click("#datasets")
		.click("div.menu > div:nth-child(2)")
		.pause(1000) 
		.click("div.ui.fluid.search.selection.dropdown.s2")
		.click('#generateGraph')
		.pause(1000)
		.assert.visible('#graph')
		.pause(5000)
		.click('#chart1')
		.pause(2000)
		.assert.visible('#myModal')
		.pause(5000)
        	.click('#combine')
        	.pause(4000)
        	.click("#chart00")
        	.pause(1000)
        	.assert.elementPresent('#chart2')
		.end();
		
  }
};
