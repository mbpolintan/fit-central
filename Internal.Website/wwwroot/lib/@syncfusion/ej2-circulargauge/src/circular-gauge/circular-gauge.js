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
/**
 * Circular Gauge
 */
import { Property, NotifyPropertyChanges, Component, isBlazor } from '@syncfusion/ej2-base';
import { Complex, Browser, isNullOrUndefined, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Event, EventHandler, Collection, Internationalization } from '@syncfusion/ej2-base';
import { remove, createElement } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { TextOption, textElement, RectOption, getAngleFromLocation } from './utils/helper';
import { getValueFromAngle, removeElement, getRange } from './utils/helper';
import { Size, stringToNumber, measureText, Rect, GaugeLocation, getElement, getPointer, setStyles, toPixel } from './utils/helper';
import { getAngleFromValue, getPathArc } from './utils/helper';
import { Border, Margin, Font, TooltipSettings } from './model/base';
import { Axis } from './axes/axis';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';
import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, pointerMove, } from './model/constants';
import { rangeMove, pointerStart, rangeStart, pointerEnd, rangeEnd } from './model/constants';
import { gaugeMouseUp, dragEnd, dragMove, dragStart, resized } from './model/constants';
import { AxisLayoutPanel } from './axes/axis-panel';
import { getThemeStyle } from './model/theme';
import { LegendSettings, Legend } from './legend/legend';
import { PdfExport } from './model/pdf-export';
import { ImageExport } from './model/image-export';
import { Print } from './model/print';
import { Gradient } from './axes/gradient';
/**
 * Represents the circular gauge control.
 * ```html
 * <div id="gauge"/>
 * <script>
 *   var gaugeObj = new CircularGauge();
 *   gaugeObj.appendTo("#gauge");
 * </script>
 * ```
 */
