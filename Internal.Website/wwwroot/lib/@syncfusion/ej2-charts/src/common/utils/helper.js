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
import { Animation, compile as templateComplier, Browser } from '@syncfusion/ej2-base';
import { merge, extend, isNullOrUndefined, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
import { VisibleLabels } from '../../chart/axis/axis';
import { axisLabelRender, regSub } from '../model/constants';
import { measureText, findDirection, Rect, TextOption, Size, PathOption, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
/**
 * Function to sort the dataSource, by default it sort the data in ascending order.
 * @param  {Object} data
 * @param  {string} fields
 * @param  {boolean} isDescending
 * @returns Object
 */
export function sort(data, fields, isDescending) {
    var sortData = extend([], data, null);
    sortData.sort(function (a, b) {
        var first = 0;
        var second = 0;
        for (var i = 0; i < fields.length; i++) {
            first += a[fields[i]];
            second += b[fields[i]];
        }
        if ((!isDescending && first < second) || (isDescending && first > second)) {
            return -1;
        }
        else if (first === second) {
            return 0;
        }
        return 1;
    });
    return sortData;
}
/** @private */
export function isBreakLabel(label) {
    return label.indexOf('<br>') !== -1;
}
export function getVisiblePoints(series) {
    var points = extend([], series.points, null, true);
    var tempPoints = [];
    var tempPoint;
    var pointIndex = 0;
    for (var i = 0; i < points.length; i++) {
        tempPoint = points[i];
        if (isNullOrUndefined(tempPoint.x) || tempPoint.x === '') {
            continue;
        }
        else {
            tempPoint.index = pointIndex++;
            tempPoints.push(tempPoint);
        }
    }
    return tempPoints;
}
/** @private */
export function rotateTextSize(font, text, angle, chart) {
    var renderer = new SvgRenderer(chart.element.id);
    var box;
    var options;
    var htmlObject;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    htmlObject = renderer.createText(options, text);
    if (!chart.delayRedraw && !chart.redraw) {
        chart.element.appendChild(chart.svgObject);
    }
    chart.svgObject.appendChild(htmlObject);
    box = htmlObject.getBoundingClientRect();
    remove(htmlObject);
    if (!chart.delayRedraw && !chart.redraw) {
        remove(chart.svgObject);
    }
    return new Size((box.right - box.left), (box.bottom - box.top));
}
/** @private */
export function removeElement(id) {
    if (!id) {
        return null;
    }
    var element = typeof id === 'string' ? getElement(id) : id;
    if (element) {
        remove(element);
    }
}
/** @private */
export function logBase(value, base) {
    return Math.log(value) / Math.log(base);
}
/** @private */
export function showTooltip(text, x, y, areaWidth, id, element, isTouch) {
    //let id1: string = 'EJ2_legend_tooltip';
    var tooltip = document.getElementById(id);
    var width = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width + 5;
    x = (x + width > areaWidth) ? x - (width + 15) : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        element.appendChild(tooltip);
        var left = parseInt(tooltip.style.left.replace('px', ''), 10);
        if (left < 0) {
            tooltip.style.left = '0px';
        }
    }
    else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (isTouch) {
        setTimeout(function () { removeElement(id); }, 1500);
    }
}
/** @private */
export function inside(value, range) {
    return (value < range.max) && (value > range.min);
}
/** @private */
export function withIn(value, range) {
    return (value <= range.max) && (value >= range.min);
}
/** @private */
export function logWithIn(value, axis) {
    if (axis.valueType === 'Logarithmic') {
        value = logBase(value, axis.logBase);
    }
    else {
        value = value;
    }
    return value;
}
/** @private */
export function withInRange(previousPoint, currentPoint, nextPoint, series) {
    var mX2 = logWithIn(currentPoint.xValue, series.xAxis);
    var mX1 = previousPoint ? logWithIn(previousPoint.xValue, series.xAxis) : mX2;
    var mX3 = nextPoint ? logWithIn(nextPoint.xValue, series.xAxis) : mX2;
    var xStart = Math.floor(series.xAxis.visibleRange.min);
    var xEnd = Math.ceil(series.xAxis.visibleRange.max);
    return ((mX1 >= xStart && mX1 <= xEnd) || (mX2 >= xStart && mX2 <= xEnd) ||
        (mX3 >= xStart && mX3 <= xEnd) || (xStart >= mX1 && xStart <= mX3));
}
/** @private */
export function sum(values) {
    var sum = 0;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        sum += value;
    }
    return sum;
}
/** @private */
export function subArraySum(values, first, last, index, series) {
    var sum = 0;
    if (index !== null) {
        for (var i = (first + 1); i < last; i++) {
            if (index.indexOf(i) === -1) {
                sum += values[i][series.yName];
            }
        }
    }
    else {
        for (var i = (first + 1); i < last; i++) {
            if (!isNullOrUndefined(values[i][series.yName])) {
                sum += values[i][series.yName];
            }
        }
    }
    return sum;
}
/** @private */
export function subtractThickness(rect, thickness) {
    rect.x += thickness.left;
    rect.y += thickness.top;
    rect.width -= thickness.left + thickness.right;
    rect.height -= thickness.top + thickness.bottom;
    return rect;
}
/** @private */
export function subtractRect(rect, thickness) {
    rect.x += thickness.x;
    rect.y += thickness.y;
    rect.width -= thickness.x + thickness.width;
    rect.height -= thickness.y + thickness.height;
    return rect;
}
/** @private */
export function degreeToLocation(degree, radius, center) {
    var radian = (degree * Math.PI) / 180;
    return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/** @private */
export function degreeToRadian(degree) {
    return degree * (Math.PI / 180);
}
/** @private */
export function getRotatedRectangleCoordinates(actualPoints, centerX, centerY, angle) {
    var coordinatesAfterRotation = [];
    for (var i = 0; i < 4; i++) {
        var point = actualPoints[i];
        // translate point to origin
        var tempX = point.x - centerX;
        var tempY = point.y - centerY;
        // now apply rotation
        var rotatedX = tempX * Math.cos(degreeToRadian(angle)) - tempY * Math.sin(degreeToRadian(angle));
        var rotatedY = tempX * Math.sin(degreeToRadian(angle)) + tempY * Math.cos(degreeToRadian(angle));
        // translate back
        point.x = rotatedX + centerX;
        point.y = rotatedY + centerY;
        coordinatesAfterRotation.push(new ChartLocation(point.x, point.y));
    }
    return coordinatesAfterRotation;
}
/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
export function isRotatedRectIntersect(a, b) {
    var polygons = [a, b];
    var minA;
    var maxA;
    var projected;
    var i;
    var i1;
    var j;
    var minB;
    var maxB;
    for (i = 0; i < polygons.length; i++) {
        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];
            // find the line perpendicular to this edge
            var normal = new ChartLocation(p2.y - p1.y, p1.x - p2.x);
            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isNullOrUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isNullOrUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }
            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isNullOrUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isNullOrUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }
            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
}
function getAccumulationLegend(locX, locY, r, height, width, mode) {
    var cartesianlarge = degreeToLocation(270, r, new ChartLocation(locX, locY));
    var cartesiansmall = degreeToLocation(270, r, new ChartLocation(locX + (width / 10), locY));
    return 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + ' ' + (locX + r) + ' ' + (locY) + ' ' + 'A' + ' ' + (r) + ' ' + (r) +
        ' ' + 0 + ' ' + 1 + ' ' + 1 + ' ' + cartesianlarge.x + ' ' + cartesianlarge.y + ' ' + 'Z' + ' ' + 'M' + ' ' + (locX +
        (width / 10)) + ' ' + (locY - (height / 10)) + ' ' + 'L' + (locX + (r)) + ' ' + (locY - height / 10) + ' ' + 'A' + ' '
        + (r) + ' ' + (r) + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + cartesiansmall.x + ' ' + cartesiansmall.y + ' ' + 'Z';
}
/** @private */
export function getAngle(center, point) {
    var angle = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = angle < 0 ? (6.283 + angle) : angle;
    return angle * (180 / Math.PI);
}
/** @private */
export function subArray(values, index) {
    var subArray = [];
    for (var i = 0; i <= index - 1; i++) {
        subArray.push(values[i]);
    }
    return subArray;
}
/** @private */
export function valueToCoefficient(value, axis) {
    var range = axis.visibleRange;
    var result = (value - range.min) / (range.delta);
    return axis.isInversed ? (1 - result) : result;
}
/** @private */
export function TransformToVisible(x, y, xAxis, yAxis, isInverted, series) {
    x = (xAxis.valueType === 'Logarithmic' ? logBase(x > 1 ? x : 1, xAxis.logBase) : x);
    y = (yAxis.valueType === 'Logarithmic' ?
        logBase(y > 1 ? y : 1, yAxis.logBase) : y);
    x += xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks' && series.type !== 'Radar' ? 0.5 : 0;
    var radius = series.chart.radius * valueToCoefficient(y, yAxis);
    var point = CoefficientToVector(valueToPolarCoefficient(x, xAxis), series.chart.primaryXAxis.startAngle);
    return {
        x: (series.clipRect.width / 2 + series.clipRect.x) + radius * point.x,
        y: (series.clipRect.height / 2 + series.clipRect.y) + radius * point.y
    };
}
/**
 * method to find series, point index by element id
 * @private
 */
