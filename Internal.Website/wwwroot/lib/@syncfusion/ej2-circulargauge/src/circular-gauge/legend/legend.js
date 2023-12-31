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
import { appendPath, textElement, PathOption, TextOption, calculateShapes, textTrim, removeElement } from '../utils/helper';
import { Rect, Size, GaugeLocation, stringToNumber, measureText, RectOption, getElement, showTooltip } from '../utils/helper';
import { Property, Complex, ChildProperty, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Font, Border, Margin } from '../model/base';
import { Theme } from '../model/theme';
/**
 * Sets and gets the location of the legend in circular gauge.
 */
var Location = /** @class */ (function (_super) {
    __extends(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], Location.prototype, "x", void 0);
    __decorate([
        Property(0)
    ], Location.prototype, "y", void 0);
    return Location;
}(ChildProperty));
export { Location };
/**
 * Sets and gets the options to customize the legend for the ranges in the circular gauge.
 */
var LegendSettings = /** @class */ (function (_super) {
    __extends(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(false)
    ], LegendSettings.prototype, "visible", void 0);
    __decorate([
        Property(true)
    ], LegendSettings.prototype, "toggleVisibility", void 0);
    __decorate([
        Property('Center')
    ], LegendSettings.prototype, "alignment", void 0);
    __decorate([
        Complex({}, Border)
    ], LegendSettings.prototype, "border", void 0);
    __decorate([
        Complex({}, Border)
    ], LegendSettings.prototype, "shapeBorder", void 0);
    __decorate([
        Property(8)
    ], LegendSettings.prototype, "padding", void 0);
    __decorate([
        Property(1)
    ], LegendSettings.prototype, "opacity", void 0);
    __decorate([
        Property('Auto')
    ], LegendSettings.prototype, "position", void 0);
    __decorate([
        Property('Circle')
    ], LegendSettings.prototype, "shape", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], LegendSettings.prototype, "width", void 0);
    __decorate([
        Complex(Theme.legendLabelFont, Font)
    ], LegendSettings.prototype, "textStyle", void 0);
    __decorate([
        Property(10)
    ], LegendSettings.prototype, "shapeHeight", void 0);
    __decorate([
        Property(10)
    ], LegendSettings.prototype, "shapeWidth", void 0);
    __decorate([
        Property(5)
    ], LegendSettings.prototype, "shapePadding", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, Location)
    ], LegendSettings.prototype, "location", void 0);
    __decorate([
        Property('transparent')
    ], LegendSettings.prototype, "background", void 0);
    __decorate([
        Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    ], LegendSettings.prototype, "margin", void 0);
    return LegendSettings;
}(ChildProperty));
export { LegendSettings };
/*
 * Sets and gets the module to add the legend in the circular gauge.
 */
