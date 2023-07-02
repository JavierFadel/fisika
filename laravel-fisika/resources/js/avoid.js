tt.setProductInfo('Codepen Examples', '${analytics.productVersion}');

var map = tt.map({
    key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
    container: 'map',
    center: [6.315226, 45.095108],
    zoom: 1,
    dragPan: !isMobileOrTablet()
});
var errorHint = new InfoHint('error', 'bottom-center', 3000).addTo(document.getElementById('map'));
var loadingHint = new InfoHint('info', 'bottom-center').addTo(document.getElementById('map'));
var distanceValueDOMElement = document.querySelector('.distance-value');
var timeValueDOMElement = document.querySelector('.time-value');
var avoidOptions = ['tollRoads', 'motorways', 'ferries', 'unpavedRoads', 'carpools', 'alreadyUsedRoads'];
var coordinates = [], startMarker, finishMarker;

new Foldable('.js-foldable', 'top-right');
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
map.on('load', function () {
    return debouncedCalculateRouteRequest();
});

avoidOptions.forEach(function (element) {
    document.getElementById(element).onchange = function () {
        return debouncedCalculateRouteRequest();
    };
});

var debouncedCalculateRouteRequest = debounce(function () {
    return performCalculateRouteRequest();
}, 500);

function addMarkers() {
    var startPoint = coordinates[0];
    var endPoint = coordinates[coordinates.length - 1];
    startMarker = new tt.Marker({ element: createMarkerElement('start') }).setLngLat(startPoint).addTo(map);
    finishMarker = new tt.Marker({ element: createMarkerElement('finish') }).setLngLat(endPoint).addTo(map);
}

function clearRoute() {
    if (!map.getLayer('route')) {
        return;
    }
    map.removeLayer('route');
    map.removeSource('route');
}

function createMarkerElement(type) {
    var element = document.createElement('div');
    var innerElement = document.createElement('div');
    element.className = 'static-marker';
    innerElement.className = 'tt-icon -white -' + type;
    element.appendChild(innerElement);
    return element;
}

function createSummaryContent(summary) {
    distanceValueDOMElement.textContent =
        Formatters.formatAsMetricDistance(summary.lengthInMeters);
    timeValueDOMElement.textContent =
        Formatters.formatToDurationTimeString(summary.travelTimeInSeconds);
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

function fitMapToCoordinates() {
    var bounds = new tt.LngLatBounds();
    coordinates
        .forEach(function (point) {
            bounds.extend(tt.LngLat.convert(point));
        });
    map.fitBounds(bounds, { duration: 0, padding: 50 });
}

function handleError(error) {
    if (startMarker) {
        startMarker.remove();
        startMarker = null;
    }
    if (finishMarker) {
        finishMarker.remove();
        finishMarker = null;
    }
    distanceValueDOMElement.textContent = '';
    timeValueDOMElement.textContent = '';
    loadingHint.hide();
    errorHint.setMessage(error.message || error.data.error.description);
}

function performCalculateRouteRequest() {
    errorHint.hide();
    loadingHint.setMessage('Loading...');
    var checkedAvoidOptions = avoidOptions
        .filter(function (element) {
            return document.getElementById(element).checked;
        });
    clearRoute();
    tt.services.calculateRoute({
        key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
        traffic: true,
        locations: '19.461679,51.624251:19.502449,51.613646:' +
            '19.448547,51.726177:18.751602,52.870373:' +
            '18.976135,52.913042:18.232498,52.22822',
        avoid: checkedAvoidOptions
    })
        .then(function (response) {
            var geojson = response.toGeoJson();
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': geojson
                },
                'paint': {
                    'line-color': '#4a90e2',
                    'line-width': 6
                }
            });
            loadingHint.hide();
            coordinates = geojson.features[0].geometry.coordinates
                .reduce(function (acc, ele) {
                    return acc.concat(ele);
                }, []);
            addMarkers();
            createSummaryContent(geojson.features[0].properties.summary);
            fitMapToCoordinates();
        })
        .catch(handleError);
}
