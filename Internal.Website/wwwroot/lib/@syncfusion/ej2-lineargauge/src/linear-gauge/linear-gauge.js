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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Component, Property, NotifyPropertyChanges, Internationalization, isBlazor } from '@syncfusion/ej2-base';
import { Browser, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Event, EventHandler, Complex, Collection, isNullOrUndefined, remove, createElement } from '@syncfusion/ej2-base';
import { Border, Font, Container, Margin, Annotation, TooltipSettings } from './model/base';
import { Axis } from './axes/axis';
import { load, loaded, gaugeMouseMove, gaugeMouseLeave, gaugeMouseDown, gaugeMouseUp, resized, valueChange } from './model/constant';
import { Size, valueToCoefficient, calculateShapes, stringToNumber, removeElement, getElement } from './utils/helper';
import { measureText, Rect, TextOption, textElement, GaugeLocation, RectOption, PathOption } from './utils/helper';
import { getBox, withInRange, getPointer, convertPixelToValue, isPointerDrag } from './utils/helper';
import { dragEnd, dragMove, dragStart } from './model/constant';
import { AxisLayoutPanel } from './axes/axis-panel';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { AxisRenderer } from './axes/axis-renderer';
import { Annotations } from './annotations/annotations';
import { GaugeTooltip } from './user-interaction/tooltip';
import { getThemeStyle } from './model/theme';
import { Gradient } from './axes/gradient';
/**
 * Represents the EJ2 Linear gauge control.
 * ```html
 * <div id="container"/>
 * <script>
 *   var gaugeObj = new LinearGauge({ });
 *   gaugeObj.appendTo("#container");
 * </script>
 * ```
 */
