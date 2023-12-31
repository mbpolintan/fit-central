var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { markerRendering, convertTileLatLongToPoint, MapLocation } from '../index';
import { markerClick, markerMouseMove, markerClusterClick, markerClusterMouseMove } from '../index';
import { isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { getTranslate, convertGeoToPoint, clusterTemplate, marker, markerTemplate, getZoomTranslate } from '../utils/helper';
import { getElementByID, mergeSeparateCluster, clusterSeparate, removeElement, getElement, markerColorChoose, markerShapeChoose, calculateZoomLevel, compareZoomFactor, getValueFromObject } from '../utils/helper';
/**
 * Marker class
 */
var Marker = /** @class */ (function () {
    function Marker(maps) {
        this.maps = maps;
        this.trackElements = [];
        this.sameMarkerData = [];
    }
    /* tslint:disable:no-string-literal */
    Marker.prototype.markerRender = function (layerElement, layerIndex, factor, type) {
        var _this = this;
        var templateFn;
        var markerCount = 0;
        var nullCount = 0;
        var markerTemplateCount = 0;
        this.maps.translateType = 'marker';
        var currentLayer = this.maps.layersCollection[layerIndex];
        this.markerSVGObject = this.maps.renderer.createGroup({
            id: this.maps.element.id + '_Markers_Group',
            class: 'GroupElement',
            style: 'pointer-events: auto;'
        });
        var markerTemplateEle = createElement('div', {
            id: this.maps.element.id + '_LayerIndex_' + layerIndex + '_Markers_Template_Group',
            className: this.maps.element.id + '_template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + this.maps.mapAreaRect.y + 'px;' +
                'left:' + this.maps.mapAreaRect.x + 'px;' +
                'height:' + this.maps.mapAreaRect.height + 'px;' +
                'width:' + this.maps.mapAreaRect.width + 'px;'
        });
        //tslint:disable
        currentLayer.markerSettings.map(function (markerSettings, markerIndex) {
            var markerData = markerSettings.dataSource;
            Array.prototype.forEach.call(markerData, function (data, dataIndex) {
                _this.maps.markerNullCount = markerIndex > 0 && dataIndex === 0 ? 0 : _this.maps.markerNullCount;
                var eventArgs = {
                    cancel: false, name: markerRendering, fill: markerSettings.fill, height: markerSettings.height,
                    width: markerSettings.width, imageUrl: markerSettings.imageUrl, shape: markerSettings.shape,
                    template: markerSettings.template, data: data, maps: _this.maps, marker: markerSettings,
                    border: markerSettings.border, colorValuePath: markerSettings.colorValuePath,
                    shapeValuePath: markerSettings.shapeValuePath, imageUrlValuePath: markerSettings.imageUrlValuePath
                };
                eventArgs = markerColorChoose(eventArgs, data);
                eventArgs = markerShapeChoose(eventArgs, data);
                if (_this.maps.isBlazor) {
                    var maps = eventArgs.maps, marker_1 = eventArgs.marker, blazorEventArgs = __rest(eventArgs, ["maps", "marker"]);
                    eventArgs = blazorEventArgs;
                    markerSettings.longitudeValuePath = !isNullOrUndefined(markerSettings.longitudeValuePath) ?
                        markerSettings.longitudeValuePath : !isNullOrUndefined(data['Longitude']) ? 'Longitude' :
                        !isNullOrUndefined(data['longitude']) ? 'longitude' : null;
                    markerSettings.latitudeValuePath = !isNullOrUndefined(markerSettings.latitudeValuePath) ?
                        markerSettings.latitudeValuePath : !isNullOrUndefined(data['Latitude']) ? 'Latitude' :
                        !isNullOrUndefined(data['latitude']) ? 'latitude' : null;
                }
                _this.maps.trigger('markerRendering', eventArgs, function (MarkerArgs) {
                    if (markerSettings.colorValuePath !== eventArgs.colorValuePath) {
                        eventArgs = markerColorChoose(eventArgs, data);
                    }
                    if (markerSettings.shapeValuePath !== eventArgs.shapeValuePath) {
                        eventArgs = markerShapeChoose(eventArgs, data);
                    }
                    var lng = (!isNullOrUndefined(markerSettings.longitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.longitudeValuePath)) : !isNullOrUndefined(data['longitude']) ?
                        parseFloat(data['longitude']) : !isNullOrUndefined(data['Longitude']) ? parseFloat(data['Longitude']) : 0;
                    var lat = (!isNullOrUndefined(markerSettings.latitudeValuePath)) ?
                        Number(getValueFromObject(data, markerSettings.latitudeValuePath)) : !isNullOrUndefined(data['latitude']) ?
                        parseFloat(data['latitude']) : !isNullOrUndefined(data['Latitude']) ? parseFloat(data['Latitude']) : 0;
                    if (_this.maps.isBlazor) {
                        var data1 = {};
                        var text = [];
                        var j = 0;
                        for (var i = 0; i < Object.keys(data).length; i++) {
                            if (Object.keys(data)[i].toLowerCase() !== 'latitude' && Object.keys(data)[i].toLowerCase() !== 'longitude'
                                && Object.keys(data)[i].toLowerCase() !== 'name' && Object.keys(data)[i].toLowerCase() !== 'blazortemplateid'
                                && Object.keys(data)[i].toLowerCase() !== 'text') {
                                text[j] = data[Object.keys(data)[i].toLowerCase()];
                                data1['text'] = text;
                                j++;
                            }
                        }
                        data['text'] = data1['text'];
                    }
                    var offset = markerSettings.offset;
                    if (!eventArgs.cancel && markerSettings.visible && !isNullOrUndefined(lng) && !isNullOrUndefined(lat)) {
                        var markerID = _this.maps.element.id + '_LayerIndex_' + layerIndex + '_MarkerIndex_'
                            + markerIndex + '_dataIndex_' + dataIndex;
                        var location_1 = (_this.maps.isTileMap) ? convertTileLatLongToPoint(new MapLocation(lng, lat), factor, _this.maps.tileTranslatePoint, true) : convertGeoToPoint(lat, lng, factor, currentLayer, _this.maps);
                        var animate = currentLayer.animationDuration !== 0 || isNullOrUndefined(_this.maps.zoomModule);
                        var translate = (_this.maps.isTileMap) ? (currentLayer.type === "SubLayer" && isNullOrUndefined(_this.maps.zoomModule)) ? location_1 = convertTileLatLongToPoint(new MapLocation(lng, lat), _this.maps.tileZoomLevel, _this.maps.tileTranslatePoint, true) : new Object() :
                            !isNullOrUndefined(_this.maps.zoomModule) && _this.maps.zoomSettings.zoomFactor > 1 ?
                                getZoomTranslate(_this.maps, currentLayer, animate) :
                                getTranslate(_this.maps, currentLayer, animate);
                        var scale = type === 'AddMarker' ? _this.maps.scale : translate['scale'];
                        var transPoint = type === 'AddMarker' ? _this.maps.translatePoint : translate['location'];
                        if (eventArgs.template && (!isNaN(location_1.x) && !isNaN(location_1.y))) {
                            markerTemplateCount++;
                            markerTemplate(eventArgs, templateFn, markerID, data, markerIndex, markerTemplateEle, location_1, scale, offset, _this.maps);
                        }
                        else if (!eventArgs.template && (!isNaN(location_1.x) && !isNaN(location_1.y))) {
                            markerCount++;
                            marker(eventArgs, markerSettings, markerData, dataIndex, location_1, transPoint, markerID, offset, scale, _this.maps, _this.markerSVGObject);
                        }
                    }
                    nullCount += (!isNaN(lat) && !isNaN(lng)) ? 0 : 1;
                    markerTemplateCount += (eventArgs.cancel) ? 1 : 0;
                    markerCount += (eventArgs.cancel) ? 1 : 0;
                    _this.maps.markerNullCount = (isNullOrUndefined(lng) || isNullOrUndefined(lat)) ? _this.maps.markerNullCount + 1 : _this.maps.markerNullCount;
                    var markerDataLength = markerData.length - _this.maps.markerNullCount;
                    if (_this.markerSVGObject.childElementCount === (markerDataLength - markerTemplateCount - nullCount) && (type !== 'Template')) {
                        layerElement.appendChild(_this.markerSVGObject);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            _this.maps.svgObject.appendChild(_this.markerSVGObject);
                            _this.maps.element.appendChild(_this.maps.svgObject);
                            clusterTemplate(currentLayer, _this.markerSVGObject, _this.maps, layerIndex, _this.markerSVGObject, layerElement, true, false);
                        }
                    }
                    if (markerTemplateEle.childElementCount === (markerData.length - markerCount - nullCount) && getElementByID(_this.maps.element.id + '_Secondary_Element')) {
                        getElementByID(_this.maps.element.id + '_Secondary_Element').appendChild(markerTemplateEle);
                        if (currentLayer.markerClusterSettings.allowClustering) {
                            clusterTemplate(currentLayer, markerTemplateEle, _this.maps, layerIndex, _this.markerSVGObject, layerElement, false, false);
                        }
                    }
                });
            });
        });
    };
    /**
     * To find zoom level for individual layers like India, USA.
     */
    Marker.prototype.calculateIndividualLayerMarkerZoomLevel = function (mapWidth, mapHeight, maxZoomFact) {
        var latZoom;
        var lngZoom;
        var result;
        var scaleFactor;
        var height = Math.abs(this.maps.baseMapBounds.latitude.max - this.maps.baseMapBounds.latitude.min);
        var width = Math.abs(this.maps.baseMapBounds.longitude.max - this.maps.baseMapBounds.longitude.min);
        latZoom = Math.floor(Math.log(mapHeight / height));
        latZoom = (latZoom > maxZoomFact) ? maxZoomFact : latZoom;
        lngZoom = Math.floor(Math.log(mapWidth / width));
        lngZoom = (lngZoom > maxZoomFact) ? maxZoomFact : lngZoom;
        result = Math.min(latZoom, lngZoom);
        scaleFactor = Math.min(result, maxZoomFact - 1);
        if (!this.maps.isTileMap) {
            compareZoomFactor(scaleFactor, this.maps);
        }
        return scaleFactor;
    };
    /**
     * To calculate center position and factor value dynamically
     */
    Marker.prototype.calculateZoomCenterPositionAndFactor = function (layersCollection) {
        if (this.maps.zoomSettings.shouldZoomInitially && this.maps.markerModule) {
            var minLong_1;
            var maxLat_1;
            var minLat_1;
            var maxLong_1;
            var latZoom = void 0;
            var lngZoom = void 0;
            var result = void 0;
            var zoomLevel = void 0;
            var centerLat = void 0;
            var centerLong = void 0;
            var maxZoomFact = 10;
            var mapWidth = this.maps.mapAreaRect.width;
            var mapHeight = this.maps.mapAreaRect.height;
            var scaleFactor = void 0;
            this.maps.markerZoomedState = this.maps.markerZoomedState ? this.maps.markerZoomedState : isNullOrUndefined(this.maps.markerZoomFactor) ?
                !this.maps.markerZoomedState : this.maps.markerZoomFactor > 1 ? this.maps.markerZoomedState : !this.maps.markerZoomedState;
            this.maps.defaultState = this.maps.markerZoomedState ? !this.maps.markerZoomedState : this.maps.defaultState;
            Array.prototype.forEach.call(layersCollection, function (currentLayer, layerIndex) {
                var isMarker = currentLayer.markerSettings.length !== 0;
                if (isMarker) {
                    Array.prototype.forEach.call(currentLayer.markerSettings, function (markerSetting, markerIndex) {
                        var markerData = markerSetting.dataSource;
                        Array.prototype.forEach.call(markerData, function (data, dataIndex) {
                            var latitude = !isNullOrUndefined(data['latitude']) ? parseFloat(data['latitude']) :
                                !isNullOrUndefined(data['Latitude']) ? parseFloat(data['Latitude']) : null;
                            var longitude = !isNullOrUndefined(data['longitude']) ? parseFloat(data['longitude']) :
                                !isNullOrUndefined(data['Longitude']) ? parseFloat(data['Longitude']) : null;
                            minLong_1 = isNullOrUndefined(minLong_1) && dataIndex === 0 ?
                                longitude : minLong_1;
                            maxLat_1 = isNullOrUndefined(maxLat_1) && dataIndex === 0 ?
                                latitude : maxLat_1;
                            minLat_1 = isNullOrUndefined(minLat_1) && dataIndex === 0 ?
                                latitude : minLat_1;
                            maxLong_1 = isNullOrUndefined(maxLong_1) && dataIndex === 0 ?
                                longitude : maxLong_1;
                            if (minLong_1 > longitude) {
                                minLong_1 = longitude;
                            }
                            if (minLat_1 > latitude) {
                                minLat_1 = latitude;
                            }
                            if (maxLong_1 < longitude) {
                                maxLong_1 = longitude;
                            }
                            if (maxLat_1 < latitude) {
                                maxLat_1 = latitude;
                            }
                        });
                    });
                }
            });
            if (!isNullOrUndefined(minLat_1) && !isNullOrUndefined(minLong_1) &&
                !isNullOrUndefined(maxLong_1) && !isNullOrUndefined(maxLat_1)) {
                // To find the center position
                centerLat = (minLat_1 + maxLat_1) / 2;
                centerLong = (minLong_1 + maxLong_1) / 2;
                this.maps.markerCenterLatitude = centerLat;
                this.maps.markerCenterLongitude = centerLong;
                if (isNullOrUndefined(this.maps.markerZoomCenterPoint) || this.maps.markerZoomedState) {
                    this.maps.markerZoomCenterPoint = {
                        latitude: centerLat,
                        longitude: centerLong
                    };
                }
                var markerFactor = void 0;
                if (this.maps.isTileMap || this.maps.baseMapRectBounds['min']['x'] === 0) {
                    zoomLevel = calculateZoomLevel(minLat_1, maxLat_1, minLong_1, maxLong_1, mapWidth, mapHeight, this.maps);
                    if (this.maps.isTileMap) {
                        markerFactor = isNullOrUndefined(this.maps.markerZoomFactor) ?
                            zoomLevel : isNullOrUndefined(this.maps.mapScaleValue) ?
                            zoomLevel : this.maps.mapScaleValue > 1 && this.maps.markerZoomFactor !== 1 ?
                            this.maps.mapScaleValue : zoomLevel;
                    }
                    else {
                        markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ? zoomLevel :
                            (Math.floor(this.maps.scale) !== 1 &&
                                this.maps.mapScaleValue !== zoomLevel)
                                &&
                                    (isNullOrUndefined(this.maps.shouldZoomCurrentFactor))
                                ? this.maps.mapScaleValue : zoomLevel;
                        if (((markerFactor === this.maps.mapScaleValue &&
                            (this.maps.markerZoomFactor === 1 || this.maps.mapScaleValue === 1))
                            && (!this.maps.enablePersistence))) {
                            markerFactor = zoomLevel;
                        }
                    }
                }
                else {
                    zoomLevel = this.calculateIndividualLayerMarkerZoomLevel(mapWidth, mapHeight, maxZoomFact);
                    markerFactor = isNullOrUndefined(this.maps.mapScaleValue) ? zoomLevel :
                        (this.maps.mapScaleValue !== zoomLevel)
                            ? this.maps.mapScaleValue : zoomLevel;
                }
                this.maps.markerZoomFactor = markerFactor;
            }
        }
        else {
            this.maps.markerZoomedState = false;
            if (this.maps.markerZoomFactor > 1) {
                this.maps.markerCenterLatitude = null;
                this.maps.markerCenterLongitude = null;
                this.maps.markerZoomFactor = 1;
                if (!this.maps.enablePersistence) {
                    this.maps.mapScaleValue = 1;
                }
            }
            if (this.maps.isTileMap && !this.maps.enablePersistence
                && this.maps.mapScaleValue <= 1) {
                this.maps.tileZoomLevel = this.maps.mapScaleValue === 0 ? 1 : this.maps.mapScaleValue;
                if (this.maps.mapScaleValue === 1 && this.maps.markerZoomFactor === 1) {
                    this.maps.tileTranslatePoint.x = 0;
                    this.maps.tileTranslatePoint.y = 0;
                }
            }
        }
    };
    /**
     * To check and trigger marker click event
     */
    Marker.prototype.markerClick = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') > 0) {
            return;
        }
        var options = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerClick, data: options.data, maps: this.maps,
            marker: options.marker, target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"],
            longitude: options.data["longitude"] || options.data["Longitude"],
            value: options.data["name"]
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, marker_2 = eventArgs.marker, blazorEventArgs = __rest(eventArgs, ["maps", "marker"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClick, eventArgs);
    };
    /**
     * To check and trigger Cluster click event
     */
    Marker.prototype.markerClusterClick = function (e) {
        var target = e.target.id;
        if (target.indexOf('_LayerIndex_') === -1 || target.indexOf('_cluster_') === -1) {
            return;
        }
        var options = this.getMarker(target);
        if (isNullOrUndefined(options)) {
            return;
        }
        if ((options.clusterCollection.length > 0 && this.maps.markerClusterExpand)) {
            if (getElement(this.maps.element.id + '_mapsTooltip') &&
                this.maps.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                removeElement(this.maps.element.id + '_mapsTooltip');
            }
            if (this.sameMarkerData.length > 0 && !this.maps.markerClusterExpandCheck) {
                this.maps.markerClusterExpandCheck = true;
                mergeSeparateCluster(this.sameMarkerData, this.maps, this.markerSVGObject);
            }
            else {
                this.sameMarkerData = options.clusterCollection;
                this.maps.markerClusterExpandCheck = false;
                clusterSeparate(this.sameMarkerData, this.maps, this.markerSVGObject, true);
            }
        }
        var eventArgs = {
            cancel: false, name: markerClusterClick, data: options, maps: this.maps,
            target: target, x: e.clientX, y: e.clientY,
            latitude: options.data["latitude"] || options.data["Latitude"], longitude: options.data["longitude"] || options.data["Longitude"],
            markerClusterCollection: options['markCollection']
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, latitude = eventArgs.latitude, longitude = eventArgs.longitude, blazorEventArgs = __rest(eventArgs, ["maps", "latitude", "longitude"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterClick, eventArgs);
    };
    /**
     * To get marker from target id
     */
    Marker.prototype.getMarker = function (target) {
        var id = target.split('_LayerIndex_');
        var index = parseInt(id[1].split('_')[0], 10);
        var layer = this.maps.layers[index];
        var data;
        var markCollection = [];
        var clusterCollection = [];
        var marker;
        this.maps.markerClusterExpand = layer.markerClusterSettings.allowClusterExpand;
        if (target.indexOf('_MarkerIndex_') > -1) {
            var markerIndex = parseInt(id[1].split('_MarkerIndex_')[1].split('_')[0], 10);
            var dataIndex = parseInt(id[1].split('_dataIndex_')[1].split('_')[0], 10);
            marker = layer.markerSettings[markerIndex];
            if (!isNaN(markerIndex)) {
                data = marker.dataSource[dataIndex];
                var collection_1 = [];
                if (!marker.template && (target.indexOf('_cluster_') > -1) && (this.maps.layers[index].markerClusterSettings.allowClusterExpand)) {
                    Array.prototype.forEach.call(marker.dataSource, function (location, index) {
                        if (location['latitude'] === data['latitude'] && location['longitude'] === data['longitude']) {
                            collection_1.push({ data: data, index: index });
                        }
                    });
                }
                if ((target.indexOf('_cluster_') > -1)) {
                    var isClusterSame = false;
                    var clusterElement = document.getElementById(target.indexOf('_datalabel_') > -1 ? target.split('_datalabel_')[0] : target);
                    var indexes = clusterElement.innerHTML.split(',').map(Number);
                    collection_1 = [];
                    for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
                        var i = indexes_1[_i];
                        collection_1.push({ data: marker.dataSource[i], index: i });
                        if (this.maps.isBlazor) {
                            marker.dataSource[i]["text"] = "";
                        }
                        markCollection.push(marker.dataSource[i]);
                    }
                    isClusterSame = false;
                    clusterCollection.push({
                        data: collection_1, layerIndex: index, markerIndex: markerIndex, dataIndex: dataIndex,
                        targetClusterIndex: +(target.split('_cluster_')[1].indexOf('_datalabel_') > -1 ? target.split('_cluster_')[1].split('_datalabel_')[0] : target.split('_cluster_')[1]),
                        isClusterSame: isClusterSame
                    });
                }
                return { marker: marker, data: data, clusterCollection: clusterCollection, markCollection: markCollection };
            }
        }
        return null;
    };
    /**
     * To check and trigger marker move event
     */
    Marker.prototype.markerMove = function (e) {
        var targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') > 0) {
            return;
        }
        var options = this.getMarker(targetId);
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerMouseMove, data: options.data,
            maps: this.maps, target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerMouseMove, eventArgs);
    };
    /**
     * To check and trigger cluster move event
     */
    Marker.prototype.markerClusterMouseMove = function (e) {
        var targetId = e.target.id;
        if (targetId.indexOf('_LayerIndex_') === -1 || targetId.indexOf('_cluster_') === -1) {
            return;
        }
        var options = this.getMarker(targetId);
        if (this.maps.markerClusterExpand) {
            e.target.setAttribute('style', 'cursor: pointer');
        }
        if (isNullOrUndefined(options)) {
            return;
        }
        var eventArgs = {
            cancel: false, name: markerClusterMouseMove, data: options.data, maps: this.maps,
            target: targetId, x: e.clientX, y: e.clientY
        };
        if (this.maps.isBlazor) {
            var maps = eventArgs.maps, blazorEventArgs = __rest(eventArgs, ["maps"]);
            eventArgs = blazorEventArgs;
        }
        this.maps.trigger(markerClusterMouseMove, eventArgs);
    };
    /**
     * Get module name.
     */
    Marker.prototype.getModuleName = function () {
        return 'Marker';
    };
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    Marker.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return Marker;
}());
export { Marker };