export function indexFinder(id, isPoint) {
    if (isPoint === void 0) { isPoint = false; }
    var ids = ['NaN', 'NaN'];
    if (id.indexOf('_Point_') > -1) {
        ids = id.split('_Series_')[1].split('_Point_');
    }
    else if (id.indexOf('_shape_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_shape_');
        ids[0] = '0';
    }
    else if (id.indexOf('_text_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_text_');
        ids[0] = '0';
    }
    return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
}
/** @private */
export function CoefficientToVector(coefficient, startAngle) {
    startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
    var angle = Math.PI * (1.5 - 2 * coefficient);
    angle = angle + (startAngle * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
}
/** @private */
export function valueToPolarCoefficient(value, axis) {
    var range = axis.visibleRange;
    var delta;
    var length;
    if (axis.valueType !== 'Category') {
        delta = (range.max - (axis.valueType === 'DateTime' ? axis.dateTimeInterval : range.interval)) - range.min;
        length = axis.visibleLabels.length - 1;
        delta = delta === 0 ? 1 : delta;
    }
    else {
        // To split an interval equally based on visible labels count
        delta = axis.visibleLabels.length === 1 ? 1 :
            (axis.visibleLabels[axis.visibleLabels.length - 1].value - axis.visibleLabels[0].value);
        length = axis.visibleLabels.length;
    }
    return axis.isInversed ? ((value - range.min) / delta) * (1 - 1 / (length)) :
        1 - ((value - range.min) / delta) * (1 - 1 / (length));
}
/** @private */
var Mean = /** @class */ (function () {
    function Mean(verticalStandardMean, verticalSquareRoot, horizontalStandardMean, horizontalSquareRoot, verticalMean, horizontalMean) {
        this.verticalStandardMean = verticalStandardMean;
        this.horizontalStandardMean = horizontalStandardMean;
        this.verticalSquareRoot = verticalSquareRoot;
        this.horizontalSquareRoot = horizontalSquareRoot;
        this.verticalMean = verticalMean;
        this.horizontalMean = horizontalMean;
    }
    return Mean;
}());
export { Mean };
/** @private */
var PolarArc = /** @class */ (function () {
    function PolarArc(startAngle, endAngle, innerRadius, radius, currentXPosition) {
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.innerRadius = innerRadius;
        this.radius = radius;
        this.currentXPosition = currentXPosition;
    }
    return PolarArc;
}());
export { PolarArc };
/** @private */
export function createTooltip(id, text, top, left, fontSize) {
    var tooltip = getElement(id);
    var style = 'top:' + top.toString() + 'px;' +
        'left:' + left.toString() + 'px;' +
        'color:black !important; ' +
        'background:#FFFFFF !important; ' +
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px; z-index:1';
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
        });
        document.body.appendChild(tooltip);
    }
    else {
        tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
        tooltip.setAttribute('styles', style);
    }
}
/** @private */
export function createZoomingLabels(chart, axis, parent, index, isVertical, rect) {
    var margin = 5;
    var opposedPosition = axis.opposedPosition;
    var anchor = isVertical ? 'start' : 'auto';
    var size;
    var chartRect = chart.availableSize.width;
    var x;
    var y;
    var rx = 3;
    var arrowLocation;
    var direction;
    var scrollBarHeight = axis.scrollbarSettings.enable || (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject)
        ? axis.scrollBarHeight : 0;
    for (var i = 0; i < 2; i++) {
        size = measureText(i ? axis.endLabel : axis.startLabel, axis.labelStyle);
        if (isVertical) {
            arrowLocation = i ? new ChartLocation(rect.x - scrollBarHeight, rect.y + rx) :
                new ChartLocation(axis.rect.x - scrollBarHeight, (rect.y + rect.height - rx));
            x = (rect.x + (opposedPosition ? (rect.width + margin + scrollBarHeight) : -(size.width + margin + margin + scrollBarHeight)));
            y = (rect.y + (i ? 0 : rect.height - size.height - margin));
            x += (x < 0 || ((chartRect) < (x + size.width + margin))) ? (opposedPosition ? -(size.width / 2) : size.width / 2) : 0;
            direction = findDirection(rx, rx, new Rect(x, y, size.width + margin, size.height + margin), arrowLocation, margin, false, false, !opposedPosition, arrowLocation.x, arrowLocation.y + (i ? -rx : rx));
        }
        else {
            arrowLocation = i ? new ChartLocation((rect.x + rect.width - rx), (rect.y + rect.height + scrollBarHeight)) :
                new ChartLocation(rect.x + rx, (rect.y + rect.height + scrollBarHeight));
            x = (rect.x + (i ? (rect.width - size.width - margin) : 0));
            y = (opposedPosition ? (rect.y - size.height - 10 - scrollBarHeight) : (rect.y + rect.height + margin + scrollBarHeight));
            direction = findDirection(rx, rx, new Rect(x, y, size.width + margin, size.height + margin), arrowLocation, margin, opposedPosition, !opposedPosition, false, arrowLocation.x + (i ? rx : -rx), arrowLocation.y);
        }
        x = x + (margin / 2);
        y = y + (3 * (size.height / 4)) + (margin / 2);
        parent.appendChild(chart.renderer.drawPath(new PathOption(chart.element.id + '_Zoom_' + index + '_AxisLabel_Shape_' + i, chart.themeStyle.crosshairFill, 2, chart.themeStyle.crosshairFill, 1, null, direction)));
        textElement(chart.renderer, new TextOption(chart.element.id + '_Zoom_' + index + '_AxisLabel_' + i, x, y, anchor, i ? axis.endLabel : axis.startLabel), { color: chart.themeStyle.crosshairLabel, fontFamily: 'Segoe UI', fontWeight: 'Regular', size: '11px' }, chart.themeStyle.crosshairLabel, parent);
    }
    return parent;
}
//Within bounds
/** @private */
export function withInBounds(x, y, bounds, width, height) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = 0; }
    return (x >= bounds.x - width && x <= bounds.x + bounds.width + width && y >= bounds.y - height
        && y <= bounds.y + bounds.height + height);
}
/** @private */
export function getValueXByPoint(value, size, axis) {
    var actualValue = !axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/** @private */
export function getValueYByPoint(value, size, axis) {
    var actualValue = axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/** @private */
export function findClipRect(series) {
    var rect = series.clipRect;
    if (series.chart.requireInvertedAxis) {
        rect.x = series.yAxis.rect.x;
        rect.y = series.xAxis.rect.y;
        rect.width = series.yAxis.rect.width;
        rect.height = series.xAxis.rect.height;
    }
    else {
        rect.x = series.xAxis.rect.x;
        rect.y = series.yAxis.rect.y;
        rect.width = series.xAxis.rect.width;
        rect.height = series.yAxis.rect.height;
    }
}
/** @private */
export function firstToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
/** @private */
export function getTransform(xAxis, yAxis, invertedAxis) {
    var x;
    var y;
    var width;
    var height;
    if (invertedAxis) {
        x = yAxis.rect.x;
        y = xAxis.rect.y;
        width = yAxis.rect.width;
        height = xAxis.rect.height;
    }
    else {
        x = xAxis.rect.x;
        y = yAxis.rect.y;
        width = xAxis.rect.width;
        height = yAxis.rect.height;
    }
    return new Rect(x, y, width, height);
}
/** @private */
export function getMinPointsDelta(axis, seriesCollection) {
    var minDelta = Number.MAX_VALUE;
    var xValues;
    var minVal;
    var seriesMin;
    for (var index = 0; index < seriesCollection.length; index++) {
        var series = seriesCollection[index];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null)
                || (axis.name === series.chart.primaryXAxis.name && !series.xAxisName))) {
            xValues = series.points.map(function (point, index) {
                return point.xValue;
            });
            xValues.sort(function (first, second) { return first - second; });
            if (xValues.length === 1) {
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - 2592000000) : series.xMin;
                minVal = xValues[0] - (!isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            }
            else {
                for (var index_1 = 0; index_1 < xValues.length; index_1++) {
                    var value = xValues[index_1];
                    if (index_1 > 0 && value) {
                        minVal = value - xValues[index_1 - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                }
            }
        }
    }
    if (minDelta === Number.MAX_VALUE) {
        minDelta = 1;
    }
    return minDelta;
}
/** @private */
export function getAnimationFunction(effect) {
    var functionName;
    switch (effect) {
        case 'Linear':
            functionName = linear;
            break;
    }
    return functionName;
}
/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
export function linear(currentTime, startValue, endValue, duration) {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
/**
 * Animation Effect Calculation End
 * @private
 */
export function markerAnimate(element, delay, duration, series, pointIndex, point, isLabel) {
    var centerX = point.x;
    var centerY = point.y;
    var height = 0;
    element.style.visibility = 'hidden';
    new Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        progress: function (args) {
            if (args.timeStamp > args.delay) {
                args.element.style.visibility = 'visible';
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate(' + centerX
                    + ' ' + centerY + ') scale(' + height + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
            }
        },
        end: function (model) {
            element.style.visibility = '';
            if ((series.type === 'Scatter' || series.type === 'Bubble') && !isLabel && (pointIndex === series.points.length - 1)) {
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        }
    });
}
/**
 * Animate the rect element
 */
export function animateRectElement(element, delay, duration, currentRect, previousRect) {
    var setStyle = function (rect) {
        element.setAttribute('x', rect.x + '');
        element.setAttribute('y', rect.y + '');
        element.setAttribute('width', rect.width + '');
        element.setAttribute('height', rect.height + '');
    };
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        delay: delay,
        name: name,
        progress: function (args) {
            setStyle(new Rect(linear(args.timeStamp, previousRect.x, currentRect.x - previousRect.x, args.duration), linear(args.timeStamp, previousRect.y, currentRect.y - previousRect.y, args.duration), linear(args.timeStamp, previousRect.width, currentRect.width - previousRect.width, args.duration), linear(args.timeStamp, previousRect.height, currentRect.height - previousRect.height, args.duration)));
        },
        end: function () {
            setStyle(currentRect);
        },
    });
}
/**
 * Animation after legend click a path
 * @param element element to be animated
 * @param direction current direction of the path
 * @param previousDirection previous direction of the path
 */
