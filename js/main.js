var anmiationSpeed = 1000;
var animationEasing = "easeOutElastic";

function openingAnimation() {
	$('.type.dancer').stop().delay(200).animate({
		left: '-60',
		top: '151',
		opacity: '1'
	}, anmiationSpeed, animationEasing, function(){
	});	
	$('.type.musician').stop().delay(350).animate({
		left: '0',
		top: '151',
		opacity: '1'
	}, anmiationSpeed, animationEasing, function(){
	});	
	$('.type.grafitti').stop().delay(650).animate({
		left: '60',
		top: '151',
		opacity: '1'
	}, anmiationSpeed, animationEasing, function() {
	});	
	$('.type.others').stop().delay(500).animate({
		left: '120',
		top: '151',
		opacity: '1'
	}, anmiationSpeed, animationEasing, function() {
	});	
}

function closeAnimation() {
	$('.type.dancer, .type.musician, .type.grafitti, .type.others').stop().animate({
		left: '30',
		top: '35',
		opacity: '0'
	}, anmiationSpeed, 'easeOutQuart', function() {
	});	
}

function showPosition(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	$('#lat').val(lat);
	$('#long').val(lng);
}

function showError(error){
	var x=document.getElementById("geoError");
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
		  x.innerHTML="User denied the request for Geolocation."
		  break;
		case error.POSITION_UNAVAILABLE:
		  x.innerHTML="Location information is unavailable."
		  break;
		case error.TIMEOUT:
		  x.innerHTML="The request to get user location timed out."
		  break;
		case error.UNKNOWN_ERROR:
		  x.innerHTML="An unknown error occurred."
		  break;
	}
	geoError();
}

var dataUrl = "http://www.wentin.co/artmap/data.php";
//var dataUrl = "data.php";
var createUrl = "http://www.wentin.co/artmap/create_pin.php";
//var createUrl = "create_pin.php";

function submitSuccess(lat, long) {
	$.ajax({
		type:"POST",
		url: dataUrl,
		datatype: "html",
		success: function(data, textStatus, xhr) {
			$('#data').html(data);		   	
			$('#data table tr').each(function(){
				var obj = [];
					// Art type
					obj[0] = $(this).children('td').eq(0).html();
					// lat
					obj[1] = $(this).children('td').eq(1).html(),
					// long
					obj[2] = $(this).children('td').eq(2).html();
					// disc
					obj[3] = $(this).children('td').eq(4).html();	
					// image
					obj[4] = $(this).children('td').eq(5).html();		
				arr.push(obj);
			});	
			initialize();				
			google.maps.event.trigger(markerGroup[markerGroup.length - 1], "click");
		}
	});
	$('#success').delay(200).fadeIn().delay(1000).fadeOut();
	var submitLat = lat;
	var submitLong = long;
}

function submitFail() {
	$('#fail').delay(200).fadeIn().delay(1000).fadeOut();	
}
var geoErrorFlag = 0;
function geoError() {
	$('#geoError').delay(200).fadeIn();	
	geoErrorFlag = 1;
}

$(function(){
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);		
	} else {
		$('#geoError').html("navigator.geolocation is not available");
		geoError();
	}
		
	$('.type').click(function(){
		$('.type').removeClass('selected');
		$(this).addClass('selected');
	})
		
	$('.hideBtn').click(function(){
		$('.type').removeClass('selected');
		$('#newDisc').val('');
		$('.pinBody').slideUp();
		closeAnimation();
	})
	
	$('.pinHead').click(function(e){
		if ( !geoErrorFlag ) {
			e.preventDefault();
			$('.pinBody').slideDown();
			openingAnimation();
		}
	})
	
	$('.pinBtn').click(function(e){
		e.preventDefault();
		$('input#type').val($('.type.selected').text());
		$('#disc').val($('#newDisc').val());	
		$('.type').removeClass('selected');
		$('#newDisc').val('');
		$('input#submit').trigger('click');
	})
	
	$("#create_pin").submit(function(event) {
	 	event.preventDefault();
		var values = $(this).serialize();
		var submitLat = $(this).serializeArray()[0].value;
		var submitLong = $(this).serializeArray()[1].value;
		var submitType = $(this).serializeArray()[2].value;
		var submitDisc = $(this).serializeArray()[3].value;	
		$.ajax({
		  url: createUrl,
		  type: "post",
		  data: values,
		  success: function(){					
			submitSuccess(submitLat, submitLong);
			$('.pinBody').slideUp();
			closeAnimation();
		  },
		  error:function(){
			submitFail();
		  }   
		}); 
	});
		
	$.ajax({
		type:"POST",
		url: dataUrl,
		datatype: "html",
		success: function(data, textStatus, xhr) {
			$('#data').html(data);		   	
			$('#data table tr').each(function(){
				var obj = [];
					// Art type
					obj[0] = $(this).children('td').eq(0).html();
					// lat
					obj[1] = $(this).children('td').eq(1).html(),
					// long
					obj[2] = $(this).children('td').eq(2).html();
					// disc
					obj[3] = $(this).children('td').eq(4).html();		
					// image
					obj[4] = $(this).children('td').eq(5).html();	
				arr.push(obj);
			});	
			initialize();
		}
	});

})

