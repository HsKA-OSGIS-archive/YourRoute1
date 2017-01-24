/*
    BRouter web - web client for BRouter bike routing engine

    Licensed under the MIT license.
*/

(function() {

    var mapContext;

    function initApp(mapContext) {
        var map = mapContext.map,
            layersControl = mapContext.layersControl,
            search,
            router,
            routing,
            routingOptions,
            nogos,
            stats,
            itinerary,
            elevation,
            
            trackMessages,
            drawButton,
            deleteButton,
            drawToolbar,
            permalink,
            leftPaneId = 'leftpane',
            saveWarningShown = false;

        // left sidebar as additional control position
        map._controlCorners[leftPaneId] = L.DomUtil.create('div', 'leaflet-' + leftPaneId, map._controlContainer);

        document.getElementById('about_link').onclick = function() {
            bootbox.alert({
                title: 'About',
                message: document.getElementById('about').innerHTML
            });
        };

        search = new BR.Search();
        map.addControl(search);

        router = L.bRouter(); //brouterCgi dummyRouter

        drawButton = L.easyButton({
            states: [{
                stateName: 'deactivate-draw',
                icon: 'fa-pencil active',
                onClick: function (control) {
                    routing.draw(false);
                    control.state('activate-draw');
                },
                title: 'Stop drawing route'
            }, {
                stateName: 'activate-draw',
                icon: 'fa-pencil',
                onClick: function (control) {
                    routing.draw(true);
                    control.state('deactivate-draw');
                },
                title: 'Draw route'
            }]
        });

        deleteButton = L.easyButton(
            'fa-trash-o',
            function () {
                bootbox.confirm({
                    size: 'small',
                    message: "Delete route?",
                    callback: function(result) {
                        if (result) {
                            routing.clear();
                            onUpdate();
                            permalink._update_routing();
                        }
                    }
                });
            },
            'Clear route'
        );

        drawToolbar = L.easyBar([drawButton, deleteButton]).addTo(map);

        function updateRoute(evt) {
            router.setOptions(evt.options);

            // abort pending requests from previous rerouteAllSegments
            if (!router.queue.idle()) {
                router.queue.kill();
            }
            routing.rerouteAllSegments(onUpdate);
        }

        function requestUpdate(updatable) {
            var track = routing.toPolyline(),
                segments = routing.getSegments();

            updatable.update(track, segments);
        }

        routingOptions = new BR.RoutingOptions();
        routingOptions.on('update', updateRoute);
        routingOptions.on('update', function(evt) {
            profile.update(evt.options);
        });

        nogos = new BR.NogoAreas();
        nogos.on('update', updateRoute);

        // intermodal routing demo?
        if (BR.conf.transit) {
            itinerary = new BR.Itinerary();
        } else {
            stats = new BR.TrackStats();
        }
       

       
        profile.on('clear', function(evt) {
            profile.message.hide();
            routingOptions.setCustomProfile(null);
        });
        trackMessages = new BR.TrackMessages({
            requestUpdate: requestUpdate
        });

        routing = new BR.Routing({
            routing: {
                router: L.bind(router.getRouteSegment, router)
            },
            styles: BR.conf.routingStyles
        });

        routing.on('routing:routeWaypointEnd routing:setWaypointsEnd', function(evt) {
            search.clear();
            onUpdate(evt && evt.err);
        });
        map.on('routing:draw-start', function() {
            drawButton.state('deactivate-draw');
        });
        map.on('routing:draw-end', function() {
            drawButton.state('activate-draw');
        });

        function onUpdate(err) {
            if (err) {
                if (err !== L.BRouter.ABORTED_ERROR) {
                    BR.message.showError(err);
                }
                return;
            } else {
                BR.message.hide();
            }

            var track = routing.toPolyline(),
                segments = routing.getSegments(),
                latLngs = routing.getWaypoints(),
                segmentsLayer = routing._segments,
                urls = {};

            elevation.update(track, segmentsLayer);
            if (BR.conf.transit) {
                itinerary.update(track, segments);
            } else {
                stats.update(track, segments);
            }
            trackMessages.update(track, segments);

            if (latLngs.length > 1) {
                urls.gpx = router.getUrl(latLngs, 'gpx');
                urls.kml = router.getUrl(latLngs, 'kml');
                urls.geojson = router.getUrl(latLngs, 'geojson');
                urls.csv = router.getUrl(latLngs, 'csv');
            }

            download.update(urls);
        };

        if (!BR.conf.transit) {
            map.addControl(new BR.Control({
                 heading: '',
                 divId: 'header'
            }));
        }
        routingOptions.addTo(map);
        if (!BR.conf.transit) {
            stats.addTo(map);
        }
        download.addTo(map);
        elevation.addTo(map);

        tabs = new BR.Tabs({
            tabs: {
                '#tab_itinerary': itinerary,
                '#tab_profile': profile,
                '#tab_data': trackMessages
            }
        });
        if (!BR.conf.transit) {
            delete tabs.options.tabs['#tab_itinerary'];
        }
        map.addControl(tabs);

        nogos.addTo(map);
        routing.addTo(map);
        map.addControl(new BR.OpacitySlider({
            callback: L.bind(routing.setOpacity, routing)
        }));

        // initial option settings (after controls are added and initialized with onAdd, before permalink)
        router.setOptions(nogos.getOptions());
        router.setOptions(routingOptions.getOptions());
        profile.update(routingOptions.getOptions());

        permalink = new L.Control.Permalink({
            text: 'Permalink',
            position: 'bottomright',
            layers: layersControl,
            routingOptions: routingOptions,
            nogos: nogos,
            router: router,
            routing: routing,
            profile: profile
        }).addTo(map);
    }

    mapContext = BR.Map.initMap();
    initApp(mapContext);

$(document).ready(function() {
   	 $(".elevation").hide();
})();
