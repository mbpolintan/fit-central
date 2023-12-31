var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Maps Component file
 */
import { Component, NotifyPropertyChanges, Property, Ajax } from '@syncfusion/ej2-base';
import { EventHandler, Browser, isNullOrUndefined, createElement, setValue, extend } from '@syncfusion/ej2-base';
import { Event, remove, L10n, Collection, Internationalization, Complex, isBlazor } from '@syncfusion/ej2-base';
import { updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Size, createSvg, Point, removeElement, triggerShapeEvent, showTooltip, checkShapeDataFields } from './utils/helper';
import { getElement, removeClass, getTranslate, triggerItemSelectionEvent, mergeSeparateCluster, customizeStyle } from './utils/helper';
import { createStyle } from './utils/helper';
import { ZoomSettings, LegendSettings } from './model/base';
import { LayerSettings, TitleSettings, Border, Margin, MapsAreaSettings, Annotation, CenterPosition } from './model/base';
import { Marker } from './layers/marker';
import { load, click, loaded, resize, shapeSelected, zoomIn } from './model/constants';
import { getThemeStyle } from './model/theme';
import { BingMap } from './layers/bing-map';
import { LayerPanel } from './layers/layer-panel';
import { Rect, RectOption, measureText, getElementByID, MapAjax, processResult } from '../maps/utils/helper';
import { findPosition, textTrim, TextOption, renderTextElement, convertGeoToPoint, calculateZoomLevel } from '../maps/utils/helper';
import { Annotations } from '../maps/user-interaction/annotation';
import { MarkerSettings } from './index';
import { changeBorderWidth } from './index';
import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Represents the Maps control.
 * ```html
 * <div id="maps"/>
 * <script>
 *   var maps = new Maps();
 *   maps.appendTo("#maps");
 * </script>
 * ```
 */