export function pathAnimation(element, direction, redraw, previousDirection, animateDuration) {
    if (!redraw || (!previousDirection && !element)) {
        return null;
    }
    var duration = 300;
    if (animateDuration) {
        duration = animateDuration;
    }
    var startDirections = previousDirection || element.getAttribute('d');
    var splitDirections = startDirections.split(/(?=[LMCZAQ])/);
    var endDirections = direction.split(/(?=[LMCZAQ])/);
    var currentDireciton;
    var startPath = [];
    var endPath = [];
    var c;
    var end;
    element.setAttribute('d', startDirections);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: function (args) {
            currentDireciton = '';
            splitDirections.map(function (directions, index) {
                startPath = directions.split(' ');
                endPath = endDirections[index] ? endDirections[index].split(' ') : startPath;
                if (startPath[0] === 'Z') {
                    currentDireciton += 'Z' + ' ';
                }
                else {
                    currentDireciton += startPath[0] + ' ' +
                        linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                }
                if (startPath[0] === 'C' || startPath[0] === 'Q') {
                    c = 3;
                    end = startPath[0] === 'Q' ? 4 : 6;
                    while (c < end) {
                        currentDireciton += linear(args.timeStamp, +startPath[c], (+endPath[c] - +startPath[c]), args.duration) + ' ' +
                            linear(args.timeStamp, +startPath[++c], (+endPath[c] - +startPath[c]), args.duration) + ' ';
                        ++c;
                    }
                }
                if (startPath[0] === 'A') {
                    currentDireciton += 0 + ' ' + 0 + ' ' + 1 + ' ' +
                        linear(args.timeStamp, +startPath[6], (+endPath[6] - +startPath[6]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[7], (+endPath[7] - +startPath[7]), args.duration) + ' ';
                }
            });
            element.setAttribute('d', currentDireciton);
        },
        end: function () {
            element.setAttribute('d', direction);
        }
    });
}
/**
 * To append the clip rect element
 * @param redraw
 * @param options
 * @param renderer
 * @param clipPath
 */
