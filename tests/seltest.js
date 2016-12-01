module.exports = {
  'Test: successfully generating 1 graph, confirming modal view' : function (client) {
    client
		.url('http://tarkvaraprojektos.herokuapp.com/')
		.waitForElementPresent('body', 1000)
		.click('#markerButton')
		.pause(1000)
		.click('#map')
		.pause(1000)
		.click("#datasets")
		.click("div.menu > div:nth-child(1)")//<----
		.pause(2000)
		.assert.containsText('#datasets','GFS global weather forecast by NCEP. Near surface parameters.')
		.assert.visible("#div2")
		//.assert.visible("#div2:nth-child(3)")
		.click("div.ui.fluid.search.selection.dropdown.s2")
		.click("div.item.selected")
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