var map, infowindow;
var arr = [];
var markerGroup = [];

function initialize() {
  var zoom = 13, nlat = 40.73586, nlong = -73.99108;
  
  var myOptions = {
    zoom: zoom,
    center: new google.maps.LatLng(nlat, nlong),
	panControl: false,
	zoomControl: true,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	overviewMapControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  for(var i=0; i<arr.length; i++) {
	  setMarkers(map, arr[i], setTypeIcon(arr[i][0]));
  }
}

function setTypeIcon(type){
  switch(type){
	case "Grafitti":
	  return "images/pin_grafitti.png";
	  break;
	case "grafitti":
	  return "images/pin_grafitti.png";
	  break;
	case "Dancer":
	  return "images/pin_dancer.png";
	  break;
	case "dancer":
	  return "images/pin_dancer.png";
	  break;
	case "Musician":
	  return "images/pin_musician.png";
	  break;
	case "singer":
	  return "images/pin_musician.png";
	  break;
	case "instrumentalist":
	  return "images/pin_musician.png";
	  break;
	default:
	  return "images/pin_others.png";
  }
}

function setTypeOverlay(type){
  switch(type){
	case "Grafitti":
	  return "Grafitti";
	  break;
	case "grafitti":
	  return "Grafitti";
	  break;
	case "Dancer":
	  return "Dancer";
	  break;
	case "dancer":
	  return "Dancer";
	  break;
	case "Musician":
	  return "Musician";
	  break;
	case "singer":
	  return "Musician";
	  break;
	case "instrumentalist":
	  return "Musician";
	  break;
	default:
	  return "Others";
  }
}

function setMarkers(map, location, iconImageUrl) {
	var artIcon = {
		url: iconImageUrl,
		size: new google.maps.Size(20, 20),
		origin: new google.maps.Point(0, 0),
		anchor: google.maps.Point(0, 20)
	};
	var shape = {
		coord: [1, 1, 1, 150, 180, 150, 180 , 1],
		type: 'poly'
	};
	
	var myLatLng = new google.maps.LatLng(location[1], location[2]);
	
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		draggable:false,
		icon: artIcon,
		/*icon: {
			path: google.maps.SymbolPath.CIRCLE,
			strokeWeight: 0,
			fillColor: "#e64660",
			fillOpacity: 1,
			scale: 8
		},*/
		shape: shape,
		title: location[0]
	});
	markerGroup.push(marker);

	var styles = [
	  {
		stylers: [
		  { hue: "#586065" },
		  { saturation: -100 }
		]
	  },{
		featureType: "road",
		elementType: "geometry",
		stylers: [
		  { lightness: 100 },
		  { visibility: "simplified" }
		]
	  },{
		featureType: "road",
		elementType: "labels",
		stylers: [
		  { visibility: "off" }
		]
	  }
	];
	
	map.setOptions({styles: styles});
	if(location[4] != ''){
		var contentString = '<div class="artistDetail '+ setTypeOverlay(location[0]) +'"><table cellpadding="0" cellspacing="0" ><tr><th>Art Type</th><td>'+setTypeOverlay(location[0])+'</td></tr><tr><th>Comments</th><td>' 
	+ location[3] + '&nbsp;</td></tr></table><img src="http://www.wentin.co/artmap/uploads/' + location[4] + '"></div>"'
	} else {
		var contentString = '<div class="artistDetail '+ setTypeOverlay(location[0]) +'"><table cellpadding="0" cellspacing="0"><tr><th>Art Type</th><td>'+setTypeOverlay(location[0])+'</td></tr><tr><th>Comments</th><td>' 
	+ location[3] + '&nbsp;</td></tr></table></div>"'
		
	}
			
	google.maps.event.addListener(marker, 'click', function() {
		//map.setZoom(marker.zIndex);
		map.setCenter(marker.getPosition());
		marker.setAnimation(null);
		if (infowindow) infowindow.close();
      	infowindow = new google.maps.InfoWindow({content: contentString});
		infowindow.open(map,marker);
	});
	
}