var CircularGauge = /** @class */ (function (_super) {
    __extends(CircularGauge, _super);
    /**
     * Constructor for creating the widget
     * @hidden
     */
    function CircularGauge(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.isDrag = false;
        /**
         * @private
         */
        _this.gradientCount = 0;
        return _this;
    }
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    //tslint:disable
    CircularGauge.prototype.preRender = function () {
        this.isBlazor = isBlazor();
        this.unWireEvents();
        this.trigger(load, this.isBlazor ? null : { gauge: this });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    };
    /**
     * To render the circular gauge elements
     */
    CircularGauge.prototype.render = function () {
        this.setTheme();
        this.calculateBounds();
        this.renderElements();
        this.renderComplete();
    };
    CircularGauge.prototype.setTheme = function () {
        this.themeStyle = getThemeStyle(this.theme);
    };
    /**
     * Method to unbind events for circular gauge
     */
    CircularGauge.prototype.unWireEvents = function () {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.gaugeOnMouseClick);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize);
    };
    /**
     * Method to bind events for circular gauge
     */
    CircularGauge.prototype.wireEvents = function () {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.gaugeOnMouseClick, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
        /*! Apply the style for circular gauge */
        this.setGaugeStyle(this.element);
    };
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.gaugeOnMouseClick = function (e) {
        this.setMouseXY(e);
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.click(e);
        }
        return false;
    };
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.mouseMove = function (e) {
        var _this = this;
        this.setMouseXY(e);
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger('gaugeMouseMove', args, function (observedArgs) {
            var dragArgs;
            var dragBlazorArgs;
            var tooltip = _this.tooltipModule;
            if (!args.cancel) {
                if ((_this.enablePointerDrag || _this.enableRangeDrag) && _this.svgObject.getAttribute('cursor') !== 'grabbing') {
                    if ((args.target.id.indexOf('_Pointer_') !== -1 && _this.enablePointerDrag) || (_this.enableRangeDrag && args.target.id.indexOf('_Range_') !== -1)) {
                        _this.svgObject.setAttribute('cursor', 'pointer');
                    }
                    else {
                        _this.svgObject.setAttribute('cursor', 'auto');
                    }
                }
                if (_this.enablePointerDrag && _this.activePointer) {
                    _this.isDrag = true;
                    var dragPointInd = parseInt(_this.activePointer.pathElement[0].id.slice(-1), 10);
                    var dragAxisInd = parseInt(_this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                    dragArgs = {
                        axis: _this.activeAxis,
                        pointer: _this.activePointer,
                        previousValue: _this.activePointer.currentValue,
                        name: dragMove,
                        type: pointerMove,
                        currentValue: null,
                        axisIndex: dragAxisInd,
                        pointerIndex: dragPointInd,
                    };
                    dragBlazorArgs = {
                        previousValue: _this.activePointer.currentValue,
                        name: dragMove,
                        type: pointerMove,
                        currentValue: null,
                        pointerIndex: dragPointInd,
                        axisIndex: dragAxisInd,
                    };
                    _this.pointerDrag(new GaugeLocation(args.x, args.y), dragAxisInd, dragPointInd);
                    dragArgs.currentValue = dragBlazorArgs.currentValue = _this.activePointer.currentValue;
                    _this.trigger(dragMove, _this.isBlazor ? dragBlazorArgs : dragArgs);
                    _this.activeRange = null;
                }
                else if (_this.enableRangeDrag && _this.activeRange) {
                    _this.isDrag = true;
                    var dragAxisInd = parseInt(_this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                    var dragRangeInd = parseInt(_this.activeRange.pathElement[0].id.slice(-1), 10);
                    dragArgs = {
                        axis: _this.activeAxis,
                        name: dragMove,
                        type: rangeMove,
                        range: _this.activeRange,
                        axisIndex: dragAxisInd,
                        rangeIndex: dragRangeInd,
                    };
                    dragBlazorArgs = {
                        name: dragMove,
                        type: rangeMove,
                        axisIndex: dragAxisInd,
                        rangeIndex: dragRangeInd,
                    };
                    _this.rangeDrag(new GaugeLocation(args.x, args.y), dragAxisInd, dragRangeInd);
                    _this.trigger(dragMove, _this.isBlazor ? dragBlazorArgs : dragArgs);
                }
            }
        });
        if (!this.isTouch) {
            if (this.legendModule && this.legendSettings.visible) {
                this.legendModule.move(e);
            }
        }
        this.notify(Browser.touchMoveEvent, e);
        return false;
    };
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.mouseLeave = function (e) {
        this.setMouseXY(e);
        this.activeAxis = null;
        this.activePointer = null;
        this.activeRange = null;
        this.svgObject.setAttribute('cursor', 'auto');
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        this.trigger(gaugeMouseLeave, args);
        return false;
    };
    /**
     * Handles the mouse right click.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.gaugeRightClick = function (event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    /**
     * Handles the pointer draf while mouse move on gauge.
     * @private
     */
    CircularGauge.prototype.pointerDrag = function (location, axisIndex, pointerIndex) {
        var axis = this.activeAxis;
        var range = axis.visibleRange;
        var value = getValueFromAngle(getAngleFromLocation(this.midPoint, location), range.max, range.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        if (value >= range.min && value <= range.max) {
            this.axes[axisIndex].pointers[pointerIndex].value = value;
            this.activePointer.currentValue = value;
            this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, this.activePointer, value);
        }
    };
    /**
     * Handles the range draf while mouse move on gauge.
     * @private
     */
    CircularGauge.prototype.rangeDrag = function (location, axisIndex, rangeIndex) {
        if (this.activeAxis) {
            var axis = this.activeAxis;
            var range = axis.visibleRange;
            var gauge = this;
            var value = void 0;
            value = getValueFromAngle(getAngleFromLocation(this.midPoint, location), range.max, range.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
            if (value >= range.min && value <= range.max) {
                {
                    var previousValue1 = this.activeRange.currentValue;
                    this.activeRange.currentValue = value;
                    var avg = void 0;
                    var add = (this.activeRange.end - this.activeRange.start);
                    var div = add / 2;
                    avg = parseFloat(this.activeRange.start.toString()) + div;
                    this.startValue = (value < avg) ? value : ((previousValue1 < avg) ? previousValue1 : this.activeRange.start);
                    this.endValue = (value < avg) ? ((previousValue1 > avg) ? previousValue1 : this.activeRange.end) : value;
                    this.axes[axisIndex].ranges[rangeIndex].start = this.startValue;
                    this.axes[axisIndex].ranges[rangeIndex].end = this.endValue;
                }
            }
        }
    };
    /**
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.gaugeOnMouseDown = function (e) {
        var _this = this;
        this.setMouseXY(e);
        var currentPointer;
        var currentRange;
        var args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger('gaugeMouseDown', args, function (observedArgs) {
            if (!args.cancel &&
                args.target.id.indexOf(_this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Pointer_') >= 0) {
                currentPointer = getPointer(args.target.id, _this);
                _this.activeAxis = _this.axes[currentPointer.axisIndex];
                _this.activePointer = _this.activeAxis.pointers[currentPointer.pointerIndex];
                if (isNullOrUndefined(_this.activePointer.pathElement)) {
                    _this.activePointer.pathElement = [e.target];
                }
                var pointInd = parseInt(_this.activePointer.pathElement[0].id.slice(-1), 10);
                var axisInd = parseInt(_this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
                _this.trigger(dragStart, _this.isBlazor ? {
                    name: dragStart,
                    type: pointerStart,
                    currentValue: _this.activePointer.currentValue,
                    pointerIndex: pointInd,
                    axisIndex: axisInd,
                } : {
                    axis: _this.activeAxis,
                    name: dragStart,
                    type: pointerStart,
                    pointer: _this.activePointer,
                    currentValue: _this.activePointer.currentValue,
                    pointerIndex: pointInd,
                    axisIndex: axisInd,
                });
                if (_this.enablePointerDrag) {
                    _this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }
            else if (!args.cancel &&
                args.target.id.indexOf(_this.element.id + '_Axis_') >= 0 &&
                args.target.id.indexOf('_Range_') >= 0) {
                currentRange = getRange(args.target.id, _this);
                _this.activeAxis = _this.axes[currentRange.axisIndex];
                _this.activeRange = _this.activeAxis.ranges[currentRange.rangeIndex];
                if (isNullOrUndefined(_this.activeRange.pathElement)) {
                    _this.activeRange.pathElement = [e.target];
                }
                var rangeInd = parseInt(_this.activeRange.pathElement[0].id.slice(-1), 0);
                var axisInd = parseInt(_this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
                _this.trigger(dragStart, _this.isBlazor ? {
                    name: dragStart,
                    type: rangeStart,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd,
                } : {
                    axis: _this.activeAxis,
                    name: dragStart,
                    type: rangeStart,
                    range: _this.activeRange,
                    axisIndex: axisInd,
                    rangeIndex: rangeInd,
                });
                if (_this.enableRangeDrag) {
                    _this.svgObject.setAttribute('cursor', 'grabbing');
                }
            }
        });
        return false;
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.mouseEnd = function (e) {
        this.setMouseXY(e);
        var args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        var blazorArgs = {
            cancel: args.cancel, target: args.target, name: args.name, x: args.x, y: args.y
        };
        this.isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        var tooltipInterval;
        var tooltip = this.tooltipModule;
        this.trigger(gaugeMouseUp, this.isBlazor ? blazorArgs : args);
        if (this.activeAxis && this.activePointer && this.enablePointerDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            var pointerInd = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
            var axisInd = parseInt(this.activePointer.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd, this.isBlazor ? {
                name: dragEnd,
                type: pointerEnd,
                currentValue: this.activePointer.currentValue,
                pointerIndex: pointerInd,
                axisIndex: axisInd
            } : {
                name: dragEnd,
                type: pointerEnd,
                axis: this.activeAxis,
                pointer: this.activePointer,
                currentValue: this.activePointer.currentValue,
                axisIndex: axisInd,
                pointerIndex: pointerInd
            });
            this.activeAxis = null;
            this.activePointer = null;
            this.isDrag = false;
        }
        else if (this.activeAxis && this.activeRange && this.enableRangeDrag) {
            this.svgObject.setAttribute('cursor', 'auto');
            var rangeInd = parseInt(this.activeRange.pathElement[0].id.slice(-1), 10);
            var axisInd = parseInt(this.activeRange.pathElement[0].id.split('_Axis_')[1], 10);
            this.trigger(dragEnd, this.isBlazor ? {
                name: dragEnd,
                type: rangeEnd,
                rangeIndex: rangeInd,
                axisIndex: axisInd
            } : {
                name: dragEnd,
                type: rangeEnd,
                axis: this.activeAxis,
                range: this.activeRange,
                axisIndex: axisInd,
                rangeIndex: rangeInd
            });
            this.activeAxis = null;
            this.activeRange = null;
            this.isDrag = false;
        }
        this.svgObject.setAttribute('cursor', 'auto');
        this.notify(Browser.touchEndEvent, e);
        return false;
    };
    /**
     * Handles the mouse event arguments.
     * @return {IMouseEventArgs}
     * @private
     */
    CircularGauge.prototype.getMouseArgs = function (e, type, name) {
        var rect = this.element.getBoundingClientRect();
        var location = new GaugeLocation(-rect.left, -rect.top);
        var isTouch = (e.type === type);
        location.x += isTouch ? e.changedTouches[0].clientX : e.clientX;
        location.y += isTouch ? e.changedTouches[0].clientY : e.clientY;
        return {
            cancel: false, name: name,
            x: location.x, y: location.y,
            target: isTouch ? e.target : e.target
        };
    };
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.gaugeResize = function (e) {
        var _this = this;
        var args = {
            gauge: !this.isBlazor ? this : null,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        this.animatePointer = false;
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        else if (this.element.classList.contains('e-circulargauge')) {
            this.resizeTo = window.setTimeout(function () {
                _this.createSvg();
                _this.calculateBounds();
                _this.renderElements();
                args.currentSize = _this.availableSize;
                if (_this.isBlazor) {
                    var previousSize = args.previousSize, name_1 = args.name, currentSize = args.currentSize;
                    args = { previousSize: previousSize, name: name_1, currentSize: currentSize };
                }
                _this.trigger(resized, args);
            }, 500);
        }
        return false;
    };
    /**
     * Applying styles for circular gauge elements
     */
    CircularGauge.prototype.setGaugeStyle = function (element) {
        element.style.touchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msTouchAction = this.enablePointerDrag ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    };
    /**
     * Method to set culture for gauge
     */
    CircularGauge.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * Methods to create svg element for circular gauge.
     */
    CircularGauge.prototype.createSvg = function () {
        this.removeSvg();
        this.calculateSvgSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    };
    /**
     * To Remove the SVG from circular gauge.
     * @return {boolean}
     * @private
     */
    CircularGauge.prototype.removeSvg = function () {
        for (var i = 0; i < this.axes.length; i++) {
            for (var j = 0; j < this.axes[i].annotations.length; j++) {
                resetBlazorTemplate(this.element.id + '_Axis' + i + '_ContentTemplate' + j, '_ContentTemplate');
            }
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    };
    /**
     * To initialize the circular gauge private variable.
     * @private
     */
    CircularGauge.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-circulargauge').length;
            this.element.id = 'circulargauge_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.animatePointer = true;
    };
    /**
     * To calculate the size of the circular gauge element.
     */
    CircularGauge.prototype.calculateSvgSize = function () {
        var containerWidth = this.element.offsetWidth;
        var containerHeight = this.element.offsetHeight;
        var borderWidth = parseInt(this.element.style.borderWidth.split('px').join(''), 10) * 2;
        var width = stringToNumber(this.width, containerWidth) || containerWidth || 600;
        var height = stringToNumber(this.height, containerHeight) || containerHeight || 450;
        width = !isNaN(borderWidth) ? (width - borderWidth) : width;
        height = !isNaN(borderWidth) ? (height - borderWidth) : height;
        this.availableSize = new Size(width, height);
    };
    /**
     * Method to calculate the availble size for circular gauge.
     */
    CircularGauge.prototype.calculateBounds = function () {
        var padding = 5;
        var rect;
        var margin = this.margin;
        var titleHeight = 0;
        if (this.title) {
            titleHeight = measureText(this.title, this.titleStyle).height + padding;
        }
        var top = margin.top + titleHeight + this.border.width;
        var left = margin.left + this.border.width;
        var width = this.availableSize.width - left - margin.right - this.border.width;
        var height = this.availableSize.height - top - this.border.width - margin.bottom;
        var radius = Math.min(width, height) / 2;
        if (this.moveToCenter && this.axes.length === 1 &&
            isNullOrUndefined(this.centerX) && isNullOrUndefined(this.centerY)) {
            rect = new Rect(left, top, width, height);
        }
        else {
            rect = new Rect((left + (width / 2) - radius), (top + (height / 2) - radius), radius * 2, radius * 2);
        }
        this.gaugeRect = rect;
        if (this.legendModule && this.legendSettings.visible) {
            this.legendModule.getLegendOptions(this.axes);
            this.legendModule.calculateLegendBounds(this.gaugeRect, this.availableSize);
        }
        var centerX = this.centerX !== null ?
            stringToNumber(this.centerX, this.availableSize.width) : this.gaugeRect.x + (this.gaugeRect.width / 2);
        var centerY = this.centerY !== null ?
            stringToNumber(this.centerY, this.availableSize.height) : this.gaugeRect.y + (this.gaugeRect.height / 2);
        this.midPoint = new GaugeLocation(centerX, centerY);
        this.gaugeAxisLayoutPanel.measureAxis(this.gaugeRect);
    };
    /**
     * To render elements for circular gauge
     */
    CircularGauge.prototype.renderElements = function (animate) {
        if (animate === void 0) { animate = true; }
        this.renderBorder();
        this.renderTitle();
        this.gaugeAxisLayoutPanel.renderAxes(animate);
        this.renderLegend();
        this.element.appendChild(this.svgObject);
        this.trigger(loaded, this.isBlazor ? {} : { gauge: this });
        removeElement("gauge-measuretext");
    };
    /**
     * Method to render legend for accumulation chart
     */
    CircularGauge.prototype.renderLegend = function () {
        if (!this.legendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.legendModule.legendCollection.length) {
            this.legendModule.renderLegend(this.legendSettings, this.legendModule.legendBounds, true);
        }
    };
    /**
     * Method to render the title for circular gauge.
     */
    CircularGauge.prototype.renderTitle = function () {
        if (this.title) {
            this.titleStyle.fontFamily = this.themeStyle.fontFamily || this.titleStyle.fontFamily;
            this.titleStyle.size = this.themeStyle.fontSize || this.titleStyle.size;
            var size = measureText(this.title, this.titleStyle);
            var options = new TextOption(this.element.id + '_CircularGaugeTitle', this.availableSize.width / 2, this.margin.top + 3 * (size.height / 4), 'middle', this.title);
            var element = textElement(options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject, '');
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    };
    /**
     * Method to render the border for circular gauge.
     */
    CircularGauge.prototype.renderBorder = function () {
        var borderWidth = this.border.width;
        if (borderWidth > 0 || (this.background || this.themeStyle.backgroundColor)) {
            this.svgObject.appendChild(this.renderer.drawRectangle(new RectOption(this.element.id + '_CircularGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, null, new Rect(borderWidth / 2, borderWidth / 2, this.availableSize.width - borderWidth, this.availableSize.height - borderWidth))));
        }
    };
    /**
     * This method is used to set the pointer value dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param pointerIndex - Specifies the index value for the pointer in circular gauge.
     * @param value - Specifies the value for the pointer in circular gauge.
     */
    CircularGauge.prototype.setPointerValue = function (axisIndex, pointerIndex, value) {
        var _this = this;
        var axis = this.axes[axisIndex];
        var pointer = axis.pointers[pointerIndex];
        var pointerRadius = pointer.currentRadius;
        var enableAnimation = pointer.animation.enable;
        value = value < axis.visibleRange.min ? axis.visibleRange.min : value;
        value = value > axis.visibleRange.max ? axis.visibleRange.max : value;
        pointer.pathElement.map(function (element) {
            if (pointer.type === 'RangeBar') {
                setStyles(element, pointer.color, pointer.border);
                if (enableAnimation) {
                    _this.gaugeAxisLayoutPanel.pointerRenderer.performRangeBarAnimation(element, pointer.currentValue, value, axis, pointer, pointerRadius, (pointerRadius - pointer.pointerWidth));
                }
                else {
                    _this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                }
            }
            else {
                if (element.id.indexOf('_Pointer_NeedleCap_') >= 0) {
                    setStyles(element, pointer.cap.color, pointer.cap.border);
                }
                else if (element.id.indexOf('_Pointer_NeedleTail_') >= 0) {
                    setStyles(element, pointer.needleTail.color, pointer.needleTail.border);
                }
                else if (element.id.indexOf('_Pointer_NeedleRect_') >= 0) {
                    setStyles(element, 'transparent', { color: 'transparent', width: 0 });
                }
                else {
                    setStyles(element, pointer.color, pointer.border);
                }
                if (enableAnimation) {
                    _this.gaugeAxisLayoutPanel.pointerRenderer.performNeedleAnimation(element, pointer.currentValue, value, axis, pointer, pointerRadius, (pointerRadius - pointer.pointerWidth));
                }
                else {
                    _this.gaugeAxisLayoutPanel.pointerRenderer.setPointerValue(axis, pointer, value);
                }
            }
        });
        this.isProtectedOnChange = true;
        pointer.currentValue = value;
        pointer.value = value;
        this.isProtectedOnChange = false;
    };
    /**
     * This method is used to set the annotation content dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param annotationIndex - Specifies the index value for the annotation in circular gauge.
     * @param conetent - Specifies the content for the annotation in circular gauge.
     */
    CircularGauge.prototype.setAnnotationValue = function (axisIndex, annotationIndex, content) {
        var isElementExist = getElement(this.element.id + '_Annotations_' + axisIndex) !== null;
        var element = getElement(this.element.id + '_Annotations_' + axisIndex) ||
            createElement('div', {
                id: this.element.id + '_Annotations_' + axisIndex
            });
        var annotation = this.axes[axisIndex].annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Axis_' + axisIndex + '_Annotation_' + annotationIndex);
            annotation.content = content;
            this.annotationsModule.createTemplate(element, annotationIndex, axisIndex);
            if (!isElementExist) {
                getElement(this.element.id + '_Secondary_Element').appendChild(element);
            }
        }
    };
    /**
     * This method is used to print the rendered circular gauge.
     * @param id - Specifies the element to print the circular gauge.
     */
    CircularGauge.prototype.print = function (id) {
        if (this.allowPrint && this.printModule) {
            this.printModule.print(id);
        }
    };
    /**
     * This method is used to perform the export functionality for the circular gauge.
     * @param type - Specifies the type of the export.
     * @param fileName - Specifies the file name for the exported file.
     * @param orientation - Specified the orientation for the exported pdf document.
     * @param allowDownload - Specifies whether to download as a file.
     */
    CircularGauge.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if (type == 'PDF' && this.allowPdfExport && this.pdfExportModule) {
            return new Promise(function (resolve, reject) {
                resolve(_this.pdfExportModule.export(type, fileName, orientation, allowDownload));
            });
        }
        else if (this.allowImageExport && (type !== 'PDF') && this.imageExportModule) {
            return new Promise(function (resolve, reject) {
                resolve(_this.imageExportModule.export(type, fileName, allowDownload));
            });
        }
        return null;
    };
    /**
     * Method to set mouse x, y from events
     */
    CircularGauge.prototype.setMouseXY = function (e) {
        var pageX;
        var pageY;
        var svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        var rect = this.element.getBoundingClientRect();
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            var touchArg = e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    /**
     * This method is used to set the range values dynamically for circular gauge.
     * @param axisIndex - Specifies the index value for the axis in circular gauge.
     * @param rangeIndex - Specifies the index value for the range in circular gauge.
     * @param start - Specifies the start value for the current range in circular gauge.
     * @param end - Specifies the end value for the current range i circular gauge.
     */
    CircularGauge.prototype.setRangeValue = function (axisIndex, rangeIndex, start, end) {
        var element = getElement(this.element.id + '_Axis_' + axisIndex + '_Range_' + rangeIndex);
        var axis = this.axes[axisIndex];
        var range = axis.ranges[rangeIndex];
        var axisRange = axis.visibleRange;
        var isClockWise = axis.direction === 'ClockWise';
        var startValue = Math.min(Math.max(start, axisRange.min), end);
        var endValue = Math.min(Math.max(start, end), axisRange.max);
        var startAngle = getAngleFromValue(startValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var endAngle = getAngleFromValue(endValue, axisRange.max, axisRange.min, axis.startAngle, axis.endAngle, isClockWise);
        var startWidth;
        if (range.startWidth.length > 0) {
            startWidth = toPixel(range.startWidth, range.currentRadius);
        }
        else {
            startWidth = range.startWidth;
        }
        var endWidth;
        if (range.endWidth.length > 0) {
            endWidth = toPixel(range.endWidth, range.currentRadius);
        }
        else {
            endWidth = range.endWidth;
        }
        endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
        endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
        element.setAttribute('d', getPathArc(this.midPoint, Math.round(startAngle), Math.round(endAngle), range.currentRadius, startWidth, endWidth, range, axis));
        setStyles(element, (range.color ? range.color : range.rangeColor), {
            color: (range.color ? range.color : range.rangeColor),
            width: 0
        });
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}
     * @member of Circular-Gauge
     */
    CircularGauge.prototype.destroy = function () {
        this.unWireEvents();
        this.removeSvg();
        _super.prototype.destroy.call(this);
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    CircularGauge.prototype.requiredModules = function () {
        var modules = [];
        var annotationEnable = false;
        var axes = this.axes;
        axes.map(function (axis) {
            axis.annotations.map(function (annotation) {
                annotationEnable = annotationEnable || annotation.content !== null;
            });
        });
        if (annotationEnable) {
            modules.push({
                member: 'Annotations',
                args: [this, Annotations]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'Tooltip',
                args: [this, GaugeTooltip]
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this, Print]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this, ImageExport]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this, PdfExport]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'Legend',
                args: [this, Legend]
            });
        }
        modules.push({
            member: 'Gradient',
            args: [this, Gradient]
        });
        return modules;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    CircularGauge.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    CircularGauge.prototype.onPropertyChanged = function (newProp, oldProp) {
        // property method calculated
        var renderer = false;
        var refreshBounds = false;
        var refreshWithoutAnimation = false;
        var isPointerValueSame = (Object.keys(newProp).length === 1 && newProp instanceof Object &&
            !isNullOrUndefined(this.activePointer));
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                case 'width':
                case 'centerX':
                case 'centerY':
                case 'margin':
                    this.createSvg();
                    refreshBounds = true;
                    break;
                case 'title':
                    refreshBounds = (newProp.title === '' || oldProp.title === '');
                    renderer = !(newProp.title === '' || oldProp.title === '');
                    break;
                case 'titleStyle':
                    if (newProp.titleStyle && newProp.titleStyle.size) {
                        refreshBounds = true;
                    }
                    else {
                        renderer = true;
                    }
                    break;
                case 'border':
                    renderer = true;
                    break;
                case 'background':
                    renderer = true;
                    break;
                case 'legendSettings':
                    refreshWithoutAnimation = true;
                    break;
                case 'axes':
                    refreshWithoutAnimation = true;
                    break;
            }
        }
        if (!isPointerValueSame) {
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderElements();
            }
            if (refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements();
            }
            if (refreshWithoutAnimation && !renderer && !refreshBounds) {
                this.removeSvg();
                this.calculateBounds();
                this.renderElements(false);
            }
        }
    };
    /**
     * Get component name for circular gauge
     * @private
     */
    CircularGauge.prototype.getModuleName = function () {
        return 'circulargauge';
    };
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "height", void 0);
    __decorate([
        Complex({ color: 'transparent', width: 0 }, Border)
    ], CircularGauge.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "background", void 0);
    __decorate([
        Property('')
    ], CircularGauge.prototype, "title", void 0);
    __decorate([
        Complex({ size: '15px', color: null }, Font)
    ], CircularGauge.prototype, "titleStyle", void 0);
    __decorate([
        Complex({}, Margin)
    ], CircularGauge.prototype, "margin", void 0);
    __decorate([
        Collection([{}], Axis)
    ], CircularGauge.prototype, "axes", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], CircularGauge.prototype, "tooltip", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "enablePointerDrag", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "enableRangeDrag", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "allowPrint", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "allowImageExport", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "allowPdfExport", void 0);
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "centerX", void 0);
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "centerY", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "moveToCenter", void 0);
    __decorate([
        Property('Material')
    ], CircularGauge.prototype, "theme", void 0);
    __decorate([
        Property(false)
    ], CircularGauge.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], CircularGauge.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], CircularGauge.prototype, "tabIndex", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], CircularGauge.prototype, "legendSettings", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "load", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "axisLabelRender", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "radiusCalculate", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "annotationRender", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "legendRender", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "dragMove", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "dragEnd", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "gaugeMouseMove", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "gaugeMouseLeave", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "gaugeMouseDown", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "gaugeMouseUp", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "resized", void 0);
    __decorate([
        Event()
    ], CircularGauge.prototype, "beforePrint", void 0);
    CircularGauge = __decorate([
        NotifyPropertyChanges
    ], CircularGauge);
    return CircularGauge;
}(Component));
export { CircularGauge };
