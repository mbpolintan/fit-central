import { RectOption, CircleOption } from '../utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
/**
 * Create scrollbar svg.
 * @return {void}
 */
export function createScrollSvg(scrollbar, renderer) {
    var rect = scrollbar.axis.rect;
    var isHorizontalAxis = scrollbar.axis.orientation === 'Horizontal';
    var enablePadding = false;
    var markerHeight = 5;
    var yMin;
    for (var _i = 0, _a = scrollbar.axis.series; _i < _a.length; _i++) {
        var tempSeries = _a[_i];
        if (tempSeries.marker.height > markerHeight) {
            markerHeight = tempSeries.marker.height;
        }
    }
    for (var _b = 0, _c = scrollbar.axis.series; _b < _c.length; _b++) {
        var tempSeries = _c[_b];
        yMin = tempSeries.yMin.toString();
        enablePadding = (tempSeries.yData).some(function (yData) {
            return yData === yMin;
        });
        if (enablePadding) {
            break;
        }
    }
    scrollbar.svgObject = renderer.createSvg({
        id: scrollbar.component.element.id + '_' + 'scrollBar_svg' + scrollbar.axis.name,
        width: scrollbar.isVertical ? scrollbar.height : scrollbar.width,
        height: scrollbar.isVertical ? scrollbar.width : scrollbar.height,
        style: 'position: absolute;top: ' + ((scrollbar.axis.opposedPosition && isHorizontalAxis ? -16 :
            (enablePadding ? markerHeight : 0)) + rect.y) + 'px;left: ' +
            (((scrollbar.axis.opposedPosition && !isHorizontalAxis ? 16 : 0) + rect.x) - (scrollbar.isVertical ? scrollbar.height : 0))
            + 'px;cursor:auto;'
    });
    scrollbar.elements.push(scrollbar.svgObject);
}
/**
 * Scrollbar elements renderer
 */
