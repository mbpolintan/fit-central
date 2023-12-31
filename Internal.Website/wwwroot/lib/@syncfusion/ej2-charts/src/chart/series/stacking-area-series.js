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
import { getPoint, withInRange, TransformToVisible } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { LineBase } from './line-base';
/**
 * `StackingAreaSeries` module used to render the Stacking Area series.
 */
var StackingAreaSeries = /** @class */ (function (_super) {
    __extends(StackingAreaSeries, _super);
    function StackingAreaSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Render the Stacking area series.
     * @return {void}
     * @private
     */
    StackingAreaSeries.prototype.render = function (series, xAxis, yAxis, isInverted) {
        var polarAreaType = series.chart.chartAreaType === 'PolarRadar';
        var getCoordinate = polarAreaType ? TransformToVisible : getPoint;
        var lineDirection = '';
        var visiblePoints = this.enableComplexProperty(series);
        var pointsLength = visiblePoints.length;
        var stackedvalue = series.stackedValues;
        var origin = polarAreaType ?
            Math.max(series.yAxis.visibleRange.min, stackedvalue.endValues[0]) :
            Math.max(series.yAxis.visibleRange.min, stackedvalue.startValues[0]);
        var border = series.border;
        var options;
        var startPoint = 0;
        var point1;
        var point2;
        if (pointsLength > 0) {
            point1 = getCoordinate(visiblePoints[0].xValue, origin, xAxis, yAxis, isInverted, series);
            lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
        }
        var isPolar = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        for (var i = 0; i < pointsLength; i++) {
            visiblePoints[i].symbolLocations = [];
            visiblePoints[i].regions = [];
            if (visiblePoints[i].visible && withInRange(visiblePoints[i - 1], visiblePoints[i], visiblePoints[i + 1], series)) {
                point1 = getCoordinate(visiblePoints[i].xValue, stackedvalue.endValues[i], xAxis, yAxis, isInverted, series);
                lineDirection = lineDirection.concat('L' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                visiblePoints[i].symbolLocations.push(getCoordinate(visiblePoints[i].xValue, stackedvalue.endValues[i], xAxis, yAxis, isInverted, series));
                visiblePoints[i].regions.push(new Rect(visiblePoints[i].symbolLocations[0].x - series.marker.width, visiblePoints[i].symbolLocations[0].y - series.marker.height, 2 * series.marker.width, 2 * series.marker.height));
            }
            else {
                if (!isPolar && series.emptyPointSettings.mode !== 'Drop') {
                    for (var j = i - 1; j >= startPoint; j--) {
                        point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                        lineDirection = lineDirection.concat('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                    }
                    if (visiblePoints[i + 1] && (visiblePoints[i + 1].visible &&
                        (!isPolar || (isPolar && this.withinYRange(visiblePoints[i + 1], yAxis))))) {
                        point1 = getCoordinate(visiblePoints[i + 1].xValue, stackedvalue.startValues[i + 1], xAxis, yAxis, isInverted, series);
                        lineDirection = lineDirection.concat('M' + ' ' + (point1.x) + ' ' + (point1.y) + ' ');
                    }
                    startPoint = i + 1;
                }
            }
        }
        if (series.chart.chartAreaType === 'PolarRadar' && visiblePoints.length > 1) {
            var connectPoints = this.getFirstLastVisiblePoint(series.points);
            var chart = this.chart;
            point1 = { 'x': connectPoints.first.xValue, 'y': stackedvalue.endValues[connectPoints.first.index] };
            point2 = getCoordinate(point1.x, point1.y, xAxis, yAxis, isInverted, series);
            lineDirection += ('L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
            if (this.chart.visible === 1 && (xAxis.isInversed || yAxis.isInversed)) {
                this.chart.enableAnimation = false;
                lineDirection = (series.type === 'Polar' ? chart.polarSeriesModule.getPolarIsInversedPath(xAxis, lineDirection) :
                    chart.radarSeriesModule.getRadarIsInversedPath(xAxis, lineDirection));
            }
        }
        if (!isPolar || (isPolar && series.index !== this.getFirstSeriesIndex(series.chart.visibleSeries))) {
            for (var j = pointsLength - 1; j >= startPoint; j--) {
                if (isPolar && !visiblePoints[j].visible) {
                    continue;
                }
                var previousSeries = this.getPreviousSeries(series);
                if (previousSeries.emptyPointSettings.mode !== 'Drop' || !previousSeries.points[j].isEmpty) {
                    point2 = getCoordinate(visiblePoints[j].xValue, stackedvalue.startValues[j], xAxis, yAxis, isInverted, series);
                    lineDirection = lineDirection.concat(((j === (pointsLength - 1) && polarAreaType) ? 'M' : 'L')
                        + ' ' + (point2.x) + ' ' + (point2.y) + ' ');
                }
            }
        }
        options = new PathOption(series.chart.element.id + '_Series_' + series.index, series.interior, series.border.width, series.border.color, series.opacity, series.dashArray, lineDirection);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    };
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    StackingAreaSeries.prototype.doAnimation = function (series) {
        var option = series.animation;
        this.doLinearAnimation(series, option);
    };
    /**
     * To destroy the stacking area.
     * @return {void}
     * @private
     */
    StackingAreaSeries.prototype.destroy = function (chart) {
        /**
         * Destroy method calling here
         */
    };
    /**
     * Get module name.
     */
    StackingAreaSeries.prototype.getModuleName = function () {
        /**
         * Returns the module name of the series
         */
        return 'StackingAreaSeries';
    };
    /**
     * To find previous visible series
     */
    StackingAreaSeries.prototype.getPreviousSeries = function (series) {
        var seriesCollection = series.chart.visibleSeries;
        for (var i = 0, length_1 = seriesCollection.length; i < length_1; i++) {
            if (series.index === seriesCollection[i].index && i !== 0) {
                return seriesCollection[i - 1];
            }
        }
        return seriesCollection[0];
    };
    /**
     * To find the first visible series index
     * @param seriesCollection
     */
    StackingAreaSeries.prototype.getFirstSeriesIndex = function (seriesCollection) {
        for (var _i = 0, seriesCollection_1 = seriesCollection; _i < seriesCollection_1.length; _i++) {
            var series = seriesCollection_1[_i];
            if (series.visible) {
                return series.index;
            }
        }
        return 0;
    };
    return StackingAreaSeries;
}(LineBase));
export { StackingAreaSeries };
