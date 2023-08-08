import { getCellPosition } from '../common/index';
import { getRangeIndexes } from '../../workbook/index';
import { EventHandler } from '@syncfusion/ej2-base';
/**
 * Specifes to create or modify overlay.
 * @hidden
 */
var Overlay = /** @class */ (function () {
    /**
     * Constructor for initializing Overlay service.
     */
    function Overlay(parent) {
        this.minHeight = '300px';
        this.minWidth = '400px';
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
        this.parent = parent;
    }
    /**
     * To insert a shape.
     * @hidden
     */
    Overlay.prototype.insertOverlayElement = function () {
        var sheet = this.parent.getActiveSheet();
        var div = this.parent.createElement('div', {
            id: this.parent.element.id + '_overlay',
            attrs: { 'class': 'e-ss-overlay' },
            styles: 'width: ' + this.minWidth + ';  height: ' + this.minHeight
        });
        var indexes = getRangeIndexes(sheet.activeCell);
        var pos = getCellPosition(sheet, indexes);
        div.style.top = pos.top + 'px';
        div.style.left = pos.left + 'px';
        this.parent.getMainContent().appendChild(div);
        this.renderResizeHandles();
        this.addEventListener();
        this.sheetTop = this.parent.getMainContent().getClientRects()[0].top;
        this.sheetLeft = this.parent.getMainContent().getClientRects()[0].left;
    };
    Overlay.prototype.addEventListener = function () {
        var overlayElem = document.getElementById(this.parent.element.id + '_overlay');
        EventHandler.add(overlayElem, 'mousedown', this.overlayClickHandler, this);
        EventHandler.add(overlayElem, 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler, this);
        EventHandler.add(document, 'mouseup', this.overlayMouseUpHandler, this);
    };
    Overlay.prototype.overlayMouseMoveHandler = function (e) {
        var overlayElem = document.getElementById(this.parent.element.id + '_overlay');
        if (this.isOverlayClicked && this.isResizerClicked) {
            switch (this.resizer) {
                case 'e-ss-overlay-t':
                    var height1 = Math.max(this.originalMouseY - e.clientY + this.originalHeight, 20);
                    var top_1 = e.clientY - ((this.originalMouseY - this.originalResizeTop) + this.sheetTop);
                    if (height1 > 180 && top_1 > -1) {
                        overlayElem.style.height = height1 + 'px';
                        overlayElem.style.top = top_1 + 'px';
                    }
                    break;
                case 'e-ss-overlay-r':
                    var width1 = this.originalWidth + (e.pageX - this.originalMouseX);
                    if (width1 > 180) {
                        overlayElem.style.width = width1 + 'px';
                    }
                    break;
                case 'e-ss-overlay-b':
                    var height2 = this.originalHeight + (e.pageY - this.originalMouseY);
                    if (height2 > 180) {
                        overlayElem.style.height = height2 + 'px';
                    }
                    break;
                case 'e-ss-overlay-l':
                    var width2 = Math.max(this.originalMouseX - e.clientX + this.originalWidth, 20);
                    var left = e.clientX - ((this.originalMouseX - this.originalResizeLeft) + this.sheetLeft);
                    if (width2 > 180 && left > -1) {
                        overlayElem.style.width = width2 + 'px';
                        overlayElem.style.left = left + 'px';
                    }
                    break;
            }
        }
        else if (this.isOverlayClicked) {
            var posX = e.clientX;
            var posY = e.clientY;
            var aX = posX - this.diffX;
            var aY = posY - this.diffY;
            if (aX > -1) {
                overlayElem.style.left = aX + 'px';
            }
            if (aY > -1) {
                overlayElem.style.top = aY + 'px';
            }
        }
    };
    Overlay.prototype.overlayMouseUpHandler = function (e) {
        this.isOverlayClicked = false;
        this.isResizerClicked = false;
    };
    Overlay.prototype.overlayClickHandler = function (e) {
        this.isOverlayClicked = true;
        var target = e.target;
        var overlayElem = e.target;
        if (!target.classList.contains('e-ss-overlay')) {
            overlayElem = target.parentElement;
        }
        this.originalReorderLeft = parseInt(overlayElem.style.left, 10); //divLeft
        this.originalReorderTop = parseInt(overlayElem.style.top, 10); // divTop
        this.originalResizeTop = overlayElem.getClientRects()[0].top;
        this.originalResizeLeft = overlayElem.getClientRects()[0].left;
        this.originalMouseX = e.clientX; // posX
        this.originalMouseY = e.clientY; // posY
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        document.getElementById(this.parent.element.id + '_overlay').classList.add('e-ss-overlay-active');
        if (target.classList.contains('e-ss-resizer')) {
            this.resizer = target.classList[0];
            this.originalWidth = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('width').replace('px', ''));
            this.originalHeight = parseFloat(getComputedStyle(overlayElem, null).getPropertyValue('height').replace('px', ''));
            this.isResizerClicked = true;
        }
    };
    Overlay.prototype.renderResizeHandles = function () {
        var handles = ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        var i = 0;
        var handleElem;
        var overlay = document.getElementById(this.parent.element.id + '_overlay');
        while (handles.length > i) {
            handleElem = this.parent.createElement('div', {
                attrs: { 'class': handles[i] + ' ' + 'e-ss-resizer' },
                styles: 'width: 8px; height: 8px; border-radius: 4px;'
            });
            overlay.appendChild(handleElem);
            i++;
        }
    };
    Overlay.prototype.removeEventListener = function () {
        var overlayElem = document.getElementById(this.parent.element.id + '_overlay');
        EventHandler.remove(overlayElem, 'mousedown', this.overlayClickHandler);
        EventHandler.remove(overlayElem, 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(this.parent.getMainContent(), 'mousemove', this.overlayMouseMoveHandler);
        EventHandler.remove(document, 'mouseup', this.overlayMouseUpHandler);
    };
    /**
     * To clear private variables.
     */
    Overlay.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    return Overlay;
}());
export { Overlay };
