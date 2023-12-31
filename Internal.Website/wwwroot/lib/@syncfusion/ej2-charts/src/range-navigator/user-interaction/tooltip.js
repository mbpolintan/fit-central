import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { getElement, createTemplate, firstToLowerCase } from '../../common/utils/helper';
import { stopTimer } from '../../common/utils/helper';
import { measureText } from '@syncfusion/ej2-svg-base';
import { createElement } from '@syncfusion/ej2-base';
/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
var RangeTooltip = /** @class */ (function () {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    function RangeTooltip(range) {
        this.control = range;
        this.elementId = range.element.id;
    }
    /**
     * Left tooltip method called here
     * @param rangeSlider
     */
    RangeTooltip.prototype.renderLeftTooltip = function (rangeSlider) {
        this.fadeOutTooltip();
        var content = this.getTooltipContent(rangeSlider.currentStart);
        var contentWidth = this.getContentSize(content);
        var rect = this.control.enableRtl ? rangeSlider.rightRect : rangeSlider.leftRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
        }
        this.leftTooltip = this.renderTooltip(rect, this.createElement('_leftTooltip'), rangeSlider.startX, content);
    };
    /**
     * get the content size
     * @param value
     */
    RangeTooltip.prototype.getContentSize = function (value) {
        var width;
        var font = this.control.tooltip.textStyle;
        if (this.control.tooltip.template) {
            width = createTemplate(createElement('div', {
                id: 'measureElement',
                styles: 'position: absolute;'
            }), 0, this.control.tooltip.template, this.control).getBoundingClientRect().width;
        }
        else {
            // 20 for tooltip padding
            width = measureText(value[0], font).width + 20;
        }
        return width;
    };
    /**
     * Right tooltip method called here
     * @param rangeSlider
     */
    RangeTooltip.prototype.renderRightTooltip = function (rangeSlider) {
        this.fadeOutTooltip();
        var content = this.getTooltipContent(rangeSlider.currentEnd);
        var contentWidth = this.getContentSize(content);
        var rect = this.control.enableRtl ? rangeSlider.leftRect : rangeSlider.rightRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
            rect.x = !this.control.series.length ? rect.x : 0;
        }
        this.rightTooltip = this.renderTooltip(rect, this.createElement('_rightTooltip'), rangeSlider.endX, content);
    };
    /**
     * Tooltip element creation
     * @param id
     */
    RangeTooltip.prototype.createElement = function (id) {
        if (getElement(this.elementId + id)) {
            return getElement(this.elementId + id);
        }
        else {
            var element = document.createElement('div');
            element.id = this.elementId + id;
            element.className = 'ejSVGTooltip';
            element.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
            if (!this.control.stockChart) {
                getElement(this.elementId + '_Secondary_Element').appendChild(element);
            }
            else {
                var stockChart = this.control.stockChart;
                getElement(stockChart.element.id + '_Secondary_Element').appendChild(element);
                element.style.transform = 'translateY(' + (((stockChart.availableSize.height - stockChart.toolbarHeight - 80) +
                    stockChart.toolbarHeight) + stockChart.titleSize.height) + 'px)';
            }
            return element;
        }
    };
    /**
     * Tooltip render called here
     * @param bounds
     * @param parent
     * @param pointX
     * @param value
     */
    RangeTooltip.prototype.renderTooltip = function (bounds, parent, pointX, content) {
        var control = this.control;
        var tooltip = control.tooltip;
        var argsData = {
            cancel: false, name: 'tooltipRender', text: content,
            textStyle: tooltip.textStyle
        };
        this.control.trigger('tooltipRender', argsData);
        var left = control.svgObject.getBoundingClientRect().left -
            control.element.getBoundingClientRect().left;
        if (!argsData.cancel) {
            return new SVGTooltip({
                location: { x: pointX, y: control.rangeSlider.sliderY },
                content: argsData.text, marginX: 2,
                enableShadow: false,
                marginY: 2, arrowPadding: 8, rx: 0, ry: 0,
                inverted: control.series.length > 0,
                areaBounds: bounds, fill: tooltip.fill,
                theme: this.control.theme,
                //enableShadow: false,
                clipBounds: { x: left },
                border: tooltip.border, opacity: tooltip.opacity,
                template: tooltip.template,
                textStyle: argsData.textStyle,
                availableSize: control.availableSize,
                data: {
                    'start': this.getTooltipContent(this.control.startValue)[0],
                    'end': this.getTooltipContent(this.control.endValue)[0],
                    'value': content[0]
                }
            }, parent);
        }
        else {
            return null;
        }
    };
    /**
     * Tooltip content processed here
     * @param value
     */
    RangeTooltip.prototype.getTooltipContent = function (value) {
        var control = this.control;
        var tooltip = control.tooltip;
        var xAxis = control.chartSeries.xAxis;
        var text;
        var format = tooltip.format || xAxis.labelFormat;
        var isCustom = format.match('{value}') !== null;
        var valueType = xAxis.valueType;
        if (valueType === 'DateTime') {
            text = (control.intl.getDateFormat({
                format: format || 'MM/dd/yyyy',
                type: firstToLowerCase(control.skeletonType),
                skeleton: control.dateTimeModule.getSkeleton(xAxis, null, null, control.isBlazor)
            }))(new Date(value));
        }
        else {
            xAxis.format = control.intl.getNumberFormat({
                format: isCustom ? '' : format,
                useGrouping: control.useGroupingSeparator
            });
            text = control.doubleModule.formatValue(xAxis, isCustom, format, valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, value) : value);
        }
        return [text];
    };
    /**
     * Fadeout animation performed here
     */
    RangeTooltip.prototype.fadeOutTooltip = function () {
        var _this = this;
        var tooltip = this.control.tooltip;
        if (tooltip.displayMode === 'OnDemand') {
            stopTimer(this.toolTipInterval);
            if (this.rightTooltip) {
                this.toolTipInterval = setTimeout(function () {
                    _this.leftTooltip.fadeOut();
                    _this.rightTooltip.fadeOut();
                }, 1000);
            }
        }
    };
    /**
     * Get module name.
     */
    RangeTooltip.prototype.getModuleName = function () {
        return 'RangeTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    RangeTooltip.prototype.destroy = function (chart) {
        // Destroy method called here
    };
    return RangeTooltip;
}());
export { RangeTooltip };
