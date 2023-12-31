import { createElement, Browser } from '@syncfusion/ej2-base';
import { tooltipRender } from '../model/constant';
import { Tooltip } from '@syncfusion/ej2-svg-base';
import { getElement, GaugeLocation, Size, textFormatter, formatValue, Rect, getMousePosition } from '../utils/helper';
import { getPointer } from '../utils/helper';
/**
 * Represent the tooltip rendering for gauge
 */
var GaugeTooltip = /** @class */ (function () {
    function GaugeTooltip(gauge) {
        this.gauge = gauge;
        this.element = gauge.element;
        this.tooltip = gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.tooltipId = this.gauge.element.id + '_LinearGauge_Tooltip';
        this.addEventListener();
    }
    /**
     * Internal use for tooltip rendering
     * @param pointerElement
     */
    /* tslint:disable:no-string-literal */
    GaugeTooltip.prototype.renderTooltip = function (e) {
        var pageX;
        var pageY;
        var target;
        var touchArg;
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
        var tooltipEle;
        var tooltipContent;
        if (target.id.indexOf('Pointer') > -1 && this.gauge.tooltip.type.indexOf('Pointer') > -1) {
            this.pointerElement = target;
            var areaRect = this.gauge.element.getBoundingClientRect();
            var current = getPointer(this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            this.currentPointer = current.pointer;
            var customTooltipFormat = this.tooltip.format && this.tooltip.format.match('{value}') !== null;
            this.tooltip.textStyle.fontFamily = this.gauge.themeStyle.fontFamily || this.tooltip.textStyle.fontFamily;
            this.tooltip.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity || this.tooltip.textStyle.opacity;
            tooltipContent = customTooltipFormat ? textFormatter(this.tooltip.format, { value: this.currentPointer.currentValue }, this.gauge) :
                formatValue(this.currentPointer.currentValue, this.gauge).toString();
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY);
        }
        else if (target.id.indexOf('Range') > -1 && this.gauge.tooltip.type.indexOf('Range') > -1) {
            this.pointerElement = target;
            var areaRect = this.gauge.element.getBoundingClientRect();
            var current = getPointer(this.pointerElement, this.gauge);
            this.currentAxis = current.axis;
            this.axisIndex = current.axisIndex;
            var rangePosition = Number(target.id.charAt(target.id.length - 1));
            this.currentRange = this.currentAxis.ranges[rangePosition];
            var startData = (this.currentRange.start).toString();
            var endData = (this.currentRange.end).toString();
            var rangeTooltipFormat = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            var customTooltipFormat = rangeTooltipFormat && (rangeTooltipFormat.match('{end}') !== null ||
                rangeTooltipFormat.match('{start}') !== null);
            this.tooltip.rangeSettings.textStyle.fontFamily = this.gauge.themeStyle.fontFamily ||
                this.tooltip.rangeSettings.textStyle.fontFamily;
            this.tooltip.rangeSettings.textStyle.opacity = this.gauge.themeStyle.tooltipTextOpacity ||
                this.tooltip.rangeSettings.textStyle.opacity;
            tooltipContent = customTooltipFormat ? rangeTooltipFormat.replace(/{start}/g, startData).replace(/{end}/g, endData) :
                'Start : ' + startData + '<br>' + 'End : ' + endData;
            tooltipEle = this.tooltipCreate(tooltipEle);
            this.tooltipRender(tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY);
        }
        else {
            this.removeTooltip();
        }
    };
    GaugeTooltip.prototype.tooltipRender = function (tooltipContent, target, tooltipEle, e, areaRect, pageX, pageY) {
        var _this = this;
        var location = this.getTooltipLocation();
        if ((this.tooltip.rangeSettings.showAtMousePosition && target.id.indexOf('Range') > -1) ||
            (this.tooltip.showAtMousePosition && target.id.indexOf('Pointer') > -1)) {
            location = getMousePosition(pageX, pageY, this.gauge.svgObject);
        }
        var args = {
            name: tooltipRender,
            cancel: false,
            gauge: this.gauge,
            event: e,
            location: location,
            content: tooltipContent,
            tooltip: this.tooltip,
            axis: this.currentAxis,
            pointer: this.currentPointer
        };
        var tooltipPos = this.getTooltipPosition();
        location.y += ((this.tooltip.rangeSettings.template && tooltipPos === 'Top') ||
            (this.tooltip.template && tooltipPos === 'Top')) ? 20 : 0;
        location.x += ((this.tooltip.rangeSettings.template && tooltipPos === 'Right') ||
            (this.tooltip.template && tooltipPos === 'Right')) ? 20 : 0;
        this.gauge.trigger(tooltipRender, args, function (observedArgs) {
            var template = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.template : args.tooltip.template;
            if (template !== null && Object.keys(template).length === 1) {
                template = template[Object.keys(template)[0]];
            }
            var themes = _this.gauge.theme.toLowerCase();
            if (!args.cancel) {
                args['tooltip']['properties']['textStyle']['color'] = (target.id.indexOf('Range') > -1) ?
                    _this.tooltip.rangeSettings.textStyle.color : _this.tooltip.textStyle.color || _this.gauge.themeStyle.tooltipFontColor;
                var fillColor = (target.id.indexOf('Range') > -1) ? _this.tooltip.rangeSettings.fill : _this.tooltip.fill;
                _this.svgTooltip = _this.svgCreate(_this.svgTooltip, args, _this.gauge, areaRect, fillColor, template, tooltipPos, location, target);
                _this.svgTooltip.opacity = _this.gauge.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                _this.svgTooltip.appendTo(tooltipEle);
            }
        });
    };
    GaugeTooltip.prototype.tooltipCreate = function (tooltipEle) {
        if (document.getElementById(this.tooltipId)) {
            tooltipEle = document.getElementById(this.tooltipId);
        }
        else {
            tooltipEle = createElement('div', {
                id: this.tooltipId,
                className: 'EJ2-LinearGauge-Tooltip',
                styles: 'position: absolute;pointer-events:none;'
            });
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(tooltipEle);
        }
        return tooltipEle;
    };
    GaugeTooltip.prototype.svgCreate = function (svgTooltip, args, gauge, areaRect, fill, template, tooltipPos, location, target) {
        var tooltipBorder = (target.id.indexOf('Range') > -1) ? args.tooltip.rangeSettings.border : args.tooltip.border;
        svgTooltip = new Tooltip({
            enable: true,
            header: '',
            data: { value: args.content },
            template: template,
            content: [args.content],
            shapes: [],
            location: args.location,
            palette: [],
            inverted: !(args.gauge.orientation === 'Horizontal'),
            enableAnimation: args.tooltip.enableAnimation,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            availableSize: gauge.availableSize,
            areaBounds: new Rect((this.gauge.orientation === 'Vertical') ? areaRect.left : location.x, (this.gauge.orientation === 'Vertical') ? location.y : (tooltipPos === 'Bottom') ? location.y : areaRect.top, tooltipPos === 'Right' ? Math.abs(areaRect.left - location.x) : areaRect.width, areaRect.height),
            textStyle: args.tooltip.textStyle,
            border: tooltipBorder,
            theme: args.gauge.theme,
            blazorTemplate: { name: 'TooltipTemplate', parent: gauge.tooltip }
        });
        return svgTooltip;
    };
    GaugeTooltip.prototype.getTooltipPosition = function () {
        var position;
        if (this.gauge.orientation === 'Vertical') {
            position = (!this.currentAxis.opposedPosition) ? 'Left' : 'Right';
        }
        else {
            position = (this.currentAxis.opposedPosition) ? 'Top' : 'Bottom';
        }
        return position;
    };
    GaugeTooltip.prototype.getTooltipLocation = function () {
        var location;
        var bounds;
        var radix = 10;
        var lineX;
        var lineY;
        var size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        var x;
        var y;
        var height;
        var width;
        var lineId = this.gauge.element.id + '_AxisLine_' + this.axisIndex;
        var tickID = this.gauge.element.id + '_MajorTicksLine_' + this.axisIndex;
        var lineBounds;
        if (getElement(lineId)) {
            lineBounds = getElement(lineId).getBoundingClientRect();
            lineX = lineBounds.left;
            lineY = lineBounds.top;
        }
        else {
            lineBounds = getElement(tickID).getBoundingClientRect();
            lineX = (!this.currentAxis.opposedPosition) ? (lineBounds.left + lineBounds.width) : lineBounds.left;
            lineY = (!this.currentAxis.opposedPosition) ? (lineBounds.top + lineBounds.height) : lineBounds.top;
        }
        bounds = this.pointerElement.getBoundingClientRect();
        var elementRect = this.gauge.element.getBoundingClientRect();
        x = bounds.left - elementRect.left;
        y = bounds.top - elementRect.top;
        height = bounds.height;
        width = bounds.width;
        var tooltipPosition = (this.pointerElement.id.indexOf('Range') > -1) ? this.tooltip.rangeSettings.position :
            this.tooltip.position;
        if (this.gauge.orientation === 'Vertical') {
            x = (lineX - elementRect.left);
            if (this.pointerElement.id.indexOf('Range') > -1 || this.pointerElement.id.indexOf('BarPointer') > -1) {
                y = (!this.currentAxis.isInversed) ? ((tooltipPosition === 'End') ? y : ((tooltipPosition === 'Start') ?
                    y + height : y + (height / 2))) : ((tooltipPosition === 'End') ? y + height : ((tooltipPosition === 'Start') ?
                    y + height : y + (height / 2)));
            }
            else {
                y = (this.currentPointer.type === 'Marker') ? y + (height / 2) : (!this.currentAxis.isInversed) ? y : y + height;
            }
        }
        else {
            y = (lineY - elementRect.top);
            if (this.pointerElement.id.indexOf('Range') > -1 || this.pointerElement.id.indexOf('BarPointer') > -1) {
                x = (!this.currentAxis.isInversed) ? ((tooltipPosition === 'End') ? x + width : ((tooltipPosition === 'Start') ?
                    x : x + (width / 2))) : ((tooltipPosition === 'End') ? x : ((tooltipPosition === 'Start') ? x + width : x + (width / 2)));
            }
            else {
                x = (this.currentPointer.type === 'Marker') ? (x + width / 2) : (!this.currentAxis.isInversed) ? x + width : x;
            }
        }
        location = new GaugeLocation(x, y);
        return location;
    };
    GaugeTooltip.prototype.removeTooltip = function () {
        if (document.getElementsByClassName('EJ2-LinearGauge-Tooltip').length > 0) {
            document.getElementsByClassName('EJ2-LinearGauge-Tooltip')[0].remove();
        }
    };
    GaugeTooltip.prototype.mouseUpHandler = function (e) {
        this.renderTooltip(e);
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(this.removeTooltip.bind(this), 2000);
    };
    /**
     * To bind events for tooltip module
     */
    GaugeTooltip.prototype.addEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.on(Browser.touchMoveEvent, this.renderTooltip, this);
        this.gauge.on(Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    /**
     * To unbind events for tooltip module
     */
    GaugeTooltip.prototype.removeEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        this.gauge.off(Browser.touchMoveEvent, this.renderTooltip);
        this.gauge.off(Browser.touchEndEvent, this.mouseUpHandler);
    };
    /*
     * Get module name.
     */
    GaugeTooltip.prototype.getModuleName = function () {
        return 'Tooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    GaugeTooltip.prototype.destroy = function (gauge) {
        // Destroy method performed here
        this.removeEventListener();
    };
    return GaugeTooltip;
}());
export { GaugeTooltip };
