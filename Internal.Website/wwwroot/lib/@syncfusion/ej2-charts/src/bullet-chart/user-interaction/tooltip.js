import { compile as templateComplier, updateBlazorTemplate, isBlazor } from '@syncfusion/ej2-base';
import { stringToNumber } from '../../common/utils/helper';
import { tooltipRender } from '../../common/model/constants';
import { BulletChartTheme } from '../utils/theme';
import { BulletChartAxis } from '../renderer/bullet-axis';
/**
 * `BulletTooltip` module is used to render the tooltip for bullet chart.
 */
var BulletTooltip = /** @class */ (function () {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    function BulletTooltip(bullet) {
        this.control = bullet;
        this.elementId = bullet.element.id;
        this.bulletAxis = new BulletChartAxis(this.control);
    }
    /**
     * To create tooltip div element
     */
    BulletTooltip.prototype._elementTooltip = function (e, targetClass, targetId, mouseX, mouseY) {
        var titleStyle = this.control.titleStyle;
        var tooltipDiv = this.control.createElement('div');
        tooltipDiv.id = 'tooltip';
        tooltipDiv.className = 'tooltipDiv';
        var target = e.target;
        var pointer = e;
        var pageX = mouseX + 20;
        var pageY = e.clientY;
        var str = '';
        var font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
            BulletChartTheme.tooltipLabelFont.fontStyle;
        var fill = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
        var color = BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
        var fontSize = BulletChartTheme.titleFont.size;
        var style = 'left:' + pageX + 'px;' + 'top:' + pageY + 'px;' +
            'display: block; position: absolute; "z-index": "13000",cursor: default;' +
            'font-family: Segoe UI;' + 'color:' + color + '; font-size: 13px; background-color:' +
            fill + '; border: 1px solid #707070;' + 'font-style:' + font + ';';
        // adding css prop to the div
        tooltipDiv.setAttribute('style', style);
        if (targetClass === this.control.svgObject.id + '_Caption') {
            str = target.textContent === this.control.title ? '' : this.control.title;
        }
        else if (targetClass === this.control.svgObject.id + '_SubTitle') {
            str = target.textContent === this.control.subtitle ? '' : this.control.subtitle;
        }
        if (str !== '') {
            tooltipDiv.innerHTML = '&nbsp' + str + '&nbsp';
            document.body.insertAdjacentElement('afterbegin', tooltipDiv);
        }
    };
    /**
     * To display the bullet chart tooltip
     */
    // tslint:disable-next-line:max-func-body-length
    BulletTooltip.prototype._displayTooltip = function (e, targetClass, targetId, mouseX, mouseY) {
        if (targetClass !== 'undefined' && this.control.tooltip.enable && (targetClass === this.control.svgObject.id + '_FeatureMeasure' ||
            targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
            var locale = this.control.locale;
            var localizedText = locale && this.control.enableGroupSeparator;
            var data = void 0;
            var blazorTooltipData = void 0;
            var measureId = void 0;
            var currentVal = void 0;
            var targetVal = [];
            var categoryVal = void 0;
            var tooltipdiv = void 0;
            var pointer = e;
            var format = this.bulletAxis.getFormat(this.control);
            var isCustomFormat = format.match('{value}') !== null;
            measureId = targetId.substring(targetId.lastIndexOf('_') + 1);
            var targetValues = [];
            this.bulletAxis.format = this.bulletAxis.bulletChart.intl.getNumberFormat({
                format: isCustomFormat ? '' : format, useGrouping: this.bulletAxis.bulletChart.enableGroupSeparator
            });
            currentVal = this.control.dataSource[measureId][this.control.valueField];
            targetVal = targetVal.concat(this.control.dataSource[measureId][this.control.targetField]);
            categoryVal = this.control.dataSource[measureId][this.control.categoryField];
            var labelCurrentText = currentVal ? (currentVal).toString() : '';
            var labelTargetText = targetVal ? (targetVal).toString() : '';
            var labelCategoryText = categoryVal ? (categoryVal).toString() : '';
            labelCurrentText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +currentVal);
            for (var i = 0; i < targetVal.length; i++) {
                // tslint:disable-next-line:max-line-length
                targetValues = targetValues.concat(this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +targetVal[i]));
            }
            labelCategoryText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +categoryVal);
            data = { value: labelCurrentText, target: targetValues, category: labelCategoryText };
            blazorTooltipData = { value: labelCurrentText, target: labelTargetText, category: labelCategoryText };
            var style = 'position: absolute; z-index: 13000; display: block;';
            if (document.getElementsByClassName('tooltipDiv' + this.control.element.id).length === 0) {
                tooltipdiv = this.control.createElement('div');
                tooltipdiv.id = 'tooltipDiv' + this.control.element.id;
                tooltipdiv.setAttribute('style', style);
                document.getElementById(this.control.element.id + '_Secondary_Element').appendChild(tooltipdiv);
            }
            var argsData = {
                value: data.value, target: data.target, name: tooltipRender
            };
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                this.updateTemplateFn();
                var elem = this.control.createElement('div', { id: this.control.element.id + 'parent_template' });
                var templateElement = this.templateFn(blazorTooltipData, null, null, elem.id + '_blazorTemplate', '');
                while (templateElement && templateElement.length > 0) {
                    if (isBlazor()) {
                        elem.appendChild(templateElement[0]);
                        templateElement = null;
                    }
                    else {
                        elem.appendChild(templateElement[0]);
                    }
                }
                argsData.template = elem.innerHTML;
                this.control.trigger(tooltipRender, argsData);
                elem.innerHTML = argsData.template;
                tooltipdiv.appendChild(elem);
            }
            else {
                var argsText = 'Value : ' + argsData.value;
                for (var i = 0; i < argsData.target.length; i++) {
                    argsText += '<br/> Target' + (i === 0 ? '' : '_' + i) + ' : ' + argsData.target[i];
                }
                argsData.text = argsText;
                this.control.trigger(tooltipRender, argsData);
                tooltipdiv.innerHTML = argsData.text;
                tooltipdiv.style.font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
                    BulletChartTheme.tooltipLabelFont.fontStyle;
                tooltipdiv.style.color = BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
                tooltipdiv.style.fontSize = BulletChartTheme.titleFont.size;
            }
            var fill = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
            var borderWidth = this.control.tooltip.border.width ? this.control.tooltip.border.width : 1;
            var borderColor = this.control.tooltip.border.color ? this.control.tooltip.border.color : 'Black';
            var xPos = mouseX;
            var yPos = mouseY;
            xPos = ((xPos + stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth) < window.innerWidth) ?
                (xPos) : stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth));
            yPos = ((yPos + stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight) < window.innerHeight) ?
                (yPos) : stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight));
            if (xPos === undefined || xPos === null) {
                xPos = mouseX;
            }
            if (yPos === undefined || yPos === null) {
                yPos = e.clientY;
            }
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                tooltipdiv.setAttribute('style', 'position: absolute;left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;');
                if (isBlazor()) {
                    updateBlazorTemplate(this.control.element.id + 'parent_template' + '_blazorTemplate', 'Template', this.control.tooltip);
                }
            }
            else {
                var divStyle = style + 'left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;' +
                    '-webkit-border-radius: 5px 5px 5px 5px; -moz-border-radius: 5px 5px 5px 5px;-o-border-radius: 5px 5px 5px 5px;' +
                    'border-radius: 5px 5px 5px 5px;' + 'background-color:' + fill + ';' + 'color:' +
                    tooltipdiv.style.color + '; border:' + borderWidth + 'px Solid' + ' ' + borderColor + ';' +
                    'padding-bottom: 7px;' + 'font-style:' + BulletChartTheme.tooltipLabelFont.fontStyle +
                    '; padding-left: 10px; font-family: Segoe UI; padding-right: 10px; padding-top: 7px';
                tooltipdiv.setAttribute('style', divStyle);
                if ((targetClass === this.control.svgObject.id + '_FeatureMeasure') ||
                    (targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
                    document.getElementById(targetId).setAttribute('opacity', '0.6');
                }
            }
        }
    };
    /**
     * To update template values in the tooltip
     */
    BulletTooltip.prototype.updateTemplateFn = function () {
        if (this.control.tooltip.template) {
            var e = void 0;
            try {
                if (document.querySelectorAll(this.control.tooltip.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.control.tooltip.template).innerHTML.trim());
                }
            }
            catch (e) {
                this.templateFn = templateComplier(this.control.tooltip.template);
            }
        }
    };
    /**
     * Get module name.
     */
    BulletTooltip.prototype.getModuleName = function () {
        return 'BulletTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    BulletTooltip.prototype.destroy = function (chart) {
        // Destroy method called here
    };
    return BulletTooltip;
}());
export { BulletTooltip };
