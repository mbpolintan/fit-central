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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Complex, NotifyPropertyChanges, Property, isBlazor } from '@syncfusion/ej2-base';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { createElement, remove, Event, EventHandler } from '@syncfusion/ej2-base';
import { createSvg, RectOption, measureText, TextOption, renderTextElement } from '../smithchart/utils/helper';
import { removeElement, textTrim } from '../smithchart/utils/helper';
import { SmithchartRect } from '../smithchart/utils/utils';
import { SmithchartMargin, SmithchartBorder, SmithchartFont } from '../smithchart/utils/utils';
import { getThemeColor } from '../smithchart/model/theme';
import { SmithchartLegendSettings } from '../smithchart/legend/legend';
import { SmithchartAxis } from '../smithchart/axis/axis';
import { Title } from '../smithchart/title/title';
import { SmithchartSeries } from '../smithchart/series/series';
import { AreaBounds } from '../smithchart/utils/area';
import { AxisRender } from '../smithchart/axis/axisrender';
import { SeriesRender } from '../smithchart/series/seriesrender';
import { Collection } from '@syncfusion/ej2-base';
import { getSeriesColor } from '../smithchart/model/theme';
import { ExportUtils } from '../smithchart/utils/export';
import { titleRender, subtitleRender, load, loaded } from '../smithchart/model/constant';
/* tslint:disable:no-string-literal */
/**
 * Represents the Smithchart control.
 * ```html
 * <div id="smithchart"/>
 * <script>
 *   var chartObj = new Smithchart({ isResponsive : true });
 *   chartObj.appendTo("#smithchart");
 * </script>
 * ```
 */