export function appendClipElement(redraw, options, renderer, clipPath) {
    if (clipPath === void 0) { clipPath = 'drawClipPath'; }
    var clipElement = redrawElement(redraw, options.id, options, renderer);
    if (clipElement) {
        var def = renderer.createDefs();
        def.appendChild(clipElement);
        return def;
    }
    else {
        return renderer[clipPath](options);
    }
}
/**
 * Triggers the event.
 * @return {void}
 * @private
 */
export function triggerLabelRender(chart, tempInterval, text, labelStyle, axis) {
    var argsData;
    argsData = {
        cancel: false, name: axisLabelRender, axis: axis,
        text: text, value: tempInterval, labelStyle: labelStyle
    };
    chart.trigger(axisLabelRender, argsData);
    if (!argsData.cancel) {
        var isLineBreakLabels = argsData.text.indexOf('<br>') !== -1;
        var text_1 = (axis.enableTrim) ? (isLineBreakLabels ?
            lineBreakLabelTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle) :
            textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle)) : argsData.text;
        axis.visibleLabels.push(new VisibleLabels(text_1, argsData.value, argsData.labelStyle, argsData.text));
    }
}
/**
 * The function used to find whether the range is set.
 * @return {boolean}
 * @private
 */
export function setRange(axis) {
    return (axis.minimum != null && axis.maximum != null);
}
/**
 * Calculate desired interval for the axis.
 * @return {void}
 * @private
 */
export function getActualDesiredIntervalsCount(availableSize, axis) {
    var size = axis.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
    if (isNullOrUndefined(axis.desiredIntervals)) {
        var desiredIntervalsCount = (axis.orientation === 'Horizontal' ? 0.533 : 1) * axis.maximumLabels;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    }
    else {
        return axis.desiredIntervals;
    }
}
/**
 * Animation for template
 * @private
 */
