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
		.click("#datasets")
		.click("div.menu > div:nth-child(1)")
		.pause(2000)
		.assert.containsText('#datasets','GFS global weather forecast by NCEP. Near surface parameters.')
		.click("div.ui.fluid.search.selection.dropdown.s2")
		.click("div.item.selected")
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