import { Tooltip } from '@syncfusion/ej2-svg-base';
import { getPointer, Rect, getMousePosition, getElementSize, stringToNumber } from '../utils/helper';
import { getAngleFromValue, getLabelFormat, getLocationFromAngle } from '../utils/helper';
import { Browser, createElement, remove } from '@syncfusion/ej2-base';
import { tooltipRender } from '../model/constants';
/**
 * Sets and gets the module that handles the tooltip of the circular gauge
 */
var GaugeTooltip = /** @class */ (function () {
    /**
     * Constructor for Tooltip module.
     * @private.
     */
    function GaugeTooltip(gauge) {
        this.gauge = gauge;
        this.tooltipId = this.gauge.element.id + '_CircularGauge_Tooltip';
        this.tooltip = gauge.tooltip;
        this.textStyle = this.tooltip.textStyle;
        this.borderStyle = this.tooltip.border;
        this.addEventListener();
    }
    /**
     * Method to render the tooltip for circular gauge.
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:max-func-body-length */
    GaugeTooltip.prototype.renderTooltip = function (e) {
        var _this = this;
        this.gaugeId = this.gauge.element.getAttribute('id');
        var pageX;
        var pageY;
        var target;
        var touchArg;
        var location;
        var samePointerEle = false;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = e;
            target = touchArg.target;
            pageX = touchArg.changedTouches[0].pageX;
            pageY = touchArg.changedTouches[0].pageY;
        }
        else {
            target = e.target;
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if ((this.tooltip.type.indexOf('Pointer') > -1) && (target.id.indexOf('_Pointer_') >= 0) &&
            (target.id.indexOf(this.gaugeId) >= 0)) {
            if (this.pointerEle !== null) {
                samePointerEle = (this.pointerEle === target);
            }
            var svgRect_1 = this.gauge.svgObject.getBoundingClientRect();
            var elementRect = this.gauge.element.getBoundingClientRect();
            var axisRect_1 = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            var rect_1 = new Rect(Math.abs(elementRect.left - svgRect_1.left), Math.abs(elementRect.top - svgRect_1.top), svgRect_1.width, svgRect_1.height);
            var currentPointer = getPointer(target.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentPointer.axisIndex];
            this.currentPointer = (this.currentAxis.pointers)[currentPointer.pointerIndex];
            var angle_1 = getAngleFromValue(this.currentPointer.currentValue, this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min, this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise') % 360;
            var tooltipFormat = this.gauge.tooltip.format || this.currentAxis.labelStyle.format;
            var customLabelFormat = tooltipFormat && tooltipFormat.match('{value}') !== null;
            var format = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(tooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            this.tooltipElement();
            if (this.tooltipEle.childElementCount !== 0 && !this.gauge.enablePointerDrag && !this.gauge.tooltip.showAtMousePosition) {
                return null;
            }
            var roundValue = this.roundedValue(this.currentPointer.currentValue);
            var pointerContent_1 = customLabelFormat ?
                tooltipFormat.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                format(roundValue);
            location = getLocationFromAngle(angle_1, this.currentAxis.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.template && ((angle_1 >= 150 && angle_1 <= 250) || (angle_1 >= 330 && angle_1 <= 360) ||
                (angle_1 >= 0 && angle_1 <= 45))) ? (location.x + 10) : location.x;
            var tooltipArgs = {
                name: tooltipRender, cancel: false, content: pointerContent_1, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, pointer: this.currentPointer, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Pointer'
            };
            if (this.gauge.isBlazor) {
                var name_1 = tooltipArgs.name, cancel = tooltipArgs.cancel, content = tooltipArgs.content, location_1 = tooltipArgs.location, tooltip = tooltipArgs.tooltip, event_1 = tooltipArgs.event, appendInBodyTag = tooltipArgs.appendInBodyTag, type = tooltipArgs.type;
                tooltipArgs = { name: name_1, cancel: cancel, content: content, location: location_1, tooltip: tooltip, event: event_1, appendInBodyTag: appendInBodyTag, type: type };
            }
            var pointerTooltip = function (tooltipArgs) {
                var template = tooltipArgs.tooltip.template;
                if (template !== null && template.length === 1) {
                    template = template[template[0]];
                }
                if (!tooltipArgs.tooltip.showAtMousePosition) {
                    if (template) {
                        var elementSize = getElementSize(template, _this.gauge, _this.tooltipEle);
                        _this.tooltipRect = Math.abs(axisRect_1.left - svgRect_1.left) > elementSize.width ?
                            _this.findPosition(rect_1, angle_1, pointerContent_1, tooltipArgs.location) : rect_1;
                    }
                    else {
                        _this.findPosition(rect_1, angle_1, pointerContent_1, tooltipArgs.location);
                    }
                }
                else {
                    tooltipArgs.location = getMousePosition(pageX, pageY, _this.gauge.svgObject);
                    _this.tooltipRect = rect_1;
                }
                if (!tooltipArgs.cancel && !samePointerEle) {
                    tooltipArgs.tooltip.textStyle.color = tooltipArgs.tooltip.textStyle.color || _this.gauge.themeStyle.tooltipFontColor;
                    tooltipArgs.tooltip.textStyle.fontFamily = _this.gauge.themeStyle.fontFamily || tooltipArgs.tooltip.textStyle.fontFamily;
                    tooltipArgs.tooltip.textStyle.opacity = _this.gauge.themeStyle.tooltipTextOpacity ||
                        tooltipArgs.tooltip.textStyle.opacity;
                    _this.svgTooltip = _this.svgTooltipCreate(_this.svgTooltip, tooltipArgs, template, _this.arrowInverted, _this.tooltipRect, _this.gauge, tooltipArgs.tooltip.fill, tooltipArgs.tooltip.textStyle, tooltipArgs.tooltip.border);
                    _this.svgTooltip.opacity = _this.gauge.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                    _this.svgTooltip.appendTo(_this.tooltipEle);
                    if (template && Math.abs(pageY - _this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        _this.tooltipEle.style.top = (parseFloat(_this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, tooltipArgs, pointerTooltip);
        }
        else if ((this.tooltip.type.indexOf('Range') > -1) && (target.id.indexOf('_Range_') >= 0) && (!this.gauge.isDrag) &&
            (target.id.indexOf(this.gaugeId) >= 0)) {
            var rangeSvgRect_1 = this.gauge.svgObject.getBoundingClientRect();
            var rangeElementRect = this.gauge.element.getBoundingClientRect();
            var rangeAxisRect_1 = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            var rect_2 = new Rect(Math.abs(rangeElementRect.left - rangeSvgRect_1.left), Math.abs(rangeElementRect.top - rangeSvgRect_1.top), rangeSvgRect_1.width, rangeSvgRect_1.height);
            var currentRange = getPointer(target.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentRange.axisIndex];
            this.currentRange = (this.currentAxis.ranges)[currentRange.pointerIndex];
            var rangeAngle_1 = getAngleFromValue((this.currentRange.end - Math.abs((this.currentRange.end - this.currentRange.start) / 2)), this.currentAxis.visibleRange.max, this.currentAxis.visibleRange.min, this.currentAxis.startAngle, this.currentAxis.endAngle, this.currentAxis.direction === 'ClockWise') % 360;
            var rangeTooltipFormat = this.gauge.tooltip.rangeSettings.format || this.currentAxis.labelStyle.format;
            var customLabelFormat = rangeTooltipFormat && (rangeTooltipFormat.match('{end}') !== null ||
                rangeTooltipFormat.match('{start}') !== null);
            var rangeFormat = this.gauge.intl.getNumberFormat({
                format: getLabelFormat(rangeTooltipFormat), useGrouping: this.gauge.useGroupingSeparator
            });
            this.tooltipElement();
            var roundStartValue = this.roundedValue(this.currentRange.start);
            var roundEndValue = this.roundedValue(this.currentRange.end);
            var startData_1 = (this.currentRange.start).toString();
            var endData_1 = (this.currentRange.end).toString();
            var rangeContent_1 = customLabelFormat ?
                rangeTooltipFormat.replace(/{start}/g, startData_1).replace(/{end}/g, endData_1) :
                'Start : ' + rangeFormat(roundStartValue) + '<br>' + 'End : ' + rangeFormat(roundEndValue);
            location = getLocationFromAngle(rangeAngle_1, this.currentRange.currentRadius, this.gauge.midPoint);
            location.x = (this.tooltip.rangeSettings.template && ((rangeAngle_1 >= 150 && rangeAngle_1 <= 250) ||
                (rangeAngle_1 >= 330 && rangeAngle_1 <= 360) ||
                (rangeAngle_1 >= 0 && rangeAngle_1 <= 45))) ? (location.x + 10) : location.x;
            var rangeTooltipArgs = {
                name: tooltipRender, cancel: false, content: rangeContent_1, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, range: this.currentRange, event: e, gauge: this.gauge, appendInBodyTag: false, type: 'Range'
            };
            if (this.gauge.isBlazor) {
                var name_2 = rangeTooltipArgs.name, cancel = rangeTooltipArgs.cancel, content = rangeTooltipArgs.content, location_2 = rangeTooltipArgs.location, tooltip = rangeTooltipArgs.tooltip, event_2 = rangeTooltipArgs.event, appendInBodyTag = rangeTooltipArgs.appendInBodyTag, type = rangeTooltipArgs.type;
                rangeTooltipArgs = { name: name_2, cancel: cancel, content: content, location: location_2, tooltip: tooltip, event: event_2, appendInBodyTag: appendInBodyTag, type: type };
            }
            var rangeTooltip = function (rangeTooltipArgs) {
                var rangeTemplate = rangeTooltipArgs.tooltip.rangeSettings.template;
                if (rangeTemplate !== null && rangeTemplate.length === 1) {
                    rangeTemplate = rangeTemplate[rangeTemplate[0]];
                }
                if (rangeTemplate) {
                    rangeTemplate = rangeTemplate.replace(/[$]{start}/g, startData_1);
                    rangeTemplate = rangeTemplate.replace(/[$]{end}/g, endData_1);
                }
                if (!_this.tooltip.rangeSettings.showAtMousePosition) {
                    if (rangeTemplate) {
                        var elementSize = getElementSize(rangeTemplate, _this.gauge, _this.tooltipEle);
                        _this.tooltipRect = Math.abs(rangeAxisRect_1.left - rangeSvgRect_1.left) > elementSize.width ?
                            _this.findPosition(rect_2, rangeAngle_1, rangeContent_1, rangeTooltipArgs.location) : rect_2;
                    }
                    else {
                        _this.findPosition(rect_2, rangeAngle_1, rangeContent_1, rangeTooltipArgs.location);
                    }
                }
                else {
                    rangeTooltipArgs.location = getMousePosition(pageX, pageY, _this.gauge.svgObject);
                    _this.tooltipRect = rect_2;
                }
                if (!rangeTooltipArgs.cancel) {
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.color = rangeTooltipArgs.tooltip.rangeSettings.textStyle.color ||
                        _this.gauge.themeStyle.tooltipFontColor;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily = _this.gauge.themeStyle.fontFamily ||
                        rangeTooltipArgs.tooltip.rangeSettings.textStyle.fontFamily;
                    rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity = _this.gauge.themeStyle.tooltipTextOpacity ||
                        rangeTooltipArgs.tooltip.rangeSettings.textStyle.opacity;
                    _this.svgTooltip = _this.svgTooltipCreate(_this.svgTooltip, rangeTooltipArgs, rangeTemplate, _this.arrowInverted, _this.tooltipRect, _this.gauge, rangeTooltipArgs.tooltip.rangeSettings.fill, rangeTooltipArgs.tooltip.rangeSettings.textStyle, rangeTooltipArgs.tooltip.rangeSettings.border);
                    _this.svgTooltip.opacity = _this.gauge.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                    _this.svgTooltip.appendTo(_this.tooltipEle);
                    if (rangeTemplate && Math.abs(pageY - _this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        _this.tooltipEle.style.top = (parseFloat(_this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, rangeTooltipArgs, rangeTooltip);
        }
        else if ((this.tooltip.type.indexOf('Annotation') > -1) && this.checkParentAnnotationId(target) && ((!this.gauge.isDrag)) &&
            (this.annotationTargetElement.id.indexOf(this.gaugeId) >= 0)) {
            var annotationSvgRect = this.gauge.svgObject.getBoundingClientRect();
            var annotationElementRect = this.gauge.element.getBoundingClientRect();
            var annotationAxisRect = document.getElementById(this.gauge.element.id + '_AxesCollection').getBoundingClientRect();
            var rect_3 = new Rect(Math.abs(annotationElementRect.left - annotationSvgRect.left), Math.abs(annotationElementRect.top - annotationSvgRect.top), annotationSvgRect.width, annotationSvgRect.height);
            var currentAnnotation = getPointer(this.annotationTargetElement.id, this.gauge);
            this.currentAxis = this.gauge.axes[currentAnnotation.axisIndex];
            this.currentAnnotation = (this.currentAxis.annotations)[currentAnnotation.pointerIndex];
            var annotationAngle = (this.currentAnnotation.angle - 90);
            this.tooltipElement();
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
            var annotationContent = (this.gauge.tooltip.annotationSettings.format !== null) ?
                this.gauge.tooltip.annotationSettings.format : '';
            location = getLocationFromAngle(annotationAngle, stringToNumber(this.currentAnnotation.radius, this.currentAxis.currentRadius), this.gauge.midPoint);
            location.x = (this.tooltip.annotationSettings.template && ((annotationAngle >= 150 && annotationAngle <= 250) ||
                (annotationAngle >= 330 && annotationAngle <= 360) || (annotationAngle >= 0 && annotationAngle <= 45))) ?
                (location.x + 10) : location.x;
            var annotationTooltipArgs = {
                name: tooltipRender, cancel: false, content: annotationContent, location: location, axis: this.currentAxis,
                tooltip: this.tooltip, annotation: this.currentAnnotation, event: e, gauge: this.gauge, appendInBodyTag: false,
                type: 'Annotation'
            };
            if (this.gauge.isBlazor) {
                var name_3 = annotationTooltipArgs.name, cancel = annotationTooltipArgs.cancel, content = annotationTooltipArgs.content, location_3 = annotationTooltipArgs.location, tooltip = annotationTooltipArgs.tooltip, event_3 = annotationTooltipArgs.event, appendInBodyTag = annotationTooltipArgs.appendInBodyTag, type = annotationTooltipArgs.type;
                annotationTooltipArgs = { name: name_3, cancel: cancel, content: content, location: location_3, tooltip: tooltip, event: event_3, appendInBodyTag: appendInBodyTag, type: type };
            }
            var annotationTooltip = function (annotationTooltipArgs) {
                var annotationTemplate = annotationTooltipArgs.tooltip.annotationSettings.template;
                if (annotationTemplate !== null && annotationTemplate.length === 1) {
                    annotationTemplate = annotationTemplate[annotationTemplate[0]];
                }
                var elementSizeAn = _this.annotationTargetElement.getBoundingClientRect();
                _this.tooltipPosition = 'RightTop';
                _this.arrowInverted = true;
                annotationTooltipArgs.location.x = annotationTooltipArgs.location.x + (elementSizeAn.width / 2);
                _this.tooltipRect = new Rect(rect_3.x, rect_3.y, rect_3.width, rect_3.height);
                if (!annotationTooltipArgs.cancel && (_this.gauge.tooltip.annotationSettings.format !== null ||
                    _this.gauge.tooltip.annotationSettings.template !== null)) {
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.color = annotationTooltipArgs.tooltip.textStyle.color ||
                        _this.gauge.themeStyle.tooltipFontColor;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.fontFamily = _this.gauge.themeStyle.fontFamily ||
                        annotationTooltipArgs.tooltip.textStyle.fontFamily;
                    annotationTooltipArgs.tooltip.annotationSettings.textStyle.opacity = _this.gauge.themeStyle.tooltipTextOpacity ||
                        annotationTooltipArgs.tooltip.textStyle.opacity;
                    _this.svgTooltip = _this.svgTooltipCreate(_this.svgTooltip, annotationTooltipArgs, annotationTemplate, _this.arrowInverted, _this.tooltipRect, _this.gauge, annotationTooltipArgs.tooltip.annotationSettings.fill, annotationTooltipArgs.tooltip.annotationSettings.textStyle, annotationTooltipArgs.tooltip.annotationSettings.border);
                    _this.svgTooltip.opacity = _this.gauge.themeStyle.tooltipFillOpacity || _this.svgTooltip.opacity;
                    _this.svgTooltip.appendTo(_this.tooltipEle);
                    if (annotationTemplate && Math.abs(pageY - _this.tooltipEle.getBoundingClientRect().top) <= 0) {
                        _this.tooltipEle.style.top = (parseFloat(_this.tooltipEle.style.top) + 20) + 'px';
                    }
                }
            };
            this.gauge.trigger(tooltipRender, annotationTooltipArgs, annotationTooltip);
        }
        else {
            this.removeTooltip();
        }
    };
    ;
    /**
     * Method to create tooltip svg element.
     */
    GaugeTooltip.prototype.svgTooltipCreate = function (svgTooltip, tooltipArg, template, arrowInverted, tooltipRect, gauge, fill, textStyle, border) {
        svgTooltip = new Tooltip({
            enable: true,
            data: { value: tooltipArg.content },
            template: template,
            enableAnimation: tooltipArg.tooltip.enableAnimation,
            content: [tooltipArg.content],
            location: tooltipArg.location,
            inverted: arrowInverted,
            areaBounds: tooltipRect,
            fill: fill || gauge.themeStyle.tooltipFillColor,
            textStyle: textStyle,
            availableSize: gauge.availableSize,
            border: border,
            blazorTemplate: { name: 'TooltipTemplate', parent: gauge.tooltip }
        });
        return svgTooltip;
    };
    /**
     * Method to create or modify tolltip element.
     */
    GaugeTooltip.prototype.tooltipElement = function () {
        if (document.getElementById(this.tooltipId)) {
            this.tooltipEle = document.getElementById(this.tooltipId);
        }
        else {
            this.tooltipEle = createElement('div', {
                id: this.tooltipId,
                className: 'EJ2-CircularGauge-Tooltip',
                styles: 'position: absolute;pointer-events:none;'
            });
            document.getElementById(this.gauge.element.id + '_Secondary_Element').appendChild(this.tooltipEle);
        }
    };
    ;
    /**
     * Method to get parent annotation element.
     */
    GaugeTooltip.prototype.checkParentAnnotationId = function (child) {
        this.annotationTargetElement = child.parentElement;
        while (this.annotationTargetElement != null) {
            if ((this.annotationTargetElement.id.indexOf('_Annotation_') >= 0)) {
                child = this.annotationTargetElement;
                return true;
            }
            this.annotationTargetElement = this.annotationTargetElement.parentElement;
        }
        return false;
    };
    /**
     * Method to apply label rounding places.
     */
    GaugeTooltip.prototype.roundedValue = function (currentValue) {
        var roundNumber;
        roundNumber = this.currentAxis.roundingPlaces ?
            parseFloat(currentValue.toFixed(this.currentAxis.roundingPlaces)) :
            currentValue;
        return roundNumber;
    };
    /**
     * Method to find the position of the tooltip anchor for circular gauge.
     */
    GaugeTooltip.prototype.findPosition = function (rect, angle, text, location) {
        var addLeft;
        var addTop;
        var addHeight;
        var addWidth;
        switch (true) {
            case (angle >= 0 && angle < 45):
                this.arrowInverted = true;
                addLeft = (angle >= 15 && angle <= 30) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'RightBottom';
                break;
            case (angle >= 45 && angle < 90):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomRight';
                break;
            case (angle >= 90 && angle < 135):
                this.arrowInverted = false;
                this.tooltipRect = new Rect(rect.x, rect.y + location.y, rect.width, rect.height);
                this.tooltipPosition = 'BottomLeft';
                break;
            case (angle >= 135 && angle < 180):
                this.arrowInverted = true;
                addTop = (angle >= 150 && angle <= 160) ? location.y : 0;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y + addTop, rect.width, rect.height);
                this.tooltipPosition = 'LeftBottom';
                break;
            case (angle >= 180 && angle < 225):
                this.arrowInverted = true;
                addHeight = (angle >= 200 && angle <= 225) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x - rect.width, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'LeftTop';
                break;
            case (angle >= 225 && angle < 270):
                this.arrowInverted = false;
                addWidth = (angle >= 250 && angle <= 290) ? rect.width : Math.abs(rect.x - location.x);
                this.tooltipRect = new Rect(rect.x, rect.y, addWidth, rect.height);
                this.tooltipPosition = 'TopLeft';
                break;
            case (angle >= 270 && angle < 315):
                this.arrowInverted = false;
                addLeft = (angle >= 270 && angle > 290) ? location.x : 0;
                this.tooltipRect = new Rect(rect.x + addLeft, rect.y, rect.width, rect.height);
                this.tooltipPosition = 'TopRight';
                break;
            case (angle >= 315 && angle <= 360):
                this.arrowInverted = true;
                addHeight = (angle >= 315 && angle <= 340) ? Math.abs(rect.y - location.y) : rect.height;
                this.tooltipRect = new Rect(rect.x, rect.y, rect.width, addHeight);
                this.tooltipPosition = 'RightTop';
                break;
        }
        return this.tooltipRect;
    };
    GaugeTooltip.prototype.removeTooltip = function () {
        if (document.getElementsByClassName('EJ2-CircularGauge-Tooltip').length > 0) {
            var tooltip = document.getElementsByClassName('EJ2-CircularGauge-Tooltip')[0];
            if (tooltip) {
                remove(tooltip);
            }
            this.pointerEle = null;
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
    /**
     * Get module name.
     */
    GaugeTooltip.prototype.getModuleName = function () {
        // Returns te module name
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
