$(document).ready(function() {
			$('#datePicker1')
				.datepicker({
					format: 'mm/dd/yyyy',
					startDate:"",
					endDate:"",
					autoclose:true,
					toggleActive:true,
					todayHighlight:true,
				})
				.on('changeDate', function(e) {
					var startdate;
					if (e.dates.length===0){
						startdate="";
					}
					else {
						startdate = new Date(e.date.valueOf());
					}
					$("#datePicker2").datepicker("setStartDate",startdate);
				});
				$('#datePicker2')
				.datepicker({
					format: 'mm/dd/yyyy',
					autoclose:true,
					toggleActive:true,
					todayHighlight:true,
				})
				.on('changeDate', function(e) {
				   
					var enddate;
					if (e.dates.length===0){
						enddate="";
					}
					else {
						enddate = new Date(e.date.valueOf());
					}
					$("#datePicker1").datepicker("setEndDate",enddate);
				});
			$('.s2').dropdown();
			$('#datasets').dropdown({
				allowReselection:false,
				onChange:getVariables,
			});
	});