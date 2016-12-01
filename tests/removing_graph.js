module.exports = {
  'Test: successfully removing a graph' : function (client) {
    client
    //generating a graph
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
		.click('#generateGraph')
		.pause(5000)
		.assert.visible('#graph')
		.pause(5000)
		.click('#chart0')
		.pause(2000)
		.assert.visible('#myModal')
		.pause(5000)
        //clicking on remove button
        .click('#remove')
        .pause(1000)
        .assert.elementNotPresent('#chart0')
        .pause(1000)
		.end();
		
  }
};