export function templateAnimate(element, delay, duration, name, isRemove) {
    new Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        name: name,
        progress: function (args) {
            args.element.style.visibility = 'visible';
        },
        end: function (args) {
            if (isRemove) {
                remove(args.element);
            }
            else {
                args.element.style.visibility = 'visible';
            }
        },
    });
}
/** @private */
export function drawSymbol(location, shape, size, url, options, label, renderer, clipRect, isChartControl, control) {
    var chartRenderer = renderer ? renderer : new SvgRenderer('');
    var shapeOption = calculateShapes(location, size, shape, options, url, isChartControl, control);
    var drawElement = chartRenderer['draw' + shapeOption.functionName](shapeOption.renderOption, clipRect ? new Int32Array([clipRect.x, clipRect.y]) : null);
    //drawElement.setAttribute('aria-label', label);
    return drawElement;
}
/** @private */
// tslint:disable-next-line:max-func-body-length
export function calculateShapes(location, size, shape, options, url, isChart, control) {
    var dir;
    var functionName = 'Path';
    var isBulletChart = isChart;
    var width = (isBulletChart && shape === 'Circle') ? (size.width - 2) : size.width;
    var height = (isBulletChart && shape === 'Circle') ? (size.height - 2) : size.height;
    var sizeBullet = (isBulletChart) ? control.targetWidth : 0;
    var lx = location.x;
    var ly = location.y;
    var y = location.y + (-height / 2);
    var x = location.x + (-width / 2);
    switch (shape) {
        case 'Bubble':
        case 'Circle':
            functionName = 'Ellipse';
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': lx, 'cy': ly });
            break;
        case 'Cross':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' +
                (ly + (-height / 2));
            merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'Multiply':
            dir = 'M ' + (lx - sizeBullet) + ' ' + (ly - sizeBullet) + ' L ' +
                (lx + sizeBullet) + ' ' + (ly + sizeBullet) + ' M ' +
                (lx - sizeBullet) + ' ' + (ly + sizeBullet) + ' L ' + (lx + sizeBullet) + ' ' + (ly - sizeBullet);
            merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'HorizontalLine':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly;
            merge(options, { 'd': dir });
            break;
        case 'VerticalLine':
            dir = 'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' + (ly + (-height / 2));
            merge(options, { 'd': dir });
            break;
        case 'Diamond':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + ly + ' z';
            merge(options, { 'd': dir });
            break;
        case 'ActualRect':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 8)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'TargetRect':
            dir = 'M' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Rectangle':
        case 'Hilo':
        case 'HiloOpenClose':
        case 'Candle':
        case 'Waterfall':
        case 'BoxAndWhisker':
        case 'StepArea':
        case 'StackingStepArea':
        case 'Square':
        case 'Flag':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Pyramid':
        case 'Triangle':
            dir = 'M' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Funnel':
        case 'InvertedTriangle':
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx - (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Pentagon':
            var eq = 72;
            var xVal = void 0;
            var yVal = void 0;
            for (var i = 0; i <= 5; i++) {
                xVal = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yVal = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    dir = 'M' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ';
                }
                else {
                    dir = dir.concat('L' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ');
                }
            }
            dir = dir.concat('Z');
            merge(options, { 'd': dir });
            break;
        case 'Image':
            functionName = 'Image';
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    options = calculateLegendShapes(location, new Size(width, height), shape, options).renderOption;
    return { renderOption: options, functionName: functionName };
}
/** @private */
export function getRectLocation(startLocation, endLocation, outerRect) {
    var x;
    var y;
    x = (endLocation.x < outerRect.x) ? outerRect.x :
        (endLocation.x > (outerRect.x + outerRect.width)) ? outerRect.x + outerRect.width : endLocation.x;
    y = (endLocation.y < outerRect.y) ? outerRect.y :
        (endLocation.y > (outerRect.y + outerRect.height)) ? outerRect.y + outerRect.height : endLocation.y;
    return new Rect((x > startLocation.x ? startLocation.x : x), (y > startLocation.y ? startLocation.y : y), Math.abs(x - startLocation.x), Math.abs(y - startLocation.y));
}
/** @private */
export function minMax(value, min, max) {
    return value > max ? max : (value < min ? min : value);
}
/** @private */
export function getElement(id) {
    return document.getElementById(id);
}
/** @private */
export function getTemplateFunction(template) {
    var templateFn = null;
    var e;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        }
    }
    catch (e) {
        templateFn = templateComplier(template);
    }
    return templateFn;
}
/** @private */
export function createTemplate(childElement, pointIndex, content, chart, point, series, dataLabelId) {
    var templateFn;
    var templateElement;
    templateFn = getTemplateFunction(content);
    try {
        var blazor = 'Blazor';
        var tempObject = window[blazor] ? (dataLabelId ? point : { point: point }) : { chart: chart, series: series, point: point };
        var elementData = templateFn ? templateFn(tempObject, null, null, dataLabelId ||
            childElement.id.replace(/[^a-zA-Z0-9]/g, '')) : [];
        if (elementData.length) {
            templateElement = Array.prototype.slice.call(elementData);
            var len = templateElement.length;
            for (var i = 0; i < len; i++) {
                childElement.appendChild(templateElement[i]);
            }
        }
    }
    catch (e) {
        return childElement;
    }
    return childElement;
}
/** @private */
export function getFontStyle(font) {
    var style = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/** @private */
export function measureElementRect(element, redraw) {
    if (redraw === void 0) { redraw = false; }
    var bounds;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    if (redraw) {
        remove(element);
    }
    else {
        removeElement(element.id);
    }
    return bounds;
}
/** @private */
export function findlElement(elements, id) {
    var element;
    for (var i = 0, length_1 = elements.length; i < length_1; i++) {
        if (elements[i].id.indexOf(id) > -1) {
            element = elements[i];
            continue;
        }
    }
    return element;
}
/** @private */
export function getPoint(x, y, xAxis, yAxis, isInverted, series) {
    x = ((xAxis.valueType === 'Logarithmic') ? logBase(((x > 0) ? x : 1), xAxis.logBase) : x);
    y = ((yAxis.valueType === 'Logarithmic') ? logBase(((y > 0) ? y : 1), yAxis.logBase) : y);
    x = valueToCoefficient(x, xAxis);
    y = valueToCoefficient(y, yAxis);
    var xLength = (isInverted ? xAxis.rect.height : xAxis.rect.width);
    var yLength = (isInverted ? yAxis.rect.width : yAxis.rect.height);
    var locationX = isInverted ? y * (yLength) : x * (xLength);
    var locationY = isInverted ? (1 - x) * (xLength) : (1 - y) * (yLength);
    return new ChartLocation(locationX, locationY);
}
/** @private */
export function appendElement(child, parent, redraw, animate, x, y) {
    if (redraw === void 0) { redraw = false; }
    if (animate === void 0) { animate = false; }
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    if (child && child.hasChildNodes() && parent) {
        appendChildElement(false, parent, child, redraw, animate, x, y);
    }
    else {
        return null;
    }
}
/**
 * Method to append child element
 * @param parent
 * @param childElement
 * @param isReplace
 */
export function appendChildElement(isCanvas, parent, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, previousRect, animateDuration) {
    if (isAnimate === void 0) { isAnimate = false; }
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    if (forceAnimate === void 0) { forceAnimate = false; }
    if (isRect === void 0) { isRect = false; }
    if (previousRect === void 0) { previousRect = null; }
    if (isCanvas) {
        return null;
    }
    var existChild = parent.querySelector('#' + childElement.id);
    var element = (existChild || getElement(childElement.id));
    var child = childElement;
    var duration = animateDuration ? animateDuration : 300;
    if (redraw && isAnimate && element) {
        start = start || (element.tagName === 'DIV' ?
            new ChartLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
            new ChartLocation(+element.getAttribute(x), +element.getAttribute(y)));
        if (direction && direction !== 'undefined') {
            pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction, duration);
        }
        else if (isRect && previousRect) {
            animateRectElement(child, 0, duration, new Rect(+element.getAttribute('x'), +element.getAttribute('y'), +element.getAttribute('width'), +element.getAttribute('height')), previousRect);
        }
        else {
            var end = child.tagName === 'DIV' ?
                new ChartLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                new ChartLocation(+child.getAttribute(x), +child.getAttribute(y));
            animateRedrawElement(child, duration, start, end, x, y);
        }
    }
    else if (redraw && isAnimate && !element && forceAnimate) {
        templateAnimate(child, 0, 600, 'FadeIn');
    }
    if (existChild) {
        parent.replaceChild(child, element);
    }
    else {
        parent.appendChild(child);
    }
}
/** @private */
export function getDraggedRectLocation(x1, y1, x2, y2, outerRect) {
    var width = Math.abs(x1 - x2);
    var height = Math.abs(y1 - y2);
    var x = Math.max(checkBounds(Math.min(x1, x2), width, outerRect.x, outerRect.width), outerRect.x);
    var y = Math.max(checkBounds(Math.min(y1, y2), height, outerRect.y, outerRect.height), outerRect.y);
    return new Rect(x, y, Math.min(width, outerRect.width), Math.min(height, outerRect.height));
}
/** @private */
export function checkBounds(start, size, min, max) {
    if (start < min) {
        start = min;
    }
    else if ((start + size) > (max + min)) {
        start = (max + min) - size;
    }
    return start;
}
/** @private */
export function getLabelText(currentPoint, series, chart) {
    var labelFormat = series.yAxis.labelFormat;
    var text = [];
    var customLabelFormat = labelFormat.match('{value}') !== null;
    switch (series.seriesType) {
        case 'XY':
            /**
             * I255790
             * For Polar radar series, the dataLabel appears out of range when axis range is given for yaxis
             * Cause: Since symbol location for the points which did not lies in within range, lies outside of seriesRect.
             * Fix: DataLabel rendered after checking WithIn for the points
             */
            if (series.chart.chartAreaType === 'PolarRadar') {
                if (series.drawType.indexOf('Stacking') !== -1) {
                    if ((series.yAxis.valueType === 'Logarithmic' &&
                        logWithIn(series.stackedValues.endValues[currentPoint.index], series.yAxis)) ||
                        withIn(series.stackedValues.endValues[currentPoint.index], series.yAxis.visibleRange)) {
                        text.push(currentPoint.text || currentPoint.yValue.toString());
                    }
                }
                else {
                    if ((series.yAxis.valueType === 'Logarithmic' && logWithIn(currentPoint.yValue, series.yAxis)) ||
                        withIn(currentPoint.yValue, series.yAxis.visibleRange)) {
                        text.push(currentPoint.text || currentPoint.yValue.toString());
                    }
                }
            }
            else {
                text.push(currentPoint.text || currentPoint.yValue.toString());
            }
            break;
        case 'HighLow':
            text.push(currentPoint.text || Math.max(currentPoint.high, currentPoint.low).toString());
            text.push(currentPoint.text || Math.min(currentPoint.high, currentPoint.low).toString());
            break;
        case 'HighLowOpenClose':
            text.push(currentPoint.text || Math.max(currentPoint.high, currentPoint.low).toString());
            text.push(currentPoint.text || Math.min(currentPoint.high, currentPoint.low).toString());
            text.push(currentPoint.text || Math.max(currentPoint.open, currentPoint.close).toString());
            text.push(currentPoint.text || Math.min(currentPoint.open, currentPoint.close).toString());
            break;
        case 'BoxPlot':
            text.push(currentPoint.text || currentPoint.median.toString());
            text.push(currentPoint.text || currentPoint.maximum.toString());
            text.push(currentPoint.text || currentPoint.minimum.toString());
            text.push(currentPoint.text || currentPoint.upperQuartile.toString());
            text.push(currentPoint.text || currentPoint.lowerQuartile.toString());
            for (var _i = 0, _a = currentPoint.outliers; _i < _a.length; _i++) {
                var liers = _a[_i];
                text.push(currentPoint.text || liers.toString());
            }
            break;
    }
    if (labelFormat && !currentPoint.text) {
        series.yAxis.format = chart.intl.getNumberFormat({
            format: customLabelFormat ? '' : labelFormat,
            useGrouping: chart.useGroupingSeparator
        });
        for (var i = 0; i < text.length; i++) {
            text[i] = customLabelFormat ? labelFormat.replace('{value}', series.yAxis.format(parseFloat(text[i]))) :
                series.yAxis.format(parseFloat(text[i]));
        }
    }
    return text;
}
/** @private */
export function stopTimer(timer) {
    window.clearInterval(timer);
}
/** @private */
export function isCollide(rect, collections, clipRect) {
    var isCollide;
    var currentRect = new Rect(rect.x + clipRect.x, rect.y + clipRect.y, rect.width, rect.height);
    isCollide = collections.some(function (rect) {
        return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
            currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
    });
    return isCollide;
}
/** @private */
export function isOverlap(currentRect, rect) {
    return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
        currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
}
/** @private */
export function containsRect(currentRect, rect) {
    return (currentRect.x <= rect.x && currentRect.x + currentRect.width >= rect.x + rect.width &&
        currentRect.y <= rect.y && currentRect.height + currentRect.y >= rect.y + rect.height);
}
/** @private */
export function calculateRect(location, textSize, margin) {
    return new Rect((location.x - (textSize.width / 2) - margin.left), (location.y - (textSize.height / 2) - margin.top), textSize.width + margin.left + margin.right, textSize.height + margin.top + margin.bottom);
}
/** @private */
export function convertToHexCode(value) {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/** @private */
export function componentToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
export function convertHexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/** @private */
export function colorNameToHex(color) {
    var element;
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(createElement('text', { id: 'chartmeasuretext' }));
    element = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    remove(element);
    var exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    var isRGBValue = exp.exec(color);
    return convertToHexCode(new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
/** @private */
export function getSaturationColor(color, factor) {
    color = colorNameToHex(color);
    color = color.replace(/[^0-9a-f]/gi, '');
    if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    factor = factor || 0;
    // convert to decimal and change luminosity
    var rgb = '#';
    var colorCode;
    for (var i = 0; i < 3; i++) {
        colorCode = parseInt(color.substr(i * 2, 2), 16);
        colorCode = Math.round(Math.min(Math.max(0, colorCode + (colorCode * factor)), 255));
        rgb += ('00' + colorCode.toString(16)).substr(colorCode.toString(16).length);
    }
    return rgb;
}
/** @private */
export function getMedian(values) {
    var half = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : ((values[half - 1] + values[half]) / 2.0);
}
/** @private */
// tslint:disable-next-line:max-func-body-length
export function calculateLegendShapes(location, size, shape, options) {
    var padding = 10;
    var dir = '';
    var space = 2;
    var height = size.height;
    var width = size.width;
    var lx = location.x;
    var ly = location.y;
    switch (shape) {
        case 'MultiColoredLine':
        case 'Line':
        case 'StackingLine':
        case 'StackingLine100':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly);
            merge(options, { 'd': dir });
            break;
        case 'StepLine':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx + (-width / 2) - (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx +
                (-width / 2) + (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 2) + (width / 10))
                + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10)) + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10))
                + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' +
                ' ' + (lx + (width / 5)) + ' ' + (ly + (-height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly +
                (-height / 2)) + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + '' + (lx + (width / 2)
                + (padding / 4)) + ' ' + (ly + (height / 2));
            merge(options, { 'd': dir });
            break;
        case 'RightArrow':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (-width / 2)) + ' ' + (ly + (height / 2)) + ' L' + ' ' + (lx + (-width / 2)) + ' ' +
                (ly + (height / 2) - space) + ' ' + 'L' + ' ' + (lx + (width / 2) - (2 * space)) + ' ' + (ly) +
                ' L' + (lx + (-width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2) - space) + ' L' + ' ' + (lx + (-width / 2) + (2 * space))
                + ' ' + (ly) + ' L' + (lx + (width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'Column':
        case 'Pareto':
        case 'StackingColumn':
        case 'StackingColumn100':
        case 'RangeColumn':
        case 'Histogram':
            dir = 'M' + ' ' + (lx - 3 * (width / 5)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx - 3 *
                (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' +
                (lx + (-width / 10) - (width / 20)) + ' ' + (ly - (height / 4) - (padding / 2))
                + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly - (height / 4) -
                (padding / 2)) + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly
                + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 10) - (width / 20)) + ' ' + (ly +
                (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + 3 * (width / 5)) + ' ' + (ly) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
            dir = 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 5)) + ' '
                + 'L' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'L' + ' ' +
                (lx - (width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'Z' + ' '
                + 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - (height / 5)
                + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4)) + ' ' + (ly
                - (height / 5) + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4))
                + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'L' + ' ' + (lx - (width / 2)
                + (-padding / 4)) + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + (lx - (width / 2) + (-padding / 4)) + ' ' + (ly + (height / 5)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 5)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 2)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx - (width / 2) + (-padding / 4))
                + ' ' + (ly + (height / 2) + (padding / 10)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'Spline':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' '
                + lx + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5))
                + ' ' + 'M' + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx
                + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2));
            merge(options, { 'd': dir });
            break;
        case 'Area':
        case 'MultiColoredArea':
        case 'RangeArea':
        case 'StackingArea':
        case 'StackingArea100':
            dir = 'M' + ' ' + (lx - (width / 2) - (padding / 4)) + ' ' + (ly + (height / 2))
                + ' ' + 'L' + ' ' + (lx + (-width / 4) + (-padding / 8)) + ' ' + (ly - (height / 2))
                + ' ' + 'L' + ' ' + (lx) + ' ' + (ly + (height / 4)) + ' ' + 'L' + ' ' + (lx
                + (width / 4) + (padding / 8)) + ' ' + (ly + (-height / 2) + (height / 4)) + ' '
                + 'L' + ' ' + (lx + (height / 2) + (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'SplineArea':
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + lx
                + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx + (width / 2)) + ' '
                + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2)) + ' ' + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'Pie':
        case 'Doughnut':
            options.stroke = 'transparent';
            var r = Math.min(height, width) / 2;
            dir = getAccumulationLegend(lx, ly, r, height, width, shape);
            merge(options, { 'd': dir });
            break;
    }
    return { renderOption: options };
}
/** @private */
export function textTrim(maxWidth, text, font) {
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/**
 * To trim the line break label
 * @param maxWidth
 * @param text
 * @param font
 */
export function lineBreakLabelTrim(maxWidth, text, font) {
    var labelCollection = [];
    var breakLabels = text.split('<br>');
    for (var i = 0; i < breakLabels.length; i++) {
        text = breakLabels[i];
        var size = measureText(text, font).width;
        if (size > maxWidth) {
            var textLength = text.length;
            for (var i_1 = textLength - 1; i_1 >= 0; --i_1) {
                text = text.substring(0, i_1) + '...';
                size = measureText(text, font).width;
                if (size <= maxWidth) {
                    labelCollection.push(text);
                    break;
                }
            }
        }
        else {
            labelCollection.push(text);
        }
    }
    return labelCollection;
}
/** @private */
export function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
export function redrawElement(redraw, id, options, renderer) {
    if (!redraw) {
        return null;
    }
    var element = getElement(id);
    if (element && options) {
        renderer.setElementAttributes(options, element.tagName === 'clipPath' ? element.childNodes[0] : element);
    }
    return element;
}
/** @private */
export function animateRedrawElement(element, duration, start, end, x, y) {
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    var isDiv = element.tagName === 'DIV';
    var setStyle = function (xValue, yValue) {
        if (isDiv) {
            element.style[x] = xValue + 'px';
            element.style[y] = yValue + 'px';
        }
        else {
            element.setAttribute(x, xValue + '');
            element.setAttribute(y, yValue + '');
        }
    };
    setStyle(start.x, start.y);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: function (args) {
            setStyle(linear(args.timeStamp, start.x, end.x - start.x, args.duration), linear(args.timeStamp, start.y, end.y - start.y, args.duration));
        },
        end: function () {
            setStyle(end.x, end.y);
        }
    });
}
/** @private */
export function textElement(renderer, option, font, color, parent, isMinus, redraw, isAnimate, forceAnimate, animateDuration, seriesClipRect, labelSize, isRotatedLabelIntersect, isCanvas) {
    if (isMinus === void 0) { isMinus = false; }
    if (forceAnimate === void 0) { forceAnimate = false; }
    var renderOptions = {};
    var htmlObject;
    var tspanElement;
    //let renderer: SvgRenderer = new SvgRenderer('');
    var text;
    var height;
    var dy;
    var label;
    renderOptions = {
        'id': option.id,
        'x': option.x,
        'y': option.y,
        'fill': color ? color : 'black',
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': option.anchor,
        'labelRotation': option.labelRotation,
        'transform': option.transform,
        'opacity': font.opacity,
        'dominant-baseline': option.baseLine
    };
    text = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    htmlObject = renderer.createText(renderOptions, text, seriesClipRect ? seriesClipRect.x : 0, seriesClipRect ? seriesClipRect.y : 0);
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (var i = 1, len = option.text.length; i < len; i++) {
            height = (measureText(option.text[i], font).height);
            dy = (option.y) + ((isMinus) ? -(i * height) : (i * height));
            label = isMinus ? option.text[option.text.length - (i + 1)] : option.text[i];
            if (isCanvas) {
                tspanElement = renderer.createText(renderOptions, label, null, null, dy, true);
            }
            else {
                tspanElement = renderer.createTSpan({
                    'x': option.x, 'id': option.id,
                    'y': dy
                }, label);
                htmlObject.appendChild(tspanElement);
            }
        }
    }
    if (!isRotatedLabelIntersect) {
        appendChildElement(renderer instanceof CanvasRenderer, parent, htmlObject, redraw, isAnimate, 'x', 'y', null, null, forceAnimate, false, null, animateDuration);
    }
    return htmlObject;
}
/**
 * Method to calculate the width and height of the chart
 */
