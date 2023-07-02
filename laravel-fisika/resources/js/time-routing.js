var map = tt.map({
    key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
    container: 'map',
    dragPan: !isMobileOrTablet()
});
var finishMarkerElement = createMarkerElement('finish');
var startMarkerElement = createMarkerElement('start');
var errorHint = new InfoHint('error', 'bottom-center', 5000).addTo(document.getElementById('map'));
var loadingHint = new InfoHint('info', 'bottom-center').addTo(document.getElementById('map'));
var resultsManager = new ResultsManager();
var routeMarkers = {}, routePoints = {}, searchBox = {};
map.addControl(new tt.FullscreenControl({ container: document.querySelector('body') }));
map.addControl(new tt.NavigationControl());
map.on('load', function () {
    searchBox.start = createSearchBox('start');
    searchBox.finish = createSearchBox('finish');
});
function addRouteMarkers(type, point) {
    var lngLat = point && point[type + 'Point'] || routePoints[type];
    if (!routeMarkers[type] && routePoints[type]) {
        routeMarkers[type] = createMarker(type, lngLat);
    }
    if (routeMarkers[type]) {
        routeMarkers[type].setLngLat(routePoints[type]);
    }
}
function createMarkerElement(type, index) {
    var element = document.createElement('div');
    var innerElement = document.createElement('div');
    element.className = type === 'instruction' ?
        'guidance-marker-' + (index || '') :
        'supporting-marker';
    innerElement.className = 'tt-icon -white -' + type;
    element.appendChild(innerElement);
    return element;
}
function centerMap(lngLat) {
    map.flyTo({
        center: lngLat,
        speed: 10,
        zoom: 8
    });
}
function clearMap() {
    if (!map.getLayer('route')) {
        return;
    }
    map.removeLayer('route');
    map.removeSource('route');
}
function createMarker(type, lngLat) {
    var markerElement = type === 'start' ? startMarkerElement : finishMarkerElement;
    return new tt.Marker({ draggable: true, element: markerElement })
        .setLngLat(lngLat)
        .addTo(map)
        .on('dragend', getDraggedMarkerPosition.bind(null, type));
}
function createSearchBox(type) {
    var searchBox = new tt.plugins.SearchBox(tt.services, {
        showSearchButton: false,
        searchOptions: {
            key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL'
        },
        labels: {
            placeholder: 'Query e.g. Washington'
        }
    });
    document.getElementById(type + 'SearchBox').appendChild(searchBox.getSearchBoxHTML());
    searchBox.on('tomtom.searchbox.resultscleared', onResultCleared.bind(null, type));
    searchBox.on('tomtom.searchbox.resultsfound', function (event) {
        handleEnterSubmit(event, onResultSelected.bind(this), errorHint, type);
    });
    searchBox.on('tomtom.searchbox.resultselected', function (event) {
        if (event.data && event.data.result) {
            onResultSelected(event.data.result, type);
        }
    });
    return searchBox;
}
function getDraggedMarkerPosition(type) {
    var lngLat = routeMarkers[type].getLngLat();
    performReverseGeocodeRequest(lngLat)
        .then(function (response) {
            var address = response.addresses[0];
            var freeFormAddress = address.address.freeformAddress;
            if (!freeFormAddress) {
                loadingHint.hide();
                clearMap();
                resultsManager.resultsNotFound();
                errorHint.setMessage('Address not found, please choose a different place');
                return;
            }
            searchBox[type]
                .getSearchBoxHTML()
                .querySelector('input.tt-search-box-input')
                .value = freeFormAddress;
            var position = {
                lng: address.position.lng,
                lat: address.position.lat
            };
            updateMapView(type, position);
        });
}
function handleCalculateRouteError() {
    clearMap();
    resultsManager.resultsNotFound();
    errorHint.setMessage('There was a problem calculating the route');
    loadingHint.hide();
}
function handleCalculateRouteResponse(response, type) {
    var geojson = response.toGeoJson();
    var feature = geojson.features[0];
    var coordinates = feature.geometry.coordinates;
    var guidance = feature.properties.guidance;
    clearMap();
    resultsManager.success();
    var guidancePanelElement = DomHelpers.elementFactory('div', 'guidance-panel');
    resultsManager.append(guidancePanelElement);
    var guidancePanel = new GuidancePanel(guidance, {
        map: map,
        coordinates: coordinates
    });
    guidancePanel.bindEvents();
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
    var bounds = new tt.LngLatBounds();
    var point = {
        startPoint: coordinates[0],
        finishPoint: coordinates.slice(-1)[0]
    };
    addRouteMarkers(type, point);
    coordinates.forEach(function (point) {
        bounds.extend(tt.LngLat.convert(point));
    });
    map.fitBounds(bounds, { duration: 0, padding: 50 });
    loadingHint.hide();
}
function handleDrawRoute(type) {
    errorHint.hide();
    loadingHint.setMessage('Loading...');
    resultsManager.loading();
    performCalculateRouteRequest()
        .then(function (response) {
            handleCalculateRouteResponse(response, type);
        })
        .catch(handleCalculateRouteError);
}
function onResultCleared(type) {
    routePoints[type] = null;
    if (routeMarkers[type]) {
        routeMarkers[type].remove();
        routeMarkers[type] = null;
    }
    if (shouldDisplayPlaceholder()) {
        resultsManager.resultsNotFound();
    }
    if (routePoints.start || routePoints.finish) {
        var lngLat = type === 'start' ? routePoints.finish : routePoints.start;
        clearMap();
        centerMap(lngLat);
    }
}
function onResultSelected(result, type) {
    var position = result.position;
    updateMapView(type, position);
}
function performCalculateRouteRequest() {
    return tt.services.calculateRoute({
        key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
        instructionsType: 'tagged',
        traffic: false,
        locations: routePoints.start.join() + ':' + routePoints.finish.join()
    });
}
function performReverseGeocodeRequest(lngLat) {
    return tt.services.reverseGeocode({
        key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
        position: lngLat
    });
}
function shouldDisplayPlaceholder() {
    return !(routePoints.start && routePoints.finish);
}
function updateMapView(type, position) {
    routePoints[type] = [position.lng, position.lat];
    if (routePoints.start && routePoints.finish) {
        handleDrawRoute(type);
    } else {
        addRouteMarkers(type);
        centerMap(routePoints[type]);
    }
}