var Maps = /** @class */ (function (_super) {
    __extends(Maps, _super);
    /**
     * Constructor for creating the widget
     */
    function Maps(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * Check layer whether is geometry or tile
         * @private
         */
        _this.isTileMap = false;
        /**
         * Resize the map
         */
        _this.isResize = false;
        /** @private */
        _this.baseSize = new Size(0, 0);
        /** @public */
        _this.translatePoint = new Point(0, 0);
        /** @private */
        _this.baseTranslatePoint = new Point(0, 0);
        /** @public */
        _this.zoomTranslatePoint = new Point(0, 0);
        /** @private */
        _this.markerZoomedState = true;
        /** @private */
        _this.zoomPersistence = false;
        /** @private */
        _this.defaultState = true;
        /** @private */
        _this.centerPositionChanged = false;
        /** @private */
        _this.isTileMapSubLayer = false;
        /** @private */
        _this.markerNullCount = 0;
        /** @private */
        _this.tileTranslatePoint = new Point(0, 0);
        /** @private */
        _this.baseTileTranslatePoint = new Point(0, 0);
        /** @private */
        _this.isDevice = false;
        /** @private */
        _this.staticMapZoom = _this.zoomSettings.enable ? _this.zoomSettings.zoomFactor : 0;
        /** @private */
        _this.zoomNotApplied = false;
        /** @public */
        _this.dataLabelShape = [];
        _this.zoomShapeCollection = [];
        _this.zoomLabelPositions = [];
        _this.mouseDownEvent = { x: null, y: null };
        _this.mouseClickEvent = { x: null, y: null };
        /** @private */
        _this.selectedElementId = [];
        /** @private */
        _this.selectedMarkerElementId = [];
        /** @private */
        _this.selectedBubbleElementId = [];
        /** @private */
        _this.selectedNavigationElementId = [];
        /** @private */
        _this.selectedLegendElementId = [];
        /** @private */
        _this.legendSelectionCollection = [];
        /** @private */
        _this.shapeSelections = true;
        /** @private */
        _this.legendSelection = true;
        /** @private */
        _this.toggledLegendId = [];
        /** @private */
        _this.toggledShapeElementId = [];
        /** @private */
        _this.checkInitialRender = true;
        /** @private */
        _this.initialTileTranslate = new Point(0, 0);
        /** @private */
        _this.initialCheck = true;
        /** @private */
        _this.applyZoomReset = false;
        /** @private */
        _this.markerClusterExpandCheck = false;
        /** @private */
        _this.markerClusterExpand = false;
        /** @private */
        _this.shapeSelectionItem = [];
        setValue('mergePersistData', _this.mergePersistMapsData, _this);
        return _this;
    }
    Object.defineProperty(Maps.prototype, "isShapeSelected", {
        /**
         * Specifies whether the shape is selected in the maps or not..
         */
        get: function () {
            return this.mapSelect;
        },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * To manage persist maps data
     */
    Maps.prototype.mergePersistMapsData = function () {
        var data;
        if (!isNullOrUndefined(window.localStorage)) {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        }
        if (!(isNullOrUndefined(data) || (data === ''))) {
            var dataObj = JSON.parse(data);
            var keys = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if ((typeof this[key] === 'object') && !isNullOrUndefined(this[key])) {
                    extend(this[key], dataObj[key]);
                }
                else {
                    this[key] = dataObj[key];
                }
            }
            this.isProtectedOnChange = false;
        }
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    Maps.prototype.getLocalizedLabel = function (key) {
        return this.localeObject.getConstant(key);
    };
    /**
     * Initializing pre-required values.
     */
    Maps.prototype.preRender = function () {
        this.isDevice = Browser.isDevice;
        this.isBlazor = isBlazor();
        this.initPrivateVariable();
        this.allowServerDataBinding = false;
        this.unWireEVents();
        this.wireEVents();
        this.setCulture();
    };
    /**
     * To Initialize the control rendering.
     */
    Maps.prototype.render = function () {
        this.trigger(load, this.isBlazor ? {} : { maps: this });
        this.createSVG();
        this.findBaseAndSubLayers();
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        this.renderArea();
        this.processRequestJsonData();
        this.renderComplete();
    };
    /* tslint:disable:no-string-literal */
    Maps.prototype.processRequestJsonData = function () {
        var _this = this;
        var length = this.layersCollection.length - 1;
        this.serverProcess = { request: 0, response: 0 };
        var queryModule;
        var localAjax;
        var ajaxModule;
        var dataModule;
        Array.prototype.forEach.call(this.layersCollection, function (layer, layerIndex) {
            if (layer.shapeData instanceof DataManager) {
                _this.serverProcess['request']++;
                dataModule = layer.shapeData;
                queryModule = layer.query instanceof Query ? layer.query : _this.isBlazor ? (new Query().requiresCount()) : new Query();
                var dataManager = dataModule.executeQuery(queryModule);
                dataManager.then(function (e) {
                    _this.processResponseJsonData('DataManager', e, layer, 'ShapeData');
                });
            }
            else if (layer.shapeData instanceof MapAjax || layer.shapeData) {
                if (!isNullOrUndefined(layer.shapeData['dataOptions'])) {
                    _this.processAjaxRequest(layer, layer.shapeData, 'ShapeData');
                }
            }
            if (layer.dataSource instanceof DataManager) {
                _this.serverProcess['request']++;
                dataModule = layer.dataSource;
                queryModule = layer.query instanceof Query ? layer.query : _this.isBlazor ? (new Query().requiresCount()) : new Query();
                var dataManager = dataModule.executeQuery(queryModule);
                dataManager.then(function (e) {
                    layer.dataSource = processResult(e);
                });
            }
            if (layer.markerSettings.length > 0) {
                var _loop_1 = function (i) {
                    if (layer.markerSettings[i].dataSource instanceof DataManager) {
                        _this.serverProcess['request']++;
                        dataModule = layer.markerSettings[i].dataSource;
                        queryModule = layer.markerSettings[i].query instanceof Query ? layer.markerSettings[i].query : _this.isBlazor ?
                            (new Query().requiresCount()) : new Query();
                        var dataManager = dataModule.executeQuery(queryModule);
                        dataManager.then(function (e) {
                            layer.markerSettings[i].dataSource = processResult(e);
                        });
                    }
                };
                for (var i = 0; i < layer.markerSettings.length; i++) {
                    _loop_1(i);
                }
            }
            if (layer.bubbleSettings.length > 0) {
                var _loop_2 = function (i) {
                    if (layer.bubbleSettings[i].dataSource instanceof DataManager) {
                        _this.serverProcess['request']++;
                        dataModule = layer.bubbleSettings[i].dataSource;
                        queryModule = layer.bubbleSettings[i].query instanceof Query ? layer.bubbleSettings[i].query : _this.isBlazor ?
                            (new Query().requiresCount()) : new Query();
                        var dataManager = dataModule.executeQuery(queryModule);
                        dataManager.then(function (e) {
                            layer.bubbleSettings[i].dataSource = processResult(e);
                        });
                    }
                };
                for (var i = 0; i < layer.bubbleSettings.length; i++) {
                    _loop_2(i);
                }
            }
            if (layer.dataSource instanceof MapAjax || !isNullOrUndefined(layer.dataSource['dataOptions'])) {
                _this.processAjaxRequest(layer, layer.dataSource, 'DataSource');
            }
            if (_this.serverProcess['request'] === _this.serverProcess['response'] && length === layerIndex) {
                _this.processResponseJsonData(null);
            }
        });
    };
    // tslint:disable:no-any
    Maps.prototype.processAjaxRequest = function (layer, localAjax, type) {
        var _this = this;
        var ajaxModule;
        this.serverProcess['request']++;
        ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
        ajaxModule.onSuccess = function (args) {
            _this.processResponseJsonData('Ajax', args, layer, type);
        };
        ajaxModule.send(localAjax.sendData);
    };
    /**
     * This method is used to process the JSON data to render the maps.
     * @param processType - Specifies the process type in maps.
     * @param data - Specifies the data for maps.
     * @param layer - Specifies the layer for the maps.
     * @param dataType - Specifies the data type for maps.
     */
    /* tslint:disable:no-eval */
    Maps.prototype.processResponseJsonData = function (processType, data, layer, dataType) {
        this.serverProcess['response']++;
        if (processType) {
            if (dataType === 'ShapeData') {
                layer.shapeData = (processType === 'DataManager') ? processResult(data) : JSON.parse(data);
            }
            else {
                layer.dataSource = (processType === 'DataManager') ? processResult(data) : JSON.parse('[' + data + ']')[0];
            }
        }
        if (!isNullOrUndefined(processType) && this.serverProcess['request'] === this.serverProcess['response']) {
            var collection = this.layersCollection;
            this.layersCollection = [];
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].isBaseLayer) {
                    this.layersCollection.push(collection[i]);
                }
            }
            for (var j = 0; j < collection.length; j++) {
                if (!collection[j].isBaseLayer) {
                    this.layersCollection.push(collection[j]);
                }
            }
            this.renderMap();
        }
        else if (isNullOrUndefined(processType)) {
            this.renderMap();
        }
    };
    /* tslint:disable:max-func-body-length */
    Maps.prototype.renderMap = function () {
        if (this.legendModule && this.legendSettings.visible) {
            if (!this.isTileMap) {
                this.legendModule.renderLegend();
            }
            else {
                var layerCount = this.layersCollection.length - 1;
                if (!this.layersCollection[layerCount].isBaseLayer) {
                    this.isTileMapSubLayer = true;
                    this.legendModule.renderLegend();
                }
            }
        }
        this.createTile();
        if (this.zoomSettings.enable && this.zoomModule) {
            this.zoomModule.createZoomingToolbars();
        }
        if (!isNullOrUndefined(this.dataLabelModule)) {
            this.dataLabelModule.dataLabelCollections = [];
            this.dataLabelShape = [];
        }
        this.mapLayerPanel.measureLayerPanel();
        this.element.appendChild(this.svgObject);
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].selectionSettings && this.layers[i].selectionSettings.enable &&
                this.layers[i].initialShapeSelection.length > 0 && this.checkInitialRender) {
                var checkSelection = this.layers[i].selectionSettings.enableMultiSelect;
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection ? checkSelection : true;
                var shapeSelection = this.layers[i].initialShapeSelection;
                for (var j = 0; j < this.layers[i].initialShapeSelection.length; j++) {
                    this.shapeSelection(i, shapeSelection[j].shapePath, shapeSelection[j].shapeValue, true);
                }
                this.layers[i].selectionSettings.enableMultiSelect = checkSelection;
                if (i === this.layers.length - 1) {
                    this.checkInitialRender = false;
                }
            }
            for (var k = 0; k < this.layers[i].markerSettings.length; k++) {
                if (this.layers[i].markerSettings[k].selectionSettings && this.layers[i].markerSettings[k].selectionSettings.enable
                    && this.layers[i].markerSettings[k].initialMarkerSelection.length > 0) {
                    var markerSelectionValues = this.layers[i].markerSettings[k].initialMarkerSelection;
                    for (var j = 0; j < markerSelectionValues.length; j++) {
                        this.markerInitialSelection(i, k, this.layers[i].markerSettings[k], markerSelectionValues[j].latitude, markerSelectionValues[j].longitude);
                    }
                }
            }
        }
        if (!isNullOrUndefined(document.getElementById(this.element.id + '_tile_parent'))) {
            var svg = this.svgObject.getBoundingClientRect();
            var element = document.getElementById(this.element.id);
            var tileElement = document.getElementById(this.element.id + '_tile_parent');
            var tileElement1 = document.getElementById(this.element.id + '_tiles');
            var tile = tileElement.getBoundingClientRect();
            var bottom = void 0;
            var top_1;
            var left = void 0;
            left = parseFloat(tileElement.style.left) + element.offsetLeft;
            var titleTextSize = measureText(this.titleSettings.text, this.titleSettings.textStyle);
            var subTitleTextSize = measureText(this.titleSettings.subtitleSettings.text, this.titleSettings.subtitleSettings.textStyle);
            if (this.isTileMap && this.isTileMapSubLayer && this.legendSettings.position === 'Bottom' && this.legendSettings.visible) {
                if (this.legendSettings.mode !== 'Default') {
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top_1 = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize.height / 2)
                            - (this.legendModule.legendBorderRect.height / 2);
                    }
                    else {
                        top_1 = parseFloat(tileElement.style.top) + element.offsetTop - this.mapAreaRect.y;
                    }
                }
                else {
                    left = this.legendModule.legendBorderRect.x;
                    if (titleTextSize.width !== 0 && titleTextSize.height !== 0) {
                        top_1 = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2)
                            - this.legendModule.legendBorderRect.y;
                    }
                    else {
                        top_1 = parseFloat(tileElement.style.top) + element.offsetTop + (subTitleTextSize['height'] / 2);
                    }
                }
            }
            else {
                bottom = svg.bottom - tile.bottom - element.offsetTop;
                top_1 = parseFloat(tileElement.style.top) + element.offsetTop;
            }
            top_1 = (bottom <= 11) ? top_1 : (top_1 * 2);
            left = (bottom <= 11) ? left : (left * 2);
            tileElement.style.top = top_1 + 'px';
            tileElement.style.left = left + 'px';
            tileElement1.style.top = top_1 + 'px';
            tileElement1.style.left = left + 'px';
        }
        this.arrangeTemplate();
        var blazor = this.isBlazor ? this.blazorTemplates() : null;
        if (this.annotationsModule) {
            if (this.width !== '0px' && this.height !== '0px' && this.width !== '0%' && this.height !== '0%') {
                this.annotationsModule.renderAnnotationElements();
            }
        }
        this.element.style.outline = 'none';
        for (var i = 0; i < document.getElementsByTagName('path').length - 1; i++) {
            if (document.getElementsByTagName('path')[i].id.indexOf('shapeIndex') > -1) {
                document.getElementsByTagName('path')[i].style.outline = 'none';
            }
        }
        this.zoomingChange();
        this.trigger(loaded, this.isBlazor ? { isResized: this.isResize } : { maps: this, isResized: this.isResize });
        this.isResize = false;
    };
    /**
     * @private
     * To apply color to the initial selected marker
     */
    Maps.prototype.markerSelection = function (selectionSettings, map, targetElement, data) {
        var border = {
            color: selectionSettings.border.color,
            width: selectionSettings.border.width / map.scale
        };
        var markerSelectionProperties = {
            opacity: selectionSettings.opacity,
            fill: selectionSettings.fill,
            border: border,
            target: targetElement.id,
            cancel: false,
            data: data,
            maps: map
        };
        if (!getElement('MarkerselectionMap')) {
            document.body.appendChild(createStyle('MarkerselectionMap', 'MarkerselectionMapStyle', markerSelectionProperties));
        }
        else {
            customizeStyle('MarkerselectionMap', 'MarkerselectionMapStyle', markerSelectionProperties);
        }
        if (this.selectedMarkerElementId.length === 0 || selectionSettings.enableMultiSelect) {
            targetElement.setAttribute('class', 'MarkerselectionMapStyle');
        }
    };
    /**
     * @private
     * initial selection of marker
     *
     */
    Maps.prototype.markerInitialSelection = function (layerIndex, markerIndex, markerSettings, latitude, longitude) {
        var selectionSettings = markerSettings.selectionSettings;
        if (selectionSettings.enable) {
            for (var i = 0; i < markerSettings.dataSource['length']; i++) {
                var data = markerSettings.dataSource[i];
                if (data['latitude'] === latitude && data['longitude'] === longitude) {
                    var targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_MarkerIndex_' + markerIndex +
                        '_dataIndex_' + i;
                    this.markerSelection(selectionSettings, this, getElement(targetId), data);
                }
            }
        }
    };
    /**
     * To append blazor templates
     * @private
     */
    Maps.prototype.blazorTemplates = function () {
        for (var i = 0; i < this.layers.length; i++) {
            var markerLength = this.layers[i].markerSettings.length - 1;
            if (markerLength >= 0) {
                if (this.layers[i].dataLabelSettings.visible || this.layers[i].markerSettings[markerLength].template) {
                    updateBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate', this.layers[i].dataLabelSettings);
                    for (var j = 0; j < this.layers[i].markerSettings.length; j++) {
                        updateBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate', this.layers[i].markerSettings[j]);
                    }
                }
            }
        }
    };
    /**
     * Render the map area border
     */
    Maps.prototype.renderArea = function () {
        var width = this.mapsArea.border.width;
        var background = this.mapsArea.background;
        if (width > 0 || (background || this.themeStyle.areaBackgroundColor)) {
            var rect = new RectOption(this.element.id + '_MapAreaBorder', background || this.themeStyle.areaBackgroundColor, this.mapsArea.border, 1, this.mapAreaRect);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    };
    /**
     * To add tab index for map element
     */
    Maps.prototype.addTabIndex = function () {
        this.element.setAttribute('aria-label', this.description || 'Maps Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    };
    // private setSecondaryElementPosition(): void {
    //     if (!this.isTileMap) {
    //         let element: HTMLDivElement = getElementByID(this.element.id + '_Secondary_Element') as HTMLDivElement;
    //         let rect: ClientRect = this.element.getBoundingClientRect();
    //         let svgRect: ClientRect = getElementByID(this.element.id + '_svg').getBoundingClientRect();
    //         element.style.marginLeft = Math.max(svgRect.left - rect.left, 0) + 'px';
    //         element.style.marginTop = Math.max(svgRect.top - rect.top, 0) + 'px';
    //     }
    // }
    Maps.prototype.zoomingChange = function () {
        var left;
        var top;
        if (getElementByID(this.element.id + '_Layer_Collections') && this.zoomModule) {
            this.zoomModule.layerCollectionEle = getElementByID(this.element.id + '_Layer_Collections');
        }
        if (this.isTileMap && getElementByID(this.element.id + '_Tile_SVG') && getElementByID(this.element.id + '_tile_parent')) {
            var tileRect = getElementByID(this.element.id + '_tile_parent').getBoundingClientRect();
            var tileSvgRect = getElementByID(this.element.id + '_Tile_SVG').getBoundingClientRect();
            left = (tileRect.left - tileSvgRect.left);
            top = (tileRect.top - tileSvgRect.top);
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.left = left + 'px';
            getElementByID(this.element.id + '_Tile_SVG_Parent').style.top = top + 'px';
            var markerTemplateElements = document.getElementsByClassName('template');
            if (!isNullOrUndefined(markerTemplateElements) && markerTemplateElements.length > 0) {
                for (var i = 0; i < markerTemplateElements.length; i++) {
                    var templateGroupEle = markerTemplateElements[i];
                    templateGroupEle.style.left = left + 'px';
                    templateGroupEle.style.top = top + 'px';
                }
            }
        }
        if (this.zoomSettings.zoomFactor >= 1) {
            if (this.zoomModule && this.zoomModule.toolBarGroup && this.zoomSettings.enable) {
                this.zoomModule.alignToolBar();
            }
            var elements = document.getElementById(this.element.id + '_Layer_Collections');
            if (!isNullOrUndefined(elements) && elements.childElementCount > 0) {
                for (var i = 0; i < elements.childNodes.length; i++) {
                    var childElement = elements.childNodes[i];
                    if (childElement.tagName === 'g') {
                        var layerIndex = parseFloat(childElement.id.split('_LayerIndex_')[1].split('_')[0]);
                        for (var j = 0; j < childElement.childNodes.length; j++) {
                            var childNode = childElement.childNodes[j];
                            if (!(childNode.id.indexOf('_Markers_Group') > -1) &&
                                (!(childNode.id.indexOf('_bubble_Group') > -1)) &&
                                (!(childNode.id.indexOf('_dataLableIndex_Group') > -1))) {
                                changeBorderWidth(childNode, layerIndex, this.scale, this);
                            }
                        }
                    }
                }
            }
            if (this.zoomModule && (this.previousScale !== this.scale)) {
                this.zoomModule.applyTransform(true);
            }
        }
    };
    Maps.prototype.createSecondaryElement = function () {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:2;'
            });
            this.element.appendChild(secondaryElement);
        }
    };
    /**
     * @private
     */
    Maps.prototype.arrangeTemplate = function () {
        if (document.getElementById(this.element.id + '_Legend_Border')) {
            document.getElementById(this.element.id + '_Legend_Border').style.pointerEvents = 'none';
        }
        var templateElements = document.getElementsByClassName(this.element.id + '_template');
        if (!isNullOrUndefined(templateElements) && templateElements.length > 0 &&
            getElementByID(this.element.id + '_Layer_Collections') && this.layers[this.layers.length - 1].layerType !== 'OSM') {
            for (var i = 0; i < templateElements.length; i++) {
                var templateGroupEle = templateElements[i];
                if (!isNullOrUndefined(templateGroupEle) && templateGroupEle.childElementCount > 0) {
                    var layerOffset = getElementByID(this.element.id + '_Layer_Collections').getBoundingClientRect();
                    var elementOffset = getElementByID(templateGroupEle.id).getBoundingClientRect();
                    var offSetLetValue = this.isTileMap ? 0 : (layerOffset.left < elementOffset.left) ?
                        -(Math.abs(elementOffset.left - layerOffset.left)) : (Math.abs(elementOffset.left - layerOffset.left));
                    var offSetTopValue = this.isTileMap ? 0 : (layerOffset.top < elementOffset.top) ?
                        -(Math.abs(elementOffset.top - layerOffset.top)) : Math.abs(elementOffset.top - layerOffset.top);
                    for (var j = 0; j < templateGroupEle.childElementCount; j++) {
                        var currentTemplate = templateGroupEle.childNodes[j];
                        currentTemplate.style.left = parseFloat(currentTemplate.style.left) + offSetLetValue + 'px';
                        currentTemplate.style.top = parseFloat(currentTemplate.style.top) + offSetTopValue + 'px';
                        currentTemplate.style.transform = 'translate(-50%, -50%)';
                    }
                }
            }
        }
    };
    Maps.prototype.createTile = function () {
        var mainLayer = this.layersCollection[0];
        var padding = 0;
        if (mainLayer.isBaseLayer && (mainLayer.layerType === 'OSM' || mainLayer.layerType === 'Bing' ||
            mainLayer.layerType === 'GoogleStaticMap' || mainLayer.layerType === 'Google')) {
            if (mainLayer.layerType === 'Google') {
                mainLayer.urlTemplate = 'https://mt1.google.com/vt/lyrs=m@129&hl=en&x=tileX&y=tileY&z=level';
            }
            removeElement(this.element.id + '_tile_parent');
            removeElement(this.element.id + '_tiles');
            removeElement('animated_tiles');
            var ele = createElement('div', {
                id: this.element.id + '_tile_parent', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; top: ' + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            var ele1 = createElement('div', {
                id: this.element.id + '_tiles', styles: 'position: absolute; left: ' +
                    (this.mapAreaRect.x) + 'px; top: ' + (this.mapAreaRect.y + padding) + 'px; height: ' +
                    (this.mapAreaRect.height) + 'px; width: '
                    + (this.mapAreaRect.width) + 'px; overflow: hidden;'
            });
            this.element.appendChild(ele);
            this.element.appendChild(ele1);
        }
    };
    /**
     * To initilize the private varibales of maps.
     */
    Maps.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-maps').length;
            this.element.id = 'maps_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.mapLayerPanel = new LayerPanel(this);
    };
    Maps.prototype.findBaseAndSubLayers = function () {
        var _this = this;
        var baseIndex = this.baseLayerIndex;
        var mainLayers = [];
        var subLayers = [];
        this.layersCollection = [];
        Array.prototype.forEach.call(this.layers, function (layer) {
            (layer.type === 'Layer') ? mainLayers.push(layer) : subLayers.push(layer);
        });
        for (var i = 0; i < mainLayers.length; i++) {
            var baseLayer = mainLayers[i];
            if (baseLayer.visible && baseIndex === i) {
                baseLayer.isBaseLayer = true;
                this.isTileMap = (baseLayer.layerType === 'Geometry') ? false : true;
                this.layersCollection.push(baseLayer);
                break;
            }
            else if (i === mainLayers.length - 1) {
                this.layersCollection.push(mainLayers[0]);
                break;
            }
        }
        subLayers.map(function (subLayer, subLayerIndex) {
            if (subLayer.visible) {
                _this.layersCollection.push(subLayer);
            }
        });
    };
    /**
     * @private
     * Render the map border
     */
    Maps.prototype.renderBorder = function () {
        var width = this.border.width;
        var borderElement = this.svgObject.querySelector('#' + this.element.id + '_MapBorder');
        if ((width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            var borderRect = new RectOption(this.element.id + '_MapBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
        }
        else {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    };
    /**
     * @private
     * Render the title and subtitle
     */
    Maps.prototype.renderTitle = function (title, type, bounds, groupEle) {
        var style = title.textStyle;
        var height;
        var width = Math.abs((this.margin.left + this.margin.right) - this.availableSize.width);
        style.fontFamily = this.themeStyle.fontFamily || style.fontFamily;
        style.size = this.themeStyle.titleFontSize || style.size;
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            var trimmedTitle = textTrim(width, title.text, style);
            var elementSize = measureText(trimmedTitle, style);
            var rect = (isNullOrUndefined(bounds)) ? new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            var location_1 = findPosition(rect, title.alignment, elementSize, type);
            var options = new TextOption(this.element.id + '_Map_' + type, location_1.x, location_1.y, 'start', trimmedTitle);
            var titleBounds = new Rect(location_1.x, location_1.y, elementSize.width, elementSize.height);
            var element = renderTextElement(options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor), groupEle);
            element.setAttribute('aria-label', this.description || title.text);
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = Math.abs((titleBounds.y + this.margin.bottom) - this.availableSize.height);
                this.mapAreaRect = new Rect(this.margin.left, titleBounds.y + 10, width, height - 10);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            }
            else {
                this.svgObject.appendChild(groupEle);
            }
        }
        else {
            height = Math.abs((this.margin.top + this.margin.bottom) - this.availableSize.height);
            this.mapAreaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    };
    /**
     * To create svg element for maps
     */
    Maps.prototype.createSVG = function () {
        resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        for (var i = 0; i < this.layers.length; i++) {
            for (var j = 0; j < this.layers[i].markerSettings.length; j++) {
                resetBlazorTemplate(this.element.id + '_MarkerTemplate' + j, 'MarkerTemplate');
            }
        }
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the SVG
     */
    Maps.prototype.removeSvg = function () {
        for (var i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate_' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        removeElement(this.element.id + '_tile_parent');
        removeElement(this.element.id + '_tiles');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    };
    /**
     * To bind event handlers for maps.
     */
    Maps.prototype.wireEVents = function () {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, 'click', this.mapsOnClick, this);
        // EventHandler.add(this.element, 'contextmenu', this.mapsOnRightClick, this);
        EventHandler.add(this.element, 'dblclick', this.mapsOnDoubleClick, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap, this);
        //  EventHandler.add(this.element, cancelEvent, this.mouseLeaveOnMap, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.mapsOnResize.bind(this));
    };
    /**
     * To unbind event handlers from maps.
     */
    Maps.prototype.unWireEVents = function () {
        //let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, 'click', this.mapsOnClick);
        // EventHandler.remove(this.element, 'contextmenu', this.mapsOnRightClick);
        EventHandler.remove(this.element, 'dblclick', this.mapsOnDoubleClick);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnMap);
        //EventHandler.remove(this.element, cancelEvent, this.mouseLeaveOnMap);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.mapsOnResize);
    };
    /**
     * This method is used to perform operations when mouse pointer leave from maps.
     * @param e - Specifies the pointer event on maps.
     */
    Maps.prototype.mouseLeaveOnMap = function (e) {
        if (document.getElementsByClassName('highlightMapStyle').length > 0 && this.legendModule) {
            this.legendModule.removeShapeHighlightCollection();
            removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
        }
    };
    /**
     * This method is used to perform the operations when a click operation is performed on maps.
     * @param e - Specifies the pointer event on maps.
     * @blazorProperty 'PerformClick'
     */
    /* tslint:disable:no-string-literal */
    Maps.prototype.mapsOnClick = function (e) {
        var _this = this;
        var targetEle = e.target;
        var targetId = targetEle.id;
        var layerIndex = 0;
        var latLongValue;
        var latitude = null;
        var longitude = null;
        this.mouseClickEvent = { x: e.x, y: e.y };
        if (targetEle.id.indexOf('_ToolBar') === -1) {
            if (targetEle.id.indexOf('_LayerIndex_') !== -1 && !this.isTileMap && (this.mouseDownEvent['x'] === this.mouseClickEvent['x'])
                && (this.mouseDownEvent['y'] === this.mouseClickEvent['y'])) {
                layerIndex = parseFloat(targetEle.id.split('_LayerIndex_')[1].split('_')[0]);
                latLongValue = this.getGeoLocation(layerIndex, e);
                latitude = latLongValue['latitude'];
                longitude = latLongValue['longitude'];
            }
            else if (this.isTileMap && (this.mouseDownEvent['x'] === this.mouseClickEvent['x'])
                && (this.mouseDownEvent['y'] === this.mouseClickEvent['y'])) {
                latLongValue = this.getTileGeoLocation(e);
                latitude = latLongValue['latitude'];
                longitude = latLongValue['longitude'];
            }
            var eventArgs_1 = {
                cancel: false, name: click, target: targetId, x: e.clientX, y: e.clientY,
                latitude: latitude, longitude: longitude
            };
            this.trigger('click', eventArgs_1, function (mouseArgs) {
                if (targetEle.id.indexOf('shapeIndex') > -1) {
                    if (_this.markerModule && _this.markerModule.sameMarkerData.length > 0 &&
                        (_this.zoomModule ? _this.zoomModule.isSingleClick : true)) {
                        mergeSeparateCluster(_this.markerModule.sameMarkerData, _this, getElement(_this.element.id + '_Markers_Group'));
                        _this.markerModule.sameMarkerData = [];
                    }
                    if (getElement(_this.element.id + '_mapsTooltip') &&
                        _this.mapsTooltipModule.tooltipTargetID.indexOf('_MarkerIndex_') > -1) {
                        removeElement(_this.element.id + '_mapsTooltip');
                    }
                }
                if (_this.markerModule) {
                    _this.markerModule.markerClick(e);
                    _this.markerModule.markerClusterClick(e);
                }
                if (_this.bubbleModule) {
                    _this.bubbleModule.bubbleClick(e);
                }
                if (!eventArgs_1.cancel) {
                    _this.notify(click, targetEle);
                }
                if (!eventArgs_1.cancel && targetEle.id.indexOf('shapeIndex') !== -1) {
                    var layerIndex_1 = parseInt(targetEle.id.split('_LayerIndex_')[1].split('_')[0], 10);
                    var shapeSelectedEventArgs = triggerShapeEvent(targetId, _this.layers[layerIndex_1].selectionSettings, _this, shapeSelected);
                    if (!shapeSelectedEventArgs.cancel && _this.selectionModule && !isNullOrUndefined(_this.shapeSelected)) {
                        customizeStyle(_this.selectionModule.selectionType + 'selectionMap', _this.selectionModule.selectionType + 'selectionMapStyle', shapeSelectedEventArgs);
                    }
                    else if (shapeSelectedEventArgs.cancel && _this.selectionModule
                        && isNullOrUndefined(shapeSelectedEventArgs['data'])) {
                        removeClass(targetEle);
                        _this.selectionModule.removedSelectionList(targetEle);
                    }
                }
            });
        }
    };
    /**
     * This method is used to perform operations when mouse click on maps.
     * @param e - Specifies the pointer event on maps.
     */
    Maps.prototype.mouseEndOnMap = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var rect = this.element.getBoundingClientRect();
        var element = e.target;
        if (e.type.indexOf('touch') !== -1) {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
            target = touchArg.target;
        }
        else {
            this.isTouch = e.pointerType === 'touch';
            pageX = e.pageX;
            pageY = e.pageY;
            target = e.target;
        }
        if (this.isTouch) {
            this.titleTooltip(e, pageX, pageY, true);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        }
        this.notify(Browser.touchEndEvent, e);
        e.preventDefault();
        return false;
    };
    /**
     * This method is used to perform operations when mouse is clicked down on maps.
     * @param e - Specifies the pointer event on maps.
     */
    Maps.prototype.mouseDownOnMap = function (e) {
        var pageX;
        var pageY;
        var target;
        var touchArg;
        this.mouseDownEvent = { x: e.x, y: e.y };
        var rect = this.element.getBoundingClientRect();
        var element = e.target;
        if (element.id.indexOf('_ToolBar') === -1) {
            var markerModule = this.markerModule;
            if (element.id.indexOf('shapeIndex') > -1 || element.id.indexOf('Tile') > -1) {
                if (markerModule && (markerModule.sameMarkerData.length > 0) &&
                    (this.zoomModule ? this.zoomModule.isSingleClick : true)) {
                    mergeSeparateCluster(markerModule.sameMarkerData, this, getElement(this.element.id + '_Markers_Group'));
                    markerModule.sameMarkerData = [];
                }
            }
            if (markerModule) {
                markerModule.markerClick(e);
                markerModule.markerClusterClick(e);
            }
            if (this.bubbleModule) {
                this.bubbleModule.bubbleClick(e);
            }
        }
        this.notify(Browser.touchStartEvent, e);
    };
    /**
     * This method is used to perform operations when performing the double click operation on maps.
     * @param e - Specifies the pointer event.
     * @blazorProperty 'PerformDoubleClick'
     */
    Maps.prototype.mapsOnDoubleClick = function (e) {
        this.notify('dblclick', e);
    };
    /**
     * This method is used to perform operations while performing mouse over on maps.
     * @param e - Specifies the pointer event on maps.
     */
    /* tslint:disable:no-string-literal */
    Maps.prototype.mouseMoveOnMap = function (e) {
        var pageX;
        var pageY;
        var touchArg;
        var target;
        var touches = null;
        target = (e.type === 'touchmove') ? e.target :
            target = e.target;
        // if (target.id.indexOf('shapeIndex') !== -1 && !this.highlightSettings.enable) {
        //     triggerShapeEvent(target.id, this.highlightSettings, this, shapeHighlight);
        // }
        if (this.markerModule) {
            this.markerModule.markerMove(e);
            this.markerModule.markerClusterMouseMove(e);
        }
        if (this.bubbleModule) {
            this.bubbleModule.bubbleMove(e);
        }
        this.onMouseMove(e);
        this.notify(Browser.touchMoveEvent, e);
    };
    /**
     * This method is used to perform operations when mouse move event is performed on maps.
     * @param e - Specifies the pointer event on maps.
     */
    Maps.prototype.onMouseMove = function (e) {
        var element = e.target;
        var pageX;
        var pageY;
        var target;
        var touchArg;
        if (!this.isTouch) {
            this.titleTooltip(e, e.pageX, e.pageY);
            if (!isNullOrUndefined(this.legendModule)) {
                this.legendTooltip(e, e.pageX, e.pageY, true);
            }
        }
        return false;
    };
    Maps.prototype.legendTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        var legendText;
        var page = this.legendModule.currentPage;
        var legendIndex = event.target.id.split('_Index_')[1];
        var collection;
        page = this.legendModule.totalPages.length <= this.legendModule.currentPage
            ? this.legendModule.totalPages.length - 1 : this.legendModule.currentPage < 0 ?
            0 : this.legendModule.currentPage;
        var count = this.legendModule.totalPages.length !== 0 ?
            this.legendModule.totalPages[page]['Collection'].length : this.legendModule.totalPages.length;
        for (var i = 0; i < count; i++) {
            collection = this.legendModule.totalPages[page]['Collection'][i];
            legendText = collection['DisplayText'];
            targetId = event.target['id'];
            legendIndex = event.target['id'].split('_Index_')[1];
            if ((targetId === (this.element.id + '_Legend_Text_Index_' + legendIndex)) &&
                (event.target.textContent.indexOf('...') > -1) && collection['idIndex'] === parseInt(legendIndex, 10)) {
                showTooltip(legendText, this.legendSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight, this.element.id + '_EJ2_Legend_Text_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
            }
        }
        if ((targetId !== (this.element.id + '_Legend_Text_Index_' + legendIndex))) {
            removeElement(this.element.id + '_EJ2_Legend_Text_Tooltip');
        }
    };
    Maps.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        if (targetId === (this.element.id + '_LegendTitle') && (event.target.textContent.indexOf('...') === -1)) {
            showTooltip(this.legendSettings.title.text, this.legendSettings.titleStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight, this.element.id + '_EJ2_LegendTitle_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_LegendTitle_Tooltip');
        }
        if ((targetId === (this.element.id + '_Map_title')) && (event.target.textContent.indexOf('...') > -1)) {
            showTooltip(this.titleSettings.text, this.titleSettings.textStyle.size, x, y, this.element.offsetWidth, this.element.offsetHeight, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement(this.element.id + '_EJ2_Title_Tooltip');
        }
    };
    /*

    /**
     * This method is used to perform operations while resizing the window.
     * @param e - Specifies the arguments of window resize event.
     */
    Maps.prototype.mapsOnResize = function (e) {
        var _this = this;
        this.isResize = true;
        var args = {
            name: resize,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            maps: !this.isBlazor ? this : null
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-maps')) {
            this.resizeTo = setTimeout(function () {
                _this.unWireEVents();
                _this.createSVG();
                _this.refreshing = true;
                _this.wireEVents();
                args.currentSize = _this.availableSize;
                _this.trigger(resize, args);
                _this.render();
            }, 500);
        }
        return false;
    };
    /**
     * This method is used to zoom the map by specifying the center position.
     * @param centerPosition - Specifies the center position for maps.
     * @param zoomFactor - Specifies the zoom factor for maps.
     */
    Maps.prototype.zoomByPosition = function (centerPosition, zoomFactor) {
        var factor = this.mapLayerPanel.calculateFactor(this.layersCollection[0]);
        var position;
        var size = this.mapAreaRect;
        if (!this.isTileMap && this.zoomModule) {
            if (!isNullOrUndefined(centerPosition)) {
                position = convertGeoToPoint(centerPosition.latitude, centerPosition.longitude, factor, this.layersCollection[0], this);
                var mapRect = document.getElementById(this.element.id + '_Layer_Collections').getBoundingClientRect();
                var svgRect = this.svgObject.getBoundingClientRect();
                var xDiff = Math.abs(mapRect.left - svgRect.left) / this.scale;
                var yDiff = Math.abs(mapRect.top - svgRect.top) / this.scale;
                var x = this.translatePoint.x + xDiff;
                var y = this.translatePoint.y + yDiff;
                this.scale = zoomFactor;
                this.translatePoint.x = ((mapRect.left < svgRect.left ? x : 0) + (size.width / 2) - (position.x * zoomFactor)) / zoomFactor;
                this.translatePoint.y = ((mapRect.top < svgRect.top ? y : 0) + (size.height / 2) - (position.y * zoomFactor)) / zoomFactor;
                this.zoomModule.applyTransform();
            }
            else {
                position = { x: size.width / 2, y: size.height / 2 };
                this.zoomModule.performZooming(position, zoomFactor, zoomFactor > this.scale ? 'ZoomIn' : 'ZoomOut');
            }
        }
        else if (this.zoomModule) {
            this.tileZoomLevel = zoomFactor;
            this.tileTranslatePoint = this.mapLayerPanel['panTileMap'](this.availableSize.width, this.availableSize.height, { x: centerPosition.longitude, y: centerPosition.latitude });
            this.mapLayerPanel.generateTiles(zoomFactor, this.tileTranslatePoint, null, new BingMap(this));
        }
    };
    /**
     * This method is used to perform panning by specifying the direction.
     * @param direction - Specifies the direction in which the panning is performed.
     * @param mouseLocation - Specifies the location of the mouse pointer in maps.
     */
    Maps.prototype.panByDirection = function (direction, mouseLocation) {
        var xDiff = 0;
        var yDiff = 0;
        switch (direction) {
            case 'Left':
                xDiff = -(this.mapAreaRect.width / 7);
                break;
            case 'Right':
                xDiff = (this.mapAreaRect.width / 7);
                break;
            case 'Top':
                yDiff = -(this.mapAreaRect.height / 7);
                break;
            case 'Bottom':
                yDiff = (this.mapAreaRect.height / 7);
                break;
        }
        if (this.zoomModule) {
            this.zoomModule.panning(direction, xDiff, yDiff, mouseLocation);
        }
    };
    /**
     * This method is used to add the layers dynamically to the maps.
     * @param layer - Specifies the layer for the maps.
     */
    Maps.prototype.addLayer = function (layer) {
        this.layers.push(new LayerSettings(this.layers[0], 'layers', layer));
        this.refresh();
    };
    /**
     * This method is used to remove a layer from map.
     * @param index - Specifies the index number of the layer to be removed.
     */
    Maps.prototype.removeLayer = function (index) {
        this.layers.splice(index, 1);
        this.refresh();
    };
    /**
     * This method is used to add markers dynamically in the maps.
     * If we provide the index value of the layer in which the marker to be added and the coordinates
     * of the marker as parameters, the marker will be added in the location.
     * @param layerIndex - Specifies the index number of the layer.
     * @param marker - Specifes the settings of the marker to be added.
     */
    Maps.prototype.addMarker = function (layerIndex, markerCollection) {
        var layerEle = document.getElementById(this.element.id + '_LayerIndex_' + layerIndex);
        if (markerCollection.length > 0 && layerEle) {
            for (var _i = 0, markerCollection_1 = markerCollection; _i < markerCollection_1.length; _i++) {
                var newMarker = markerCollection_1[_i];
                this.layersCollection[layerIndex].markerSettings.push(new MarkerSettings(this, 'markerSettings', newMarker));
            }
            var markerModule = new Marker(this);
            markerModule.markerRender(layerEle, layerIndex, this.mapLayerPanel['currentFactor'], 'AddMarker');
            this.arrangeTemplate();
        }
    };
    /**
     * This method is used to select the geometric shape element in the maps component.
     * @param layerIndex - Specifies the index of the layer in maps.
     * @param propertyName - Specifies the property name from the data source.
     * @param name - Specifies the name of the shape that is selected.
     * @param enable - Specifies the shape selection to be enabled.
     */
    Maps.prototype.shapeSelection = function (layerIndex, propertyName, name, enable) {
        var targetEle;
        var popertyNameArray = Array.isArray(propertyName) ? propertyName : Array(propertyName);
        if (isNullOrUndefined(enable)) {
            enable = true;
        }
        var selectionsettings = this.layers[layerIndex].selectionSettings;
        if (!selectionsettings.enableMultiSelect && this.legendSelection && enable) {
            this.removeShapeSelection();
        }
        if (selectionsettings.enable) {
            var targetId = void 0;
            var dataIndex = void 0;
            var shapeIndex = void 0;
            var shapeDataValue = void 0;
            var data = void 0;
            var shapeData = this.layers[layerIndex].shapeData['features'];
            for (var i = 0; i < shapeData.length; i++) {
                for (var j = 0; j < popertyNameArray.length; j++) {
                    var propertyName_1 = !isNullOrUndefined(shapeData[i]['properties'][popertyNameArray[j]])
                        && isNaN(shapeData[i]['properties'][popertyNameArray[j]]) ?
                        shapeData[i]['properties'][popertyNameArray[j]].toLowerCase() : shapeData[i]['properties'][popertyNameArray[j]];
                    var shapeName = !isNullOrUndefined(name) ? name.toLowerCase() : name;
                    if (propertyName_1 === shapeName) {
                        var k = checkShapeDataFields(this.layers[layerIndex].dataSource, shapeData[i]['properties'], this.layers[layerIndex].shapeDataPath, this.layers[layerIndex].shapePropertyPath, this.layers[layerIndex]);
                        targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_' +
                            (!isNullOrUndefined(k) ? k.toString() : 'undefined');
                        targetEle = getElement(targetId);
                        if (isNullOrUndefined(k) && isNullOrUndefined(targetEle)) {
                            targetId = this.element.id + '_' + 'LayerIndex_' + layerIndex + '_shapeIndex_' + i + '_dataIndex_null';
                            targetEle = getElement(targetId);
                        }
                        shapeIndex = parseInt(targetEle.id.split('_shapeIndex_')[1].split('_')[0], 10);
                        shapeDataValue = this.layers[layerIndex].shapeData['features']['length'] > shapeIndex ?
                            this.layers[layerIndex].shapeData['features'][shapeIndex]['properties'] : null;
                        dataIndex = parseInt(targetEle.id.split('_dataIndex_')[1].split('_')[0], 10);
                        data = isNullOrUndefined(dataIndex) ? null : this.layers[layerIndex].dataSource[dataIndex];
                        if (enable) {
                            triggerItemSelectionEvent(selectionsettings, this, targetEle, shapeDataValue, data);
                            this.shapeSelectionClass = getElement('ShapeselectionMap');
                            if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1) {
                                this.legendModule.shapeHighLightAndSelection(targetEle, data, selectionsettings, 'selection', layerIndex);
                            }
                            var shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                            if (shapeToggled) {
                                targetEle.setAttribute('class', 'ShapeselectionMapStyle');
                                if (this.selectedElementId.indexOf(targetEle.getAttribute('id')) === -1) {
                                    this.selectedElementId.push(targetEle.getAttribute('id'));
                                }
                                if (!selectionsettings.enableMultiSelect) {
                                    return;
                                }
                            }
                        }
                        else {
                            this.legendSelection = (!selectionsettings.enableMultiSelect && !this.legendSelection) ?
                                true : this.legendSelection;
                            if (this.legendSettings.visible && targetEle.id.indexOf('_MarkerIndex_') === -1 &&
                                targetEle.getAttribute('class') === 'ShapeselectionMapStyle') {
                                this.legendModule.shapeHighLightAndSelection(targetEle, data, selectionsettings, 'selection', layerIndex);
                            }
                            var shapeToggled = this.legendSettings.visible ? this.legendModule.shapeToggled : true;
                            if (shapeToggled) {
                                removeClass(targetEle);
                                var selectedElementIdIndex = this.selectedElementId.indexOf(targetEle.getAttribute('id'));
                                if (selectedElementIdIndex !== -1) {
                                    this.selectedElementId.splice(selectedElementIdIndex, 1);
                                    if (!selectionsettings.enableMultiSelect && this.legendSelection && this.selectedElementId.length > 0) {
                                        this.removeShapeSelection();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * This method is used to zoom the maps component based on the provided coordinates.
     * @param minLatitude - Specifies the minimum latitude to be zoomed.
     * @param minLongitude - Specifies the minimum latitude to be zoomed.
     * @param maxLatitude - Specifies the maximum latitude to be zoomed.
     * @param maxLongitude - Specifies the maximum longitude to be zoomed.
     */
    Maps.prototype.zoomToCoordinates = function (minLatitude, minLongitude, maxLatitude, maxLongitude) {
        var _a, _b;
        var centerLatitude;
        var centerLongtitude;
        var isTwoCoordinates = false;
        if (isNullOrUndefined(maxLatitude) && isNullOrUndefined(maxLongitude)
            || isNullOrUndefined(minLatitude) && isNullOrUndefined(minLongitude)) {
            minLatitude = isNullOrUndefined(minLatitude) ? 0 : minLatitude;
            minLongitude = isNullOrUndefined(minLatitude) ? 0 : minLongitude;
            maxLatitude = isNullOrUndefined(maxLatitude) ? minLatitude : maxLatitude;
            maxLongitude = isNullOrUndefined(maxLongitude) ? minLongitude : maxLongitude;
            isTwoCoordinates = true;
        }
        if (minLatitude > maxLatitude) {
            _a = [maxLatitude, minLatitude], minLatitude = _a[0], maxLatitude = _a[1];
        }
        if (minLongitude > maxLongitude) {
            _b = [maxLongitude, minLongitude], minLongitude = _b[0], maxLongitude = _b[1];
        }
        if (!isTwoCoordinates) {
            centerLatitude = (minLatitude + maxLatitude) / 2;
            centerLongtitude = (minLongitude + maxLongitude) / 2;
        }
        else {
            centerLatitude = (minLatitude + maxLatitude);
            centerLongtitude = (minLongitude + maxLongitude);
        }
        this.centerLatOfGivenLocation = centerLatitude;
        this.centerLongOfGivenLocation = centerLongtitude;
        this.minLatOfGivenLocation = minLatitude;
        this.minLongOfGivenLocation = minLongitude;
        this.maxLatOfGivenLocation = maxLatitude;
        this.maxLongOfGivenLocation = maxLongitude;
        this.zoomNotApplied = true;
        this.scaleOfGivenLocation = calculateZoomLevel(minLatitude, maxLatitude, minLongitude, maxLongitude, this.mapAreaRect.width, this.mapAreaRect.height, this);
        var zoomArgs;
        zoomArgs = {
            cancel: false, name: 'zoom', type: zoomIn, maps: !this.isBlazor ? this : null,
            tileTranslatePoint: {}, translatePoint: {},
            tileZoomLevel: this.isTileMap ? { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation } : {},
            scale: !this.isTileMap ? { previous: this.scale, current: this.scaleOfGivenLocation } :
                { previous: this.tileZoomLevel, current: this.scaleOfGivenLocation }
        };
        this.trigger('zoom', zoomArgs);
        this.refresh();
    };
    /**
     * This method is used to remove multiple selected shapes in the maps.
     */
    Maps.prototype.removeShapeSelection = function () {
        var selectedElements = this.selectedElementId.length;
        for (var i = 0; i < selectedElements; i++) {
            removeClass(getElementByID(this.selectedElementId[0]));
            this.selectedElementId.splice(0, 1);
        }
        if (this.legendSettings.visible) {
            var legendSelectedElements = this.legendSelectionCollection.length;
            for (var i = 0; i < legendSelectedElements; i++) {
                removeClass(getElementByID(this.legendSelectionCollection[i]['legendElement']['id']));
                this.selectedLegendElementId.splice(0, 1);
            }
        }
        this.shapeSelectionItem = [];
        this.legendSelectionCollection = [];
    };
    /**
     * This method is used to set culture for maps component.
     */
    Maps.prototype.setCulture = function () {
        this.intl = new Internationalization();
        this.setLocaleConstants();
        this.localeObject = new L10n(this.getModuleName(), this.defaultLocalConstants, this.locale);
    };
    /**
     * This method to set locale constants to the maps component.
     */
    Maps.prototype.setLocaleConstants = function () {
        // Need to modify after the api confirm
        this.defaultLocalConstants = {
            ZoomIn: 'Zoom in',
            Zoom: 'Zoom',
            ZoomOut: 'Zoom out',
            Pan: 'Pan',
            Reset: 'Reset',
        };
    };
    /**
     * This method disposes the maps component.
     */
    Maps.prototype.destroy = function () {
        this.unWireEVents();
        this.shapeSelectionItem = [];
        this.toggledShapeElementId = [];
        this.toggledLegendId = [];
        this.legendSelectionCollection = [];
        this.selectedLegendElementId = [];
        this.selectedNavigationElementId = [];
        this.selectedBubbleElementId = [];
        this.selectedMarkerElementId = [];
        this.selectedElementId = [];
        this.dataLabelShape = [];
        this.zoomShapeCollection = [];
        this.zoomLabelPositions = [];
        this.mouseDownEvent = { x: null, y: null };
        this.mouseClickEvent = { x: null, y: null };
        if (document.getElementById('mapsmeasuretext')) {
            document.getElementById('mapsmeasuretext').remove();
        }
        this.removeSvg();
        _super.prototype.destroy.call(this);
    };
    /**
     * Gets component name
     */
    Maps.prototype.getModuleName = function () {
        return 'maps';
    };
    /**
     * Gets the properties to be maintained in the persisted state.
     * @private
     */
    Maps.prototype.getPersistData = function () {
        var keyEntity = ['translatePoint', 'zoomSettings', 'mapScaleValue', 'tileTranslatePoint', 'baseTranslatePoint',
            'scale', 'zoomPersistence', 'defaultState', 'markerZoomedState', 'initialCheck', 'initialZoomLevel', 'initialTileTranslate',
            'applyZoomReset', 'markerZoomFactor'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Maps.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        var isMarker = false;
        var isStaticMapType = false;
        var layerEle;
        if (newProp['layers']) {
            var newLayerLength = Object.keys(newProp['layers']).length;
            layerEle = document.getElementById(this.element.id + '_LayerIndex_' + (newLayerLength - 1));
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layers':
                case 'projectionType':
                case 'centerPosition':
                case 'legendSettings':
                case 'zoomSettings':
                case 'baseLayerIndex':
                    if (prop === 'layers') {
                        var layerPropLength = Object.keys(newProp.layers).length;
                        for (var x = 0; x < layerPropLength; x++) {
                            if (!isNullOrUndefined(newProp.layers[x])) {
                                var collection = Object.keys(newProp.layers[x]);
                                for (var _b = 0, collection_1 = collection; _b < collection_1.length; _b++) {
                                    var collectionProp = collection_1[_b];
                                    if (collectionProp === 'markerSettings') {
                                        isMarker = true;
                                    }
                                    else if (collectionProp === 'staticMapType') {
                                        isStaticMapType = true;
                                    }
                                }
                            }
                        }
                    }
                    render = true;
                    break;
                case 'locale':
                case 'currencyCode':
                    _super.prototype.refresh.call(this);
                    break;
            }
        }
        if (render) {
            if (newProp.layers && isMarker) {
                removeElement(this.element.id + '_Markers_Group');
                if (this.isTileMap) {
                    if (this.isBlazor) {
                        this.render();
                    }
                    else {
                        this.mapLayerPanel.renderTileLayer(this.mapLayerPanel, this.layers['currentFactor'], (this.layers.length - 1));
                    }
                }
                else {
                    this.render();
                }
            }
            else if (newProp.layers && isStaticMapType) {
                this.mapLayerPanel.renderGoogleMap(this.layers[this.layers.length - 1].key, this.staticMapZoom);
            }
            else {
                this.createSVG();
                this.render();
            }
        }
    };
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Maps.prototype.requiredModules = function () {
        var modules = [];
        var isVisible = this.findVisibleLayers(this.layers);
        var annotationEnable = false;
        this.annotations.map(function (annotation, index) {
            annotationEnable = annotation.content != null;
        });
        if (this.isBubbleVisible()) {
            modules.push({
                member: 'Bubble',
                args: [this]
            });
        }
        if (isVisible.highlight) {
            modules.push({
                member: 'Highlight',
                args: [this]
            });
        }
        if (isVisible.selection) {
            modules.push({
                member: 'Selection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.zoomSettings.enable || this.zoomSettings.zoomFactor > this.zoomSettings.minZoom) {
            modules.push({
                member: 'Zoom',
                args: [this]
            });
        }
        if (this.isMarkersVisible()) {
            modules.push({
                member: 'Marker',
                args: [this]
            });
        }
        if (this.isDataLabelVisible()) {
            modules.push({
                member: 'DataLabel',
                args: [this]
            });
        }
        if (this.isNavigationVisible()) {
            modules.push({
                member: 'NavigationLine',
                args: [this]
            });
        }
        if (isVisible.tooltip) {
            modules.push({
                member: 'MapsTooltip',
                args: [this]
            });
        }
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To find marker visibility
     */
    Maps.prototype.isMarkersVisible = function () {
        var isVisible = false;
        Array.prototype.forEach.call(this.layers, function (layer, layerIndex) {
            for (var i = 0; i < layer.markerSettings.length; i++) {
                if (layer.markerSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    };
    /**
     * To find DataLabel visibility
     */
    Maps.prototype.isDataLabelVisible = function () {
        var isVisible = false;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].dataLabelSettings.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * To find navigation line visibility
     */
    Maps.prototype.isNavigationVisible = function () {
        var isVisible = false;
        Array.prototype.forEach.call(this.layers, function (layer, layerIndex) {
            for (var i = 0; i < layer.navigationLineSettings.length; i++) {
                if (layer.navigationLineSettings[i].visible) {
                    isVisible = true;
                    break;
                }
            }
        });
        return isVisible;
    };
    /**
     * To find marker visibility
     */
    Maps.prototype.isBubbleVisible = function () {
        var isVisible = false;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            if (this.getBubbleVisible(layer)) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * To find the bubble visibility from layer
     * @private
     */
    Maps.prototype.getBubbleVisible = function (layer) {
        var isVisible = false;
        for (var _i = 0, _a = layer.bubbleSettings; _i < _a.length; _i++) {
            var bubble = _a[_i];
            if (bubble.visible) {
                isVisible = true;
                break;
            }
        }
        return isVisible;
    };
    /**
     * This method handles the printing functionality for the maps component.
     * @param id - Specifies the element to be printed.
     */
    Maps.prototype.print = function (id) {
        if ((this.allowPrint) && (this.printModule)) {
            this.printModule.print(id);
        }
    };
    /**
     * This method handles the export functionality for the maps component.
     * @param type - Specifies the type of the exported file.
     * @param fileName - Specifies the name of the file with which the rendered maps need to be exported.
     * @param orientation - Specifies the orientation of the pdf document in exporting.
     * @param allowDownload - Specifies whether to download as a file or get as base64 string for the file
     */
    Maps.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if ((type !== 'PDF') && (this.allowImageExport) && (this.imageExportModule)) {
            return new Promise(function (resolve, reject) {
                resolve(_this.imageExportModule.export(type, fileName, allowDownload));
            });
        }
        else if ((this.allowPdfExport) && (this.pdfExportModule)) {
            return new Promise(function (resolve, reject) {
                resolve(_this.pdfExportModule.export(type, fileName, allowDownload, orientation));
            });
        }
        return null;
    };
    /**
     * To find visibility of layers and markers for required modules load.
     */
    Maps.prototype.findVisibleLayers = function (layers, isLayerVisible, isBubblevisible, istooltipVisible, isSelection, isHighlight) {
        if (isLayerVisible === void 0) { isLayerVisible = false; }
        if (isBubblevisible === void 0) { isBubblevisible = false; }
        if (istooltipVisible === void 0) { istooltipVisible = false; }
        if (isSelection === void 0) { isSelection = false; }
        if (isHighlight === void 0) { isHighlight = false; }
        var bubbles;
        var markers;
        var navigationLine;
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var layer = layers_1[_i];
            isLayerVisible = layer.visible || isLayerVisible;
            if (layer.visible) {
                bubbles = layer.bubbleSettings;
                markers = layer.markerSettings;
                navigationLine = layer.navigationLineSettings;
                for (var _a = 0, navigationLine_1 = navigationLine; _a < navigationLine_1.length; _a++) {
                    var navigation = navigationLine_1[_a];
                    if (navigation.visible) {
                        isSelection = navigation.highlightSettings.enable || isSelection;
                        isHighlight = navigation.selectionSettings.enable || isHighlight;
                    }
                }
                for (var _b = 0, markers_1 = markers; _b < markers_1.length; _b++) {
                    var marker = markers_1[_b];
                    if (marker.visible) {
                        istooltipVisible = marker.tooltipSettings.visible || istooltipVisible;
                        isSelection = marker.selectionSettings.enable || isSelection;
                        isHighlight = marker.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) {
                        break;
                    }
                }
                for (var _c = 0, bubbles_1 = bubbles; _c < bubbles_1.length; _c++) {
                    var bubble = bubbles_1[_c];
                    if (bubble.visible) {
                        istooltipVisible = bubble.tooltipSettings.visible || istooltipVisible;
                        isSelection = bubble.selectionSettings.enable || isSelection;
                        isHighlight = bubble.highlightSettings.enable || isHighlight;
                    }
                    if (istooltipVisible) {
                        break;
                    }
                }
                istooltipVisible = layer.tooltipSettings.visible || istooltipVisible;
                isSelection = layer.selectionSettings.enable || isSelection;
                isHighlight = layer.highlightSettings.enable || isHighlight;
            }
            if (isLayerVisible && isBubblevisible && istooltipVisible) {
                break;
            }
        }
        return {
            layer: isLayerVisible, bubble: isBubblevisible, tooltip: istooltipVisible,
            selection: isSelection, highlight: isHighlight
        };
    };
    /**
     * This method is used to get the geo location points.
     * @param {number} layerIndex - Specifies the index number of the layer of the map.
     * @param {PointerEvent} location - Specifies the location in point format.
     * @return GeoPosition
     */
    Maps.prototype.getGeoLocation = function (layerIndex, location) {
        var container = document.getElementById(this.element.id);
        var pageX = location['layerX'] - container.offsetLeft;
        var pageY = location['layerY'] - container.offsetTop;
        var currentLayer = this.layersCollection[layerIndex];
        var translate = getTranslate(this, currentLayer, false);
        var translatePoint = translate['location'];
        var translatePointX = translatePoint.x * this.scale;
        var translatePointY = translatePoint.y * this.scale;
        var mapSize = (Math.min(this.mapAreaRect.height, this.mapAreaRect.width)
            * this.mapLayerPanel['currentFactor']) * this.scale;
        var xx = (this.clip(pageX - translatePointX, 0, mapSize - 1) / mapSize) - 0.5;
        var yy = 0.5 - (this.clip(pageY - translatePointY, 0, mapSize - 1) / mapSize);
        var lat = 90 - 360 * Math.atan(Math.exp(-yy * 2 * Math.PI)) / Math.PI;
        var long = 360 * xx;
        return { latitude: lat, longitude: long };
    };
    Maps.prototype.clip = function (value, minVal, maxVal) {
        return Math.min(Math.max(value, minVal), maxVal);
    };
    /**
     * This method is used to get the geo location points when tile maps is rendered in the maps component.
     * @param {PointerEvent} - Specifies the location in point format.
     * @return GeoPosition
     */
    Maps.prototype.getTileGeoLocation = function (location) {
        var container = document.getElementById(this.element.id);
        var latLong;
        var ele = document.getElementById(this.element.id + '_tile_parent');
        latLong = this.pointToLatLong(location['layerX'] + this.mapAreaRect.x - (ele.offsetLeft - container.offsetLeft), location['layerY'] + this.mapAreaRect.y - (ele.offsetTop - container.offsetTop));
        return { latitude: latLong['latitude'], longitude: latLong['longitude'] };
    };
    /**
     * This method is used to convert the point to latitude and longitude in maps.
     * @param pageX - Specifies the x value for the page.
     * @param pageY - Specifies the y value for the page.
     */
    Maps.prototype.pointToLatLong = function (pageX, pageY) {
        var padding = this.layers[this.layers.length - 1].layerType === 'GoogleStaticMap' ? 0 : 10;
        pageY = (this.zoomSettings.enable) ? pageY + padding : pageY;
        var mapSize = 256 * Math.pow(2, this.tileZoomLevel);
        var x1 = (this.clip(pageX - (this.translatePoint.x * this.scale), 0, mapSize - 1) / mapSize) - 0.5;
        var y1 = 0.5 - (this.clip(pageY - (this.translatePoint.y * this.scale), 0, mapSize - 1) / mapSize);
        var lat = 90 - 360 * Math.atan(Math.exp(-y1 * 2 * Math.PI)) / Math.PI;
        var long = 360 * x1;
        return { latitude: lat, longitude: long };
    };
    __decorate([
        Property(null)
    ], Maps.prototype, "background", void 0);
    __decorate([
        Property(false)
    ], Maps.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], Maps.prototype, "format", void 0);
    __decorate([
        Property(null)
    ], Maps.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], Maps.prototype, "height", void 0);
    __decorate([
        Property('MouseMove')
    ], Maps.prototype, "tooltipDisplayMode", void 0);
    __decorate([
        Property(false)
    ], Maps.prototype, "allowPrint", void 0);
    __decorate([
        Property(false)
    ], Maps.prototype, "allowImageExport", void 0);
    __decorate([
        Property(false)
    ], Maps.prototype, "allowPdfExport", void 0);
    __decorate([
        Complex({}, TitleSettings)
    ], Maps.prototype, "titleSettings", void 0);
    __decorate([
        Complex({}, ZoomSettings)
    ], Maps.prototype, "zoomSettings", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], Maps.prototype, "legendSettings", void 0);
    __decorate([
        Collection([], LayerSettings)
    ], Maps.prototype, "layers", void 0);
    __decorate([
        Collection([], Annotation)
    ], Maps.prototype, "annotations", void 0);
    __decorate([
        Complex({}, Margin)
    ], Maps.prototype, "margin", void 0);
    __decorate([
        Complex({ color: '#DDDDDD', width: 0 }, Border)
    ], Maps.prototype, "border", void 0);
    __decorate([
        Property('Material')
    ], Maps.prototype, "theme", void 0);
    __decorate([
        Property('Mercator')
    ], Maps.prototype, "projectionType", void 0);
    __decorate([
        Property(0)
    ], Maps.prototype, "baseLayerIndex", void 0);
    __decorate([
        Property(null)
    ], Maps.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], Maps.prototype, "tabIndex", void 0);
    __decorate([
        Complex({ latitude: null, longitude: null }, CenterPosition)
    ], Maps.prototype, "centerPosition", void 0);
    __decorate([
        Complex({}, MapsAreaSettings)
    ], Maps.prototype, "mapsArea", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "load", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "click", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "doubleClick", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "rightClick", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "resize", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "legendRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "tooltipRenderComplete", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "shapeSelected", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "itemSelection", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "itemHighlight", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "shapeHighlight", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "layerRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "shapeRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerClusterRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerClick", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerClusterClick", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerClusterMouseMove", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "markerMouseMove", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "dataLabelRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "bubbleRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "bubbleClick", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "bubbleMouseMove", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "annotationRendering", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "zoom", void 0);
    __decorate([
        Event()
    ], Maps.prototype, "pan", void 0);
    Maps = __decorate([
        NotifyPropertyChanges
    ], Maps);
    return Maps;
}(Component));
export { Maps };
