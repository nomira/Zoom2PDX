function initMap() {
	//make it a local later
	window.map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 45.5200, lng: 122.6819},
						 zoom: 6
						});
	var infoWindow = new google.maps.InfoWindow({map: window.map});

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {lat: position.coords.latitude,
							   lng: position.coords.longitude
							  };

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			window.map.setCenter(pos);
			}, function() {handleLocationError(true, infoWindow, window.map.getCenter()); });
		}
		else {
		// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow, window.map.getCenter());

		}
	myApp();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}
//Calculates score of school 
function calculate_score(school) {

    var total = 0;
//Drop out students of current year from last years
//If LESS drop outs CURRENT year from the previous, +1 SCORE!
    var res = school.SchoolInformation.Dropouts.DropoutStudentsPctCurrYear - school.SchoolInformation.Dropouts.DropoutStudentsPrevYearPct;
    if (res < 0) {
        ++total;
    }
//If MORE ATTENDANCE in CURRENT year from the PREVIOUS, +1 SCORE!
    res = school.SchoolInformation.Attendance.AttendancePctCurrYear - school.SchoolInformation.Attendance.AttendancePctPrevYear;
    if (res > 0) {
        ++total;
    }
//If STUDENTS/TEACHER ratio is less than 15/1, +2 SCORE!
//If STUDENTS/TEACHER ratio is less than 25/1, +1 SCORE!
    res = school.SchoolInformation.StudentPopulation.NumberOfStudents / school.SchoolInformation.Staffing.Teachers;
    if (res < 15) {
        total += 2;
    } else if (res < 25) {
        ++total;
    }

    if (school.SchoolInformation.Staffing.MastersDegreeOrHigherPct > 50) {
        total += 3;
    } else if (school.SchoolInformation.Staffing.MastersDegreeOrHigherPct > 35) {
        total += 2;
    } else if (school.SchoolInformation.Staffing.MastersDegreeOrHigherPct > 20) {
        ++total;
    }

    if (school.SchoolInformation.Staffing.AvgYearsExperience > 15) {
        total += 3;
    } else if (school.SchoolInformation.Staffing.AvgYearsExperience > 10) {
        total += 2;
    } else if (school.SchoolInformation.Staffing.AvgYearsExperience > 5) {
        ++total;
    }

    return total;
}
//Gets schools name
function get_school_data(school_id){
	var schoolid = "/"+school_id || "";
	return $.ajax({
		url: "http://api.civicapps.org/schools"+schoolid,
		dataType: "json",
	});
}
//Gets schools by location within a radius and returns schools near
function get_schools_by_location(latitude, longitude, distance){
	return $.ajax({
		url: "http://api.civicapps.org/schools/near/"
				 +latitude+","+longitude+"&distance="+distance,
		dataType: "json",
	});
}


