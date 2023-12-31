import { Browser } from '@syncfusion/ej2-base';
import { getDiagramElement } from '@syncfusion/ej2-drawings';
/**
 * Magnification module
 */
var Magnification = /** @class */ (function () {
    /**
     * @private
     */
    function Magnification(pdfViewer, viewerBase) {
        /**
         * @private
         */
        this.zoomFactor = 1;
        /**
         * @private
         */
        this.previousZoomFactor = 1;
        this.scrollWidth = 25;
        this.zoomPercentages = [10, 25, 50, 75, 100, 125, 150, 200, 400];
        this.isNotPredefinedZoom = false;
        this.pinchStep = 0.02;
        this.reRenderPageNumber = 0;
        // tslint:disable-next-line
        this.magnifyPageRerenderTimer = null;
        // tslint:disable-next-line
        this.rerenderOnScrollTimer = null;
        // tslint:disable-next-line
        this.rerenderInterval = null;
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.pageRerenderCount = 0;
        this.imageObjects = [];
        this.topValue = 0;
        this.isTapToFitZoom = false;
        /**
         * @private
         */
        this.fitType = null;
        /**
         * @private
         */
        this.isPinchZoomed = false;
        /**
         * @private
         */
        this.isPagePinchZoomed = false;
        /**
         * @private
         */
        this.isRerenderCanvasCreated = false;
        /**
         * @private
         */
        this.isMagnified = false;
        /**
         * @private
         */
        this.isPagesZoomed = false;
        /**
         * @private
         */
        this.isPinchScrolled = false;
        /**
         * @private
         */
        this.isAutoZoom = false;
        this.isWebkitMobile = false;
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = viewerBase;
        this.zoomLevel = 2;
        // tslint:disable-next-line:max-line-length
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1);
    }
    /**
     * Zoom the PDF document to the given zoom value
     * @param  {number} zoomValue - Specifies the Zoom Value for magnify the PDF document
     * @returns void
     */
    Magnification.prototype.zoomTo = function (zoomValue) {
        if (zoomValue < 10) {
            zoomValue = 10;
        }
        else if (zoomValue > 400) {
            zoomValue = 400;
        }
        this.fitType = null;
        this.isNotPredefinedZoom = false;
        if (this.isAutoZoom && this.isInitialLoading) {
            this.pdfViewerBase.onWindowResize();
        }
        else {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
        }
        this.isInitialLoading = false;
    };
    /**
     * Magnifies the page to the next value in the zoom drop down list.
     * @returns void
     */
    Magnification.prototype.zoomIn = function () {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.lowerZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel >= 8) {
            this.zoomLevel = 8;
        }
        else {
            this.zoomLevel++;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    };
    /**
     * Magnifies the page to the previous value in the zoom drop down list.
     * @returns void
     */
    Magnification.prototype.zoomOut = function () {
        if (this.fitType || this.isNotPredefinedZoom) {
            this.zoomLevel = this.higherZoomLevel;
            this.fitType = null;
        }
        this.isNotPredefinedZoom = false;
        if (this.zoomLevel <= 0) {
            this.zoomLevel = 0;
        }
        else {
            this.zoomLevel--;
        }
        this.isAutoZoom = false;
        this.onZoomChanged(this.zoomPercentages[this.zoomLevel]);
    };
    /**
     * Scales the page to fit the page width to the width of the container in the control.
     * @returns void
     */
    Magnification.prototype.fitToWidth = function () {
        this.isAutoZoom = false;
        var zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    };
    /**
     * @private
     */
    Magnification.prototype.fitToAuto = function () {
        this.isAutoZoom = true;
        var zoomValue = this.calculateFitZoomFactor('fitToWidth');
        this.onZoomChanged(zoomValue);
    };
    /**
     * Scales the page to fit the page in the container in the control.
     * @param  {number} zoomValue - Defines the Zoom Value for fit the page in the Container
     * @returns void
     */
    Magnification.prototype.fitToPage = function () {
        var zoomValue = this.calculateFitZoomFactor('fitToPage');
        if (zoomValue !== null) {
            this.isAutoZoom = false;
            this.onZoomChanged(zoomValue);
            if (Browser.isDevice) {
                if (this.isWebkitMobile) {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
                }
                else {
                    this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
                }
            }
            else {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[this.pdfViewerBase.currentPageNumber - 1].top * this.zoomFactor;
        }
    };
    /**
     * Returns zoom factor for the fit zooms.
     */
    Magnification.prototype.calculateFitZoomFactor = function (type) {
        var viewerWidth = this.pdfViewerBase.viewerContainer.getBoundingClientRect().width;
        var viewerHeight = this.pdfViewerBase.viewerContainer.getBoundingClientRect().height;
        if (viewerWidth === 0 && viewerHeight === 0) {
            viewerWidth = parseFloat(this.pdfViewer.width.toString());
            viewerHeight = parseFloat(this.pdfViewer.height.toString());
        }
        if (isNaN(viewerHeight) || isNaN(viewerWidth)) {
            return null;
        }
        var highestWidth = 0;
        var highestHeight = 0;
        this.fitType = type;
        if (this.fitType === 'fitToWidth') {
            var pageWidth = 0;
            for (var i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageWidth = this.pdfViewerBase.pageSize[i].width;
                if (pageWidth > highestWidth) {
                    highestWidth = pageWidth;
                }
            }
            var scaleX = ((viewerWidth - this.scrollWidth) / highestWidth);
            if (this.isAutoZoom) {
                this.fitType = null;
                scaleX = Math.min(1, scaleX);
                if (scaleX === 1) {
                    this.zoomLevel = 2;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt((scaleX * 100).toString());
        }
        else {
            var pageHeight = 0;
            for (var i = 0; i < this.pdfViewerBase.pageSize.length; i++) {
                pageHeight = this.pdfViewerBase.pageSize[i].height;
                if (pageHeight > highestHeight) {
                    highestHeight = pageHeight;
                }
            }
            // tslint:disable-next-line:radix
            return parseInt(((viewerHeight / highestHeight) * 100).toString());
        }
    };
    /**
     * Performs pinch in operation
     */
    Magnification.prototype.pinchIn = function () {
        this.fitType = null;
        var temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        if (temporaryZoomFactor < 4 && temporaryZoomFactor > 2) {
            temporaryZoomFactor = this.zoomFactor - this.pinchStep;
        }
        if (temporaryZoomFactor < 0.1) {
            temporaryZoomFactor = 0.1;
        }
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
        this.isTapToFitZoom = true;
        if (Browser.isDevice && (this.zoomFactor * 100) === 50) {
            var zoomValue = this.calculateFitZoomFactor('fitToWidth');
            this.fitType = null;
            if (zoomValue <= 50) {
                this.fitToWidth();
            }
        }
    };
    /**
     * Performs pinch out operation
     */
    Magnification.prototype.pinchOut = function () {
        this.fitType = null;
        var temporaryZoomFactor = this.zoomFactor + this.pinchStep;
        if (Browser.isDevice) {
            if (temporaryZoomFactor > 2) {
                temporaryZoomFactor = 2;
            }
        }
        else {
            if (temporaryZoomFactor > 2) {
                temporaryZoomFactor = temporaryZoomFactor + this.pinchStep;
            }
            if (temporaryZoomFactor > 4) {
                temporaryZoomFactor = 4;
            }
        }
        this.isTapToFitZoom = true;
        this.isPinchZoomed = true;
        this.onZoomChanged(temporaryZoomFactor * 100);
    };
    /**
     * returns zoom level for the zoom factor.
     */
    Magnification.prototype.getZoomLevel = function (zoomFactor) {
        var min = 0;
        var max = this.zoomPercentages.length - 1;
        while ((min <= max) && !(min === 0 && max === 0)) {
            var mid = Math.round((min + max) / 2);
            if (this.zoomPercentages[mid] <= zoomFactor) {
                min = mid + 1;
            }
            else if (this.zoomPercentages[mid] >= zoomFactor) {
                max = mid - 1;
            }
        }
        this.higherZoomLevel = min;
        this.lowerZoomLevel = max;
        return max;
    };
    /**
     * @private
     */
    Magnification.prototype.checkZoomFactor = function () {
        return this.zoomPercentages.indexOf(this.zoomFactor * 100) > -1;
    };
    /**
     * Executes when the zoom or pinch operation is performed
     */
    Magnification.prototype.onZoomChanged = function (zoomValue) {
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.closePopupMenu();
        }
        this.previousZoomFactor = this.zoomFactor;
        this.zoomLevel = this.getZoomLevel(zoomValue);
        this.zoomFactor = this.getZoomFactor(zoomValue);
        if (this.zoomFactor <= 0.25) {
            this.pdfViewerBase.isMinimumZoom = true;
        }
        else {
            this.pdfViewerBase.isMinimumZoom = false;
        }
        if (Browser.isDevice) {
            if (this.isWebkitMobile) {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
            }
            else {
                this.pdfViewerBase.viewerContainer.style.overflowY = 'hidden';
            }
        }
        else {
            this.pdfViewerBase.viewerContainer.style.overflowY = 'auto';
        }
        if (this.pdfViewerBase.pageCount > 0) {
            if ((this.previousZoomFactor !== this.zoomFactor)) {
                if (!this.isPinchZoomed) {
                    this.magnifyPages();
                }
                else {
                    if (Browser.isDevice) {
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewerBase.mobilePageNoContainer.style.left = (this.pdfViewer.element.clientWidth / 2) - (parseFloat(this.pdfViewerBase.mobilePageNoContainer.style.width) / 2) + 'px';
                    }
                    this.responsivePages();
                }
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateZoomButtons();
            }
            if (!this.isInitialLoading) {
                if (this.previousZoomFactor !== this.zoomFactor) {
                    this.pdfViewer.zoomValue = this.zoomFactor * 100;
                    this.pdfViewer.fireZoomChange();
                }
            }
        }
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateZoomPercentage(this.zoomFactor);
        }
        if (Browser.isDevice && this.isPinchZoomed) {
            // tslint:disable-next-line:radix
            var zoomPercentage = parseInt((this.zoomFactor * 100).toString()) + '%';
            this.pdfViewerBase.navigationPane.createTooltipMobile(zoomPercentage);
        }
    };
    /**
     * @private
     */
    Magnification.prototype.setTouchPoints = function (clientX, clientY) {
        this.touchCenterX = clientX;
        this.touchCenterY = clientY;
    };
    /**
     * @private
     */
    Magnification.prototype.initiatePinchMove = function (pointX1, pointY1, pointX2, pointY2) {
        this.isPinchScrolled = false;
        this.isMagnified = false;
        this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        this.touchCenterX = (pointX1 + pointX2) / 2;
        this.touchCenterY = (pointY1 + pointY2) / 2;
        this.zoomOverPages(pointX1, pointY1, pointX2, pointY2);
    };
    Magnification.prototype.magnifyPages = function () {
        this.clearRerenderTimer();
        if (!this.isPagesZoomed) {
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
        }
        if (!this.pdfViewerBase.documentLoaded) {
            this.isPagesZoomed = true;
        }
        var scrollValue = this.getMagnifiedValue(this.pdfViewerBase.viewerContainer.scrollTop);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(false, true);
        }
        if (!this.isInitialLoading) {
            this.isMagnified = true;
        }
        this.updatePageLocation();
        this.resizeCanvas(this.reRenderPageNumber);
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.resizeTouchElements();
        }
        // tslint:disable-next-line
        var annotModule = this.pdfViewer.annotationModule;
        if (annotModule && annotModule.textMarkupAnnotationModule) {
            this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateCurrentResizerPosition();
        }
        if (this.pdfViewerBase.pageSize.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.getPageHeight(this.pdfViewerBase.pageSize.length - 1) + 'px';
            // tslint:disable-next-line 
            var proxy_1 = this;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.pdfViewerBase.viewerContainer.scrollTop = scrollValue;
            if (!this.pdfViewerBase.documentLoaded) {
                this.magnifyPageRerenderTimer = setTimeout(function () { proxy_1.rerenderMagnifiedPages(); }, 800);
            }
        }
    };
    Magnification.prototype.updatePageLocation = function () {
        this.topValue = 0;
        for (var i = 1; i < this.pdfViewerBase.pageSize.length; i++) {
            this.topValue += (this.pdfViewerBase.pageSize[i].height + this.pdfViewerBase.pageGap) * this.zoomFactor;
        }
    };
    Magnification.prototype.clearRerenderTimer = function () {
        clearTimeout(this.rerenderOnScrollTimer);
        clearTimeout(this.magnifyPageRerenderTimer);
        this.clearIntervalTimer();
        this.isPinchScrolled = false;
    };
    /**
     * @private
     */
    Magnification.prototype.clearIntervalTimer = function () {
        clearInterval(this.rerenderInterval);
        this.rerenderInterval = null;
        this.clearRendering();
        var oldCanvases = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_oldCanvas_"]');
        for (var i = 0; i < oldCanvases.length; i++) {
            // tslint:disable-next-line
            var pageNumber = parseInt(oldCanvases[i].id.split('_oldCanvas_')[1]);
            var pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + pageNumber);
            if (pageCanvas) {
                oldCanvases[i].id = pageCanvas.id;
                pageCanvas.parentElement.removeChild(pageCanvas);
            }
            else {
                oldCanvases[i].id = this.pdfViewer.element.id + '_pageCanvas_' + pageNumber;
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(i);
            }
        }
        this.isRerenderCanvasCreated = false;
    };
    /**
     * @private
     */
    Magnification.prototype.pushImageObjects = function (image) {
        this.imageObjects.push(image);
    };
    Magnification.prototype.clearRendering = function () {
        if (this.imageObjects) {
            for (var j = 0; j < this.imageObjects.length; j++) {
                if (this.imageObjects[j]) {
                    this.imageObjects[j].onload = null;
                }
            }
            this.imageObjects = [];
        }
    };
    Magnification.prototype.rerenderMagnifiedPages = function () {
        if ((this.pdfViewerBase.isInitialLoaded || this.pdfViewerBase.isDocumentLoaded) && !this.pdfViewerBase.isInitialPageMode) {
            this.renderInSeparateThread(this.reRenderPageNumber);
            this.isPagesZoomed = false;
        }
        else if (this.pdfViewerBase.isInitialPageMode) {
            this.pageRerenderCount = 0;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            this.isMagnified = false;
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.pdfViewerBase.isInitialPageMode = false;
        }
    };
    Magnification.prototype.renderInSeparateThread = function (pageNumber) {
        var _this = this;
        this.designNewCanvas(pageNumber);
        this.pageRerenderCount = 0;
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
        this.isMagnified = false;
        this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
        // tslint:disable-next-line
        var proxy = this;
        this.rerenderInterval = setInterval(function () { _this.initiateRerender(proxy); }, 1);
    };
    Magnification.prototype.responsivePages = function () {
        this.isPagesZoomed = true;
        this.clearRerenderTimer();
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewer.textSearchModule.clearAllOccurrences();
        }
        var scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
        this.isAutoZoom = false;
        this.updatePageLocation();
        // tslint:disable-next-line:max-line-length
        this.pdfViewerBase.pageContainer.style.height = this.topValue + this.pdfViewerBase.pageSize[this.pdfViewerBase.pageSize.length - 1].height * this.zoomFactor + 'px';
        this.resizeCanvas(this.pdfViewerBase.currentPageNumber);
        if (this.isPinchZoomed) {
            this.calculateScrollValues(scrollValue);
        }
        this.pdfViewerBase.renderedPagesList = [];
        this.pdfViewerBase.pinchZoomStorage = [];
    };
    Magnification.prototype.calculateScrollValues = function (scrollValue) {
        var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
        var currentPageCanvas = this.pdfViewerBase.getElement('_pageDiv_' + pageIndex);
        if (currentPageCanvas) {
            var currentPageBounds = currentPageCanvas.getBoundingClientRect();
            // update scroll top for the viewer container based on pinch zoom factor
            var previousPageTop = (currentPageBounds.top) * this.previousZoomFactor;
            var previousY = scrollValue + this.touchCenterY;
            // tslint:disable-next-line:max-line-length
            var currentY = (currentPageBounds.top) * this.zoomFactor + ((previousY - previousPageTop) < 0 ? previousY - previousPageTop : (previousY -
                // tslint:disable-next-line:max-line-length
                previousPageTop) * (this.zoomFactor / this.previousZoomFactor));
            this.pdfViewerBase.viewerContainer.scrollTop = currentY - this.touchCenterY;
            // update scroll left for the viewer container based on pinch zoom factor
            var prevValue = (currentPageBounds.width * this.previousZoomFactor) / currentPageBounds.width;
            var scaleCorrectionFactor = this.zoomFactor / prevValue - 1;
            var scrollX_1 = this.touchCenterX - currentPageBounds.left;
            this.pdfViewerBase.viewerContainer.scrollLeft += scrollX_1 * scaleCorrectionFactor;
        }
    };
    Magnification.prototype.rerenderOnScroll = function () {
        var _this = this;
        this.isPinchZoomed = false;
        if (this.isPinchScrolled) {
            this.rerenderOnScrollTimer = null;
            this.isPinchScrolled = false;
            this.reRenderPageNumber = this.pdfViewerBase.currentPageNumber;
            this.pdfViewerBase.renderedPagesList = [];
            this.pdfViewerBase.pinchZoomStorage = [];
            var pageDivs = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_pageCanvas_"]');
            var viewPortWidth = 816;
            for (var i = 0; i < pageDivs.length; i++) {
                // tslint:disable-next-line:radix
                var pageNumber = parseInt(pageDivs[i].id.split('_pageCanvas_')[1]);
                var pageWidth = this.pdfViewerBase.pageSize[pageNumber].width;
                if ((viewPortWidth < pageWidth) && this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    pageDivs[i].width = pageWidth * this.pdfViewerBase.getZoomFactor();
                    // tslint:disable-next-line:max-line-length
                    pageDivs[i].height = this.pdfViewerBase.pageSize[pageNumber].height * this.pdfViewerBase.getZoomFactor();
                }
            }
            if (this.pdfViewerBase.textLayer) {
                var textLayers = document.querySelectorAll('div[id*="' + this.pdfViewer.element.id + '_textLayer_"]');
                for (var i = 0; i < textLayers.length; i++) {
                    textLayers[i].style.display = 'block';
                }
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                // tslint:disable-next-line:max-line-length
                var annotationLayers = document.querySelectorAll('canvas[id*="' + this.pdfViewer.element.id + '_annotationCanvas_"]');
                for (var j = 0; j < annotationLayers.length; j++) {
                    var pageNumber = annotationLayers[j].id.split('_annotationCanvas_')[1];
                    // tslint:disable-next-line:radix
                    this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotationsPinch(parseInt(pageNumber));
                }
            }
            this.pdfViewerBase.pageViewScrollChanged(this.reRenderPageNumber);
            this.isPagePinchZoomed = false;
            this.rerenderOnScrollTimer = setTimeout(function () { _this.pdfViewerBase.pageViewScrollChanged(_this.reRenderPageNumber); }, 300);
        }
    };
    /**
     * @private
     */
    Magnification.prototype.pinchMoveScroll = function () {
        var _this = this;
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
        }
        if (this.isPagesZoomed || (!this.isRerenderCanvasCreated && this.isPagePinchZoomed)) {
            this.clearRendering();
            this.isPagesZoomed = false;
            clearTimeout(this.magnifyPageRerenderTimer);
            this.isPinchScrolled = true;
            this.rerenderOnScrollTimer = setTimeout(function () { _this.rerenderOnScroll(); }, 100);
        }
    };
    // tslint:disable-next-line
    Magnification.prototype.initiateRerender = function (proxy) {
        var isReRender = false;
        if (this.previousZoomFactor < 0.4 || this.pdfViewerBase.isMinimumZoom) {
            isReRender = true;
        }
        // tslint:disable-next-line:max-line-length
        if (((proxy.pageRerenderCount === proxy.pdfViewerBase.reRenderedCount) || isReRender) && proxy.pageRerenderCount !== 0 && proxy.pdfViewerBase.reRenderedCount !== 0) {
            proxy.reRenderAfterPinch(this.reRenderPageNumber);
        }
    };
    Magnification.prototype.reRenderAfterPinch = function (currentPageIndex) {
        this.pageRerenderCount = 0;
        var lowerPageValue = currentPageIndex - 3;
        var higherPageValue = currentPageIndex + 1;
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = currentPageIndex - 4;
            higherPageValue = currentPageIndex + 4;
        }
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            var pageCanvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (pageCanvas) {
                pageCanvas.style.display = 'block';
            }
            var oldCanvas = this.pdfViewerBase.getElement('_oldCanvas_' + i);
            if (oldCanvas) {
                oldCanvas.parentNode.removeChild(oldCanvas);
            }
            if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.rerenderAnnotations(i);
            }
            if (pageDiv) {
                pageDiv.style.visibility = 'visible';
            }
        }
        this.isRerenderCanvasCreated = false;
        this.isPagePinchZoomed = false;
        if (this.pdfViewerBase.reRenderedCount !== 0) {
            this.pdfViewerBase.reRenderedCount = 0;
            this.pageRerenderCount = 0;
            clearInterval(this.rerenderInterval);
            this.rerenderInterval = null;
        }
        this.imageObjects = [];
    };
    Magnification.prototype.designNewCanvas = function (currentPageIndex) {
        if (this.pdfViewerBase.textLayer) {
            this.pdfViewerBase.textLayer.clearTextLayers();
        }
        var lowerPageValue = currentPageIndex - 3;
        var higherPageValue = currentPageIndex + 1; // jshint ignore:line
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = currentPageIndex - 4;
            higherPageValue = currentPageIndex + 4;
        }
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
            if (canvas) {
                canvas.id = this.pdfViewer.element.id + '_oldCanvas_' + i;
                canvas.style.backgroundColor = '#fff';
                if (this.pdfViewerBase.isTextMarkupAnnotationModule()) {
                    var annotationCanvas = this.pdfViewerBase.getElement('_annotationCanvas_' + i);
                    annotationCanvas.id = this.pdfViewer.element.id + '_old_annotationCanvas_' + i;
                }
                // tslint:disable-next-line:max-line-length
                this.pdfViewerBase.renderPageCanvas(this.pdfViewerBase.getElement('_pageDiv_' + i), this.pdfViewerBase.pageSize[i].width * this.zoomFactor, this.pdfViewerBase.pageSize[i].height * this.zoomFactor, i, 'none');
            }
        }
        this.isRerenderCanvasCreated = true;
    };
    /**
     * @private
     */
    Magnification.prototype.pageRerenderOnMouseWheel = function () {
        var _this = this;
        if (this.isRerenderCanvasCreated) {
            this.clearIntervalTimer();
            clearTimeout(this.magnifyPageRerenderTimer);
            if (!this.isPinchScrolled) {
                this.isPinchScrolled = true;
                this.rerenderOnScrollTimer = setTimeout(function () { _this.rerenderOnScroll(); }, 100);
            }
        }
    };
    /**
     * @private
     */
    Magnification.prototype.renderCountIncrement = function () {
        if (this.isRerenderCanvasCreated) {
            this.pageRerenderCount++;
        }
    };
    /**
     * @private
     */
    Magnification.prototype.rerenderCountIncrement = function () {
        if (this.pageRerenderCount > 0) {
            this.pdfViewerBase.reRenderedCount++;
        }
    };
    Magnification.prototype.resizeCanvas = function (pageNumber) {
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.inkAnnotationModule) {
            // tslint:disable-next-line
            var currentPageNumber = parseInt(this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
            this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
        }
        var lowerPageValue = pageNumber - 3;
        var higherPageValue = pageNumber + 3;
        if (this.pdfViewerBase.isMinimumZoom) {
            lowerPageValue = pageNumber - 4;
            higherPageValue = pageNumber + 4;
        }
        lowerPageValue = (lowerPageValue > 0) ? lowerPageValue : 0;
        higherPageValue = (higherPageValue < this.pdfViewerBase.pageCount) ? higherPageValue : (this.pdfViewerBase.pageCount - 1);
        for (var i = lowerPageValue; i <= higherPageValue; i++) {
            var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + i);
            var textLayer = document.getElementById(this.pdfViewer.element.id + '_textLayer_' + i);
            if (pageDiv) {
                if ((lowerPageValue <= i) && (i <= higherPageValue)) {
                    var isSelectionAvailable = false;
                    if (this.pdfViewer.textSelectionModule) {
                        isSelectionAvailable = this.pdfViewer.textSelectionModule.isSelectionAvailableOnScroll(i);
                    }
                    if (this.pdfViewerBase.pageSize[i] != null) {
                        var width = this.pdfViewerBase.pageSize[i].width * this.zoomFactor;
                        var height = this.pdfViewerBase.pageSize[i].height * this.zoomFactor;
                        if (this.pdfViewerBase.isMixedSizeDocument && this.pdfViewerBase.highestWidth > 0) {
                            pageDiv.style.width = (this.pdfViewerBase.highestWidth * this.zoomFactor) + 'px';
                        }
                        else {
                            pageDiv.style.width = width + 'px';
                        }
                        pageDiv.style.height = height + 'px';
                        // tslint:disable-next-line:max-line-length
                        pageDiv.style.top = ((this.pdfViewerBase.pageSize[i].top) * this.zoomFactor) + 'px';
                        if (this.pdfViewer.enableRtl) {
                            pageDiv.style.right = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        else {
                            pageDiv.style.left = this.pdfViewerBase.updateLeftPosition(i) + 'px';
                        }
                        var canvas = this.pdfViewerBase.getElement('_pageCanvas_' + i);
                        if (canvas) {
                            canvas.style.width = width + 'px';
                            canvas.style.height = height + 'px';
                            if (this.pdfViewer.annotation) {
                                this.pdfViewer.annotationModule.resizeAnnotations(width, height, i);
                            }
                        }
                        if (textLayer) {
                            textLayer.style.width = width + 'px';
                            textLayer.style.height = height + 'px';
                            if (this.pdfViewer.textSelectionModule) {
                                if (this.isPinchZoomed) {
                                    textLayer.style.display = 'none';
                                }
                                else if (this.isMagnified) {
                                    var lowerValue = ((pageNumber - 2) === 0) ? 0 : (pageNumber - 2);
                                    // tslint:disable-next-line:max-line-length
                                    var higherValue = ((pageNumber) === (this.pdfViewerBase.pageCount)) ? (this.pdfViewerBase.pageCount - 1) : (pageNumber + 1);
                                    if ((lowerValue <= i) && (i <= higherValue) && ((this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) || this.pdfViewerBase.textLayer.getTextSearchStatus() || this.pdfViewerBase.isInitialPageMode)) {
                                        this.pdfViewerBase.textLayer.resizeTextContentsOnZoom(i);
                                        if (this.pdfViewer.textSelectionModule.isTextSelection && isSelectionAvailable) {
                                            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(i);
                                        }
                                    }
                                    else {
                                        textLayer.style.display = 'none';
                                    }
                                }
                                else {
                                    textLayer.style.display = 'none';
                                }
                            }
                            this.pdfViewerBase.applyElementStyles(textLayer, i);
                        }
                        var adornerSvg = getDiagramElement(this.pdfViewer.element.id + '_textLayer_' + i);
                        if (adornerSvg) {
                            var adonerLayer = getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdorner_svg');
                            if (adonerLayer) {
                                adonerLayer.style.width = width + 'px';
                                adonerLayer.style.height = height + 'px';
                            }
                            var diagramAdornerLayer = getDiagramElement(this.pdfViewer.element.id + i + '_diagramAdornerLayer');
                            if (diagramAdornerLayer) {
                                diagramAdornerLayer.style.width = width + 'px';
                                diagramAdornerLayer.style.height = height + 'px';
                            }
                            adornerSvg.style.width = width + 'px';
                            adornerSvg.style.height = height + 'px';
                            this.pdfViewer.renderSelector(i, this.pdfViewer.annotationSelectorSettings);
                            this.pdfViewerBase.applyElementStyles(diagramAdornerLayer, i);
                        }
                    }
                }
            }
        }
    };
    Magnification.prototype.zoomOverPages = function (pointX1, pointY1, pointX2, pointY2) {
        // tslint:disable-next-line
        var currentDifference = Math.sqrt(Math.pow((pointX1 - pointX2), 2) + Math.pow((pointY1 - pointY2), 2));
        if (this.previousTouchDifference > -1) {
            if (currentDifference > this.previousTouchDifference) {
                this.pinchOut();
            }
            else if (currentDifference < this.previousTouchDifference) {
                this.pinchIn();
            }
        }
        this.previousTouchDifference = currentDifference;
    };
    /**
     * @private
     */
    Magnification.prototype.pinchMoveEnd = function () {
        this.touchCenterX = 0;
        this.touchCenterY = 0;
        this.previousTouchDifference = -1;
        if (this.isPinchZoomed) {
            this.isPinchScrolled = false;
            this.isPagePinchZoomed = true;
            this.pinchMoveScroll();
        }
    };
    /**
     * @private
     */
    Magnification.prototype.fitPageScrollMouseWheel = function (event) {
        if (this.fitType === 'fitToPage') {
            this.isMagnified = false;
            event.preventDefault();
            if (event.wheelDelta > 0) {
                this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
            else {
                this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
            }
        }
    };
    /**
     * @private
     */
    Magnification.prototype.magnifyBehaviorKeyDown = function (event) {
        var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
        var isCommandKey = isMac ? event.metaKey : false;
        switch (event.keyCode) {
            case 38: // up arrow
            case 37: // left arrow
            case 33: // page up
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.upwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 40: // down arrow
            case 39: // right arrow
            case 34: // page down
                if (this.fitType === 'fitToPage' && !((event.ctrlKey || isCommandKey) && event.shiftKey)) {
                    event.preventDefault();
                    this.downwardScrollFitPage(this.pdfViewerBase.currentPageNumber - 1);
                }
                break;
            case 187: // equal key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomIn();
                }
                break;
            case 189: // minus key
                if (event.ctrlKey || isCommandKey) {
                    event.preventDefault();
                    this.zoomOut();
                }
                break;
            case 48: // zero key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.fitToPage();
                }
                break;
            case 49: // one key
                if ((event.ctrlKey || isCommandKey) && !event.shiftKey) {
                    event.preventDefault();
                    this.zoomTo(100);
                }
                break;
            default:
                break;
        }
    };
    Magnification.prototype.upwardScrollFitPage = function (currentPageIndex) {
        if (currentPageIndex > 0) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex - 1].top * this.zoomFactor;
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
        }
    };
    /**
     * @private
     */
    Magnification.prototype.updatePagesForFitPage = function (currentPageIndex) {
        if (this.fitType === 'fitToPage') {
            if (currentPageIndex > 0) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex - 1)).style.visibility = 'hidden';
            }
            if (currentPageIndex < (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'hidden';
            }
        }
    };
    /**
     * @private
     */
    Magnification.prototype.onDoubleTapMagnification = function () {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.showToolbar(false);
        }
        var scrollValue = this.pdfViewerBase.viewerContainer.scrollTop;
        if (!this.isTapToFitZoom) {
            if (this.zoomFactor < 2) {
                this.zoomTo(200);
            }
            else {
                this.fitToWidth();
            }
        }
        else {
            this.fitToWidth();
        }
        this.calculateScrollValues(scrollValue);
        this.isTapToFitZoom = !this.isTapToFitZoom;
    };
    Magnification.prototype.downwardScrollFitPage = function (currentPageIndex) {
        if (currentPageIndex !== (this.pdfViewerBase.pageCount - 1)) {
            this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 1)).style.visibility = 'visible';
            this.pdfViewerBase.viewerContainer.scrollTop = this.pdfViewerBase.pageSize[currentPageIndex + 1].top * this.zoomFactor;
            if (currentPageIndex + 1 === (this.pdfViewerBase.pageCount - 1)) {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex)).style.visibility = 'hidden';
            }
            else {
                this.pdfViewerBase.getElement('_pageDiv_' + (currentPageIndex + 2)).style.visibility = 'hidden';
            }
        }
    };
    Magnification.prototype.getMagnifiedValue = function (value) {
        return (value / this.previousZoomFactor) * this.zoomFactor;
    };
    /**
     * @private
     */
    Magnification.prototype.destroy = function () {
        this.imageObjects = undefined;
    };
    /**
     * returns zoom factor when the zoom percent is passed.
     */
    Magnification.prototype.getZoomFactor = function (zoomValue) {
        return zoomValue / 100;
    };
    /**
     * @private
     */
    Magnification.prototype.getModuleName = function () {
        return 'Magnification';
    };
    return Magnification;
}());
export { Magnification };