var LinearGauge = /** @class */ (function (_super) {
    __extends(LinearGauge, _super);
    /**
     * @private
     * Constructor for creating the widget
     * @hidden
     */
    function LinearGauge(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * Specifies the gradient count of the linear gauge.
         * @private
         */
        _this.gradientCount = 0;
        /** @private */
        _this.isDrag = false;
        /** @private */
        _this.pointerDrag = false;
        /** @private */
        _this.mouseX = 0;
        /** @private */
        _this.mouseY = 0;
        /** @private */
        _this.gaugeResized = false;
        return _this;
    }
    /**
     * Initialize the preRender method.
     */
    LinearGauge.prototype.preRender = function () {
        this.isBlazor = isBlazor();
        this.unWireEvents();
        this.trigger(load, { gauge: !this.isBlazor ? this : null });
        this.initPrivateVariable();
        this.setCulture();
        this.createSvg();
        this.wireEvents();
    };
    LinearGauge.prototype.setTheme = function () {
        this.themeStyle = getThemeStyle(this.theme);
    };
    LinearGauge.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-lineargauge').length;
            this.element.id = 'lineargauge_' + 'control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.gaugeAxisLayoutPanel = new AxisLayoutPanel(this);
        this.axisRenderer = new AxisRenderer(this);
    };
    /**
     * Method to set culture for chart
     */
    LinearGauge.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * Methods to create svg element
     */
    LinearGauge.prototype.createSvg = function () {
        this.removeSvg();
        this.calculateSize();
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.removeSvg = function () {
        for (var i = 0; i < this.annotations.length; i++) {
            resetBlazorTemplate(this.element.id + '_ContentTemplate' + i, 'ContentTemplate');
        }
        removeElement(this.element.id + '_Secondary_Element');
        if (!(isNullOrUndefined(this.svgObject)) && !isNullOrUndefined(this.svgObject.parentNode)) {
            remove(this.svgObject);
        }
    };
    /**
     * Method to calculate the size of the gauge
     */
    LinearGauge.prototype.calculateSize = function () {
        var width = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        var height = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    };
    /**
     * To Initialize the control rendering
     */
    LinearGauge.prototype.render = function () {
        this.setTheme();
        this.renderGaugeElements();
        this.calculateBounds();
        this.renderAxisElements();
        this.renderComplete();
    };
    /**
     * @private
     * To render the gauge elements
     */
    LinearGauge.prototype.renderGaugeElements = function () {
        this.appendSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.renderContainer();
    };
    LinearGauge.prototype.appendSecondaryElement = function () {
        if (isNullOrUndefined(getElement(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div');
            secondaryElement.id = this.element.id + '_Secondary_Element';
            secondaryElement.setAttribute('style', 'position: relative');
            this.element.appendChild(secondaryElement);
        }
    };
    /**
     * Render the map area border
     */
    LinearGauge.prototype.renderArea = function () {
        var size = measureText(this.title, this.titleStyle);
        var rectSize = new Rect(this.actualRect.x, this.actualRect.y - (size.height / 2), this.actualRect.width, this.actualRect.height);
        var rect = new RectOption(this.element.id + 'LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, rectSize);
        this.svgObject.appendChild(this.renderer.drawRectangle(rect));
    };
    /**
     * @private
     * To calculate axes bounds
     */
    LinearGauge.prototype.calculateBounds = function () {
        this.gaugeAxisLayoutPanel.calculateAxesBounds();
    };
    /**
     * @private
     * To render axis elements
     */
    LinearGauge.prototype.renderAxisElements = function () {
        this.axisRenderer.renderAxes();
        this.element.appendChild(this.svgObject);
        if (this.annotationsModule) {
            this.annotationsModule.renderAnnotationElements();
        }
        this.trigger(loaded, { gauge: !this.isBlazor ? this : null });
        removeElement('gauge-measuretext');
    };
    LinearGauge.prototype.renderBorder = function () {
        var width = this.border.width;
        if (width > 0 || (this.background || this.themeStyle.backgroundColor)) {
            var rect = new RectOption(this.element.id + '_LinearGaugeBorder', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width), null, null);
            this.svgObject.appendChild(this.renderer.drawRectangle(rect));
        }
    };
    LinearGauge.prototype.renderTitle = function () {
        var x;
        var y;
        var height;
        var width;
        var titleBounds;
        var size = measureText(this.title, this.titleStyle);
        var options = new TextOption(this.element.id + '_LinearGaugeTitle', this.availableSize.width / 2, this.margin.top + (size.height / 2), 'middle', this.title);
        titleBounds = {
            x: options.x - (size.width / 2),
            y: options.y,
            width: size.width,
            height: size.height
        };
        x = this.margin.left;
        y = (isNullOrUndefined(titleBounds)) ? this.margin.top : titleBounds.y;
        height = (this.availableSize.height - y - this.margin.bottom);
        width = (this.availableSize.width - this.margin.left - this.margin.right);
        this.actualRect = { x: x, y: y, width: width, height: height };
        if (this.title) {
            this.titleStyle.fontFamily = this.themeStyle.fontFamily || this.titleStyle.fontFamily;
            this.titleStyle.size = this.themeStyle.fontSize || this.titleStyle.size;
            var element = textElement(options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject);
            element.setAttribute('aria-label', this.description || this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    };
    /*
     * Method to unbind the gauge events
     */
    LinearGauge.prototype.unWireEvents = function () {
        EventHandler.remove(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'contextmenu', this.gaugeRightClick);
        EventHandler.remove(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave);
        EventHandler.remove(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize.bind(this));
    };
    /*
     * Method to bind the gauge events
     */
    LinearGauge.prototype.wireEvents = function () {
        /*! Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.gaugeOnMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'contextmenu', this.gaugeRightClick, this);
        EventHandler.add(this.element, (Browser.isPointer ? 'pointerleave' : 'mouseleave'), this.mouseLeave, this);
        EventHandler.add(window, (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.gaugeResize, this);
        this.setStyle(this.element);
    };
    LinearGauge.prototype.setStyle = function (element) {
        element.style.touchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msTouchAction = isPointerDrag(this.axes) ? 'none' : 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
    };
    /**
     * Handles the gauge resize.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeResize = function (e) {
        var _this = this;
        var args = {
            gauge: !this.isBlazor ? this : null,
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new Size(0, 0)
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-lineargauge')) {
            this.resizeTo = window.setTimeout(function () {
                _this.createSvg();
                _this.renderGaugeElements();
                _this.calculateBounds();
                _this.renderAxisElements();
                args.currentSize = new Size(_this.availableSize.width, _this.availableSize.height);
                _this.trigger(resized, args);
                _this.render();
            }, 500);
        }
        return false;
    };
    /**
     * To destroy the gauge element from the DOM.
     */
    LinearGauge.prototype.destroy = function () {
        this.unWireEvents();
        this.removeSvg();
        _super.prototype.destroy.call(this);
    };
    /**
     * @private
     * To render the gauge container
     */
    LinearGauge.prototype.renderContainer = function () {
        var width;
        var height;
        var x;
        var y;
        var options;
        var path = '';
        var topRadius;
        var bottomRadius;
        var fill = (this.container.backgroundColor !== 'transparent'
            || (this.theme !== 'Bootstrap4' && this.theme !== 'Material'))
            ? this.container.backgroundColor : this.themeStyle.containerBackground;
        var rect;
        var radius = this.container.width;
        bottomRadius = radius + ((radius / 2) / Math.PI);
        topRadius = radius / 2;
        if (this.orientation === 'Vertical') {
            height = this.actualRect.height;
            height = (this.container.height > 0 ? this.container.height : ((height / 2) - ((height / 2) / 4)) * 2);
            width = this.container.width;
            height = (this.container.type === 'Thermometer') ? height - (bottomRadius * 2) - topRadius : height;
            x = (this.actualRect.x + ((this.actualRect.width / 2) - (this.container.width / 2))) + this.container.offset;
            y = this.actualRect.y + ((this.actualRect.height / 2) - ((this.container.type === 'Thermometer') ?
                ((height + (bottomRadius * 2) - topRadius)) / 2 : height / 2));
            height = height;
        }
        else {
            width = (this.container.height > 0) ? this.container.height :
                ((this.actualRect.width / 2) - ((this.actualRect.width / 2) / 4)) * 2;
            width = (this.container.type === 'Thermometer') ? width - (bottomRadius * 2) - topRadius : width;
            x = this.actualRect.x + ((this.actualRect.width / 2) - ((this.container.type === 'Thermometer') ?
                (width - (bottomRadius * 2) + topRadius) / 2 : width / 2));
            y = (this.actualRect.y + ((this.actualRect.height / 2) - (this.container.width / 2))) + this.container.offset;
            height = this.container.width;
        }
        this.containerBounds = { x: x, y: y, width: width, height: height };
        if (this.containerBounds.width > 0) {
            this.containerObject = this.renderer.createGroup({ id: this.element.id + '_Container_Group', transform: 'translate( 0, 0)' });
            if (this.container.type === 'Normal') {
                rect = new RectOption(this.element.id + '_' + this.container.type + '_Layout', fill, this.container.border, 1, new Rect(x, y, width, height));
                this.containerObject.appendChild(this.renderer.drawRectangle(rect));
            }
            else {
                path = getBox(this.containerBounds, this.container.type, this.orientation, new Size(this.container.height, this.container.width), 'container', null, null, this.container.roundedCornerRadius);
                options = new PathOption(this.element.id + '_' + this.container.type + '_Layout', fill, this.container.border.width, this.container.border.color, 1, '', path);
                this.containerObject.appendChild(this.renderer.drawPath(options));
            }
            this.svgObject.appendChild(this.containerObject);
        }
    };
    /**
     * Method to set mouse x, y from events
     */
    LinearGauge.prototype.setMouseXY = function (e) {
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
     * Handles the mouse down on gauge.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeOnMouseDown = function (e) {
        var _this = this;
        var pageX;
        var pageY;
        var target;
        var element = e.target;
        var split = [];
        var clientRect = this.element.getBoundingClientRect();
        var axis;
        var isPointer = false;
        var pointer;
        var current;
        var currentPointer;
        this.setMouseXY(e);
        var top;
        var left;
        var pointerElement;
        var svgPath;
        var dragProcess = false;
        var args = this.getMouseArgs(e, 'touchstart', gaugeMouseDown);
        this.trigger(gaugeMouseDown, args, function (observedArgs) {
            _this.mouseX = args.x;
            _this.mouseY = args.y;
            if (args.target) {
                if (!args.cancel && ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1))) {
                    current = _this.moveOnPointer(args.target);
                    currentPointer = getPointer(args.target, _this);
                    _this.activeAxis = _this.axes[currentPointer.axisIndex];
                    _this.activePointer = _this.activeAxis.pointers[currentPointer.pointerIndex];
                    if (isNullOrUndefined(_this.activePointer.pathElement)) {
                        _this.activePointer.pathElement = [e.target];
                    }
                    var pointInd = parseInt(_this.activePointer.pathElement[0].id.slice(-1), 10);
                    var axisInd = parseInt(_this.activePointer.pathElement[0].id.match(/\d/g)[0], 10);
                    if (currentPointer.pointer.enableDrag) {
                        _this.trigger(dragStart, _this.isBlazor ? {
                            name: dragStart,
                            currentValue: _this.activePointer.currentValue,
                            pointerIndex: pointInd,
                            axisIndex: axisInd
                        } : {
                            axis: _this.activeAxis,
                            name: dragStart,
                            pointer: _this.activePointer,
                            currentValue: _this.activePointer.currentValue,
                            pointerIndex: pointInd,
                            axisIndex: axisInd
                        });
                    }
                    _this.svgObject.setAttribute('cursor', 'pointer');
                    if (!(isNullOrUndefined(current)) && current.pointer) {
                        _this.pointerDrag = true;
                        _this.mouseElement = args.target;
                    }
                }
            }
        });
        return false;
    };
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseMove = function (e) {
        var _this = this;
        var current;
        var element;
        this.setMouseXY(e);
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseMove);
        this.trigger(gaugeMouseMove, args, function (observedArgs) {
            _this.mouseX = args.x;
            _this.mouseY = args.y;
            var dragArgs;
            var dragBlazorArgs;
            if (args.target && !args.cancel) {
                if ((args.target.id.indexOf('MarkerPointer') > -1) || (args.target.id.indexOf('BarPointer') > -1)) {
                    if (_this.axes[_this.axes.length - 1].pointers[_this.axes[_this.axes.length - 1].pointers.length - 1].enableDrag) {
                        current = _this.moveOnPointer(args.target);
                        if (!(isNullOrUndefined(current)) && current.pointer) {
                            _this.element.style.cursor = current.style;
                        }
                        if (_this.activePointer) {
                            _this.isDrag = true;
                            var dragPointInd = parseInt(_this.activePointer.pathElement[0].id.slice(-1), 10);
                            var dragAxisInd = parseInt(_this.activePointer.pathElement[0].id.match(/\d/g)[0], 10);
                            dragArgs = {
                                axis: _this.activeAxis,
                                pointer: _this.activePointer,
                                previousValue: _this.activePointer.currentValue,
                                name: dragMove,
                                currentValue: null,
                                axisIndex: dragAxisInd,
                                pointerIndex: dragPointInd
                            };
                            dragBlazorArgs = {
                                previousValue: _this.activePointer.currentValue,
                                name: dragMove,
                                currentValue: null,
                                pointerIndex: dragPointInd,
                                axisIndex: dragAxisInd
                            };
                            if (args.target.id.indexOf('MarkerPointer') > -1) {
                                _this.markerDrag(_this.activeAxis, (_this.activeAxis.pointers[dragPointInd]));
                            }
                            else {
                                _this.barDrag(_this.activeAxis, (_this.activeAxis.pointers[dragPointInd]));
                            }
                            dragArgs.currentValue = dragBlazorArgs.currentValue = _this.activePointer.currentValue;
                            _this.trigger(dragMove, _this.isBlazor ? dragBlazorArgs : dragArgs);
                        }
                    }
                }
                else {
                    _this.element.style.cursor = (_this.pointerDrag) ? _this.element.style.cursor : 'auto';
                }
                _this.gaugeOnMouseMove(e);
            }
        });
        this.notify(Browser.touchMoveEvent, e);
        return false;
    };
    /**
     * To find the mouse move on pointer.
     * @param element
     */
    LinearGauge.prototype.moveOnPointer = function (element) {
        var current;
        var clientRect = this.element.getBoundingClientRect();
        var axis;
        var isPointer = false;
        var pointer;
        var top;
        var left;
        var pointerElement = getElement(element.id);
        var svgPath = pointerElement;
        var cursorStyle;
        var process;
        current = getPointer(element, this);
        axis = current.axis;
        pointer = current.pointer;
        if (pointer.enableDrag) {
            if (pointer.type === 'Bar') {
                if (this.orientation === 'Vertical') {
                    top = pointerElement.getBoundingClientRect().top - clientRect.top;
                    top = (!axis.isInversed) ? top : top + svgPath.getBBox().height;
                    isPointer = !axis.isInversed ? (this.mouseY < (top + 10) && this.mouseY >= top) :
                        (this.mouseY <= top && this.mouseY > (top - 10));
                    cursorStyle = 'n-resize';
                }
                else {
                    left = pointerElement.getBoundingClientRect().left - clientRect.left;
                    left = (!axis.isInversed) ? left + svgPath.getBBox().width : left;
                    isPointer = !axis.isInversed ? (this.mouseX > (left - 10) && this.mouseX <= left) :
                        (this.mouseX >= left && this.mouseX < (left + 10));
                    cursorStyle = 'e-resize';
                }
            }
            else {
                isPointer = true;
                cursorStyle = 'pointer';
            }
        }
        if (isPointer) {
            process = { pointer: isPointer, style: cursorStyle };
        }
        return process;
    };
    /**
     * @private
     * Handle the right click
     * @param event
     */
    LinearGauge.prototype.gaugeRightClick = function (event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseLeave = function (e) {
        var parentNode;
        this.activeAxis = null;
        this.activePointer = null;
        this.svgObject.setAttribute('cursor', 'auto');
        var args = this.getMouseArgs(e, 'touchmove', gaugeMouseLeave);
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        return false;
    };
    /**
     * Handles the mouse move on gauge.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.gaugeOnMouseMove = function (e) {
        var current;
        if (this.pointerDrag) {
            current = getPointer(this.mouseElement, this);
            if (current.pointer.enableDrag && current.pointer.animationComplete) {
                this[current.pointer.type.toLowerCase() + 'Drag'](current.axis, current.pointer);
            }
        }
        return true;
    };
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    LinearGauge.prototype.mouseEnd = function (e) {
        this.setMouseXY(e);
        var parentNode;
        var tooltipInterval;
        var isTouch = e.pointerType === 'touch' || e.pointerType === '2' || e.type === 'touchend';
        var args = this.getMouseArgs(e, 'touchend', gaugeMouseUp);
        var blazorArgs = {
            cancel: args.cancel, target: args.target, name: args.name, x: args.x, y: args.y
        };
        this.trigger(gaugeMouseUp, this.isBlazor ? blazorArgs : args);
        if (this.activeAxis && this.activePointer) {
            var pointerInd = parseInt(this.activePointer.pathElement[0].id.slice(-1), 10);
            var axisInd = parseInt(this.activePointer.pathElement[0].id.match(/\d/g)[0], 10);
            if (this.activePointer.enableDrag) {
                this.trigger(dragEnd, this.isBlazor ? {
                    name: dragEnd,
                    currentValue: this.activePointer.currentValue,
                    pointerIndex: pointerInd,
                    axisIndex: axisInd
                } : {
                    name: dragEnd,
                    axis: this.activeAxis,
                    pointer: this.activePointer,
                    currentValue: this.activePointer.currentValue,
                    axisIndex: axisInd,
                    pointerIndex: pointerInd
                });
                this.activeAxis = null;
                this.activePointer = null;
                this.isDrag = false;
                if (!isNullOrUndefined(this.mouseElement)) {
                    this.triggerDragEvent(this.mouseElement);
                }
            }
        }
        if (!isNullOrUndefined(this.mouseElement)) {
            parentNode = this.element;
            parentNode.style.cursor = '';
            this.mouseElement = null;
            this.pointerDrag = false;
        }
        this.svgObject.setAttribute('cursor', 'auto');
        this.notify(Browser.touchEndEvent, e);
        return true;
    };
    /**
     * This method handles the print functionality for linear gauge.
     * @param id - Specifies the element to print the linear gauge.
     */
    LinearGauge.prototype.print = function (id) {
        if ((this.allowPrint) && (this.printModule)) {
            this.printModule.print(id);
        }
    };
    /**
     * This method handles the export functionality for linear gauge.
     * @param type - Specifies the type of the export.
     * @param fileName - Specifies the file name for the exported file.
     * @param orientation - Specified the orientation for the exported pdf document.
     */
    LinearGauge.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if ((type !== 'PDF') && (this.allowImageExport) && (this.imageExportModule)) {
            return new Promise(function (resolve, reject) {
                resolve(_this.imageExportModule.export(type, fileName, allowDownload));
            });
        }
        else if ((this.allowPdfExport) && (this.pdfExportModule)) {
            return new Promise(function (resolve, reject) {
                resolve(_this.pdfExportModule.export(type, fileName, orientation, allowDownload));
            });
        }
        return null;
    };
    /**
     * Handles the mouse event arguments.
     * @return {IMouseEventArgs}
     * @private
     */
    LinearGauge.prototype.getMouseArgs = function (e, type, name) {
        var rect = this.element.getBoundingClientRect();
        var location = new GaugeLocation(-rect.left, -rect.top);
        var isTouch = (e.type === type);
        location.x += isTouch ? e.changedTouches[0].clientX : e.clientX;
        location.y += isTouch ? e.changedTouches[0].clientY : e.clientY;
        return {
            cancel: false, name: name,
            model: !this.isBlazor ? this : null,
            x: location.x, y: location.y,
            target: isTouch ? e.target : e.target
        };
    };
    /**
     * @private
     * @param axis
     * @param pointer
     */
    LinearGauge.prototype.markerDrag = function (axis, pointer) {
        var options;
        var value = convertPixelToValue(this.element, this.mouseElement, this.orientation, axis, 'drag', new GaugeLocation(this.mouseX, this.mouseY));
        var process = withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer');
        if (withInRange(value, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            options = new PathOption('pointerID', pointer.color || this.themeStyle.pointerColor, pointer.border.width, pointer.border.color, pointer.opacity, null, null, '');
            if (this.orientation === 'Vertical') {
                pointer.bounds.y = this.mouseY;
            }
            else {
                pointer.bounds.x = this.mouseX;
            }
            pointer.currentValue = value;
            options = calculateShapes(pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height), pointer.imageUrl, options, this.orientation, axis, pointer);
            if (pointer.markerType === 'Image') {
                this.mouseElement.setAttribute('x', (pointer.bounds.x - (pointer.bounds.width / 2)).toString());
                this.mouseElement.setAttribute('y', (pointer.bounds.y - (pointer.bounds.height / 2)).toString());
            }
            else {
                this.mouseElement.setAttribute('d', options.d);
            }
        }
    };
    /**
     * @private
     * @param axis
     * @param pointer
     */
    LinearGauge.prototype.barDrag = function (axis, pointer) {
        var line = axis.lineBounds;
        var range = axis.visibleRange;
        var value1;
        var value2;
        var isDrag;
        var lineHeight = (this.orientation === 'Vertical') ? line.height : line.width;
        var lineY = (this.orientation === 'Vertical') ? line.y : line.x;
        var path;
        value1 = ((valueToCoefficient(range.min, axis, this.orientation, range) * lineHeight) + lineY);
        value2 = ((valueToCoefficient(range.max, axis, this.orientation, range) * lineHeight) + lineY);
        if (this.orientation === 'Vertical') {
            isDrag = (!axis.isInversed) ? (this.mouseY > value2 && this.mouseY < value1) : (this.mouseY > value1 && this.mouseY < value2);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (!axis.isInversed) {
                        this.mouseElement.setAttribute('y', this.mouseY.toString());
                    }
                    this.mouseElement.setAttribute('height', Math.abs(value1 - this.mouseY).toString());
                }
                else {
                    if (!axis.isInversed) {
                        pointer.bounds.y = this.mouseY;
                    }
                    pointer.bounds.height = Math.abs(value1 - this.mouseY);
                }
            }
        }
        else {
            isDrag = (!axis.isInversed) ? (this.mouseX > value1 && this.mouseX < value2) : (this.mouseX > value2 && this.mouseX < value1);
            if (isDrag) {
                if (this.container.type === 'Normal') {
                    if (axis.isInversed) {
                        this.mouseElement.setAttribute('x', this.mouseX.toString());
                    }
                    this.mouseElement.setAttribute('width', Math.abs(value1 - this.mouseX).toString());
                }
                else {
                    if (axis.isInversed) {
                        pointer.bounds.x = this.mouseX;
                    }
                    pointer.bounds.width = Math.abs(value1 - this.mouseX);
                }
            }
        }
        if (isDrag && this.mouseElement.tagName === 'path') {
            path = getBox(pointer.bounds, this.container.type, this.orientation, new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.container.width, axis, pointer.roundedCornerRadius);
            this.mouseElement.setAttribute('d', path);
        }
    };
    /**
     * Triggers when drag the pointer
     * @param activeElement
     */
    LinearGauge.prototype.triggerDragEvent = function (activeElement) {
        var _this = this;
        var active = getPointer(activeElement, this);
        var value = convertPixelToValue(this.element, activeElement, this.orientation, active.axis, 'tooltip', null);
        var dragArgs = {
            name: 'valueChange',
            gauge: !this.isBlazor ? this : null,
            element: activeElement,
            axisIndex: active.axisIndex,
            axis: !this.isBlazor ? active.axis : null,
            pointerIndex: active.pointerIndex,
            pointer: !this.isBlazor ? active.pointer : null,
            value: value
        };
        if (this.isBlazor) {
            var gauge = dragArgs.gauge, axis = dragArgs.axis, pointer = dragArgs.pointer, blazorArgsData = __rest(dragArgs, ["gauge", "axis", "pointer"]);
            dragArgs = blazorArgsData;
        }
        this.trigger(valueChange, dragArgs, function (pointerArgs) {
            _this.setPointerValue(pointerArgs.axisIndex, pointerArgs.pointerIndex, pointerArgs.value);
        });
    };
    /**
     * This method is used to set the pointer value in the linear gauge.
     * @param axisIndex - Specifies the index of the axis.
     * @param pointerIndex - Specifies the index of the pointer.
     * @param value - Specifies the pointer value.
     */
    LinearGauge.prototype.setPointerValue = function (axisIndex, pointerIndex, value) {
        var axis = this.axes[axisIndex];
        var pointer = axis.pointers[pointerIndex];
        var id = this.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + pointerIndex;
        var pointerElement = getElement(id);
        pointer.currentValue = value;
        if ((pointerElement !== null) && withInRange(pointer.currentValue, null, null, axis.visibleRange.max, axis.visibleRange.min, 'pointer')) {
            this.gaugeAxisLayoutPanel['calculate' + pointer.type + 'Bounds'](axisIndex, axis, pointerIndex, pointer);
            this.axisRenderer['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, pointerIndex, pointerElement.parentElement);
        }
    };
    /**
     * This method is used to set the annotation value in the linear gauge.
     * @param annotationIndex - Specifies the index of the annotation.
     * @param content - Specifies the text of the annotation.
     */
    LinearGauge.prototype.setAnnotationValue = function (annotationIndex, content, axisValue) {
        var elementExist = getElement(this.element.id + '_Annotation_' + annotationIndex) === null;
        var element = getElement(this.element.id + '_AnnotationsGroup') ||
            createElement('div', {
                id: this.element.id + '_AnnotationsGroup'
            });
        var annotation = this.annotations[annotationIndex];
        if (content !== null) {
            removeElement(this.element.id + '_Annotation_' + annotationIndex);
            annotation.content = content;
            annotation.axisValue = axisValue ? axisValue : annotation.axisValue;
            this.annotationsModule.createAnnotationTemplate(element, annotationIndex);
            if (!elementExist) {
                element.appendChild(getElement(this.element.id + '_Annotation_' + annotationIndex));
            }
        }
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    LinearGauge.prototype.requiredModules = function () {
        var modules = [];
        var annotationEnable = false;
        var tooltipEnable = false;
        this.annotations.map(function (annotation, index) {
            annotationEnable = annotation.content != null;
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
                args: [this]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this]
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
    LinearGauge.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Get component name
     */
    LinearGauge.prototype.getModuleName = function () {
        return 'lineargauge';
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    LinearGauge.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'height':
                case 'width':
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
                case 'container':
                case 'axes':
                case 'orientation':
                    refreshBounds = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.renderGaugeElements();
            this.renderAxisElements();
        }
        if (refreshBounds) {
            this.createSvg();
            this.renderGaugeElements();
            this.calculateBounds();
            this.renderAxisElements();
        }
    };
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "height", void 0);
    __decorate([
        Property('Vertical')
    ], LinearGauge.prototype, "orientation", void 0);
    __decorate([
        Property(false)
    ], LinearGauge.prototype, "allowPrint", void 0);
    __decorate([
        Property(false)
    ], LinearGauge.prototype, "allowImageExport", void 0);
    __decorate([
        Property(false)
    ], LinearGauge.prototype, "allowPdfExport", void 0);
    __decorate([
        Complex({}, Margin)
    ], LinearGauge.prototype, "margin", void 0);
    __decorate([
        Complex({ color: '', width: 0 }, Border)
    ], LinearGauge.prototype, "border", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "background", void 0);
    __decorate([
        Property('')
    ], LinearGauge.prototype, "title", void 0);
    __decorate([
        Complex({ size: '15px', color: null }, Font)
    ], LinearGauge.prototype, "titleStyle", void 0);
    __decorate([
        Complex({}, Container)
    ], LinearGauge.prototype, "container", void 0);
    __decorate([
        Collection([{}], Axis)
    ], LinearGauge.prototype, "axes", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], LinearGauge.prototype, "tooltip", void 0);
    __decorate([
        Collection([{}], Annotation)
    ], LinearGauge.prototype, "annotations", void 0);
    __decorate([
        Property([])
    ], LinearGauge.prototype, "rangePalettes", void 0);
    __decorate([
        Property(false)
    ], LinearGauge.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], LinearGauge.prototype, "tabIndex", void 0);
    __decorate([
        Property(null)
    ], LinearGauge.prototype, "format", void 0);
    __decorate([
        Property('Material')
    ], LinearGauge.prototype, "theme", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "load", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "animationComplete", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "axisLabelRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "dragStart", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "dragMove", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "dragEnd", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "annotationRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseMove", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseLeave", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseDown", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "gaugeMouseUp", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "valueChange", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "resized", void 0);
    __decorate([
        Event()
    ], LinearGauge.prototype, "beforePrint", void 0);
    LinearGauge = __decorate([
        NotifyPropertyChanges
    ], LinearGauge);
    return LinearGauge;
}(Component));
export { LinearGauge };