var Legend = /** @class */ (function () {
    function Legend(gauge) {
        this.legendRegions = [];
        this.rowCount = 0; // legend row counts per page
        this.pageButtonSize = 8;
        this.pageXCollections = []; // pages of x locations
        this.maxColumns = 0;
        this.maxWidth = 0;
        this.currentPage = 1;
        this.pagingRegions = [];
        /**  @private */
        this.position = 'Auto';
        this.gauge = gauge;
        this.toggledIndexes = [];
        this.legend = this.gauge.legendSettings;
        this.legendID = this.gauge.element.id + '_gauge_legend';
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     */
    Legend.prototype.addEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        //   this.gauge.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.gauge.on('click', this.click, this);
        // this.gauge.on(Browser.touchEndEvent, this.mouseEnd, this);
    };
    /**
     * UnBinding events for legend module.
     */
    Legend.prototype.removeEventListener = function () {
        if (this.gauge.isDestroyed) {
            return;
        }
        //  this.gauge.off(Browser.touchMoveEvent, this.mouseMove);
        this.gauge.off('click', this.click);
        //  this.gauge.off(Browser.touchEndEvent, this.mouseEnd);
    };
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    Legend.prototype.getLegendOptions = function (axes) {
        this.legendCollection = [];
        var range;
        var text = '';
        for (var i = 0; i < axes.length; i++) {
            for (var j = 0; j < axes[i].ranges.length; j++) {
                range = axes[i].ranges[j];
                if (!isNullOrUndefined(range.start) && !isNullOrUndefined(range.end) && (range.start !== range.end)) {
                    text = range.legendText ? range.legendText : range.start + ' - ' + range.end;
                    this.legendCollection.push(new LegendOptions(text, text, range.color, this.legend.shape, this.legend.visible, this.legend.border, this.legend.shapeBorder, this.legend.shapeWidth, this.legend.shapeHeight, j, i));
                }
            }
        }
    };
    /* tslint:disable-next-line:max-func-body-length */
    Legend.prototype.calculateLegendBounds = function (rect, availableSize) {
        var legend = this.legend;
        this.position = (legend.position !== 'Auto') ? legend.position :
            (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(legend.height, availableSize.height - (rect.y - this.gauge.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || '20%', availableSize.width);
        }
        else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || '20%', availableSize.height);
        }
        this.getLegendBounds(availableSize, this.legendBounds, legend);
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize);
    };
    /**
     * To find legend alignment for chart and accumulation chart
     */
    Legend.prototype.alignLegend = function (start, size, legendSize, alignment) {
        switch (alignment) {
            case 'Far':
                start = (size - legendSize) - start;
                break;
            case 'Center':
                start = ((size - legendSize) / 2);
                break;
        }
        return start;
    };
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    Legend.prototype.getLocation = function (position, alignment, legendBounds, rect, availableSize) {
        var padding = this.legend.border.width;
        var legendHeight = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom;
        var legendWidth = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right;
        var marginBottom = this.gauge.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            this.subtractThickness(rect, 0, 0, 0, legendHeight);
        }
        else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            this.subtractThickness(rect, 0, 0, legendHeight, 0);
        }
        else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) + this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            this.subtractThickness(rect, 0, legendWidth, 0, 0);
        }
        else {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            this.subtractThickness(rect, legendWidth, 0, 0, 0);
        }
    };
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    Legend.prototype.renderLegend = function (legend, legendBounds, redraw) {
        var firstLegend = this.findFirstLegendPosition(this.legendCollection);
        var padding = legend.padding;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollection[0].textSize.height, legend.shapeHeight);
        var legendGroup = this.gauge.renderer.createGroup({ id: this.legendID + '_g' });
        var legendTranslateGroup = this.createLegendElements(legendBounds, legendGroup, legend, this.legendID, redraw);
        if (firstLegend !== this.legendCollection.length) {
            this.totalPages = 0;
            var legendAxisGroup = void 0; // legendItem group for each series group element
            var start = void 0; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new GaugeLocation(legendBounds.x + padding + (legend.shapeWidth / 2), legendBounds.y + padding + this.maxItemHeight / 2);
            var textOptions = new TextOption('', start.x, start.y, 'start');
            var textPadding = (2 * legend.shapePadding) + (2 * padding) + legend.shapeWidth;
            var count = 0;
            this.pageXCollections = [];
            this.legendCollection[firstLegend].location = start;
            var previousLegend = this.legendCollection[firstLegend];
            for (var _i = 0, _a = this.legendCollection; _i < _a.length; _i++) {
                var legendOption = _a[_i];
                if (legendOption.render && legendOption.text !== '') {
                    legendAxisGroup = this.gauge.renderer.createGroup({
                        id: this.legendID + '_g_' + count
                    });
                    this.getRenderPoint(legendOption, start, textPadding, previousLegend, legendBounds, count, firstLegend);
                    this.renderSymbol(legendOption, legendAxisGroup, legendOption.axisIndex, legendOption.rangeIndex);
                    this.renderText(legendOption, legendAxisGroup, textOptions, legendOption.axisIndex, legendOption.rangeIndex);
                    if (legendAxisGroup) {
                        legendAxisGroup.setAttribute('style', 'cursor: ' + ((!legend.toggleVisibility) ? 'auto' : 'pointer'));
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendAxisGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(legendBounds, textOptions, legendGroup);
            }
            else {
                this.totalPages = 1;
            }
        }
        this.appendChildElement(this.gauge.svgObject, legendGroup, redraw);
        this.setStyles(this.toggledIndexes);
    };
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    Legend.prototype.renderPagingElements = function (bounds, textOption, legendGroup) {
        var paginggroup = this.gauge.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        legendGroup.appendChild(paginggroup);
        var grayColor = '#545454';
        var legend = this.gauge.legendSettings; // to solve parameter lint error, legend declaration is here
        var padding = 8; // const padding for paging elements
        if (!this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        }
        else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        var symbolOption = new PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        var iconSize = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        this.clipPathHeight = (this.rowCount - 1) * (this.maxItemHeight + legend.padding);
        this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        var x = bounds.x + iconSize / 2;
        var y = bounds.y + this.clipPathHeight + ((bounds.height - this.clipPathHeight) / 2);
        var size = measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        appendPath(calculateShapes({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption), paginggroup, this.gauge, 'Path');
        this.pagingRegions.push(new Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5, y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        var pageTextElement = textElement(textOption, legend.textStyle, legend.textStyle.color || this.gauge.themeStyle.labelColor, paginggroup);
        x = (textOption.x + padding + (iconSize / 2) + size.width);
        symbolOption.id = this.legendID + '_pagedown';
        appendPath(calculateShapes({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption), paginggroup, this.gauge, 'Path');
        this.pagingRegions.push(new Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5), y - iconSize * 0.5, iconSize, iconSize));
        //placing the navigation buttons and page numbering in legend right corner
        paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
            padding + size.width)) + ', ' + 0 + ')');
        this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage);
    };
    /**
     * To translate legend pages for chart and accumulation chart
     */
    Legend.prototype.translatePage = function (pagingText, page, pageNumber) {
        var size = (this.clipPathHeight) * page;
        var translate = 'translate(0,-' + size + ')';
        if (this.isVertical) {
            var pageLength = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
        }
        this.legendTranslateGroup.setAttribute('transform', translate);
        pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        this.currentPage = pageNumber;
        return size;
    };
    /**
     * To render legend text for chart and accumulation chart
     */
    Legend.prototype.renderText = function (legendOption, group, textOptions, axisIndex, rangeIndex) {
        var legend = this.gauge.legendSettings;
        var hiddenColor = '#D3D3D3';
        textOptions.id = this.legendID + '_Axis_' + axisIndex + '_text_' + rangeIndex;
        var fontcolor = legendOption.visible ? legend.textStyle.color || this.gauge.themeStyle.labelColor : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        var element = textElement(textOptions, legend.textStyle, fontcolor, group, '');
    };
    /**
     * To render legend symbols for chart and accumulation chart
     */
    Legend.prototype.renderSymbol = function (legendOption, group, axisIndex, rangeIndex) {
        legendOption.fill = legendOption.fill ? legendOption.fill : this.gauge.axes[axisIndex].ranges[rangeIndex].rangeColor;
        appendPath(calculateShapes(legendOption.location, legendOption.shape, new Size(legendOption.shapeWidth, legendOption.shapeHeight), '', new PathOption(this.legendID + '_Axis_' + axisIndex + '_Shape_' + rangeIndex, legendOption.fill, legendOption.shapeBorder.width, legendOption.shapeBorder.color, null, '0', '', '')), group, this.gauge, legendOption.shape === 'Circle' ? 'Ellipse' : 'Path');
    };
    /**
     * To find legend rendering locations from legend options.
     * @private
     */
    Legend.prototype.getRenderPoint = function (legendOption, start, textPadding, prevLegend, rect, count, firstLegend) {
        var padding = this.legend.padding;
        if (this.isVertical) {
            if (count === firstLegend || (prevLegend.location.y + (this.maxItemHeight * 1.5) + (padding * 2) > rect.y + rect.height)) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : this.maxColumnWidth);
                legendOption.location.y = start.y;
                this.pageXCollections.push(legendOption.location.x - (this.legend.shapeWidth / 2) - padding);
                this.totalPages++;
            }
            else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + this.maxItemHeight + padding;
            }
        }
        else {
            var previousBound = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
            if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2)) {
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.maxItemHeight + padding;
                legendOption.location.x = start.x;
            }
            else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
            this.totalPages = this.totalRowCount;
        }
        var availablewidth = this.getAvailWidth(legendOption.location.x, this.legendBounds.width, this.legendBounds.x);
        legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle);
    };
    /**
     * To show or hide the legend on clicking the legend.
     * @return {void}
     */
    Legend.prototype.click = function (event) {
        var targetId = event.target.id;
        var legendItemsId = ['_text_', '_Shape_'];
        var index;
        var toggledIndex = -1;
        if (targetId.indexOf(this.legendID) > -1) {
            for (var _i = 0, legendItemsId_1 = legendItemsId; _i < legendItemsId_1.length; _i++) {
                var id = legendItemsId_1[_i];
                if (targetId.indexOf(id) > -1) {
                    var axisIndex = parseInt(targetId.split(this.legendID + '_Axis_')[1].split(id)[0], 10);
                    var rangeIndex = parseInt(targetId.split(this.legendID + '_Axis_')[1].split(id)[1], 10);
                    if (this.gauge.legendSettings.toggleVisibility && !isNaN(rangeIndex)) {
                        var legendOption = this.legendByIndex(axisIndex, rangeIndex, this.legendCollection);
                        index = new Index(axisIndex, rangeIndex, !legendOption.render);
                        if (this.toggledIndexes.length === 0) {
                            this.toggledIndexes.push(index);
                        }
                        else {
                            for (var i = 0; i < this.toggledIndexes.length; i++) {
                                if (this.toggledIndexes[i].axisIndex === index.axisIndex &&
                                    this.toggledIndexes[i].rangeIndex === index.rangeIndex) {
                                    toggledIndex = i;
                                    break;
                                }
                                else {
                                    toggledIndex = -1;
                                }
                            }
                            if (toggledIndex === -1) {
                                this.toggledIndexes.push(index);
                            }
                            else {
                                this.toggledIndexes[toggledIndex].isToggled = !this.toggledIndexes[toggledIndex].isToggled;
                            }
                        }
                        this.setStyles(this.toggledIndexes);
                    }
                }
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
        else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
    };
    /**
     * Set toggled legend styles.
     */
    Legend.prototype.setStyles = function (toggledIndexes) {
        for (var i = 0; i < toggledIndexes.length; i++) {
            var rangeID = this.gauge.element.id + '_Axis_' + toggledIndexes[i].axisIndex + '_Range_' + toggledIndexes[i].rangeIndex;
            var shapeID = this.legendID + '_Axis_' + toggledIndexes[i].axisIndex + '_Shape_' + toggledIndexes[i].rangeIndex;
            var textID = this.legendID + '_Axis_' + toggledIndexes[i].axisIndex + '_text_' + toggledIndexes[i].rangeIndex;
            var rangeElement = this.gauge.svgObject.querySelector('#' + rangeID);
            var shapeElement = this.gauge.svgObject.querySelector('#' + shapeID);
            var textElement_1 = this.gauge.svgObject.querySelector('#' + textID);
            if (toggledIndexes[i].isToggled) {
                rangeElement.style.visibility = 'visible';
                shapeElement.setAttribute('fill', this.legendCollection[toggledIndexes[i].rangeIndex].fill);
                textElement_1.setAttribute('fill', this.legend.textStyle.color || this.gauge.themeStyle.labelColor);
            }
            else {
                var hiddenColor = '#D3D3D3';
                rangeElement.style.visibility = 'hidden';
                shapeElement.setAttribute('fill', hiddenColor);
                textElement_1.setAttribute('fill', hiddenColor);
            }
        }
    };
    /**
     * To get legend by index
     */
    Legend.prototype.legendByIndex = function (axisIndex, rangeIndex, legendCollections) {
        for (var _i = 0, legendCollections_1 = legendCollections; _i < legendCollections_1.length; _i++) {
            var legend = legendCollections_1[_i];
            if (legend.axisIndex === axisIndex && legend.rangeIndex === rangeIndex) {
                return legend;
            }
        }
        return null;
    };
    /**
     * To change legend pages for chart and accumulation chart
     */
    Legend.prototype.changePage = function (event, pageUp) {
        var pageText = document.getElementById(this.legendID + '_pagenumber');
        var page = parseInt(pageText.textContent.split('/')[0], 10);
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1));
        }
        else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1));
        }
    };
    /**
     * To find available width from legend x position.
     */
    Legend.prototype.getAvailWidth = function (tx, width, legendX) {
        if (this.isVertical) {
            width = this.maxWidth;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    };
    /**
     * To create legend rendering elements for chart and accumulation chart
     */
    Legend.prototype.createLegendElements = function (legendBounds, legendGroup, legend, id, redraw) {
        var padding = legend.padding;
        var options = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        options.width = this.isVertical ? this.maxWidth : legendBounds.width;
        legendGroup ? legendGroup.appendChild(this.gauge.renderer.drawRectangle(options)) : this.gauge.renderer.drawRectangle(options);
        var legendItemsGroup = this.gauge.renderer.createGroup({ id: id + '_collections' });
        legendGroup.appendChild(legendItemsGroup);
        this.legendTranslateGroup = this.gauge.renderer.createGroup({ id: id + '_translate_g' });
        legendItemsGroup.appendChild(this.legendTranslateGroup);
        var clippath = this.gauge.renderer.createClipPath({ id: id + '_clipPath' });
        options.id += '_clipPath_rect';
        options.width = this.isVertical ? options.width - padding : options.width;
        this.clipRect = this.gauge.renderer.drawRectangle(options);
        clippath.appendChild(this.clipRect);
        this.appendChildElement(this.gauge.svgObject, clippath, redraw);
        legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        return this.legendTranslateGroup;
    };
    /**
     * Method to append child element
     */
    Legend.prototype.appendChildElement = function (parent, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, previousRect, animateDuration) {
        if (isAnimate === void 0) { isAnimate = false; }
        if (x === void 0) { x = 'x'; }
        if (y === void 0) { y = 'y'; }
        if (forceAnimate === void 0) { forceAnimate = false; }
        if (isRect === void 0) { isRect = false; }
        if (previousRect === void 0) { previousRect = null; }
        var existChild = parent.querySelector('#' + childElement.id);
        var element = (existChild || getElement(childElement.id));
        var child = childElement;
        var duration = animateDuration ? animateDuration : 300;
        if (existChild) {
            parent.replaceChild(child, element);
        }
        else {
            parent.appendChild(child);
        }
    };
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    Legend.prototype.findFirstLegendPosition = function (legendCollection) {
        var count = 0;
        for (var _i = 0, legendCollection_1 = legendCollection; _i < legendCollection_1.length; _i++) {
            var legend = legendCollection_1[_i];
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    };
    /**
     * To find legend bounds for accumulation chart.
     * @private
     */
    Legend.prototype.getLegendBounds = function (availableSize, legendBounds, legend) {
        var extraWidth = 0;
        var extraHeight = 0;
        var padding = legend.padding;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        }
        else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        var maximumWidth = 0;
        var rowWidth = 0;
        var rowCount = 0;
        var columnWidth = [];
        var columnHeight = 0;
        var legendWidth = 0;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        var legendEventArgs;
        var render = false;
        for (var _i = 0, _a = this.legendCollection; _i < _a.length; _i++) {
            var legendOption = _a[_i];
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                name: 'legendRender', cancel: false
            };
            this.gauge.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = legend.shapeWidth + (2 * legend.shapePadding) + legendOption.textSize.width + (2 * padding);
                if (this.isVertical) {
                    ++rowCount;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    if ((rowCount * (this.maxItemHeight + padding)) + padding > legendBounds.height) {
                        columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding);
                        rowWidth = rowWidth + maximumWidth;
                        columnWidth.push(maximumWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        maximumWidth = 0;
                        rowCount = 1;
                    }
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                }
                else {
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding;
                    }
                }
            }
        }
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            if (columnWidth[columnWidth.length - 1] !== maximumWidth) {
                columnWidth.push(maximumWidth);
            }
        }
        else {
            this.isPaging = legendBounds.height < columnHeight;
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        }
        this.maxColumns = 0; // initialization for max columns
        var width = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
            Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        }
        else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    };
    /** @private */
    Legend.prototype.subtractThickness = function (rect, left, right, top, bottom) {
        rect.x += left;
        rect.y += top;
        rect.width -= left + right;
        rect.height -= top + bottom;
        return rect;
    };
    /**
     * To set bounds for chart and accumulation chart
     */
    Legend.prototype.setBounds = function (computedWidth, computedHeight, legend, legendBounds) {
        computedWidth = computedWidth < legendBounds.width ? computedWidth : legendBounds.width;
        computedHeight = computedHeight < legendBounds.height ? computedHeight : legendBounds.height;
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding) / (this.maxItemHeight + legend.padding)));
    };
    /**
     * To find maximum column size for legend
     */
    Legend.prototype.getMaxColumn = function (columns, width, padding, rowWidth) {
        var maxPageColumn = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            maxPageColumn += this.maxColumnWidth;
            this.maxColumns++;
            if (maxPageColumn + padding > width) {
                maxPageColumn -= this.maxColumnWidth;
                this.maxColumns--;
                break;
            }
        }
        this.isPaging = (maxPageColumn < rowWidth) && (this.totalPages > 1);
        if (maxPageColumn === padding) {
            maxPageColumn = width;
        }
        this.maxColumns = Math.max(1, this.maxColumns);
        this.maxWidth = maxPageColumn;
        return maxPageColumn;
    };
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    Legend.prototype.move = function (event) {
        var x = this.gauge.mouseX;
        var y = this.gauge.mouseY;
        var targetId = event.target.id;
        if (event.target.textContent.indexOf('...') > -1 && targetId.indexOf('_gauge_legend_') > -1) {
            var axisIndex = parseInt(targetId.split(this.gauge.element.id + '_gauge_legend_Axis_')[1].split('_text_')[0], 10);
            var rangeIndex = parseInt(targetId.split(this.gauge.element.id + '_gauge_legend_Axis_')[1].split('_text_')[1], 10);
            var text = '';
            for (var _i = 0, _a = this.legendCollection; _i < _a.length; _i++) {
                var legends = _a[_i];
                if (legends.rangeIndex === rangeIndex && legends.axisIndex === axisIndex) {
                    text = legends.originalText;
                }
            }
            showTooltip(text, x, y, this.gauge.element.offsetWidth, this.gauge.element.id + '_EJ2_Legend_Tooltip', getElement(this.gauge.element.id + '_Secondary_Element'));
        }
        else {
            removeElement(this.gauge.element.id + '_EJ2_Legend_Tooltip');
        }
    };
    /**
     * Get module name.
     */
    Legend.prototype.getModuleName = function () {
        return 'Legend';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    Legend.prototype.destroy = function (circulargauge) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return Legend;
}());
export { Legend };
/**
 * @private
 */
var Index = /** @class */ (function () {
    function Index(axisIndex, rangeIndex, isToggled) {
        this.axisIndex = axisIndex;
        this.rangeIndex = rangeIndex;
        this.isToggled = isToggled;
    }
    return Index;
}());
export { Index };
/**
 * Class for legend options
 * @private
 */
var LegendOptions = /** @class */ (function () {
    function LegendOptions(text, originalText, fill, shape, visible, border, shapeBorder, shapeWidth, shapeHeight, rangeIndex, axisIndex) {
        this.location = { x: 0, y: 0 };
        this.text = text;
        this.originalText = originalText;
        this.fill = fill;
        this.shape = shape;
        this.visible = visible;
        this.border = border;
        this.shapeBorder = shapeBorder;
        this.shapeWidth = shapeWidth;
        this.shapeHeight = shapeHeight;
        this.rangeIndex = rangeIndex;
        this.axisIndex = axisIndex;
    }
    return LegendOptions;
}());
export { LegendOptions };
