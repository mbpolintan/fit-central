import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The `TextSelection` module is used to handle the text selection of PDF viewer.
 */
var TextSelection = /** @class */ (function () {
    /**
     * @private
     */
    function TextSelection(pdfViewer, pdfViewerBase) {
        var _this = this;
        /**
         * @private
         */
        this.isTextSelection = false;
        /**
         * @private
         */
        this.selectionStartPage = null;
        this.isBackwardPropagatedSelection = false;
        this.contextMenuHeight = 144;
        /**
         * @private
         */
        this.selectionRangeArray = [];
        this.selectionAnchorTouch = null;
        this.selectionFocusTouch = null;
        // tslint:disable-next-line
        this.scrollMoveTimer = 0;
        this.isMouseLeaveSelection = false;
        this.isTouchSelection = false;
        this.previousScrollDifference = 0;
        this.topStoreLeft = null;
        this.topStoreRight = null;
        this.isTextSearched = false;
        this.isSelectionStartTriggered = false;
        this.onLeftTouchSelectElementTouchStart = function (event) {
            _this.initiateSelectionByTouch();
        };
        this.onRightTouchSelectElementTouchStart = function (event) {
            _this.initiateSelectionByTouch();
        };
        this.onLeftTouchSelectElementTouchEnd = function (event) {
            _this.terminateSelectionByTouch(event);
        };
        this.onRightTouchSelectElementTouchEnd = function (event) {
            _this.terminateSelectionByTouch(event);
        };
        this.onLeftTouchSelectElementTouchMove = function (event) {
            var range;
            var nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            var rightElement = _this.dropDivElementRight;
            var isTouchedWithinViewerContainer = _this.isTouchedWithinContainer(event);
            if (rightElement && isTouchedWithinViewerContainer) {
                var dropBounds = rightElement.getBoundingClientRect();
                var xTouch = event.changedTouches[0].clientX;
                var yTouch = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = _this.getNodeElement(range, xTouch, yTouch, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    var currentDifference = Math.sqrt((yTouch - dropBounds.top) * (yTouch - dropBounds.top) + (xTouch - dropBounds.left) * (xTouch - dropBounds.left));
                    var isCloserMovement = _this.isCloserTouchScroll(currentDifference);
                    var isTextSelected = false;
                    if (yTouch <= dropBounds.top) {
                        _this.dropElementLeft.style.transform = 'rotate(0deg)';
                        _this.dropElementRight.style.transform = 'rotate(-90deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, false, 'left', isCloserMovement);
                    }
                    else {
                        _this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        _this.dropElementRight.style.transform = 'rotate(0deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, xTouch, yTouch, true, 'left', isCloserMovement);
                    }
                    if (isTextSelected) {
                        var elementClientRect = _this.dropDivElementLeft.getBoundingClientRect();
                        var pageTopValue = _this.pdfViewerBase.pageSize[_this.pdfViewerBase.currentPageNumber - 1].top;
                        var topClientValue = _this.getClientValueTop(yTouch, _this.pdfViewerBase.currentPageNumber - 1);
                        // tslint:disable-next-line:max-line-length
                        var currentPageLeft = _this.pdfViewerBase.getElement('_pageDiv_' + (_this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        var currentRangeLeft = xTouch - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementLeft.style.top = pageTopValue * _this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        _this.topStoreLeft = { pageTop: pageTopValue, topClientValue: _this.getMagnifiedValue(topClientValue), pageNumber: _this.pdfViewerBase.currentPageNumber - 1, left: _this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementLeft.style.left = xTouch - _this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        _this.previousScrollDifference = currentDifference;
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.onRightTouchSelectElementTouchMove = function (event) {
            var range;
            var nodeElement;
            event.preventDefault();
            event.target.style.zIndex = '0';
            var leftElement = _this.dropDivElementLeft;
            var isTouchedWithinViewerContainer = _this.isTouchedWithinContainer(event);
            if (leftElement && isTouchedWithinViewerContainer) {
                var dropPosition = leftElement.getBoundingClientRect();
                var touchX = event.changedTouches[0].clientX;
                var touchY = event.changedTouches[0].clientY;
                event.target.style.zIndex = '1000';
                nodeElement = _this.getNodeElement(range, touchX, touchY, event, nodeElement);
                if (nodeElement) {
                    // tslint:disable-next-line:max-line-length
                    var currentDifference = Math.sqrt((touchY - dropPosition.top) * (touchY - dropPosition.top) + (touchX - dropPosition.left) * (touchX - dropPosition.left));
                    var isCloserMovement = _this.isCloserTouchScroll(currentDifference);
                    var isTextSelected = false;
                    if (touchY >= dropPosition.top) {
                        _this.dropElementRight.style.transform = 'rotate(-90deg)';
                        _this.dropElementLeft.style.transform = 'rotate(0deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, true, 'right', isCloserMovement);
                    }
                    else {
                        _this.dropElementRight.style.transform = 'rotate(0deg)';
                        _this.dropElementLeft.style.transform = 'rotate(-90deg)';
                        isTextSelected = _this.selectTextByTouch(nodeElement.parentElement, touchX, touchY, false, 'right', isCloserMovement);
                    }
                    if (isTextSelected) {
                        var pageTopValue = _this.pdfViewerBase.pageSize[_this.pdfViewerBase.currentPageNumber - 1].top;
                        var topClientValue = _this.getClientValueTop(touchY, _this.pdfViewerBase.currentPageNumber - 1);
                        var elementClientRect = _this.dropDivElementRight.getBoundingClientRect();
                        _this.dropDivElementRight.style.top = pageTopValue * _this.pdfViewerBase.getZoomFactor() + topClientValue + 'px';
                        // tslint:disable-next-line:max-line-length
                        var currentPageLeft = _this.pdfViewerBase.getElement('_pageDiv_' + (_this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
                        var currentRangeLeft = touchX - currentPageLeft;
                        // tslint:disable-next-line:max-line-length
                        _this.topStoreRight = { pageTop: pageTopValue, topClientValue: _this.getMagnifiedValue(topClientValue), pageNumber: _this.pdfViewerBase.currentPageNumber - 1, left: _this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: false };
                        // tslint:disable-next-line:max-line-length
                        _this.dropDivElementRight.style.left = touchX - _this.pdfViewerBase.viewerContainer.getBoundingClientRect().left - (elementClientRect.width / 2) + 'px';
                        _this.previousScrollDifference = currentDifference;
                    }
                }
            }
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseMove = function (target, x, y, isExtended) {
        var targetElement = target;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            if (!this.isSelectionStartTriggered && !this.pdfViewerBase.getTextMarkupAnnotationMode()) {
                this.pdfViewer.fireTextSelectionStart(this.pdfViewerBase.currentPageNumber);
                this.isSelectionStartTriggered = true;
            }
            this.isBackwardPropagatedSelection = false;
            var range = targetElement.ownerDocument.createRange();
            var selection = window.getSelection();
            if (selection.anchorNode !== null) {
                var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            var currentPosition = 0;
            var endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                var rangeBounds = range.getBoundingClientRect();
                var rightBounds = rangeBounds.right;
                if (isExtended) {
                    // tslint:disable-next-line
                    rightBounds = parseInt(rangeBounds.right.toString());
                }
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line
                if (rangeBounds.left <= x && rightBounds >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode !== null && selection.anchorNode.parentNode.classList.contains('e-pv-text')) {
                        range.setStart(selection.anchorNode, selection.anchorOffset);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    // tslint:disable-next-line
                    var isIE = !!document.documentMode;
                    if (!isIE) {
                        if (this.isBackwardPropagatedSelection) {
                            selection.extend(targetElement, currentPosition);
                        }
                        else if (isExtended) {
                            selection.extend(targetElement, currentPosition);
                        }
                        else {
                            selection.extend(targetElement, currentPosition + 1);
                        }
                    }
                    range.detach();
                }
                currentPosition += 1;
            }
            // tslint:disable-next-line
            var annotationModule = this.pdfViewer.annotationModule;
            // tslint:disable-next-line:max-line-length
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                // tslint:disable-next-line
                var leftDivElement = document.getElementById(this.pdfViewer.element.id + '_droplet_left');
                if (this.pdfViewerBase.isSelection && selection && selection.rangeCount > 0) {
                    // tslint:disable-next-line
                    var currentrange = selection.getRangeAt(0);
                    // tslint:disable-next-line
                    var rect = currentrange.getBoundingClientRect();
                    var left = rect.left;
                    var top_1 = rect.top;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top_1);
                    this.pdfViewerBase.isSelection = false;
                }
                else if ((leftDivElement && leftDivElement.style.display === 'none')) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(x, y);
                }
                this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
            }
        }
        else {
            for (var i = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    var range = this.getSelectionRange(i, targetElement);
                    var rangeBounds = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line
                    if (rangeBounds.left <= x && rangeBounds.right >= parseInt(x.toString()) && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnMouseMove(targetElement.childNodes[i], x, y, isExtended);
                    }
                    else {
                        range.detach();
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnDrag = function (target, x, y, isforward) {
        var targetElement = target;
        this.isTextSearched = true;
        if (targetElement.nodeType === targetElement.TEXT_NODE) {
            this.isBackwardPropagatedSelection = false;
            var range = targetElement.ownerDocument.createRange();
            var selection = window.getSelection();
            if (selection.anchorNode !== null) {
                var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                    this.isBackwardPropagatedSelection = true;
                }
            }
            range.selectNodeContents(targetElement);
            var currentPosition = 0;
            var endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(targetElement, currentPosition);
                range.setEnd(targetElement, currentPosition + 1);
                var rangeBounds = range.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line
                if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                    if (isforward) {
                        // tslint:disable-next-line:max-line-length
                        if (selection.anchorNode !== null && selection.anchorNode.parentNode.classList.contains('e-pv-text')) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        selection.removeAllRanges();
                        selection.addRange(range);
                        selection.extend(targetElement, currentPosition);
                    }
                    else if (selection.focusNode) {
                        range.setEnd(selection.focusNode, selection.focusOffset);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                    if (!this.isTextSelection) {
                        this.selectionStartPage = this.pdfViewerBase.currentPageNumber - 1;
                    }
                    this.isTextSelection = true;
                    range.detach();
                    return true;
                }
                currentPosition += 1;
            }
            if (this.pdfViewerBase.isSelection) {
                // tslint:disable-next-line
                var currentrange = selection.getRangeAt(0);
                // tslint:disable-next-line
                var rect = currentrange.getBoundingClientRect();
                var left = rect.left;
                var top_2 = rect.top;
                this.pdfViewer.annotation.textMarkupAnnotationModule.updateLeftposition(left, top_2);
                this.pdfViewerBase.isSelection = false;
            }
            this.pdfViewer.annotation.textMarkupAnnotationModule.updatePosition(x, y);
        }
        else {
            for (var i = 0; i < targetElement.childNodes.length; i++) {
                if (targetElement.childNodes[i].nodeType === targetElement.TEXT_NODE) {
                    var range = this.getSelectionRange(i, targetElement);
                    var rangeBounds = range.getBoundingClientRect();
                    // tslint:disable-next-line:max-line-length
                    // tslint:disable-next-line
                    if (rangeBounds.left <= x && rangeBounds.right >= x && parseInt(rangeBounds.top.toString()) <= y && rangeBounds.bottom >= y) {
                        range.detach();
                        this.textSelectionOnDrag(targetElement.childNodes[i], x, y, isforward);
                    }
                    else {
                        range.detach();
                    }
                }
            }
        }
        return null;
    };
    TextSelection.prototype.selectTextRegion = function (pageNumbers, bounds) {
        // tslint:disable-next-line
        var element = null;
        var pageNumber = (pageNumbers - 1);
        for (var k = 0; k < bounds.length; k++) {
            // tslint:disable-next-line
            var bound = bounds[k];
            var x = (bound.left ? bound.left : bound.Left) * this.pdfViewerBase.getZoomFactor();
            var y = (bound.top ? bound.top : bound.Top) * this.pdfViewerBase.getZoomFactor();
            var width = (bound.width ? bound.width : bound.Width) * this.pdfViewerBase.getZoomFactor();
            var height = bound.height ? bound.height : bound.Height;
            // tslint:disable-next-line
            var textLayer = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (textLayer) {
                // tslint:disable-next-line
                var textDivs = textLayer.childNodes;
                for (var n = 0; n < textDivs.length; n++) {
                    if (textDivs[n]) {
                        // tslint:disable-next-line
                        var rangebounds = textDivs[n].getBoundingClientRect();
                        var top_3 = this.getClientValueTop(rangebounds.top, pageNumber);
                        // tslint:disable-next-line:max-line-length
                        var currentLeft = rangebounds.left - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().left;
                        var totalLeft = currentLeft + rangebounds.width;
                        // tslint:disable-next-line
                        var textDiVLeft = parseInt(textDivs[n].style.left);
                        // tslint:disable-next-line
                        var currentTop = parseInt(textDivs[n].style.top);
                        var isLeftBounds = this.checkLeftBounds(currentLeft, textDiVLeft, totalLeft, x);
                        var isTopBounds = this.checkTopBounds(top_3, currentTop, y);
                        if (isLeftBounds && isTopBounds) {
                            element = textDivs[n];
                            break;
                        }
                    }
                }
                if (element != null) {
                    // tslint:disable-next-line
                    var boundingRect = this.pdfViewerBase.getElement('_textLayer_' + pageNumber).getBoundingClientRect();
                    this.textSelectionOnMouseMove(element, x + boundingRect.left, y + boundingRect.top, false);
                    if ((bounds.length - 1) === k) {
                        // tslint:disable-next-line:max-line-length
                        this.textSelectionOnMouseMove(element, x + boundingRect.left + width, y + boundingRect.top, false);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.checkLeftBounds = function (left, textDiVLeft, totalLeft, x) {
        var isExists = false;
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line
        if (left === parseInt(x.toString()) || parseInt(left.toString()) === parseInt(x.toString()) || (left + 1) === parseInt(x.toString()) || (left - 1) === parseInt(x.toString())
            // tslint:disable-next-line
            || textDiVLeft === parseInt(x.toString()) || textDiVLeft === x || (totalLeft >= x && left <= x)) {
            isExists = true;
        }
        return isExists;
    };
    /**
     * @private
     */
    TextSelection.prototype.checkTopBounds = function (top, currentTop, y) {
        var isExists = false;
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line
        if ((top === parseInt(y.toString()) || parseInt(top.toString()) === parseInt(y.toString()) || parseInt((top + 1).toString()) === parseInt(y.toString()) || parseInt((top - 1).toString()) === parseInt(y.toString())
            // tslint:disable-next-line
            || currentTop === parseInt(y.toString()) || currentTop === y)) {
            isExists = true;
        }
        return isExists;
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseLeave = function (event) {
        var _this = this;
        event.preventDefault();
        var viewerTop = this.pdfViewerBase.viewerContainer.offsetTop;
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.fitType === 'fitToPage') {
                return;
            }
        }
        if (event.clientY > viewerTop) {
            this.scrollMoveTimer = setInterval(function () { _this.scrollForwardOnSelection(); }, 500);
        }
        else {
            this.scrollMoveTimer = setInterval(function () { _this.scrollBackwardOnSelection(); }, 500);
        }
    };
    TextSelection.prototype.scrollForwardOnSelection = function () {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop + 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    };
    TextSelection.prototype.scrollBackwardOnSelection = function () {
        this.isMouseLeaveSelection = true;
        this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.viewerContainer.scrollTop - 200;
        this.stichSelectionOnScroll(this.pdfViewerBase.currentPageNumber - 1);
    };
    /**
     * @private
     */
    TextSelection.prototype.clear = function () {
        if (this.scrollMoveTimer) {
            this.isMouseLeaveSelection = false;
            clearInterval(this.scrollMoveTimer);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextSelection.prototype.selectAWord = function (element, x, y, isStoreSelection) {
        if (element.nodeType === element.TEXT_NODE) {
            var selection = window.getSelection();
            var range = element.ownerDocument.createRange();
            range.selectNodeContents(element);
            var currentPosition = 0;
            var endPosition = range.endOffset;
            while (currentPosition < endPosition) {
                range.setStart(element, currentPosition);
                range.setEnd(element, currentPosition + 1);
                var rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    var textContent = element.textContent;
                    var indices = [];
                    var startPosition = void 0;
                    var endPos = void 0;
                    for (var i = 0; i < textContent.length; i++) {
                        if (textContent[i] === ' ') {
                            indices.push(i);
                        }
                    }
                    for (var j = 0; j < indices.length; j++) {
                        if (currentPosition === indices[j]) {
                            startPosition = indices[j];
                            endPos = indices[j];
                        }
                        if (indices[0] > currentPosition) {
                            startPosition = 0;
                            endPos = indices[j];
                            break;
                        }
                        if (currentPosition > indices[j] && currentPosition < indices[j + 1]) {
                            startPosition = indices[j];
                            endPos = indices[j + 1];
                        }
                        else if (currentPosition > indices[j]) {
                            if (!indices[j + 1]) {
                                startPosition = indices[j];
                            }
                        }
                    }
                    if (!endPos) {
                        endPos = textContent.length;
                    }
                    if (startPosition === 0) {
                        range.setStart(element, startPosition);
                    }
                    else {
                        range.setStart(element, startPosition + 1);
                    }
                    range.setEnd(element, endPos);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.isTextSelection = true;
                    // tslint:disable-next-line:max-line-length
                    var startParent = isNullOrUndefined(range.startContainer.parentElement) ? range.startContainer.parentNode : range.startContainer.parentElement;
                    // tslint:disable-next-line:radix
                    this.selectionStartPage = parseInt(startParent.id.split('_text_')[1]);
                    if (isStoreSelection) {
                        // tslint:disable-next-line:max-line-length
                        this.selectionAnchorTouch = { anchorNode: selection.anchorNode.parentElement.id, anchorOffset: selection.anchorOffset };
                        this.selectionFocusTouch = { focusNode: selection.focusNode.parentElement.id, focusOffset: selection.focusOffset };
                    }
                    if (!Browser.isIE) {
                        range.detach();
                    }
                    break;
                }
                currentPosition += 1;
            }
        }
        else {
            for (var i = 0; i < element.childNodes.length; i++) {
                var range = this.getSelectionRange(i, element);
                var rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    this.selectAWord(element.childNodes[i], x, y, isStoreSelection);
                }
                else {
                    range.detach();
                }
            }
        }
    };
    TextSelection.prototype.getSelectionRange = function (index, element) {
        var range = element.childNodes[index].ownerDocument.createRange();
        range.selectNodeContents(element.childNodes[index]);
        return range;
    };
    /**
     * @private
     */
    TextSelection.prototype.selectEntireLine = function (event) {
        var textIds = [];
        var targetElement = event.target;
        var targetRect = targetElement.getBoundingClientRect();
        // tslint:disable-next-line
        var targetcentre = parseInt((targetRect.top + (targetRect.height / 2)).toString());
        // tslint:disable-next-line:radix
        var pageNumber = parseInt(event.target.id.split('_text_')[1]);
        var textDivs = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_text_' + pageNumber + '"]');
        if (targetElement.classList.contains('e-pv-text')) {
            this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
            for (var i = 0; i < textDivs.length; i++) {
                var rect = textDivs[i].getBoundingClientRect();
                // tslint:disable-next-line:radix
                var topValue = parseInt(rect.top.toString());
                // tslint:disable-next-line:radix
                var bottomValue = parseInt(rect.bottom.toString());
                if ((topValue <= targetcentre && bottomValue > targetcentre) && (targetRect.bottom + 10 > bottomValue)) {
                    var textId = textDivs[i].id;
                    if (textId !== '') {
                        textIds.push(textId);
                    }
                }
            }
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            var lengths = (textIds.length - 1);
            var d1 = document.getElementById(textIds[0]);
            var d2 = document.getElementById(textIds[lengths]);
            var childNodes = d2.childNodes.length;
            if (childNodes > 0) {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2.childNodes[0], d2.textContent.length);
            }
            else {
                range.setStart(d1.childNodes[0], 0);
                range.setEnd(d2, 1);
            }
            // tslint:disable-next-line:radix
            this.selectionStartPage = parseInt(range.startContainer.parentElement.id.split('_text_')[1]);
            selection.addRange(range);
            this.isTextSelection = true;
            if (selection != null && this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientY);
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.enableTextSelectionMode = function () {
        this.pdfViewerBase.isTextSelectionDisabled = false;
        this.pdfViewerBase.viewerContainer.classList.remove('e-disable-text-selection');
        this.pdfViewerBase.viewerContainer.classList.add('e-enable-text-selection');
        this.pdfViewerBase.viewerContainer.addEventListener('selectstart', function () { return true; });
    };
    TextSelection.prototype.clearTextSelection = function () {
        if (this.isTextSelection) {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (this.pdfViewer.linkAnnotationModule) {
                var lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
                lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
                var higherPageIndex = this.pdfViewer.currentPageNumber + 1;
                // tslint:disable-next-line:max-line-length
                higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
                for (var i = lowerPageIndex; i <= higherPageIndex; i++) {
                    this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(i, false);
                }
            }
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                this.pdfViewer.annotation.textMarkupAnnotationModule.showHideDropletDiv(true);
            }
            this.selectionRangeArray = [];
            this.isTextSelection = false;
            this.isTouchSelection = false;
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
            this.removeTouchElements();
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.removeTouchElements = function () {
        if (this.dropDivElementLeft) {
            this.dropDivElementLeft.parentElement.removeChild(this.dropDivElementLeft);
            this.dropDivElementLeft = null;
            this.dropElementLeft.style.transform = 'rotate(0deg)';
        }
        if (this.dropDivElementRight) {
            this.dropDivElementRight.parentElement.removeChild(this.dropDivElementRight);
            this.dropDivElementRight = null;
            this.dropElementRight.style.transform = 'rotate(-90deg)';
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.resizeTouchElements = function () {
        var viewerContainerLeft = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
        if (this.dropDivElementLeft) {
            var elementClientRect = this.dropDivElementLeft.getBoundingClientRect();
            var dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            var leftCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreLeft.pageNumber).getBoundingClientRect();
            this.dropDivElementLeft.style.left = parseFloat(this.topStoreLeft.left.toString()) * this.pdfViewerBase.getZoomFactor() + leftCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreLeft.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft.style.top = parseFloat(this.topStoreLeft.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreLeft.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
        if (this.dropDivElementRight) {
            var elementClientRect = this.dropDivElementRight.getBoundingClientRect();
            var dropElementHeight = 0;
            // tslint:disable-next-line:max-line-length
            var rightCurrentPagePosition = this.pdfViewerBase.getElement('_pageDiv_' + this.topStoreRight.pageNumber).getBoundingClientRect();
            this.dropDivElementRight.style.left = parseFloat(this.topStoreRight.left.toString()) * this.pdfViewerBase.getZoomFactor() + rightCurrentPagePosition.left - viewerContainerLeft - (elementClientRect.width / 2) + 'px';
            if (this.topStoreRight.isHeightNeeded) {
                dropElementHeight = (elementClientRect.height / 2) * this.pdfViewerBase.getZoomFactor();
            }
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.top = parseFloat(this.topStoreRight.pageTop.toString()) * this.pdfViewerBase.getZoomFactor() + parseFloat(this.topStoreRight.topClientValue.toString()) * this.pdfViewerBase.getZoomFactor() + dropElementHeight + 'px';
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseup = function (event) {
        this.clear();
        if (window.getSelection().anchorNode !== null) {
            this.isMouseLeaveSelection = false;
            this.isSelectionStartTriggered = false;
            this.maintainSelectionOnZoom(true, false);
            this.fireTextSelectEnd();
            var isTextSearch = this.pdfViewerBase.textLayer.getTextSearchStatus();
            if (isTextSearch) {
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line
                var indexes = this.pdfViewer.textSearchModule.getIndexes();
                var lowerPageValue = parseFloat(indexes.lowerPageValue.toString());
                var higherPageValue = parseFloat(indexes.higherPageValue.toString());
                for (var i = lowerPageValue; i < higherPageValue; i++) {
                    this.applySelectionRangeOnScroll(i);
                }
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            else {
                this.applySpanForSelection();
            }
            if (this.pdfViewer.linkAnnotationModule) {
                this.pdfViewer.linkAnnotationModule.modifyZindexForTextSelection(this.pdfViewerBase.currentPageNumber - 1, false);
            }
            if (this.isTextSearched && this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                this.calculateContextMenuPosition(event.clientY, event.clientX);
                this.isTextSearched = false;
            }
        }
        else {
            this.pdfViewerBase.textLayer.clearDivSelection();
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
            this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
            this.removeTouchElements();
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.fireTextSelectEnd = function () {
        if (this.selectionRangeArray.length !== 0) {
            var selectEndPageIndex = 0;
            var selectedText = '';
            // tslint:disable-next-line
            var selectedBounds = [];
            for (var k = 0; k < this.selectionRangeArray.length; k++) {
                selectedText += this.selectionRangeArray[k].textContent;
                for (var j = 0; j < this.selectionRangeArray[k].rectangleBounds.length; j++) {
                    var currentBound = this.selectionRangeArray[k].rectangleBounds[j];
                    // tslint:disable-next-line:max-line-length
                    selectedBounds.push({ left: currentBound.left, right: currentBound.right, top: currentBound.top, bottom: currentBound.bottom, width: currentBound.width, height: currentBound.height, pageIndex: this.selectionRangeArray[k].pageNumber + 1 });
                }
                if (this.selectionRangeArray[k].isBackward && k === 0) {
                    selectEndPageIndex = this.selectionRangeArray[k].pageNumber + 1;
                }
                else if (!this.selectionRangeArray[k].isBackward && k === this.selectionRangeArray.length - 1) {
                    selectEndPageIndex = this.selectionRangeArray[k].pageNumber + 1;
                }
            }
            this.pdfViewer.fireTextSelectionEnd(selectEndPageIndex, selectedText, selectedBounds);
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.maintainSelectionOnZoom = function (isMaintainSelection, isStich) {
        var selection = window.getSelection();
        if (selection.type === 'Range' || (!selection.type && !selection.isCollapsed)) {
            var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (selection.anchorNode !== null) {
                // tslint:disable-next-line:radix
                var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                if (this.isTouchSelection && isNaN(focusPageId)) {
                    var focusElement = selection.focusNode;
                    if (focusElement === this.pdfViewerBase.pageContainer) {
                        var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastChildNode.previousSibling.previousSibling.id.split('_pageDiv_')[1]);
                        }
                        else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                        }
                    }
                }
                if (!isBackward) {
                    for (var i = anchorPageId; i <= focusPageId; i++) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
                else {
                    for (var i = anchorPageId; i >= focusPageId; i--) {
                        this.maintainSelectionOnScroll(i, isStich);
                    }
                }
            }
            if (!isMaintainSelection) {
                selection.removeAllRanges();
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.isSelectionAvailableOnScroll = function (pageNumber) {
        var isSelectionAvailable = false;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    isSelectionAvailable = true;
                    if (this.isTouchSelection && !this.pdfViewerBase.getMagnified()) {
                        isSelectionAvailable = false;
                    }
                    break;
                }
            }
        }
        return isSelectionAvailable;
    };
    /**
     * @private
     */
    TextSelection.prototype.applySelectionRangeOnScroll = function (pageNumber) {
        if (this.isMouseLeaveSelection) {
            this.applySelectionMouseScroll(pageNumber);
        }
        else {
            this.applySelectionRange(pageNumber);
        }
    };
    // tslint:disable-next-line
    TextSelection.prototype.getSelectionRangeFromArray = function (pageNumber) {
        var isSelectionAvailable = false;
        var selectionRange = null;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    selectionRange = ranges[i];
                    isSelectionAvailable = true;
                    break;
                }
            }
        }
        return { isSelectionAvailable: isSelectionAvailable, selectionRange: selectionRange };
    };
    TextSelection.prototype.applySelectionRange = function (pageNumber) {
        var selectionObject = this.getSelectionRangeFromArray(pageNumber);
        var isSelectionAvailable = selectionObject.isSelectionAvailable;
        var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
        if (textLayer) {
            if (isSelectionAvailable && textLayer.childNodes.length !== 0) {
                var selectionRange = selectionObject.selectionRange;
                var anchorOffsetDiv = void 0;
                var focusOffsetDiv = void 0;
                var anchorOffset = void 0;
                var focusOffset = void 0;
                if (selectionRange.isBackward) {
                    // tslint:disable-next-line:radix
                    var startId = parseInt(selectionRange.endNode.split('_text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    var endId = parseInt(selectionRange.startNode.split('_text_')[1].split('_')[1]);
                    if (startId < endId) {
                        anchorOffsetDiv = startId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffset = selectionRange.startOffset;
                        focusOffsetDiv = endId;
                    }
                    else {
                        anchorOffsetDiv = endId;
                        anchorOffset = selectionRange.endOffset;
                        focusOffsetDiv = startId;
                        focusOffset = selectionRange.startOffset;
                    }
                }
                else {
                    // tslint:disable-next-line:radix
                    anchorOffsetDiv = parseInt(selectionRange.startNode.split('text_')[1].split('_')[1]);
                    // tslint:disable-next-line:radix
                    focusOffsetDiv = parseInt(selectionRange.endNode.split('text_')[1].split('_')[1]);
                    anchorOffset = selectionRange.startOffset;
                    focusOffset = selectionRange.endOffset;
                }
                window.getSelection().removeAllRanges();
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.textLayer.applySpanForSelection(pageNumber, pageNumber, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
                if (this.pdfViewer.textSearchModule) {
                    this.pdfViewer.textSearchModule.searchAfterSelection();
                }
            }
        }
    };
    TextSelection.prototype.applySelectionMouseScroll = function (pageNumber) {
        var selectionObject = this.getSelectionRangeFromArray(pageNumber);
        var isSelectionAvailable = selectionObject.isSelectionAvailable;
        if (isSelectionAvailable) {
            var selectionRange = selectionObject.selectionRange;
            var selection = window.getSelection();
            var anchorNode = document.getElementById(selectionRange.startNode).childNodes[0];
            var focusNode = document.getElementById(selectionRange.endNode).childNodes[0];
            var range = document.createRange();
            if (selection.anchorNode === null) {
                if (!selectionRange.isBackward) {
                    range.setStart(anchorNode, selectionRange.startOffset);
                    range.setEnd(focusNode, selectionRange.endOffset);
                }
                else {
                    range.setStart(focusNode, selectionRange.endOffset);
                    range.setEnd(anchorNode, selectionRange.startOffset);
                }
            }
            else {
                // tslint:disable-next-line
                var anchorPageIndex = isNaN(parseInt(selection.anchorNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(selection.anchorNode.parentElement.id.split('_text_')[1]);
                if (isNaN(anchorPageIndex)) {
                    // tslint:disable-next-line:radix
                    anchorPageIndex = parseInt(selection.anchorNode.id.split('_text_')[1]);
                }
                // tslint:disable-next-line
                var focusPageIndex = isNaN(parseInt(selection.focusNode.parentElement.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(selection.focusNode.parentElement.id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                var currentAnchorIndex = parseInt(selectionRange.startNode.split('_text_')[1]);
                if ((anchorPageIndex === focusPageIndex) && (anchorPageIndex === currentAnchorIndex)) {
                    if (!selectionRange.isBackward) {
                        range.setStart(anchorNode, selectionRange.startOffset);
                        range.setEnd(focusNode, selectionRange.endOffset);
                    }
                    else {
                        range.setStart(focusNode, selectionRange.endOffset);
                        range.setEnd(anchorNode, selectionRange.startOffset);
                    }
                }
                else if (!isNaN(anchorPageIndex)) {
                    if (!isNaN(anchorPageIndex) && !selectionRange.isBackward) {
                        // tslint:disable-next-line:max-line-length
                        if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                        else if (anchorPageIndex < currentAnchorIndex) {
                            range.setStart(selection.anchorNode, selection.anchorOffset);
                            range.setEnd(focusNode, selectionRange.endOffset);
                        }
                        else {
                            range.setStart(anchorNode, selectionRange.startOffset);
                            range.setEnd(selection.focusNode, selection.focusOffset);
                        }
                    }
                    else {
                        var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                        // tslint:disable-next-line:max-line-length
                        if (anchorPageIndex > currentAnchorIndex && currentAnchorIndex > focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            // tslint:disable-next-line:max-line-length
                        }
                        else if (anchorPageIndex < currentAnchorIndex && currentAnchorIndex < focusPageIndex && anchorPageIndex !== focusPageIndex) {
                            if (!isBackward) {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                        }
                        else if (anchorPageIndex < currentAnchorIndex) {
                            if (!isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(focusNode, selectionRange.endOffset);
                                }
                                else {
                                    range.setStart(selection.anchorNode, selection.anchorOffset);
                                    range.setEnd(anchorNode, selectionRange.startOffset);
                                }
                            }
                            else {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                                else {
                                    this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                }
                            }
                        }
                        else if (anchorPageIndex === currentAnchorIndex) {
                            if (currentAnchorIndex === focusPageIndex) {
                                range.setStart(anchorNode, selectionRange.startOffset);
                                range.setEnd(anchorNode, selectionRange.startOffset);
                                selection.removeAllRanges();
                                selection.addRange(range);
                                range = document.createRange();
                                selection.extend(focusNode, selectionRange.endOffset);
                            }
                            else {
                                if (isBackward) {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                                else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        }
                        else if (focusPageIndex === currentAnchorIndex) {
                            if (isBackward) {
                                selection.extend(selection.focusNode, selection.focusOffset);
                            }
                            else {
                                range.setStart(selection.anchorNode, selection.anchorOffset);
                                range.setEnd(selection.focusNode, selection.focusOffset);
                            }
                        }
                        else if (anchorPageIndex > currentAnchorIndex) {
                            // tslint:disable-next-line:radix
                            var currentAnchorOffset = parseInt(selectionRange.startNode.split('_' + currentAnchorIndex + '_')[1]);
                            // tslint:disable-next-line:radix
                            var currentFocusOffset = parseInt(selectionRange.endNode.split('_' + currentAnchorIndex + '_')[1]);
                            if (isBackward) {
                                if (currentAnchorIndex !== this.selectionRangeArray[0].pageNumber) {
                                    if (currentAnchorOffset < currentFocusOffset) {
                                        this.extendCurrentSelection(anchorNode.parentElement, selectionRange.startOffset, selection, range);
                                    }
                                    else {
                                        range.setStart(focusNode.parentElement, selectionRange.endOffset);
                                        range.setEnd(selection.anchorNode, selection.anchorOffset);
                                    }
                                }
                                else {
                                    this.extendCurrentSelection(focusNode.parentElement, selectionRange.endOffset, selection, range);
                                }
                            }
                            else {
                                if (currentAnchorOffset < currentFocusOffset) {
                                    range.setStart(anchorNode, selectionRange.startOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                                else {
                                    range.setStart(focusNode, selectionRange.endOffset);
                                    range.setEnd(selection.focusNode, selection.focusOffset);
                                }
                            }
                        }
                    }
                }
                else if (isNaN(anchorPageIndex)) {
                    if (!selectionRange.isBackward) {
                        range.setStart(anchorNode, selectionRange.startOffset);
                        range.setEnd(focusNode, selectionRange.endOffset);
                    }
                    else {
                        range.setStart(focusNode, selectionRange.endOffset);
                        range.setEnd(anchorNode, selectionRange.startOffset);
                    }
                }
            }
            if (range.toString() !== '') {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.maintainSelectionOnScroll = function (pageNumber, isStich) {
        var isSelectionAvailable = this.isSelectionAvailableOnScroll(pageNumber);
        if (this.isTextSelection && !isSelectionAvailable) {
            this.maintainSelection(pageNumber, isStich);
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.maintainSelection = function (pageNumber, isStich) {
        var selection = window.getSelection();
        if (this.isTextSelection && (selection.type === 'Range' || (!selection.type && !selection.isCollapsed))) {
            // tslint:disable-next-line
            var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line
            var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPageId) && selection.anchorNode !== null) {
                var backward_1 = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward_1) {
                    // tslint:disable-next-line:radix
                    var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                    if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt(lastChildNode.previousSibling.previousSibling.id.split('_pageDiv_')[1]);
                    }
                    else {
                        // tslint:disable-next-line:radix
                        focusPageId = parseInt(lastChildNode.id.split('_pageDiv_')[1]);
                    }
                }
                else {
                    // tslint:disable-next-line:radix
                    focusPageId = parseInt(this.pdfViewerBase.pageContainer.firstChild.id.split('_pageDiv_')[1]);
                }
            }
            var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            if (this.isTouchSelection && pageNumber > focusPageId && pageNumber > anchorPageId) {
                return;
            }
            if (anchorPageId === focusPageId) {
                var selectionObject = null;
                var selectionBounds = this.getSelectionBounds(selection.getRangeAt(0), pageNumber);
                var selectionRectBounds = this.getSelectionRectangleBounds(selection.getRangeAt(0), pageNumber);
                // tslint:disable-next-line:max-line-length
                var anchorOffsetValue = (this.getNodeElementFromNode(selection.anchorNode).childNodes.length === 1) ? selection.anchorOffset : this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                var focusOffsetValue = (this.getNodeElementFromNode(selection.focusNode).childNodes.length === 1) ? selection.focusOffset : this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                selectionObject = {
                    isBackward: backward, startNode: this.getNodeElementFromNode(selection.anchorNode).id,
                    startOffset: anchorOffsetValue, endNode: this.getNodeElementFromNode(selection.focusNode).id,
                    // tslint:disable-next-line:max-line-length
                    endOffset: focusOffsetValue, textContent: selection.toString(), pageNumber: pageNumber, bound: selectionBounds, rectangleBounds: selectionRectBounds
                };
                this.pushSelectionRangeObject(selectionObject, pageNumber);
            }
            else {
                var selectionObject = this.createRangeObjectOnScroll(pageNumber, anchorPageId, focusPageId);
                if (selectionObject) {
                    this.pushSelectionRangeObject(selectionObject, pageNumber);
                    if (isStich) {
                        this.stichSelection(backward, selection, pageNumber);
                    }
                }
            }
        }
    };
    TextSelection.prototype.getCorrectOffset = function (node, offset) {
        var offsetValue = 0;
        var parentElement = this.getNodeElementFromNode(node);
        for (var i = 0; i < parentElement.childNodes.length; i++) {
            if (parentElement.childNodes[i] === node) {
                offsetValue = offsetValue + offset;
                break;
            }
            else {
                offsetValue = offsetValue + parentElement.childNodes[i].textContent.length;
            }
        }
        return offsetValue;
    };
    TextSelection.prototype.pushSelectionRangeObject = function (selectionObject, pageNumber) {
        if (this.isTouchSelection) {
            var currentObject = this.selectionRangeArray.filter(
            // tslint:disable-next-line
            function (obj) {
                return (obj.pageNumber === pageNumber);
            });
            if (currentObject.length > 0) {
                var currentObjectIndex = this.selectionRangeArray.indexOf(currentObject[0]);
                this.selectionRangeArray.splice(currentObjectIndex, 1, selectionObject);
                return;
            }
        }
        var nextPageObject = this.selectionRangeArray.filter(
        // tslint:disable-next-line
        function (obj) {
            return (obj.pageNumber === (pageNumber + 1));
        });
        if (nextPageObject.length === 0) {
            if (this.isTouchSelection && this.selectionRangeArray.length !== 0) {
                var prevPageObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (obj.pageNumber === (pageNumber - 1));
                });
                if (prevPageObject.length !== 0) {
                    var prevIndex = this.selectionRangeArray.indexOf(prevPageObject[0]);
                    this.selectionRangeArray.splice(prevIndex + 1, 0, selectionObject);
                }
                else {
                    var firstObject = this.selectionRangeArray[0];
                    if (pageNumber < firstObject.pageNumber) {
                        this.selectionRangeArray.splice(0, 0, selectionObject);
                    }
                    else {
                        this.selectionRangeArray.push(selectionObject);
                    }
                }
            }
            else {
                this.selectionRangeArray.push(selectionObject);
            }
        }
        else {
            var index = this.selectionRangeArray.indexOf(nextPageObject[0]);
            this.selectionRangeArray.splice(index, 0, selectionObject);
        }
    };
    TextSelection.prototype.extendCurrentSelection = function (element, offset, selection, range) {
        var currentFocusOffset = selection.focusOffset;
        var currentFocusElement = selection.focusNode.parentElement.id;
        // tslint:disable-next-line
        var focusPageId = isNaN(parseInt(currentFocusElement.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(currentFocusElement.split('_text_')[1]);
        // tslint:disable-next-line:radix
        if (isNaN(parseInt(currentFocusElement.split('_text_')[1]))) {
            // tslint:disable-next-line
            currentFocusElement = this.pdfViewerBase.getElement('_textLayer_' + (focusPageId + 1)).firstChild.id;
        }
        range.setStart(element.childNodes[0], offset);
        range.setEnd(element.childNodes[0], offset);
        selection.removeAllRanges();
        selection.addRange(range);
        selection.extend(document.getElementById(currentFocusElement).childNodes[0], currentFocusOffset);
    };
    TextSelection.prototype.stichSelection = function (backward, selection, pageNumber) {
        var range = document.createRange();
        var nextPageElement;
        if (backward) {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 1));
            if (nextPageElement) {
                var lastElement = nextPageElement.lastChild;
                if (lastElement) {
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                }
                else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber - 2));
                    lastElement = nextPageElement.lastChild;
                    this.extendCurrentSelection(lastElement, this.getTextLastLength(lastElement), selection, range);
                }
            }
            else {
                nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
                var lastElement = nextPageElement.firstChild;
                this.extendCurrentSelection(lastElement, 0, selection, range);
            }
        }
        else {
            nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 1));
            if (nextPageElement) {
                var firstElement = nextPageElement.firstChild;
                if (!firstElement) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (pageNumber + 2));
                    firstElement = nextPageElement.firstChild;
                    range.setStart(firstElement.childNodes[0], 0);
                }
                else {
                    range.setStart(firstElement.childNodes[0], 0);
                }
                range.setEnd(selection.focusNode, selection.focusOffset);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.textSelectionOnMouseWheel = function (currentPageNumber) {
        this.isMouseLeaveSelection = true;
        this.stichSelectionOnScroll(currentPageNumber);
    };
    /**
     * @private
     */
    TextSelection.prototype.stichSelectionOnScroll = function (currentPageNumber) {
        var selection = window.getSelection();
        if (this.isTextSelection) {
            // tslint:disable-next-line:radix
            var anchorPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            // tslint:disable-next-line:radix
            var focusPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            var nextPageElement = void 0;
            if (anchorPageId !== currentPageNumber && focusPageId !== currentPageNumber) {
                var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
                if (!backward) {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        var lastElement = nextPageElement.lastChild;
                        if (lastElement) {
                            if (lastElement.childNodes[0]) {
                                this.extendSelectionStich(lastElement.childNodes[0], this.getTextLastLength(lastElement), selection);
                            }
                            else {
                                this.extendSelectionStich(lastElement, this.getTextLastLength(lastElement), selection);
                            }
                        }
                        else {
                            nextPageElement = this.pdfViewerBase.getElement('_textLayer_' + currentPageNumber);
                            var lastElement_1 = nextPageElement.firstChild;
                            this.extendSelectionStich(lastElement_1.childNodes[0], 0, selection);
                        }
                    }
                }
                else {
                    nextPageElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + (currentPageNumber - 1));
                    if (nextPageElement) {
                        var lastElement = nextPageElement.firstChild;
                        if (lastElement) {
                            this.extendSelectionStich(lastElement.childNodes[0], 0, selection);
                        }
                    }
                }
            }
            this.maintainSelectionArray();
        }
    };
    TextSelection.prototype.extendSelectionStich = function (node, offset, selection) {
        if (selection.extend) {
            selection.extend(node, offset);
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.createRangeObjectOnScroll = function (pageNumber, anchorPageId, focusPageId) {
        var selectionObject = null;
        var selection = window.getSelection();
        if (selection.anchorNode !== null) {
            var backward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            var firstElement = void 0;
            var lastElement = void 0;
            var startOffset = void 0;
            var endOffset = void 0;
            var element = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + pageNumber);
            if (element.childNodes) {
                if (!backward) {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber > anchorPageId && pageNumber < focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber === focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        var pageNumberIndex = this.getNodeElementFromNode(selection.focusNode).id.indexOf(focusPageId.toString());
                        if (pageNumberIndex !== -1) {
                            lastElement = this.getNodeElementFromNode(selection.focusNode);
                            endOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            lastElement = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + focusPageId).lastChild;
                            endOffset = this.getTextLastLength(lastElement);
                        }
                        startOffset = 0;
                    }
                }
                else {
                    if (pageNumber === anchorPageId) {
                        firstElement = this.getNodeElementFromNode(selection.anchorNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.firstChild;
                        startOffset = this.getCorrectOffset(selection.anchorNode, selection.anchorOffset);
                        endOffset = 0;
                    }
                    else if (pageNumber < anchorPageId && pageNumber > focusPageId) {
                        // tslint:disable-next-line:max-line-length
                        firstElement = element.firstChild;
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = 0;
                        endOffset = this.getTextLastLength(lastElement);
                    }
                    else if (pageNumber === focusPageId) {
                        firstElement = this.getNodeElementFromNode(selection.focusNode);
                        // tslint:disable-next-line:max-line-length
                        lastElement = element.lastChild;
                        startOffset = this.getCorrectOffset(selection.focusNode, selection.focusOffset);
                        endOffset = this.getTextLastLength(lastElement);
                    }
                }
                if (firstElement && lastElement) {
                    // tslint:disable-next-line:max-line-length
                    var selectionRangeObject = this.getSelectionRangeObject(firstElement.id, startOffset, lastElement.id, endOffset, pageNumber);
                    var selectionString = selectionRangeObject.toString();
                    var selectionBound = this.getSelectionBounds(selectionRangeObject, pageNumber);
                    var selectionRectBounds = this.getSelectionRectangleBounds(selectionRangeObject, pageNumber);
                    // tslint:disable-next-line:max-line-length
                    return selectionObject = { isBackward: backward, startNode: firstElement.id, startOffset: startOffset, endNode: lastElement.id, endOffset: endOffset, textContent: selectionString, pageNumber: pageNumber, bound: selectionBound, rectangleBounds: selectionRectBounds };
                }
                else {
                    return null;
                }
            }
        }
        return null;
    };
    TextSelection.prototype.getSelectionRangeObject = function (startNode, startOffset, endNode, endOffset, pageNumber) {
        var startElement = document.getElementById(startNode);
        var endElement = document.getElementById(endNode);
        if (startElement.childNodes[0]) {
            startElement = startElement.childNodes[0];
        }
        if (endElement.childNodes[0]) {
            endElement = endElement.childNodes[0];
        }
        // tslint:disable-next-line:radix
        var currentAnchorOffset = parseInt(startNode.split('_' + pageNumber + '_')[1]);
        // tslint:disable-next-line:radix
        var currentFocusOffset = parseInt(endNode.split('_' + pageNumber + '_')[1]);
        var range = document.createRange();
        if (currentAnchorOffset <= currentFocusOffset) {
            range.setStart(startElement, startOffset);
            range.setEnd(endElement, endOffset);
        }
        else {
            range.setStart(endElement, endOffset);
            range.setEnd(startElement, startOffset);
        }
        return range;
    };
    TextSelection.prototype.getSelectionBounds = function (range, pageNumber) {
        var startElement = this.getNodeElementFromNode(range.startContainer);
        var endElement = this.getNodeElementFromNode(range.endContainer);
        var bounds = null;
        if (startElement !== endElement) {
            var newStartRange = document.createRange();
            // tslint:disable-next-line:max-line-length
            var startRange = this.createRangeForSelection(range.startContainer, range.endContainer, range.startOffset, range.endOffset, newStartRange);
            bounds = this.normalizeBounds(startRange.getBoundingClientRect(), pageNumber);
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
        }
        return bounds;
    };
    TextSelection.prototype.getSelectionRectangleBounds = function (range, pageNumber) {
        var selectionBounds = [];
        var startElement = this.getNodeElementFromNode(range.startContainer);
        var endElement = this.getNodeElementFromNode(range.endContainer);
        var bounds = null;
        if (startElement !== endElement) {
            var startOffset = 0;
            var endOffset = 0;
            var currentId = 0;
            var anchorPageId = this.pdfViewerBase.textLayer.getPageIndex(range.startContainer);
            var anchorTextId = this.pdfViewerBase.textLayer.getTextIndex(range.startContainer, anchorPageId);
            var focusPageId = this.pdfViewerBase.textLayer.getPageIndex(range.endContainer);
            var focusTextId = this.pdfViewerBase.textLayer.getTextIndex(range.endContainer, focusPageId);
            var textDivs = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).childNodes;
            if (pageNumber === anchorPageId) {
                currentId = anchorTextId;
            }
            else {
                currentId = 0;
            }
            for (var j = currentId; j < textDivs.length; j++) {
                var textElement = textDivs[j];
                if (j === anchorTextId) {
                    startOffset = range.startOffset;
                }
                else {
                    startOffset = 0;
                }
                if (j === focusTextId) {
                    endOffset = range.endOffset;
                }
                else {
                    endOffset = textElement.textContent.length;
                }
                var newRange = document.createRange();
                for (var k = 0; k < textElement.childNodes.length; k++) {
                    var node = textElement.childNodes[k];
                    newRange.setStart(node, startOffset);
                    newRange.setEnd(node, endOffset);
                }
                var boundingRect = this.normalizeBounds(newRange.getBoundingClientRect(), pageNumber);
                selectionBounds.push(boundingRect);
                newRange.detach();
                if (j === focusTextId) {
                    break;
                }
            }
        }
        else {
            bounds = this.normalizeBounds(range.getBoundingClientRect(), pageNumber);
            selectionBounds.push(bounds);
        }
        return selectionBounds;
    };
    TextSelection.prototype.getTextId = function (elementId) {
        var index = elementId.lastIndexOf('_');
        var divId = elementId.substring(index + 1, elementId.length);
        // tslint:disable-next-line:radix
        return parseInt(divId);
    };
    TextSelection.prototype.normalizeBounds = function (bound, pageNumber) {
        var newBounds = null;
        var currentPageElement = this.pdfViewerBase.getElement('_pageDiv_' + pageNumber);
        if (this.pdfViewerBase.isMixedSizeDocument) {
            var currentTextElement = this.pdfViewerBase.getElement('_textLayer_' + pageNumber);
            if (currentTextElement) {
                currentPageElement = currentTextElement;
            }
        }
        var currentPageRect = currentPageElement.getBoundingClientRect();
        newBounds = {
            bottom: this.getMagnifiedValue(bound.bottom - currentPageRect.top), height: this.getMagnifiedValue(bound.height),
            left: this.getMagnifiedValue(bound.left - currentPageRect.left), top: this.getMagnifiedValue(bound.top - currentPageRect.top),
            right: this.getMagnifiedValue(bound.right - currentPageRect.left), width: this.getMagnifiedValue(bound.width)
        };
        return newBounds;
    };
    TextSelection.prototype.getMagnifiedValue = function (value) {
        return value / this.pdfViewerBase.getZoomFactor();
    };
    /**
     * @private
     */
    TextSelection.prototype.getCurrentSelectionBounds = function (pageNumber) {
        var bound = null;
        var ranges = this.selectionRangeArray;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] !== null) {
                if (pageNumber === ranges[i].pageNumber) {
                    bound = ranges[i].bound;
                }
            }
        }
        return bound;
    };
    TextSelection.prototype.createRangeForSelection = function (start, end, startOffset, endOffset, range) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        return range;
    };
    TextSelection.prototype.maintainSelectionArray = function () {
        var _this = this;
        if (this.selectionRangeArray.length !== 0) {
            var selection = window.getSelection();
            var isBackward = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            // tslint:disable-next-line
            var anchorPage = isNaN(parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1])) ? parseInt(selection.anchorNode.id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
            if (isNaN(anchorPage)) {
                // tslint:disable-next-line:radix
                anchorPage = parseInt(selection.anchorNode.id.split('_text_')[1]);
            }
            // tslint:disable-next-line
            var focusPage_1 = isNaN(parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_pageDiv_')[1]) : parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
            if (isNaN(focusPage_1)) {
                // tslint:disable-next-line
                focusPage_1 = isNaN(parseInt(selection.focusNode.id.split('_text_')[1])) ? parseInt(selection.focusNode.id.split('_textLayer_')[1]) : parseInt(selection.focusNode.id.split('_text_')[1]);
            }
            var arrayObject = [];
            if (!isBackward) {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (!((_this.selectionStartPage <= obj.pageNumber) && (obj.pageNumber < focusPage_1)));
                });
            }
            else {
                arrayObject = this.selectionRangeArray.filter(
                // tslint:disable-next-line
                function (obj) {
                    return (!((focusPage_1 < obj.pageNumber) && (obj.pageNumber <= _this.selectionStartPage)));
                });
            }
            if (arrayObject.length > 0) {
                for (var i = 0; i < arrayObject.length; i++) {
                    var indexInArray = this.selectionRangeArray.indexOf(arrayObject[i]);
                    if (indexInArray !== -1) {
                        this.selectionRangeArray.splice(indexInArray, 1);
                    }
                }
                if (this.selectionRangeArray.length === 1) {
                    // tslint:disable-next-line:max-line-length
                    if (this.selectionRangeArray[0].pageNumber === anchorPage || this.selectionRangeArray[0].pageNumber === focusPage_1) {
                        arrayObject = [];
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.applySpanForSelection = function () {
        var selection = window.getSelection();
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode === selection.focusNode && selection.anchorOffset === selection.focusOffset && !selection.isCollapsed) {
            selection.removeAllRanges();
        }
        // tslint:disable-next-line:max-line-length
        if (selection.anchorNode !== null && this.pdfViewerBase.viewerContainer.contains(this.getNodeElementFromNode(selection.anchorNode))) {
            var isBackWardSelection = this.pdfViewerBase.textLayer.isBackWardSelection(selection);
            var anchorPageId = void 0;
            var focusPageId = void 0;
            var anchorOffsetDiv = void 0;
            var focusOffsetDiv = void 0;
            var anchorOffset = void 0;
            var focusOffset = void 0;
            if (isBackWardSelection) {
                // tslint:disable-next-line:radix
                anchorPageId = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                focusPageId = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1]);
                // tslint:disable-next-line:radix
                anchorOffsetDiv = parseInt(this.getNodeElementFromNode(selection.focusNode).id.split('_text_')[1].split('_')[1]);
                // tslint:disable-next-line:radix
                focusOffsetDiv = parseInt(this.getNodeElementFromNode(selection.anchorNode).id.split('_text_')[1].split('_')[1]);
                anchorOffset = selection.focusOffset;
                focusOffset = selection.anchorOffset;
            }
            else {
                var anchorElement = this.getNodeElementFromNode(selection.anchorNode);
                var focusElement = this.getNodeElementFromNode(selection.focusNode);
                // tslint:disable-next-line
                anchorPageId = (anchorElement.id.indexOf('text_') !== -1) ? parseInt(anchorElement.id.split('text_')[1]) : parseInt(anchorElement.id.split('_textLayer_')[1]);
                // tslint:disable-next-line
                focusPageId = (focusElement.id.indexOf('text_') !== -1) ? parseInt(focusElement.id.split('text_')[1]) : parseInt(focusElement.id.split('_textLayer_')[1]);
                var isFocusChanged = false;
                if (this.isTouchSelection) {
                    if (selection.focusNode === this.pdfViewerBase.pageContainer) {
                        var lastChildNode = this.pdfViewerBase.pageContainer.lastChild;
                        if (lastChildNode.classList.contains('e-pv-touch-select-drop')) {
                            var lastPageDiv = lastChildNode.previousSibling.previousSibling;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild;
                            isFocusChanged = true;
                        }
                        else if (lastChildNode.classList.contains('e-pv-page-div')) {
                            var lastPageDiv = lastChildNode;
                            // tslint:disable-next-line:radix
                            focusPageId = parseInt(lastPageDiv.id.split('_pageDiv_')[1]);
                            focusElement = this.pdfViewerBase.getElement('_textLayer_' + focusPageId).lastChild;
                            isFocusChanged = true;
                        }
                    }
                }
                if (anchorElement.classList.contains('e-pv-maintaincontent')) {
                    anchorElement = this.getNodeElementFromNode(anchorElement);
                    // tslint:disable-next-line:radix
                    anchorPageId = parseInt(anchorElement.id.split('text_')[1]);
                }
                if (focusElement.classList.contains('e-pv-maintaincontent')) {
                    focusElement = this.getNodeElementFromNode(focusElement);
                    // tslint:disable-next-line:radix
                    focusPageId = parseInt(focusElement.id.split('text_')[1]);
                }
                if (anchorPageId === focusPageId) {
                    if (anchorElement.contains(focusElement)) {
                        anchorElement = focusElement;
                    }
                    if (focusElement.contains(anchorElement)) {
                        focusElement = anchorElement;
                    }
                }
                // tslint:disable-next-line:radix
                anchorOffsetDiv = (anchorElement.id.split('text_')[1]) ? parseInt(anchorElement.id.split('text_')[1].split('_')[1]) : null;
                // tslint:disable-next-line:radix
                focusOffsetDiv = (focusElement.id.split('text_')[1]) ? parseInt(focusElement.id.split('text_')[1].split('_')[1]) : null;
                anchorOffsetDiv = isNaN(anchorOffsetDiv) ? focusOffsetDiv : anchorOffsetDiv;
                focusOffsetDiv = isNaN(focusOffsetDiv) ? anchorOffsetDiv : focusOffsetDiv;
                anchorOffset = selection.anchorOffset;
                focusOffset = !isFocusChanged ? selection.focusOffset : focusElement.textContent.length;
            }
            if (this.pdfViewerBase.checkIsNormalText()) {
                selection.removeAllRanges();
                this.pdfViewerBase.textLayer.clearDivSelection();
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.textLayer.applySpanForSelection(anchorPageId, focusPageId, anchorOffsetDiv, focusOffsetDiv, anchorOffset, focusOffset);
            }
            if (this.pdfViewer.textSearchModule) {
                this.pdfViewer.textSearchModule.searchAfterSelection();
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.initiateTouchSelection = function (event, x, y) {
        if (this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (this.pdfViewer.selectedItems.annotations.length > 0) {
                this.pdfViewer.clearSelection(this.pdfViewer.selectedItems.annotations[0].pageIndex);
            }
        }
        // tslint:disable-next-line
        var element = event.target;
        var belowElements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        if (belowElements.length !== 0) {
            if (belowElements[0].classList.contains('e-pv-hyperlink') && belowElements[1].classList.contains('e-pv-text')) {
                element = belowElements[1];
            }
        }
        var pageNumber = parseFloat(element.id.split('_')[2]);
        this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
        this.selectAWord(element, x, y, true);
        this.createTouchSelectElement(event);
        this.maintainSelectionOnZoom(true, false);
        this.fireTextSelectEnd();
        this.applySpanForSelection();
    };
    // tslint:disable-next-line
    TextSelection.prototype.selectTextByTouch = function (element, x, y, isForwardSelection, target, isCloserMovement) {
        var isTextSelected = false;
        if (element.nodeType === element.TEXT_NODE) {
            var rangeObject = element.ownerDocument.createRange();
            var selection = window.getSelection();
            rangeObject.selectNodeContents(element);
            var currentPosition = 0;
            var endPosition = rangeObject.endOffset;
            while (currentPosition < endPosition) {
                rangeObject.setStart(element, currentPosition);
                rangeObject.setEnd(element, currentPosition + 1);
                var rangeBounds = rangeObject.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    if (selection.anchorNode != null) {
                        if (isForwardSelection) {
                            rangeObject.setStart(selection.anchorNode, selection.anchorOffset);
                        }
                        // tslint:disable-next-line:max-line-length
                        rangeObject = this.setTouchSelectionStartPosition(selection, rangeObject, isForwardSelection, target, element, currentPosition, isCloserMovement);
                        if (isForwardSelection) {
                            selection.extend(element, currentPosition);
                        }
                        isTextSelected = true;
                    }
                    rangeObject.detach();
                    return isTextSelected;
                }
                currentPosition += 1;
            }
        }
        else {
            for (var i = 0; i < element.childNodes.length; i++) {
                var range = element.childNodes[i].ownerDocument.createRange();
                range.selectNodeContents(element.childNodes[i]);
                var rangeBounds = range.getBoundingClientRect();
                if (rangeBounds.left <= x && rangeBounds.right >= x && rangeBounds.top <= y && rangeBounds.bottom >= y) {
                    range.detach();
                    return (this.selectTextByTouch(element.childNodes[i], x, y, isForwardSelection, target, isCloserMovement));
                }
                else {
                    range.detach();
                }
            }
        }
        return isTextSelected;
    };
    // tslint:disable-next-line
    TextSelection.prototype.setTouchSelectionStartPosition = function (selection, range, isForwardSelection, target, element, currentPosition, isCloserMovement) {
        if (isForwardSelection) {
            if (target === 'left') {
                // tslint:disable-next-line
                var startNode = this.getTouchFocusElement(selection, true);
                range.setStart(startNode.focusNode, startNode.focusOffset);
                range.setEnd(element, currentPosition);
                this.selectionAnchorTouch = { anchorNode: range.endContainer.parentElement.id, anchorOffset: range.endOffset };
            }
            else if (target === 'right') {
                // tslint:disable-next-line
                var startNode = this.getTouchAnchorElement(selection, false);
                range.setStart(startNode.anchorNode, startNode.anchorOffset);
                range.setEnd(element, currentPosition);
                this.selectionFocusTouch = { focusNode: range.endContainer.parentElement.id, focusOffset: range.endOffset };
            }
        }
        else {
            if (target === 'left') {
                if (!isCloserMovement) {
                    // tslint:disable-next-line
                    var startNode = this.getTouchFocusElement(selection, false);
                    range.setStart(element, currentPosition);
                    // tslint:disable-next-line:radix
                    range.setEnd(startNode.focusNode, startNode.focusOffset);
                    if (range.toString() === '') {
                        range.setStart(element, currentPosition);
                        range.setEnd(selection.focusNode, selection.focusOffset);
                    }
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                }
                else {
                    range.setStart(element, currentPosition);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                    this.selectionAnchorTouch = { anchorNode: range.startContainer.parentElement.id, anchorOffset: range.startOffset };
                }
            }
            else if (target === 'right') {
                // tslint:disable-next-line
                var startNode = this.getTouchAnchorElement(selection, true);
                range.setStart(element, currentPosition);
                range.setEnd(startNode.anchorNode, startNode.anchorOffset);
                if (range.toString() === '') {
                    range.setStart(startNode.anchorNode, startNode.anchorOffset);
                    range.setEnd(element, currentPosition);
                }
                this.selectionFocusTouch = { focusNode: range.startContainer.parentElement.id, focusOffset: range.startOffset };
            }
        }
        selection.removeAllRanges();
        selection.addRange(range);
        return range;
    };
    TextSelection.prototype.getTouchAnchorElement = function (selection, isCurrentFocus) {
        var element = document.getElementById(this.selectionAnchorTouch.anchorNode.toString());
        var startNode = null;
        var offset = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
            offset = parseInt(this.selectionAnchorTouch.anchorOffset.toString());
        }
        else {
            if (isCurrentFocus) {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            }
            else {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            }
        }
        return { anchorNode: startNode, anchorOffset: offset };
    };
    TextSelection.prototype.getTouchFocusElement = function (selection, isCurrentAnchor) {
        var element = document.getElementById(this.selectionFocusTouch.focusNode.toString());
        var startNode = null;
        var offset = 0;
        if (element) {
            startNode = element.childNodes[0];
            // tslint:disable-next-line:radix
            offset = parseInt(this.selectionFocusTouch.focusOffset.toString());
        }
        else {
            if (isCurrentAnchor) {
                startNode = selection.anchorNode;
                offset = selection.anchorOffset;
            }
            else {
                startNode = selection.focusNode;
                offset = selection.focusOffset;
            }
        }
        return { focusNode: startNode, focusOffset: offset };
    };
    TextSelection.prototype.createTouchSelectElement = function (event) {
        this.isTouchSelection = true;
        var selection = window.getSelection();
        if (selection.type === 'Range') {
            // tslint:disable-next-line:max-line-length
            this.dropDivElementLeft = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_left', className: 'e-pv-touch-select-drop' });
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight = createElement('div', { id: this.pdfViewer.element.id + '_touchSelect_droplet_right', className: 'e-pv-touch-select-drop' });
            this.dropElementLeft = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementLeft.style.transform = 'rotate(0deg)';
            this.dropDivElementLeft.appendChild(this.dropElementLeft);
            this.dropElementRight = createElement('div', { className: 'e-pv-touch-ellipse' });
            this.dropElementRight.style.transform = 'rotate(-90deg)';
            this.dropDivElementRight.appendChild(this.dropElementRight);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementLeft);
            this.pdfViewerBase.pageContainer.appendChild(this.dropDivElementRight);
            var range = selection.getRangeAt(0);
            var rangePosition = range.getBoundingClientRect();
            var dropElementRect = this.dropDivElementLeft.getBoundingClientRect();
            // tslint:disable-next-line:max-line-length
            var pageTopValue = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top;
            var viewerLeftPosition = this.pdfViewerBase.viewerContainer.getBoundingClientRect().left;
            var topClientValue = this.getClientValueTop(rangePosition.top, this.pdfViewerBase.currentPageNumber - 1);
            // tslint:disable-next-line:max-line-length
            var topPositionValue = topClientValue + pageTopValue * this.pdfViewerBase.getZoomFactor() + (dropElementRect.height / 2) * this.pdfViewerBase.getZoomFactor() + 'px';
            this.dropDivElementLeft.style.top = topPositionValue;
            this.dropDivElementLeft.style.left = rangePosition.left - (viewerLeftPosition + (dropElementRect.width)) + 'px';
            this.dropDivElementRight.style.top = topPositionValue;
            // tslint:disable-next-line:max-line-length
            this.dropDivElementRight.style.left = rangePosition.left + rangePosition.width - viewerLeftPosition + 'px';
            var currentPageLeft = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1)).getBoundingClientRect().left;
            var currentRangeLeft = rangePosition.left - currentPageLeft;
            // tslint:disable-next-line:max-line-length
            this.topStoreLeft = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft), isHeightNeeded: true };
            // tslint:disable-next-line:max-line-length
            this.topStoreRight = { pageTop: pageTopValue, topClientValue: this.getMagnifiedValue(topClientValue), pageNumber: this.pdfViewerBase.currentPageNumber - 1, left: this.getMagnifiedValue(currentRangeLeft + rangePosition.width), isHeightNeeded: true };
            this.dropDivElementLeft.addEventListener('touchstart', this.onLeftTouchSelectElementTouchStart);
            this.dropDivElementLeft.addEventListener('touchmove', this.onLeftTouchSelectElementTouchMove);
            this.dropDivElementLeft.addEventListener('touchend', this.onLeftTouchSelectElementTouchEnd);
            this.dropDivElementRight.addEventListener('touchstart', this.onRightTouchSelectElementTouchStart);
            this.dropDivElementRight.addEventListener('touchmove', this.onRightTouchSelectElementTouchMove);
            this.dropDivElementRight.addEventListener('touchend', this.onRightTouchSelectElementTouchEnd);
            // tslint:disable-next-line:max-line-length
            this.calculateContextMenuPosition(event.touches[0].clientY, event.touches[0].clientX);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    TextSelection.prototype.calculateContextMenuPosition = function (top, left) {
        top = top - this.pdfViewerBase.toolbarHeight;
        if (Browser.isDevice) {
            // tslint:disable-next-line
            var contextTop = top - this.contextMenuHeight;
            if (contextTop < this.pdfViewerBase.toolbarHeight) {
                top = top + this.contextMenuHeight;
            }
            else {
                top = contextTop;
            }
        }
        if (this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
            left = left - 50;
        }
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.contextMenuModule.contextMenuObj.open(top, left - this.pdfViewerBase.viewerContainer.clientLeft, this.pdfViewerBase.viewerContainer);
    };
    /**
     * @private
     */
    TextSelection.prototype.initiateSelectionByTouch = function () {
        this.pdfViewerBase.textLayer.clearDivSelection();
        this.pdfViewerBase.contextMenuModule.contextMenuObj.close();
        var lowerPageIndex = this.pdfViewerBase.currentPageNumber - 3;
        lowerPageIndex = (lowerPageIndex < 0) ? 0 : lowerPageIndex;
        var higherPageIndex = this.pdfViewer.currentPageNumber + 1;
        // tslint:disable-next-line:max-line-length
        higherPageIndex = (higherPageIndex < (this.pdfViewerBase.pageCount - 1)) ? higherPageIndex : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageIndex; i <= higherPageIndex; i++) {
            var textLayer = this.pdfViewerBase.getElement('_textLayer_' + i);
            if (textLayer) {
                if (textLayer.childNodes !== null) {
                    this.applySelectionMouseScroll(i);
                }
            }
        }
        if (this.selectionRangeArray.length > 0) {
            this.pdfViewer.fireTextSelectionStart(this.selectionRangeArray[0].pageNumber + 1);
        }
    };
    // tslint:disable-next-line
    TextSelection.prototype.terminateSelectionByTouch = function (event) {
        this.maintainSelectionOnZoom(true, false);
        this.applySpanForSelection();
        if (this.pdfViewerBase.getTextMarkupAnnotationMode()) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
        }
        else {
            this.fireTextSelectEnd();
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.contextMenuModule.contextMenuObj.open(event.changedTouches[0].clientY - this.pdfViewerBase.viewerContainer.offsetTop + this.pdfViewerBase.contextMenuModule.contextMenuElement.clientHeight, event.changedTouches[0].clientX - this.pdfViewerBase.viewerContainer.offsetLeft, this.pdfViewerBase.viewerContainer);
        }
    };
    TextSelection.prototype.getNodeElement = function (range, touchX, touchY, event, nodeElement) {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(touchX, touchY);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
            // tslint:disable-next-line
        }
        else if (document.caretPositionFromPoint) {
            // tslint:disable-next-line
            var start = document.caretPositionFromPoint(touchX, touchY);
            // tslint:disable-next-line
            var end = document.caretPositionFromPoint(touchX, touchY);
            range = document.createRange();
            range.setStart(start.offsetNode, start.offset);
            range.setEnd(end.offsetNode, end.offset);
            nodeElement = this.onTouchElementScroll(range, nodeElement, touchY, event);
        }
        return nodeElement;
    };
    TextSelection.prototype.isTouchedWithinContainer = function (event) {
        var elements = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        var isTouchedWithinContainer = false;
        if (elements.length !== 0) {
            isTouchedWithinContainer = true;
        }
        return isTouchedWithinContainer;
    };
    TextSelection.prototype.onTouchElementScroll = function (range, nodeElement, touchY, event) {
        var viewerScrollTop = this.pdfViewerBase.viewerContainer.scrollTop;
        if (range != null) {
            nodeElement = range.startContainer;
            var isScrollBar = this.isScrolledOnScrollBar(event);
            if (!this.pdfViewerBase.viewerContainer.contains(nodeElement.parentElement) || isScrollBar) {
                if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
                }
                else {
                    this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
                }
            }
        }
        else {
            if (touchY < this.pdfViewerBase.viewerContainer.clientHeight) {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop - 30;
            }
            else {
                this.pdfViewerBase.viewerContainer.scrollTop = viewerScrollTop + 30;
            }
        }
        return nodeElement;
    };
    TextSelection.prototype.isCloserTouchScroll = function (currentDifference) {
        var isForwardMovement = false;
        if (this.previousScrollDifference > currentDifference) {
            isForwardMovement = true;
        }
        return isForwardMovement;
    };
    TextSelection.prototype.getClientValueTop = function (clientValue, pageNumber) {
        if (this.pdfViewerBase.getElement('_pageDiv_' + pageNumber)) {
            // tslint:disable-next-line:max-line-length
            return clientValue - this.pdfViewerBase.getElement('_pageDiv_' + pageNumber).getBoundingClientRect().top;
        }
        else {
            return clientValue;
        }
    };
    TextSelection.prototype.isScrolledOnScrollBar = function (event) {
        var isScrollBar = false;
        // tslint:disable-next-line:max-line-length
        if (event.touches && (this.pdfViewerBase.viewerContainer.clientHeight + this.pdfViewerBase.viewerContainer.offsetTop) < event.touches[0].clientY && event.touches[0].clientY < (this.pdfViewerBase.viewerContainer.offsetHeight + this.pdfViewerBase.viewerContainer.offsetTop)) {
            isScrollBar = true;
        }
        return isScrollBar;
    };
    TextSelection.prototype.getTextLastLength = function (element) {
        if (element) {
            return element.textContent.length;
        }
        else {
            return 0;
        }
    };
    TextSelection.prototype.getNodeElementFromNode = function (node) {
        if (node.parentElement) {
            return node.parentElement;
        }
        else {
            return node.parentNode;
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.copyText = function () {
        var selectionText = '';
        this.maintainSelectionOnZoom(true, false);
        if (this.selectionRangeArray.length > 0) {
            for (var i = 0; i < this.selectionRangeArray.length; i++) {
                selectionText += this.selectionRangeArray[i].textContent;
            }
        }
        if (selectionText.length > 0) {
            if (this.pdfViewer.annotation) {
                this.pdfViewer.annotation.isShapeCopied = false;
            }
            var textArea = document.createElement('textarea');
            textArea.contentEditable = 'true';
            textArea.textContent = selectionText;
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
                this.pdfViewer.annotation.freeTextAnnotationModule.selectedText = selectionText;
            }
            textArea.style.position = 'fixed';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
            }
            catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            }
            finally {
                if (textArea) {
                    document.body.removeChild(textArea);
                }
            }
        }
    };
    /**
     * @private
     */
    TextSelection.prototype.destroy = function () {
        this.clear();
    };
    /**
     * @private
     */
    TextSelection.prototype.getModuleName = function () {
        return 'TextSelection';
    };
    return TextSelection;
}());
export { TextSelection };
