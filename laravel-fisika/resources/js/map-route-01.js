var map = tt.map({
    key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
    container: 'map',
    dragPan: !window.isMobileOrTablet()
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());
new Foldable('#foldable', 'top-right');
var bounds = new tt.LngLatBounds();
class RoutingAB {
    constructor() {
        this.state = {
            start: undefined,
            finish: undefined,
            marker: {
                start: undefined,
                finish: undefined
            }
        };
        this.startSearchbox = this.createSearchBox('start');
        this.createSearchBox('finish');
        this.closeButton = document.querySelector('.tt-search-box-close-icon');
        this.startSearchboxInput = this.startSearchbox.getSearchBoxHTML().querySelector('.tt-search-box-input');
        this.startSearchboxInput.addEventListener('input', this.handleSearchboxInputChange.bind(this));
        this.createMyLocationButton();
        this.switchToMyLocationButton();
        this.errorHint = new InfoHint('error', 'bottom-center', 5000)
            .addTo(document.getElementById('map'));
    }
    createMyLocationButton() {
        this.upperSearchboxIcon = document.createElement('div');
        this.upperSearchboxIcon.setAttribute('class', 'my-location-button');
        this.upperSearchboxIcon.addEventListener('click', function () {
            navigator.geolocation.getCurrentPosition(
                this.reverseGeocodeCurrentPosition.bind(this),
                this.handleError.bind(this)
            );
        }.bind(this));
    }
    handleSearchboxInputChange(event) {
        var inputContent = event.target.value;
        if (inputContent.length > 0) {
            this.setCloseButton();
        } else {
            var resultList = this.startSearchbox.getSearchBoxHTML().querySelector('.tt-search-box-result-list');
            if (resultList || inputContent.length === 0) {
                return;
            }
            this.onResultCleared('start');
        }
    }
    reverseGeocodeCurrentPosition(position) {
        this.state.start = [position.coords.longitude, position.coords.latitude];
        tt.services.reverseGeocode({
            key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
            position: this.state.start
        })
            .then(this.handleRevGeoResponse.bind(this))
            .catch(this.handleError.bind(this));
    }
    handleRevGeoResponse(response) {
        var place = response.addresses[0];
        this.state.start = [place.position.lng, place.position.lat];
        this.startSearchbox.setValue(place.address.freeformAddress);
        this.onResultSelected(place, 'start');
    }
    calculateRoute() {
        if (map.getLayer('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        if (!this.state.start || !this.state.finish) {
            return;
        }
        this.errorHint.hide();
        var startPos = this.state.start.join(',');
        var finalPos = this.state.finish.join(',');
        tt.services.calculateRoute({
            key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
            traffic: false,
            locations: startPos + ':' + finalPos
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
                        'line-color': '#2faaff',
                        'line-width': 8
                    }
                }, this.findFirstBuildingLayerId());
                var coordinates = geojson.features[0].geometry.coordinates;
                this.updateRoutesBounds(coordinates);
            }.bind(this))
            .catch(this.handleError.bind(this));
    }
    handleError(error) {
        this.errorHint.setErrorMessage(error);
    }
    drawMarker(type, viewport) {
        if (this.state.marker[type]) {
            this.state.marker[type].remove();
        }
        var marker = document.createElement('div');
        var innerElement = document.createElement('div');
        marker.className = 'route-marker';
        innerElement.className = 'icon tt-icon -white -' + type;
        marker.appendChild(innerElement);
        this.state.marker[type] = new tt.Marker({ element: marker })
            .setLngLat(this.state[type])
            .addTo(map);
        this.updateBounds(viewport);
    }
    updateBounds(viewport) {
        bounds = new tt.LngLatBounds();
        if (this.state.start) {
            bounds.extend(tt.LngLat.convert(this.state.start));
        }
        if (this.state.finish) {
            bounds.extend(tt.LngLat.convert(this.state.finish));
        }
        if (viewport) {
            bounds.extend(tt.LngLat.convert(viewport.topLeftPoint));
            bounds.extend(tt.LngLat.convert(viewport.btmRightPoint));
        }
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { duration: 0, padding: 50 });
        }
    }
    updateRoutesBounds(coordinates) {
        bounds = new tt.LngLatBounds();
        coordinates.forEach(function (point) {
            bounds.extend(tt.LngLat.convert(point));
        });
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { duration: 0, padding: 50 });
        }
    }
    createSearchBox(type) {
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
        searchBox.on('tomtom.searchbox.resultsfound', function (event) {
            handleEnterSubmit(event, this.onResultSelected.bind(this), this.errorHint, type);
        }.bind(this));
        searchBox.on('tomtom.searchbox.resultselected', function (event) {
            if (event.data && event.data.result) {
                this.onResultSelected(event.data.result, type);
            }
        }.bind(this));
        searchBox.on('tomtom.searchbox.resultscleared', this.onResultCleared.bind(this, type));
        return searchBox;
    }
    onResultSelected(result, type) {
        var pos = result.position;
        this.state[type] = [pos.lng, pos.lat];
        if (type === 'start') {
            this.setCloseButton();
        }
        this.drawMarker(type, result.viewport);
        this.calculateRoute();
    }
    onResultCleared(type) {
        this.state[type] = undefined;
        if (this.state.marker[type]) {
            this.state.marker[type].remove();
            this.updateBounds();
        }
        if (type === 'start') {
            this.switchToMyLocationButton();
        }
        this.calculateRoute();
    }
    setCloseButton() {
        var inputContainer = document.querySelector('.tt-search-box-input-container');
        this.closeButton.classList.remove('-hidden');
        if (document.querySelector('.my-location-button')) {
            inputContainer.replaceChild(this.closeButton, this.upperSearchboxIcon);
        }
    }
    switchToMyLocationButton() {
        var inputContainer = document.querySelector('.tt-search-box-input-container');
        inputContainer.replaceChild(this.upperSearchboxIcon, this.closeButton);
    }
    findFirstBuildingLayerId() {
        var layers = map.getStyle().layers;
        for (var index in layers) {
            if (layers[index].type === 'fill-extrusion') {
                return layers[index].id;
            }
        }
        throw new Error('Map style does not contain any layer with fill-extrusion type.');
    }
}
new RoutingAB();