var Smithchart = /** @class */ (function (_super) {
    __extends(Smithchart, _super);
    /**
     * Constructor for creating the Smithchart widget
     */
    function Smithchart(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Get component name
     */
    Smithchart.prototype.getModuleName = function () {
        return 'smithchart';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    Smithchart.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Method to create SVG element.
     */
    Smithchart.prototype.createChartSvg = function () {
        this.removeSvg();
        createSvg(this);
    };
    Smithchart.prototype.renderTitle = function (title, type, groupEle) {
        var _this = this;
        var font = title.font ? title.font : title.textStyle;
        var textSize = measureText(title.text, font);
        var x;
        var y;
        var textAlignment = title.textAlignment;
        var titleText = title.text;
        var maxTitleWidth = (isNullOrUndefined(title.maximumWidth)) ?
            Math.abs(this.margin.left + this.margin.right - (this.availableSize.width)) :
            title.maximumWidth;
        var titleWidthEnable = textSize.width > maxTitleWidth ? true : false;
        if (textSize.width > this.availableSize.width) {
            x = this.margin.left + this.border.width;
        }
        else {
            x = textAlignment === 'Center' ? (this.availableSize.width / 2 - textSize['width'] / 2) :
                (textAlignment === 'Near' ? (this.margin.left + this.elementSpacing + this.border.width) : (this.availableSize.width
                    - textSize['width'] - (this.margin.right + this.elementSpacing + this.border.width)));
        }
        y = this.margin.top + textSize['height'] / 2 + this.elementSpacing;
        if (title.enableTrim && titleWidthEnable) {
            titleText = textTrim(maxTitleWidth, title.text, font);
            textSize = measureText(titleText, font);
        }
        groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
        var titleEventArgs = {
            text: titleText,
            x: x,
            y: y,
            name: titleRender,
            cancel: false
        };
        var options;
        var titleRenderSuccess = function (args) {
            if (!args.cancel) {
                options = new TextOption(_this.element.id + '_Smithchart_' + type, args.x, args.y, 'start', args.text);
                font.fontFamily = _this.themeStyle.fontFamily || title.textStyle.fontFamily;
                font.size = _this.themeStyle.fontSize || title.textStyle.size;
                var element = renderTextElement(options, font, _this.themeStyle.chartTitle, groupEle);
                element.setAttribute('aria-label', title.description || args.text);
                var titleLocation = { x: args.x, y: args.y, textSize: textSize };
                _this.svgObject.appendChild(groupEle);
                if (title.subtitle.text !== '' && title.subtitle.visible) {
                    _this.renderSubtitle(title, type, textSize, _this.availableSize, titleLocation, groupEle);
                }
            }
        };
        titleRenderSuccess.bind(this);
        this.trigger(titleRender, titleEventArgs, titleRenderSuccess);
    };
    Smithchart.prototype.renderSubtitle = function (title, type, textSize, size, titleLocation, groupEle) {
        var _this = this;
        var x;
        var y;
        var font = title.subtitle.textStyle;
        var subTitle = title.subtitle;
        var subTitleSize = measureText(subTitle.text, font);
        var textAnchor;
        var subTitleText = subTitle.text;
        var maxSubTitleWidth = isNullOrUndefined(subTitle.maximumWidth) ?
            (this.bounds.width * 0.75) : subTitle.maximumWidth;
        if (subTitle.enableTrim && subTitleSize.width > maxSubTitleWidth) {
            subTitleText = textTrim(maxSubTitleWidth, subTitle.text, font);
        }
        x = title['subtitle'].textAlignment === 'Far' ? (titleLocation.x + (titleLocation.textSize.width)) :
            (title['subtitle'].textAlignment === 'Near') ? titleLocation.x :
                (titleLocation.x + (titleLocation.textSize.width / 2));
        y = titleLocation.y + (2 * this.elementSpacing);
        textAnchor = title['subtitle'].textAlignment === 'Far' ? 'end' :
            (title['subtitle'].textAlignment === 'Near') ? 'start' : 'middle';
        var subtitleEventArgs = {
            text: subTitleText,
            x: x,
            y: y,
            name: subtitleRender,
            cancel: false
        };
        var subtitleRenderSuccess = function (args) {
            if (!args.cancel) {
                var options = new TextOption(_this.element.id + '_Smithchart_' + type, args.x, args.y, textAnchor, args.text);
                var element = renderTextElement(options, font, _this.themeStyle.chartTitle, groupEle);
                element.setAttribute('aria-label', subTitle.description || args.text);
                groupEle.appendChild(element);
            }
        };
        subtitleRenderSuccess.bind(this);
        this.trigger(subtitleRender, subtitleEventArgs, subtitleRenderSuccess);
    };
    /**
     * @private
     * Render the smithchart border
     */
    Smithchart.prototype.renderBorder = function () {
        var border = this.border;
        var color = this.theme.toLowerCase() === 'highcontrast' ? '#000000' : '#FFFFFF';
        this.background = this.background ? this.background : this.themeStyle.background;
        var borderRect = new RectOption(this.element.id + '_SmithchartBorder', this.background, border, 1, new SmithchartRect(border.width / 2, border.width / 2, this.availableSize.width - border.width, this.availableSize.height - border.width));
        this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    Smithchart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'background':
                case 'border':
                case 'series':
                case 'legendSettings':
                case 'radius':
                    renderer = true;
                    break;
                case 'size':
                    this.createChartSvg();
                    renderer = true;
                    break;
                case 'theme':
                case 'renderType':
                    this.animateSeries = true;
                    renderer = true;
                    break;
            }
        }
        if (renderer) {
            this.render();
        }
    };
    /**
     * Initialize the event handler.
     */
    Smithchart.prototype.preRender = function () {
        this.isBlazor = isBlazor();
        this.allowServerDataBinding = false;
        this.trigger(load, { smithchart: !this.isBlazor ? this : null });
        this.unWireEVents();
        this.initPrivateVariable();
        this.wireEVents();
    };
    Smithchart.prototype.initPrivateVariable = function () {
        this.animateSeries = true;
    };
    /**
     * To Initialize the control rendering.
     */
    Smithchart.prototype.setTheme = function () {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
        this.seriesColors = getSeriesColor(this.theme);
        // let count: number = colors.length;
        // for (let i: number = 0; i < this.series.length; i++) {
        //     this.series[i].fill = this.series[i].fill ? this.series[i].fill : colors[i % count];
        // }
    };
    Smithchart.prototype.render = function () {
        this.createChartSvg();
        this.element.appendChild(this.svgObject);
        this.setTheme();
        this.createSecondaryElement();
        this.renderBorder();
        if (this.smithchartLegendModule && this.legendSettings.visible) {
            this.legendBounds = this.smithchartLegendModule.renderLegend(this);
        }
        this.legendBounds = this.legendBounds ? this.legendBounds : { x: 0, y: 0, width: 0, height: 0 };
        var areaBounds = new AreaBounds();
        this.bounds = areaBounds.calculateAreaBounds(this, this.title, this.legendBounds);
        if (this.title.text !== '' && this.title.visible) {
            this.renderTitle(this.title, 'title', null);
        }
        var axisRender = new AxisRender();
        axisRender.renderArea(this, this.bounds);
        this.seriesrender = new SeriesRender();
        this.seriesrender.draw(this, axisRender, this.bounds);
        this.renderComplete();
        this.allowServerDataBinding = true;
        this.trigger(loaded, { smithchart: !this.isBlazor ? this : null });
    };
    Smithchart.prototype.createSecondaryElement = function () {
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
            var rect = this.element.getBoundingClientRect();
            var svgRect = document.getElementById(this.element.id + '_svg');
            if (svgRect) {
                var svgClientRect = svgRect.getBoundingClientRect();
                secondaryElement.style.left = Math.max(svgClientRect.left - rect.left, 0) + 'px';
                secondaryElement.style.top = Math.max(svgClientRect.top - rect.top, 0) + 'px';
            }
        }
        else {
            removeElement(this.element.id + '_Secondary_Element');
        }
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of smithChart
     */
    Smithchart.prototype.destroy = function () {
        this.unWireEVents();
        _super.prototype.destroy.call(this);
        this.element.classList.remove('e-smithchart');
    };
    /**
     * To bind event handlers for smithchart.
     */
    Smithchart.prototype.wireEVents = function () {
        EventHandler.add(this.element, 'click', this.smithchartOnClick, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.smithchartOnResize.bind(this));
    };
    Smithchart.prototype.mouseMove = function (e) {
        if (e.type === 'touchmove') {
            this.isTouch = true;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || this.isTouch;
        }
        if (this.tooltipRenderModule && !this.isTouch) {
            this.tooltipRenderModule.smithchartMouseMove(this, e);
        }
    };
    Smithchart.prototype.mouseEnd = function (e) {
        if (e.type === 'touchend') {
            this.isTouch = true;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
        }
        if (this.tooltipRenderModule && this.isTouch) {
            var tooltipElement_1 = this.tooltipRenderModule.smithchartMouseMove(this, e);
            if (tooltipElement_1) {
                this.fadeoutTo = setTimeout(function () {
                    tooltipElement_1.fadeOut();
                }, 2000);
            }
        }
    };
    /**
     * To handle the click event for the smithchart.
     */
    /* tslint:disable:no-string-literal */
    Smithchart.prototype.smithchartOnClick = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var parentElement = document.getElementById(targetId).parentElement;
        var grpElement = document.getElementById(parentElement.id).parentElement;
        if (grpElement.id === 'containerlegendItem_Group' && this.legendSettings.toggleVisibility) {
            var childElement = parentElement.childNodes[1];
            var circleElement = parentElement.childNodes[0];
            var legendText = childElement.textContent;
            var seriesIndex = void 0;
            var fill = void 0;
            for (var i = 0; i < this.smithchartLegendModule.legendSeries.length; i++) {
                if (legendText === this.smithchartLegendModule.legendSeries[i]['text']) {
                    seriesIndex = this.smithchartLegendModule.legendSeries[i].seriesIndex;
                    fill = this.smithchartLegendModule.legendSeries[i].fill;
                }
            }
            var seriesElement = document.getElementById(this.element.id + '_svg' + '_seriesCollection' + seriesIndex);
            if (seriesElement.getAttribute('visibility') === 'visible') {
                circleElement.setAttribute('fill', 'gray');
                seriesElement.setAttribute('visibility', 'hidden');
                this.series[seriesIndex].visibility = 'hidden';
            }
            else {
                circleElement.setAttribute('fill', fill);
                seriesElement.setAttribute('visibility', 'visible');
                this.series[seriesIndex].visibility = 'visible';
            }
        }
    };
    /**
     * To unbind event handlers from smithchart.
     */
    Smithchart.prototype.unWireEVents = function () {
        EventHandler.remove(this.element, 'click', this.smithchartOnClick);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.smithchartOnResize);
    };
    Smithchart.prototype.print = function (id) {
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
    };
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    Smithchart.prototype.export = function (type, fileName, orientation) {
        var exportMap = new ExportUtils(this);
        exportMap.export(type, fileName, orientation);
    };
    /**
     * To handle the window resize event on smithchart.
     */
    Smithchart.prototype.smithchartOnResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            _this.render();
        }, 500);
        return false;
    };
    /**
     * To provide the array of modules needed for smithchart rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    Smithchart.prototype.requiredModules = function () {
        var modules = [];
        if (this.legendSettings.visible) {
            modules.push({
                member: 'SmithchartLegend',
                args: [this]
            });
        }
        for (var i = 0; i < this.series.length; i++) {
            if (this.series[i].tooltip.visible) {
                modules.push({
                    member: 'TooltipRender',
                    args: [this]
                });
                break;
            }
        }
        return modules;
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    Smithchart.prototype.removeSvg = function () {
        removeElement(this.element.id + '_Secondary_Element');
        var removeLength = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    };
    __decorate([
        Property('Impedance')
    ], Smithchart.prototype, "renderType", void 0);
    __decorate([
        Property('')
    ], Smithchart.prototype, "width", void 0);
    __decorate([
        Property('')
    ], Smithchart.prototype, "height", void 0);
    __decorate([
        Property('Material')
    ], Smithchart.prototype, "theme", void 0);
    __decorate([
        Complex({}, SmithchartMargin)
    ], Smithchart.prototype, "margin", void 0);
    __decorate([
        Complex({}, SmithchartFont)
    ], Smithchart.prototype, "font", void 0);
    __decorate([
        Complex({}, SmithchartBorder)
    ], Smithchart.prototype, "border", void 0);
    __decorate([
        Complex({}, Title)
    ], Smithchart.prototype, "title", void 0);
    __decorate([
        Collection([{}], SmithchartSeries)
    ], Smithchart.prototype, "series", void 0);
    __decorate([
        Complex({}, SmithchartLegendSettings)
    ], Smithchart.prototype, "legendSettings", void 0);
    __decorate([
        Complex({}, SmithchartAxis)
    ], Smithchart.prototype, "horizontalAxis", void 0);
    __decorate([
        Complex({}, SmithchartAxis)
    ], Smithchart.prototype, "radialAxis", void 0);
    __decorate([
        Property(null)
    ], Smithchart.prototype, "background", void 0);
    __decorate([
        Property(10)
    ], Smithchart.prototype, "elementSpacing", void 0);
    __decorate([
        Property(1)
    ], Smithchart.prototype, "radius", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "load", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "legendRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "titleRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "subtitleRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "textRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "axisLabelRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "seriesRender", void 0);
    __decorate([
        Event()
    ], Smithchart.prototype, "tooltipRender", void 0);
    Smithchart = __decorate([
        NotifyPropertyChanges
    ], Smithchart);
    return Smithchart;
}(Component));
export { Smithchart };
