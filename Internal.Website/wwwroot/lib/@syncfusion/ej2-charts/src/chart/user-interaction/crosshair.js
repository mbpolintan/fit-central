import { Animation, Browser, createElement } from '@syncfusion/ej2-base';
import { textElement, getValueXByPoint, stopTimer, getValueYByPoint, ChartLocation, withInBounds, removeElement } from '../../common/utils/helper';
import { PathOption, Rect, TextOption, findDirection, measureText, SvgRenderer } from '@syncfusion/ej2-svg-base';
/**
 * `Crosshair` module is used to render the crosshair for chart.
 */
var Crosshair = /** @class */ (function () {
    /**
     * Constructor for crosshair module.
     * @private
     */
    function Crosshair(chart) {
        this.arrowLocation = new ChartLocation(0, 0);
        this.rx = 2;
        this.ry = 2;
        this.chart = chart;
        this.elementID = this.chart.element.id;
        this.svgRenderer = new SvgRenderer(this.chart.element.id);
        this.addEventListener();
    }
    /**
     * @hidden
     */
    Crosshair.prototype.addEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);
        this.chart.on(cancelEvent, this.mouseLeaveHandler, this);
        this.chart.on('tapHold', this.longPress, this);
    };
    Crosshair.prototype.mouseUpHandler = function () {
        if (this.chart.startMove) {
            this.removeCrosshair(2000);
        }
    };
    Crosshair.prototype.mouseLeaveHandler = function () {
        this.removeCrosshair(1000);
    };
    Crosshair.prototype.mouseMoveHandler = function (event) {
        var chart = this.chart;
        if (event.type === 'touchmove' && (Browser.isIos || Browser.isIos7) && chart.startMove && event.preventDefault) {
            event.preventDefault();
        }
        // Tooltip for chart series.
        if (!chart.disableTrackTooltip) {
            if (withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                if (chart.startMove || !chart.isTouch) {
                    this.crosshair();
                }
            }
            else {
                this.removeCrosshair(1000);
            }
        }
    };
    /**
     * Handles the long press on chart.
     * @return {boolean}
     * @private
     */
    Crosshair.prototype.longPress = function () {
        var chart = this.chart;
        if (withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
            this.crosshair();
        }
        return false;
    };
    /**
     * Renders the crosshair.
     * @return {void}
     */
    Crosshair.prototype.crosshair = function () {
        var chart = this.chart;
        var horizontalCross = '';
        var verticalCross = '';
        var options;
        var axisTooltipGroup = document.getElementById(this.elementID + '_crosshair_axis');
        var crosshair = chart.crosshair;
        var tooltipdiv = document.getElementById(this.elementID + '_tooltip');
        var chartRect = chart.chartAxisLayoutPanel.seriesClipRect;
        var crossGroup = chart.enableCanvas ? document.getElementById(this.elementID + '_Secondary_Element') :
            document.getElementById(this.elementID + '_UserInteraction');
        var crosshairsvg;
        var cross = document.getElementById(this.elementID + '_Crosshair');
        if (chart.enableCanvas) {
            if (!cross) {
                cross = createElement('div', {
                    id: this.elementID + '_Crosshair', styles: 'position: absolute; pointer-events: none'
                });
                crossGroup.appendChild(cross);
            }
        }
        this.stopAnimation();
        if (chart.tooltip.enable && !withInBounds(chart.tooltipModule.valueX, chart.tooltipModule.valueY, chartRect)) {
            return null;
        }
        if (chart.stockChart && chart.stockChart.onPanning) {
            this.removeCrosshair(1000);
            return null;
        }
        this.valueX = chart.tooltip.enable ? chart.tooltipModule.valueX : chart.mouseX;
        this.valueY = chart.tooltip.enable ? chart.tooltipModule.valueY : chart.mouseY;
        if (!chart.enableCanvas) {
            crossGroup.setAttribute('opacity', '1');
        }
        if (crosshair.lineType === 'Both' || crosshair.lineType === 'Horizontal') {
            horizontalCross += 'M ' + chartRect.x + ' ' + this.valueY +
                ' L ' + (chartRect.x + chartRect.width) + ' ' + this.valueY;
        }
        if (crosshair.lineType === 'Both' || crosshair.lineType === 'Vertical') {
            verticalCross += 'M ' + this.valueX + ' ' + chartRect.y +
                ' L ' + this.valueX + ' ' + (chartRect.y + chartRect.height);
        }
        if (chart.enableCanvas) {
            if (!axisTooltipGroup) {
                axisTooltipGroup = this.svgRenderer.createGroup({ 'id': this.elementID + '_crosshair_axis' });
            }
            var elementID = chart.tooltip.enable ? chart.element.id + '_tooltip_svg' : chart.element.id + '_svg';
            crosshairsvg = this.svgRenderer.createSvg({
                id: elementID,
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
            if (chart.tooltip.enable) {
                tooltipdiv = !tooltipdiv ? chart.tooltipModule.createElement() : tooltipdiv;
                tooltipdiv.appendChild(crosshairsvg);
                crossGroup.appendChild(tooltipdiv);
            }
            options = new PathOption(this.elementID + '_HorizontalLine', 'none', crosshair.line.width, crosshair.line.color || chart.themeStyle.crosshairLine, 1, crosshair.dashArray, horizontalCross);
            this.drawCrosshairLine(options, cross, chartRect.x, this.valueY, chartRect.width, 0, horizontalCross);
            options.d = verticalCross;
            options.id = this.elementID + '_VerticalLine';
            this.drawCrosshairLine(options, cross, this.valueX, chartRect.y, 0, chartRect.height, verticalCross);
            this.renderAxisTooltip(chart, chartRect, axisTooltipGroup);
            crosshairsvg.appendChild(axisTooltipGroup);
            if (!chart.tooltip.enable) {
                cross.appendChild(crosshairsvg);
            }
        }
        else {
            if (crossGroup.childNodes.length === 0) {
                axisTooltipGroup = chart.renderer.createGroup({ 'id': this.elementID + '_crosshair_axis' });
                options = new PathOption(this.elementID + '_HorizontalLine', 'none', crosshair.line.width, crosshair.line.color || chart.themeStyle.crosshairLine, 1, crosshair.dashArray, horizontalCross);
                this.renderCrosshairLine(options, crossGroup);
                options.d = verticalCross;
                options.id = this.elementID + '_VerticalLine';
                this.renderCrosshairLine(options, crossGroup);
                crossGroup.appendChild(axisTooltipGroup);
                this.renderAxisTooltip(chart, chartRect, crossGroup.lastChild);
            }
            else {
                document.getElementById(this.elementID + '_HorizontalLine').setAttribute('d', horizontalCross);
                document.getElementById(this.elementID + '_VerticalLine').setAttribute('d', verticalCross);
                this.renderAxisTooltip(chart, chartRect, crossGroup.lastChild);
            }
        }
    };
    Crosshair.prototype.renderCrosshairLine = function (options, crossGroup) {
        var htmlObject = this.chart.renderer.drawPath(options);
        crossGroup.appendChild(htmlObject);
    };
    Crosshair.prototype.drawCrosshairLine = function (options, crossGroup, left, top, width, height, direction) {
        if (!document.getElementById(options.id) && direction) {
            var line = createElement('div', {
                id: options.id
            });
            crossGroup.appendChild(line);
        }
        if (document.getElementById(options.id)) {
            var style = 'top:' + top.toString() + 'px;' +
                'left:' + left.toString() + 'px;' +
                'width:' + width + 'px;' +
                'height:' + height + 'px;' +
                'fill:' + options.stroke + ';' +
                'border: 0.5px solid black;' +
                'position: absolute';
            var crosshairline = document.getElementById(options.id);
            var crosshairtooltip = document.getElementById(this.elementID + '_crosshair_axis');
            crosshairline.setAttribute('style', style);
            crossGroup.style.opacity = '1';
            if (crosshairtooltip) {
                crosshairtooltip.style.opacity = '1';
            }
        }
    };
    Crosshair.prototype.renderAxisTooltip = function (chart, chartRect, axisGroup) {
        var axis;
        var text;
        var rect;
        var pathElement;
        var textElem;
        var options;
        var padding = 5;
        var direction;
        var axisRect;
        for (var k = 0, length_1 = chart.axisCollections.length; k < length_1; k++) {
            axis = chart.axisCollections[k];
            axisRect = !axis.placeNextToAxisLine ? axis.rect : axis.updatedRect;
            if (axis.crosshairTooltip.enable) {
                if ((this.valueX <= (axisRect.x + axisRect.width) && axisRect.x <= this.valueX) ||
                    (this.valueY <= (axisRect.y + axisRect.height) && axisRect.y <= this.valueY)) {
                    pathElement = document.getElementById(this.elementID + '_axis_tooltip_' + k);
                    textElem = document.getElementById(this.elementID + '_axis_tooltip_text_' + k);
                    text = this.getAxisText(axis);
                    if (!text) {
                        continue;
                    }
                    rect = this.tooltipLocation(text, axis, chartRect, axisRect);
                    if (pathElement === null) {
                        if (chart.enableCanvas) {
                            pathElement = this.svgRenderer.drawPath({
                                'id': this.elementID + '_axis_tooltip_' + k,
                                'fill': axis.crosshairTooltip.fill || chart.themeStyle.crosshairFill
                            }, null);
                        }
                        else {
                            pathElement = chart.renderer.drawPath({
                                'id': this.elementID + '_axis_tooltip_' + k,
                                'fill': axis.crosshairTooltip.fill || chart.themeStyle.crosshairFill
                            }, null);
                        }
                        axisGroup.appendChild(pathElement);
                        options = new TextOption(this.elementID + '_axis_tooltip_text_' + k, 0, 0, 'start', text);
                        var render = chart.enableCanvas ? this.svgRenderer : chart.renderer;
                        textElem = textElement(render, options, axis.crosshairTooltip.textStyle, axis.crosshairTooltip.textStyle.color || chart.themeStyle.crosshairLabel, axisGroup);
                    }
                    direction = findDirection(this.rx, this.ry, rect, this.arrowLocation, 10, this.isTop, this.isBottom, this.isLeft, this.valueX, this.valueY);
                    pathElement.setAttribute('d', direction);
                    textElem.textContent = text;
                    textElem.setAttribute('x', (rect.x + padding).toString());
                    textElem.setAttribute('y', (rect.y + padding + 3 * this.elementSize.height / 4).toString());
                }
                else {
                    removeElement(this.elementID + '_axis_tooltip_' + k);
                    removeElement(this.elementID + '_axis_tooltip_text_' + k);
                }
            }
        }
    };
    Crosshair.prototype.getAxisText = function (axis) {
        var value;
        this.isBottom = false;
        this.isTop = false;
        this.isLeft = false;
        this.isRight = false;
        var labelValue = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks')
            ? 0.5 : 0;
        if (axis.orientation === 'Horizontal') {
            value = getValueXByPoint(Math.abs(this.valueX - axis.rect.x), axis.rect.width, axis) + labelValue;
            this.isBottom = !axis.opposedPosition;
            this.isTop = axis.opposedPosition;
        }
        else {
            value = getValueYByPoint(Math.abs(this.valueY - axis.rect.y), axis.rect.height, axis) + labelValue;
            this.isRight = axis.opposedPosition;
            this.isLeft = !axis.opposedPosition;
        }
        if (axis.valueType === 'DateTime') {
            return axis.format(new Date(value));
        }
        else if (axis.valueType === 'Category') {
            return axis.labels[Math.floor(value)];
        }
        else if (axis.valueType === 'DateTimeCategory') {
            return this.chart.dateTimeCategoryModule.getIndexedAxisLabel(axis.labels[Math.floor(value)], axis.format);
        }
        else if (axis.valueType === 'Logarithmic') {
            return value = axis.format(Math.pow(axis.logBase, value));
        }
        else {
            var customLabelFormat = axis.labelFormat && axis.labelFormat.match('{value}') !== null;
            return customLabelFormat ? axis.labelFormat.replace('{value}', axis.format(value)) : axis.format(value);
        }
    };
    Crosshair.prototype.tooltipLocation = function (text, axis, bounds, axisRect) {
        var isBottom = false;
        var isLeft = false;
        var padding = 5;
        var arrowPadding = 10;
        var tooltipRect;
        var boundsX = bounds.x;
        var boundsY = bounds.y;
        var islabelInside = axis.labelPosition === 'Inside';
        var scrollBarHeight = axis.scrollbarSettings.enable || (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject)
            ? axis.scrollBarHeight : 0;
        this.elementSize = measureText(text, axis.crosshairTooltip.textStyle);
        if (axis.orientation === 'Horizontal') {
            var yLocation = islabelInside ? axisRect.y - this.elementSize.height - (padding * 2 + arrowPadding) :
                axisRect.y + scrollBarHeight;
            var height = islabelInside ? axisRect.y - this.elementSize.height - arrowPadding : axisRect.y + arrowPadding;
            this.arrowLocation = new ChartLocation(this.valueX, yLocation);
            tooltipRect = new Rect((this.valueX - (this.elementSize.width / 2) - padding), height + (!islabelInside ? scrollBarHeight : 0), this.elementSize.width + padding * 2, this.elementSize.height + padding * 2);
            if (axis.opposedPosition) {
                tooltipRect.y = islabelInside ? axisRect.y : axisRect.y -
                    (this.elementSize.height + padding * 2 + arrowPadding) - scrollBarHeight;
            }
            if (tooltipRect.x < boundsX) {
                tooltipRect.x = boundsX;
            }
            if (tooltipRect.x + tooltipRect.width > boundsX + bounds.width) {
                tooltipRect.x -= ((tooltipRect.x + tooltipRect.width) - (boundsX + bounds.width));
            }
            if (this.arrowLocation.x + arrowPadding / 2 > tooltipRect.x + tooltipRect.width - this.rx) {
                this.arrowLocation.x = tooltipRect.x + tooltipRect.width - this.rx - arrowPadding / 2;
            }
            if (this.arrowLocation.x - arrowPadding / 2 < tooltipRect.x + this.rx) {
                this.arrowLocation.x = tooltipRect.x + this.rx + arrowPadding / 2;
            }
        }
        else {
            scrollBarHeight = scrollBarHeight * (axis.opposedPosition ? 1 : -1);
            this.arrowLocation = new ChartLocation(axisRect.x, this.valueY);
            var width = islabelInside ? axisRect.x - scrollBarHeight :
                axisRect.x - (this.elementSize.width) - (padding * 2 + arrowPadding);
            tooltipRect = new Rect(width + scrollBarHeight, this.valueY - (this.elementSize.height / 2) - padding, this.elementSize.width + (padding * 2), this.elementSize.height + padding * 2);
            if (axis.opposedPosition) {
                tooltipRect.x = islabelInside ? axisRect.x - this.elementSize.width - arrowPadding :
                    axisRect.x + arrowPadding + scrollBarHeight;
                if ((tooltipRect.x + tooltipRect.width) > this.chart.availableSize.width) {
                    this.arrowLocation.x -= ((tooltipRect.x + tooltipRect.width) - this.chart.availableSize.width);
                    tooltipRect.x -= ((tooltipRect.x + tooltipRect.width) - this.chart.availableSize.width);
                }
            }
            else {
                if (tooltipRect.x < 0) {
                    this.arrowLocation.x -= tooltipRect.x;
                    tooltipRect.x = 0;
                }
            }
            if (tooltipRect.y < boundsY) {
                tooltipRect.y = boundsY;
            }
            if (tooltipRect.y + tooltipRect.height >= boundsY + bounds.height) {
                tooltipRect.y -= ((tooltipRect.y + tooltipRect.height) - (boundsY + bounds.height));
            }
            if (this.arrowLocation.y + arrowPadding / 2 > tooltipRect.y + tooltipRect.height - this.ry) {
                this.arrowLocation.y = tooltipRect.y + tooltipRect.height - this.ry - arrowPadding / 2;
            }
            if (this.arrowLocation.y - arrowPadding / 2 < tooltipRect.y + this.ry) {
                this.arrowLocation.y = tooltipRect.y + this.ry + arrowPadding / 2;
            }
        }
        return tooltipRect;
    };
    Crosshair.prototype.stopAnimation = function () {
        stopTimer(this.crosshairInterval);
    };
    Crosshair.prototype.progressAnimation = function () {
        stopTimer(this.crosshairInterval);
    };
    /**
     * Removes the crosshair on mouse leave.
     * @return {void}
     * @private
     */
    Crosshair.prototype.removeCrosshair = function (duration) {
        var chart = this.chart;
        var crosshair = chart.enableCanvas ? document.getElementById(this.elementID + '_Crosshair') :
            document.getElementById(this.elementID + '_UserInteraction');
        var crosshairtooltip = chart.enableCanvas ? document.getElementById(this.elementID + '_crosshair_axis') : null;
        this.stopAnimation();
        if (crosshair && crosshair.getAttribute('opacity') !== '0') {
            this.crosshairInterval = setTimeout(function () {
                new Animation({}).animate(crosshair, {
                    duration: 200,
                    progress: function (args) {
                        // crosshair.removeAttribute('e-animate');
                        crosshair.style.animation = '';
                        if (!chart.enableCanvas) {
                            crosshair.setAttribute('opacity', (1 - (args.timeStamp / args.duration)).toString());
                        }
                        else {
                            crosshair.style.opacity = (1 - (args.timeStamp / args.duration)).toString();
                            crosshairtooltip.style.opacity = (1 - (args.timeStamp / args.duration)).toString();
                        }
                    },
                    end: function (model) {
                        if (chart.enableCanvas) {
                            crosshair.style.opacity = '0';
                            crosshairtooltip.style.opacity = '0';
                        }
                        else {
                            crosshair.setAttribute('opacity', '0');
                        }
                        chart.startMove = false;
                        if (chart.tooltipModule) {
                            chart.tooltipModule.valueX = null;
                            chart.tooltipModule.valueY = null;
                        }
                    }
                });
            }, duration);
        }
    };
    /**
     * Get module name.
     */
    Crosshair.prototype.getModuleName = function () {
        /**
         * Returns the module name
         */
        return 'Crosshair';
    };
    /**
     * To destroy the crosshair.
     * @return {void}
     * @private
     */
    Crosshair.prototype.destroy = function (chart) {
        /**
         * Destroy method performed here
         */
    };
    return Crosshair;
}());
export { Crosshair };
