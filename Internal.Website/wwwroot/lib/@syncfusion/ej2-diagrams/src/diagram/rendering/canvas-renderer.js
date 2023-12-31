import { Size } from './../primitives/size';
import { Point } from './../primitives/point';
import { processPathData, pathSegmentCollection, getRectanglePath } from './../utility/path-util';
import { overFlow } from './../utility/base-util';
import { createHtmlElement, setChildPosition } from './../utility/dom-util';
/**
 * Canvas Renderer
 */
/** @private */
var CanvasRenderer = /** @class */ (function () {
    function CanvasRenderer() {
    }
    /**   @private  */
    CanvasRenderer.getContext = function (canvas) {
        return canvas.getContext('2d');
    };
    CanvasRenderer.setCanvasSize = function (canvas, width, height) {
        if (canvas) {
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());
        }
    };
    ;
    /**   @private  */
    CanvasRenderer.prototype.renderGradient = function (options, ctx, x, y) {
        var max;
        var min;
        var grd;
        if (options.gradient.type !== 'None') {
            for (var i = 0; i < options.gradient.stops.length; i++) {
                max = max !== undefined ? options.gradient.stops[i].offset : Math.max(max, options.gradient.stops[i].offset);
                min = min !== undefined ? options.gradient.stops[i].offset : Math.min(min, options.gradient.stops[i].offset);
            }
            if (options.gradient.type === 'Linear') {
                var linear = options.gradient;
                grd = ctx.createLinearGradient(x + linear.x1, y + linear.y1, x + linear.x2, y + linear.y2);
            }
            else {
                var radial = options.gradient;
                grd = ctx.createRadialGradient(x + radial.fx, y + radial.fy, 0, x + radial.cx, y + radial.cy, radial.r);
            }
            for (var i = 0; i < options.gradient.stops.length; i++) {
                var stop_1 = options.gradient.stops[i];
                var offset = min < 0 ? (max + stop_1.offset) / (2 * max) : stop_1.offset / max;
                grd.addColorStop(offset, stop_1.color);
            }
            ctx.fillStyle = grd;
        }
        return ctx;
    };
    /**   @private  */
    CanvasRenderer.prototype.renderShadow = function (options, canvas, collection) {
        if (collection === void 0) { collection = null; }
        var ctx = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = options.shadow.color;
        ctx.globalAlpha = options.shadow.opacity;
        var ptModel = { x: 0, y: 0 };
        var point = Point.transform(ptModel, options.shadow.angle, options.shadow.distance);
        var transX = options.x + point.x;
        var transY = options.y + point.y;
        var pivotX = transX + options.width * options.pivotX;
        var pivotY = transY + options.height * options.pivotY;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        if (collection) {
            ctx.translate(transX, transY);
            this.renderPath(canvas, options, collection);
            ctx.translate(-transX, -transY);
        }
        else {
            ctx.rect(transX, transY, options.width, options.height);
            ctx.fillRect(transX, transY, options.width, options.height);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };
    /**   @private  */
    CanvasRenderer.createCanvas = function (id, width, height) {
        var canvasObj = createHtmlElement('canvas', { 'id': id });
        this.setCanvasSize(canvasObj, width, height);
        return canvasObj;
    };
    ;
    CanvasRenderer.prototype.setStyle = function (canvas, style) {
        var ctx = CanvasRenderer.getContext(canvas);
        if (style.fill === 'none') {
            style.fill = 'transparent';
        }
        if (style.stroke === 'none') {
            style.stroke = 'transparent';
        }
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeWidth;
        if (style.strokeWidth === 0) {
            ctx.strokeStyle = 'transparent';
        }
        ctx.globalAlpha = style.opacity;
        var dashArray = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        if (style.gradient && style.gradient.type !== 'None') {
            this.renderGradient(style, ctx, 0, 0);
        }
        else {
            ctx.fillStyle = style.fill;
        }
    };
    CanvasRenderer.prototype.rotateContext = function (canvas, angle, x, y) {
        var ctx = CanvasRenderer.getContext(canvas);
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
    };
    CanvasRenderer.prototype.setFontStyle = function (canvas, text) {
        var ctx = CanvasRenderer.getContext(canvas);
        var font = '';
        if (text.italic) {
            font += 'italic ';
        }
        if (text.bold) {
            font += 'bold ';
        }
        font += (text.fontSize) + 'px ';
        font += text.fontFamily;
        ctx.font = font;
    };
    /**   @private  */
    CanvasRenderer.prototype.parseDashArray = function (dashArray) {
        var dashes = [];
        var separator = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        var splittedDashes = dashArray.split(separator);
        for (var _i = 0, splittedDashes_1 = splittedDashes; _i < splittedDashes_1.length; _i++) {
            var i = splittedDashes_1[_i];
            dashes.push(Number(i));
        }
        return dashes;
    };
    //Rendering Part
    /**   @private  */
    CanvasRenderer.prototype.drawRectangle = function (canvas, options) {
        if (options.visible === true) {
            if (options.cornerRadius) {
                options.data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options);
            }
            else {
                var ctx = CanvasRenderer.getContext(canvas);
                if (options.shadow) {
                    this.renderShadow(options, canvas);
                }
                ctx.save();
                ctx.beginPath();
                var cornerRadius = options.cornerRadius;
                var pivotX = options.x + options.width * options.pivotX;
                var pivotY = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
                this.setStyle(canvas, options);
                ctx.rect(options.x, options.y, options.width, options.height);
                ctx.fillRect(options.x, options.y, options.width, options.height);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    };
    // public updateSelectionRegion(canvas: HTMLCanvasElement, options: RectAttributes): void {
    //     this.drawRectangle(canvas, options);
    // }
    // public drawLine(canvas: HTMLCanvasElement, options: LineAttributes): void {
    //     let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
    //     ctx.save();
    //     ctx.beginPath();
    //     let pivotX: number = options.x + options.width * options.pivotX;
    //     let pivotY: number = options.y + options.height * options.pivotY;
    //     this.rotateContext(canvas, options.angle, pivotX, pivotY);
    //     this.setStyle(canvas, options as StyleAttributes);
    //     ctx.translate(options.x, options.y);
    //     ctx.moveTo(options.startPoint.x, options.startPoint.y);
    //     ctx.lineTo(options.endPoint.x, options.endPoint.y);
    //     ctx.translate(-options.x, -options.y);
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.restore();
    // }
    // public drawCircle(canvas: HTMLCanvasElement, options: CircleAttributes): void {
    //     let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
    //     ctx.save();
    //     ctx.beginPath();
    //     let pivotY: number = options.y + options.height * options.pivotY;
    //     let pivotX: number = options.x + options.width * options.pivotX;
    //     this.setStyle(canvas, options as StyleAttributes);
    //     this.rotateContext(canvas, options.angle, pivotX, pivotY);
    //     ctx.arc(options.centerX, options.centerY, options.radius, 0, 2 * Math.PI);
    //     ctx.fill();
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.restore();
    // }
    /**   @private  */
    CanvasRenderer.prototype.drawPath = function (canvas, options) {
        var collection = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        if (options.shadow) {
            this.renderShadow(options, canvas, collection);
        }
        var ctx = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        var pivotY = options.y + options.height * options.pivotY;
        var pivotX = options.x + options.width * options.pivotX;
        if (options.flip === 'Horizontal' || options.flip === 'Vertical') {
            ctx.translate(options.x + options.width / 2, options.y + options.height / 2);
            ctx.rotate(-options.angle * Math.PI / 180);
            ctx.translate(-options.x - options.width / 2, -options.y - options.height / 2);
        }
        else {
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
        }
        this.setStyle(canvas, options);
        ctx.translate(options.x, options.y);
        if (options.flip === 'Horizontal') {
            ctx.scale(-1, 1);
            ctx.translate(options.width * -1, 0);
        }
        else if (options.flip === 'Vertical') {
            ctx.scale(1, -1);
            ctx.translate(0, options.height * -1);
        }
        else if (options.flip === 'Both') {
            ctx.scale(-1, -1);
            ctx.translate(options.width * -1, options.height * -1);
        }
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
    };
    /**   @private  */
    CanvasRenderer.prototype.renderPath = function (canvas, options, collection) {
        if (options.visible === true) {
            var ctx = CanvasRenderer.getContext(canvas);
            var x0 = void 0;
            var y0 = void 0;
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var x = void 0;
            var y = void 0;
            var length_1;
            var i = void 0;
            var newSeg = void 0;
            var segs = collection;
            for (x = 0, y = 0, i = 0, length_1 = segs.length; i < length_1; ++i) {
                var obj = segs[i];
                var seg = obj;
                var char = seg.command;
                if ('x1' in seg) {
                    x1 = seg.x1;
                }
                if ('x2' in seg) {
                    x2 = seg.x2;
                }
                if ('y1' in seg) {
                    y1 = seg.y1;
                }
                if ('y2' in seg) {
                    y2 = seg.y2;
                }
                if ('x' in seg) {
                    x = seg.x;
                }
                if ('y' in seg) {
                    y = seg.y;
                }
                switch (char) {
                    case 'M':
                        ctx.moveTo(x, y);
                        seg.x = x;
                        seg.y = y;
                        break;
                    case 'L':
                        ctx.lineTo(x, y);
                        seg.x = x;
                        seg.y = y;
                        break;
                    case 'C':
                        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                        seg.x = x;
                        seg.y = y;
                        seg.x1 = x1;
                        seg.y1 = y1;
                        seg.x2 = x2;
                        seg.y2 = y2;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(x1, y1, x, y);
                        seg.x = x;
                        seg.y = y;
                        seg.x1 = x1;
                        seg.y1 = y1;
                        break;
                    case 'A':
                        var curr = { x: x0, y: y0 };
                        var rx = seg.r1;
                        var ry = seg.r2;
                        var xAxisRotation = seg.angle * (Math.PI / 180.0);
                        var largeArc = seg.largeArc;
                        var sweep = seg.sweep;
                        var cp = { x: x, y: y };
                        var currp = {
                            x: Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        };
                        var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }
                        var k = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                        var s = (largeArc === sweep ? -1 : 1) * Math.sqrt(((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
                        if (isNaN(s)) {
                            s = 0;
                        }
                        var cpp = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                        var centp = {
                            x: (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                            y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        };
                        var a1 = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                        var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                        var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                        var ad = this.a(u, v);
                        if (this.r(u, v) <= -1) {
                            ad = Math.PI;
                        }
                        if (this.r(u, v) >= 1) {
                            ad = 0;
                        }
                        var dir = !sweep ? -1.0 : 1.0;
                        var ah = a1 + dir * (ad / 2.0);
                        var halfWay = {
                            x: centp.x + rx * Math.cos(ah),
                            y: centp.y + ry * Math.sin(ah)
                        };
                        seg.centp = centp;
                        seg.xAxisRotation = xAxisRotation;
                        seg.rx = rx;
                        seg.ry = ry;
                        seg.a1 = a1;
                        seg.ad = ad;
                        seg.sweep = sweep;
                        if (ctx != null) {
                            var ra = rx > ry ? rx : ry;
                            var sx = rx > ry ? 1 : rx / ry;
                            var sy = rx > ry ? ry / rx : 1;
                            ctx.save();
                            ctx.translate(centp.x, centp.y);
                            ctx.rotate(xAxisRotation);
                            ctx.scale(sx, sy);
                            ctx.arc(0, 0, ra, a1, a1 + ad, !sweep);
                            ctx.scale(1 / sx, 1 / sy);
                            ctx.rotate(-xAxisRotation);
                            ctx.translate(-centp.x, -centp.y);
                            ctx.restore();
                        }
                        break;
                    case 'Z':
                    case 'z':
                        ctx.closePath();
                        x = x0;
                        y = y0;
                        break;
                }
                x0 = x;
                y0 = y;
            }
        }
    };
    /**   @private  */
    CanvasRenderer.prototype.drawText = function (canvas, options, parentSvg, ariaLabel, diagramId, scaleValue, parentNode) {
        if (options.content && options.visible === true) {
            var ctx = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options);
            if (scaleValue) {
                options.fontSize *= scaleValue;
            }
            var pivotX = options.x + options.width * options.pivotX;
            var pivotY = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            this.setFontStyle(canvas, options);
            var i = 0;
            var childNodes = [];
            childNodes = options.childNodes;
            var wrapBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                var position = this.labelAlign(options, wrapBounds, childNodes);
                for (i = 0; i < childNodes.length; i++) {
                    var child = childNodes[i];
                    child.x = setChildPosition(child, childNodes, i, options);
                    var offsetX = position.x + (scaleValue ? child.x * scaleValue : child.x) - wrapBounds.x;
                    var offsetY = position.y + (scaleValue ? child.dy * scaleValue : child.dy) * i + ((options.fontSize) * 0.8);
                    if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap' && options.textWrapping === 'NoWrap') {
                        child.text = overFlow(child.text, options);
                    }
                    if ((options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') && options.textWrapping === 'Wrap') {
                        if (offsetY < parentNode.actualSize.height + parentNode.bounds.y) {
                            if (options.textOverflow === 'Ellipsis' && childNodes[i + 1]) {
                                var temp = childNodes[i + 1];
                                var y = position.y + temp.dy * (i + 1) + ((options.fontSize) * 0.8);
                                if (y > parentNode.actualSize.height + parentNode.bounds.y) {
                                    child.text = child.text.slice(0, child.text.length - 3);
                                    child.text = child.text.concat('...');
                                }
                            }
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else {
                        ctx.fillText(child.text, offsetX, offsetY);
                    }
                    if (options.textDecoration === 'Underline'
                        || options.textDecoration === 'Overline'
                        || options.textDecoration === 'LineThrough') {
                        var startPointX = offsetX;
                        var startPointY = void 0;
                        var textlength = ctx.measureText(child.text).width;
                        var endPointX = offsetX + textlength;
                        var endPointY = void 0;
                        switch (options.textDecoration) {
                            case 'Underline':
                                startPointY = offsetY + 2;
                                endPointY = offsetY + 2;
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                        }
                        ctx.beginPath();
                        ctx.moveTo(startPointX, startPointY);
                        ctx.lineTo(endPointX, endPointY);
                        ctx.strokeStyle = options.color;
                        ctx.lineWidth = options.fontSize * .08;
                        ctx.globalAlpha = options.opacity;
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    };
    CanvasRenderer.prototype.loadImage = function (ctx, obj, canvas, pivotX, pivotY) {
        this.rotateContext(canvas, obj.angle, pivotX, pivotY);
        var image = new Image();
        image.src = obj.source;
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj);
    };
    /**   @private  */
    CanvasRenderer.prototype.drawImage = function (canvas, obj, parentSvg, fromPalette) {
        var _this = this;
        if (obj.visible) {
            var ctx_1 = CanvasRenderer.getContext(canvas);
            ctx_1.save();
            var pivotX_1 = obj.x + obj.width * obj.pivotX;
            var pivotY_1 = obj.y + obj.height * obj.pivotY;
            var imageObj = new Image();
            imageObj.src = obj.source;
            var id = ctx_1.canvas.id.split('_');
            var value = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
            /**
             *  Since Clipping portion for node with slice option is not calculated properly
             * if (obj.sourceX !== undefined && obj.sourceY !== undefined && obj.sourceWidth !== undefined
             *  && obj.sourceHeight !== undefined) {
             *  ctx.drawImage(imageObj, obj.sourceX, obj.sourceY, obj.sourceWidth, obj.sourceHeight, obj.x, obj.y, obj.width, obj.height);
             *  } else {
             *             ctx.drawImage(imageObj, obj.x, obj.y, obj.width, obj.height);
             * }
             */
            if (!fromPalette) {
                this.loadImage(ctx_1, obj, canvas, pivotX_1, pivotY_1);
            }
            else {
                imageObj.onload = function () {
                    _this.loadImage(ctx_1, obj, canvas, pivotX_1, pivotY_1);
                };
            }
            ctx_1.restore();
        }
    };
    CanvasRenderer.prototype.image = function (ctx, image, x, y, width, height, alignOptions) {
        ctx.beginPath();
        var srcWidth = image.width;
        var srcHeight = image.height;
        var destinationW = width;
        var destinationH = height;
        var resultWidth = 0;
        var resultHeight = 0;
        if (alignOptions && alignOptions.alignment !== 'None') {
            var xalign = alignOptions.alignment.toLowerCase().substr(1, 3);
            var yalign = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                var a = function () {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
                var b = function () {
                    resultWidth = srcWidth * destinationH / srcHeight;
                    resultHeight = destinationH;
                };
                if (destinationW > destinationH) {
                    a();
                    if (destinationH > resultHeight) {
                        b();
                    }
                }
                else if (destinationW === destinationH) {
                    if (srcWidth > srcHeight) {
                        b();
                    }
                    else {
                        a();
                    }
                }
                else {
                    b();
                    if (destinationW > resultWidth) {
                        a();
                    }
                }
                var x1 = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                var y1 = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);
                var sWidth = srcWidth - x1;
                var sHeight = srcHeight - y1;
                var dWidth = resultWidth - (x1 * (resultWidth / srcWidth));
                var dHeight = resultHeight - (y1 * (resultHeight / srcHeight));
                var canvas1 = createHtmlElement('canvas', { 'width': width.toString(), 'height': height.toString() });
                var ctx1 = canvas1.getContext('2d');
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.drawImage(canvas1, x, y, width, height);
            }
            else if (alignOptions.scale === 'Meet') {
                var srcRatio = (srcHeight / srcWidth);
                var destRatio = (destinationH / destinationW);
                resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio;
                resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;
                x += this.getMeetOffset(xalign, resultWidth, destinationW);
                y += this.getMeetOffset(yalign, resultHeight, destinationH);
                ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
            }
            else {
                ctx.drawImage(image, x, y, width, height);
            }
        }
        else if (alignOptions.flip !== 'None') {
            var scaleX = 1;
            var scaleY = 1;
            if (alignOptions.flip === 'Horizontal' || alignOptions.flip === 'Both') {
                x = -x;
                width = -width;
                scaleX = -1;
            }
            if (alignOptions.flip === 'Vertical' || alignOptions.flip === 'Both') {
                y = -y;
                height = -height;
                scaleY = -1;
            }
            ctx.scale(scaleX, scaleY);
            ctx.drawImage(image, x, y, width, height);
        }
        else {
            ctx.drawImage(image, x, y, width, height);
        }
        ctx.closePath();
    };
    CanvasRenderer.prototype.getSliceOffset = function (arg, res, dest, src) {
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (res - dest) / 2 * src / res;
            case 'max': return (res - dest) * src / res;
            default: return 0;
        }
    };
    CanvasRenderer.prototype.getMeetOffset = function (arg, res, dest) {
        var max = Math.max(res, dest);
        var min = Math.min(res, dest);
        switch (arg) {
            case 'min': return 0;
            case 'mid': return (max - min) / 2;
            case 'max': return max - min;
            default: return 0;
        }
    };
    //end region
    // vector magnitude
    CanvasRenderer.prototype.m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); };
    // ratio between two vectors
    CanvasRenderer.prototype.r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); };
    // angle between two vectors
    CanvasRenderer.prototype.a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); };
    // text utility
    /**   @private  */
    CanvasRenderer.prototype.labelAlign = function (text, wrapBounds, childNodes) {
        var bounds = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        var position = { x: 0, y: 0 };
        var labelX = text.x;
        var labelY = text.y;
        var offsetx = text.width * 0.5;
        var offsety = text.height * 0.5;
        var pointx = offsetx;
        var pointy = offsety;
        if (text.textAlign === 'left') {
            pointx = 0;
        }
        else if (text.textAlign === 'center') {
            if (wrapBounds.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                if (text.textWrapping === 'NoWrap') {
                    pointx = 0;
                }
                else {
                    pointx = text.width * 0.5;
                }
            }
            else {
                pointx = text.width * 0.5;
            }
        }
        else if (text.textAlign === 'right') {
            pointx = (text.width * 1);
        }
        position.x = labelX + pointx + (wrapBounds ? wrapBounds.x : 0);
        position.y = labelY + pointy - bounds.height / 2;
        return position;
    };
    return CanvasRenderer;
}());
export { CanvasRenderer };
