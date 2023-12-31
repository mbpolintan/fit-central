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
import { drawSymbol } from '../../common/utils/helper';
import { PathOption, Size } from '@syncfusion/ej2-svg-base';
import { Browser, extend, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartData } from '../../chart/utils/get-data';
import { withInBounds, PointData, stopTimer } from '../../common/utils/helper';
import { colorNameToHex, convertHexToColor } from '../../common/utils/helper';
/**
 * Marker Module used to render the marker for line type series.
 */
var MarkerExplode = /** @class */ (function (_super) {
    __extends(MarkerExplode, _super);
    /**
     * Constructor for the marker module.
     * @private
     */
    function MarkerExplode(chart) {
        var _this = _super.call(this, chart) || this;
        _this.elementId = chart.element.id;
        return _this;
    }
    /**
     * @hidden
     */
    MarkerExplode.prototype.addEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    /**
     * @hidden
     */
    MarkerExplode.prototype.removeEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
    };
    /**
     * @hidden
     */
    MarkerExplode.prototype.mouseUpHandler = function () {
        var chart = this.chart;
        if (chart.isTouch && !chart.crosshair.enable && !this.isSelected(chart)) {
            this.markerMove(true);
        }
    };
    /**
     * @hidden
     */
    MarkerExplode.prototype.mouseMoveHandler = function () {
        var chart = this.chart;
        if ((!chart.crosshair.enable || (chart.tooltip.enable)) && (!chart.isTouch || chart.startMove) && !this.isSelected(chart)) {
            this.markerMove(false);
        }
    };
    MarkerExplode.prototype.markerMove = function (remove) {
        var _this = this;
        var chart = this.chart;
        this.currentPoints = [];
        var data;
        var previous;
        var explodeSeries;
        var series;
        if (!chart.tooltip.shared || !chart.tooltip.enable) {
            data = this.getData();
            series = data.series;
            previous = this.previousPoints[0];
            explodeSeries = series && ((series.type === 'Bubble' || series.drawType === 'Scatter' || series.type === 'Scatter') ||
                (((series.type !== 'Candle') && (series.type !== 'Hilo') && (series.type !== 'HiloOpenClose')) &&
                    (series.marker.visible && series.marker.width !== 0 && series.marker.height !== 0)));
            data.lierIndex = this.lierIndex;
            if (data.point && explodeSeries && ((!previous || (previous.point !== data.point)) ||
                (previous && previous.lierIndex > 3 && previous.lierIndex !== this.lierIndex))) {
                this.currentPoints.push(data);
            }
            if (data.point && explodeSeries && chart.isPointMouseDown) {
                this.currentPoints.push(data);
            }
        }
        else {
            if (!withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                return null;
            }
            if (chart.tooltip.enable) {
                var pointData = chart.chartAreaType === 'PolarRadar' ? this.getData() : null;
                for (var _i = 0, _a = chart.visibleSeries; _i < _a.length; _i++) {
                    var chartSeries = _a[_i];
                    if (!chartSeries.enableTooltip || chartSeries.category === 'Indicator') {
                        continue;
                    }
                    if (chart.chartAreaType === 'Cartesian' && chartSeries.visible) {
                        data = this.getClosestX(chart, chartSeries);
                    }
                    else if (chart.chartAreaType === 'PolarRadar' && chartSeries.visible && pointData.point !== null) {
                        data = new PointData(chartSeries.points[pointData.point.index], chartSeries);
                    }
                    if (data) {
                        this.currentPoints.push(data);
                        data = null;
                    }
                }
            }
        }
        var length = this.previousPoints.length;
        if (this.currentPoints.length > 0) {
            if (length === 0 || chart.isPointMouseDown || (length > 0 && this.previousPoints[0].point !== this.currentPoints[0].point)) {
                if (this.previousPoints.length > 0) {
                    this.removeHighlightedMarker();
                }
                var _loop_1 = function (data_1) {
                    if ((data_1 && data_1.point) || ((series.type !== 'Candle') &&
                        (series.type !== 'Hilo') && (series.type !== 'HiloOpenClose'))) {
                        stopTimer(this_1.markerExplode);
                        this_1.isRemove = true;
                        data_1.point.symbolLocations.map(function (location, index) {
                            if (!data_1.series.isRectSeries || data_1.point.marker.visible) {
                                _this.drawTrackBall(data_1.series, data_1.point, location, index);
                            }
                        });
                    }
                };
                var this_1 = this;
                for (var _b = 0, _c = this.currentPoints; _b < _c.length; _b++) {
                    var data_1 = _c[_b];
                    _loop_1(data_1);
                }
                this.previousPoints = extend([], this.currentPoints, null, true);
            }
        }
        if (!chart.tooltip.enable && ((this.currentPoints.length === 0 && this.isRemove) || (remove && this.isRemove) ||
            !withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect))) {
            this.isRemove = false;
            this.markerExplode = setTimeout(function () {
                _this.removeHighlightedMarker();
            }, 2000);
        }
        this.currentPoints = [];
    };
    MarkerExplode.prototype.drawTrackBall = function (series, point, location, index) {
        var marker = point.marker;
        var seriesMarker = series.marker;
        var shape = marker.shape || seriesMarker.shape;
        if (shape === 'None') {
            return null;
        }
        var element = series.symbolElement || series.seriesElement;
        var className;
        if (this.chart.highlightModule && this.chart.highlightMode !== 'None') {
            className = this.chart.highlightModule.generateStyle(series);
        }
        if (this.chart.selectionModule && this.chart.selectionMode !== 'None') {
            className = this.chart.selectionModule.generateStyle(series);
        }
        var symbolId = this.elementId + '_Series_' + series.index + '_Point_' + point.index + '_Trackball' +
            (index ? index : '');
        var size = new Size((marker.width || seriesMarker.width) + 5, (marker.height || seriesMarker.height) + 5);
        var border = (marker.border || series.border);
        var explodeSeries = (series.type === 'BoxAndWhisker' || series.type === 'Bubble' || series.type === 'Scatter');
        var borderColor = (border.color && border.color !== 'transparent') ? border.color :
            marker.fill || point.interior || (explodeSeries ? point.color : series.interior);
        var colorValue = convertHexToColor(colorNameToHex(borderColor));
        var borderWidth = marker.border ? marker.border.width : seriesMarker.border.width;
        var markerShadow = series.chart.themeStyle.markerShadow ||
            'rgba(' + colorValue.r + ',' + colorValue.g + ',' + colorValue.b + ',0.2)';
        for (var i = 0; i < 2; i++) {
            var options = new PathOption(symbolId + '_' + i, i ? (marker.fill || point.color || (explodeSeries ? series.interior : '#ffffff')) : 'transparent', borderWidth + (i ? 0 : 8), i ? borderColor : markerShadow, (marker.opacity || seriesMarker.opacity), null, null);
            var symbol = drawSymbol(location, shape, size, seriesMarker.imageUrl, options, '', this.chart.svgRenderer, series.clipRect);
            // incident: 252450 point click selection not working while maker explode
            //symbol.setAttribute('style', 'pointer-events:none');
            symbol.setAttribute('class', 'EJ2-Trackball');
            var selectionId = element.id.indexOf('Symbol') !== -1 ? '_Symbol' : '';
            var seletionElem = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
                point.index + selectionId);
            if (className !== '' && !isNullOrUndefined(className) && !isNullOrUndefined(seletionElem) &&
                seletionElem.hasAttribute('class') && (className === seletionElem.getAttribute('class'))) {
                symbol.classList.add(className);
            }
            symbol.setAttribute('clip-path', element.getAttribute('clip-path'));
            symbol.setAttribute('transform', element.getAttribute('transform'));
            this.chart.svgObject.appendChild(symbol);
        }
    };
    /**
     * @hidden
     */
    MarkerExplode.prototype.removeHighlightedMarker = function () {
        var elements = document.getElementsByClassName('EJ2-Trackball');
        for (var i = 0, len = elements.length; i < len; i++) {
            remove(elements[0]);
        }
        this.previousPoints = [];
    };
    return MarkerExplode;
}(ChartData));
export { MarkerExplode };