export function calculateSize(chart) {
    // fix for Chart rendered with default width in IE issue
    var containerWidth = chart.element.clientWidth || chart.element.offsetWidth;
    var containerHeight = chart.element.clientHeight;
    if (chart.stockChart) {
        containerWidth = chart.stockChart.element.clientWidth;
    }
    var height = 450;
    var marginHeight;
    if (chart.getModuleName() === 'rangeNavigator') {
        var range = chart;
        var tooltipSpace = range.tooltip.enable ? 35 : 0;
        var periodHeight = range.periodSelectorSettings.periods.length ?
            range.periodSelectorSettings.height : 0;
        marginHeight = range.margin.top + range.margin.bottom + tooltipSpace;
        var labelSize = measureText('tempString', range.labelStyle).height;
        var labelPadding = 15;
        height = (chart.series.length ? (Browser.isDevice ? 80 : 120) : ((range.enableGrouping ? (40 + labelPadding + labelSize) : 40)
            + marginHeight)) + periodHeight;
        if (range.disableRangeSelector) {
            height = periodHeight;
        }
    }
    chart.availableSize = new Size(stringToNumber(chart.width, containerWidth) || containerWidth || 600, stringToNumber(chart.height, containerHeight || height) || containerHeight || height);
}
export function createSvg(chart) {
    chart.canvasRender = new CanvasRenderer(chart.element.id);
    chart.renderer = chart.enableCanvas ? chart.canvasRender : new SvgRenderer(chart.element.id);
    calculateSize(chart);
    if (chart.stockChart && chart.getModuleName() === 'chart') {
        chart.svgObject = chart.stockChart.chartObject;
    }
    else if (chart.stockChart && chart.getModuleName() === 'rangeNavigator') {
        chart.svgObject = chart.stockChart.selectorObject;
    }
    else {
        if (chart.enableCanvas) {
            chart.svgObject = chart.renderer.createCanvas({
                id: chart.element.id + '_canvas',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        }
        else {
            chart.svgObject = chart.renderer.createSvg({
                id: chart.element.id + '_svg',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        }
    }
}
/**
 * To calculate chart title and height
 * @param title
 * @param style
 * @param width
 */
export function getTitle(title, style, width) {
    var titleCollection = [];
    switch (style.textOverflow) {
        case 'Wrap':
            titleCollection = textWrap(title, width, style);
            break;
        case 'Trim':
            titleCollection.push(textTrim(width, title, style));
            break;
        default:
            titleCollection.push(title);
            break;
    }
    return titleCollection;
}
/**
 * Method to calculate x position of title
 */
export function titlePositionX(rect, titleStyle) {
    var positionX;
    if (titleStyle.textAlignment === 'Near') {
        positionX = rect.x;
    }
    else if (titleStyle.textAlignment === 'Center') {
        positionX = rect.x + rect.width / 2;
    }
    else {
        positionX = rect.x + rect.width;
    }
    return positionX;
}
/**
 * Method to find new text and element size based on textOverflow
 */
export function textWrap(currentLabel, maximumWidth, font) {
    var textCollection = currentLabel.split(' ');
    var label = '';
    var labelCollection = [];
    var text;
    for (var i = 0, len = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (measureText(label.concat(text), font).width < maximumWidth) {
            label = label.concat((label === '' ? '' : ' ') + text);
        }
        else {
            if (label !== '') {
                labelCollection.push(textTrim(maximumWidth, label, font));
                label = text;
            }
            else {
                labelCollection.push(textTrim(maximumWidth, text, font));
                text = '';
            }
        }
        if (label && i === len - 1) {
            labelCollection.push(textTrim(maximumWidth, label, font));
        }
    }
    return labelCollection;
}
/**
 * Method to support the subscript and superscript value to text
 */
export function getUnicodeText(text, regexp) {
    var title = text.replace(regexp, ' ');
    var digit = text.match(regexp);
    var digitSpecific = ' ';
    var convertedText = ' ';
    var k = 0;
    var unicodeSub = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    var unicodeSup = {
        '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
        '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079'
    };
    for (var i = 0; i <= title.length - 1; i++) {
        if (title[i] === ' ') {
            digitSpecific = (regexp === regSub) ? digit[k].replace(/~/g, '') : digit[k].replace(/\^/g, '');
            for (var j = 0; j < digitSpecific.length; j++) {
                convertedText += (regexp === regSub) ? unicodeSub[digitSpecific[j]] : unicodeSup[digitSpecific[j]];
            }
            k++;
        }
        else {
            convertedText += title[i];
        }
    }
    return convertedText.trim();
}
/**
 * Method to reset the blazor templates
 */
export function blazorTemplatesReset(control) {
    for (var i = 0; i < control.annotations.length; i++) {
        resetBlazorTemplate((control.element.id + '_Annotation_' + i).replace(/[^a-zA-Z0-9]/g, ''), 'ContentTemplate');
    }
    //This reset the tooltip templates
    resetBlazorTemplate(control.element.id + '_tooltipparent_template' + '_blazorTemplate', 'Template');
    //Datalabel templates reset
    resetBlazorTemplate(control.element.id + '_DataLabel');
}
/** @private */
var CustomizeOption = /** @class */ (function () {
    function CustomizeOption(id) {
        this.id = id;
    }
    return CustomizeOption;
}());
export { CustomizeOption };
/** @private */
var StackValues = /** @class */ (function () {
    function StackValues(startValue, endValue) {
        this.startValues = startValue;
        this.endValues = endValue;
    }
    return StackValues;
}());
export { StackValues };
/** @private */
var RectOption = /** @class */ (function (_super) {
    __extends(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        _this.stroke = (border.width !== 0 && _this.stroke !== '') ? border.color : 'transparent';
        return _this;
    }
    return RectOption;
}(PathOption));
export { RectOption };
/** @private */
var ImageOption = /** @class */ (function () {
    function ImageOption(height, width, href, x, y, id, visibility, preserveAspectRatio) {
        this.height = height;
        this.width = width;
        this.href = href;
        this.x = x;
        this.y = y;
        this.id = id;
        this.visibility = visibility;
        this.preserveAspectRatio = preserveAspectRatio;
    }
    return ImageOption;
}());
export { ImageOption };
/** @private */
var CircleOption = /** @class */ (function (_super) {
    __extends(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        return _this;
    }
    return CircleOption;
}(PathOption));
export { CircleOption };
/** @private */
var PolygonOption = /** @class */ (function () {
    function PolygonOption(id, points, fill) {
        this.id = id;
        this.points = points;
        this.fill = fill;
    }
    return PolygonOption;
}());
export { PolygonOption };
/** @private */
var ChartLocation = /** @class */ (function () {
    function ChartLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return ChartLocation;
}());
export { ChartLocation };
/** @private */
var LabelLocation = /** @class */ (function () {
    function LabelLocation(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    return LabelLocation;
}());
export { LabelLocation };
/** @private */
var Thickness = /** @class */ (function () {
    function Thickness(left, right, top, bottom) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
    return Thickness;
}());
export { Thickness };
/** @private */
var ColorValue = /** @class */ (function () {
    function ColorValue(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return ColorValue;
}());
export { ColorValue };
/** @private */
var PointData = /** @class */ (function () {
    function PointData(point, series, index) {
        if (index === void 0) { index = 0; }
        this.point = point;
        this.series = series;
        this.lierIndex = index;
    }
    return PointData;
}());
export { PointData };
/** @private */
var AccPointData = /** @class */ (function () {
    function AccPointData(point, series, index) {
        if (index === void 0) { index = 0; }
        this.point = point;
        this.series = series;
    }
    return AccPointData;
}());
export { AccPointData };
/** @private */
var ControlPoints = /** @class */ (function () {
    function ControlPoints(controlPoint1, controlPoint2) {
        this.controlPoint1 = controlPoint1;
        this.controlPoint2 = controlPoint2;
    }
    return ControlPoints;
}());
export { ControlPoints };
