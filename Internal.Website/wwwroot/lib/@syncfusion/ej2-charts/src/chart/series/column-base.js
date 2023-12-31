import { Animation, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DoubleRange } from '../utils/double-range';
import { appendChildElement, redrawElement, pathAnimation, valueToCoefficient, getVisiblePoints } from '../../common/utils/helper';
import { getAnimationFunction, getPoint, getMinPointsDelta } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { pointRender } from '../../common/model/constants';
/**
 * Column Series Base
 */
var ColumnBase = /** @class */ (function () {
    function ColumnBase() {
    }
    /**
     * To get the position of the column series.
     * @return {DoubleRange}
     * @private
     */
    ColumnBase.prototype.getSideBySideInfo = function (series) {
        if (series.chart.enableSideBySidePlacement && !series.position) {
            this.getSideBySidePositions(series);
        }
        var position = !series.chart.enableSideBySidePlacement ? 0 : series.position;
        var rectCount = !series.chart.enableSideBySidePlacement ? 1 : series.rectCount;
        series.isRectSeries = true;
        var visibleSeries = series.chart.visibleSeries;
        var seriesSpacing = series.chart.enableSideBySidePlacement ? series.columnSpacing : 0; // Column Spacing
        var pointSpacing = (series.columnWidth === null || isNaN(+series.columnWidth)) ? ((series.type === 'Histogram') ? 1 : 0.7) :
            series.columnWidth; // Column width
        var minimumPointDelta = getMinPointsDelta(series.xAxis, visibleSeries);
        var width = minimumPointDelta * pointSpacing;
        var radius;
        var location = (position) / rectCount - 0.5;
        var doubleRange = new DoubleRange(location, location + (1 / rectCount));
        if (!(isNaN(doubleRange.start) || isNaN(doubleRange.end))) {
            doubleRange = new DoubleRange(doubleRange.start * width, doubleRange.end * width);
            radius = seriesSpacing * doubleRange.delta;
            doubleRange = new DoubleRange(doubleRange.start + radius / 2, doubleRange.end - radius / 2);
        }
        return doubleRange;
    };
    /**
     * To get the rect values.
     * @return {Rect}
     * @private
     */
    ColumnBase.prototype.getRectangle = function (x1, y1, x2, y2, series) {
        var point1 = getPoint(x1, y1, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        var point2 = getPoint(x2, y2, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        return new Rect(Math.min(point1.x, point2.x), Math.min(point1.y, point2.y), Math.abs(point2.x - point1.x), Math.abs(point2.y - point1.y));
    };
    /**
     * To get the position of each series.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.getSideBySidePositions = function (series) {
        var chart = series.chart;
        for (var _i = 0, _a = chart.columns; _i < _a.length; _i++) {
            var columnItem = _a[_i];
            for (var _b = 0, _c = chart.rows; _b < _c.length; _b++) {
                var item = _c[_b];
                this.findRectPosition(series.findSeriesCollection(columnItem, item, false));
            }
        }
    };
    ColumnBase.prototype.findRectPosition = function (seriesCollection) {
        var stackingGroup = [];
        var vSeries = { rectCount: 0, position: null };
        for (var i = 0; i < seriesCollection.length; i++) {
            var value = seriesCollection[i];
            // tslint:disable-next-line:align
            if (value.type.indexOf('Stacking') !== -1) {
                if (value.stackingGroup) {
                    if (stackingGroup[value.stackingGroup] === undefined) {
                        value.position = vSeries.rectCount;
                        stackingGroup[value.stackingGroup] = vSeries.rectCount++;
                    }
                    else {
                        value.position = stackingGroup[value.stackingGroup];
                    }
                }
                else {
                    if (vSeries.position === null) {
                        value.position = vSeries.rectCount;
                        vSeries.position = vSeries.rectCount++;
                    }
                    else {
                        value.position = vSeries.position;
                    }
                }
            }
            else {
                value.position = vSeries.rectCount++;
            }
        }
        // tslint:disable-next-line:align
        for (var i = 0; i < seriesCollection.length; i++) {
            var value = seriesCollection[i];
            value.rectCount = vSeries.rectCount;
        }
    };
    /**
     * Updates the symbollocation for points
     * @return void
     * @private
     */
    ColumnBase.prototype.updateSymbolLocation = function (point, rect, series) {
        if (!series.chart.requireInvertedAxis) {
            this.updateXRegion(point, rect, series);
        }
        else {
            this.updateYRegion(point, rect, series);
        }
        if (series.type === 'Histogram') {
            point.minimum = +point.x - series.histogramValues.binWidth / 2;
            point.maximum = +point.x + series.histogramValues.binWidth / 2;
        }
    };
    /**
     * Update the region for the point.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.updateXRegion = function (point, rect, series) {
        point.symbolLocations.push({
            x: rect.x + (rect.width) / 2,
            y: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isInversed)) ? rect.y : (rect.y + rect.height)
        });
        this.getRegion(point, rect, series);
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x + (rect.width) / 2,
                y: rect.y + rect.height
            });
        }
    };
    /**
     * Update the region for the point in bar series.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.updateYRegion = function (point, rect, series) {
        point.symbolLocations.push({
            x: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isInversed)) ? rect.x + rect.width : rect.x,
            y: rect.y + rect.height / 2
        });
        this.getRegion(point, rect, series);
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x,
                y: rect.y + rect.height / 2
            });
        }
    };
    /**
     * To render the marker for the series.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.renderMarker = function (series) {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    };
    /**
     * To get the marker region when Y value is 0
     * @param point
     * @param series
     */
    ColumnBase.prototype.getRegion = function (point, rect, series) {
        if (point.y === 0) {
            var markerWidth = (series.marker && series.marker.width) ? series.marker.width : 0;
            var markerHeight = (series.marker && series.marker.height) ? series.marker.height : 0;
            point.regions.push(new Rect(point.symbolLocations[0].x - markerWidth, point.symbolLocations[0].y - markerHeight, 2 * markerWidth, 2 * markerHeight));
        }
        else {
            point.regions.push(rect);
        }
    };
    /**
     * To trigger the point rendering event.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.triggerEvent = function (series, point, fill, border) {
        var argsData = {
            cancel: false, name: pointRender, series: series, point: point,
            fill: series.setPointColor(point, fill),
            border: series.setBorderColor(point, border)
        };
        series.chart.trigger(pointRender, argsData);
        point.color = argsData.fill;
        return argsData;
    };
    /**
     * To draw the rectangle for points.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.drawRectangle = function (series, point, rect, argsData) {
        var chart = series.chart;
        var check = chart.requireInvertedAxis ? rect.height : rect.width;
        if (check <= 0) {
            return null;
        }
        var direction = this.calculateRoundedRectPath(rect, series.cornerRadius.topLeft, series.cornerRadius.topRight, series.cornerRadius.bottomLeft, series.cornerRadius.bottomRight);
        var name = series.category === 'Indicator' ? chart.element.id + '_Indicator_' + series.index + '_' + series.name +
            '_Point_' + point.index : chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        var previousElement = redrawElement(chart.redraw, name);
        var previousDirection = previousElement ? previousElement.getAttribute('d') : '';
        var options = new PathOption(name, argsData.fill, argsData.border.width, argsData.border.color, series.opacity, series.dashArray, direction);
        var element = chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y]));
        switch (series.seriesType) {
            case 'XY':
                element.setAttribute('aria-label', point.x.toString() + ':' + point.yValue.toString());
                break;
            case 'HighLow':
                element.setAttribute('aria-label', point.x.toString() + ':' + point.high.toString() + ':' + point.low.toString());
                break;
        }
        appendChildElement(series.chart.enableCanvas, series.seriesElement, element, chart.redraw);
        if (!series.chart.enableCanvas) {
            pathAnimation(element, direction, chart.redraw, previousDirection, chart.duration);
        }
    };
    /**
     * To animate the series.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.animate = function (series) {
        var rectElements = series.seriesElement.childNodes;
        var count = series.category === 'Indicator' ? 0 : 1;
        var visiblePoints = getVisiblePoints(series);
        for (var _i = 0, visiblePoints_1 = visiblePoints; _i < visiblePoints_1.length; _i++) {
            var point = visiblePoints_1[_i];
            if (!point.symbolLocations.length && !(series.type === 'BoxAndWhisker' && point.regions.length)) {
                continue;
            }
            this.animateRect(rectElements[count], series, point);
            count++;
        }
    };
    /**
     * To animate the series.
     * @return {void}
     * @private
     */
    ColumnBase.prototype.animateRect = function (element, series, point) {
        var option = series.animation;
        var duration = series.chart.animated ? series.chart.duration : option.duration;
        var effect = getAnimationFunction('Linear');
        var isPlot = point.yValue < 0;
        var x;
        var y;
        var elementHeight = +point.regions[0].height;
        var elementWidth = +point.regions[0].width;
        var centerX;
        var centerY;
        if (!series.chart.requireInvertedAxis) {
            x = +point.regions[0].x;
            if (series.type.indexOf('Stacking') > -1) {
                y = (1 - valueToCoefficient(0, series.yAxis)) * (series.yAxis.rect.height);
                centerX = x;
                centerY = y;
            }
            else {
                y = +point.regions[0].y;
                centerY = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? y + elementHeight / 2 :
                    (isPlot !== series.yAxis.isInversed) ? y : y + elementHeight;
                centerX = isPlot ? x : x + elementWidth;
            }
        }
        else {
            y = +point.regions[0].y;
            if (series.type.indexOf('Stacking') > -1) {
                x = (valueToCoefficient(0, series.yAxis)) * series.yAxis.rect.width;
                centerX = x;
                centerY = y;
            }
            else {
                x = +point.regions[0].x;
                centerY = isPlot ? y : y + elementHeight;
                centerX = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? x + elementWidth / 2 :
                    (isPlot !== series.yAxis.isInversed) ? x + elementWidth : x;
            }
        }
        var value;
        if (!isNullOrUndefined(element)) {
            element.style.visibility = 'hidden';
            new Animation({}).animate(element, {
                duration: duration,
                delay: option.delay,
                progress: function (args) {
                    if (args.timeStamp >= args.delay) {
                        element.style.visibility = 'visible';
                        if (!series.chart.requireInvertedAxis) {
                            elementHeight = elementHeight ? elementHeight : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                        else {
                            elementWidth = elementWidth ? elementWidth : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                    }
                },
                end: function (model) {
                    element.setAttribute('transform', 'translate(0,0)');
                    var seriesElement = series.seriesElement;
                    if (element === seriesElement.lastElementChild || point.index === series.points.length - 1 ||
                        (series.type === 'Waterfall' && element === seriesElement.children[seriesElement.childElementCount - 2])) {
                        series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
                        if (series.type === 'Waterfall') {
                            var rectElements = seriesElement.childNodes;
                            for (var i = 0; i < rectElements.length; i++) {
                                if (rectElements[i].id.indexOf('Connector') !== -1) {
                                    rectElements[i].style.visibility = 'visible';
                                    rectElements[i].setAttribute('transform', 'translate(0,0)');
                                }
                            }
                        }
                    }
                }
            });
        }
    };
    /**
     * To get rounded rect path direction
     */
    ColumnBase.prototype.calculateRoundedRectPath = function (rect, topLeft, topRight, bottomLeft, bottomRight) {
        return 'M' + ' ' + rect.x + ' ' + (topLeft + rect.y) +
            ' Q ' + rect.x + ' ' + rect.y + ' ' + (rect.x + topLeft) + ' ' +
            rect.y + ' ' + 'L' + ' ' + (rect.x + rect.width - topRight) + ' ' + rect.y +
            ' Q ' + (rect.x + rect.width) + ' ' + rect.y + ' ' +
            (rect.x + rect.width) + ' ' + (rect.y + topRight) + ' ' + 'L ' +
            (rect.x + rect.width) + ' ' + (rect.y + rect.height - bottomRight)
            + ' Q ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' ' + (rect.x + rect.width - bottomRight) + ' ' +
            (rect.y + rect.height) + ' ' + 'L ' + (rect.x + bottomLeft) + ' ' + (rect.y + rect.height) + ' Q ' + rect.x + ' ' +
            (rect.y + rect.height) + ' ' + rect.x + ' ' + (rect.y + rect.height - bottomLeft) + ' ' + 'L' + ' ' + rect.x + ' ' +
            (topLeft + rect.y) + ' ' + 'Z';
    };
    return ColumnBase;
}());
export { ColumnBase };
