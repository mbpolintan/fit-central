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
/**
 * Selection src file
 */
import { Browser } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartLocation, RectOption, CircleOption, withInBounds, getDraggedRectLocation, removeElement, getElement } from '../../common/utils/helper';
import { Rect, PathOption } from '@syncfusion/ej2-svg-base';
import { Index } from '../../common/model/base';
import { dragComplete, selectionComplete } from '../../common/model/constants';
import { BaseSelection } from '../../common/user-interaction/selection';
// tslint:disable:no-string-literal
/**
 * `Selection` module handles the selection for chart.
 * @private
 */
var Selection = /** @class */ (function (_super) {
    __extends(Selection, _super);
    /**
     * Constructor for selection module.
     * @private.
     */
    function Selection(chart) {
        var _this = _super.call(this, chart) || this;
        _this.isdrawRect = true;
        _this.multiDataIndexes = [];
        _this.pathIndex = 0;
        _this.seriesIndex = 0;
        _this.count = -1;
        _this.dragRectArray = [];
        _this.filterArray = [];
        _this.totalSelectedPoints = [];
        _this.chart = chart;
        _this.renderer = chart.renderer;
        var mode = chart.selectionMode;
        _this.isMultiDrag = chart.isMultiSelect && (mode.indexOf('Drag') > -1);
        _this.addEventListener();
        return _this;
    }
    /**
     * Binding events for selection module.
     */
    Selection.prototype.addEventListener = function () {
        if (this.chart.isDestroyed || (this.chart.stockChart && this.chart.stockChart.onPanning)) {
            return;
        }
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on(cancelEvent, this.completeSelection, this);
        this.chart.on('click', this.calculateSelectedElements, this);
        this.chart.on(Browser.touchStartEvent, this.mousedown, this);
        this.chart.on(Browser.touchEndEvent, this.completeSelection, this);
    };
    /**
     * Chart mouse down
     */
    Selection.prototype.mousedown = function (e) {
        var chart = this.chart;
        if (chart.isPointMouseDown || chart.selectionMode === 'None' || chart.isChartDrag) {
            return;
        }
        if (chart.isDoubleTap || !chart.isTouch || this.rectPoints) {
            this.dragStart(chart, chart.chartAxisLayoutPanel.seriesClipRect, chart.mouseDownX, chart.mouseDownY, e);
        }
    };
    /**
     * UnBinding events for selection module.
     */
    Selection.prototype.removeEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('pointerleave' || 'mouseleave', this.completeSelection);
        this.chart.off('click', this.calculateSelectedElements);
        this.chart.off(Browser.touchStartEvent, this.mousedown);
        this.chart.off(Browser.touchEndEvent, this.completeSelection);
    };
    /**
     * To find private variable values
     */
    Selection.prototype.initPrivateVariables = function (chart) {
        this.styleId = chart.element.id + '_ej2_chart_selection';
        this.unselected = chart.element.id + '_ej2_deselected';
        this.closeIconId = chart.element.id + '_ej2_drag_close';
        this.draggedRectGroup = chart.element.id + '_ej2_drag_group';
        this.multiRectGroup = chart.element.id + '_ej2_drag_multi_group';
        this.draggedRect = chart.element.id + '_ej2_drag_rect';
        this.lassoPath = chart.element.id + '_ej2_drag_path';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
        this.isSeriesMode = chart.selectionMode === 'Series';
    };
    /**
     * Method to select the point and series.
     * @return {void}
     */
    Selection.prototype.invokeSelection = function (chart) {
        this.initPrivateVariables(chart);
        this.series = extend({}, chart.visibleSeries, null, true);
        this.seriesStyles();
        this.currentMode = chart.selectionMode;
        if (!(chart.selectionMode.indexOf('Drag') > -1)) {
            this.selectDataIndex(chart, this.concatIndexes(chart.selectedDataIndexes, this.selectedDataIndexes));
        }
    };
    Selection.prototype.generateStyle = function (series) {
        if (series) {
            if (this.styleId.indexOf('selection') > 1 && this.chart.selectionMode !== 'None') {
                this.unselected = series.unSelectedStyle || this.unselected;
            }
            if (this.styleId.indexOf('highlight') > 0 && this.chart.highlightMode !== 'None') {
                this.unselected = series.nonHighlightStyle || this.unselected;
            }
            return (series.selectionStyle || this.styleId + '_series_' + series.index);
        }
        return 'undefined';
    };
    /**
     *  Method to get the selected data index
     * @private.
     */
    Selection.prototype.selectDataIndex = function (chart, indexes) {
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            this.performSelection(index, chart, this.getElementByIndex(chart, index)[0]);
        }
    };
    /**
     *  Method to get the selected index element
     * @private.
     */
    Selection.prototype.getElementByIndex = function (chart, index, suffix) {
        if (suffix === void 0) { suffix = ''; }
        var elementId = chart.element.id + '_Series_' + index.series + '_Point' + '_' + index.point;
        var series = chart.series[index.series];
        elementId = (!series.isRectSeries && series.type !== 'Scatter' && series.type !== 'Bubble' &&
            series.marker.visible) ? (elementId + '_Symbol' + suffix) : elementId;
        return [getElement(elementId), (series.type === 'RangeArea' && series.marker.visible) ? getElement(elementId + '1') : null];
    };
    /**
     *  Method to get the selected cluster element
     * @private.
     */
    Selection.prototype.getClusterElements = function (chart, index) {
        var clusters = [];
        var seriesStyle;
        var selectedElements;
        for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            index = new Index(series.index, index.point);
            clusters.push(this.getElementByIndex(chart, index)[0]);
            seriesStyle = this.generateStyle(chart.visibleSeries[index.series]);
            selectedElements = document.querySelectorAll('.' + seriesStyle);
            this.findTrackballElements(selectedElements, seriesStyle);
            if (!chart.isMultiSelect && selectedElements.length > 0 && selectedElements[0].id !== clusters[index.series].id) {
                this.removeSelection(chart, index.series, selectedElements, seriesStyle, true);
            }
        }
        return clusters;
    };
    /**
     *  Method to get trackball elements
     * @private.
     */
    Selection.prototype.findTrackballElements = function (selectedElements, className) {
        var trackballElements;
        var elements;
        for (var i = 0; i < selectedElements.length; i++) {
            if (!isNullOrUndefined(selectedElements[i])) {
                trackballElements = !isNullOrUndefined(selectedElements[i].parentNode) ?
                    [].slice.call(selectedElements[0].parentNode.querySelectorAll('.' + className)) : [];
                if (trackballElements.length > 0) {
                    elements = [];
                    for (var i_1 = 0; i_1 < trackballElements.length; i_1++) {
                        if (trackballElements[i_1].id.indexOf('Trackball') > -1) {
                            elements.push(trackballElements[i_1]);
                        }
                    }
                    this.removeStyles(elements);
                }
            }
        }
    };
    /**
     *  Method to get the selected element
     * @private.
     */
    Selection.prototype.findElements = function (chart, series, index, suffix) {
        if (suffix === void 0) { suffix = ''; }
        if (this.isSeriesMode) {
            return this.getSeriesElements(series);
        }
        else if (this.currentMode === 'Cluster') {
            return this.getClusterElements(chart, index);
        }
        else {
            return this.getElementByIndex(chart, index, suffix);
        }
    };
    /**
     * To find the selected element.
     * @return {void}
     * @private
     */
    Selection.prototype.isAlreadySelected = function (event) {
        var targetElem = event.target;
        if (event.type === 'click') {
            this.currentMode = this.chart.selectionMode;
            this.styleId = this.chart.element.id + '_ej2_chart_selection';
        }
        else if (event.type === 'mousemove') {
            this.currentMode = this.chart.highlightMode;
            this.highlightDataIndexes = [];
            this.styleId = this.chart.element.id + '_ej2_chart_highlight';
        }
        if (this.chart.highlightMode !== 'None' && this.chart.selectionMode === 'None') {
            if (event.type === 'click') {
                return false;
            }
        }
        if ((this.chart.highlightMode !== 'None' && this.previousSelectedEle && this.previousSelectedEle[0])) {
            var parentNodeId = targetElem.parentNode.id;
            var isElement = void 0;
            if (targetElem.parentNode) {
                isElement = (parentNodeId.indexOf('SeriesGroup') > 0 || parentNodeId.indexOf('SymbolGroup') > 0) ? true : false;
            }
            for (var i = 0; i < this.previousSelectedEle.length; i++) {
                if (this.previousSelectedEle[i].hasAttribute('class')) {
                    if (this.previousSelectedEle[i].getAttribute('class').indexOf('highlight') > -1 &&
                        (isElement || event.type === 'click')) {
                        this.previousSelectedEle[i].removeAttribute('class');
                        this.addOrRemoveIndex(this.highlightDataIndexes, this.indexFinder(this.previousSelectedEle[i].id));
                    }
                    else if (!isElement && this.previousSelectedEle[i].getAttribute('class').indexOf('highlight') > -1) {
                        this.performSelection(this.indexFinder(this.previousSelectedEle[i].id), this.chart, this.previousSelectedEle[i]);
                    }
                }
            }
        }
        return true;
    };
    /**
     * To find the selected element.
     * @return {void}
     * @private
     */
    Selection.prototype.calculateSelectedElements = function (event) {
        if (isNullOrUndefined(event.target)) {
            return;
        }
        var targetElement = event.target;
        if ((this.chart.selectionMode === 'None' && this.chart.highlightMode === 'None') ||
            targetElement.id.indexOf(this.chart.element.id + '_') === -1) {
            return;
        }
        if (event.type === 'mousemove') {
            if (targetElement.hasAttribute('class') && (targetElement.getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            if (!isNullOrUndefined(targetElement.parentNode) && targetElement.parentNode.hasAttribute('class') &&
                (targetElement.parentNode.getAttribute('class').indexOf('highlight') > 0 ||
                    targetElement.parentNode.getAttribute('class').indexOf('selection') > 0)) {
                return;
            }
        }
        this.isAlreadySelected(event);
        if (targetElement.id.indexOf('_Series_') > -1) {
            var element = void 0;
            if (targetElement.id.indexOf('_Trackball_1') > -1) {
                element = getElement(targetElement.id.split('_Trackball_')[0] + '_Symbol');
                element = isNullOrUndefined(element) ? getElement(targetElement.id.split('_Trackball_')[0]) : element;
            }
            else if (targetElement.id.indexOf('_Trackball_0') > -1) {
                return null;
            }
            this.performSelection(this.indexFinder(targetElement.id), this.chart, element || targetElement);
        }
    };
    /**
     *  Method to perform the selection
     * @private.
     */
    Selection.prototype.performSelection = function (index, chart, element) {
        this.isSeriesMode = this.currentMode === 'Series';
        if (chart.series[index.series].type === 'BoxAndWhisker' &&
            element.id === chart.element.id + '_Series_' + index.series + '_Point_' + index.point + '_BoxPath') {
            element = element.parentNode;
        }
        if (chart.series[index.series].type === 'Area' && (this.currentMode === 'Point' || this.currentMode === 'Cluster') &&
            (element.id === this.chart.element.id + '_Series_' + index.series)) {
            var className = this.generateStyle(chart.series[index.series]);
            var selectionEle = document.querySelectorAll('.' + className);
            this.findTrackballElements(selectionEle, className);
            this.blurEffect(chart.element.id, chart.visibleSeries);
        }
        switch (this.currentMode) {
            case 'Series':
                this.selection(chart, index, this.getSeriesElements(chart.series[index.series]));
                this.selectionComplete(chart, index, this.currentMode);
                this.blurEffect(chart.element.id, chart.visibleSeries);
                break;
            case 'Point':
                if (!isNaN(index.point)) {
                    this.selection(chart, index, [element]);
                    this.selectionComplete(chart, index, this.currentMode);
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
                break;
            case 'Cluster':
                if (!isNaN(index.point)) {
                    this.clusterSelection(chart, index);
                    this.selectionComplete(chart, index, this.currentMode);
                    this.blurEffect(chart.element.id, chart.visibleSeries);
                }
                break;
        }
    };
    /**
     *  Method to get the selected data index
     * @private.
     */
    Selection.prototype.selectionComplete = function (chart, index, selectionMode) {
        var points;
        var pointIndex;
        var seriesIndex;
        var selectedPointValues = [];
        var yValue;
        var selectedPointX;
        if (selectionMode === 'Cluster') {
            for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                var series = _a[_i];
                if (series.visible) {
                    for (var i = 0; i < this.selectedDataIndexes.length; i++) {
                        pointIndex = chart.isMultiSelect ? this.selectedDataIndexes[i].point : index.point;
                        seriesIndex = series.index;
                        points = series.points;
                        if (!isNaN(pointIndex)) {
                            yValue = series.type !== 'RangeArea' ? points[pointIndex].yValue :
                                points[pointIndex].regions[0].y;
                            selectedPointX = points[pointIndex].xValue;
                            if (chart.primaryXAxis.valueType === 'Category') {
                                selectedPointX = points[pointIndex].x.toLocaleString();
                            }
                            else if (chart.primaryXAxis.valueType === 'DateTime') {
                                selectedPointX = new Date(points[pointIndex].xValue);
                            }
                            if (series.category !== 'Indicator') {
                                selectedPointValues.push({
                                    x: selectedPointX, y: yValue, seriesIndex: seriesIndex,
                                    pointIndex: pointIndex
                                });
                            }
                            if (series.type === 'RangeArea') {
                                selectedPointValues.push({
                                    x: selectedPointX, y: points[pointIndex].regions[0].y,
                                    seriesIndex: seriesIndex, pointIndex: pointIndex
                                });
                            }
                        }
                    }
                }
            }
        }
        else if (selectionMode === 'Series') {
            if (chart.isMultiSelect) {
                for (var i = 0; i < this.selectedDataIndexes.length; i++) {
                    seriesIndex = this.selectedDataIndexes[i].series;
                    selectedPointValues.push({
                        seriesIndex: seriesIndex,
                    });
                }
            }
            else {
                seriesIndex = (this.selectedDataIndexes.length > 0) ? this.selectedDataIndexes[0].series : 0;
                selectedPointValues.push({
                    seriesIndex: seriesIndex,
                });
            }
        }
        else if (selectionMode === 'Point') {
            for (var i = 0; i < this.selectedDataIndexes.length; i++) {
                pointIndex = this.selectedDataIndexes[i].point;
                seriesIndex = this.selectedDataIndexes[i].series;
                var series = chart.series[seriesIndex];
                points = series.points;
                if (!isNaN(pointIndex)) {
                    selectedPointX = points[pointIndex].xValue;
                    yValue = series.type !== 'RangeArea' ? points[pointIndex].yValue :
                        points[pointIndex].regions[0].y;
                    if (chart.primaryXAxis.valueType === 'Category') {
                        selectedPointX = points[pointIndex].x.toLocaleString();
                    }
                    else if (chart.primaryXAxis.valueType === 'DateTime') {
                        selectedPointX = new Date(points[pointIndex].xValue);
                    }
                    selectedPointValues.push({
                        x: selectedPointX, y: yValue, seriesIndex: seriesIndex,
                        pointIndex: pointIndex
                    });
                }
            }
        }
        var args = {
            name: selectionComplete,
            selectedDataValues: selectedPointValues,
            cancel: false
        };
        chart.trigger(selectionComplete, args);
    };
    /**
     *  Method to perform selection
     * @private.
     */
    Selection.prototype.selection = function (chart, index, selectedElements, legendClick) {
        if (legendClick === void 0) { legendClick = false; }
        if (!(this.currentMode === 'Lasso')) {
            if (!chart.isMultiSelect && (this.currentMode.indexOf('Drag') === -1 && this.styleId.indexOf('highlight') === -1 &&
                chart.selectionMode !== 'None')) {
                this.removeMultiSelectElements(chart, this.selectedDataIndexes, index, chart.series);
            }
        }
        if (!isNullOrUndefined(selectedElements[0])) {
            var isAdd = void 0;
            var className = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
            var pClassName = selectedElements[0].parentNode &&
                (selectedElements[0].parentNode.getAttribute('class') || '');
            if (className !== '' && this.currentMode !== 'Cluster') {
                this.findTrackballElements(selectedElements, className);
            }
            if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
                this.removeStyles(selectedElements);
            }
            else if (selectedElements[0].parentNode && pClassName.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
                this.removeStyles([selectedElements[0].parentNode]);
            }
            else {
                this.previousSelectedEle = chart.highlightMode !== 'None' ? selectedElements : [];
                this.applyStyles(selectedElements);
                isAdd = true;
            }
            if (this.styleId.indexOf('highlight') > 0 && chart.highlightMode !== 'None') {
                this.addOrRemoveIndex(this.highlightDataIndexes, index, isAdd);
            }
            else {
                this.addOrRemoveIndex(this.selectedDataIndexes, index, isAdd);
            }
        }
    };
    /**
     *  Method to get the cluster selection element
     * @private.
     */
    Selection.prototype.clusterSelection = function (chart, index) {
        this.selection(chart, index, this.getClusterElements(chart, new Index(index.series, index.point)));
    };
    /**
     * Method to remove the multi selected elements
     * @private.
     */
    Selection.prototype.removeMultiSelectElements = function (chart, index, currentIndex, seriesCollection) {
        var series;
        for (var i = 0; i < index.length; i++) {
            series = seriesCollection[index[i].series];
            if ((this.isSeriesMode && !this.toEquals(index[i], currentIndex, this.isSeriesMode)) ||
                (this.currentMode === 'Cluster' && !this.toEquals(index[i], currentIndex, false)) ||
                (!this.isSeriesMode && this.toEquals(index[i], currentIndex, true) && !this.toEquals(index[i], currentIndex, false))) {
                this.removeStyles(this.findElements(chart, series, index[i]));
                index.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * Method to remove the selection
     * @private.
     */
    Selection.prototype.blurEffect = function (chartId, visibleSeries, legendClick) {
        if (legendClick === void 0) { legendClick = false; }
        var visibility = (this.checkVisibility(this.highlightDataIndexes) ||
            this.checkVisibility(this.selectedDataIndexes)); // legend click scenario
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (series.visible) {
                this.checkSelectionElements(getElement(chartId + 'SeriesGroup' + series.index), this.generateStyle(series), visibility, legendClick, series.index);
                if (!isNullOrUndefined(getElement(chartId + 'SymbolGroup' + series.index))) {
                    this.checkSelectionElements(getElement(chartId + 'SymbolGroup' + series.index), this.generateStyle(series), visibility, legendClick, series.index);
                }
            }
        }
    };
    /**
     * Method to add the add/remove class to element
     * @private.
     */
    Selection.prototype.checkSelectionElements = function (element, className, visibility, legendClick, series) {
        var children = (this.isSeriesMode ? [element] : element.childNodes);
        if (this.chart.selectionMode !== 'None' && this.chart.highlightMode !== 'None') {
            children = (element.children);
        }
        var elementClassName;
        var parentClassName;
        var legendShape;
        var selectElement = element;
        for (var i = 0; i < children.length; i++) {
            elementClassName = children[i].getAttribute('class') || '';
            parentClassName = children[i].parentNode.getAttribute('class') || '';
            if (this.chart.selectionMode !== 'None' && this.chart.highlightMode !== 'None') {
                className = elementClassName.indexOf('selection') > 0 ||
                    elementClassName.indexOf('highlight') > 0 ? elementClassName : className;
                className = (parentClassName.indexOf('selection') > 0 ||
                    parentClassName.indexOf('highlight') > 0) ? parentClassName : className;
            }
            if (elementClassName.indexOf(className) === -1 &&
                parentClassName.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i], this.unselected);
            }
            else {
                selectElement = children[i];
                this.removeSvgClass(children[i], this.unselected);
                this.removeSvgClass(children[i].parentNode, this.unselected);
            }
            if (children[i].id.indexOf('Trackball') > 0 && selectElement.classList[0] === className) {
                this.removeSvgClass(children[i], this.unselected);
                this.removeSvgClass(children[i].parentNode, this.unselected);
                this.addSvgClass(children[i], className);
            }
        }
        if (element.id.indexOf('Symbol') > -1) {
            if ((element.querySelectorAll('.' + className)[0]) && element.querySelectorAll('.' + className)[0].getAttribute('class')
                === className) {
                var symbolEle = getElement(this.control.element.id + '_Series_' + element.id[element.id.length - 1]);
                var seriesClassName = symbolEle && symbolEle.hasAttribute('class') ? symbolEle.getAttribute('class') : '';
                if (seriesClassName.indexOf(this.unselected) > -1) {
                    this.removeSvgClass(symbolEle, this.unselected);
                }
            }
        }
        if (this.control.legendModule && this.control.legendSettings.visible) {
            legendShape = getElement(this.control.element.id + '_chart_legend_shape_' + series);
            if (legendShape) {
                if (legendShape.hasAttribute('class')) {
                    this.removeSvgClass(legendShape, legendShape.getAttribute('class'));
                }
                elementClassName = selectElement.getAttribute('class') || '';
                parentClassName = selectElement.parentNode.getAttribute('class') || '';
                if (elementClassName.indexOf(className) === -1 && parentClassName.indexOf(className) === -1 && visibility) {
                    this.addSvgClass(legendShape, this.unselected);
                    this.removeSvgClass(legendShape, className);
                }
                else {
                    this.removeSvgClass(legendShape, this.unselected);
                    ((elementClassName === '' && parentClassName === '') || elementClassName.trim() === 'EJ2-Trackball') ?
                        this.removeSvgClass(legendShape, className) : this.addSvgClass(legendShape, className);
                }
                if (legendClick && parentClassName.indexOf(className) > -1) {
                    this.addSvgClass(legendShape, className);
                }
            }
        }
    };
    /**
     *  Method to apply the styles
     * @private.
     */
    Selection.prototype.applyStyles = function (elements) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            if (element) {
                this.removeSvgClass(element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                this.addSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    };
    /**
     *  Method to get the selection class
     * @private.
     */
    Selection.prototype.getSelectionClass = function (id) {
        return this.generateStyle(this.control.series[this.indexFinder(id).series]);
    };
    /**
     *  Method to remove styles
     * @private.
     */
    Selection.prototype.removeStyles = function (elements) {
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            if (element) {
                this.removeSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    };
    /**
     *  Method to remove the selected data index
     * @private.
     */
    Selection.prototype.addOrRemoveIndex = function (indexes, index, isAdd) {
        for (var i = 0; i < indexes.length; i++) {
            if (this.toEquals(indexes[i], index, this.isSeriesMode)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (isAdd) {
            indexes.push(index);
        }
    };
    /**
     *  Method to get the equal index
     * @private.
     */
    Selection.prototype.toEquals = function (first, second, checkSeriesOnly) {
        return ((first.series === second.series || (this.currentMode === 'Cluster' && !checkSeriesOnly))
            && (checkSeriesOnly || (first.point === second.point)));
    };
    /**
     * To redraw the selected points.
     * @return {void}
     * @private
     */
    Selection.prototype.redrawSelection = function (chart, oldMode) {
        this.isSeriesMode = oldMode === 'Series';
        var selectedDataIndexes = extend([], this.selectedDataIndexes, null, true);
        var highlightDataIndexes = extend([], this.highlightDataIndexes, null, true);
        if (this.styleId.indexOf('highlight') > 0 && highlightDataIndexes.length > 0) {
            this.removeSelectedElements(chart, this.highlightDataIndexes, chart.series);
            selectedDataIndexes = highlightDataIndexes;
        }
        else {
            this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        }
        this.blurEffect(chart.element.id, chart.visibleSeries);
        this.selectDataIndex(chart, selectedDataIndexes);
    };
    /** @private */
    Selection.prototype.legendSelection = function (chart, series, event) {
        var targetElement = event.target;
        if (event.type === 'mousemove') {
            if (event.target.id.indexOf('text') > 1) {
                targetElement = getElement(event.target.id.replace('text', 'shape'));
            }
            if (targetElement.hasAttribute('class') && (targetElement.getAttribute('class').indexOf('highlight') > -1 ||
                targetElement.getAttribute('class').indexOf('selection') > -1)) {
                return;
            }
            this.currentMode = this.chart.highlightMode;
        }
        var isPreSelected = this.isAlreadySelected(event);
        if (isPreSelected) {
            var seriesStyle = this.generateStyle(chart.visibleSeries[series]);
            var selectedElements = (document.querySelectorAll('.' + seriesStyle));
            this.isSeriesMode = this.currentMode === 'Series';
            var isBlurEffectNeeded = true;
            if (selectedElements.length > 0) {
                this.removeSelection(chart, series, selectedElements, seriesStyle, isBlurEffectNeeded);
            }
            else {
                for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                    var element = _a[_i];
                    if (element.index !== series && !chart.isMultiSelect) {
                        seriesStyle = this.generateStyle(chart.visibleSeries[element.index]);
                        selectedElements = document.querySelectorAll('.' + seriesStyle);
                        this.removeSelection(chart, series, selectedElements, seriesStyle, isBlurEffectNeeded);
                    }
                }
                var seriesElements = this.getSeriesElements(chart.visibleSeries[series]);
                for (var _b = 0, seriesElements_1 = seriesElements; _b < seriesElements_1.length; _b++) {
                    var seriesElement = seriesElements_1[_b];
                    this.checkSelectionElements(seriesElement, seriesStyle, false, true, series);
                }
                this.isSeriesMode = true;
                this.selection(chart, new Index(series, NaN), seriesElements, true);
                this.isSeriesMode = chart.selectionMode === 'Series';
                this.blurEffect(chart.element.id, chart.visibleSeries, true);
            }
        }
    };
    Selection.prototype.removeSelection = function (chart, series, selectedElements, seriesStyle, isBlurEffectNeeded) {
        if (selectedElements.length > 0) {
            var elements = [];
            for (var i = 0; i < selectedElements.length; i++) {
                elements.push(selectedElements[i]);
            }
            this.removeStyles(elements);
            this.isSeriesMode = true;
            this.addOrRemoveIndex(this.selectedDataIndexes, new Index(series, NaN));
            for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                var value = _a[_i];
                seriesStyle = this.generateStyle(value);
                if (document.querySelectorAll('.' + seriesStyle).length > 0) {
                    for (var _b = 0, elements_3 = elements; _b < elements_3.length; _b++) {
                        var element = elements_3[_b];
                        this.checkSelectionElements(element, seriesStyle, true, true, series);
                    }
                    isBlurEffectNeeded = false;
                    break;
                }
            }
            if (isBlurEffectNeeded) {
                this.isSeriesMode = chart.selectionMode === 'Series';
                this.blurEffect(chart.element.id, chart.visibleSeries);
            }
        }
    };
    /** @private */
    Selection.prototype.getSeriesElements = function (series) {
        var seriesElements = [series.seriesElement];
        if (series.marker.visible && series.type !== 'Scatter' && series.type !== 'Bubble' && !series.isRectSeries) {
            seriesElements.push(series.symbolElement);
        }
        return seriesElements;
    };
    /** @private */
    Selection.prototype.indexFinder = function (id) {
        var ids = ['NaN', 'NaN'];
        if (id.indexOf('SeriesGroup') > -1) {
            ids = id.split('SeriesGroup');
            ids[0] = ids[1];
        }
        else if (id.indexOf('SymbolGroup') > -1) {
            ids = id.split('SymbolGroup');
            ids[0] = ids[1];
        }
        else if (id.indexOf('_Point_') > -1) {
            ids = id.split('_Series_')[1].split('_Point_');
        }
        else if (id.indexOf('_Series_') > -1) {
            ids[0] = id.split('_Series_')[1];
        }
        else if (id.indexOf('_chart_legend_shape_') > -1) {
            ids = id.split('_chart_legend_shape_');
            ids[0] = ids[1];
        }
        return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
    };
    /**
     * Drag selection that returns the selected data.
     * @return {void}
     * @private
     */
    Selection.prototype.calculateDragSelectedElements = function (chart, dragRect, isClose) {
        this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
        var isLasso = chart.selectionMode === 'Lasso';
        var rect = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        var axisOffset = new ChartLocation(chart.chartAxisLayoutPanel.seriesClipRect.x, chart.chartAxisLayoutPanel.seriesClipRect.y);
        this.removeOffset(rect, axisOffset);
        var points;
        var index;
        var selectedPointValues = [];
        var selectedSeriesValues = [];
        this.isSeriesMode = false;
        var isDragResize = (chart.allowMultiSelection) && (this.rectGrabbing || this.resizing);
        this.rectPoints = this.dragRectArray[isDragResize ? this.targetIndex : this.count] =
            new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
        if (dragRect.width && dragRect.height && !isClose) {
            var rt = new Rect(dragRect.x, dragRect.y, dragRect.width, dragRect.height);
            this.removeOffset(rt, axisOffset);
            this.filterArray[isDragResize ? this.targetIndex : this.count] = rt;
        }
        var _loop_1 = function (series) {
            if (series.visible) {
                points = series.points;
                selectedPointValues = [];
                var xAxisOffset_1;
                var yAxisOffset_1;
                if ((chart.isTransposed || series.type.indexOf('Bar') !== -1) &&
                    !(chart.isTransposed && series.type.indexOf('Bar') !== -1)) {
                    xAxisOffset_1 = series.xAxis.rect.y - axisOffset.y;
                    yAxisOffset_1 = series.yAxis.rect.x - axisOffset.x;
                }
                else {
                    xAxisOffset_1 = series.xAxis.rect.x - axisOffset.x;
                    yAxisOffset_1 = series.yAxis.rect.y - axisOffset.y;
                }
                for (var j = 0; j < points.length; j++) {
                    var yValue = series.type !== 'RangeArea' ? points[j].yValue :
                        points[j].regions[0].y;
                    var isCurrentPoint = void 0;
                    var selectedPointX = points[j].xValue;
                    if (chart.primaryXAxis.valueType === 'Category') {
                        selectedPointX = points[j].x.toLocaleString();
                    }
                    else if (chart.primaryXAxis.valueType === 'DateTime') {
                        selectedPointX = new Date(points[j].xValue);
                    }
                    if (series.type === 'BoxAndWhisker') {
                        isCurrentPoint = points[j].regions.some(function (region) {
                            return withInBounds(region.x + xAxisOffset_1, region.y + yAxisOffset_1, rect);
                        });
                    }
                    else {
                        if (chart.selectionMode === 'Lasso') {
                            isCurrentPoint = points[j].isSelect;
                        }
                        else {
                            isCurrentPoint = (chart.allowMultiSelection) ?
                                this_1.isPointSelect(points[j], xAxisOffset_1, yAxisOffset_1, this_1.filterArray, axisOffset) :
                                points[j].symbolLocations.some(function (location) {
                                    return location && withInBounds(location.x + xAxisOffset_1, location.y + yAxisOffset_1, rect);
                                });
                        }
                    }
                    if (isCurrentPoint && series.category !== 'Indicator') {
                        index = new Index(series.index, points[j].index);
                        this_1.selection(chart, index, this_1.findElements(chart, series, index));
                        selectedPointValues.push({ x: selectedPointX, y: yValue });
                    }
                    if (isCurrentPoint && series.type === 'RangeArea') {
                        selectedPointValues.push({ x: selectedPointX, y: points[j].regions[0].y });
                    }
                }
                selectedSeriesValues.push(selectedPointValues);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            _loop_1(series);
        }
        this.blurEffect(chart.element.id, chart.visibleSeries);
        var x = isLasso ? chart.mouseDownX : (dragRect.x + dragRect.width);
        var y = isLasso ? chart.mouseDownY : dragRect.y;
        if (!isClose) {
            this.createCloseButton(x, y);
        }
        var args = {
            name: dragComplete,
            selectedDataValues: selectedSeriesValues,
            cancel: false
        };
        chart.trigger(dragComplete, args);
    };
    Selection.prototype.removeOffset = function (rect, clip) {
        rect.x -= clip.x;
        rect.y -= clip.y;
    };
    Selection.prototype.isPointSelect = function (points, xAxisOffset, yAxisOffset, rectCollection, axisOffset) {
        var location = points.symbolLocations[0];
        for (var _i = 0, rectCollection_1 = rectCollection; _i < rectCollection_1.length; _i++) {
            var rect = rectCollection_1[_i];
            if (rect && location && withInBounds(location.x + xAxisOffset, location.y + yAxisOffset, rect)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Method to draw dragging rect.
     * @return {void}
     * @private
     */
    Selection.prototype.drawDraggingRect = function (chart, dragRect, target) {
        var cartesianLayout = chart.chartAxisLayoutPanel.seriesClipRect;
        var border = chart.chartArea.border.width;
        var rectFill = chart.themeStyle.selectionRectFill;
        var rectStroke = chart.themeStyle.selectionRectStroke;
        var isLasso = chart.selectionMode === 'Lasso';
        if (this.isdrawRect) {
            cartesianLayout.x = cartesianLayout.x - border / 2;
            cartesianLayout.y = cartesianLayout.y - border / 2;
            cartesianLayout.width = cartesianLayout.width + border;
            cartesianLayout.height = cartesianLayout.height + border;
            this.isdrawRect = false;
        }
        switch (chart.selectionMode) {
            case 'DragX':
                dragRect.y = cartesianLayout.y;
                dragRect.height = cartesianLayout.height;
                break;
            case 'DragY':
                dragRect.x = cartesianLayout.x;
                dragRect.width = cartesianLayout.width;
                break;
        }
        if ((dragRect.width < 5 || dragRect.height < 5) && !isLasso) {
            return null;
        }
        var isDragMode = chart.selectionMode.indexOf('Drag') > -1 || chart.selectionMode === 'Lasso';
        if ((chart.allowMultiSelection) && isDragMode) {
            var element = void 0;
            var dragGroup = void 0;
            var multiGroup = getElement(this.multiRectGroup);
            if (!multiGroup) {
                multiGroup = chart.svgRenderer.createGroup({ id: this.multiRectGroup });
                chart.svgObject.appendChild(multiGroup);
            }
            if (this.rectGrabbing || this.resizing) {
                var rectElement = void 0;
                if (this.resizing) {
                    rectElement = getElement(this.draggedRect + this.targetIndex);
                }
                else {
                    rectElement = getElement(target.id);
                }
                if (rectElement.nextSibling) {
                    remove(rectElement.nextSibling);
                }
                this.setAttributes(rectElement, dragRect);
            }
            else if (!getElement(this.draggedRectGroup + this.count)) {
                dragGroup = chart.svgRenderer.createGroup({ id: this.draggedRectGroup + this.count });
                var svgElement = document.getElementById(chart.element.id + '_series_svg');
                chart.enableCanvas ? svgElement.appendChild(dragGroup) : multiGroup.appendChild(dragGroup);
            }
            if (!(chart.selectionMode === 'Lasso')) {
                element = chart.svgRenderer.drawRectangle(new RectOption(this.draggedRect + this.count, rectFill, { color: rectStroke, width: 1 }, 1, dragRect));
                element.setAttribute('style', 'cursor:move;');
            }
            else {
                element = chart.svgRenderer.drawPath(new PathOption(this.lassoPath + this.count, rectFill, 3, rectStroke, 1, '', this.path));
            }
            if (!dragGroup && !this.rectGrabbing && !this.resizing) {
                getElement(this.draggedRectGroup + this.count).appendChild(element);
            }
            else if (!this.rectGrabbing && !this.resizing) {
                dragGroup.appendChild(element);
            }
        }
        else {
            var element = isLasso ?
                getElement(this.lassoPath) : getElement(this.draggedRect);
            if (this.closeIcon) {
                removeElement(this.closeIconId);
            }
            if (element) {
                if (isLasso) {
                    element.setAttribute('d', this.path);
                }
                else {
                    this.setAttributes(element, dragRect);
                }
            }
            else {
                var dragGroup = chart.svgRenderer.createGroup({ id: this.draggedRectGroup });
                var svgElement = document.getElementById(chart.element.id + '_series_svg');
                chart.enableCanvas ? svgElement.appendChild(dragGroup) : chart.svgObject.appendChild(dragGroup);
                if (!(chart.selectionMode === 'Lasso')) {
                    element = chart.svgRenderer.drawRectangle(new RectOption(this.draggedRect, rectFill, { color: rectStroke, width: 1 }, 1, dragRect));
                }
                else {
                    element = chart.svgRenderer.drawPath(new PathOption(this.lassoPath, rectFill, 3, rectStroke, 1, '', this.path));
                }
                //element.setAttribute('style', 'cursor:move;');
                dragGroup.appendChild(element);
            }
        }
    };
    /**
     * To get drag selected group element index from its id
     * @param id
     */
    Selection.prototype.getIndex = function (id) {
        var i;
        for (i = id.length - 1; i > 0; i--) {
            var x = Number(id[i]);
            if (!isNaN(x)) {
                continue;
            }
            else {
                break;
            }
        }
        var index = +id.substr(i + 1, id.length - 1);
        return index;
    };
    Selection.prototype.createCloseButton = function (x, y) {
        var isMultiDrag = this.chart.allowMultiSelection;
        var circleStroke = this.chart.themeStyle.selectionCircleStroke;
        var isDrag = this.rectGrabbing || this.resizing;
        var closeIcon = this.chart.svgRenderer.createGroup({
            id: this.closeIconId + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''),
            style: 'cursor:pointer; visibility: visible;'
        });
        closeIcon.appendChild(this.chart.svgRenderer.drawCircle(new CircleOption(this.closeIconId + '_circle' + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''), '#FFFFFF', { color: circleStroke, width: 1 }, 1, x, y, 10)));
        var direction = 'M ' + (x - 4) + ' ' + (y - 4) + ' L ' + (x + 4) + ' ' + (y + 4) + ' M ' + (x - 4) + ' ' + (y + 4) +
            ' L ' + (x + 4) + ' ' + (y - 4);
        closeIcon.appendChild(this.chart.svgRenderer.drawPath({
            id: this.closeIconId + '_cross' +
                (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''), d: direction,
            stroke: circleStroke, 'stroke-width': 2, fill: circleStroke
        }, null));
        this.closeIcon = closeIcon;
        var pathElement = getElement(this.draggedRectGroup + (isMultiDrag ? (isDrag ? this.targetIndex : this.count) : ''));
        if (pathElement) {
            pathElement.appendChild(closeIcon);
        }
    };
    /**
     * Method to remove dragged element.
     * @return {void}
     * @private
     */
    Selection.prototype.removeDraggedElements = function (chart, event) {
        if ((event.target.id.indexOf(this.closeIconId) > -1) && (event.type.indexOf('move') === -1)) {
            var isSelectedvalues = true;
            if ((chart.allowMultiSelection)) {
                var index = this.getIndex(event.target.id);
                var multiRectGroupElement = getElement(this.multiRectGroup);
                remove(getElement(this.draggedRectGroup + index));
                this.dragRectArray[index] = null;
                this.filterArray[index] = null;
                this.totalSelectedPoints[index] = null;
                if (multiRectGroupElement && multiRectGroupElement.childElementCount === 0) {
                    removeElement(multiRectGroupElement);
                    this.dragRectArray = [];
                    this.filterArray = [];
                    this.totalSelectedPoints = [];
                }
                if (this.currentMode === 'Lasso') {
                    if (this.multiDataIndexes[index] != null) {
                        for (var i = 0; i < this.multiDataIndexes[index].length; i++) {
                            this.multiDataIndexes[index][i].isSelect = false;
                        }
                    }
                    this.multiDataIndexes[index] = null;
                    for (var j = 0; j < this.multiDataIndexes.length; j++) {
                        if (this.multiDataIndexes[j] != null) {
                            isSelectedvalues = false;
                            for (var k = 0; k < this.multiDataIndexes[j].length; k++) {
                                this.multiDataIndexes[j][k].isSelect = true;
                            }
                        }
                    }
                    this.calculateDragSelectedElements(chart, this.dragRect, true);
                }
                else if (this.filterArray.length) {
                    for (var i = 0; i < this.filterArray.length; i++) {
                        if (this.filterArray[i]) {
                            isSelectedvalues = false;
                            this.calculateDragSelectedElements(chart, this.filterArray[i], true);
                        }
                    }
                }
                else {
                    this.calculateDragSelectedElements(chart, new Rect(0, 0, 0, 0), true);
                }
            }
            else {
                remove(getElement(this.draggedRectGroup));
                this.removeSelectedElements(chart, this.selectedDataIndexes, chart.series);
            }
            this.blurEffect(chart.element.id, chart.visibleSeries);
            this.changeCursorStyle(false, chart.svgObject, 'auto');
            if (!(chart.allowMultiSelection) || isSelectedvalues) {
                this.rectPoints = null;
            }
        }
    };
    /**
     * Method to resize the drag rect.
     * @return {void}
     * @private
     */
    Selection.prototype.resizingSelectionRect = function (chart, location, tapped, target) {
        var rect;
        if (((chart.allowMultiSelection) && (target.id.indexOf('_ej2_drag_rect') > -1)) ||
            this.dragRectArray[this.targetIndex]) {
            if (target.id.indexOf('_ej2_drag_rect') > -1) {
                this.targetIndex = this.getIndex(target.id);
            }
            var r = this.dragRectArray[this.targetIndex];
            rect = new Rect(r.x, r.y, r.width, r.height);
        }
        if (!(chart.allowMultiSelection)) {
            rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        }
        if (rect) {
            var resize = this.findResizeMode(chart.svgObject, rect, location);
            if (this.resizing) {
                rect = getDraggedRectLocation(rect.x, rect.y, (rect.x + rect.width), (rect.y + rect.height), chart.chartAxisLayoutPanel.seriesClipRect);
                this.drawDraggingRect(chart, rect);
                this.dragRect = rect;
            }
            if (tapped) {
                this.resizing = resize;
            }
        }
        else {
            return;
        }
    };
    Selection.prototype.findResizeMode = function (chartSvgObject, rect, location) {
        var cursorStyle = 'se-resize';
        var resize = false;
        if (!this.resizing) {
            var resizeEdges = [new Rect(rect.x, (rect.y), rect.width - 5, 5),
                new Rect((rect.x), rect.y, 5, rect.height),
                new Rect(rect.x, (rect.y + rect.height - 5), rect.width - 5, 5),
                new Rect((rect.x + rect.width - 5), rect.y + 5, 5, rect.height - 15),
                new Rect((rect.x + rect.width - 10), (rect.y + rect.height - 10), 10, 10)]; //corner
            for (var i = 0; i < resizeEdges.length; i++) {
                if (withInBounds(location.x, location.y, resizeEdges[i])) {
                    cursorStyle = (i === 4) ? cursorStyle : (i % 2 === 0) ? 'ns-resize' : 'ew-resize';
                    resize = true;
                    this.resizeMode = i;
                    break;
                }
            }
        }
        else {
            var x = rect.x;
            var y = rect.y;
            var width = (location.x - x);
            var height = (location.y - y);
            switch (this.resizeMode) {
                case 0:
                    height = Math.abs((rect.height + rect.y) - location.y);
                    rect.y = Math.min((rect.height + rect.y), location.y);
                    rect.height = height;
                    break;
                case 1:
                    width = Math.abs((rect.width + rect.x) - location.x);
                    rect.x = Math.min((rect.width + rect.x), location.x);
                    rect.width = width;
                    break;
                case 2:
                    rect.height = Math.abs(height);
                    rect.y = Math.min(location.y, y);
                    break;
                case 3:
                    rect.width = Math.abs(width);
                    rect.x = Math.min(location.x, x);
                    break;
                case 4:
                    rect.width = Math.abs(width);
                    rect.height = Math.abs(height);
                    rect.x = Math.min(location.x, x);
                    rect.y = Math.min(location.y, y);
                    break;
            }
        }
        if (this.currentMode !== 'Lasso') {
            this.changeCursorStyle(resize, getElement((this.chart.allowMultiSelection) ? this.draggedRect +
                this.targetIndex : this.draggedRect), cursorStyle);
        }
        this.changeCursorStyle(resize, chartSvgObject, cursorStyle);
        return resize;
    };
    Selection.prototype.changeCursorStyle = function (isResize, rectelement, cursorStyle) {
        cursorStyle = isResize ? cursorStyle : (this.control.svgObject === rectelement) ? 'auto' : 'move';
        if (rectelement) {
            rectelement.setAttribute('style', 'cursor:' + cursorStyle + ';');
        }
    };
    Selection.prototype.removeSelectedElements = function (chart, index, seriesCollection) {
        index.splice(0, index.length);
        var seriesElements;
        for (var _i = 0, seriesCollection_1 = seriesCollection; _i < seriesCollection_1.length; _i++) {
            var series = seriesCollection_1[_i];
            seriesElements = this.getSeriesElements(series);
            this.removeStyles(seriesElements);
            for (var _a = 0, seriesElements_2 = seriesElements; _a < seriesElements_2.length; _a++) {
                var seriesElement = seriesElements_2[_a];
                this.removeStyles(this.getChildren(seriesElement));
            }
        }
    };
    Selection.prototype.setAttributes = function (ele, object) {
        var keys = Object.keys(object);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            ele.setAttribute(key, object[key]);
        }
    };
    /**
     * Method to move the dragged rect.
     * @return {void}
     * @private
     */
    Selection.prototype.draggedRectMoved = function (chart, grabbedPoint, doDrawing, target) {
        var rect;
        if ((this.resizing || this.rectGrabbing) && (chart.allowMultiSelection)) {
            var r = this.dragRectArray[this.targetIndex];
            rect = new Rect(r.x, r.y, r.width, r.height);
        }
        else {
            rect = new Rect(this.rectPoints.x, this.rectPoints.y, this.rectPoints.width, this.rectPoints.height);
        }
        rect.x -= (grabbedPoint.x - chart.mouseX);
        rect.y -= (grabbedPoint.y - chart.mouseY);
        rect = getDraggedRectLocation(rect.x, rect.y, rect.x + rect.width, rect.height + rect.y, chart.chartAxisLayoutPanel.seriesClipRect);
        if (doDrawing) {
            this.drawDraggingRect(chart, rect, target);
        }
        else {
            this.calculateDragSelectedElements(chart, rect);
        }
    };
    /**
     * To complete the selection.
     * @return {void}
     * @private
     */
    Selection.prototype.completeSelection = function (e) {
        var chart = this.chart;
        if (chart.selectionMode === 'None') {
            return;
        }
        this.currentMode = chart.selectionMode;
        if ((this.dragging || this.resizing) && this.dragRect.width > 5 && this.dragRect.height > 5) {
            this.calculateDragSelectedElements(chart, this.dragRect);
        }
        else if (!(chart.allowMultiSelection) && this.rectGrabbing &&
            this.rectPoints.width && this.rectPoints.height) {
            this.draggedRectMoved(chart, this.dragRect);
        }
        else if (this.rectGrabbing && this.dragRectArray[this.targetIndex].width && this.dragRectArray[this.targetIndex].height) {
            this.draggedRectMoved(chart, this.dragRect);
        }
        if (chart.selectionMode === 'Lasso' && this.dragging && this.path) {
            if (this.path.indexOf('L') !== -1) {
                if (!(chart.allowMultiSelection)) {
                    getElement(this.lassoPath).setAttribute('d', this.path + 'Z');
                    this.pointChecking(getElement(this.lassoPath));
                }
                else if (getElement(this.lassoPath + this.count)) {
                    getElement(this.lassoPath + this.count).setAttribute('d', this.path + 'Z');
                    this.pointChecking(getElement(this.lassoPath + this.count));
                }
                if (this.dragging || this.resizing) {
                    this.calculateDragSelectedElements(chart, this.dragRect);
                }
            }
        }
        this.dragging = false;
        this.rectGrabbing = false;
        this.resizing = false;
        this.removeDraggedElements(chart, e);
    };
    Selection.prototype.getDragRect = function (chart, seriesClipRect) {
        return getDraggedRectLocation(chart.mouseDownX, chart.mouseDownY, chart.mouseX, chart.mouseY, seriesClipRect);
    };
    /** @private */
    Selection.prototype.dragStart = function (chart, seriesClipRect, mouseDownX, mouseDownY, event) {
        var mode = chart.selectionMode;
        this.currentMode = chart.selectionMode;
        this.dragging = (mode.indexOf('Drag') > -1 || mode === 'Lasso') && (chart.isDoubleTap || !chart.isTouch) &&
            chart.chartAreaType !== 'PolarRadar';
        var target = event.target;
        this.path = undefined;
        if (this.dragging) {
            this.count = getElement(this.multiRectGroup) ? (this.count + 1) : 0;
            this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
            if (chart.mouseDownX < seriesClipRect.x || chart.mouseDownX > (seriesClipRect.x + seriesClipRect.width) ||
                chart.mouseDownY < seriesClipRect.y || chart.mouseDownY > (seriesClipRect.y + seriesClipRect.height)) {
                this.dragging = false;
            }
        }
        if (mode === 'Lasso') {
            for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                var series = _a[_i];
                if (series.visible) {
                    for (var _b = 0, _c = series.points; _b < _c.length; _b++) {
                        var point = _c[_b];
                        if (!(chart.allowMultiSelection)) {
                            point.isSelect = false;
                        }
                    }
                }
            }
        }
        if (!(mode === 'Lasso')) {
            if (this.rectPoints && !(chart.allowMultiSelection)) {
                this.dragRect = new Rect(chart.mouseDownX, chart.mouseDownY, 0, 0);
                this.resizingSelectionRect(chart, new ChartLocation(mouseDownX, mouseDownY), true);
                this.rectGrabbing = withInBounds(mouseDownX, mouseDownY, this.rectPoints);
            }
            if ((chart.allowMultiSelection)) {
                var index = this.getIndex(target.id);
                this.targetIndex = this.isDragRect(target.id) ? index : undefined;
                if (this.dragRectArray.length && this.isDragRect(target.id)) {
                    this.resizingSelectionRect(chart, new ChartLocation(mouseDownX, mouseDownY), true, target);
                    this.rectGrabbing = withInBounds(mouseDownX, mouseDownY, this.dragRectArray[index]);
                }
            }
        }
    };
    Selection.prototype.isDragRect = function (id) {
        return id.indexOf('_ej2_drag_rect') > -1;
    };
    /** @private */
    Selection.prototype.mouseMove = function (event) {
        var chart = this.chart;
        var target = event.target;
        if (chart.highlightMode !== 'None') {
            if (!isNullOrUndefined(target)) {
                if (event.target.id.indexOf('text') > 1) {
                    target = getElement(event.target.id.replace('text', 'shape'));
                }
                if ((target).hasAttribute('class') && ((target).getAttribute('class').indexOf('highlight') > -1 ||
                    target.getAttribute('class').indexOf('selection') > -1)) {
                    return;
                }
                this.calculateSelectedElements(event);
                return;
            }
        }
        if (chart.selectionMode === 'None') {
            return;
        }
        if (event.type === 'touchmove' && (Browser.isIos || Browser.isIos7) && this.dragging && event.preventDefault) {
            event.preventDefault();
        }
        var insideMoving = withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect);
        if (insideMoving) {
            if (this.rectGrabbing && !this.resizing) {
                this.draggedRectMoved(chart, this.dragRect, true, target);
            }
            else if (this.dragging && !this.resizing) {
                if (chart.selectionMode === 'Lasso') {
                    this.getPath(chart.mouseDownX, chart.mouseDownY, chart.mouseX, chart.mouseY);
                    this.drawDraggingRect(chart, this.dragRect, target);
                }
                else {
                    this.dragRect = this.getDragRect(chart, chart.chartAxisLayoutPanel.seriesClipRect);
                    this.drawDraggingRect(chart, this.dragRect, target);
                }
            }
            if (this.rectPoints && !(chart.allowMultiSelection)) {
                this.resizingSelectionRect(chart, new ChartLocation(chart.mouseX, chart.mouseY), null, target);
            }
            else if (((chart.allowMultiSelection) && !this.dragging) || this.resizing) {
                this.resizingSelectionRect(chart, new ChartLocation(chart.mouseX, chart.mouseY), null, target);
            }
        }
        else {
            this.completeSelection(event);
        }
    };
    Selection.prototype.getPath = function (startX, startY, endX, endY) {
        if (this.dragging) {
            if (this.path) {
                this.path = this.path + ' L' + endX + ' ' + endY;
            }
            else {
                this.path = 'M ' + startX + ' ' + startY;
            }
        }
    };
    Selection.prototype.pointChecking = function (path) {
        var _this = this;
        var chart = this.chart;
        var element;
        var svgRect = getElement(chart.svgId).getBoundingClientRect();
        var offsetX = chart.chartAxisLayoutPanel.seriesClipRect.x + Math.max(svgRect.left, 0);
        var offsetY = chart.chartAxisLayoutPanel.seriesClipRect.y + Math.max(svgRect.top, 0);
        this.multiDataIndexes[this.count] = [];
        for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            series.points.filter(function (point) {
                element = document.elementFromPoint(point.symbolLocations[0].x + offsetX, point.symbolLocations[0].y + offsetY);
                if (element === path) {
                    point.isSelect = true;
                    if ((_this.chart.allowMultiSelection) && _this.currentMode === 'Lasso') {
                        _this.multiDataIndexes[_this.count][_this.seriesIndex] = point;
                        _this.seriesIndex++;
                    }
                }
                else if (!(chart.allowMultiSelection)) {
                    point.isSelect = false;
                }
            });
        }
        this.seriesIndex = 0;
    };
    /**
     * Get module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'Selection';
    };
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    Selection.prototype.destroy = function (chart) {
        this.removeEventListener();
        // Destroy method performed here
    };
    return Selection;
}(BaseSelection));
export { Selection };
