var subscribeElem = document.getElementById('subscribe');
var zipElem = document.getElementById('zip');
var checkBoxElem = document.getElementById('checkbox');
var bodyElem = document.getElementById('app-body');
var api_key = 'AIzaSyBwPIs6AtnOsQzLagVL6KbdaDsxWH2_QpY';
var click_count = 0;

$('.carousel').carousel({
    interval: 5000
});

subscribeElem.style.opacity = "0.5";
subscribeElem.style.pointerEvents = "none";
zipElem.style.borderColor = "grey";

setTimeout(function(){
   $("#modalContainer").modal();
}, 1000);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var request = new XMLHttpRequest();
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + api_key;
        console.log('URL' + url);
        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                var address_components = response.results[0].address_components;
                address_components.map(function(component) {
                    if (component.types.includes('postal_code')) {
                        var zipCode = component.long_name.toString();
                        if (zipCode.match('[0-9]{5}') !== null && zipCode.length === 5) {
                            zipElem.value = zipCode;
                            $("#modalContainer").modal();
                        }
                    }
                });
            }
        }

        request.open("GET", url, true);
        request.send();
    });
}

checkBoxElem.addEventListener('change', function(event) {
    if (checkBoxElem.checked) {
        subscribeElem.style.opacity = "1";
        subscribeElem.style.pointerEvents = "initial";
    } else {
        subscribeElem.style.opacity = "0.5";
        subscribeElem.style.pointerEvents = "none";
    }
});

subscribeElem.addEventListener('click', function(event) {
    if (zipElem.value.match('[0-9]{5}') !== null && zipElem.value.length === 5) {
		document.getElementById("invalidInputMessage").innerHTML = "";
        $('#modalContainer').modal('hide');
        zipElem.style.borderColor = "grey";
        localStorage.setItem('click_count', click_count++);
        window.alert('Users Subscribed: ' + click_count);
    } else {
        zipElem.style.borderColor = "red";
		var invalidComp = document.getElementById("invalidInputMessage");
		invalidComp.innerHTML = "<span style='color:#FF0000'>Invalid Zip Code!!!</span>";
		invalidComp.style.fontsize = "small";
    }
});
