module.exports = {
  'Test: generating a permalink from url' : function (client) {
    client
		.url('http://tarkvaraprojektos.herokuapp.com/{"id":"noaa_icoads_enhanced_1d_day","variable":"uspeh_sextile5","prettyVariable":"Latent Heat Trans Eastward Param Monthly 5th Sextile at Surface","lat":51.204,"lng":-34.18,"start":"","end":"","style":"bar","unit":"grams!kg m!s","multigraph":false}')
		.waitForElementPresent('body', 1000)
		.assert.visible('#graph')
		.pause(5000)
		.click('#chart0')
		.pause(2000)
		.end();
  },
	'Test: multigraph permalink': function(client){
		client
		.url('http://tarkvaraprojektos.herokuapp.com/{"id":"noaa_icoads_enhanced_1d_day,noaa_icoads_enhanced_1d_day","variable":"uspeh_sextile5,shum_sextile3","prettyVariable":"Latent Heat Trans Eastward Param Monthly 5th Sextile at Surface,Specific Humidity Monthly 3rd Sextile at Surface","lat":"51.204,,51.836","lng":"-34.18,,-24.258","start":",","end":",","style":"bar,bar","unit":"grams!kg m!s,grams!kg","multigraph":true}')
		.waitForElementPresent('body', 1000)
		.assert.visible('#graph')
		.pause(5000)
		.click('#chart2')
		.pause(2000)
		.end();
	}
};