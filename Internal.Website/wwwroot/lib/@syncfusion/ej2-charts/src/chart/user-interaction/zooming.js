import { EventHandler, Browser, createElement } from '@syncfusion/ej2-base';
import { getRectLocation, minMax, getElement, ChartLocation, RectOption } from '../../common/utils/helper';
import { Rect, measureText } from '@syncfusion/ej2-svg-base';
import { Toolkit } from './zooming-toolkit';
import { zoomComplete, onZooming } from '../../common/model/constants';
import { withInBounds } from '../../common/utils/helper';
/**
 * `Zooming` module handles the zooming for chart.
 */
var Zoom = /** @class */ (function () {
    /**
     * Constructor for Zooming module.
     * @private.
     */
    function Zoom(chart) {
        this.chart = chart;
        this.isPointer = Browser.isPointer;
        this.browserName = Browser.info.name;
        this.wheelEvent = this.browserName === 'mozilla' ? (this.isPointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';
        this.cancelEvent = this.isPointer ? 'pointerleave' : 'mouseleave';
        this.addEventListener();
        this.isDevice = Browser.isDevice;
        var zooming = chart.zoomSettings;
        this.toolkit = new Toolkit(chart);
        this.zooming = zooming;
        this.elementId = chart.element.id;
        this.zoomingRect = new Rect(0, 0, 0, 0);
        this.zoomAxes = [];
        this.zoomkitOpacity = 0.3;
        this.isIOS = Browser.isIos || Browser.isIos7;
        this.isZoomed = this.performedUI = this.zooming.enablePan && this.zooming.enableSelectionZooming;
        if (zooming.enableScrollbar) {
            chart.scrollElement = createElement('div', { id: chart.element.id + '_scrollElement' });
        }
    }
    /**
     * Function that handles the Rectangular zooming.
     * @return {void}
     */
    Zoom.prototype.renderZooming = function (e, chart, isTouch) {
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        if (this.zooming.enableSelectionZooming && (!isTouch
            || (chart.isDoubleTap && this.touchStartList.length === 1)) && (!this.isPanning || chart.isDoubleTap)) {
            this.isPanning = this.isDevice ? true : this.isPanning;
            this.performedUI = true;
            this.drawZoomingRectangle(chart);
        }
        else if (this.isPanning && chart.isChartDrag) {
            if (!isTouch || (isTouch && this.touchStartList.length === 1)) {
                this.pinchTarget = isTouch ? e.target : null;
                this.doPan(chart, chart.axisCollections);
            }
        }
    };
    // Zooming rectangle drawn here
    Zoom.prototype.drawZoomingRectangle = function (chart) {
        var areaBounds = chart.chartAxisLayoutPanel.seriesClipRect;
        var startLocation = new ChartLocation(chart.previousMouseMoveX, chart.previousMouseMoveY);
        var endLocation = new ChartLocation(chart.mouseX, chart.mouseY);
        var rect = this.zoomingRect = getRectLocation(startLocation, endLocation, areaBounds);
        if (rect.width > 0 && rect.height > 0) {
            this.isZoomed = true;
            chart.disableTrackTooltip = true;
            chart.svgObject.setAttribute('cursor', 'crosshair');
            if (this.zooming.mode === 'X') {
                rect.height = areaBounds.height;
                rect.y = areaBounds.y;
            }
            else if (this.zooming.mode === 'Y') {
                rect.width = areaBounds.width;
                rect.x = areaBounds.x;
            }
            var svg = chart.enableCanvas ? document.getElementById(this.elementId + '_tooltip_svg') : chart.svgObject;
            svg.appendChild(chart.svgRenderer.drawRectangle(new RectOption(this.elementId + '_ZoomArea', chart.themeStyle.selectionRectFill, { color: chart.themeStyle.selectionRectStroke, width: 1 }, 1, rect, 0, 0, '', '3')));
        }
    };
    // Panning performed here
    Zoom.prototype.doPan = function (chart, axes) {
        var _this = this;
        if (chart.startMove && chart.crosshair.enable) {
            return null;
        }
        var currentScale;
        var offset;
        this.isZoomed = true;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        chart.disableTrackTooltip = true;
        var argsData;
        var zoomingEventArgs;
        var zoomedAxisCollection = [];
        for (var _i = 0, _a = axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor, previousZoomPosition: axis.zoomPosition,
                currentZoomFactor: axis.zoomFactor, currentZoomPosition: axis.zoomPosition
            };
            currentScale = Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1);
            if (axis.orientation === 'Horizontal') {
                offset = (chart.previousMouseMoveX - chart.mouseX) / axis.rect.width / currentScale;
                argsData.currentZoomPosition = minMax(axis.zoomPosition + offset, 0, (1 - axis.zoomFactor));
            }
            else {
                offset = (chart.previousMouseMoveY - chart.mouseY) / axis.rect.height / currentScale;
                argsData.currentZoomPosition = minMax(axis.zoomPosition - offset, 0, (1 - axis.zoomFactor));
            }
            chart.trigger(zoomComplete, argsData);
            if (!argsData.cancel) {
                axis.zoomFactor = argsData.currentZoomFactor;
                axis.zoomPosition = argsData.currentZoomPosition;
            }
            zoomedAxisCollection.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
        }
        zoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!zoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, zoomingEventArgs, function () {
                _this.performDefferedZoom(chart);
            });
        }
        else {
            this.performDefferedZoom(chart);
        }
    };
    Zoom.prototype.performDefferedZoom = function (chart) {
        var translateX;
        var translateY;
        if (this.zooming.enableDeferredZooming) {
            translateX = chart.mouseX - chart.mouseDownX;
            translateY = chart.mouseY - chart.mouseDownY;
            switch (this.zooming.mode) {
                case 'X':
                    translateY = 0;
                    break;
                case 'Y':
                    translateX = 0;
                    break;
            }
            this.setTransform(translateX, translateY, null, null, chart, false);
            this.refreshAxis(chart.chartAxisLayoutPanel, chart, chart.axisCollections);
            if (chart.enableCanvas) {
                this.performZoomRedraw(chart);
            }
        }
        else {
            this.performZoomRedraw(chart);
        }
        chart.previousMouseMoveX = chart.mouseX;
        chart.previousMouseMoveY = chart.mouseY;
    };
    /**
     * Redraw the chart on zooming.
     * @return {void}
     * @private
     */
    Zoom.prototype.performZoomRedraw = function (chart) {
        var rect = this.zoomingRect;
        chart.animateSeries = false;
        if (this.isZoomed) {
            if (rect.width > 0 && rect.height > 0) {
                this.performedUI = true;
                chart.svgObject.setAttribute('cursor', 'auto');
                this.doZoom(chart, chart.axisCollections, chart.chartAxisLayoutPanel.seriesClipRect);
                chart.isDoubleTap = false;
            }
            else if (chart.disableTrackTooltip) {
                chart.disableTrackTooltip = false;
                chart.delayRedraw = false;
                chart.enableCanvas ? chart.createChartSvg() : chart.removeSvg();
                chart.refreshAxis();
                chart.refreshBound();
            }
        }
    };
    Zoom.prototype.refreshAxis = function (layout, chart, axes) {
        var mode = chart.zoomSettings.mode;
        layout.measureAxis(new Rect(chart.initialClipRect.x, chart.initialClipRect.y, chart.initialClipRect.width, chart.initialClipRect.height));
        axes.map(function (axis, index) {
            if (axis.orientation === 'Horizontal' && mode !== 'Y') {
                layout.drawXAxisLabels(axis, index, null, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
            }
            if (axis.orientation === 'Vertical' && mode !== 'X') {
                layout.drawYAxisLabels(axis, index, null, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect));
            }
        });
    };
    // Rectangular zoom calculated here performed here
    Zoom.prototype.doZoom = function (chart, axes, bounds) {
        var _this = this;
        var zoomRect = this.zoomingRect;
        var mode = this.zooming.mode;
        var argsData;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        var onZoomingEventArg;
        var zoomedAxisCollections = [];
        for (var _i = 0, _a = axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor, previousZoomPosition: axis.zoomPosition,
                currentZoomFactor: axis.zoomFactor, currentZoomPosition: axis.zoomPosition
            };
            if (axis.orientation === 'Horizontal') {
                if (mode !== 'Y') {
                    argsData.currentZoomPosition += Math.abs((zoomRect.x - bounds.x) / (bounds.width)) * axis.zoomFactor;
                    argsData.currentZoomFactor *= (zoomRect.width / bounds.width);
                    chart.trigger(zoomComplete, argsData);
                }
            }
            else {
                if (mode !== 'X') {
                    argsData.currentZoomPosition += (1 - Math.abs((zoomRect.height + (zoomRect.y - bounds.y)) / (bounds.height)))
                        * axis.zoomFactor;
                    argsData.currentZoomFactor *= (zoomRect.height / bounds.height);
                    chart.trigger(zoomComplete, argsData);
                }
            }
            if (!argsData.cancel) {
                axis.zoomFactor = argsData.currentZoomFactor;
                axis.zoomPosition = argsData.currentZoomPosition;
            }
            zoomedAxisCollections.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
        }
        onZoomingEventArg = { cancel: false, axisCollection: zoomedAxisCollections, name: onZooming };
        if (!onZoomingEventArg.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, onZoomingEventArg, function () {
                _this.zoomingRect = new Rect(0, 0, 0, 0);
                _this.performZoomRedraw(chart);
            });
        }
        else {
            this.zoomingRect = new Rect(0, 0, 0, 0);
            this.performZoomRedraw(chart);
        }
    };
    /**
     * Function that handles the Mouse wheel zooming.
     * @return {void}
     * @private
     */
    Zoom.prototype.performMouseWheelZooming = function (e, mouseX, mouseY, chart, axes) {
        var _this = this;
        var direction = (this.browserName === 'mozilla' && !this.isPointer) ?
            -(e.detail) / 3 > 0 ? 1 : -1 : (e.wheelDelta / 120) > 0 ? 1 : -1;
        var mode = this.zooming.mode;
        var origin = 0.5;
        var cumulative;
        var zoomFactor;
        var zoomPosition;
        this.isZoomed = true;
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        chart.disableTrackTooltip = true;
        this.performedUI = true;
        this.isPanning = chart.zoomSettings.enablePan || this.isPanning;
        var argsData;
        var onZoomingEventArgs;
        var zoomedAxisCollection = [];
        for (var _i = 0, _a = axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            argsData = {
                cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor, previousZoomPosition: axis.zoomPosition,
                currentZoomFactor: axis.zoomFactor, currentZoomPosition: axis.zoomPosition
            };
            if ((axis.orientation === 'Vertical' && mode !== 'X') ||
                (axis.orientation === 'Horizontal' && mode !== 'Y')) {
                cumulative = Math.max(Math.max(1 / minMax(axis.zoomFactor, 0, 1), 1) + (0.25 * direction), 1);
                if (cumulative >= 1) {
                    origin = axis.orientation === 'Horizontal' ? mouseX / axis.rect.width : 1 - (mouseY / axis.rect.height);
                    origin = origin > 1 ? 1 : origin < 0 ? 0 : origin;
                    zoomFactor = (cumulative === 1) ? 1 : minMax(1 / cumulative, 0, 1);
                    zoomPosition = (cumulative === 1) ? 0 : axis.zoomPosition + ((axis.zoomFactor - zoomFactor) * origin);
                    if (axis.zoomPosition !== zoomPosition || axis.zoomFactor !== zoomFactor) {
                        zoomFactor = (zoomPosition + zoomFactor) > 1 ? (1 - zoomPosition) : zoomFactor;
                    }
                    argsData.currentZoomFactor = zoomFactor;
                    argsData.currentZoomPosition = zoomPosition;
                    chart.trigger(zoomComplete, argsData);
                }
                if (!argsData.cancel) {
                    axis.zoomFactor = argsData.currentZoomFactor;
                    axis.zoomPosition = argsData.currentZoomPosition;
                }
            }
            zoomedAxisCollection.push({
                zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                axisRange: axis.visibleRange
            });
        }
        onZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!onZoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, onZoomingEventArgs, function () { _this.performZoomRedraw(chart); });
        }
        else {
            this.performZoomRedraw(chart);
        }
    };
    /**
     * Function that handles the Pinch zooming.
     * @return {void}
     * @private
     */
    Zoom.prototype.performPinchZooming = function (e, chart) {
        if ((this.zoomingRect.width > 0 && this.zoomingRect.height > 0) || (chart.startMove && chart.crosshair.enable)) {
            return false;
        }
        this.calculateZoomAxesRange(chart, chart.axisCollections);
        this.isZoomed = true;
        this.isPanning = true;
        this.performedUI = true;
        this.offset = !chart.delayRedraw ? chart.chartAxisLayoutPanel.seriesClipRect : this.offset;
        chart.delayRedraw = true;
        chart.disableTrackTooltip = true;
        var elementOffset = chart.element.getBoundingClientRect();
        var touchDown = this.touchStartList;
        var touchMove = this.touchMoveList;
        var touch0StartX = touchDown[0].pageX - elementOffset.left;
        var touch0StartY = touchDown[0].pageY - elementOffset.top;
        var touch0EndX = touchMove[0].pageX - elementOffset.left;
        var touch0EndY = touchMove[0].pageY - elementOffset.top;
        var touch1StartX = touchDown[1].pageX - elementOffset.left;
        var touch1StartY = touchDown[1].pageY - elementOffset.top;
        var touch1EndX = touchMove[1].pageX - elementOffset.left;
        var touch1EndY = touchMove[1].pageY - elementOffset.top;
        var scaleX;
        var scaleY;
        var translateXValue;
        var translateYValue;
        var pinchRect;
        var clipX;
        var clipY;
        scaleX = Math.abs(touch0EndX - touch1EndX) / Math.abs(touch0StartX - touch1StartX);
        scaleY = Math.abs(touch0EndY - touch1EndY) / Math.abs(touch0StartY - touch1StartY);
        clipX = ((this.offset.x - touch0EndX) / scaleX) + touch0StartX;
        clipY = ((this.offset.y - touch0EndY) / scaleY) + touch0StartY;
        pinchRect = new Rect(clipX, clipY, this.offset.width / scaleX, this.offset.height / scaleY);
        translateXValue = (touch0EndX - (scaleX * touch0StartX));
        translateYValue = (touch0EndY - (scaleY * touch0StartY));
        if (!isNaN(scaleX - scaleX) && !isNaN(scaleY - scaleY)) {
            switch (this.zooming.mode) {
                case 'XY':
                    this.setTransform(translateXValue, translateYValue, scaleX, scaleY, chart, true);
                    break;
                case 'X':
                    this.setTransform(translateXValue, 0, scaleX, 1, chart, true);
                    break;
                case 'Y':
                    this.setTransform(0, translateYValue, 1, scaleY, chart, true);
                    break;
            }
        }
        this.calculatePinchZoomFactor(chart, pinchRect);
        this.refreshAxis(chart.chartAxisLayoutPanel, chart, chart.axisCollections);
        return true;
    };
    Zoom.prototype.calculatePinchZoomFactor = function (chart, pinchRect) {
        var mode = this.zooming.mode;
        var selectionMin;
        var selectionMax;
        var rangeMin;
        var rangeMax;
        var value;
        var axisTrans;
        var argsData;
        var currentZF;
        var currentZP;
        var onZoomingEventArgs;
        var zoomedAxisCollection = [];
        for (var index = 0; index < chart.axisCollections.length; index++) {
            var axis = chart.axisCollections[index];
            if ((axis.orientation === 'Horizontal' && mode !== 'Y') ||
                (axis.orientation === 'Vertical' && mode !== 'X')) {
                currentZF = axis.zoomFactor;
                currentZP = axis.zoomPosition;
                argsData = {
                    cancel: false, name: zoomComplete, axis: axis, previousZoomFactor: axis.zoomFactor,
                    previousZoomPosition: axis.zoomPosition, currentZoomFactor: currentZF, currentZoomPosition: currentZP
                };
                if (axis.orientation === 'Horizontal') {
                    value = pinchRect.x - this.offset.x;
                    axisTrans = axis.rect.width / this.zoomAxes[index].delta;
                    rangeMin = value / axisTrans + this.zoomAxes[index].min;
                    value = pinchRect.x + pinchRect.width - this.offset.x;
                    rangeMax = value / axisTrans + this.zoomAxes[index].min;
                }
                else {
                    value = pinchRect.y - this.offset.y;
                    axisTrans = axis.rect.height / this.zoomAxes[index].delta;
                    rangeMin = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index].min;
                    value = pinchRect.y + pinchRect.height - this.offset.y;
                    rangeMax = (value * -1 + axis.rect.height) / axisTrans + this.zoomAxes[index].min;
                }
                selectionMin = Math.min(rangeMin, rangeMax);
                selectionMax = Math.max(rangeMin, rangeMax);
                currentZP = (selectionMin - this.zoomAxes[index].actualMin) / this.zoomAxes[index].actualDelta;
                currentZF = (selectionMax - selectionMin) / this.zoomAxes[index].actualDelta;
                argsData.currentZoomPosition = currentZP < 0 ? 0 : currentZP;
                argsData.currentZoomFactor = currentZF > 1 ? 1 : currentZF;
                chart.trigger(zoomComplete, argsData);
                if (!argsData.cancel) {
                    axis.zoomFactor = argsData.currentZoomFactor;
                    axis.zoomPosition = argsData.currentZoomPosition;
                }
                zoomedAxisCollection.push({
                    zoomFactor: axis.zoomFactor, zoomPosition: axis.zoomFactor, axisName: axis.name,
                    axisRange: axis.visibleRange
                });
            }
        }
        onZoomingEventArgs = { cancel: false, axisCollection: zoomedAxisCollection, name: onZooming };
        if (!onZoomingEventArgs.cancel && this.chart.isBlazor) {
            this.chart.trigger(onZooming, onZoomingEventArgs);
        }
    };
    // Series transformation style applied here.
    Zoom.prototype.setTransform = function (transX, transY, scaleX, scaleY, chart, isPinch) {
        if (!chart.enableCanvas) {
            chart.seriesElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        }
        if (chart.indicatorElements) {
            chart.indicatorElements.setAttribute('clip-path', 'url(#' + this.elementId + '_ChartAreaClipRect_)');
        }
        var translate;
        var xAxisLoc;
        var yAxisLoc;
        var element;
        if (transX !== null && transY !== null) {
            for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                var value = _a[_i];
                xAxisLoc = chart.requireInvertedAxis ? value.yAxis.rect.x : value.xAxis.rect.x;
                yAxisLoc = chart.requireInvertedAxis ? value.xAxis.rect.y : value.yAxis.rect.y;
                translate = 'translate(' + (transX + (isPinch ? (scaleX * xAxisLoc) : xAxisLoc)) +
                    ',' + (transY + (isPinch ? (scaleY * yAxisLoc) : yAxisLoc)) + ')';
                translate = (scaleX || scaleY) ? translate + ' scale(' + scaleX + ' ' + scaleY + ')' : translate;
                if (value.visible) {
                    if (value.category === 'Indicator') {
                        value.seriesElement.parentNode.setAttribute('transform', translate);
                    }
                    else {
                        if (!chart.enableCanvas) {
                            value.seriesElement.setAttribute('transform', translate);
                        }
                    }
                    element = getElement(chart.element.id + '_Series_' + value.index + '_DataLabelCollections');
                    if (value.errorBarElement) {
                        value.errorBarElement.setAttribute('transform', translate);
                    }
                    if (value.symbolElement) {
                        value.symbolElement.setAttribute('transform', translate);
                    }
                    if (value.textElement) {
                        value.textElement.setAttribute('visibility', 'hidden');
                        value.shapeElement.setAttribute('visibility', 'hidden');
                    }
                    if (element) {
                        element.style.visibility = 'hidden';
                    }
                }
            }
        }
    };
    Zoom.prototype.calculateZoomAxesRange = function (chart, axes) {
        var range;
        var axisRange;
        for (var index = 0; index < chart.axisCollections.length; index++) {
            var axis = chart.axisCollections[index];
            axisRange = axis.visibleRange;
            if (this.zoomAxes[index]) {
                if (!chart.delayRedraw) {
                    this.zoomAxes[index].min = axisRange.min;
                    this.zoomAxes[index].delta = axisRange.delta;
                }
            }
            else {
                range = {
                    actualMin: axis.actualRange.min,
                    actualDelta: axis.actualRange.delta,
                    min: axisRange.min,
                    delta: axisRange.delta
                };
                this.zoomAxes[index] = range;
            }
        }
    };
    // Zooming Toolkit created here
    Zoom.prototype.showZoomingToolkit = function (chart) {
        var toolboxItems = this.zooming.toolbarItems;
        var areaBounds = chart.chartAxisLayoutPanel.seriesClipRect;
        var spacing = 5;
        var render = chart.svgRenderer;
        var length = this.isDevice ? 1 : toolboxItems.length;
        var iconSize = this.isDevice ? measureText('Reset Zoom', { size: '12px' }).width : 16;
        var height = this.isDevice ? measureText('Reset Zoom', { size: '12px' }).height : 22;
        var width = (length * iconSize) + ((length + 1) * spacing) + ((length - 1) * spacing);
        var transX = areaBounds.x + areaBounds.width - width - spacing;
        var transY = (areaBounds.y + spacing);
        var xPosition = spacing;
        var outerElement;
        var toolkit = this.toolkit;
        var element;
        var shadowElement = '<filter id="chart_shadow" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/>';
        shadowElement += '<feOffset dx="-3" dy="4" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="1"/>';
        shadowElement += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
        if (length === 0 || getElement(this.elementId + '_Zooming_KitCollection')) {
            return false;
        }
        var defElement = render.createDefs();
        toolboxItems = this.isDevice ? ['Reset'] : toolboxItems;
        defElement.innerHTML = shadowElement;
        this.toolkitElements = render.createGroup({
            id: this.elementId + '_Zooming_KitCollection',
            transform: 'translate(' + transX + ',' + transY + ')'
        });
        this.toolkitElements.appendChild(defElement);
        this.toolkitElements.appendChild(render.drawRectangle(new RectOption(this.elementId + '_Zooming_Rect', '#fafafa', { color: 'transparent', width: 1 }, 1, new Rect(0, 0, width, (height + (spacing * 2))), 0, 0)));
        outerElement = render.drawRectangle(new RectOption(this.elementId + '_Zooming_Rect', '#fafafa', { color: 'transparent', width: 1 }, 0.1, new Rect(0, 0, width, (height + (spacing * 2))), 0, 0));
        outerElement.setAttribute('filter', 'url(#chart_shadow)');
        this.toolkitElements.appendChild(outerElement);
        var currentItem;
        for (var i = 1; i <= length; i++) {
            currentItem = toolboxItems[i - 1];
            element = render.createGroup({
                transform: 'translate(' + xPosition + ',' + (this.isDevice ? spacing : (spacing + 3)) + ')'
            });
            // for desktop toolkit hight is 32 and top padding is 8 icon size 16
            switch (currentItem) {
                case 'Pan':
                    toolkit.createPanButton(element, this.toolkitElements, chart);
                    break;
                case 'Zoom':
                    toolkit.createZoomButton(element, this.toolkitElements, chart);
                    break;
                case 'ZoomIn':
                    toolkit.createZoomInButton(element, this.toolkitElements, chart);
                    break;
                case 'ZoomOut':
                    toolkit.createZoomOutButton(element, this.toolkitElements, chart);
                    break;
                case 'Reset':
                    toolkit.createResetButton(element, this.toolkitElements, chart, this.isDevice);
                    break;
            }
            xPosition += iconSize + (spacing * 2);
        }
        this.toolkitElements.setAttribute('opacity', this.isDevice ? '1' : '' + this.zoomkitOpacity);
        this.toolkitElements.setAttribute('cursor', 'auto');
        if (chart.enableCanvas) {
            var zoomDiv = document.createElement('div');
            zoomDiv.id = chart.element.id + '_zoom';
            zoomDiv.setAttribute('style', 'position:absolute; z-index:1');
            var zoomheight = chart.availableSize.height / 2;
            var svg = chart.svgRenderer.createSvg({
                id: chart.element.id + '_zoomkit_svg',
                width: chart.availableSize.width,
                height: zoomheight
            });
            svg.setAttribute('style', 'position:absolute');
            svg.appendChild(this.toolkitElements);
            zoomDiv.appendChild(svg);
            document.getElementById(this.elementId + '_Secondary_Element').appendChild(zoomDiv);
        }
        else {
            chart.svgObject.appendChild(this.toolkitElements);
        }
        if (!this.isDevice) {
            EventHandler.add(this.toolkitElements, 'mousemove touchstart', this.zoomToolkitMove, this);
            EventHandler.add(this.toolkitElements, 'mouseleave touchend', this.zoomToolkitLeave, this);
            if (this.isPanning) {
                toolkit.pan();
            }
        }
        return true;
    };
    /**
     * To the show the zooming toolkit.
     * @return {void}
     * @private
     */
    Zoom.prototype.applyZoomToolkit = function (chart, axes) {
        var showToolkit = this.isAxisZoomed(axes);
        if (showToolkit) {
            this.showZoomingToolkit(chart);
            this.isZoomed = true;
        }
        else {
            this.toolkit.removeTooltip();
            this.isPanning = false;
            this.isZoomed = false;
            chart.svgObject.setAttribute('cursor', 'auto');
        }
    };
    /**
     * Return boolean property to show zooming toolkit.
     * @return {void}
     * @private
     */
    Zoom.prototype.isAxisZoomed = function (axes) {
        var showToolkit = false;
        for (var _i = 0, _a = axes; _i < _a.length; _i++) {
            var axis = _a[_i];
            showToolkit = (showToolkit || (axis.zoomFactor !== 1 || axis.zoomPosition !== 0));
        }
        return showToolkit;
    };
    Zoom.prototype.zoomToolkitMove = function (e) {
        var element = this.toolkitElements;
        var opacity = +element.getAttribute('opacity');
        this.zoomkitOpacity = 1;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    };
    Zoom.prototype.zoomToolkitLeave = function (e) {
        var element = this.toolkitElements;
        this.zoomkitOpacity = 0.3;
        element.setAttribute('opacity', '' + this.zoomkitOpacity);
        return false;
    };
    /**
     * @hidden
     */
    Zoom.prototype.addEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        EventHandler.add(this.chart.element, this.wheelEvent, this.chartMouseWheel, this);
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchStartEvent, this.mouseDownHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.chart.on(this.cancelEvent, this.mouseCancelHandler, this);
    };
    /**
     * @hidden
     */
    Zoom.prototype.removeEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        EventHandler.remove(this.chart.element, this.wheelEvent, this.chartMouseWheel);
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchStartEvent, this.mouseDownHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
        this.chart.off(this.cancelEvent, this.mouseCancelHandler);
    };
    /**
     * Handles the mouse wheel on chart.
     * @return {boolean}
     * @private
     */
    Zoom.prototype.chartMouseWheel = function (e) {
        var chart = this.chart;
        var offset = chart.element.getBoundingClientRect();
        var svgRect = getElement(chart.svgId).getBoundingClientRect();
        var mouseX = (e.clientX - offset.left) - Math.max(svgRect.left - offset.left, 0);
        var mouseY = (e.clientY - offset.top) - Math.max(svgRect.top - offset.top, 0);
        if (this.zooming.enableMouseWheelZooming &&
            withInBounds(mouseX, mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            e.preventDefault();
            this.performMouseWheelZooming(e, mouseX, mouseY, chart, chart.axisCollections);
        }
        return false;
    };
    /**
     * @hidden
     */
    Zoom.prototype.mouseMoveHandler = function (e) {
        //Zooming for chart
        var chart = this.chart;
        var touches = null;
        if (e.type === 'touchmove') {
            if (e.preventDefault && this.isIOS &&
                (this.isPanning || (chart.isDoubleTap)
                    || (this.zooming.enablePinchZooming && this.touchStartList.length > 1))) {
                e.preventDefault();
            }
            touches = e.touches;
        }
        if (chart.isChartDrag) {
            if (chart.isTouch) {
                this.touchMoveList = this.addTouchPointer(this.touchMoveList, e, touches);
                if (this.zooming.enablePinchZooming && this.touchMoveList.length > 1
                    && this.touchStartList.length > 1) {
                    this.performPinchZooming(e, chart);
                }
            }
            this.renderZooming(e, chart, chart.isTouch);
        }
    };
    /**
     * @hidden
     */
    Zoom.prototype.mouseDownHandler = function (e) {
        //Zooming for chart
        var chart = this.chart;
        var touches = null;
        var target;
        if (e.type === 'touchstart') {
            touches = e.touches;
            target = e.target;
        }
        else {
            target = e.target;
        }
        if (target.id.indexOf(chart.element.id + '_Zooming_') === -1 &&
            withInBounds(chart.previousMouseMoveX, chart.previousMouseMoveY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            chart.isChartDrag = true;
        }
        if (chart.isTouch) {
            this.touchStartList = this.addTouchPointer(this.touchStartList, e, touches);
        }
    };
    /**
     * @hidden
     */
    Zoom.prototype.mouseUpHandler = function (e) {
        var chart = this.chart;
        var performZoomRedraw = e.target.id.indexOf(chart.element.id + '_ZoomOut_') === -1 ||
            e.target.id.indexOf(chart.element.id + '_ZoomIn_') === -1;
        if (chart.isChartDrag || performZoomRedraw) {
            this.performZoomRedraw(chart);
        }
        if (chart.isTouch) {
            if (chart.isDoubleTap && withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)
                && this.touchStartList.length === 1 && this.isZoomed) {
                this.toolkit.reset();
            }
            this.touchStartList = [];
            chart.isDoubleTap = false;
        }
    };
    /**
     * @hidden
     */
    Zoom.prototype.mouseCancelHandler = function (e) {
        if (this.isZoomed) {
            this.performZoomRedraw(this.chart);
        }
        this.pinchTarget = null;
        this.touchStartList = [];
        this.touchMoveList = [];
    };
    /**
     * Handles the touch pointer.
     * @return {boolean}
     * @private
     */
    Zoom.prototype.addTouchPointer = function (touchList, e, touches) {
        if (touches) {
            touchList = [];
            for (var i = 0, length_1 = touches.length; i < length_1; i++) {
                touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
            }
        }
        else {
            touchList = touchList ? touchList : [];
            if (touchList.length === 0) {
                touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
            }
            else {
                for (var i = 0, length_2 = touchList.length; i < length_2; i++) {
                    if (touchList[i].pointerId === e.pointerId) {
                        touchList[i] = { pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId };
                    }
                    else {
                        touchList.push({ pageX: e.clientX, pageY: e.clientY, pointerId: e.pointerId });
                    }
                }
            }
        }
        return touchList;
    };
    /**
     * Get module name.
     */
    Zoom.prototype.getModuleName = function () {
        // Returns te module name
        return 'Zoom';
    };
    /**
     * To destroy the zooming.
     * @return {void}
     * @private
     */
    Zoom.prototype.destroy = function (chart) {
        // Destroy method performed here
        this.removeEventListener();
    };
    return Zoom;
}());
export { Zoom };
