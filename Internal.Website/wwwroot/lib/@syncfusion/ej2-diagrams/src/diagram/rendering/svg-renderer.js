import { Point } from './../primitives/point';
import { Size } from './../primitives/size';
import { pathSegmentCollection, processPathData } from './../utility/path-util';
import { setAttributeSvg, setChildPosition } from './../utility/dom-util';
import { overFlow, wordBreakToString, cornersPointsBeforeRotation } from './../utility/base-util';
import { CanvasRenderer } from './../rendering/canvas-renderer';
import { createSvgElement, createHtmlElement, getBackgroundLayerSvg } from '../utility/dom-util';
import { removeGradient, checkBrowserInfo } from '../utility/diagram-util';
import { isBlazor } from '@syncfusion/ej2-base';
/**
 * SVG Renderer
 */
/** @private */
var SvgRenderer = /** @class */ (function () {
    function SvgRenderer() {
    }
    /**   @private  */
    SvgRenderer.prototype.renderShadow = function (options, canvas, collection, parentSvg) {
        if (collection === void 0) { collection = null; }
        var pointModel = { x: 0, y: 0 };
        var point = Point.transform(pointModel, options.shadow.angle, options.shadow.distance);
        var tX = options.x + point.x;
        var tY = options.y + point.y;
        var pivotX = tX + options.width * options.pivotX;
        var pivotY = tY + options.height * options.pivotY;
        var type;
        var shadowElement;
        if (parentSvg) {
            shadowElement = parentSvg.getElementById(canvas.id + '_shadow');
        }
        if (!shadowElement) {
            type = collection ? 'path' : 'rect';
            shadowElement = document.createElementNS('http://www.w3.org/2000/svg', type);
            canvas.appendChild(shadowElement);
        }
        var attr = {
            'id': canvas.id + '_shadow', 'fill': options.shadow.color, 'stroke': options.shadow.color,
            'opacity': options.shadow.opacity.toString(),
            'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' +
                'translate(' + (options.x + point.x) + ',' + (options.y + point.y) + ')'
        };
        if (parentSvg) {
            var svgContainer = parentSvg.getElementById(canvas.id);
            if (svgContainer) {
                svgContainer.insertBefore(shadowElement, svgContainer.firstChild);
            }
        }
        setAttributeSvg(shadowElement, attr);
        if (!collection) {
            setAttributeSvg(shadowElement, { 'width': options.width, 'height': options.height });
        }
        else if (collection) {
            this.renderPath(shadowElement, options, collection);
        }
    };
    /**   @private  */
    SvgRenderer.prototype.parseDashArray = function (dashArray) {
        var dashes = [];
        return dashes;
    };
    /**   @private  */
    SvgRenderer.prototype.drawRectangle = function (svg, options, diagramId, onlyRect, isSelector, parentSvg, ariaLabel) {
        if (options.shadow && !onlyRect) {
            this.renderShadow(options, svg, undefined, parentSvg);
        }
        var id;
        if (options.id === svg.id) {
            id = options.id + '_container';
        }
        else {
            id = options.id;
        }
        var rect;
        if (parentSvg) {
            rect = parentSvg.getElementById(id);
        }
        if (!rect || isSelector) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            svg.appendChild(rect);
        }
        var shadowElement;
        if (parentSvg && !options.shadow) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow');
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }
        var attr = {
            'id': id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'visibility': options.visible ? 'visible' : 'hidden',
            'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            'rx': options.cornerRadius || 0, 'ry': options.cornerRadius || 0, 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        var poiterEvents = 'pointer-events';
        if (!ariaLabel) {
            attr[poiterEvents] = 'none';
        }
        setAttributeSvg(rect, attr);
        this.setSvgStyle(rect, options, diagramId);
    };
    /**   @private  */
    SvgRenderer.prototype.updateSelectionRegion = function (gElement, options) {
        var rect;
        rect = gElement.parentNode.getElementById(options.id);
        var attr;
        attr = {
            'id': options.id, 'x': options.x.toString(), 'y': options.y.toString(), 'width': options.width.toString(),
            'height': options.height.toString(), 'transform': 'rotate(' + options.angle + ','
                + (options.x + options.width * options.pivotX) + ',' + (options.y + options.height * options.pivotY) + ')',
            class: 'e-diagram-selected-region'
        };
        if (!rect) {
            rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            gElement.appendChild(rect);
        }
        this.setSvgStyle(rect, options);
        setAttributeSvg(rect, attr);
    };
    /**   @private  */
    SvgRenderer.prototype.createGElement = function (elementType, attribute) {
        var gElement = createSvgElement(elementType, attribute);
        return gElement;
    };
    /** @private */
    SvgRenderer.prototype.drawLine = function (gElement, options) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.setSvgStyle(line, options);
        var pivotX = options.x + options.width * options.pivotX;
        var pivotY = options.y + options.height * options.pivotY;
        var kk = '';
        var attr = {
            'id': options.id,
            'x1': options.startPoint.x + options.x,
            'y1': options.startPoint.y + options.y,
            'x2': options.endPoint.x + options.x,
            'y2': options.endPoint.y + options.y,
            'stroke': options.stroke,
            'stroke-width': options.strokeWidth.toString(), 'opacity': options.opacity.toString(),
            'transform': 'rotate(' + options.angle + ' ' + pivotX + ' ' + pivotY + ')',
            'visibility': options.visible ? 'visible' : 'hidden',
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(line, attr);
        gElement.appendChild(line);
    };
    /** @private */
    SvgRenderer.prototype.drawCircle = function (gElement, options, enableSelector, ariaLabel) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.setSvgStyle(circle, options);
        var classval = options.class || '';
        if (!enableSelector) {
            classval += ' e-disabled';
        }
        var attr = {
            'id': options.id,
            'cx': options.centerX,
            'cy': options.centerY,
            'r': options.radius,
            'visibility': options.visible ? 'visible' : 'hidden',
            'class': classval,
            'aria-label': ariaLabel ? ariaLabel['aria-label'] : ''
        };
        circle.style.display = options.visible ? 'block' : 'none';
        setAttributeSvg(circle, attr);
        gElement.appendChild(circle);
    };
    /**   @private  */
    SvgRenderer.prototype.drawPath = function (svg, options, diagramId, isSelector, parentSvg, ariaLabel) {
        var id;
        var x = Math.floor((Math.random() * 10) + 1);
        id = svg.id + '_shape' + x.toString();
        var collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        if (options.shadow) {
            this.renderShadow(options, svg, collection, parentSvg);
        }
        var shadowElement;
        if (parentSvg && !options.shadow) {
            shadowElement = parentSvg.getElementById(options.id + '_groupElement_shadow');
            if (shadowElement) {
                shadowElement.parentNode.removeChild(shadowElement);
            }
        }
        var path;
        if (parentSvg) {
            path = parentSvg.getElementById(options.id);
        }
        if (!path || isSelector) {
            path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svg.appendChild(path);
        }
        this.renderPath(path, options, collection);
        var attr = {
            'id': options.id, 'transform': 'rotate(' + options.angle + ',' + (options.x + options.width * options.pivotX) + ','
                + (options.y + options.height * options.pivotY) + ')' + 'translate(' + (options.x) + ',' + (options.y) + ')',
            'visibility': options.visible ? 'visible' : 'hidden', 'opacity': options.opacity,
            'aria-label': ariaLabel ? ariaLabel : ''
        };
        if (options.class) {
            attr['class'] = options.class;
        }
        setAttributeSvg(path, attr);
        this.setSvgStyle(path, options, diagramId);
    };
    /**   @private  */
    SvgRenderer.prototype.renderPath = function (svg, options, collection) {
        var x1;
        var y1;
        var x2;
        var y2;
        var x;
        var y;
        var length;
        var i;
        var segments = collection;
        var d = '';
        for (x = 0, y = 0, i = 0, length = segments.length; i < length; ++i) {
            var obj = segments[i];
            var segment = obj;
            var char = segment.command;
            if ('x1' in segment) {
                x1 = segment.x1;
            }
            if ('x2' in segment) {
                x2 = segment.x2;
            }
            if ('y1' in segment) {
                y1 = segment.y1;
            }
            if ('y2' in segment) {
                y2 = segment.y2;
            }
            if ('x' in segment) {
                x = segment.x;
            }
            if ('y' in segment) {
                y = segment.y;
            }
            switch (char) {
                case 'M':
                    d = d + 'M' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'L':
                    d = d + 'L' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'C':
                    d = d + 'C' + x1.toString() + ',' + y1.toString() + ',' + x2.toString() + ',' + y2.toString() + ',';
                    d += x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'Q':
                    d = d + 'Q' + x1.toString() + ',' + y1.toString() + ',' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'A':
                    d = d + 'A' + segment.r1.toString() + ',' + segment.r2.toString() + ',' + segment.angle.toString() + ',';
                    d += segment.largeArc.toString() + ',' + segment.sweep + ',' + x.toString() + ',' + y.toString() + ' ';
                    break;
                case 'Z':
                case 'z':
                    d = d + 'Z' + ' ';
                    break;
            }
        }
        svg.setAttribute('d', d);
    };
    SvgRenderer.prototype.setSvgFontStyle = function (text, options) {
        text.style.fontStyle = options.italic ? 'italic' : 'normal';
        text.style.fontWeight = options.bold ? 'bold' : 'normal';
        text.style.fontSize = options.fontSize.toString() + 'px';
        text.style.fontFamily = options.fontFamily;
    };
    /**   @private  */
    SvgRenderer.prototype.drawText = function (canvas, options, parentSvg, ariaLabel, diagramId, scaleValue, parentNode) {
        if (options.content !== undefined) {
            var textNode = void 0;
            var childNodes = void 0;
            var wrapBounds = void 0;
            var position = void 0;
            var child = void 0;
            var tspanElement = void 0;
            var offsetX = 0;
            var offsetY = 0;
            var i = 0;
            var text = void 0;
            if (parentSvg) {
                text = parentSvg.getElementById(options.id + '_text');
            }
            if (text) {
                if (options.doWrap) {
                    while (text.firstChild) {
                        text.removeChild(text.firstChild);
                    }
                }
            }
            else {
                options.doWrap = true;
                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                if (options.whiteSpace === 'pre-wrap') {
                    text.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
                }
                canvas.appendChild(text);
            }
            var pivotX = options.x + options.width * options.pivotX;
            var pivotY = options.y + options.height * options.pivotY;
            var childNodesHeight = 0;
            if (options.doWrap || options.textOverflow !== 'Wrap') {
                var innerHtmlTextElement = document.getElementById(options.id + '_text');
                if (innerHtmlTextElement) {
                    innerHtmlTextElement.innerHTML = '';
                }
                this.setSvgStyle(text, options, diagramId);
                this.setSvgFontStyle(text, options);
                textNode = document.createTextNode(options.content);
                childNodes = options.childNodes;
                wrapBounds = options.wrapBounds;
                position = this.svgLabelAlign(options, wrapBounds, childNodes);
                if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap' && options.textWrapping === 'NoWrap') {
                    childNodes[0].text = overFlow(options.content, options);
                }
                for (i = 0; i < childNodes.length; i++) {
                    tspanElement = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    textNode = document.createTextNode(childNodes[i].text);
                    child = childNodes[i];
                    child.x = setChildPosition(child, childNodes, i, options);
                    offsetX = position.x + child.x - wrapBounds.x;
                    offsetY = position.y + child.dy * (i) + ((options.fontSize) * 0.8);
                    if ((options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') &&
                        (options.textWrapping === 'WrapWithOverflow' || options.textWrapping === 'Wrap') && parentNode) {
                        var size = (options.isHorizontalLane) ? parentNode.actualSize.width : parentNode.actualSize.height;
                        if (offsetY < size) {
                            if (options.textOverflow === 'Ellipsis' && childNodes[i + 1]) {
                                var temp = childNodes[i + 1];
                                var y = position.y + temp.dy * (i + 1) + ((options.fontSize) * 0.8);
                                if (y > size) {
                                    child.text = child.text.slice(0, child.text.length - 3);
                                    child.text = child.text.concat('...');
                                    textNode.data = child.text;
                                }
                            }
                            this.setText(text, tspanElement, child, textNode, offsetX, offsetY);
                            childNodesHeight += child.dy;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        this.setText(text, tspanElement, child, textNode, offsetX, offsetY);
                    }
                }
            }
            if (childNodesHeight && options.isHorizontalLane) {
                pivotX = options.parentOffsetX + options.pivotX;
                pivotY = options.parentOffsetY + options.pivotY;
                options.y = options.parentOffsetY - childNodesHeight * options.pivotY + 0.5;
            }
            if (options.textDecoration && options.textDecoration === 'LineThrough') {
                options.textDecoration = wordBreakToString(options.textDecoration);
            }
            var attr = {
                'id': options.id + '_text', 'fill': options.color, 'visibility': options.visible ? 'visible' : 'hidden',
                'text-decoration': options.textDecoration, 'transform': 'rotate(' + options.angle + ','
                    + (pivotX) + ',' + (pivotY) + ')'
                    + 'translate(' + (options.x) + ',' + (options.y) + ')', 'opacity': options.opacity,
                'aria-label': ariaLabel ? ariaLabel : ''
            };
            setAttributeSvg(text, attr);
        }
    };
    SvgRenderer.prototype.setText = function (text, tspanElement, child, textNode, offsetX, offsetY) {
        setAttributeSvg(tspanElement, { 'x': offsetX.toString(), 'y': offsetY.toString() });
        text.setAttribute('fill', child.text);
        tspanElement.appendChild(textNode);
        text.appendChild(tspanElement);
    };
    /**   @private  */
    SvgRenderer.prototype.drawImage = function (canvas, obj, parentSvg, fromPalette) {
        var id = obj.id + '_image';
        var image;
        if (parentSvg) {
            image = parentSvg.getElementById(obj.id + 'image');
        }
        if (!image) {
            image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            canvas.appendChild(image);
        }
        var imageObj = new Image();
        imageObj.src = obj.source;
        var scale = obj.scale !== 'None' ? obj.scale : '';
        if (isBlazor() && obj.alignment === 'None' && scale === 'Stretch') {
            scale = '';
        }
        var imgAlign = obj.alignment;
        var aspectRatio = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1);
        if (scale) {
            aspectRatio += ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
        }
        var attr = {
            'id': obj.id + 'image', 'x': obj.x.toString(), 'y': obj.y.toString(), 'transform': 'rotate(' + obj.angle + ','
                + (obj.x + obj.width * obj.pivotX) + ',' + (obj.y + obj.height * obj.pivotY) + ')',
            'width': obj.width.toString(), 'visibility': obj.visible ? 'visible' : 'hidden',
            'height': obj.height.toString(), 'preserveAspectRatio': aspectRatio, 'opacity': (obj.opacity || 1).toString()
        };
        setAttributeSvg(image, attr);
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageObj.src.toString());
    };
    /** @private */
    SvgRenderer.prototype.drawHTMLContent = function (element, canvas, transform, value, indexValue) {
        var htmlElement;
        var parentHtmlElement;
        if (canvas) {
            var i = void 0;
            var j = void 0;
            var parentElement = void 0;
            for (i = 0; i < canvas.childNodes.length; i++) {
                parentElement = canvas.childNodes[i];
                for (j = 0; j < parentElement.childNodes.length; j++) {
                    if (parentElement.childNodes[j].id === element.id + '_html_element') {
                        htmlElement = parentElement.childNodes[j];
                        break;
                    }
                }
            }
        }
        if (!htmlElement) {
            parentHtmlElement = canvas.querySelector(('#' + element.id + '_html_element')) ||
                canvas.querySelector(('#' + element.nodeId + '_html_element'));
            if (!parentHtmlElement) {
                var attr_1 = {
                    'id': element.nodeId + '_html_element',
                    'class': 'foreign-object'
                };
                parentHtmlElement = createHtmlElement('div', attr_1);
            }
            var attr = {
                'id': element.id + '_html_element',
                'class': 'foreign-object'
            };
            htmlElement = createHtmlElement('div', attr);
            element.isTemplate ? htmlElement.appendChild(element.template) : htmlElement.appendChild(element.template.cloneNode(true));
            if (indexValue !== undefined && canvas.childNodes.length > indexValue) {
                canvas.insertBefore(htmlElement, canvas.childNodes[indexValue]);
            }
            parentHtmlElement.appendChild(htmlElement);
            canvas.appendChild(parentHtmlElement);
        }
        var point = cornersPointsBeforeRotation(element).topLeft;
        htmlElement.setAttribute('style', 'height:' + (element.actualSize.height) + 'px; width:' + (element.actualSize.width) +
            'px;left:' + point.x + 'px; top:' + point.y + 'px;' +
            'position:absolute;transform:rotate(' + (element.rotateAngle + element.parentTransform) + 'deg);' +
            'pointer-events:' + (value ? 'all' : 'none')
            + ';visibility:' + ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';');
    };
    /** @private */
    SvgRenderer.prototype.drawNativeContent = function (element, canvas, height, width, parentSvg) {
        var nativeElement;
        var clipPath;
        if (parentSvg) {
            nativeElement = parentSvg.getElementById(element.id + '_native_element');
            clipPath = parentSvg.getElementById(element.id + '_clip');
        }
        if (!nativeElement) {
            nativeElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            nativeElement.setAttribute('id', element.id + '_native_element');
            nativeElement.appendChild(element.template.cloneNode(true));
            canvas.appendChild(nativeElement);
        }
        if (clipPath) {
            nativeElement.removeChild(clipPath);
        }
        nativeElement.setAttribute('style', 'visibility:' +
            ((element.visible) ? 'visible' : 'hidden') + ';opacity:' + element.style.opacity + ';');
        this.setNativTransform(element, nativeElement, height, width);
        if (element.scale === 'Slice') {
            this.drawClipPath(element, nativeElement, height, width, parentSvg);
        }
        setAttributeSvg(nativeElement, element.description ? { 'aria-label': element.description } : {});
    };
    SvgRenderer.prototype.setNativTransform = function (element, nativeElement, height, width) {
        var angle;
        var contentWidth = element.contentSize.width !== 0 ? element.contentSize.width : 1;
        var contentHeight = element.contentSize.height !== 0 ? element.contentSize.height : 1;
        var x = element.templatePosition.x * width / contentWidth;
        var y = element.templatePosition.y * height / contentHeight;
        nativeElement.setAttribute('transform', 'rotate(' + element.parentTransform + ',' + element.offsetX + ',' + element.offsetY +
            ') translate(' + (element.offsetX - x - width * element.pivot.x) + ',' + (element.offsetY - y - height * element.pivot.y) +
            ') scale(' + (width / contentWidth) + ',' + (height / contentHeight) + ')');
    };
    /**
     * used to crop the given native element into a rectangle of the given size
     * @private
     * @param {DiagramNativeElement} node
     * @param {SVGElement} group
     * @param {number} height
     * @param {number} width
     * @param {SVGSVGElement} parentSvg
     */
    SvgRenderer.prototype.drawClipPath = function (node, group, height, width, parentSvg) {
        var contentWidth = node.contentSize.width;
        var contentHeight = node.contentSize.height;
        var actualWidth = node.actualSize.width;
        var actualHeight = node.actualSize.height;
        var clipWidth = node.width / (width / contentWidth);
        var clipHeight = node.height / (height / contentHeight);
        var x = node.templatePosition.x + (node.width >= node.height ? 0 : (contentWidth - clipWidth) / 2);
        var y = node.templatePosition.y + (node.height >= node.width ? 0 : (contentHeight - clipHeight) / 2);
        var clipPath = parentSvg.getElementById(node.id + '_clip');
        clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', node.id + '_clip');
        group.appendChild(clipPath);
        var rect = parentSvg.getElementById(node.id + '_clip_rect');
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        clipPath.appendChild(rect);
        var attr = {
            'id': node.id + '_clip_rect', 'width': clipWidth.toString(), 'height': clipHeight.toString(),
            'x': x.toString(), 'y': y.toString()
        };
        setAttributeSvg(rect, attr);
        if (checkBrowserInfo()) {
            group.setAttribute('clip-path', 'url(' + location.protocol + '//' + location.host + location.pathname +
                '#' + node.id + '_clip)');
        }
        else {
            group.setAttribute('clip-path', 'url(#' + node.id + '_clip)');
        }
        return group;
    };
    /**   @private  */
    SvgRenderer.prototype.renderGradient = function (options, svg, diagramId) {
        var max;
        var min;
        var grd;
        var svgContainer = getBackgroundLayerSvg(diagramId);
        var defs = svgContainer.getElementById(diagramId + 'gradient_pattern');
        if (!defs) {
            defs = createSvgElement('defs', { id: diagramId + 'gradient_pattern' });
            svgContainer.insertBefore(defs, svgContainer.firstChild);
        }
        var radial;
        var linear;
        var stop;
        var offset;
        removeGradient(svg.id);
        if (options.gradient.type !== 'None') {
            for (var i = 0; i < options.gradient.stops.length; i++) {
                max = !max ? options.gradient.stops[i].offset : Math.max(max, options.gradient.stops[i].offset);
                min = !min ? options.gradient.stops[i].offset : Math.min(min, options.gradient.stops[i].offset);
            }
            if (options.gradient.type === 'Linear') {
                linear = options.gradient;
                linear.id = svg.id + '_linear';
                grd = this.createLinearGradient(linear);
                defs.appendChild(grd);
            }
            else {
                radial = options.gradient;
                radial.id = svg.id + '_radial';
                grd = this.createRadialGradient(radial);
                defs.appendChild(grd);
            }
            for (var i = 0; i < options.gradient.stops.length; i++) {
                var stop_1 = options.gradient.stops[i];
                var offset_1 = min < 0 ? (max + stop_1.offset) / (2 * max) : stop_1.offset / max;
                var stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                setAttributeSvg(stopElement, { 'offset': offset_1.toString(), 'style': 'stop-color:' + stop_1.color });
                grd.appendChild(stopElement);
            }
        }
        return grd;
    };
    /**   @private  */
    SvgRenderer.prototype.createLinearGradient = function (linear) {
        var lineargradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        var attr = {
            'id': linear.id, 'x1': linear.x1 + '%', 'y1': linear.y1 + '%', 'x2': linear.x2 + '%', 'y2': linear.y2 + '%'
        };
        setAttributeSvg(lineargradient, attr);
        return lineargradient;
    };
    /**   @private  */
    SvgRenderer.prototype.createRadialGradient = function (radial) {
        var radialgradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        var attr = {
            'id': radial.id, 'cx': radial.cx + '%', 'cy': radial.cy + '%', 'r': radial.r + '%', 'fx': radial.fx + '%', 'fy': radial.fy + '%'
        };
        setAttributeSvg(radialgradient, attr);
        return radialgradient;
    };
    /**   @private  */
    SvgRenderer.prototype.setSvgStyle = function (svg, style, diagramId) {
        if (style.canApplyStyle || style.canApplyStyle === undefined) {
            if (style.fill === 'none') {
                style.fill = 'transparent';
            }
            if (style.stroke === 'none') {
                style.stroke = 'transparent';
            }
            var dashArray = [];
            var fill = void 0;
            if (style.dashArray) {
                var canvasRenderer = new CanvasRenderer();
                dashArray = canvasRenderer.parseDashArray(style.dashArray);
            }
            if (style.gradient && style.gradient.type !== 'None') {
                var grd = this.renderGradient(style, svg, diagramId);
                if (checkBrowserInfo()) {
                    fill = 'url(' + location.protocol + '//' + location.host + location.pathname + '#' + grd.id + ')';
                }
                else {
                    fill = 'url(#' + grd.id + ')';
                }
            }
            else {
                fill = style.fill;
            }
            if (style.stroke) {
                svg.setAttribute('stroke', style.stroke);
            }
            if (style.strokeWidth !== undefined && style.strokeWidth !== null) {
                svg.setAttribute('stroke-width', style.strokeWidth.toString());
            }
            if (dashArray) {
                svg.setAttribute('stroke-dasharray', dashArray.toString() || 'none');
            }
            if (fill) {
                svg.setAttribute('fill', fill);
            }
        }
    };
    //end region
    // text utility
    /**   @private  */
    SvgRenderer.prototype.svgLabelAlign = function (text, wrapBound, childNodes) {
        var bounds = new Size(wrapBound.width, childNodes.length * (text.fontSize * 1.2));
        var pos = { x: 0, y: 0 };
        var x = 0;
        var y = 1.2;
        var offsetX = text.width * 0.5;
        var offsety = text.height * 0.5;
        var pointX = offsetX;
        var pointY = offsety;
        if (text.textAlign === 'left') {
            pointX = 0;
        }
        else if (text.textAlign === 'center') {
            if (wrapBound.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                if (text.textWrapping === 'NoWrap') {
                    pointX = 0;
                }
                else {
                    pointX = text.width * 0.5;
                }
            }
            else {
                pointX = text.width * 0.5;
            }
        }
        else if (text.textAlign === 'right') {
            pointX = (text.width * 1);
        }
        pos.x = x + pointX + (wrapBound ? wrapBound.x : 0);
        pos.y = y + pointY - bounds.height / 2;
        return pos;
    };
    return SvgRenderer;
}());
export { SvgRenderer };