var ScrollElements = /** @class */ (function () {
    /**
     * Constructor for scroll elements
     * @param scrollObj
     */
    function ScrollElements(chart) {
        this.chartId = chart.element.id + '_';
    }
    /**
     * Render scrollbar elements.
     * @return {void}
     * @private
     */
    ScrollElements.prototype.renderElements = function (scroll, renderer) {
        var scrollGroup = renderer.createGroup({
            id: this.chartId + 'scrollBar_' + scroll.axis.name,
            transform: 'translate(' + ((scroll.isVertical && scroll.axis.isInversed) ? scroll.height : scroll.axis.isInversed ?
                scroll.width : '0') + ',' + (scroll.isVertical && scroll.axis.isInversed ? '0' : scroll.axis.isInversed ?
                scroll.height : scroll.isVertical ? scroll.width : '0') + ') rotate(' + (scroll.isVertical && scroll.axis.isInversed ?
                '90' : scroll.isVertical ? '270' : scroll.axis.isInversed ? '180' : '0') + ')'
        });
        var backRectGroup = renderer.createGroup({
            id: this.chartId + 'scrollBar_backRect_' + scroll.axis.name
        });
        var thumbGroup = renderer.createGroup({
            id: this.chartId + 'scrollBar_thumb_' + scroll.axis.name,
            transform: 'translate(0,0)'
        });
        this.backRect(scroll, renderer, backRectGroup);
        this.thumb(scroll, renderer, thumbGroup);
        this.renderCircle(scroll, renderer, thumbGroup);
        this.arrows(scroll, renderer, thumbGroup);
        this.thumbGrip(scroll, renderer, thumbGroup);
        scrollGroup.appendChild(backRectGroup);
        scrollGroup.appendChild(thumbGroup);
        return scrollGroup;
    };
    /**
     * Method to render back rectangle of scrollbar
     * @param scroll
     */
    ScrollElements.prototype.backRect = function (scroll, renderer, parent) {
        var style = scroll.scrollbarThemeStyle;
        var backRectEle = renderer.drawRectangle(new RectOption(this.chartId + 'scrollBarBackRect_' + scroll.axis.name, style.backRect, { width: 1, color: style.backRect }, 1, new Rect(0, 0, scroll.width, scroll.height), 0, 0));
        parent.appendChild(backRectEle);
    };
    /**
     * Method to render arrows
     * @param scroll
     */
    ScrollElements.prototype.arrows = function (scroll, renderer, parent) {
        var style = scroll.scrollbarThemeStyle;
        var option = new PathOption(this.chartId + 'scrollBar_leftArrow_' + scroll.axis.name, style.arrow, 1, style.arrow, 1, '', '');
        this.leftArrowEle = renderer.drawPath(option);
        option.id = this.chartId + 'scrollBar_rightArrow_' + scroll.axis.name;
        this.rightArrowEle = renderer.drawPath(option);
        this.setArrowDirection(this.thumbRectX, this.thumbRectWidth, scroll.height);
        parent.appendChild(this.leftArrowEle);
        parent.appendChild(this.rightArrowEle);
    };
    /**
     * Methods to set the arrow width
     * @param thumbRectX
     * @param thumbRectWidth
     * @param height
     */
    ScrollElements.prototype.setArrowDirection = function (thumbRectX, thumbRectWidth, height) {
        var circleRadius = 8;
        var leftDirection = 'M ' + ((thumbRectX - circleRadius / 2) + 1) + ' ' + (height / 2) + ' ' + 'L ' +
            (thumbRectX - circleRadius / 2 + 6) + ' ' + 11 + ' ' + 'L ' + (thumbRectX - circleRadius / 2 + 6) + ' ' + 5 + ' Z';
        var rightDirection = 'M ' + ((thumbRectX + thumbRectWidth + circleRadius / 2) - 0.5) + ' ' + (height / 2)
            + ' ' + 'L ' + (thumbRectX + thumbRectWidth + circleRadius / 2 - 6) + ' ' + 11.5 + ' ' + 'L ' + (thumbRectX +
            thumbRectWidth + circleRadius / 2 - 6) + ' ' + 4.5 + ' Z';
        this.leftArrowEle.setAttribute('d', leftDirection);
        this.rightArrowEle.setAttribute('d', rightDirection);
    };
    /**
     * Method to render thumb
     * @param scroll
     * @param renderer
     * @param parent
     */
    ScrollElements.prototype.thumb = function (scroll, renderer, parent) {
        scroll.startX = this.thumbRectX;
        var style = scroll.scrollbarThemeStyle;
        this.slider = renderer.drawRectangle(new RectOption(this.chartId + 'scrollBarThumb_' + scroll.axis.name, style.thumb, { width: 1, color: '' }, 1, new Rect(this.thumbRectX, 0, this.thumbRectWidth, scroll.height)));
        parent.appendChild(this.slider);
    };
    /**
     *  Method to render circles
     * @param scroll
     * @param renderer
     * @param parent
     */
    ScrollElements.prototype.renderCircle = function (scroll, renderer, parent) {
        var style = scroll.scrollbarThemeStyle;
        var option = new CircleOption(this.chartId + 'scrollBar_leftCircle_' + scroll.axis.name, style.circle, { width: 1, color: style.circle }, 1, this.thumbRectX, scroll.height / 2, 8);
        var scrollShadowEle = '<filter x="-25.0%" y="-20.0%" width="150.0%" height="150.0%" filterUnits="objectBoundingBox"' +
            'id="scrollbar_shadow"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>' +
            '<feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>' +
            '<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>' +
            '<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1">' +
            '</feColorMatrix></filter>';
        var defElement = renderer.createDefs();
        defElement.innerHTML = scrollShadowEle;
        var shadowGroup = renderer.createGroup({
            id: this.chartId + scroll.axis.name + '_thumb_shadow'
        });
        shadowGroup.innerHTML = '<use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#' +
            this.chartId + 'scrollBar_leftCircle_' +
            scroll.axis.name + '"></use><use fill="black" fill-opacity="1" filter="url(#scrollbar_shadow)" xlink:href="#' +
            this.chartId + 'scrollBar_rightCircle_' + scroll.axis.name + '"></use>';
        this.leftCircleEle = renderer.drawCircle(option);
        option.id = this.chartId + 'scrollBar_rightCircle_' + scroll.axis.name;
        option.cx = this.thumbRectX + this.thumbRectWidth;
        this.rightCircleEle = renderer.drawCircle(option);
        parent.appendChild(defElement);
        parent.appendChild(this.leftCircleEle);
        parent.appendChild(this.rightCircleEle);
        parent.appendChild(shadowGroup);
    };
    /**
     * Method to render grip elements
     * @param scroll
     * @param renderer
     * @param parent
     */
    ScrollElements.prototype.thumbGrip = function (scroll, renderer, parent) {
        var sidePadding = 0;
        var topPadding = 0;
        var gripWidth = 14;
        var gripCircleDiameter = 2;
        var padding = gripWidth / 2 - gripCircleDiameter;
        var style = scroll.scrollbarThemeStyle;
        var option = new CircleOption(this.chartId + 'scrollBar_gripCircle0' + '_' + scroll.axis.name, style.grip, { width: 1, color: style.grip }, 1, 0, 0, 1);
        this.gripCircle = renderer.createGroup({
            id: this.chartId + 'scrollBar_gripCircle_' + scroll.axis.name,
            transform: 'translate(' + ((this.thumbRectX + this.thumbRectWidth / 2) + ((scroll.isVertical ? 1 : -1) * padding)) +
                ',' + (scroll.isVertical ? '10' : '5') + ') rotate(' + (scroll.isVertical ? '180' : '0') + ')'
        });
        for (var i = 1; i <= 6; i++) {
            option.id = this.chartId + 'scrollBar_gripCircle' + i + '_' + scroll.axis.name;
            option.cx = sidePadding;
            option.cy = topPadding;
            this.gripCircle.appendChild(renderer.drawCircle(option));
            sidePadding = i === 3 ? 0 : (sidePadding + 5);
            topPadding = i >= 3 ? 5 : 0;
        }
        parent.appendChild(this.gripCircle);
    };
    return ScrollElements;
}());
export { ScrollElements };
