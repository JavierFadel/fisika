var state = {
    style: 'relative0'
};

var map = tt.map({
    key: 'WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL',
    container: 'map',
    style: getCurrentStyleUrl(),
    stylesVisibility: {
        trafficFlow: true
    },
    center: [107.6191, -6.9175],
    zoom: 12,
    dragPan: !isMobileOrTablet()
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

new Foldable('.js-foldable', 'top-right');
var styleSelect = tail.select('.js-style-select', {
    classNames: 'tt-fake-select',
    hideSelected: true
});

styleSelect.on('change', function (event) {
    state.style = event.value;
    map.setStyle(getCurrentStyleUrl());
});

function getCurrentStyleUrl() {
    return 'https://api.tomtom.com/style/1/style/21.1.0-*?map=basic_main' +
        '&traffic_flow=flow_' + state.style + '&poi=poi_main&key=WFbdIdfQ5ZAEX2XpYr4WfNi44Pi6gVSL';
}
