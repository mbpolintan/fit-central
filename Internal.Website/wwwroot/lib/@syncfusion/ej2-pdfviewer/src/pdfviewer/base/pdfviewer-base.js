var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { TextLayer, ContextMenu, Signature } from '../index';
import { NavigationPane } from './navigation-pane';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { AjaxHandler } from '../index';
// tslint:disable-next-line:max-line-length
import { Point, Rect, identityMatrix, transformPointByMatrix, contains, rotateMatrix } from '@syncfusion/ej2-drawings';
import { SelectTool, MoveTool, ResizeTool, ConnectTool, NodeDrawingTool, PolygonDrawingTool, LineTool, RotateTool, StampTool, InkDrawingTool } from '../drawing/tools';
import { Selector } from '../drawing/selector';
import { ActiveElements, findActiveElement } from '../drawing/action';
import { renderAdornerLayer } from '../drawing/dom-util';
import { cloneObject } from '../drawing/drawing-util';
/**
 * The `PdfViewerBase` module is used to handle base methods of PDF viewer.
 * @hidden
 */
var PdfViewerBase = /** @class */ (function () {
    function PdfViewerBase(viewer) {
        var _this = this;
        /**
         * @private
         */
        this.pageSize = [];
        /**
         * @private
         */
        this.pageCount = 0;
        /**
         * @private
         */
        this.currentPageNumber = 0;
        /**
         * @private
         */
        this.activeElements = new ActiveElements();
        /**
         * @private
         */
        this.isDocumentLoaded = false;
        /**
         * @private
         */
        this.renderedPagesList = [];
        /**
         * @private
         */
        this.pageGap = 8;
        /**
         * @private
         */
        this.signatureAdded = false;
        this.pageLeft = 5;
        this.sessionLimit = 1000;
        this.pageStopValue = 300;
        /**
         * @private
         */
        this.toolbarHeight = 56;
        this.pageLimit = 0;
        this.previousPage = 0;
        this.isViewerMouseDown = false;
        this.isViewerMouseWheel = false;
        this.scrollPosition = 0;
        this.sessionStorage = [];
        this.pointerCount = 0;
        this.pointersForTouch = [];
        /**
         * @private
         */
        this.isPasswordAvailable = false;
        /**
         * @private
         */
        this.passwordData = '';
        /**
         * @private
         */
        this.reRenderedCount = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchClientX = 0;
        this.touchClientY = 0;
        this.previousTime = 0;
        this.currentTime = 0;
        this.isTouchScrolled = false;
        this.isLongTouchPropagated = false;
        // tslint:disable-next-line
        this.longTouchTimer = null;
        this.isViewerContainerDoubleClick = false;
        // tslint:disable-next-line
        this.dblClickTimer = null;
        /**
         * @private
         */
        this.pinchZoomStorage = [];
        /**
         * @private
         */
        this.isTextSelectionDisabled = false;
        /**
         * @private
         */
        this.isPanMode = false;
        this.dragX = 0;
        this.dragY = 0;
        this.isScrollbarMouseDown = false;
        this.scrollX = 0;
        this.scrollY = 0;
        this.ispageMoved = false;
        this.isThumb = false;
        this.isTapHidden = false;
        // tslint:disable-next-line
        this.singleTapTimer = null;
        this.tapCount = 0;
        this.inputTapCount = 0;
        /**
         * @private
         */
        this.isInitialLoaded = false;
        this.annotationPageList = [];
        this.importPageList = [];
        /**
         * @private
         */
        this.isImportAction = false;
        this.isImportedAnnotation = false;
        /**
         * @private
         */
        this.isAnnotationCollectionRemoved = false;
        /**
         * @private
         */
        this.tool = null;
        // tslint:disable-next-line
        this.action = 'Select';
        /**
         * @private
         */
        this.eventArgs = null;
        /**
         * @private
         */
        this.inAction = false;
        /**
         * @private
         */
        this.isMouseDown = false;
        /**
         * @private
         */
        this.isStampMouseDown = false;
        /**
         * @private
         */
        this.stampAdded = false;
        /**
         * @private
         */
        this.customStampCount = 0;
        /**
         * @private
         */
        this.isDynamicStamp = false;
        /**
         * @private
         */
        this.isMixedSizeDocument = false;
        /**
         * @private
         */
        this.highestWidth = 0;
        /**
         * @private
         */
        this.customStampCollection = [];
        /**
         * @private
         */
        this.isAlreadyAdded = false;
        /**
         * @private
         */
        this.isWebkitMobile = false;
        /**
         * @private
         */
        this.isFreeTextContextMenu = false;
        /**
         * @private
         */
        this.isSelection = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.annotationComments = null;
        /**
         * @private
         */
        this.isToolbarSignClicked = false;
        /**
         * @private
         */
        this.signatureCount = 0;
        /**
         * @private
         */
        this.isSignatureAdded = false;
        /**
         * @private
         */
        this.isNewSignatureAdded = false;
        /**
         * @private
         */
        this.isInitialPageMode = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.documentAnnotationCollections = null;
        /**
         * @private
         */
        this.annotationRenderredList = [];
        /**
         * @private
         */
        // tslint:disable-next-line
        this.annotationStorage = {};
        /**
         * @private
         */
        this.isStorageExceed = false;
        /**
         * @private
         */
        this.isNewStamp = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.downloadCollections = {};
        /**
         * @private
         */
        this.isAnnotationAdded = false;
        /**
         * @private
         */
        // tslint:disable-next-line
        this.annotationEvent = null;
        this.isAnnotationDrawn = false;
        /**
         * @private
         */
        this.isAnnotationSelect = false;
        /**
         * @private
         */
        this.isAnnotationMouseDown = false;
        /**
         * @private
         */
        this.isAnnotationMouseMove = false;
        /**
         * @private
         */
        this.validateForm = false;
        /**
         * @private
         */
        this.isMinimumZoom = false;
        /**
         * @private
         */
        this.documentLoaded = false;
        this.tileRenderCount = 0;
        this.tileRequestCount = 0;
        /**
         * @private
         */
        this.isTileImageRendered = false;
        this.isDataExits = false;
        this.requestLists = [];
        /**
         * @private
         */
        this.isInkAdded = false;
        /**
         * @private
         */
        this.inkCount = 0;
        /**
         * @private
         */
        this.isAddedSignClicked = false;
        /**
         * @private
         */
        this.imageCount = 0;
        /**
         * @private
         */
        this.isMousedOver = false;
        this.clearSessionStorage = function () {
            var documentId = window.sessionStorage.getItem('hashId');
            var documentLiveCount = window.sessionStorage.getItem('documentLiveCount');
            if (documentId !== null) {
                // tslint:disable-next-line:max-line-length
                var jsonObject = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: _this.pdfViewer.element.id };
                var actionName = window.sessionStorage.getItem('unload');
                // tslint:disable-next-line
                var browserSupportsKeepalive = 'keepalive' in new Request('');
                if (browserSupportsKeepalive) {
                    // tslint:disable-next-line
                    var headerValue = _this.setUnloadRequestHeaders();
                    fetch(window.sessionStorage.getItem('serviceURL') + '/' + actionName, {
                        method: 'POST',
                        headers: headerValue,
                        body: JSON.stringify(jsonObject)
                    });
                }
            }
            window.sessionStorage.removeItem(_this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(_this.documentId + '_formfields');
            window.sessionStorage.removeItem(_this.documentId + '_annotations_sign');
            window.sessionStorage.getItem(_this.documentId + '_pagedata');
            window.sessionStorage.removeItem('hashId');
            window.sessionStorage.removeItem('documentLiveCount');
            window.sessionStorage.removeItem('currentDocument');
            window.sessionStorage.removeItem('serviceURL');
            window.sessionStorage.removeItem('unload');
        };
        /**
         * @private
         */
        this.onWindowResize = function (event) {
            var proxy = _this;
            if (_this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.right = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.left = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
            }
            else {
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.left = (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) + 'px';
                // tslint:disable-next-line:max-line-length
                proxy.viewerContainer.style.right = (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.commentPanelContainer.offsetWidth : 0) + 'px';
            }
            // tslint:disable-next-line
            var viewerElementWidth = (proxy.pdfViewer.element.clientWidth > 0 ? proxy.pdfViewer.element.clientWidth : proxy.pdfViewer.element.style.width);
            // tslint:disable-next-line
            var viewerWidth = (viewerElementWidth - (proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerContainerLeft() : 0) - (proxy.navigationPane.commentPanelContainer ? proxy.navigationPane.getViewerContainerRight() : 0));
            proxy.viewerContainer.style.width = viewerWidth + 'px';
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line
                var toolbarContainer = proxy.getElement('_toolbarContainer');
                var toolbarHeight = 0;
                if (toolbarContainer) {
                    toolbarHeight = toolbarContainer.getBoundingClientRect().height;
                }
                if (proxy.isAnnotationToolbarHidden() || Browser.isDevice) {
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight);
                }
                else {
                    // tslint:disable-next-line
                    var annotationToolbarContainer = proxy.getElement('_annotation_toolbar');
                    var annotationToolbarHeight = 0;
                    if (annotationToolbarContainer) {
                        annotationToolbarHeight = annotationToolbarContainer.getBoundingClientRect().height;
                    }
                    // tslint:disable-next-line:max-line-length
                    proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, toolbarHeight + annotationToolbarHeight);
                }
            }
            else {
                proxy.viewerContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            if (proxy.pdfViewer.bookmarkViewModule && Browser.isDevice) {
                var bookmarkContainer = proxy.getElement('_bookmarks_container');
                if (bookmarkContainer) {
                    bookmarkContainer.style.height = proxy.updatePageHeight(proxy.pdfViewer.element.getBoundingClientRect().height, 0);
                }
            }
            if (proxy.viewerContainer.style.height === '0px') {
                if (proxy.pdfViewer.height.toString() === 'auto') {
                    proxy.pdfViewer.height = 500;
                    proxy.viewerContainer.style.height = proxy.pdfViewer.height + 'px';
                }
                else {
                    proxy.viewerContainer.style.height = proxy.pdfViewer.element.style.height;
                }
            }
            if (proxy.viewerContainer.style.width === '0px') {
                if (proxy.pdfViewer.width.toString() === 'auto') {
                    proxy.pdfViewer.width = 500;
                    proxy.viewerContainer.style.width = proxy.pdfViewer.width + 'px';
                }
                else {
                    proxy.viewerContainer.style.width = proxy.pdfViewer.element.style.width;
                }
            }
            proxy.pageContainer.style.width = proxy.viewerContainer.clientWidth + 'px';
            if (proxy.viewerContainer.clientWidth === 0) {
                proxy.pageContainer.style.width = proxy.pdfViewer.element.style.width;
            }
            if (proxy.pdfViewer.toolbarModule) {
                // tslint:disable-next-line:max-line-length
                proxy.pdfViewer.toolbarModule.onToolbarResize((proxy.navigationPane.sideBarToolbar ? proxy.navigationPane.getViewerMainContainerWidth() : proxy.pdfViewer.element.clientWidth));
            }
            if (_this.pdfViewer.enableToolbar && _this.pdfViewer.thumbnailViewModule) {
                proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
            }
            if (proxy.pdfViewer.textSearchModule && !Browser.isDevice) {
                proxy.pdfViewer.textSearchModule.textSearchBoxOnResize();
            }
            if (viewerWidth !== 0) {
                if (!proxy.navigationPane.isBookmarkListOpen) {
                    proxy.updateZoomValue();
                }
            }
            if (Browser.isDevice) {
                proxy.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(proxy.mobileScrollerContainer.style.width)) + 'px';
                proxy.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(proxy.mobilePageNoContainer.style.width) / 2) + 'px';
                proxy.mobilePageNoContainer.style.top = (proxy.pdfViewer.element.clientHeight / 2) + 'px';
                proxy.updateMobileScrollerPosition();
            }
            else {
                proxy.navigationPane.setResizeIconTop();
                proxy.navigationPane.setCommentPanelResizeIconTop();
                if (event && event.type === 'resize') {
                    proxy.signatureModule.updateCanvasSize();
                }
            }
        };
        this.viewerContainerOnMousedown = function (event) {
            _this.isFreeTextContextMenu = false;
            var isUpdate = false;
            _this.isSelection = true;
            if (event.button === 0 && !_this.getPopupNoteVisibleStatus() && !_this.isClickedOnScrollBar(event, false)) {
                _this.isViewerMouseDown = true;
                // tslint:disable-next-line
                var target = event.target;
                if (event.detail === 1 && target.className !== 'e-pdfviewer-formFields' && target.className !== 'free-text-input') {
                    isUpdate = true;
                    _this.focusViewerContainer();
                }
                _this.scrollPosition = _this.viewerContainer.scrollTop / _this.getZoomFactor();
                _this.mouseX = event.clientX;
                _this.mouseY = event.clientY;
                // tslint:disable-next-line
                var isIE = !!document.documentMode;
                if (_this.pdfViewer.textSelectionModule && !_this.isClickedOnScrollBar(event, true) && !_this.isTextSelectionDisabled) {
                    if (!isIE && target.className !== 'e-pdfviewer-formFields' && target.className !== 'e-pdfviewer-ListBox') {
                        event.preventDefault();
                    }
                    if (target.className !== 'e-pv-droplet') {
                        _this.pdfViewer.textSelectionModule.clearTextSelection();
                    }
                }
            }
            if (_this.isClickedOnScrollBar(event, false)) {
                _this.isViewerMouseDown = true;
            }
            if (_this.isPanMode) {
                _this.dragX = event.pageX;
                _this.dragY = event.pageY;
                // tslint:disable-next-line:max-line-length
                if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer) && _this.isPanMode) {
                    _this.viewerContainer.style.cursor = 'grabbing';
                }
            }
            if (_this.isShapeBasedAnnotationsEnabled()) {
                _this.diagramMouseDown(event);
            }
            if (_this.pdfViewer.annotation && _this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
                if (!isUpdate) {
                    _this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isEditableElement = false;
                    _this.updateCommentPanel();
                    isUpdate = true;
                }
            }
        };
        this.viewerContainerOnMouseup = function (event) {
            if (!_this.getPopupNoteVisibleStatus()) {
                if (_this.isViewerMouseDown) {
                    if (_this.scrollHoldTimer) {
                        clearTimeout(_this.scrollHoldTimer);
                        _this.scrollHoldTimer = null;
                    }
                    if ((_this.scrollPosition * _this.getZoomFactor()) !== _this.viewerContainer.scrollTop) {
                        _this.pageViewScrollChanged(_this.currentPageNumber);
                    }
                }
                if (_this.isShapeBasedAnnotationsEnabled()) {
                    _this.diagramMouseUp(event);
                    _this.pdfViewer.annotation.onAnnotationMouseUp();
                }
                _this.isSelection = false;
                // tslint:disable-next-line:max-line-length
                var commentElement = document.getElementById(_this.pdfViewer.element.id + '_commantPanel');
                if (commentElement && commentElement.style.display === 'block') {
                    if (_this.pdfViewer.selectedItems) {
                        if (_this.pdfViewer.selectedItems.annotations.length !== 0) {
                            // tslint:disable-next-line
                            var accordionExpand = document.getElementById(_this.pdfViewer.element.id + '_accordionContainer' + _this.pdfViewer.currentPageNumber);
                            if (accordionExpand) {
                                accordionExpand.ej2_instances[0].expandItem(true);
                            }
                            // tslint:disable-next-line
                            var commentsDiv = document.getElementById(_this.pdfViewer.selectedItems.annotations[0].annotName);
                            if (commentsDiv) {
                                if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                    commentsDiv.firstChild.click();
                                }
                            }
                        }
                    }
                }
                if (event.button === 0 && !_this.isClickedOnScrollBar(event, false)) {
                    // 0 is for left button.
                    var eventTarget = event.target;
                    var offsetX = event.clientX;
                    var offsetY = event.clientY;
                    var zoomFactor = _this.getZoomFactor();
                    var pageIndex = _this.currentPageNumber;
                    if (eventTarget) {
                        // tslint:disable-next-line
                        var pageString = eventTarget.id.split('_text_')[1] || eventTarget.id.split('_textLayer_')[1] || eventTarget.id.split('_annotationCanvas_')[1] || eventTarget.id.split('_pageDiv_')[1];
                        // tslint:disable-next-line
                        pageIndex = parseInt(pageString);
                    }
                    var pageDiv = _this.getElement('_pageDiv_' + pageIndex);
                    if (pageDiv) {
                        var pageCurrentRect = pageDiv.getBoundingClientRect();
                        offsetX = (event.clientX - pageCurrentRect.left) / zoomFactor;
                        offsetY = (event.clientY - pageCurrentRect.top) / zoomFactor;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (eventTarget && eventTarget.classList && !eventTarget.classList.contains('e-pv-hyperlink') && !eventTarget.classList.contains('e-pv-page-container')) {
                        // tslint:disable-next-line
                        _this.pdfViewer.firePageClick(offsetX, offsetY, pageIndex + 1);
                    }
                    if (_this.isTextMarkupAnnotationModule() && !_this.isToolbarInkClicked) {
                        _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseUp(event);
                    }
                    // tslint:disable-next-line:max-line-length
                    if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer) && _this.isPanMode) {
                        _this.viewerContainer.style.cursor = 'move';
                        _this.viewerContainer.style.cursor = '-webkit-grab';
                        _this.viewerContainer.style.cursor = '-moz-grab';
                        _this.viewerContainer.style.cursor = 'grab';
                    }
                }
                _this.isViewerMouseDown = false;
            }
        };
        this.viewerContainerOnMouseWheel = function (event) {
            _this.isViewerMouseWheel = true;
            if (_this.getRerenderCanvasCreated()) {
                event.preventDefault();
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.pageRerenderOnMouseWheel();
                if (event.ctrlKey) {
                    event.preventDefault();
                }
                _this.pdfViewer.magnificationModule.fitPageScrollMouseWheel(event);
            }
            if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                if (_this.isViewerMouseDown) {
                    if (!event.target.classList.contains('e-pv-text')) {
                        _this.pdfViewer.textSelectionModule.textSelectionOnMouseWheel(_this.currentPageNumber - 1);
                    }
                }
            }
        };
        this.viewerContainerOnKeyDown = function (event) {
            var isMac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
            var isCommandKey = isMac ? event.metaKey : false;
            if ((_this.isFreeTextAnnotationModule() && _this.pdfViewer.annotationModule
                && (_this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === true
                    || _this.pdfViewer.annotationModule.inputElementModule.isInFocus === true))) {
                return;
            }
            if (event.ctrlKey || isCommandKey) {
                // add keycodes if shift key is used.
                if ((event.shiftKey && !isMac) || (isMac && !event.shiftKey)) {
                    switch (event.keyCode) {
                        case 38: // up arrow
                        case 33: // page up
                            event.preventDefault();
                            if (_this.currentPageNumber !== 1) {
                                _this.updateScrollTop(0);
                            }
                            break;
                        case 40: // down arrow
                        case 34: // page down
                            event.preventDefault();
                            if (_this.currentPageNumber !== _this.pageCount) {
                                _this.updateScrollTop(_this.pageCount - 1);
                            }
                            break;
                        default:
                            break;
                    }
                }
                switch (event.keyCode) {
                    case 79: // o key
                        if (_this.pdfViewer.toolbarModule && _this.pdfViewer.enableToolbar) {
                            _this.pdfViewer.toolbarModule.openFileDialogBox(event);
                        }
                        break;
                    case 67: // c key
                        if (_this.pdfViewer.textSelectionModule && _this.pdfViewer.enableTextSelection && !_this.isTextSelectionDisabled) {
                            event.preventDefault();
                            _this.pdfViewer.textSelectionModule.copyText();
                        }
                        if (_this.pdfViewer.selectedItems.annotations.length) {
                            _this.pdfViewer.copy();
                        }
                        break;
                    case 70: // f key
                        if (_this.pdfViewer.textSearchModule && _this.pdfViewer.enableTextSearch) {
                            event.preventDefault();
                            _this.pdfViewer.toolbarModule.textSearchButtonHandler();
                        }
                        break;
                    case 80: // p key
                        if (_this.pdfViewer.printModule && _this.pdfViewer.enablePrint) {
                            event.preventDefault();
                            _this.pdfViewer.print.print();
                        }
                        break;
                    case 90: //z key
                        if (_this.pdfViewer.annotationModule) {
                            _this.pdfViewer.annotationModule.undo();
                        }
                        break;
                    case 88: //x key
                        if (_this.pdfViewer.selectedItems.annotations.length) {
                            _this.pdfViewer.cut();
                            _this.pdfViewer.clearSelection(_this.pdfViewer.selectedItems.annotations[0].pageIndex);
                        }
                        break;
                    case 89: //y key
                        if (_this.pdfViewer.annotationModule) {
                            _this.pdfViewer.annotationModule.redo();
                        }
                        break;
                    case 86: //v key
                        if (_this.pdfViewer.annotation && _this.pdfViewer.annotation.isShapeCopied) {
                            _this.pdfViewer.paste();
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (event.keyCode) {
                    case 46:
                        if (_this.pdfViewer.annotation) {
                            if (_this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                                _this.pdfViewer.annotationModule.deleteAnnotation();
                            }
                            if (_this.pdfViewer.selectedItems.annotations.length > 0) {
                                // tslint:disable-next-line
                                var annotation = _this.pdfViewer.selectedItems.annotations[0];
                                if (annotation.annotationSettings && annotation.annotationSettings.isLock) {
                                    if (_this.pdfViewer.annotationModule.checkAllowedInteractions('Delete', annotation)) {
                                        _this.pdfViewer.remove(annotation);
                                        _this.pdfViewer.renderSelector(_this.pdfViewer.annotation.getEventPageNumber(event));
                                    }
                                }
                                else {
                                    _this.pdfViewer.remove(annotation);
                                    _this.pdfViewer.renderSelector(_this.pdfViewer.annotation.getEventPageNumber(event));
                                }
                            }
                        }
                        break;
                    case 27:
                        if (_this.pdfViewer.annotationModule && _this.pdfViewer.annotationModule.inkAnnotationModule) {
                            // tslint:disable-next-line
                            var currentPageNumber = parseInt(_this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
                            _this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
                        }
                        if (_this.pdfViewer.toolbar && _this.pdfViewer.toolbar.annotationToolbarModule) {
                            _this.pdfViewer.toolbar.annotationToolbarModule.deselectInkAnnotation();
                        }
                }
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.magnifyBehaviorKeyDown(event);
            }
        };
        this.viewerContainerOnMousemove = function (event) {
            _this.mouseX = event.clientX;
            _this.mouseY = event.clientY;
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            var target = event.target;
            if (_this.action === 'Drag') {
                event.preventDefault();
            }
            // tslint:disable-next-line:max-line-length
            if (_this.isViewerMouseDown && !(_this.action === 'Perimeter' || _this.action === 'Polygon' || _this.action === 'Line' || _this.action === 'DrawTool' || _this.action === 'Distance')) {
                // tslint:disable-next-line:max-line-length
                if (_this.pdfViewer.textSelectionModule && _this.pdfViewer.enableTextSelection && !_this.isTextSelectionDisabled && !_this.getPopupNoteVisibleStatus()) {
                    // text selection won't perform if we start the selection from hyperlink content by commenting this line.
                    // this region block the toc/hyperlink navigation on sometimes.
                    // if ((event.target as HTMLElement).classList.contains('e-pv-hyperlink') && this.pdfViewer.linkAnnotationModule) {
                    // this.pdfViewer.linkAnnotationModule.modifyZindexForHyperlink((event.target as HTMLElement), true);
                    // }
                    if (!isIE) {
                        event.preventDefault();
                        _this.mouseX = event.clientX;
                        _this.mouseY = event.clientY;
                        // tslint:disable-next-line
                        var annotationModule = _this.pdfViewer.annotationModule;
                        // tslint:disable-next-line:max-line-length
                        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isDropletClicked && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                            annotationModule.textMarkupAnnotationModule.textSelect(event.target, _this.mouseX, _this.mouseY);
                        }
                        else {
                            _this.pdfViewer.textSelectionModule.textSelectionOnMouseMove(event.target, _this.mouseX, _this.mouseY);
                        }
                    }
                    else {
                        var selection = window.getSelection();
                        if (!selection.type && !selection.isCollapsed && selection.anchorNode !== null) {
                            _this.pdfViewer.textSelectionModule.isTextSelection = true;
                        }
                    }
                }
                else if (_this.skipPreventDefault(target)) {
                    event.preventDefault();
                }
            }
            if (_this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationMouseMove(event);
            }
            if (_this.isPanMode) {
                _this.panOnMouseMove(event);
            }
            if (_this.isShapeBasedAnnotationsEnabled()) {
                var canvas = void 0;
                // tslint:disable-next-line:max-line-length
                if (event.target && (event.target.id.indexOf('_text') > -1 || event.target.id.indexOf('_annotationCanvas') > -1 || event.target.classList.contains('e-pv-hyperlink')) && _this.pdfViewer.annotation) {
                    var pageIndex = _this.pdfViewer.annotation.getEventPageNumber(event);
                    var diagram = document.getElementById(_this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                    if (diagram) {
                        var canvas1 = diagram.getBoundingClientRect();
                        var left = canvas1.x ? canvas1.x : canvas1.left;
                        var top_1 = canvas1.y ? canvas1.y : canvas1.top;
                        canvas = new Rect(left + 10, top_1 + 10, canvas1.width - 10, canvas1.height - 10);
                    }
                }
                var stampModule = _this.pdfViewer.annotationModule.stampAnnotationModule;
                if (canvas && canvas.containsPoint({ x: _this.mouseX, y: _this.mouseY }) && !stampModule.isStampAnnotSelected) {
                    _this.diagramMouseMove(event);
                    _this.annotationEvent = event;
                }
                else {
                    _this.diagramMouseLeave(event);
                    if (_this.isAnnotationDrawn) {
                        _this.diagramMouseUp(event);
                        _this.isAnnotationAdded = true;
                    }
                }
                if (_this.pdfViewer.enableStampAnnotations) {
                    if (stampModule && stampModule.isStampAnnotSelected) {
                        _this.pdfViewer.tool = 'Stamp';
                        _this.tool = new StampTool(_this.pdfViewer, _this);
                        _this.isMouseDown = true;
                        stampModule.isStampAnnotSelected = false;
                        stampModule.isNewStampAnnot = true;
                    }
                }
                if (_this.isSignatureAdded && _this.pdfViewer.enableHandwrittenSignature) {
                    _this.pdfViewer.tool = 'Stamp';
                    _this.tool = new StampTool(_this.pdfViewer, _this);
                    _this.isMouseDown = true;
                    _this.isSignatureAdded = false;
                    _this.isNewSignatureAdded = true;
                }
            }
        };
        this.panOnMouseMove = function (event) {
            var isStampMode = false;
            // tslint:disable-next-line:max-line-length
            if (_this.action === 'Drag' || _this.action.indexOf('Rotate') !== -1 || _this.action.indexOf('Resize') !== -1) {
                isStampMode = true;
            }
            // tslint:disable-next-line:max-line-length
            if (_this.viewerContainer.contains(event.target) && (event.target !== _this.viewerContainer) && (event.target !== _this.pageContainer) && !isStampMode) {
                if (_this.isViewerMouseDown) {
                    var deltaX = _this.dragX - event.pageX;
                    var deltaY = _this.dragY - event.pageY;
                    _this.viewerContainer.scrollTop = _this.viewerContainer.scrollTop + deltaY;
                    _this.viewerContainer.scrollLeft = _this.viewerContainer.scrollLeft + deltaX;
                    _this.viewerContainer.style.cursor = 'move';
                    _this.viewerContainer.style.cursor = '-webkit-grabbing';
                    _this.viewerContainer.style.cursor = '-moz-grabbing';
                    _this.viewerContainer.style.cursor = 'grabbing';
                    _this.dragX = event.pageX;
                    _this.dragY = event.pageY;
                }
                else {
                    if (!_this.navigationPane.isNavigationPaneResized) {
                        _this.viewerContainer.style.cursor = 'move';
                        _this.viewerContainer.style.cursor = '-webkit-grab';
                        _this.viewerContainer.style.cursor = '-moz-grab';
                        _this.viewerContainer.style.cursor = 'grab';
                    }
                }
            }
            else {
                if (!_this.navigationPane.isNavigationPaneResized) {
                    _this.viewerContainer.style.cursor = 'auto';
                }
            }
        };
        this.viewerContainerOnMouseLeave = function (event) {
            if (_this.isViewerMouseDown) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
                    _this.pdfViewer.textSelectionModule.textSelectionOnMouseLeave(event);
                }
            }
        };
        this.viewerContainerOnMouseEnter = function (event) {
            if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                _this.pdfViewer.textSelectionModule.clear();
            }
        };
        this.viewerContainerOnMouseOver = function (event) {
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            if (_this.isViewerMouseDown) {
                if (!isIE) {
                    event.preventDefault();
                }
            }
        };
        this.viewerContainerOnClick = function (event) {
            if (event.type === 'dblclick') {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getCurrentTextMarkupAnnotation()) {
                    if (event.target.classList.contains('e-pv-text')) {
                        _this.isViewerContainerDoubleClick = true;
                        if (!_this.getTextMarkupAnnotationMode()) {
                            var pageNumber = parseFloat(event.target.id.split('_')[2]);
                            _this.pdfViewer.fireTextSelectionStart(pageNumber + 1);
                        }
                        _this.pdfViewer.textSelectionModule.selectAWord(event.target, event.clientX, event.clientY, false);
                        if (_this.pdfViewer.contextMenuSettings.contextMenuAction === 'MouseUp') {
                            _this.pdfViewer.textSelectionModule.calculateContextMenuPosition(event.clientY, event.clientX);
                        }
                        if (!_this.getTextMarkupAnnotationMode()) {
                            _this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                            _this.dblClickTimer = setTimeout(function () { _this.applySelection(); }, 100);
                            _this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                        }
                        else if (_this.isTextMarkupAnnotationModule() && _this.getTextMarkupAnnotationMode()) {
                            // tslint:disable-next-line:max-line-length
                            _this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(_this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                        }
                    }
                }
                else if (_this.getCurrentTextMarkupAnnotation()) {
                    // this.pdfViewer.annotationModule.showAnnotationPopup(event);
                }
                if (_this.action && (_this.action === 'Perimeter' || _this.action === 'Polygon') && _this.tool) {
                    _this.eventArgs.position = _this.currentPosition;
                    _this.getMouseEventArgs(_this.currentPosition, _this.eventArgs, event, _this.eventArgs.source);
                    var ctrlKey = _this.isMetaKey(event);
                    var info = { ctrlKey: event.ctrlKey, shiftKey: event.shiftKey };
                    _this.eventArgs.info = info;
                    _this.eventArgs.clickCount = event.detail;
                    _this.tool.mouseUp(_this.eventArgs, true);
                }
                if (_this.pdfViewer.selectedItems ||
                    (_this.pdfViewer.annotation && _this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation)) {
                    if (_this.pdfViewer.selectedItems.annotations.length !== 0) {
                        // tslint:disable-next-line
                        var currentAnnotation = _this.pdfViewer.selectedItems.annotations[0];
                        // tslint:disable-next-line:max-line-length
                        _this.pdfViewer.annotationModule.annotationSelect(currentAnnotation.annotName, currentAnnotation.pageIndex, currentAnnotation, null, true);
                        if (_this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus === false) {
                            if (_this.isFreeTextAnnotation(_this.pdfViewer.selectedItems.annotations) === true) {
                                var elmtPosition = {};
                                elmtPosition.x = _this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = _this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                // tslint:disable-next-line:max-line-length
                                _this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, _this.pdfViewer.selectedItems.annotations[0]);
                            }
                            else if (_this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                                var elmtPosition = {};
                                elmtPosition.x = _this.pdfViewer.selectedItems.annotations[0].bounds.x;
                                elmtPosition.y = _this.pdfViewer.selectedItems.annotations[0].bounds.y;
                                // tslint:disable-next-line:max-line-length
                                _this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, _this.pdfViewer.selectedItems.annotations[0]);
                            }
                            else {
                                // tslint:disable-next-line
                                var accordionExpand = document.getElementById(_this.pdfViewer.element.id + '_accordionContainer' + _this.pdfViewer.currentPageNumber);
                                if (accordionExpand) {
                                    accordionExpand.ej2_instances[0].expandItem(true);
                                }
                                // tslint:disable-next-line
                                var commentsDiv = document.getElementById(_this.pdfViewer.selectedItems.annotations[0].annotName);
                                if (commentsDiv) {
                                    if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                        commentsDiv.firstChild.click();
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // tslint:disable-next-line:max-line-length
                        if (_this.pdfViewer.annotation && _this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            // tslint:disable-next-line
                            var annotation = _this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                            // tslint:disable-next-line:max-line-length
                            _this.pdfViewer.annotationModule.annotationSelect(annotation.annotName, _this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage, annotation, null, true);
                            // tslint:disable-next-line
                            var accordionExpand = document.getElementById(_this.pdfViewer.element.id + '_accordionContainer' + _this.currentPageNumber);
                            if (accordionExpand) {
                                accordionExpand.ej2_instances[0].expandItem(true);
                            }
                            // tslint:disable-next-line
                            var comments = document.getElementById(annotation.annotName);
                            if (comments) {
                                comments.firstChild.click();
                            }
                        }
                    }
                }
            }
            else {
                if (event.detail === 3) {
                    if (_this.isViewerContainerDoubleClick) {
                        clearTimeout(_this.dblClickTimer);
                        _this.isViewerContainerDoubleClick = false;
                    }
                    if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
                        _this.pdfViewer.textSelectionModule.selectEntireLine(event);
                        _this.pdfViewer.textSelectionModule.maintainSelectionOnZoom(true, false);
                        _this.pdfViewer.textSelectionModule.fireTextSelectEnd();
                        _this.applySelection();
                    }
                }
            }
        };
        this.viewerContainerOnDragStart = function (event) {
            // tslint:disable-next-line
            var isIE = !!document.documentMode;
            if (!isIE) {
                event.preventDefault();
            }
        };
        // tslint:disable-next-line
        this.viewerContainerOnContextMenuClick = function (event) {
            _this.isViewerMouseDown = false;
        };
        // tslint:disable-next-line
        this.onWindowMouseUp = function (event) {
            _this.isFreeTextContextMenu = false;
            _this.isNewStamp = false;
            _this.signatureAdded = false;
            // tslint:disable-next-line
            var annotationModule = _this.pdfViewer.annotationModule;
            // tslint:disable-next-line:max-line-length
            if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
                // tslint:disable-next-line
                var modules = annotationModule.textMarkupAnnotationModule;
                modules.isLeftDropletClicked = false;
                modules.isDropletClicked = false;
                modules.isRightDropletClicked = false;
                if (!modules.currentTextMarkupAnnotation && window.getSelection().anchorNode === null) {
                    modules.showHideDropletDiv(true);
                }
                else if (!modules.currentTextMarkupAnnotation && modules.currentTextMarkupAddMode === '') {
                    modules.isTextMarkupAnnotationMode = false;
                }
            }
            if (!_this.getPopupNoteVisibleStatus()) {
                if (event.button === 0) {
                    // tslint:disable-next-line:max-line-length
                    if (_this.isNewFreeTextAnnotation()) {
                        if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled && !_this.getTextMarkupAnnotationMode()) {
                            // tslint:disable-next-line:max-line-length
                            if (event.detail === 1 && !_this.viewerContainer.contains(event.target) && !_this.contextMenuModule.contextMenuElement.contains(event.target)) {
                                if (window.getSelection().anchorNode !== null) {
                                    _this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                                }
                            }
                            // tslint:disable-next-line
                            var target = event.target;
                            if (_this.viewerContainer.contains(event.target) && target.className !== 'e-pdfviewer-formFields') {
                                if (!_this.isClickedOnScrollBar(event, true) && !_this.isScrollbarMouseDown) {
                                    _this.pdfViewer.textSelectionModule.textSelectionOnMouseup(event);
                                }
                                else {
                                    if (window.getSelection().anchorNode !== null) {
                                        _this.pdfViewer.textSelectionModule.applySpanForSelection();
                                    }
                                }
                            }
                        }
                        else if (_this.getTextMarkupAnnotationMode()) {
                            // tslint:disable-next-line
                            var viewerElement = _this.pdfViewer.element;
                            // tslint:disable-next-line
                            var targetElement = event.target;
                            if (viewerElement && targetElement) {
                                if (viewerElement.id.split('_')[0] === targetElement.id.split('_')[0]) {
                                    // tslint:disable-next-line:max-line-length
                                    _this.pdfViewer.annotationModule.textMarkupAnnotationModule.drawTextMarkupAnnotations(_this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode);
                                }
                            }
                        }
                    }
                }
                else if (event.button === 2) {
                    if (_this.viewerContainer.contains(event.target) && _this.skipPreventDefault(event.target)) {
                        if (_this.checkIsNormalText()) {
                            window.getSelection().removeAllRanges();
                        }
                    }
                }
                if (_this.isViewerMouseDown) {
                    _this.isViewerMouseDown = false;
                    if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                        _this.pdfViewer.textSelectionModule.clear();
                        _this.pdfViewer.textSelectionModule.selectionStartPage = null;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                else {
                    return true;
                }
            }
        };
        this.onWindowTouchEnd = function (event) {
            _this.signatureAdded = false;
            // tslint:disable-next-line:max-line-length
            if (!_this.pdfViewer.element.contains(event.target) && !_this.contextMenuModule.contextMenuElement.contains(event.target)) {
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.clearTextSelection();
                }
            }
        };
        this.viewerContainerOnTouchStart = function (event) {
            var touchPoints = event.touches;
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.setTouchPoints(touchPoints[0].clientX, touchPoints[0].clientY);
            }
            var target = event.target;
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(target.classList.contains('e-pv-hyperlink')) && _this.skipPreventDefault(target)) {
                _this.preventTouchEvent(event);
            }
            if (event.touches.length === 1 && _this.isTextMarkupAnnotationModule() && !_this.getPopupNoteVisibleStatus()) {
                _this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
            _this.touchClientX = touchPoints[0].clientX;
            _this.touchClientY = touchPoints[0].clientY;
            _this.scrollY = touchPoints[0].clientY;
            _this.previousTime = new Date().getTime();
            // tslint:disable-next-line:max-line-length
            if (touchPoints.length === 1 && !(event.target.classList.contains('e-pv-touch-select-drop') || event.target.classList.contains('e-pv-touch-ellipse'))) {
                if (Browser.isDevice && _this.pageCount > 0 && !_this.isThumb && !(event.target.classList.contains('e-pv-hyperlink'))) {
                    _this.handleTaps(touchPoints);
                }
                else if (!Browser.isDevice) {
                    _this.handleTextBoxTaps(touchPoints);
                }
                if (_this.pdfViewer.textSelectionModule && !_this.isTextSelectionDisabled) {
                    _this.pdfViewer.textSelectionModule.clearTextSelection();
                    _this.contextMenuModule.contextMenuObj.close();
                    // event.preventDefault();
                    if (!_this.isLongTouchPropagated) {
                        _this.longTouchTimer = setTimeout(function () { _this.viewerContainerOnLongTouch(event); }, 1000);
                    }
                    _this.isLongTouchPropagated = true;
                }
            }
            _this.diagramMouseDown(event);
            // tslint:disable-next-line:max-line-length
            if (_this.action === 'Drag' || _this.action.indexOf('Rotate') !== -1 || _this.action.indexOf('Resize') !== -1) {
                event.preventDefault();
            }
        };
        this.viewerContainerOnLongTouch = function (event) {
            _this.touchClientX = event.touches[0].clientX;
            _this.touchClientY = event.touches[0].clientY;
            event.preventDefault();
            if (_this.pdfViewer.textSelectionModule) {
                _this.pdfViewer.textSelectionModule.initiateTouchSelection(event, _this.touchClientX, _this.touchClientY);
                if (Browser.isDevice) {
                    clearTimeout(_this.singleTapTimer);
                    _this.tapCount = 0;
                }
            }
        };
        this.viewerContainerOnPointerDown = function (event) {
            if (event.pointerType === 'touch') {
                _this.pointerCount++;
                if (_this.pointerCount <= 2) {
                    event.preventDefault();
                    _this.pointersForTouch.push(event);
                    if (_this.pointerCount === 2) {
                        _this.pointerCount = 0;
                    }
                    if (_this.pdfViewer.magnificationModule) {
                        _this.pdfViewer.magnificationModule.setTouchPoints(event.clientX, event.clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchMove = function (event) {
            if (Browser.isDevice) {
                clearTimeout(_this.singleTapTimer);
                _this.tapCount = 0;
            }
            _this.preventTouchEvent(event);
            var touchPoints = event.touches;
            if (_this.pdfViewer.magnificationModule) {
                _this.isTouchScrolled = true;
                if (touchPoints.length > 1 && _this.pageCount > 0) {
                    if (Browser.isDevice) {
                        _this.isTouchScrolled = false;
                    }
                    if (_this.pdfViewer.enablePinchZoom) {
                        // tslint:disable-next-line:max-line-length
                        _this.pdfViewer.magnificationModule.initiatePinchMove(touchPoints[0].clientX, touchPoints[0].clientY, touchPoints[1].clientX, touchPoints[1].clientY);
                    }
                }
                else if (touchPoints.length === 1 && _this.getPagesPinchZoomed()) {
                    if (Browser.isDevice) {
                        _this.isTouchScrolled = false;
                    }
                    _this.pdfViewer.magnificationModule.pinchMoveScroll();
                }
            }
            _this.mouseX = touchPoints[0].clientX;
            _this.mouseY = touchPoints[0].clientY;
            var canvas;
            // tslint:disable-next-line:max-line-length
            if (event.target && (event.target.id.indexOf('_text') > -1 || event.target.id.indexOf('_annotationCanvas') > -1 || event.target.classList.contains('e-pv-hyperlink')) && _this.pdfViewer.annotation) {
                var pageIndex = _this.pdfViewer.annotation.getEventPageNumber(event);
                var diagram = document.getElementById(_this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                if (diagram) {
                    var canvas1 = diagram.getBoundingClientRect();
                    var left = canvas1.x ? canvas1.x : canvas1.left;
                    var top_2 = canvas1.y ? canvas1.y : canvas1.top;
                    canvas = new Rect(left + 10, top_2 + 10, canvas1.width - 10, canvas1.height - 10);
                }
            }
            if (canvas && canvas.containsPoint({ x: _this.mouseX, y: _this.mouseY })) {
                _this.diagramMouseMove(event);
                _this.annotationEvent = event;
            }
            else {
                _this.diagramMouseLeave(event);
                if (_this.isAnnotationDrawn) {
                    _this.diagramMouseUp(event);
                    _this.isAnnotationAdded = true;
                }
            }
            touchPoints = null;
        };
        this.viewerContainerOnPointerMove = function (event) {
            if (event.pointerType === 'touch' && _this.pageCount > 0) {
                event.preventDefault();
                if (_this.pointersForTouch.length === 2) {
                    for (var i = 0; i < _this.pointersForTouch.length; i++) {
                        if (event.pointerId === _this.pointersForTouch[i].pointerId) {
                            _this.pointersForTouch[i] = event;
                            break;
                        }
                    }
                    if (_this.pdfViewer.magnificationModule && _this.pdfViewer.enablePinchZoom) {
                        // tslint:disable-next-line:max-line-length
                        _this.pdfViewer.magnificationModule.initiatePinchMove(_this.pointersForTouch[0].clientX, _this.pointersForTouch[0].clientY, _this.pointersForTouch[1].clientX, _this.pointersForTouch[1].clientY);
                    }
                }
            }
        };
        this.viewerContainerOnTouchEnd = function (event) {
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.pinchMoveEnd();
            }
            _this.isLongTouchPropagated = false;
            clearInterval(_this.longTouchTimer);
            _this.longTouchTimer = null;
            if (Browser.isDevice && _this.isTouchScrolled) {
                _this.currentTime = new Date().getTime();
                var duration = _this.currentTime - _this.previousTime;
                // tslint:disable-next-line
                var difference = _this.scrollY - event.changedTouches[0].pageY;
                // tslint:disable-next-line
                var speed = (difference) / (duration);
                if (Math.abs(speed) > 1.5) {
                    // tslint:disable-next-line
                    var scrollTop = (difference) + ((duration) * speed);
                    _this.viewerContainer.scrollTop += scrollTop;
                    _this.updateMobileScrollerPosition();
                }
            }
            _this.diagramMouseUp(event);
            _this.renderStampAnnotation(event);
        };
        this.viewerContainerOnPointerEnd = function (event) {
            if (event.pointerType === 'touch') {
                event.preventDefault();
                if (_this.pdfViewer.magnificationModule) {
                    _this.pdfViewer.magnificationModule.pinchMoveEnd();
                }
                _this.pointersForTouch = [];
                _this.pointerCount = 0;
            }
        };
        // tslint:disable-next-line
        this.viewerContainerOnScroll = function (event) {
            var proxy = _this;
            var scrollposX = 0;
            var scrollposY = 0;
            if (event.touches && Browser.isDevice) {
                // tslint:disable-next-line
                var ratio = (_this.viewerContainer.scrollHeight - _this.viewerContainer.clientHeight) / (_this.viewerContainer.clientHeight - _this.toolbarHeight);
                if (_this.isThumb) {
                    _this.ispageMoved = true;
                    event.preventDefault();
                    _this.mobilePageNoContainer.style.display = 'block';
                    scrollposX = event.touches[0].pageX - _this.scrollX;
                    scrollposY = event.touches[0].pageY - _this.viewerContainer.offsetTop;
                    _this.viewerContainer.scrollTop = scrollposY * ratio;
                    // tslint:disable-next-line
                    var containerValue = event.touches[0].pageY;
                    // tslint:disable-next-line
                    var toolbarHeight = _this.pdfViewer.toolbarModule ? 0 : 50;
                    if (_this.viewerContainer.scrollTop !== 0 && ((containerValue) <= (_this.viewerContainer.clientHeight - toolbarHeight))) {
                        _this.mobileScrollerContainer.style.top = containerValue + 'px';
                    }
                }
                else if (event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                    if (!(_this.isWebkitMobile && Browser.isDevice)) {
                        _this.mobilePageNoContainer.style.display = 'none';
                        scrollposY = _this.touchClientY - event.touches[0].pageY;
                        scrollposX = _this.touchClientX - event.touches[0].pageX;
                        _this.viewerContainer.scrollTop = _this.viewerContainer.scrollTop + (scrollposY);
                        _this.viewerContainer.scrollLeft = _this.viewerContainer.scrollLeft + (scrollposX);
                    }
                    // tslint:disable-next-line
                    _this.updateMobileScrollerPosition();
                    _this.touchClientY = event.touches[0].pageY;
                    _this.touchClientX = event.touches[0].pageX;
                }
            }
            if (_this.scrollHoldTimer) {
                clearTimeout(_this.scrollHoldTimer);
            }
            var pageIndex = _this.currentPageNumber;
            _this.scrollHoldTimer = null;
            _this.contextMenuModule.contextMenuObj.close();
            var verticalScrollValue = _this.viewerContainer.scrollTop;
            // tslint:disable-next-line:max-line-length
            for (var i = 0; i < _this.pageCount; i++) {
                if (_this.pageSize[i] != null) {
                    var pageHeight = _this.getPageHeight(i);
                    if (pageHeight < 150) {
                        _this.pageStopValue = 100;
                    }
                    else {
                        _this.pageStopValue = 300;
                    }
                    // tslint:disable-next-line:max-line-length
                    if ((verticalScrollValue + _this.pageStopValue) <= (_this.getPageTop(i) + pageHeight)) {
                        _this.currentPageNumber = i + 1;
                        _this.pdfViewer.currentPageNumber = i + 1;
                        break;
                    }
                }
            }
            // tslint:disable-next-line:max-line-length
            if (_this.pdfViewer.magnificationModule && _this.pdfViewer.magnificationModule.fitType === 'fitToPage' && _this.currentPageNumber > 0) {
                _this.viewerContainer.scrollTop = _this.pageSize[_this.currentPageNumber - 1].top * _this.getZoomFactor();
            }
            _this.renderElementsVirtualScroll(_this.currentPageNumber);
            // tslint:disable-next-line:max-line-length
            if (!_this.isViewerMouseDown && !_this.getPinchZoomed() && !_this.getPinchScrolled() && !_this.getPagesPinchZoomed() || _this.isViewerMouseWheel) {
                _this.pageViewScrollChanged(_this.currentPageNumber);
                _this.isViewerMouseWheel = false;
            }
            else {
                _this.showPageLoadingIndicator(_this.currentPageNumber - 1, false);
            }
            if (_this.pdfViewer.toolbarModule) {
                _this.pdfViewer.toolbarModule.updateCurrentPage(_this.currentPageNumber);
                _this.viewerContainer.setAttribute('aria-labelledby', _this.pdfViewer.element.id + '_pageDiv_' + (_this.currentPageNumber - 1));
                if (!Browser.isDevice) {
                    _this.pdfViewer.toolbarModule.updateNavigationButtons();
                }
            }
            if (Browser.isDevice) {
                _this.mobileSpanContainer.innerHTML = _this.currentPageNumber.toString();
                _this.mobilecurrentPageContainer.innerHTML = _this.currentPageNumber.toString();
            }
            if (pageIndex !== _this.currentPageNumber) {
                if (proxy.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
                    proxy.pdfViewer.thumbnailViewModule.gotoThumbnailImage(proxy.currentPageNumber - 1);
                    proxy.pdfViewer.thumbnailViewModule.isThumbnailClicked = false;
                }
                _this.pdfViewer.firePageChange(pageIndex);
            }
            if (_this.pdfViewer.magnificationModule) {
                _this.pdfViewer.magnificationModule.updatePagesForFitPage(_this.currentPageNumber - 1);
            }
            var currentPage = _this.getElement('_pageDiv_' + (_this.currentPageNumber - 1));
            if (currentPage) {
                currentPage.style.visibility = 'visible';
            }
            if (_this.isViewerMouseDown) {
                if (_this.getRerenderCanvasCreated() && !_this.isPanMode) {
                    _this.pdfViewer.magnificationModule.clearIntervalTimer();
                }
                // tslint:disable-next-line
                var data = _this.getStoredData(_this.currentPageNumber);
                if (data) {
                    _this.isDataExits = true;
                    _this.initiatePageViewScrollChanged();
                    _this.isDataExits = false;
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    var timer = _this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll ? _this.pdfViewer.scrollSettings.delayPageRequestTimeOnScroll : 100;
                    _this.scrollHoldTimer = setTimeout(function () { _this.initiatePageViewScrollChanged(); }, timer);
                }
            }
            if (_this.pdfViewer.annotation && _this.navigationPane.commentPanelContainer) {
                _this.pdfViewer.annotation.stickyNotesAnnotationModule.updateCommentPanelScrollTop(_this.currentPageNumber);
            }
            if (Browser.isDevice && event.touches && event.touches[0].target.className !== 'e-pv-touch-ellipse') {
                setTimeout(function () { _this.updateMobileScrollerPosition(); }, 500);
            }
        };
        this.pdfViewer = viewer;
        this.navigationPane = new NavigationPane(this.pdfViewer, this);
        this.textLayer = new TextLayer(this.pdfViewer, this);
        this.signatureModule = new Signature(this.pdfViewer, this);
        // tslint:disable-next-line:max-line-length
        this.isWebkitMobile = /Chrome/.test(navigator.userAgent) || /Google Inc/.test(navigator.vendor) || (navigator.userAgent.indexOf('Safari') !== -1);
    }
    /**
     * @private
     */
    PdfViewerBase.prototype.initializeComponent = function () {
        var element = document.getElementById(this.pdfViewer.element.id);
        if (element) {
            if (Browser.isDevice) {
                this.pdfViewer.element.classList.add('e-pv-mobile-view');
            }
            var controlWidth = '100%';
            var toolbarDiv = void 0;
            // tslint:disable-next-line:max-line-length
            this.viewerMainContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerMainContainer', className: 'e-pv-viewer-main-container' });
            // tslint:disable-next-line:max-line-length
            this.viewerContainer = createElement('div', { id: this.pdfViewer.element.id + '_viewerContainer', className: 'e-pv-viewer-container', attrs: { 'aria-label': 'pdfviewer scroll view' } });
            if (Browser.isDevice) {
                this.createMobilePageNumberContainer();
            }
            this.viewerContainer.tabIndex = 0;
            if (this.pdfViewer.enableRtl) {
                this.viewerContainer.style.direction = 'rtl';
            }
            element.style.touchAction = 'pan-x pan-y';
            this.setMaximumHeight(element);
            // tslint:disable-next-line:max-line-length
            this.mainContainer = createElement('div', { id: this.pdfViewer.element.id + '_mainContainer', className: 'e-pv-main-container' });
            this.mainContainer.appendChild(this.viewerMainContainer);
            element.appendChild(this.mainContainer);
            this.applyViewerHeight(this.mainContainer);
            if (this.pdfViewer.toolbarModule) {
                this.navigationPane.initializeNavigationPane();
                toolbarDiv = this.pdfViewer.toolbarModule.intializeToolbar(controlWidth);
            }
            if (toolbarDiv) {
                // tslint:disable-next-line:max-line-length
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
            }
            else {
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
            }
            // tslint:disable-next-line:max-line-length
            var viewerWidth = this.pdfViewer.element.clientWidth;
            if (!Browser.isDevice) {
                viewerWidth = viewerWidth - (this.navigationPane.sideBarToolbar ? this.navigationPane.getViewerContainerLeft() : 0) -
                    (this.navigationPane.commentPanelContainer ? this.navigationPane.getViewerContainerRight() : 0);
            }
            this.viewerContainer.style.width = viewerWidth + 'px';
            this.viewerMainContainer.appendChild(this.viewerContainer);
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.left = (viewerWidth - parseFloat(this.mobileScrollerContainer.style.width)) + 'px';
                this.mobilePageNoContainer.style.left = (viewerWidth / 2) - (parseFloat(this.mobilePageNoContainer.style.width) / 2) + 'px';
                this.mobilePageNoContainer.style.top = (this.pdfViewer.element.clientHeight / 2) + 'px';
                this.mobilePageNoContainer.style.display = 'none';
                this.mobilePageNoContainer.appendChild(this.mobilecurrentPageContainer);
                this.mobilePageNoContainer.appendChild(this.mobilenumberContainer);
                this.mobilePageNoContainer.appendChild(this.mobiletotalPageContainer);
                this.viewerContainer.appendChild(this.mobilePageNoContainer);
                this.viewerMainContainer.appendChild(this.mobileScrollerContainer);
                this.mobileScrollerContainer.appendChild(this.mobileSpanContainer);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer = createElement('div', { id: this.pdfViewer.element.id + '_pageViewContainer', className: 'e-pv-page-container', attrs: { 'tabindex': '0', 'aria-label': 'pdfviewer Page View' } });
            if (this.pdfViewer.enableRtl) {
                this.pageContainer.style.direction = 'ltr';
            }
            this.viewerContainer.appendChild(this.pageContainer);
            this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
            if (toolbarDiv && this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
                this.pdfViewer.thumbnailViewModule.createThumbnailContainer();
            }
            this.createPrintPopup();
            if (Browser.isDevice) {
                this.createGoToPagePopup();
            }
            var waitingPopup = createElement('div', { id: this.pdfViewer.element.id + '_loadingIndicator' });
            this.viewerContainer.appendChild(waitingPopup);
            createSpinner({ target: waitingPopup, cssClass: 'e-spin-center' });
            this.setLoaderProperties(waitingPopup);
            this.contextMenuModule = new ContextMenu(this.pdfViewer, this);
            this.contextMenuModule.createContextMenu();
            this.wireEvents();
            if (this.pdfViewer.textSearchModule && !Browser.isDevice) {
                this.pdfViewer.textSearchModule.createTextSearchBox();
            }
            if (this.pdfViewer.documentPath) {
                this.pdfViewer.load(this.pdfViewer.documentPath, null);
            }
            if (this.pdfViewer.annotationModule) {
                this.pdfViewer.annotationModule.initializeCollection();
            }
        }
    };
    PdfViewerBase.prototype.createMobilePageNumberContainer = function () {
        // tslint:disable-next-line:max-line-length
        this.mobilePageNoContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilepagenoContainer', className: 'e-pv-mobilepagenoscroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilecurrentPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilecurrentpageContainer', className: 'e-pv-mobilecurrentpage-container' });
        // tslint:disable-next-line:max-line-length
        this.mobilenumberContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiledashedlineContainer', className: 'e-pv-mobiledashedline-container' });
        // tslint:disable-next-line:max-line-length
        this.mobiletotalPageContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobiletotalpageContainer', className: 'e-pv-mobiletotalpage-container' });
        this.mobileScrollerContainer = createElement('div', { id: this.pdfViewer.element.id + '_mobilescrollContainer', className: 'e-pv-mobilescroll-container' });
        // tslint:disable-next-line:max-line-length
        this.mobileSpanContainer = createElement('span', { id: this.pdfViewer.element.id + '_mobilespanContainer', className: 'e-pv-mobilespanscroll-container' });
        this.mobileSpanContainer.innerHTML = '1';
        this.mobilecurrentPageContainer.innerHTML = '1';
        this.mobilenumberContainer.innerHTML = '&#x2015;&#x2015;&#x2015;&#x2015;&#x2015;';
        this.mobileScrollerContainer.style.cssFloat = 'right';
        this.mobileScrollerContainer.style.width = '40px';
        this.mobileScrollerContainer.style.height = '32px';
        this.mobileScrollerContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.width = '120px';
        this.mobilePageNoContainer.style.height = '100px';
        this.mobilePageNoContainer.style.zIndex = '100';
        this.mobilePageNoContainer.style.position = 'fixed';
        this.mobileScrollerContainer.addEventListener('touchstart', this.mobileScrollContainerDown.bind(this));
        this.mobileScrollerContainer.addEventListener('touchend', this.mobileScrollContainerEnd.bind(this));
        this.mobileScrollerContainer.style.display = 'none';
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiatePageRender = function (documentData, password) {
        this.documentId = this.createGUID();
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = 0;
        }
        this.showLoadingIndicator(true);
        this.hashId = ' ';
        this.isFileName = false;
        this.saveDocumentInfo();
        if (this.pdfViewer.interactionMode === 'Pan') {
            this.initiatePanning();
        }
        documentData = this.checkDocumentData(documentData);
        this.setFileName();
        if (!this.pdfViewer.downloadFileName) {
            this.pdfViewer.downloadFileName = this.pdfViewer.fileName;
        }
        var jsonObject = this.constructJsonObject(documentData, password);
        this.createAjaxRequest(jsonObject, documentData, password);
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.mobileScrollContainerDown = function (event) {
        this.ispageMoved = false;
        this.isThumb = true;
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage != null && Browser.isDevice) {
                var pageNumber = this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage = null;
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.clearAnnotationSelection(pageNumber);
                this.pdfViewer.toolbar.showToolbar(true);
            }
        }
        this.mobileScrollerContainer.addEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.relativePosition = function (e) {
        // tslint:disable-next-line
        var currentRect = this.viewerContainer.getBoundingClientRect();
        var left = e.clientX - currentRect.left;
        var top = e.clientY - currentRect.top;
        return { x: left, y: top };
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.setMaximumHeight = function (element) {
        // tslint:disable-next-line
        var currentRect = element.getBoundingClientRect();
        if (!Browser.isDevice || (currentRect && currentRect.height === 0)) {
            element.style.minHeight = '500px';
        }
        this.updateWidth();
        this.updateHeight();
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.applyViewerHeight = function (element) {
        // tslint:disable-next-line
        var currentRect = element.getBoundingClientRect();
        if (Browser.isDevice && currentRect && currentRect.height === 0) {
            element.style.minHeight = '500px';
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateWidth = function () {
        if (this.pdfViewer.width.toString() !== 'auto') {
            // tslint:disable-next-line
            this.pdfViewer.element.style.width = this.pdfViewer.width;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateHeight = function () {
        if (this.pdfViewer.height.toString() !== 'auto') {
            // tslint:disable-next-line
            this.pdfViewer.element.style.height = this.pdfViewer.height;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateViewerContainer = function () {
        var sideBarContentContainer = this.getElement('_sideBarContentContainer');
        if (sideBarContentContainer) {
            this.navigationPane.updateViewerContainerOnClose();
        }
        else {
            this.updateViewerContainerSize();
        }
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.enableToolbar) {
                this.pdfViewer.toolbarModule.toolbar.refreshOverflow();
            }
            if (this.pdfViewer.enableAnnotationToolbar) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.toolbar.refreshOverflow();
            }
        }
    };
    PdfViewerBase.prototype.updateViewerContainerSize = function () {
        // tslint:disable-next-line:max-line-length
        this.viewerContainer.style.width = this.pdfViewer.element.clientWidth + 'px';
        // tslint:disable-next-line:max-line-length
        this.pageContainer.style.width = this.viewerContainer.offsetWidth + 'px';
        this.updateZoomValue();
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.mobileScrollContainerEnd = function (event) {
        if (!this.ispageMoved) {
            this.goToPagePopup.show();
        }
        this.isThumb = false;
        this.ispageMoved = false;
        this.mobileScrollerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll.bind(this), true);
        this.mobilePageNoContainer.style.display = 'none';
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.createAjaxRequest = function (jsonObject, documentData, password) {
        var proxy = this;
        if (this.pdfViewer.serverActionSettings) {
            this.loadRequestHandler = new AjaxHandler(this.pdfViewer);
            this.loadRequestHandler.url = this.pdfViewer.serviceUrl + '/' + this.pdfViewer.serverActionSettings.load;
            this.loadRequestHandler.responseType = 'json';
            this.loadRequestHandler.mode = true;
            // tslint:disable-next-line
            jsonObject['action'] = 'Load';
            // tslint:disable-next-line
            jsonObject['elementId'] = this.pdfViewer.element.id;
            this.loadRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            this.loadRequestHandler.onSuccess = function (result) {
                // tslint:disable-next-line
                var data = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                        }
                        catch (error) {
                            proxy.onControlError(500, data, this.pdfViewer.serverActionSettings.load);
                            data = null;
                        }
                    }
                    if (data) {
                        while (typeof data !== 'object') {
                            data = JSON.parse(data);
                            // tslint:disable-next-line
                            if (typeof parseInt(data) === 'number' && !isNaN(parseInt(data))) {
                                // tslint:disable-next-line
                                data = parseInt(data);
                                break;
                            }
                        }
                        // tslint:disable-next-line
                        if (data.uniqueId === proxy.documentId || (typeof parseInt(data) === 'number' && !isNaN(parseInt(data)))) {
                            proxy.requestSuccess(data, documentData, password);
                        }
                    }
                }
            };
            // tslint:disable-next-line
            this.loadRequestHandler.onFailure = function (result) {
                var statusString = result.status.toString().split('')[0];
                if (statusString === '4') {
                    proxy.openNotificationPopup('Client error');
                }
                else {
                    proxy.openNotificationPopup();
                }
                proxy.showLoadingIndicator(false);
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
            // tslint:disable-next-line
            this.loadRequestHandler.onError = function (result) {
                proxy.openNotificationPopup();
                proxy.showLoadingIndicator(false);
                // tslint:disable-next-line
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.load);
            };
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.openNotificationPopup = function (errorString) {
        if (this.pdfViewer.showNotificationDialog) {
            if (errorString === 'Client error') {
                this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Client error'));
            }
            else {
                this.textLayer.createNotificationPopup(this.pdfViewer.localeObj.getConstant('Server error'));
            }
            this.getElement('_notify').classList.add('e-pv-notification-large-content');
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.requestSuccess = function (data, documentData, password) {
        if (data && data.pageCount !== undefined) {
            this.pageCount = data.pageCount;
            this.pdfViewer.pageCount = data.pageCount;
            this.hashId = data.hashId;
            this.documentLiveCount = data.documentLiveCount;
            this.isAnnotationCollectionRemoved = false;
            this.saveDocumentHashData();
            this.saveFormfieldsData(data);
            this.pageRender(data);
            // tslint:disable-next-line
            var pageData = { pageCount: data.pageCount, pageSizes: data.pageSizes };
            window.sessionStorage.setItem(this.documentId + '_pagedata', JSON.stringify(pageData));
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = '';
                // tslint:disable-next-line
                var toolbarHeight = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
                this.mobileScrollerContainer.style.top = (toolbarHeight) + 'px';
            }
        }
        else {
            this.pageCount = 0;
            this.currentPageNumber = 0;
            if (Browser.isDevice) {
                this.mobileScrollerContainer.style.display = 'none';
            }
            if (data === 4) {
                // 4 is error code for encrypted document.
                this.renderPasswordPopup(documentData, password);
            }
            else if (data === 3) {
                // 3 is error code for corrupted document.
                this.renderCorruptPopup();
            }
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.toolbarModule.updateToolbarItems();
            }
        }
        // tslint:disable-next-line
        var annotationModule = this.pdfViewer.annotationModule;
        // tslint:disable-next-line:max-line-length
        if (annotationModule && annotationModule.textMarkupAnnotationModule && annotationModule.textMarkupAnnotationModule.isEnableTextMarkupResizer(annotationModule.textMarkupAnnotationModule.currentTextMarkupAddMode)) {
            annotationModule.textMarkupAnnotationModule.createAnnotationSelectElement();
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.pageRender = function (data) {
        this.document = null;
        this.passwordDialogReset();
        if (this.passwordPopup) {
            this.passwordPopup.hide();
        }
        var pageIndex = 0;
        this.initPageDiv(data);
        this.currentPageNumber = pageIndex + 1;
        this.pdfViewer.currentPageNumber = pageIndex + 1;
        var isZoomMode = false;
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.isAutoZoom = true;
            if (this.pdfViewer.zoomValue) {
                if (this.pdfViewer.zoomValue > 0) {
                    isZoomMode = true;
                    this.isInitialPageMode = true;
                    this.pdfViewer.magnification.zoomTo(this.pdfViewer.zoomValue);
                }
            }
            if (this.pdfViewer.zoomMode === 'FitToWidth') {
                isZoomMode = true;
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToWidth();
            }
            else if (this.pdfViewer.zoomMode === 'FitToPage') {
                isZoomMode = true;
                this.isInitialPageMode = true;
                this.pdfViewer.magnificationModule.fitToPage();
            }
            this.documentLoaded = true;
            this.pdfViewer.magnificationModule.isInitialLoading = true;
            this.onWindowResize();
            this.documentLoaded = false;
            this.pdfViewer.magnificationModule.isInitialLoading = false;
        }
        this.isDocumentLoaded = true;
        // tslint:disable-next-line
        var viewPortWidth = 816;
        // tslint:disable-next-line:radix
        viewPortWidth = parseInt(viewPortWidth);
        var pageWidth = this.pageSize[pageIndex].width;
        if (this.renderedPagesList.indexOf(pageIndex) === -1 && !isZoomMode) {
            this.createRequestForRender(pageIndex);
            var pageNumber = pageIndex + 1;
            if (pageNumber < this.pageCount) {
                this.createRequestForRender(pageNumber);
                pageNumber = pageNumber + 1;
            }
            if (this.pageSize[pageNumber]) {
                var pageTop = this.getPageTop(pageNumber);
                var viewerHeight = this.viewerContainer.clientHeight;
                while (viewerHeight > pageTop) {
                    if (this.pageSize[pageNumber]) {
                        this.renderPageElement(pageNumber);
                        this.createRequestForRender(pageNumber);
                        pageTop = this.getPageTop(pageNumber);
                        pageNumber = pageNumber + 1;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        this.showLoadingIndicator(false);
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.uploadedDocumentName = null;
            this.pdfViewer.toolbarModule.updateCurrentPage(this.currentPageNumber);
            this.pdfViewer.toolbarModule.updateToolbarItems();
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (Browser.isDevice) {
            this.mobileSpanContainer.innerHTML = this.currentPageNumber.toString();
            this.mobilecurrentPageContainer.innerHTML = this.currentPageNumber.toString();
        }
    };
    PdfViewerBase.prototype.renderPasswordPopup = function (documentData, password) {
        if (!this.isPasswordAvailable) {
            if (this.isFileName) {
                this.document = documentData;
            }
            else {
                this.document = 'data:application/pdf;base64,' + documentData;
            }
            this.isPasswordAvailable = true;
            this.createPasswordPopup();
            this.pdfViewer.fireDocumentLoadFailed(true, null);
            this.passwordPopup.show();
        }
        else {
            this.pdfViewer.fireDocumentLoadFailed(true, password);
            this.promptElement.classList.add('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Invalid Password');
            this.promptElement.focus();
            if (this.isFileName) {
                this.document = documentData;
            }
            else {
                this.document = 'data:application/pdf;base64,' + documentData;
            }
            this.passwordPopup.show();
        }
    };
    PdfViewerBase.prototype.renderCorruptPopup = function () {
        this.pdfViewer.fireDocumentLoadFailed(false, null);
        this.createCorruptedPopup();
        this.documentId = null;
        this.corruptPopup.show();
    };
    PdfViewerBase.prototype.constructJsonObject = function (documentData, password) {
        var jsonObject;
        if (password) {
            this.isPasswordAvailable = true;
            this.passwordData = password;
            // tslint:disable-next-line:max-line-length
            jsonObject = { document: documentData, password: password, zoomFactor: 1, isFileName: this.isFileName, uniqueId: this.documentId };
        }
        else {
            this.isPasswordAvailable = false;
            this.passwordData = '';
            jsonObject = { document: documentData, zoomFactor: 1, isFileName: this.isFileName, uniqueId: this.documentId };
        }
        return jsonObject;
    };
    PdfViewerBase.prototype.checkDocumentData = function (documentData) {
        var base64String = documentData.split('base64,')[1];
        if (base64String === undefined) {
            this.isFileName = true;
            this.jsonDocumentId = documentData;
            if (this.pdfViewer.fileName === null) {
                // tslint:disable-next-line:max-line-length
                var documentStringArray = (documentData.indexOf('\\') !== -1) ? documentData.split('\\') : documentData.split('/');
                this.pdfViewer.fileName = documentStringArray[documentStringArray.length - 1];
                this.jsonDocumentId = this.pdfViewer.fileName;
                base64String = documentData;
            }
        }
        else {
            this.jsonDocumentId = null;
        }
        return base64String;
    };
    PdfViewerBase.prototype.setFileName = function () {
        if (this.pdfViewer.fileName === null) {
            if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.uploadedDocumentName) {
                this.pdfViewer.fileName = this.pdfViewer.toolbarModule.uploadedDocumentName;
                this.jsonDocumentId = this.pdfViewer.fileName;
            }
            else {
                this.pdfViewer.fileName = 'undefined.pdf';
                this.jsonDocumentId = null;
            }
        }
    };
    PdfViewerBase.prototype.saveDocumentInfo = function () {
        window.sessionStorage.setItem('currentDocument', this.documentId);
        window.sessionStorage.setItem('serviceURL', this.pdfViewer.serviceUrl);
        if (this.pdfViewer.serverActionSettings) {
            window.sessionStorage.setItem('unload', this.pdfViewer.serverActionSettings.unload);
        }
    };
    PdfViewerBase.prototype.saveDocumentHashData = function () {
        window.sessionStorage.setItem('hashId', this.hashId);
        if (this.documentLiveCount) {
            window.sessionStorage.setItem('documentLiveCount', this.documentLiveCount.toString());
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.saveFormfieldsData = function (data) {
        this.pdfViewer.isFormFieldDocument = false;
        this.enableFormFieldButton(false);
        if (data && data.PdfRenderedFormFields && data.PdfRenderedFormFields.length > 0) {
            window.sessionStorage.setItem(this.documentId + '_formfields', JSON.stringify(data.PdfRenderedFormFields));
            if (this.pdfViewer.enableFormFields) {
                this.pdfViewer.formFieldsModule.formFieldCollections();
            }
            if (this.pdfViewer.formFieldCollections.length > 0) {
                this.pdfViewer.isFormFieldDocument = true;
                this.enableFormFieldButton(true);
            }
        }
    };
    PdfViewerBase.prototype.enableFormFieldButton = function (isEnable) {
        if (this.pdfViewer.toolbarModule && this.pdfViewer.toolbarModule.submitItem) {
            this.pdfViewer.toolbarModule.toolbar.enableItems(this.pdfViewer.toolbarModule.submitItem.parentElement, isEnable);
        }
    };
    PdfViewerBase.prototype.updateWaitingPopup = function (pageNumber) {
        if (this.pageSize[pageNumber].top != null) {
            // tslint:disable-next-line:max-line-length
            var pageCurrentRect = this.getElement('_pageDiv_' + pageNumber).getBoundingClientRect();
            var waitingPopup = this.getElement('_pageDiv_' + pageNumber).firstChild.firstChild;
            if (pageCurrentRect.top < 0) {
                if (this.toolbarHeight + (this.viewerContainer.clientHeight / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                    waitingPopup.style.top = ((this.viewerContainer.clientHeight / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                }
                else {
                    if (this.toolbarHeight + (pageCurrentRect.bottom / 2) - pageCurrentRect.top < pageCurrentRect.height) {
                        waitingPopup.style.top = ((pageCurrentRect.bottom / 2) - pageCurrentRect.top) - this.toolbarHeight + 'px';
                    }
                }
            }
            else {
                waitingPopup.style.top = this.viewerContainer.clientHeight / 2 + 'px';
            }
            if (Browser.isDevice && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = (this.viewerContainer.clientWidth / 2) + (this.viewerContainer.scrollLeft) + 'px';
            }
            else if (this.getZoomFactor() > 1.25 && pageCurrentRect.width > this.viewerContainer.clientWidth) {
                waitingPopup.style.left = this.viewerContainer.clientWidth / 2 + 'px';
            }
            else {
                waitingPopup.style.left = pageCurrentRect.width / 2 + 'px';
            }
        }
    };
    PdfViewerBase.prototype.createWaitingPopup = function (pageNumber) {
        // tslint:disable-next-line:max-line-length
        var waitingPopup = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageNumber);
        if (waitingPopup) {
            createSpinner({ target: waitingPopup });
            this.setLoaderProperties(waitingPopup);
        }
    };
    PdfViewerBase.prototype.showLoadingIndicator = function (isShow) {
        var waitingPopup = this.getElement('_loadingIndicator');
        if (waitingPopup) {
            if (isShow) {
                showSpinner(waitingPopup);
            }
            else {
                hideSpinner(waitingPopup);
            }
        }
    };
    PdfViewerBase.prototype.showPageLoadingIndicator = function (pageIndex, isShow) {
        var waitingPopup = this.getElement('_pageDiv_' + pageIndex);
        if (waitingPopup != null) {
            if (isShow) {
                showSpinner(waitingPopup);
            }
            else {
                hideSpinner(waitingPopup);
            }
            this.updateWaitingPopup(pageIndex);
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.showPrintLoadingIndicator = function (isShow) {
        var printWaitingPopup = this.getElement('_printLoadingIndicator');
        if (printWaitingPopup != null) {
            if (isShow) {
                this.printMainContainer.style.display = 'block';
                showSpinner(printWaitingPopup);
            }
            else {
                this.printMainContainer.style.display = 'none';
                hideSpinner(printWaitingPopup);
            }
        }
    };
    PdfViewerBase.prototype.setLoaderProperties = function (element) {
        var spinnerElement = element.firstChild.firstChild.firstChild;
        if (spinnerElement) {
            spinnerElement.style.height = '48px';
            spinnerElement.style.width = '48px';
            spinnerElement.style.transformOrigin = '24px 24px 24px';
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateScrollTop = function (pageNumber) {
        // tslint:disable-next-line
        if (this.pageSize[pageNumber] != null) {
            this.viewerContainer.scrollTop = this.getPageTop(pageNumber);
            this.renderElementsVirtualScroll(pageNumber);
            if (this.renderedPagesList.indexOf(pageNumber) === -1) {
                this.createRequestForRender(pageNumber);
            }
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getZoomFactor = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.zoomFactor;
        }
        else {
            // default value
            return 1;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPinchZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getMagnified = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isMagnified;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPinchScrolled = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPinchScrolled;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPagesPinchZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagePinchZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getPagesZoomed = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isPagesZoomed;
        }
        else {
            // default value
            return false;
        }
    };
    PdfViewerBase.prototype.getRerenderCanvasCreated = function () {
        if (this.pdfViewer.magnificationModule) {
            return this.pdfViewer.magnificationModule.isRerenderCanvasCreated;
        }
        else {
            // default value
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getDocumentId = function () {
        return this.documentId;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.download = function () {
        if (this.pageCount > 0) {
            this.createRequestForDownload();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.saveAsBlob = function () {
        var _this = this;
        if (this.pageCount > 0) {
            return new Promise(function (resolve, reject) {
                _this.saveAsBlobRequest().then(function (value) {
                    resolve(value);
                });
            });
        }
        return null;
    };
    PdfViewerBase.prototype.saveAsBlobRequest = function () {
        var _this = this;
        var proxy = this;
        var promise = new Promise(function (resolve, reject) {
            // tslint:disable-next-line
            var jsonObject = proxy.constructJsonDownload();
            _this.dowonloadRequestHandler = new AjaxHandler(_this.pdfViewer);
            _this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
            _this.dowonloadRequestHandler.responseType = 'text';
            _this.dowonloadRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            _this.dowonloadRequestHandler.onSuccess = function (result) {
                // tslint:disable-next-line
                var data = result.data;
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                        data = null;
                    }
                    if (data) {
                        var blobUrl = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                        resolve(blobUrl);
                    }
                }
            };
            // tslint:disable-next-line
            _this.dowonloadRequestHandler.onFailure = function (result) {
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
            // tslint:disable-next-line
            _this.dowonloadRequestHandler.onError = function (result) {
                proxy.openNotificationPopup();
                proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
            };
        });
        return promise;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.clear = function (isTriggerEvent) {
        this.isPasswordAvailable = false;
        this.isDocumentLoaded = false;
        this.isInitialLoaded = false;
        this.isImportAction = false;
        this.annotationPageList = [];
        this.annotationComments = null;
        this.pdfViewer.annotationCollection = [];
        this.pdfViewer.signatureCollection = [];
        this.isAnnotationCollectionRemoved = false;
        this.documentAnnotationCollections = null;
        this.annotationRenderredList = [];
        this.isImportAction = false;
        this.isImportedAnnotation = false;
        this.importedAnnotation = [];
        this.isStorageExceed = false;
        this.annotationStorage = {};
        this.downloadCollections = {};
        this.annotationEvent = null;
        this.highestWidth = 0;
        this.requestLists = [];
        this.pdfViewer.formFieldCollections = [];
        this.initiateTextSelectMode();
        if (!Browser.isDevice) {
            if (this.navigationPane.sideBarToolbar) {
                this.navigationPane.clear();
            }
        }
        if (this.pdfViewer.thumbnailViewModule) {
            this.pdfViewer.thumbnailViewModule.clear();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.clear();
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.clearIntervalTimer();
        }
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        if (this.pdfViewer.textSearchModule) {
            this.pdfViewer.textSearchModule.resetTextSearch();
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.clear();
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.initializeCollection();
        }
        if (this.pdfViewer.formFieldsModule) {
            this.pdfViewer.formFieldsModule.readOnlyCollection = [];
        }
        if (this.signatureModule) {
            this.signatureModule.signaturecollection = [];
            this.signatureModule.outputcollection = [];
        }
        if (this.pageSize) {
            this.pageSize = [];
        }
        if (this.renderedPagesList) {
            this.renderedPagesList = [];
        }
        if (this.pageContainer) {
            while (this.pageContainer.hasChildNodes()) {
                this.pageContainer.removeChild(this.pageContainer.lastChild);
            }
        }
        if (this.pageCount > 0) {
            this.unloadDocument(this);
            // tslint:disable-next-line
            this.textLayer.characterBound = new Array();
        }
        this.windowSessionStorageClear();
        if (this.pinchZoomStorage) {
            this.pinchZoomStorage = [];
        }
        if (isTriggerEvent && this.pageCount > 0) {
            this.pdfViewer.downloadFileName = null;
            this.pdfViewer.fireDocumentUnload(this.pdfViewer.fileName);
        }
        this.pdfViewer.fileName = null;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.destroy = function () {
        if (Browser.isDevice) {
            this.pdfViewer.element.classList.remove('e-pv-mobile-view');
        }
        this.unWireEvents();
        this.clear(false);
        this.pageContainer.parentNode.removeChild(this.pageContainer);
        this.viewerContainer.parentNode.removeChild(this.viewerContainer);
        this.contextMenuModule.destroy();
        if (this.pdfViewer.toolbarModule) {
            this.navigationPane.destroy();
        }
        var measureElement = document.getElementById('measureElement');
        if (measureElement) {
            measureElement = undefined;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.unloadDocument = function (proxy) {
        var documentId = window.sessionStorage.getItem('hashId');
        var documentLiveCount = window.sessionStorage.getItem('documentLiveCount');
        if (documentId !== null) {
            // tslint:disable-next-line:max-line-length
            var jsonObject = { hashId: documentId, documentLiveCount: documentLiveCount, action: 'Unload', elementId: proxy.pdfViewer.element.id };
            var actionName = window.sessionStorage.getItem('unload');
            try {
                // tslint:disable-next-line
                var browserSupportsKeepalive = 'keepalive' in new Request('');
                if (browserSupportsKeepalive) {
                    // tslint:disable-next-line
                    var headerValue = this.setUnloadRequestHeaders();
                    fetch(window.sessionStorage.getItem('serviceURL') + '/' + actionName, {
                        method: 'POST',
                        headers: headerValue,
                        body: JSON.stringify(jsonObject)
                    });
                }
            }
            catch (error) {
                this.unloadRequestHandler = new AjaxHandler(this.pdfViewer);
                this.unloadRequestHandler.send(jsonObject);
            }
        }
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.zoomFactor = 1;
        }
        window.sessionStorage.removeItem('hashId');
        window.sessionStorage.removeItem('documentLiveCount');
        if (this.documentId) {
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_formfields');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.setUnloadRequestHeaders = function () {
        // tslint:disable-next-line
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json;charset=UTF-8');
        for (var i = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            myHeaders.append(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
        return myHeaders;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.windowSessionStorageClear = function () {
        window.sessionStorage.removeItem('currentDocument');
        window.sessionStorage.removeItem('serviceURL');
        window.sessionStorage.removeItem('unload');
        for (var i = 0; i < this.sessionStorage.length; i++) {
            window.sessionStorage.removeItem(this.sessionStorage[i]);
        }
    };
    PdfViewerBase.prototype.updateCommentPanel = function () {
        // tslint:disable-next-line
        var moreOptionsButton = document.querySelectorAll('#' + this.pdfViewer.element.id + '_more-options');
        for (var i = 0; i < moreOptionsButton.length; i++) {
            moreOptionsButton[i].style.visibility = 'hidden';
        }
        // tslint:disable-next-line
        var commentTextBox = document.querySelectorAll('.e-pv-new-comments-div');
        for (var j = 0; j < commentTextBox.length; j++) {
            commentTextBox[j].style.display = 'none';
        }
        // tslint:disable-next-line
        var commentContainer = document.querySelectorAll('.e-pv-comments-border');
        for (var j = 0; j < commentContainer.length; j++) {
            commentContainer[j].classList.remove('e-pv-comments-border');
        }
        // tslint:disable-next-line
        var editableElement = document.querySelectorAll('.e-editable-inline');
        for (var j = 0; j < editableElement.length; j++) {
            editableElement[j].style.display = 'none';
        }
        // tslint:disable-next-line
        var commentSelect = document.querySelectorAll('.e-pv-comments-select');
        for (var z = 0; z < commentSelect.length; z++) {
            commentSelect[z].classList.remove('e-pv-comments-select');
        }
        // tslint:disable-next-line
        var commentsDiv = document.querySelectorAll('.e-pv-comments-div');
        for (var j = 0; j < commentsDiv.length; j++) {
            commentsDiv[j].style.minHeight = 60 + 'px';
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.focusViewerContainer = function () {
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;
        // tslint:disable-next-line
        var parentNode = this.getScrollParent(this.viewerContainer);
        var scrollNodeX = 0;
        var scrollNodeY = 0;
        if (parentNode !== null) {
            scrollNodeX = parentNode.scrollLeft;
            scrollNodeY = parentNode.scrollTop;
        }
        this.viewerContainer.focus();
        if (this.currentPageNumber > 0) {
            this.viewerContainer.setAttribute('aria-labelledby', this.pdfViewer.element.id + '_pageDiv_' + (this.currentPageNumber - 1));
        }
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule.accordionContainer) {
            this.updateCommentPanel();
        }
        // tslint:disable-next-line:max-line-length
        if ((navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1 || navigator.userAgent.indexOf('Edge') !== -1) && parentNode !== null) {
            parentNode.scrollLeft = scrollNodeX;
            parentNode.scrollTop = scrollNodeY;
        }
        else if (parentNode !== null) {
            parentNode.scrollTo(scrollNodeX, scrollNodeY);
        }
        window.scrollTo(scrollX, scrollY);
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.getScrollParent = function (node) {
        if (node === null || node.nodeName === 'HTML') {
            return null;
        }
        var style = getComputedStyle(node);
        if (this.viewerContainer.id !== node.id && (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
            return node;
        }
        else {
            return this.getScrollParent(node.parentNode);
        }
    };
    PdfViewerBase.prototype.createCorruptedPopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_corrupted_popup', className: 'e-pv-corrupted-popup' });
        this.pageContainer.appendChild(popupElement);
        this.corruptPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: true, isModal: true,
            // tslint:disable-next-line:max-line-length
            header: '<div class="e-pv-corrupted-popup-header"> ' + this.pdfViewer.localeObj.getConstant('File Corrupted') + '</div>', visible: false,
            // tslint:disable-next-line:max-line-length
            buttons: [{ buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.closeCorruptPopup.bind(this) }],
            target: this.pdfViewer.element, beforeClose: function () {
                _this.corruptPopup.destroy();
                _this.getElement('_corrupted_popup').remove();
                _this.corruptPopup = null;
                var waitingPopup = _this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (this.pdfViewer.enableRtl) {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="templatertl" class="e-pv-notification-icon-rtl"> <div class="e-pv-corrupted-popup-content-rtl" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
            this.corruptPopup.enableRtl = true;
        }
        else {
            // tslint:disable-next-line:max-line-length
            this.corruptPopup.content = '<div id="template" class="e-pv-notification-icon"> <div class="e-pv-corrupted-popup-content" tabindex="0">' + this.pdfViewer.localeObj.getConstant('File Corrupted Content') + '</div></div>';
        }
        this.corruptPopup.appendTo(popupElement);
    };
    PdfViewerBase.prototype.closeCorruptPopup = function () {
        this.corruptPopup.hide();
        var waitingPopup = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    };
    PdfViewerBase.prototype.createPrintPopup = function () {
        var element = document.getElementById(this.pdfViewer.element.id);
        this.printMainContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printcontainer',
            className: 'e-pv-print-popup-container'
        });
        element.appendChild(this.printMainContainer);
        this.printMainContainer.style.display = 'none';
        var printWaitingPopup = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingIndicator',
            className: 'e-pv-print-loading-container'
        });
        this.printMainContainer.appendChild(printWaitingPopup);
        createSpinner({ target: printWaitingPopup, cssClass: 'e-spin-center' });
        this.setLoaderProperties(printWaitingPopup);
    };
    PdfViewerBase.prototype.createGoToPagePopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_goTopage_popup', className: 'e-pv-gotopage-popup' });
        this.goToPageElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt' });
        this.goToPageElement.textContent = this.pdfViewer.localeObj.getConstant('Enter pagenumber');
        popupElement.appendChild(this.goToPageElement);
        var inputContainer = createElement('span', { className: 'e-pv-text-input' });
        // tslint:disable-next-line:max-line-length
        this.goToPageInput = createElement('input', { id: this.pdfViewer.element.id + '_page_input', className: 'e-input' });
        this.goToPageInput.type = 'text';
        this.goToPageInput.style.maxWidth = '80%';
        this.pageNoContainer = createElement('span', { className: '.e-pv-number-ofpages' });
        inputContainer.appendChild(this.goToPageInput);
        inputContainer.appendChild(this.pageNoContainer);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.goToPagePopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('GoToPage'), visible: false, buttons: [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') },
                    click: this.GoToPageCancelClick.bind(this),
                },
                // tslint:disable-next-line:max-line-length
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('Apply'), disabled: true, cssClass: 'e-pv-gotopage-apply-btn', isPrimary: true },
                    click: this.GoToPageApplyClick.bind(this),
                },
            ], close: this.closeGoToPagePopUp.bind(this),
        });
        if (this.pdfViewer.enableRtl) {
            this.goToPagePopup.enableRtl = true;
        }
        this.goToPagePopup.appendTo(popupElement);
        var goToPageTextBox = new NumericTextBox({ format: '##', showSpinButton: false });
        goToPageTextBox.appendTo(this.goToPageInput);
        this.goToPageInput.addEventListener('keyup', function () {
            // tslint:disable-next-line
            var inputValue = _this.goToPageInput.value;
            if (inputValue !== '' && parseFloat(inputValue) > 0 && (_this.pdfViewer.pageCount + 1) > parseFloat(inputValue)) {
                _this.EnableApplyButton();
            }
            else {
                _this.DisableApplyButton();
            }
        });
    };
    PdfViewerBase.prototype.closeGoToPagePopUp = function () {
        this.goToPageInput.value = '';
        this.DisableApplyButton();
    };
    PdfViewerBase.prototype.EnableApplyButton = function () {
        // tslint:disable-next-line
        var popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.removeAttribute('disabled');
    };
    PdfViewerBase.prototype.DisableApplyButton = function () {
        // tslint:disable-next-line
        var popupElements = document.getElementsByClassName('e-pv-gotopage-apply-btn')[0];
        popupElements.setAttribute('disabled', true);
    };
    PdfViewerBase.prototype.GoToPageCancelClick = function () {
        this.goToPagePopup.hide();
    };
    PdfViewerBase.prototype.GoToPageApplyClick = function () {
        this.goToPagePopup.hide();
        // tslint:disable-next-line
        var pageNumber = this.goToPageInput.value;
        this.pdfViewer.navigation.goToPage(pageNumber);
        this.updateMobileScrollerPosition();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateMobileScrollerPosition = function () {
        if (Browser.isDevice && this.mobileScrollerContainer) {
            // tslint:disable-next-line
            var ratio = (this.viewerContainer.scrollHeight - this.viewerContainer.clientHeight) / (this.viewerContainer.clientHeight - 56);
            // tslint:disable-next-line
            var differenceRatio = (this.viewerContainer.scrollTop) / ratio;
            // tslint:disable-next-line
            var toolbarHeight = this.pdfViewer.toolbarModule ? this.toolbarHeight : 0;
            this.mobileScrollerContainer.style.top = (toolbarHeight + differenceRatio) + 'px';
        }
    };
    PdfViewerBase.prototype.createPasswordPopup = function () {
        var _this = this;
        // tslint:disable-next-line:max-line-length
        var popupElement = createElement('div', { id: this.pdfViewer.element.id + '_password_popup', className: 'e-pv-password-popup', attrs: { 'tabindex': '-1' } });
        this.promptElement = createElement('span', { id: this.pdfViewer.element.id + '_prompt', attrs: { 'tabindex': '-1' } });
        this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
        popupElement.appendChild(this.promptElement);
        var inputContainer = createElement('span', { className: 'e-input-group e-pv-password-input' });
        // tslint:disable-next-line:max-line-length
        this.passwordInput = createElement('input', { id: this.pdfViewer.element.id + '_password_input', className: 'e-input' });
        this.passwordInput.type = 'password';
        this.passwordInput.name = 'Required';
        inputContainer.appendChild(this.passwordInput);
        popupElement.appendChild(inputContainer);
        this.pageContainer.appendChild(popupElement);
        this.passwordPopup = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true,
            header: this.pdfViewer.localeObj.getConstant('Password Protected'), visible: false,
            close: this.passwordCancel.bind(this), target: this.pdfViewer.element, beforeClose: function () {
                _this.passwordPopup.destroy();
                _this.getElement('_password_popup').remove();
                _this.passwordPopup = null;
                var waitingPopup = _this.getElement('_loadingIndicator');
                if (waitingPopup != null) {
                    hideSpinner(waitingPopup);
                }
            }
        });
        if (!Browser.isDevice) {
            this.passwordPopup.buttons = [
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) }
            ];
        }
        else {
            this.passwordPopup.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.passwordCancelClick.bind(this) },
                {
                    buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true },
                    click: this.applyPassword.bind(this)
                }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.passwordPopup.enableRtl = true;
        }
        this.passwordPopup.appendTo(popupElement);
        this.passwordInput.addEventListener('keyup', function () {
            if (_this.passwordInput.value === '') {
                _this.passwordDialogReset();
            }
        });
        this.passwordInput.addEventListener('focus', function () {
            _this.passwordInput.parentElement.classList.add('e-input-focus');
        });
        this.passwordInput.addEventListener('blur', function () {
            _this.passwordInput.parentElement.classList.remove('e-input-focus');
        });
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.passwordCancel = function (args) {
        if (args.isInteraction) {
            this.clear(false);
            this.passwordDialogReset();
            this.passwordInput.value = '';
        }
        var waitingPopup = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    };
    PdfViewerBase.prototype.passwordCancelClick = function () {
        this.clear(false);
        this.passwordDialogReset();
        this.passwordPopup.hide();
        var waitingPopup = this.getElement('_loadingIndicator');
        if (waitingPopup !== null) {
            hideSpinner(waitingPopup);
        }
    };
    PdfViewerBase.prototype.passwordDialogReset = function () {
        if (this.promptElement) {
            this.promptElement.classList.remove('e-pv-password-error');
            this.promptElement.textContent = this.pdfViewer.localeObj.getConstant('Enter Password');
            this.passwordInput.value = '';
        }
    };
    PdfViewerBase.prototype.applyPassword = function () {
        var password = this.passwordInput.value;
        if (password !== '') {
            this.pdfViewer.load(this.document, password);
        }
        this.focusViewerContainer();
    };
    PdfViewerBase.prototype.wireEvents = function () {
        var _this = this;
        this.viewerContainer.addEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice) {
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.addEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.addEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.addEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.addEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.addEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.addEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.addEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.addEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dblclick', this.viewerContainerOnClick);
        this.viewerContainer.addEventListener('dragstart', this.viewerContainerOnDragStart);
        this.pdfViewer.element.addEventListener('keydown', this.viewerContainerOnKeyDown);
        window.addEventListener('mouseup', this.onWindowMouseUp);
        window.addEventListener('touchend', this.onWindowTouchEnd);
        this.unload = function () { return _this.unloadDocument(_this); };
        window.addEventListener('unload', this.unload);
        window.addEventListener('beforeunload', this.clearSessionStorage);
        window.addEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.addEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.addEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.addEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.addEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        }
        else {
            this.viewerContainer.addEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.addEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.addEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.addEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    };
    PdfViewerBase.prototype.unWireEvents = function () {
        this.viewerContainer.removeEventListener('scroll', this.viewerContainerOnScroll, true);
        if (Browser.isDevice) {
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnScroll, true);
        }
        this.viewerContainer.removeEventListener('mousedown', this.viewerContainerOnMousedown);
        this.viewerContainer.removeEventListener('mouseup', this.viewerContainerOnMouseup);
        this.viewerContainer.removeEventListener('wheel', this.viewerContainerOnMouseWheel);
        this.viewerContainer.removeEventListener('mousemove', this.viewerContainerOnMousemove);
        this.viewerContainer.removeEventListener('mouseleave', this.viewerContainerOnMouseLeave);
        this.viewerContainer.removeEventListener('mouseenter', this.viewerContainerOnMouseEnter);
        this.viewerContainer.removeEventListener('mouseover', this.viewerContainerOnMouseOver);
        this.viewerContainer.removeEventListener('click', this.viewerContainerOnClick);
        this.viewerContainer.removeEventListener('dragstart', this.viewerContainerOnDragStart);
        this.viewerContainer.removeEventListener('contextmenu', this.viewerContainerOnContextMenuClick);
        this.pdfViewer.element.removeEventListener('keydown', this.viewerContainerOnKeyDown);
        window.removeEventListener('mouseup', this.onWindowMouseUp);
        window.removeEventListener('unload', this.unload);
        window.removeEventListener('resize', this.onWindowResize);
        // tslint:disable-next-line:max-line-length
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || navigator.userAgent.indexOf('Trident') !== -1) {
            this.viewerContainer.removeEventListener('pointerdown', this.viewerContainerOnPointerDown);
            this.viewerContainer.removeEventListener('pointermove', this.viewerContainerOnPointerMove);
            this.viewerContainer.removeEventListener('pointerup', this.viewerContainerOnPointerEnd);
            this.viewerContainer.removeEventListener('pointerleave', this.viewerContainerOnPointerEnd);
        }
        else {
            this.viewerContainer.removeEventListener('touchstart', this.viewerContainerOnTouchStart);
            this.viewerContainer.removeEventListener('touchmove', this.viewerContainerOnTouchMove);
            this.viewerContainer.removeEventListener('touchend', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchleave', this.viewerContainerOnTouchEnd);
            this.viewerContainer.removeEventListener('touchcancel', this.viewerContainerOnTouchEnd);
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateZoomValue = function () {
        if (this.pdfViewer.magnificationModule) {
            if (this.pdfViewer.magnificationModule.isAutoZoom) {
                this.pdfViewer.magnificationModule.fitToAuto();
            }
            else if (this.pdfViewer.zoomMode !== 'FitToWidth' && this.pdfViewer.magnificationModule.fitType === 'fitToWidth') {
                this.pdfViewer.magnificationModule.fitToWidth();
            }
        }
        for (var i = 0; i < this.pageCount; i++) {
            this.applyLeftPosition(i);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.updateFreeTextProperties = function (annotation) {
        if (this.pdfViewer.enableShapeLabel) {
            if (this.pdfViewer.shapeLabelSettings.fillColor) {
                annotation.labelFillColor = this.pdfViewer.shapeLabelSettings.fillColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontColor) {
                annotation.fontColor = this.pdfViewer.shapeLabelSettings.fontColor;
            }
            if (this.pdfViewer.shapeLabelSettings.fontSize) {
                annotation.fontSize = this.pdfViewer.shapeLabelSettings.fontSize;
            }
            if (this.pdfViewer.shapeLabelSettings.fontFamily) {
                annotation.fontFamily = this.pdfViewer.shapeLabelSettings.fontFamily;
            }
            if (this.pdfViewer.shapeLabelSettings.opacity) {
                annotation.labelOpacity = this.pdfViewer.shapeLabelSettings.opacity;
            }
            if (this.pdfViewer.shapeLabelSettings.labelContent) {
                annotation.labelContent = this.pdfViewer.shapeLabelSettings.labelContent;
            }
        }
    };
    PdfViewerBase.prototype.checkIsRtlText = function (text) {
        // tslint:disable-next-line:max-line-length
        var ltrChars = 'A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02B8\\u0300-\\u0590\\u0800-\\u1FFF' + '\\u2C00-\\uFB1C\\uFDFE-\\uFE6F\\uFEFD-\\uFFFF';
        var rtlChars = '\\u0591-\\u07FF\\uFB1D-\\uFDFD\\uFE70-\\uFEFC';
        // tslint:disable-next-line
        var rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
        return rtlDirCheck.test(text);
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.checkIsNormalText = function () {
        var isText = true;
        var currentText = '';
        // tslint:disable-next-line
        var textSelectionModule = this.pdfViewer.textSelectionModule;
        if (textSelectionModule && textSelectionModule.selectionRangeArray && textSelectionModule.selectionRangeArray.length === 1) {
            currentText = textSelectionModule.selectionRangeArray[0].textContent;
        }
        else if (window.getSelection() && window.getSelection().anchorNode) {
            currentText = window.getSelection().toString();
        }
        if (currentText !== '' && this.checkIsRtlText(currentText)) {
            isText = false;
        }
        return isText;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiatePanning = function () {
        this.isPanMode = true;
        this.textLayer.modifyTextCursor(false);
        this.disableTextSelectionMode();
        if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
            this.pdfViewer.toolbar.annotationToolbarModule.deselectAllItems();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.initiateTextSelectMode = function () {
        this.isPanMode = false;
        if (this.viewerContainer) {
            this.viewerContainer.style.cursor = 'auto';
            if (this.pdfViewer.textSelectionModule) {
                this.textLayer.modifyTextCursor(true);
                this.pdfViewer.textSelectionModule.enableTextSelectionMode();
            }
            if (!Browser.isDevice) {
                this.enableAnnotationAddTools(true);
            }
        }
    };
    PdfViewerBase.prototype.enableAnnotationAddTools = function (isEnable) {
        if (this.pdfViewer.toolbarModule) {
            if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
                this.pdfViewer.toolbarModule.annotationToolbarModule.enableAnnotationAddTools(isEnable);
            }
        }
    };
    PdfViewerBase.prototype.applySelection = function () {
        if (window.getSelection().anchorNode !== null) {
            this.pdfViewer.textSelectionModule.applySpanForSelection();
        }
        this.isViewerContainerDoubleClick = false;
    };
    PdfViewerBase.prototype.handleTaps = function (touchPoints) {
        var _this = this;
        if (!this.singleTapTimer) {
            this.singleTapTimer = setTimeout(function () {
                _this.onSingleTap(touchPoints);
                // tslint:disable-next-line
            }, 300);
            this.tapCount++;
        }
        else {
            if (this.pdfViewer.enablePinchZoom) {
                this.tapCount++;
                clearTimeout(this.singleTapTimer);
                this.singleTapTimer = null;
                this.onDoubleTap(touchPoints);
            }
        }
    };
    PdfViewerBase.prototype.handleTextBoxTaps = function (touchPoints) {
        var _this = this;
        setTimeout(function () { _this.inputTapCount = 0; }, 300);
        this.inputTapCount++;
        // tslint:disable-next-line
        var timer = setTimeout(function () { _this.onTextBoxDoubleTap(touchPoints); }, 200);
        if (this.inputTapCount > 2) {
            this.inputTapCount = 0;
        }
    };
    PdfViewerBase.prototype.onTextBoxDoubleTap = function (touches) {
        var target = touches[0].target;
        if (this.inputTapCount === 2) {
            if (this.pdfViewer.selectedItems.annotations.length !== 0) {
                if (this.isFreeTextAnnotation(this.pdfViewer.selectedItems.annotations) === true) {
                    var elmtPosition = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotation.freeTextAnnotationModule.addInuptElemet(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
                else if (this.pdfViewer.selectedItems.annotations[0].enableShapeLabel === true) {
                    var elmtPosition = {};
                    elmtPosition.x = this.pdfViewer.selectedItems.annotations[0].bounds.x;
                    elmtPosition.y = this.pdfViewer.selectedItems.annotations[0].bounds.y;
                    this.pdfViewer.annotation.inputElementModule.editLabel(elmtPosition, this.pdfViewer.selectedItems.annotations[0]);
                }
            }
        }
    };
    PdfViewerBase.prototype.onSingleTap = function (touches) {
        var target = touches[0].target;
        var isFormfields = false;
        this.singleTapTimer = null;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformFields'))) {
            isFormfields = true;
        }
        if (!this.isLongTouchPropagated && !this.navigationPane.isNavigationToolbarVisible && !isFormfields) {
            if (this.pdfViewer.toolbarModule) {
                if ((this.touchClientX >= touches[0].clientX - 10) && (this.touchClientX <= touches[0].clientX + 10) &&
                    (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 10)) {
                    if (!this.isTapHidden) {
                        this.viewerContainer.scrollTop -= this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                        if (this.pdfViewer.toolbar.moreDropDown) {
                            var dropDown = this.getElement('_more_option-popup');
                            if (dropDown.firstElementChild) {
                                dropDown.classList.remove('e-popup-open');
                                dropDown.classList.add('e-popup-close');
                                dropDown.removeChild(dropDown.firstElementChild);
                            }
                        }
                    }
                    else {
                        this.viewerContainer.scrollTop += this.getElement('_toolbarContainer').clientHeight * this.getZoomFactor();
                        // tslint:disable-next-line:max-line-length
                        this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 56);
                    }
                    if (this.isTapHidden && Browser.isDevice) {
                        this.mobileScrollerContainer.style.display = '';
                        this.updateMobileScrollerPosition();
                    }
                    else if (Browser.isDevice && this.getSelectTextMarkupCurrentPage() == null) {
                        this.mobileScrollerContainer.style.display = 'none';
                    }
                    if (this.getSelectTextMarkupCurrentPage() == null) {
                        this.pdfViewer.toolbarModule.showToolbar(this.isTapHidden);
                        this.isTapHidden = !this.isTapHidden;
                    }
                }
                this.tapCount = 0;
            }
        }
    };
    PdfViewerBase.prototype.onDoubleTap = function (touches) {
        var target = touches[0].target;
        var isFormfields = false;
        if (target && (target.classList.contains('e-pdfviewer-formFields')
            || target.classList.contains('e-pdfviewer-ListBox') || target.classList.contains('e-pdfviewer-signatureformFields'))) {
            isFormfields = true;
        }
        if (this.tapCount === 2 && !isFormfields) {
            this.tapCount = 0;
            /**
             * Sometimes the values gets differ by some decimal points. So converted the decimal points values to Integer values.
             */
            // tslint:disable-next-line
            if ((this.touchClientX >= parseInt((touches[0].clientX - 10).toString())) && (this.touchClientX <= touches[0].clientX + 10) &&
                (this.touchClientY >= touches[0].clientY - 10) && (this.touchClientY <= touches[0].clientY + 30)) {
                if (this.pdfViewer.magnification) {
                    this.pdfViewer.magnification.onDoubleTapMagnification();
                }
                this.viewerContainer.style.height = this.updatePageHeight(this.pdfViewer.element.getBoundingClientRect().height, 0);
                this.isTapHidden = false;
                clearTimeout(this.singleTapTimer);
            }
        }
    };
    PdfViewerBase.prototype.preventTouchEvent = function (event) {
        if (this.pdfViewer.textSelectionModule) {
            // tslint:disable-next-line:max-line-length
            if (!this.isPanMode && this.pdfViewer.enableTextSelection && !this.isTextSelectionDisabled && this.getSelectTextMarkupCurrentPage() == null) {
                if (!(this.isWebkitMobile && Browser.isDevice)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    };
    PdfViewerBase.prototype.renderStampAnnotation = function (event) {
        if (this.pdfViewer.annotation) {
            var zoomFactor = this.getZoomFactor();
            var pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
            var pageDiv = this.getElement('_pageDiv_' + pageIndex);
            if (this.pdfViewer.enableStampAnnotations) {
                var stampModule = this.pdfViewer.annotationModule.stampAnnotationModule;
                if (stampModule && stampModule.isStampAnnotSelected) {
                    if (pageDiv) {
                        var pageCurrentRect = pageDiv.getBoundingClientRect();
                        // tslint:disable-next-line:max-line-length
                        stampModule.renderStamp((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor, null, null, pageIndex, null, null, null, null);
                        stampModule.isStampAnnotSelected = false;
                    }
                }
                this.pdfViewer.annotation.onAnnotationMouseDown();
            }
            if (this.pdfViewer.enableHandwrittenSignature && this.isSignatureAdded && pageDiv) {
                var pageCurrentRect = pageDiv.getBoundingClientRect();
                // tslint:disable-next-line:max-line-length
                this.signatureModule.renderSignature((event.changedTouches[0].clientX - pageCurrentRect.left) / zoomFactor, (event.changedTouches[0].clientY - pageCurrentRect.top) / zoomFactor);
                this.isSignatureAdded = false;
            }
            if (event.touches.length === 1 && this.isTextMarkupAnnotationModule() && !this.getPopupNoteVisibleStatus()) {
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.onTextMarkupAnnotationTouchEnd(event);
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.initPageDiv = function (pageValues) {
        if (this.pdfViewer.toolbarModule) {
            this.pdfViewer.toolbarModule.updateTotalPage();
        }
        if (Browser.isDevice && this.mobiletotalPageContainer) {
            this.mobiletotalPageContainer.innerHTML = this.pageCount.toString();
            this.pageNoContainer.innerHTML = '(1-' + this.pageCount.toString() + ')';
        }
        if (this.pageCount > 0) {
            var topValue = 0;
            var pageLimit = 0;
            this.isMixedSizeDocument = false;
            if (this.pageCount > 100) {
                // to render 100 pages intially.
                pageLimit = 100;
                this.pageLimit = pageLimit;
            }
            else {
                pageLimit = this.pageCount;
            }
            var isPortrait = false;
            var isLandscape = false;
            var differentPageSize = false;
            for (var i = 0; i < pageLimit; i++) {
                if (typeof pageValues.pageSizes[i] !== 'object') {
                    var pageSize = pageValues.pageSizes[i].split(',');
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        var previousPageHeight = pageValues.pageSizes[i - 1].split(',');
                        topValue = this.pageGap + parseFloat(previousPageHeight[1]) + topValue;
                    }
                    else {
                        topValue = this.pageGap;
                    }
                    var size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                    this.pageSize.push(size);
                }
                else {
                    if (pageValues.pageSizes[i - 1] !== null && i !== 0) {
                        // tslint:disable-next-line
                        var previousPageHeight = pageValues.pageSizes[i - 1];
                        topValue = this.pageGap + parseFloat(previousPageHeight.Height) + topValue;
                    }
                    else {
                        topValue = this.pageGap;
                    }
                    var size = { width: pageValues.pageSizes[i].Width, height: pageValues.pageSizes[i].Height, top: topValue };
                    this.pageSize.push(size);
                }
                if (this.pageSize[i].height > this.pageSize[i].width) {
                    isPortrait = true;
                }
                if (this.pageSize[i].width > this.pageSize[i].height) {
                    isLandscape = true;
                }
                if (i > 0 && this.pageSize[i].width !== this.pageSize[i - 1].width) {
                    differentPageSize = true;
                }
                var pageWidth = this.pageSize[i].width;
                if (pageWidth > this.highestWidth) {
                    this.highestWidth = pageWidth;
                }
            }
            if ((isPortrait && isLandscape) || differentPageSize) {
                this.isMixedSizeDocument = true;
            }
            var limit = this.pageCount < 10 ? this.pageCount : 10;
            for (var i = 0; i < limit; i++) {
                this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
            }
            // tslint:disable-next-line:max-line-length
            this.pageContainer.style.height = this.getPageTop(this.pageSize.length - 1) + this.getPageHeight(this.pageSize.length - 1) + 'px';
            this.pageContainer.style.position = 'relative';
            if (this.pageLimit === 100) {
                var pageDiv = this.getElement('_pageDiv_' + this.pageLimit);
                if (pageDiv === null && this.pageLimit < this.pageCount) {
                    Promise.all([this.renderPagesVirtually()]);
                }
            }
        }
    };
    PdfViewerBase.prototype.renderElementsVirtualScroll = function (pageNumber) {
        var lowerLimit = 1;
        var higherLimit = 3;
        if (this.pageStopValue === 100) {
            lowerLimit = 4;
            higherLimit = 4;
        }
        else {
            lowerLimit = 1;
            higherLimit = 3;
        }
        var pageValue = pageNumber + lowerLimit;
        if (pageValue > this.pageCount) {
            pageValue = this.pageCount;
        }
        for (var i = pageNumber - 1; i <= pageValue; i++) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        var lowerPageValue = pageNumber - 3;
        if (lowerPageValue < 0) {
            lowerPageValue = 0;
        }
        for (var i = pageNumber - 1; i >= lowerPageValue; i--) {
            if (i !== -1) {
                this.renderPageElement(i);
            }
        }
        for (var j = 0; j < this.pageCount; j++) {
            if (!((lowerPageValue <= j) && (j <= pageValue))) {
                var pageDiv = this.getElement('_pageDiv_' + j);
                var pageCanvas = this.getElement('_pageCanvas_' + j);
                var textLayer = this.getElement('_textLayer_' + j);
                if (pageCanvas) {
                    pageCanvas.parentNode.removeChild(pageCanvas);
                    if (textLayer) {
                        if (this.pdfViewer.textSelectionModule && textLayer.childNodes.length !== 0 && !this.isTextSelectionDisabled) {
                            this.pdfViewer.textSelectionModule.maintainSelectionOnScroll(j, true);
                        }
                        textLayer.parentNode.removeChild(textLayer);
                    }
                    var indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
                if (pageDiv) {
                    pageDiv.parentNode.removeChild(pageDiv);
                    var indexInArray = this.renderedPagesList.indexOf(j);
                    if (indexInArray !== -1) {
                        this.renderedPagesList.splice(indexInArray, 1);
                    }
                }
            }
        }
    };
    PdfViewerBase.prototype.renderPageElement = function (i) {
        var pageDiv = this.getElement('_pageDiv_' + i);
        var canvas = this.getElement('_pageCanvas_' + i);
        if (canvas == null && pageDiv == null && i < this.pageSize.length) {
            // tslint:disable-next-line
            this.renderPageContainer(i, this.getPageWidth(i), this.getPageHeight(i), this.getPageTop(i));
        }
    };
    PdfViewerBase.prototype.renderPagesVirtually = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proxy;
            var _this = this;
            return __generator(this, function (_a) {
                proxy = this;
                setTimeout(function () { _this.initiateRenderPagesVirtually(proxy); }, 500);
                return [2 /*return*/];
            });
        });
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.initiateRenderPagesVirtually = function (proxy) {
        var jsonObject = { hashId: proxy.hashId, isCompletePageSizeNotReceived: true, action: 'VirtualLoad', elementId: proxy.pdfViewer.element.id, uniqueId: proxy.documentId };
        if (proxy.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.documentId = proxy.jsonDocumentId;
        }
        this.virtualLoadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.virtualLoadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.load;
        this.virtualLoadRequestHandler.responseType = 'json';
        this.virtualLoadRequestHandler.mode = true;
        this.virtualLoadRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onSuccess = function (result) {
            // tslint:disable-next-line
            var data = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (error) {
                        proxy.onControlError(500, data, 'VirtualLoad');
                    }
                }
            }
            if (data) {
                while (typeof data !== 'object') {
                    data = JSON.parse(data);
                }
                if (proxy.documentId === data.uniqueId) {
                    // tslint:disable-next-line
                    var pageValues = data;
                    if (proxy.pageSize[proxy.pageLimit - 1]) {
                        var topValue = proxy.pageSize[proxy.pageLimit - 1].top;
                        for (var i = proxy.pageLimit; i < proxy.pageCount; i++) {
                            var pageSize = pageValues.pageSizes[i].split(',');
                            if (proxy.pageSize[i - 1] !== null && i !== 0) {
                                var previousPageHeight = proxy.pageSize[i - 1].height;
                                topValue = proxy.pageGap + parseFloat(previousPageHeight) + topValue;
                            }
                            var size = { width: parseFloat(pageSize[0]), height: parseFloat(pageSize[1]), top: topValue };
                            proxy.pageSize.push(size);
                        }
                        // tslint:disable-next-line:max-line-length
                        proxy.pageContainer.style.height = proxy.getPageTop(proxy.pageSize.length - 1) + proxy.getPageHeight(proxy.pageSize.length - 1) + 'px';
                        // tslint:disable-next-line
                        var pageData = window.sessionStorage.getItem(proxy.documentId + '_pagedata');
                        if (proxy.pageCount > 100) {
                            proxy.pdfViewer.fireDocumentLoad(pageData);
                        }
                    }
                }
            }
        };
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
        // tslint:disable-next-line
        this.virtualLoadRequestHandler.onError = function (result) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText);
        };
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.tileRenderPage = function (data, pageIndex) {
        var _this = this;
        var proxy = this;
        if (data && this.pageSize[pageIndex]) {
            var pageWidth_1 = this.getPageWidth(pageIndex);
            var pageHeight_1 = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            var canvas = this.getElement('_pageCanvas_' + pageIndex);
            var pageDiv = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageDiv.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
                }
                else {
                    pageDiv.style.width = pageWidth_1 + 'px';
                }
                pageDiv.style.height = pageHeight_1 + 'px';
                pageDiv.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv.style.right = this.updateLeftPosition(pageIndex) + 'px';
                }
                else {
                    pageDiv.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas) {
                canvas.style.backgroundColor = '#fff';
                canvas.style.width = pageWidth_1 + 'px';
                canvas.style.height = pageHeight_1 + 'px';
                // tslint:disable-next-line
                var imageData = data['image'];
                // tslint:disable-next-line
                var matrix_1 = data['transformationMatrix'];
                if (imageData) {
                    var image_1 = new Image();
                    image_1.onload = function () {
                        var pagecanvas = _this.getElement('_pageCanvas_' + pageIndex);
                        if (pagecanvas) {
                            var scaleFactor = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                            // tslint:disable-next-line
                            var pageCanvasWidth = parseInt((pagecanvas.width).toString());
                            // tslint:disable-next-line
                            var pageCanvasStyleWidth = parseInt((parseFloat(pagecanvas.style.width) * scaleFactor).toString());
                            // tslint:disable-next-line
                            if (!isNaN(parseFloat(pagecanvas.style.width)) && pageCanvasWidth !== pageCanvasStyleWidth) {
                                pagecanvas.style.width = pageWidth_1 + 'px';
                                pagecanvas.style.height = pageHeight_1 + 'px';
                                // tslint:disable-next-line
                                pagecanvas.height = parseInt((pageHeight_1 * scaleFactor).toString());
                                // tslint:disable-next-line
                                pagecanvas.width = parseInt((pageWidth_1 * scaleFactor).toString());
                            }
                            proxy.tileRenderCount = proxy.tileRenderCount + 1;
                            var zoomFactor = _this.retrieveCurrentZoomFactor();
                            if (data.zoomFactor) {
                                zoomFactor = data.zoomFactor;
                            }
                            var matrix0 = (matrix_1.Elements[0] * _this.getZoomFactor()) / zoomFactor;
                            var matrix1 = (matrix_1.Elements[1] * _this.getZoomFactor()) / zoomFactor;
                            var matrix2 = (matrix_1.Elements[2] * _this.getZoomFactor()) / zoomFactor;
                            var matrix3 = (matrix_1.Elements[3] * _this.getZoomFactor()) / zoomFactor;
                            var matrix4 = (matrix_1.Elements[4] * _this.getZoomFactor()) / zoomFactor;
                            var matrix5 = (matrix_1.Elements[5] * _this.getZoomFactor()) / zoomFactor;
                            var context = pagecanvas.getContext('2d');
                            // tslint:disable-next-line
                            context.setTransform(matrix0, matrix1, matrix2, matrix3, matrix4, matrix5);
                            context.drawImage(image_1, 0, 0);
                            _this.showPageLoadingIndicator(pageIndex, false);
                            if (isNaN(data.tileX) && isNaN(data.tileY)) {
                                if (pageIndex === 0 && _this.isDocumentLoaded) {
                                    _this.renderPDFInformations();
                                    _this.isInitialLoaded = true;
                                    // tslint:disable-next-line
                                    var pageData = window.sessionStorage.getItem(_this.documentId + '_pagedata');
                                    if (_this.pageCount <= 100) {
                                        _this.pdfViewer.fireDocumentLoad(pageData);
                                    }
                                    _this.isDocumentLoaded = false;
                                    if (_this.pdfViewer.textSearch && _this.pdfViewer.isExtractText) {
                                        _this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                    }
                                }
                            }
                            if (proxy.tileRenderCount === proxy.tileRequestCount && proxy.isTileImageRendered) {
                                proxy.isTileImageRendered = false;
                                proxy.tileRenderCount = 0;
                                if (_this.pdfViewer.magnificationModule) {
                                    _this.pdfViewer.magnificationModule.rerenderCountIncrement();
                                }
                            }
                            image_1.onload = null;
                            image_1 = null;
                        }
                    };
                    image_1.src = imageData;
                }
                if (isNaN(data.tileX) && isNaN(data.tileY)) {
                    this.onPageRender(data, pageIndex, pageDiv);
                }
            }
        }
    };
    PdfViewerBase.prototype.calculateImageWidth = function (pageWidth, zoomFactor, scaleFactor, imageWidth) {
        var width = (pageWidth / this.getZoomFactor()) * zoomFactor * scaleFactor;
        // tslint:disable-next-line
        if ((parseInt(imageWidth.toString())) === (parseInt(width.toString()))) {
            imageWidth = width;
        }
        imageWidth = ((imageWidth * this.getZoomFactor()) / zoomFactor);
        return imageWidth;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.renderPage = function (data, pageIndex) {
        var _this = this;
        if (data && this.pageSize[pageIndex]) {
            var pageWidth_2 = this.getPageWidth(pageIndex);
            var pageHeight_2 = this.getPageHeight(pageIndex);
            // tslint:disable-next-line:max-line-length
            var canvas_1 = this.getElement('_pageCanvas_' + pageIndex);
            var pageDiv_1 = this.getElement('_pageDiv_' + pageIndex);
            if (pageDiv_1) {
                if (this.isMixedSizeDocument && this.highestWidth > 0) {
                    pageDiv_1.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
                }
                else {
                    pageDiv_1.style.width = pageWidth_2 + 'px';
                }
                pageDiv_1.style.height = pageHeight_2 + 'px';
                pageDiv_1.style.top = this.getPageTop(pageIndex) + 'px';
                if (this.pdfViewer.enableRtl) {
                    pageDiv_1.style.right = this.updateLeftPosition(pageIndex) + 'px';
                }
                else {
                    pageDiv_1.style.left = this.updateLeftPosition(pageIndex) + 'px';
                }
            }
            if (canvas_1) {
                canvas_1.style.width = pageWidth_2 + 'px';
                canvas_1.style.height = pageHeight_2 + 'px';
                var context_1 = canvas_1.getContext('2d');
                // tslint:disable-next-line
                var imageData = data['image'];
                // tslint:disable-next-line
                var matrix_2 = data['transformationMatrix'];
                if (imageData) {
                    var image_2 = new Image();
                    image_2.onload = function () {
                        var imageWidth = image_2.width;
                        var scaleFactor = (!isNullOrUndefined(data.scaleFactor)) ? data.scaleFactor : 1.5;
                        var zoomFactor = _this.retrieveCurrentZoomFactor();
                        if (data.zoomFactor) {
                            imageWidth = _this.calculateImageWidth(pageWidth_2, data.zoomFactor, scaleFactor, imageWidth);
                        }
                        else {
                            imageWidth = _this.calculateImageWidth(pageWidth_2, zoomFactor, scaleFactor, imageWidth);
                        }
                        // tslint:disable-next-line
                        if (parseInt((pageWidth_2 * scaleFactor).toString()) === parseInt(imageWidth.toString())) {
                            if (!isNaN(parseFloat(canvas_1.style.width))) {
                                canvas_1.style.width = pageWidth_2 + 'px';
                                canvas_1.style.height = pageHeight_2 + 'px';
                                canvas_1.height = pageHeight_2 * window.devicePixelRatio;
                                canvas_1.width = pageWidth_2 * window.devicePixelRatio;
                            }
                            if (pageWidth_2 < parseFloat(pageDiv_1.style.width)) {
                                pageDiv_1.style.boxShadow = 'none';
                            }
                            // tslint:disable-next-line
                            context_1.setTransform(matrix_2.Elements[0], matrix_2.Elements[1], matrix_2.Elements[2], matrix_2.Elements[3], matrix_2.Elements[4], matrix_2.Elements[5]);
                            context_1.drawImage(image_2, 0, 0, canvas_1.width, canvas_1.height);
                            _this.showPageLoadingIndicator(pageIndex, false);
                            if (pageIndex === 0 && _this.isDocumentLoaded) {
                                _this.renderPDFInformations();
                                _this.isInitialLoaded = true;
                                // tslint:disable-next-line
                                var pageData = window.sessionStorage.getItem(_this.documentId + '_pagedata');
                                if (_this.pageCount <= 100) {
                                    _this.pdfViewer.fireDocumentLoad(pageData);
                                }
                                _this.isDocumentLoaded = false;
                                if (_this.pdfViewer.textSearch && _this.pdfViewer.isExtractText) {
                                    _this.pdfViewer.textSearchModule.getPDFDocumentTexts();
                                }
                            }
                            if (_this.pdfViewer.magnificationModule) {
                                _this.pdfViewer.magnificationModule.rerenderCountIncrement();
                            }
                        }
                        image_2.onload = null;
                        image_2 = null;
                    };
                    image_2.src = imageData;
                    if (this.pdfViewer.magnificationModule) {
                        this.pdfViewer.magnificationModule.pushImageObjects(image_2);
                    }
                }
                this.onPageRender(data, pageIndex, pageDiv_1);
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.onPageRender = function (data, pageIndex, pageDiv) {
        var aElement = pageDiv.getElementsByTagName('a');
        var isAnnotationRendered = false;
        if (aElement.length !== 0) {
            for (var index = aElement.length - 1; index >= 0; index--) {
                aElement[index].parentNode.removeChild(aElement[index]);
            }
        }
        if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
            this.renderTextContent(data, pageIndex);
        }
        if (this.pdfViewer.formFieldsModule) {
            this.pdfViewer.formFieldsModule.renderFormFields(pageIndex);
        }
        if (this.pdfViewer.enableHyperlink && this.pdfViewer.linkAnnotationModule) {
            this.pdfViewer.linkAnnotationModule.renderHyperlinkContent(data, pageIndex);
        }
        if (this.pdfViewer.textSelectionModule && !this.isTextSelectionDisabled) {
            this.pdfViewer.textSelectionModule.applySelectionRangeOnScroll(pageIndex);
        }
        if (this.documentAnnotationCollections) {
            var isAnnotationAdded = false;
            for (var i = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // tslint:disable-next-line
            var pageAnnotations = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isImportAction) {
            // tslint:disable-next-line
            var pageAnnotations = this.checkDocumentCollectionData(pageIndex);
            if (pageAnnotations) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                isAnnotationRendered = true;
            }
        }
        if (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled()) {
            if (this.isStampAnnotationModule()) {
                // tslint:disable-next-line
                var stampData = data['stampAnnotations'];
                if (isAnnotationRendered) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex, null, true);
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
                }
            }
            if (isAnnotationRendered) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation, null, true);
            }
            else {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            var canvas1 = this.getElement('_annotationCanvas_' + pageIndex);
            var commonStyle = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
            if (canvas1) {
                var bounds = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex, this.pdfViewer.annotationSelectorSettings);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            if (isAnnotationRendered) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex, true);
            }
            else {
                this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
            }
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, isAnnotationRendered);
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected && this.pdfViewer.annotationModule.annotationPageIndex === pageIndex) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.renderAnnotations = function (pageIndex) {
        // tslint:disable-next-line
        var data = {};
        if (this.documentAnnotationCollections) {
            var isAnnotationAdded = false;
            for (var i = 0; i < this.annotationRenderredList.length; i++) {
                if (this.annotationRenderredList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            // tslint:disable-next-line
            var pageAnnotations = this.documentAnnotationCollections[pageIndex];
            if (pageAnnotations && !isAnnotationAdded) {
                data.shapeAnnotation = pageAnnotations.shapeAnnotation;
                data.measureShapeAnnotation = pageAnnotations.measureShapeAnnotation;
                data.textMarkupAnnotation = pageAnnotations.textMarkupAnnotation;
                data.freeTextAnnotation = pageAnnotations.freeTextAnnotation;
                data.stampAnnotations = pageAnnotations.stampAnnotations;
                data.stickyNotesAnnotation = pageAnnotations.stickyNotesAnnotation;
                data.signatureAnnotation = pageAnnotations.signatureAnnotation;
                data.signatureInkAnnotation = pageAnnotations.signatureInkAnnotation;
                this.annotationRenderredList.push(pageIndex);
            }
        }
        if (this.isAnnotationCollectionRemoved) {
            data.shapeAnnotation = [];
            data.measureShapeAnnotation = [];
            data.textMarkupAnnotation = [];
            data.freeTextAnnotation = [];
            data.stampAnnotations = [];
            data.stickyNotesAnnotation = [];
            data.signatureInkAnnotation = [];
        }
        if (this.isTextMarkupAnnotationModule() || this.isShapeBasedAnnotationsEnabled()) {
            if (this.isStampAnnotationModule()) {
                // tslint:disable-next-line
                var stampData = data['stampAnnotations'];
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(stampData, pageIndex);
            }
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.renderAnnotations(pageIndex, data.shapeAnnotation, data.measureShapeAnnotation, data.textMarkupAnnotation);
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(data.stickyNotesAnnotation, pageIndex);
        }
        if (this.pdfViewer.textSearchModule) {
            if (this.pdfViewer.textSearchModule.isTextSearch) {
                this.pdfViewer.textSearchModule.highlightOtherOccurrences(pageIndex);
            }
        }
        if (this.isImportAction) {
            var isAnnotationAdded = false;
            for (var i = 0; i < this.annotationPageList.length; i++) {
                if (this.annotationPageList[i] === pageIndex) {
                    isAnnotationAdded = true;
                }
            }
            if (!isAnnotationAdded) {
                if (this.importedAnnotation) {
                    this.drawPageAnnotations(this.importedAnnotation, pageIndex, true);
                    this.annotationPageList[this.annotationPageList.length] = pageIndex;
                }
            }
        }
        if (this.isShapeBasedAnnotationsEnabled()) {
            var canvas1 = this.getElement('_annotationCanvas_' + pageIndex);
            var commonStyle = 'position:absolute;top:0px;left:0px;overflow:hidden;pointer-events:none;';
            if (canvas1) {
                var bounds = canvas1.getBoundingClientRect();
                renderAdornerLayer(bounds, commonStyle, canvas1, pageIndex, this.pdfViewer);
                this.pdfViewer.renderSelector(pageIndex);
            }
        }
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.selectCommentsAnnotation(pageIndex);
        }
        if (this.isFreeTextAnnotationModule() && data.freeTextAnnotation) {
            this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(data.freeTextAnnotation, pageIndex);
        }
        if (data && data.signatureAnnotation) {
            this.signatureModule.renderExistingSignature(data.signatureAnnotation, pageIndex, false);
        }
        if (this.isInkAnnotationModule() && data && data.signatureInkAnnotation) {
            this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(data.signatureInkAnnotation, pageIndex, false);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.isAnnotationSelected) {
            this.pdfViewer.annotationModule.selectAnnotationFromCodeBehind();
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.renderTextContent = function (data, pageIndex) {
        // tslint:disable-next-line
        var texts = data['textContent'];
        // tslint:disable-next-line
        var bounds = data['textBounds'];
        // tslint:disable-next-line
        var rotation = data['rotation'];
        var textLayer = this.getElement('_textLayer_' + pageIndex);
        if (!textLayer) {
            // tslint:disable-next-line:max-line-length
            textLayer = this.textLayer.addTextLayer(pageIndex, this.getPageWidth(pageIndex), this.getPageHeight(pageIndex), this.getElement('_pageDiv_' + pageIndex));
        }
        if (textLayer && texts && bounds) {
            textLayer.style.display = 'block';
            if (textLayer.childNodes.length === 0) {
                this.textLayer.renderTextContents(pageIndex, texts, bounds, rotation);
            }
            else {
                this.textLayer.resizeTextContents(pageIndex, texts, bounds, rotation, true);
            }
        }
    };
    PdfViewerBase.prototype.renderPageContainer = function (pageNumber, pageWidth, pageHeight, topValue) {
        // tslint:disable-next-line:max-line-length
        var pageDiv = createElement('div', { id: this.pdfViewer.element.id + '_pageDiv_' + pageNumber, className: 'e-pv-page-div', attrs: { 'tabindex': '0' } });
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            pageDiv.style.width = (this.highestWidth * this.getZoomFactor()) + 'px';
        }
        else {
            pageDiv.style.width = pageWidth + 'px';
        }
        pageDiv.style.height = pageHeight + 'px';
        if (this.pdfViewer.enableRtl) {
            pageDiv.style.right = this.updateLeftPosition(pageNumber) + 'px';
        }
        else {
            pageDiv.style.left = this.updateLeftPosition(pageNumber) + 'px';
        }
        pageDiv.style.top = topValue + 'px';
        this.pageContainer.appendChild(pageDiv);
        this.pageContainer.style.width = this.viewerContainer.clientWidth + 'px';
        this.createWaitingPopup(pageNumber);
        this.orderPageDivElements(pageDiv, pageNumber);
        this.renderPageCanvas(pageDiv, pageWidth, pageHeight, pageNumber, 'block');
        if (Browser.isDevice && !this.isThumb) {
            this.updateMobileScrollerPosition();
        }
    };
    PdfViewerBase.prototype.renderPDFInformations = function () {
        if (this.pdfViewer.thumbnailViewModule && !Browser.isDevice) {
            this.pdfViewer.thumbnailViewModule.createRequestForThumbnails();
        }
        if (this.pdfViewer.bookmarkViewModule) {
            this.pdfViewer.bookmarkViewModule.createRequestForBookmarks();
        }
        if (this.pdfViewer.annotationModule) {
            if (this.pdfViewer.toolbarModule) {
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.initializeAcccordionContainer();
            }
            if (this.pdfViewer.isCommandPanelOpen) {
                this.pdfViewer.annotation.showCommentsPanel();
            }
            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.createRequestForComments();
        }
    };
    PdfViewerBase.prototype.orderPageDivElements = function (pageDiv, pageIndex) {
        var nextElement = this.getElement('_pageDiv_' + (pageIndex + 1));
        if (nextElement) {
            this.pageContainer.insertBefore(pageDiv, nextElement);
        }
        else {
            this.pageContainer.appendChild(pageDiv);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    PdfViewerBase.prototype.renderPageCanvas = function (pageDiv, pageWidth, pageHeight, pageNumber, displayMode) {
        var pageCanvas = createElement('canvas', { id: this.pdfViewer.element.id + '_pageCanvas_' + pageNumber, className: 'e-pv-page-canvas' });
        pageCanvas.width = pageWidth;
        pageCanvas.height = pageHeight;
        pageCanvas.style.display = displayMode;
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            pageCanvas.style.marginLeft = 'auto';
            pageCanvas.style.marginRight = 'auto';
        }
        pageDiv.appendChild(pageCanvas);
        if (this.pdfViewer.textSearchModule || this.pdfViewer.textSelectionModule || this.pdfViewer.annotationModule) {
            this.textLayer.addTextLayer(pageNumber, pageWidth, pageHeight, pageDiv);
        }
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotation) {
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.annotationModule.createAnnotationLayer(pageDiv, pageWidth, pageHeight, pageNumber, displayMode);
        }
        return pageCanvas;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.applyElementStyles = function (pageCanvas, pageNumber) {
        if (this.isMixedSizeDocument && pageCanvas) {
            var canvasElement = document.getElementById(this.pdfViewer.element.id + '_pageCanvas_' + pageNumber);
            var oldCanvas = document.getElementById(this.pdfViewer.element.id + '_oldCanvas_' + pageNumber);
            if (pageCanvas && canvasElement && canvasElement.offsetLeft > 0) {
                pageCanvas.style.marginLeft = canvasElement.offsetLeft + 'px';
                pageCanvas.style.marginRight = canvasElement.offsetLeft + 'px';
            }
            else if (oldCanvas && oldCanvas.offsetLeft > 0) {
                pageCanvas.style.marginLeft = oldCanvas.offsetLeft + 'px';
                pageCanvas.style.marginRight = oldCanvas.offsetLeft + 'px';
            }
            else {
                pageCanvas.style.marginLeft = 'auto';
                pageCanvas.style.marginRight = 'auto';
            }
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.updateLeftPosition = function (pageIndex) {
        var leftPosition;
        var width = this.viewerContainer.getBoundingClientRect().width;
        if (width === 0) {
            width = parseFloat(this.pdfViewer.width.toString());
        }
        // tslint:disable-next-line:max-line-length
        if (this.isMixedSizeDocument && this.highestWidth > 0) {
            leftPosition = (width - (this.highestWidth * this.getZoomFactor())) / 2;
        }
        else {
            leftPosition = (width - this.getPageWidth(pageIndex)) / 2;
        }
        var isLandscape = false;
        if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
            isLandscape = true;
        }
        // tslint:disable-next-line:max-line-length
        if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
            var leftValue = leftPosition;
            if (leftPosition > 0 && Browser.isDevice) {
                leftPosition = leftPosition;
            }
            else {
                leftPosition = this.pageLeft;
            }
            if ((leftPosition > 0) && this.isMixedSizeDocument) {
                if (leftValue > 0) {
                    leftPosition = leftValue;
                }
            }
        }
        return leftPosition;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.applyLeftPosition = function (pageIndex) {
        var leftPosition;
        if (this.pageSize[pageIndex]) {
            if (this.isMixedSizeDocument && this.highestWidth > 0) {
                // tslint:disable-next-line:max-line-length
                leftPosition = (this.viewerContainer.getBoundingClientRect().width - (this.highestWidth * this.getZoomFactor())) / 2;
            }
            else {
                // tslint:disable-next-line:max-line-length
                leftPosition = (this.viewerContainer.getBoundingClientRect().width - this.pageSize[pageIndex].width * this.getZoomFactor()) / 2;
            }
            var isLandscape = false;
            if (this.pageSize[pageIndex].width > this.pageSize[pageIndex].height) {
                isLandscape = true;
            }
            // tslint:disable-next-line:max-line-length
            if (leftPosition < 0 || (this.pdfViewer.magnificationModule ? ((this.pdfViewer.magnificationModule.isAutoZoom && this.getZoomFactor() < 1) || this.pdfViewer.magnificationModule.fitType === 'fitToWidth') : false)) {
                var leftValue = leftPosition;
                leftPosition = this.pageLeft;
                // tslint:disable-next-line:max-line-length
                if ((leftValue > 0) && this.isMixedSizeDocument) {
                    leftPosition = leftValue;
                }
            }
            // tslint:disable-next-line:max-line-length
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            if (pageDiv) {
                if (!this.pdfViewer.enableRtl) {
                    pageDiv.style.left = leftPosition + 'px';
                }
                else {
                    pageDiv.style.right = leftPosition + 'px';
                }
            }
        }
    };
    PdfViewerBase.prototype.updatePageHeight = function (viewerHeight, toolbarHeight) {
        return ((viewerHeight - toolbarHeight) / viewerHeight) * 100 + '%';
    };
    PdfViewerBase.prototype.initiatePageViewScrollChanged = function () {
        if (this.scrollHoldTimer) {
            clearTimeout(this.scrollHoldTimer);
        }
        this.scrollHoldTimer = null;
        if ((this.scrollPosition * this.getZoomFactor()) !== this.viewerContainer.scrollTop) {
            this.scrollPosition = this.viewerContainer.scrollTop;
            this.pageViewScrollChanged(this.currentPageNumber);
        }
    };
    PdfViewerBase.prototype.renderCountIncrement = function () {
        if (this.pdfViewer.magnificationModule) {
            this.pdfViewer.magnificationModule.renderCountIncrement();
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.pageViewScrollChanged = function (currentPageNumber) {
        if (this.isPanMode) {
            if (this.renderedPagesList.indexOf(currentPageNumber - 1) === -1) {
                this.reRenderedCount = 0;
            }
        }
        else {
            this.reRenderedCount = 0;
        }
        var currentPageIndex = currentPageNumber - 1;
        if (currentPageNumber !== this.previousPage && currentPageNumber <= this.pageCount) {
            var isSkip = false;
            if (this.isDataExits && !this.getStoredData(currentPageIndex)) {
                isSkip = true;
            }
            if (this.renderedPagesList.indexOf(currentPageIndex) === -1 && !this.getMagnified() && !isSkip) {
                this.createRequestForRender(currentPageIndex);
                this.renderCountIncrement();
            }
        }
        if (!(this.getMagnified() || this.getPagesPinchZoomed())) {
            var previous = currentPageIndex - 1;
            var isSkip = false;
            var canvas = this.getElement('_pageCanvas_' + previous);
            if (this.isDataExits && !this.getStoredData(previous)) {
                isSkip = true;
            }
            if (canvas !== null && !isSkip) {
                if (this.renderedPagesList.indexOf(previous) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(previous);
                    this.renderCountIncrement();
                }
            }
            if (this.isMinimumZoom) {
                this.renderPreviousPagesInScroll(previous);
            }
            var next = currentPageIndex + 1;
            var pageHeight = 0;
            if (next < this.pageCount) {
                pageHeight = this.getPageHeight(next);
                if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(next);
                    this.renderCountIncrement();
                    while (this.viewerContainer.clientHeight > pageHeight) {
                        next = next + 1;
                        if (next < this.pageCount) {
                            this.renderPageElement(next);
                            this.createRequestForRender(next);
                            pageHeight += this.getPageHeight(next);
                            this.renderCountIncrement();
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
    };
    PdfViewerBase.prototype.renderPreviousPagesInScroll = function (pageIndex) {
        var next = pageIndex - 1;
        var pageNumber = next - 1;
        if (next > 0) {
            if (this.renderedPagesList.indexOf(next) === -1 && !this.getMagnified()) {
                this.createRequestForRender(next);
                this.renderCountIncrement();
            }
            if (pageNumber > 0) {
                if (this.renderedPagesList.indexOf(pageNumber) === -1 && !this.getMagnified()) {
                    this.createRequestForRender(pageNumber);
                    this.renderCountIncrement();
                }
            }
        }
    };
    PdfViewerBase.prototype.downloadDocument = function (blobUrl) {
        blobUrl = URL.createObjectURL(blobUrl);
        var anchorElement = createElement('a');
        if (anchorElement.click) {
            anchorElement.href = blobUrl;
            anchorElement.target = '_parent';
            if ('download' in anchorElement) {
                anchorElement.download = this.pdfViewer.downloadFileName;
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
        }
        else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
        }
    };
    PdfViewerBase.prototype.downloadExportAnnotationJson = function (blobUrl) {
        blobUrl = URL.createObjectURL(blobUrl);
        var anchorElement = createElement('a');
        if (anchorElement.click) {
            anchorElement.href = blobUrl;
            anchorElement.target = '_parent';
            if ('download' in anchorElement) {
                if (this.pdfViewer.exportAnnotationFileName !== null) {
                    anchorElement.download = this.pdfViewer.exportAnnotationFileName.split('.')[0] + '.json';
                }
                else {
                    anchorElement.download = this.pdfViewer.fileName.split('.')[0] + '.json';
                }
            }
            (document.body || document.documentElement).appendChild(anchorElement);
            anchorElement.click();
            anchorElement.parentNode.removeChild(anchorElement);
            this.pdfViewer.fireExportSuccess(blobUrl, anchorElement.download);
        }
        else {
            if (window.top === window &&
                blobUrl.split('#')[0] === window.location.href.split('#')[0]) {
                var padCharacter = blobUrl.indexOf('?') === -1 ? '?' : '&';
                blobUrl = blobUrl.replace(/#|$/, padCharacter + '$&');
            }
            window.open(blobUrl, '_parent');
            this.pdfViewer.fireExportSuccess(blobUrl, this.pdfViewer.fileName.split('.')[0] + '.json');
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.exportFormFields = function (path) {
        this.createRequestForExportFormfields(false, path);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.importFormFields = function (source) {
        this.createRequestForImportingFormfields(source);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.createRequestForExportFormfields = function (isObject, path) {
        var _this = this;
        var proxy = this;
        var promise = new Promise(function (resolve, reject) {
            // tslint:disable-next-line
            var jsonObject = proxy.createFormfieldsJsonData();
            proxy.pdfViewer.fireFormExportStarted(jsonObject.pdfAnnotation);
            jsonObject.action = 'ExportFormFields';
            // tslint:disable-next-line
            jsonObject['hashId'] = proxy.hashId;
            // tslint:disable-next-line
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
            if (path && path !== '' && !isObject) {
                // tslint:disable-next-line
                jsonObject['filePath'] = path;
            }
            // tslint:disable-next-line
            jsonObject['elementId'] = _this.pdfViewer.element.id;
            // tslint:disable-next-line:max-line-length
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                jsonObject.document = proxy.jsonDocumentId;
            }
            var url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportFormFields;
            proxy.exportFormFieldsRequestHandler = new AjaxHandler(_this.pdfViewer);
            proxy.exportFormFieldsRequestHandler.url = url;
            proxy.exportFormFieldsRequestHandler.mode = true;
            proxy.exportFormFieldsRequestHandler.responseType = 'text';
            proxy.exportFormFieldsRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onSuccess = function (result) {
                // tslint:disable-next-line
                var data = result.data;
                if (data) {
                    if (data) {
                        if (isObject) {
                            // tslint:disable-next-line
                            var annotationJson = decodeURIComponent(escape(atob(data.split(',')[1])));
                            resolve(annotationJson);
                        }
                        else if (data.split('base64,')[1]) {
                            var blobUrl = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                            if (Browser.isIE || Browser.info.name === 'edge') {
                                window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0]);
                            }
                            else {
                                proxy.downloadExportAnnotationJson(blobUrl);
                            }
                        }
                    }
                }
            };
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onFailure = function (result) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // tslint:disable-next-line
            proxy.exportFormFieldsRequestHandler.onError = function (result) {
                proxy.pdfViewer.fireFormExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
        });
        if (isObject) {
            return promise;
        }
        else {
            return true;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.createRequestForImportingFormfields = function (source) {
        var proxy = this;
        // tslint:disable-next-line
        var jsonObject = {};
        if (typeof source === 'object') {
            jsonObject.data = JSON.stringify(source);
        }
        else {
            jsonObject.data = source;
            // tslint:disable-next-line
            jsonObject['fileName'] = proxy.pdfViewer.fileName;
        }
        proxy.pdfViewer.fireFormImportStarted(source);
        // tslint:disable-next-line
        jsonObject.action = 'ImportFormFields';
        // tslint:disable-next-line
        jsonObject['hashId'] = proxy.hashId;
        // tslint:disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        if (proxy.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.document = proxy.jsonDocumentId;
        }
        var url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importFormFields;
        proxy.importFormFieldsRequestHandler = new AjaxHandler(this.pdfViewer);
        proxy.importFormFieldsRequestHandler.url = url;
        proxy.importFormFieldsRequestHandler.mode = true;
        proxy.importFormFieldsRequestHandler.responseType = 'text';
        proxy.importFormFieldsRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onSuccess = function (result) {
            // tslint:disable-next-line
            var data = result.data;
            if (data && data !== 'null') {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                        if (typeof data !== 'object') {
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                            data = null;
                        }
                    }
                    catch (error) {
                        proxy.pdfViewer.fireFormImportFailed(source, proxy.pdfViewer.localeObj.getConstant('File not found'));
                        proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importFormFields);
                        data = null;
                    }
                }
                proxy.pdfViewer.fireFormImportSuccess(source.pdfAnnotation);
                window.sessionStorage.removeItem(this.documentId + '_formfields');
                proxy.saveFormfieldsData(data);
                for (var i = 0; i < proxy.renderedPagesList.length; i++) {
                    this.pdfViewer.formFieldsModule.renderFormFields(i);
                }
            }
            else {
                proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
                proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
            }
        };
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
        // tslint:disable-next-line
        proxy.importFormFieldsRequestHandler.onError = function (result) {
            proxy.pdfViewer.fireFormImportFailed(source, result.statusText);
        };
    };
    /**
     * @public
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.createFormfieldsJsonData = function () {
        // tslint:disable-next-line
        var jsonObject = {};
        if (this.pdfViewer.formFieldsModule) {
            var fieldsData = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // tslint:disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        return jsonObject;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.constructJsonDownload = function () {
        // tslint:disable-next-line
        var jsonObject = { hashId: this.hashId };
        if (this.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.documentId = this.jsonDocumentId;
        }
        this.importPageList = [];
        if (this.pdfViewer.annotationModule) {
            this.saveImportedAnnotations();
        }
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
            // tslint:disable-next-line
            jsonObject['textMarkupAnnotations'] = textMarkupAnnotationCollection;
        }
        if (this.isShapeAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var shapeAnnotations = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
            // tslint:disable-next-line
            jsonObject['shapeAnnotations'] = shapeAnnotations;
        }
        if (this.isCalibrateAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var calibrateAnnotations = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
            // tslint:disable-next-line
            jsonObject['measureShapeAnnotations'] = calibrateAnnotations;
        }
        if (this.isStampAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var stampAnnotationCollection = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
            // tslint:disable-next-line
            jsonObject['stampAnnotations'] = stampAnnotationCollection;
        }
        if (this.isCommentAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var stickyAnnotationCollection = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
            // tslint:disable-next-line
            jsonObject['stickyNotesAnnotation'] = stickyAnnotationCollection;
        }
        if (this.isImportAction) {
            var importList = JSON.stringify(this.importPageList);
            // tslint:disable-next-line
            jsonObject['importPageList'] = importList;
        }
        if (this.pdfViewer.formFieldsModule) {
            var fieldsData = this.pdfViewer.formFieldsModule.downloadFormFieldsData();
            // tslint:disable-next-line
            jsonObject['fieldsData'] = fieldsData;
        }
        var signatureData = this.signatureModule.saveSignature();
        // tslint:disable-next-line
        jsonObject['signatureData'] = signatureData;
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            jsonObject['isSignatureEdited'] = this.pdfViewer.isSignatureEditable;
        }
        if (this.isFreeTextAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            var freeTextAnnotationCollection = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
            // tslint:disable-next-line
            jsonObject['freeTextAnnotation'] = freeTextAnnotationCollection;
        }
        if (this.isInkAnnotationModule()) {
            var inkSignatureData = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
            // tslint:disable-next-line
            jsonObject['inkSignatureData'] = inkSignatureData;
        }
        // tslint:disable-next-line
        jsonObject['action'] = 'Download';
        // tslint:disable-next-line
        jsonObject['elementId'] = this.pdfViewer.element.id;
        return jsonObject;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isFreeTextAnnotationModule = function () {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.freeTextAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.createRequestForDownload = function () {
        var proxy = this;
        proxy.pdfViewer.fireDownloadStart(proxy.pdfViewer.downloadFileName);
        // tslint:disable-next-line
        var jsonObject = this.constructJsonDownload();
        this.dowonloadRequestHandler = new AjaxHandler(this.pdfViewer);
        this.dowonloadRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.download;
        this.dowonloadRequestHandler.responseType = 'text';
        if (this.validateForm && this.pdfViewer.enableFormFieldsValidation) {
            this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
            this.validateForm = false;
        }
        else {
            this.dowonloadRequestHandler.send(jsonObject);
        }
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onSuccess = function (result) {
            // tslint:disable-next-line
            var data = result.data;
            if (data) {
                if (typeof data !== 'object' && data.indexOf('data:application/pdf') === -1) {
                    proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.download);
                    data = null;
                }
                if (typeof data === 'object') {
                    data = JSON.parse(data);
                }
                if (data) {
                    var blobUrl = proxy.createBlobUrl(data.split('base64,')[1], 'application/pdf');
                    if (Browser.isIE || Browser.info.name === 'edge') {
                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.downloadFileName);
                    }
                    else {
                        proxy.downloadDocument(blobUrl);
                    }
                    proxy.pdfViewer.fireDownloadEnd(proxy.pdfViewer.downloadFileName, data);
                }
                proxy.updateDocumentAnnotationCollections();
            }
            else {
                proxy.pdfViewer.fireDownloadEnd(proxy.pdfViewer.downloadFileName, 'PDF Document saved in server side successfully');
            }
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
        // tslint:disable-next-line
        this.dowonloadRequestHandler.onError = function (result) {
            proxy.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.download);
        };
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.getTileCount = function (pageWidth) {
        if (pageWidth && typeof pageWidth === 'number') {
            var defaultWidth = 816;
            var tileCount = 1;
            if (this.getZoomFactor() > 2 && pageWidth <= 1200) {
                tileCount = 2;
            }
            else {
                tileCount = pageWidth / defaultWidth;
            }
            // tslint:disable-next-line:radix
            var tileValue = parseInt(tileCount.toFixed());
            if (tileValue <= 0) {
                return 1;
            }
            else {
                if (this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    return tileValue;
                }
                else {
                    return 1;
                }
            }
        }
        else {
            return 1;
        }
    };
    PdfViewerBase.prototype.createRequestForRender = function (pageIndex) {
        var proxy = this;
        var canvas = proxy.getElement('_pageCanvas_' + pageIndex);
        var oldCanvas = proxy.getElement('_oldCanvas_' + pageIndex);
        var pageWidth = this.pageSize[pageIndex].width;
        var pageHeight = this.pageSize[pageIndex].height;
        var tilecanvas = this.getElement('_pageCanvas_' + pageIndex);
        // tslint:disable-next-line
        var viewPortWidth = 1200; // On diving the value greater than 1200 we will get the tile count as 2.
        // tslint:disable-next-line
        var viewPortHeight = proxy.pdfViewer.element.clientHeight > 0 ? proxy.pdfViewer.element.clientHeight : proxy.pdfViewer.element.style.height;
        // tslint:disable-next-line:radix
        viewPortWidth = parseInt(viewPortWidth);
        // tslint:disable-next-line:radix
        viewPortHeight = parseInt(viewPortHeight);
        var noTileX;
        var noTileY;
        var tileCount = this.getTileCount(pageWidth);
        if (canvas) {
            if (!isNaN(parseFloat(canvas.style.width)) || oldCanvas) {
                if (proxy.isInitialLoaded) {
                    proxy.showPageLoadingIndicator(pageIndex, false);
                }
            }
            // tslint:disable-next-line
            var data = proxy.getStoredData(pageIndex);
            var isPageRequestSent = this.pageRequestSent(pageIndex);
            noTileX = noTileY = tileCount;
            var tileSettings = proxy.pdfViewer.tileRenderingSettings;
            if (tileSettings.enableTileRendering && tileSettings.x > 0 && tileSettings.y > 0) {
                if ((viewPortWidth < pageWidth || this.getZoomFactor() > 2)) {
                    noTileX = tileSettings.x;
                    noTileY = tileSettings.y;
                }
            }
            proxy.tileRequestCount = noTileX * noTileY;
            if (data && (viewPortWidth < pageWidth || this.getZoomFactor() > 2) && tileSettings.enableTileRendering) {
                for (var k = 0; k < noTileX; k++) {
                    for (var l = 0; l < noTileY; l++) {
                        if (k === 0 && l === 0) {
                            continue;
                        }
                        var zoomFactor = this.retrieveCurrentZoomFactor();
                        var data_1 = JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor));
                        if (!data_1) {
                            window.sessionStorage.removeItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
                            data_1 = null;
                        }
                    }
                }
            }
            if (data && data.uniqueId === proxy.documentId) {
                canvas.style.backgroundColor = '#fff';
                if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !this.pageSize[pageIndex]) {
                    return;
                }
                var zoomFactor = this.retrieveCurrentZoomFactor();
                if (zoomFactor > 2 && pageWidth <= 1200) {
                    viewPortWidth = 700;
                }
                else {
                    viewPortWidth = 1200;
                }
                if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    viewPortWidth = 1200;
                }
                if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    proxy.renderPage(data, pageIndex);
                }
                else {
                    proxy.isTileImageRendered = true;
                    proxy.tileRenderCount = 0;
                    proxy.tileRenderPage(data, pageIndex);
                    for (var k = 0; k < noTileX; k++) {
                        for (var l = 0; l < noTileY; l++) {
                            if (k === 0 && l === 0) {
                                continue;
                            }
                            var zoomFactor_1 = this.retrieveCurrentZoomFactor();
                            var data_2 = JSON.parse(this.getWindowSessionStorageTile(pageIndex, k, l, zoomFactor_1));
                            if (data_2) {
                                proxy.tileRenderPage(data_2, pageIndex);
                            }
                        }
                    }
                }
                data = null;
            }
            else if (!isPageRequestSent) {
                if (this.getPagesPinchZoomed()) {
                    proxy.showPageLoadingIndicator(pageIndex, false);
                }
                else {
                    proxy.showPageLoadingIndicator(pageIndex, true);
                }
                if (proxy.getPagesZoomed()) {
                    if (proxy.isInitialLoaded) {
                        proxy.showPageLoadingIndicator(pageIndex, false);
                    }
                }
                if (proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) {
                    return;
                }
                if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                    noTileX = 1;
                    noTileY = 1;
                }
                proxy.tileRenderCount = 0;
                proxy.isTileImageRendered = true;
                for (var x = 0; x < noTileX; x++) {
                    for (var y = 0; y < noTileY; y++) {
                        var jsonObject = void 0;
                        var zoomFactor = this.retrieveCurrentZoomFactor();
                        if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                            zoomFactor = 1;
                        }
                        if (zoomFactor > 2 && pageWidth <= 1200) {
                            viewPortWidth = 700;
                        }
                        else {
                            viewPortWidth = 1200;
                        }
                        if (!proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                            viewPortWidth = 1200;
                        }
                        // tslint:disable-next-line:max-line-length
                        jsonObject = {
                            xCoordinate: x, yCoordinate: y, viewPortWidth: viewPortWidth, viewPortHeight: viewPortHeight,
                            pageNumber: pageIndex, hashId: proxy.hashId, tilecount: tileCount, tileXCount: noTileX, tileYCount: noTileY,
                            // tslint:disable-next-line:max-line-length
                            zoomFactor: zoomFactor, action: 'RenderPdfPages', uniqueId: this.documentId, elementId: proxy.pdfViewer.element.id
                        };
                        if (this.jsonDocumentId) {
                            // tslint:disable-next-line
                            jsonObject.documentId = this.jsonDocumentId;
                        }
                        proxy.pageRequestHandler = new AjaxHandler(this.pdfViewer);
                        proxy.pageRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.renderPages;
                        proxy.pageRequestHandler.responseType = 'json';
                        proxy.pageRequestHandler.send(jsonObject);
                        proxy.requestLists.push(proxy.documentId + '_' + pageIndex + '_' + zoomFactor);
                        // tslint:disable-next-line
                        proxy.pageRequestHandler.onSuccess = function (result) {
                            if ((proxy.pdfViewer.magnification && proxy.pdfViewer.magnification.isPinchZoomed) || !proxy.pageSize[pageIndex]) {
                                return;
                            }
                            // tslint:disable-next-line
                            var data = result.data;
                            if (data) {
                                if (typeof data !== 'object') {
                                    try {
                                        data = JSON.parse(data);
                                    }
                                    catch (error) {
                                        proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.renderPages);
                                        data = null;
                                    }
                                }
                            }
                            if (data) {
                                while (typeof data !== 'object') {
                                    data = JSON.parse(data);
                                }
                                if (data.image && data.uniqueId === proxy.documentId) {
                                    var pageNumber = (data.pageNumber !== undefined) ? data.pageNumber : pageIndex;
                                    if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                        proxy.storeWinData(data, pageNumber);
                                    }
                                    else {
                                        proxy.storeWinData(data, pageNumber, data.tileX, data.tileY);
                                    }
                                    if ((viewPortWidth >= pageWidth) || !proxy.pdfViewer.tileRenderingSettings.enableTileRendering) {
                                        proxy.renderPage(data, pageNumber);
                                    }
                                    else {
                                        proxy.tileRenderPage(data, pageNumber);
                                    }
                                }
                            }
                        };
                        // tslint:disable-next-line
                        this.pageRequestHandler.onFailure = function (result) {
                            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                        };
                        // tslint:disable-next-line
                        this.pageRequestHandler.onError = function (result) {
                            proxy.openNotificationPopup();
                            // tslint:disable-next-line:max-line-length
                            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.renderPages);
                        };
                    }
                }
            }
            proxy.renderedPagesList.push(pageIndex);
        }
    };
    PdfViewerBase.prototype.pageRequestSent = function (pageIndex) {
        var zoomFactor = this.retrieveCurrentZoomFactor();
        var currentString = this.documentId + '_' + pageIndex + '_' + zoomFactor;
        if (this.requestLists && this.requestLists.indexOf(currentString) > -1) {
            return true;
        }
        return false;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.onControlError = function (status, errorMessage, action) {
        this.openNotificationPopup();
        this.pdfViewer.fireAjaxRequestFailed(status, errorMessage, action);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.getStoredData = function (pageIndex) {
        var zoomFactor = this.retrieveCurrentZoomFactor();
        if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
            zoomFactor = 1;
        }
        // tslint:disable-next-line
        var storedData = this.getWindowSessionStorage(pageIndex, zoomFactor) ? this.getWindowSessionStorage(pageIndex, zoomFactor) : this.getPinchZoomPage(pageIndex);
        // tslint:disable-next-line
        var data = null;
        if (storedData) {
            // tslint:disable-next-line
            data = storedData;
            if (!this.isPinchZoomStorage) {
                data = JSON.parse(storedData);
            }
            this.isPinchZoomStorage = false;
        }
        return data;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.storeWinData = function (data, pageIndex, tileX, tileY) {
        // tslint:disable-next-line
        var blobObj = this.createBlobUrl(data['image'].split('base64,')[1], 'image/png');
        var blobUrl = URL.createObjectURL(blobObj);
        // tslint:disable-next-line
        var storeObject;
        if (isNaN(tileX) && isNaN(tileY)) {
            storeObject = {
                // tslint:disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], hyperlinks: data['hyperlinks'], hyperlinkBounds: data['hyperlinkBounds'], linkAnnotation: data['linkAnnotation'], linkPage: data['linkPage'], annotationLocation: data['annotationLocation'],
                // tslint:disable-next-line
                textContent: data['textContent'], textBounds: data['textBounds'], pageText: data['pageText'], rotation: data['rotation'], scaleFactor: data['scaleFactor'], uniqueId: data['uniqueId'], zoomFactor: data['zoomFactor']
            };
            if (this.pageSize[pageIndex]) {
                // tslint:disable-next-line
                this.pageSize[pageIndex].rotation = parseFloat(data['rotation']);
            }
            // tslint:disable-next-line
            this.textLayer.characterBound[pageIndex] = data['characterBounds'];
        }
        else {
            storeObject = {
                // tslint:disable-next-line
                image: blobUrl, transformationMatrix: data['transformationMatrix'], tileX: tileX, tileY: tileY, zoomFactor: data['zoomFactor']
            };
        }
        // tslint:disable-next-line
        var viewPortWidth = 816;
        var pageWidth = 0;
        if (this.pageSize[pageIndex]) {
            pageWidth = this.pageSize[pageIndex].width;
        }
        this.manageSessionStorage(pageIndex, storeObject, tileX, tileY);
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.setCustomAjaxHeaders = function (request) {
        for (var i = 0; i < this.pdfViewer.ajaxRequestSettings.ajaxHeaders.length; i++) {
            // tslint:disable-next-line:max-line-length
            request.setRequestHeader(this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerName, this.pdfViewer.ajaxRequestSettings.ajaxHeaders[i].headerValue);
        }
    };
    PdfViewerBase.prototype.getPinchZoomPage = function (pageIndex) {
        // tslint:disable-next-line
        for (var key in this.pinchZoomStorage) {
            if (this.pinchZoomStorage.hasOwnProperty(key)) {
                if (this.pinchZoomStorage[key].index === pageIndex) {
                    this.isPinchZoomStorage = true;
                    return this.pinchZoomStorage[key].pinchZoomStorage;
                }
            }
        }
        return null;
    };
    PdfViewerBase.prototype.getWindowSessionStorage = function (pageIndex, zoomFactor) {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + zoomFactor);
    };
    PdfViewerBase.prototype.getWindowSessionStorageTile = function (pageIndex, tileX, tileY, zoomFactor) {
        return window.sessionStorage.getItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor);
    };
    PdfViewerBase.prototype.retrieveCurrentZoomFactor = function () {
        var zoomFactor = this.getZoomFactor();
        if (this.pdfViewer.enableZoomOptimization) {
            if ((zoomFactor) <= 1) {
                zoomFactor = 1;
            }
            else if ((zoomFactor) > 1 && zoomFactor <= 2) {
                zoomFactor = 2;
            }
            else if ((zoomFactor) > 2 && zoomFactor <= 3) {
                zoomFactor = 3;
            }
            else if ((zoomFactor) > 3 && zoomFactor <= 4) {
                zoomFactor = 4;
            }
            return zoomFactor;
        }
        else {
            if (zoomFactor <= 0) {
                zoomFactor = 1;
            }
            return zoomFactor;
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.manageSessionStorage = function (pageIndex, storeObject, tileX, tileY) {
        // tslint:disable-next-line
        var sessionSize = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
        var maxSessionSize = 5000;
        if (sessionSize >= maxSessionSize) {
            if (!this.isStorageExceed) {
                // tslint:disable-next-line
                var annotationList = [];
                for (var i = 0; i < window.sessionStorage.length; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] === 'annotations') {
                            // tslint:disable-next-line:max-line-length
                            this.annotationStorage[window.sessionStorage.key(i)] = window.sessionStorage.getItem(window.sessionStorage.key(i));
                            annotationList.push(window.sessionStorage.key(i));
                        }
                    }
                }
                if (annotationList) {
                    for (var i = 0; i < annotationList.length; i++) {
                        window.sessionStorage.removeItem(annotationList[i]);
                    }
                }
            }
            this.isStorageExceed = true;
            sessionSize = Math.round(JSON.stringify(window.sessionStorage).length / 1024);
            if (sessionSize >= 5000) {
                var storageLength = window.sessionStorage.length;
                if (storageLength > 200) {
                    storageLength = 200;
                }
                for (var i = 0; i < storageLength; i++) {
                    if (window.sessionStorage.key(i) && window.sessionStorage.key(i).split('_')[3]) {
                        if (window.sessionStorage.key(i).split('_')[3] !== 'annotations') {
                            window.sessionStorage.removeItem(window.sessionStorage.key(i));
                        }
                    }
                }
            }
        }
        var zoomFactor = this.retrieveCurrentZoomFactor();
        if (isNaN(tileX) && isNaN(tileY)) {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.restrictZoomRequest && !this.pdfViewer.tileRenderingSettings.enableTileRendering) {
                zoomFactor = 1;
            }
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + zoomFactor, JSON.stringify(storeObject));
            this.sessionStorage.push(this.documentId + '_' + pageIndex + '_' + zoomFactor);
        }
        else {
            // tslint:disable-next-line:max-line-length
            window.sessionStorage.setItem(this.documentId + '_' + pageIndex + '_' + tileX + '_' + tileY + '_' + zoomFactor, JSON.stringify(storeObject));
        }
    };
    PdfViewerBase.prototype.createBlobUrl = function (base64String, contentType) {
        var sliceSize = 512;
        var byteCharacters = atob(base64String);
        // tslint:disable-next-line
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            // tslint:disable-next-line
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            // tslint:disable-next-line
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        // tslint:disable-next-line
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    PdfViewerBase.prototype.getRandomNumber = function () {
        // tslint:disable-next-line
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line
            var random = Math.random() * 16 | 0, v = c == 'x' ? random : (random & 0x3 | 0x8);
            return random.toString(16);
        });
    };
    PdfViewerBase.prototype.createGUID = function () {
        // tslint:disable-next-line:max-line-length
        return 'Sync_PdfViewer_' + this.getRandomNumber();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isClickedOnScrollBar = function (event, isNeedToSet) {
        var isScrollBar = false;
        if (isNeedToSet) {
            this.setScrollDownValue(event.type, false);
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientWidth + this.viewerContainer.offsetLeft) < event.clientX && event.clientX < (this.viewerContainer.offsetWidth + this.viewerContainer.offsetLeft)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        // tslint:disable-next-line:max-line-length
        if ((this.viewerContainer.clientHeight + this.viewerContainer.offsetTop) < event.clientY && event.clientY < (this.viewerContainer.offsetHeight + this.viewerContainer.offsetTop)) {
            isScrollBar = true;
            if (isNeedToSet) {
                this.setScrollDownValue(event.type, true);
            }
        }
        return isScrollBar;
    };
    PdfViewerBase.prototype.setScrollDownValue = function (eventType, boolValue) {
        if (eventType === 'mousedown') {
            this.isScrollbarMouseDown = boolValue;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.disableTextSelectionMode = function () {
        this.isTextSelectionDisabled = true;
        this.viewerContainer.classList.remove('e-enable-text-selection');
        if (this.pdfViewer.textSelectionModule) {
            this.pdfViewer.textSelectionModule.clearTextSelection();
        }
        this.viewerContainer.classList.add('e-disable-text-selection');
        this.viewerContainer.addEventListener('selectstart', function () { return false; });
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getElement = function (idString) {
        return document.getElementById(this.pdfViewer.element.id + idString);
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageWidth = function (pageIndex) {
        return this.pageSize[pageIndex].width * this.getZoomFactor();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageHeight = function (pageIndex) {
        return this.pageSize[pageIndex].height * this.getZoomFactor();
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPageTop = function (pageIndex) {
        return this.pageSize[pageIndex].top * this.getZoomFactor();
    };
    PdfViewerBase.prototype.isAnnotationToolbarHidden = function () {
        if (this.pdfViewer.toolbarModule.annotationToolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isToolbarHidden;
        }
        else {
            return true;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getTextMarkupAnnotationMode = function () {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.isTextMarkupAnnotationMode;
        }
        else {
            return false;
        }
    };
    PdfViewerBase.prototype.isNewFreeTextAnnotation = function () {
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule) {
            if (!this.pdfViewer.annotationModule.freeTextAnnotationModule.isNewFreeTextAnnot) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    PdfViewerBase.prototype.getCurrentTextMarkupAnnotation = function () {
        if (this.isTextMarkupAnnotationModule()) {
            if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getSelectTextMarkupCurrentPage = function () {
        if (this.isTextMarkupAnnotationModule()) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule.selectTextMarkupCurrentPage;
        }
        else {
            return null;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getAnnotationToolStatus = function () {
        if (this.pdfViewer.toolbarModule) {
            return this.pdfViewer.toolbarModule.annotationToolbarModule.isAnnotationButtonsEnabled();
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.getPopupNoteVisibleStatus = function () {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.isPopupNoteVisible;
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isTextMarkupAnnotationModule = function () {
        if (this.pdfViewer.annotationModule) {
            return this.pdfViewer.annotationModule.textMarkupAnnotationModule;
        }
        else {
            return null;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isShapeAnnotationModule = function () {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.shapeAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isCalibrateAnnotationModule = function () {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.measureAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isStampAnnotationModule = function () {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stampAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isInkAnnotationModule = function () {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.inkAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isCommentAnnotationModule = function () {
        if (this.pdfViewer.annotation) {
            if (this.pdfViewer.annotation && this.pdfViewer.annotation.stickyNotesAnnotationModule) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.isShapeBasedAnnotationsEnabled = function () {
        // tslint:disable-next-line:max-line-length
        if (this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule() || this.isStampAnnotationModule() || this.isCommentAnnotationModule()) {
            return true;
        }
        else {
            return false;
        }
    };
    /** @private */
    PdfViewerBase.prototype.getMousePosition = function (e) {
        var touchArg;
        var offsetX;
        var offsetY;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = e;
            if (this.pdfViewer.annotation) {
                var pageDiv = this.getElement('_pageDiv_' + this.pdfViewer.annotation.getEventPageNumber(e));
                if (pageDiv) {
                    var pageCurrentRect = pageDiv.getBoundingClientRect();
                    offsetX = touchArg.changedTouches[0].clientX - pageCurrentRect.left;
                    offsetY = touchArg.changedTouches[0].clientY - pageCurrentRect.top;
                }
            }
        }
        else {
            if (e.target.classList.contains('e-pv-text') ||
                e.target.classList.contains('e-pv-hyperlink')) {
                offsetX = e.offsetX + e.target.offsetLeft;
                offsetY = e.offsetY + e.target.offsetTop;
            }
            else {
                offsetX = e.offsetX;
                offsetY = e.offsetY;
            }
        }
        return { x: offsetX, y: offsetY };
    };
    PdfViewerBase.prototype.getMouseEventArgs = function (position, args, evt, source) {
        args.position = position;
        var obj;
        var objects;
        if (!source) {
            if (this.action === 'Drag' || this.action === 'ConnectorSourceEnd' || this.action === 'SegmentEnd' ||
                this.action === 'OrthoThumb' || this.action === 'BezierSourceThumb' || this.action === 'BezierTargetThumb' ||
                this.action === 'ConnectorTargetEnd' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
                obj = this.pdfViewer.selectedItems;
                if (this.action === 'Drag' && obj && this.pdfViewer.selectedItems.annotations.length > 0) {
                    obj = findActiveElement(evt, this, this.pdfViewer);
                }
            }
            else {
                obj = findActiveElement(evt, this, this.pdfViewer);
            }
        }
        else {
            //   objects = this.diagram.findObjectsUnderMouse(this.currentPosition, source);
            obj = findActiveElement(evt, this, this.pdfViewer);
        }
        var wrapper;
        if (obj) {
            wrapper = obj.wrapper;
        }
        if (!source) {
            args.source = obj;
            args.sourceWrapper = wrapper;
        }
        else {
            args.target = obj;
            args.targetWrapper = wrapper;
        }
        args.actualObject = this.eventArgs.actualObject;
        //args.startTouches = this.touchStartList;
        //args.moveTouches = this.touchMoveList;
        return args;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.findToolToActivate = function (obj, position) {
        position = { x: position.x / this.getZoomFactor(), y: position.y / this.getZoomFactor() };
        var element = this.pdfViewer.selectedItems.wrapper;
        obj = obj;
        if (element && obj) {
            var selectorBnds = element.bounds; //let handle: SelectorModel = diagram.selectedItems;
            var paddedBounds = new Rect(selectorBnds.x, selectorBnds.y, selectorBnds.width, selectorBnds.height);
            if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' ||
                obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
                var conn = this.pdfViewer.selectedItems.annotations[0];
                if (conn) {
                    for (var i = 0; i < conn.vertexPoints.length; i++) {
                        if (contains(position, conn.vertexPoints[i], 10) && conn.leaderHeight !== 0) {
                            return 'ConnectorSegmentPoint_' + i;
                        }
                    }
                }
            }
            if (obj.shapeAnnotationType === 'Distance') {
                var leaderCount = 0;
                var newPoint1 = void 0;
                if (obj && obj.wrapper) {
                    for (var i = 0; i < obj.wrapper.children.length; i++) {
                        var elementAngle = Point.findAngle(obj.sourcePoint, obj.targetPoint);
                        // tslint:disable-next-line
                        var segment = obj.wrapper.children[i];
                        if (segment.id.indexOf('leader') > -1) {
                            var centerPoint = obj.wrapper.children[0].bounds.center;
                            if (leaderCount === 0) {
                                newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                                centerPoint = obj.sourcePoint;
                            }
                            else {
                                newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                                centerPoint = obj.targetPoint;
                            }
                            var matrix_3 = identityMatrix();
                            rotateMatrix(matrix_3, elementAngle, centerPoint.x, centerPoint.y);
                            var rotatedPoint = transformPointByMatrix(matrix_3, { x: newPoint1.x, y: newPoint1.y });
                            if (contains(position, rotatedPoint, 10)) {
                                return 'Leader' + leaderCount;
                            }
                            leaderCount++;
                        }
                    }
                }
            }
            var ten = 10 / this.getZoomFactor();
            var matrix = identityMatrix();
            rotateMatrix(matrix, obj.rotateAngle + element.parentTransform, element.offsetX, element.offsetY);
            //check for resizing tool
            var x = element.offsetX - element.pivot.x * element.actualSize.width;
            var y = element.offsetY - element.pivot.y * element.actualSize.height;
            var rotateThumb = {
                x: x + ((element.pivot.x === 0.5 ? element.pivot.x * 2 : element.pivot.x) * element.actualSize.width / 2),
                y: y - 30 / this.getZoomFactor()
            };
            rotateThumb = transformPointByMatrix(matrix, rotateThumb);
            if (obj.shapeAnnotationType === 'Stamp' && contains(position, rotateThumb, ten)) {
                return 'Rotate';
            }
            paddedBounds = this.inflate(ten, paddedBounds);
            if (paddedBounds.containsPoint(position, 0)) {
                var action = this.checkResizeHandles(this.pdfViewer, element, position, matrix, x, y);
                if (action) {
                    return action;
                }
            }
            if (this.pdfViewer.selectedItems.annotations.indexOf(obj) > -1) {
                return 'Drag';
            }
            return 'Select';
        }
        return this.pdfViewer.tool || 'Select';
    };
    PdfViewerBase.prototype.inflate = function (padding, bound) {
        bound.x -= padding;
        bound.y -= padding;
        bound.width += padding * 2;
        bound.height += padding * 2;
        return bound;
    };
    PdfViewerBase.prototype.checkResizeHandles = function (diagram, element, position, matrix, x, y) {
        var action;
        if (!action) {
            action = this.checkForResizeHandles(diagram, element, position, matrix, x, y);
        }
        if (action) {
            return action;
        }
        return null;
    };
    PdfViewerBase.prototype.checkForResizeHandles = function (diagram, element, position, matrix, x, y) {
        var forty = 40 / 1;
        var ten = 10 / 1;
        var selectedItems = diagram.selectedItems;
        var isStamp = false;
        var isSticky = false;
        var isNodeShape = false;
        var isInk = false;
        var resizerLocation = this.pdfViewer.annotationSelectorSettings.resizerLocation;
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp'
            || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Image' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature')) {
            isStamp = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'StickyNotes') {
            isSticky = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
            isInk = true;
        }
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle')) {
            isNodeShape = true;
        }
        if (!isSticky) {
            // tslint:disable-next-line:max-line-length
            if ((isInk || isStamp || (this.pdfViewer.selectedItems.annotations[0] && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature')) || ((element.actualSize.width >= forty && element.actualSize.height >= forty) && isNodeShape && (resizerLocation === 1 || resizerLocation === 3))) {
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height }), ten)) {
                    return 'ResizeSouthWest';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y }), ten)) {
                    return 'ResizeNorthEast';
                }
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y }), ten)) {
                    return 'ResizeNorthWest';
                }
            }
            // tslint:disable-next-line:max-line-length
            if (isInk || !isNodeShape || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 || (!(element.actualSize.width >= forty && element.actualSize.height >= forty) && resizerLocation === 1)))) {
                if (contains(
                // tslint:disable-next-line:max-line-length
                position, transformPointByMatrix(matrix, { x: x + element.actualSize.width, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeEast';
                }
                // tslint:disable-next-line:max-line-length
                if (contains(position, transformPointByMatrix(matrix, { x: x, y: y + element.actualSize.height / 2 }), ten) && !isStamp) {
                    return 'ResizeWest';
                }
                if (contains(
                // tslint:disable-next-line:max-line-length
                position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y + element.actualSize.height }), ten) && !isStamp) {
                    return 'ResizeSouth';
                }
                // tslint:disable-next-line:max-line-length
                if (contains(position, transformPointByMatrix(matrix, { x: x + element.actualSize.width / 2, y: y }), ten) && !isStamp) {
                    return 'ResizeNorth';
                }
            }
        }
        return null;
    };
    /** @private */
    PdfViewerBase.prototype.diagramMouseMove = function (evt) {
        this.currentPosition = this.getMousePosition(evt);
        this.pdfViewer.firePageMouseover(this.currentPosition.x, this.currentPosition.y);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        var obj = findActiveElement(evt, this, this.pdfViewer);
        if ((this.tool instanceof NodeDrawingTool) || (this.tool instanceof LineTool)) {
            obj = this.pdfViewer.drawingObject;
        }
        var target;
        if ((Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction)) {
            if (this.isMouseDown === false) {
                this.eventArgs = {};
                var sourceDrawingElement = null;
                if (obj) {
                    this.tool = this.getTool(this.action);
                    if (obj.wrapper) {
                        sourceDrawingElement = obj.wrapper.children[0];
                        if (sourceDrawingElement) {
                            target = obj;
                        }
                    }
                }
                var eventTarget = evt.target;
                this.action = this.findToolToActivate(obj, this.currentPosition);
                // tslint:disable-next-line
                if (obj && obj.annotationSettings && obj.annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = 'Select';
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouthWest' ||
                        // tslint:disable-next-line:max-line-length
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action === 'ResizeSouth' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = 'Select';
                        }
                    }
                }
                this.tool = this.getTool(this.action);
                this.setCursor(eventTarget, evt);
            }
            else {
                if (this.eventArgs && this.eventArgs.source) {
                    var eventTarget = evt.target;
                    this.updateDefaultCursor(this.eventArgs.source, eventTarget, evt);
                }
                else {
                    this.setCursor(evt.target, evt);
                }
                this.diagramMouseActionHelper(evt);
                if (this.tool) {
                    var currentObject = obj;
                    if (currentObject && currentObject.shapeAnnotationType === 'Path') {
                        this.tool = null;
                    }
                    if (currentObject && currentObject.shapeAnnotationType === 'FreeText') {
                        if (this.pdfViewer.freeTextSettings.allowEditTextOnly) {
                            var eventTarget = event.target;
                            eventTarget.style.cursor = 'default';
                            this.tool = null;
                        }
                    }
                    if (this.tool != null) {
                        this.tool.mouseMove(this.eventArgs);
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.updateDefaultCursor = function (source, target, event) {
        // tslint:disable-next-line:max-line-length
        if (source && source.pageIndex !== undefined && source.pageIndex !== this.activeElements.activePageID && target) {
            this.isPanMode ? target.style.cursor = 'grab' : target.style.cursor = 'default';
        }
        else {
            this.setCursor(target, event);
        }
    };
    /** @private */
    PdfViewerBase.prototype.diagramMouseLeave = function (evt) {
        this.currentPosition = this.getMousePosition(evt);
        if (this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        var shapeElement = findActiveElement(evt, this, this.pdfViewer);
        var mouseMoveforce = false;
        var target;
        if (Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction) {
            if (this.isMouseDown === false || mouseMoveforce) {
                this.eventArgs = {};
                var sourceElement = null;
                if (shapeElement) {
                    sourceElement = shapeElement.wrapper.children[0];
                    if (sourceElement) {
                        target = shapeElement;
                    }
                    mouseMoveforce = false;
                }
            }
            else {
                this.diagramMouseActionHelper(evt);
                // tslint:disable-next-line:max-line-length
                if (this.tool && this.action !== 'Drag' && this.pdfViewer.tool !== 'Stamp' && this.tool.currentElement && this.tool.currentElement.shapeAnnotationType !== 'Stamp') {
                    this.tool.mouseLeave(this.eventArgs);
                    this.tool = null;
                    if (this.pdfViewer.annotation) {
                        this.pdfViewer.annotationModule.renderAnnotations(this.previousPage, null, null, null);
                    }
                }
            }
            this.prevPosition = this.currentPosition;
        }
    };
    PdfViewerBase.prototype.diagramMouseActionHelper = function (evt) {
        this.eventArgs.position = this.currentPosition;
        if (this.action === 'Drag' &&
            this.eventArgs.source instanceof Selector) {
            this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt);
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt, this.eventArgs.source);
        this.inAction = true;
        this.initialEventArgs = null;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.setCursor = function (eventTarget, event) {
        var freeTextAnnotModule = this.pdfViewer.annotationModule.freeTextAnnotationModule;
        var cursorType;
        if (this.tool instanceof ResizeTool) {
            if (this.tool.corner === 'ResizeNorthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeNorthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeSouthWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'sw-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeSouthEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'se-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeNorth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'n-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeWest') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'w-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeEast') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'e-resize' : cursorType;
            }
            else if (this.tool.corner === 'ResizeSouth') {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 's-resize' : cursorType;
            }
        }
        else if (this.pdfViewer.enableHandwrittenSignature && this.isNewSignatureAdded && this.tool instanceof StampTool) {
            eventTarget.style.cursor = 'crosshair';
        }
        else if (this.tool instanceof MoveTool) {
            eventTarget.style.cursor = 'move';
            // tslint:disable-next-line:max-line-length
        }
        else if (this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool || (freeTextAnnotModule && freeTextAnnotModule.isNewAddedAnnot) || this.tool instanceof InkDrawingTool) {
            eventTarget.style.cursor = 'crosshair';
        }
        else if (this.tool instanceof ConnectTool) {
            if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader0')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'nw-resize' : cursorType;
            }
            else if (this.tool.endPoint && this.tool.endPoint.indexOf('Leader1')) {
                cursorType = this.setResizerCursorType();
                eventTarget.style.cursor = isNullOrUndefined(cursorType) ? 'ne-resize' : cursorType;
            }
            else if (this.tool.endPoint && this.tool.endPoint.indexOf('ConnectorSegmentPoint')) {
                eventTarget.style.cursor = 'sw-resize';
            }
        }
        else {
            if (eventTarget.classList.contains('e-pv-text')) {
                eventTarget.style.cursor = 'text';
            }
            else if (eventTarget.classList.contains('e-pv-hyperlink')) {
                eventTarget.style.cursor = 'pointer';
            }
            else if (this.isPanMode) {
                if (this.isViewerMouseDown && event.type === 'mousemove') {
                    eventTarget.style.cursor = 'grabbing';
                }
                else {
                    var obj = findActiveElement(event, this, this.pdfViewer);
                    if (obj && event.type === 'mousemove') {
                        eventTarget.style.cursor = 'pointer';
                        var currentObject = obj;
                        // tslint:disable-next-line
                        var currentPosition = this.getMousePosition(event);
                        // tslint:disable-next-line
                        var relativePosition = this.relativePosition(event);
                        // tslint:disable-next-line
                        var viewerPositions = { left: relativePosition.x, top: relativePosition.y };
                        // tslint:disable-next-line
                        var mousePositions = { left: currentPosition.x, top: currentPosition.y };
                        // tslint:disable-next-line
                        var annotationSettings = { opacity: currentObject.opacity, fillColor: currentObject.fillColor, strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness, author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                        // tslint:disable-next-line:max-line-length
                        this.isMousedOver = true;
                        this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex, currentObject.shapeAnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                    }
                    else {
                        eventTarget.style.cursor = 'grab';
                        if (this.isMousedOver) {
                            var pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                            this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                            this.isMousedOver = false;
                        }
                    }
                }
            }
            else {
                var obj = findActiveElement(event, this, this.pdfViewer);
                if (obj && this.pdfViewer.selectedItems.annotations.length === 0 && event.type === 'mousemove') {
                    var currentObject = obj;
                    // tslint:disable-next-line
                    var annotationObject = this.pdfViewer.nameTable[currentObject.id];
                    // tslint:disable-next-line:max-line-length
                    if (annotationObject.shapeAnnotationType !== 'HandWrittenSignature' && annotationObject.shapeAnnotationType !== 'Ink' && annotationObject.annotationSettings.isLock !== undefined) {
                        annotationObject.annotationSettings.isLock = JSON.parse(annotationObject.annotationSettings.isLock);
                    }
                    if (annotationObject.annotationSettings.isLock) {
                        eventTarget.style.cursor = 'default';
                    }
                    else {
                        eventTarget.style.cursor = 'pointer';
                    }
                    // tslint:disable-next-line
                    var currentPosition = this.getMousePosition(event);
                    // tslint:disable-next-line
                    var relativePosition = this.relativePosition(event);
                    // tslint:disable-next-line
                    var viewerPositions = { left: relativePosition.x, top: relativePosition.y };
                    // tslint:disable-next-line
                    var mousePositions = { left: currentPosition.x, top: currentPosition.y };
                    // tslint:disable-next-line
                    var annotationSettings = { opacity: currentObject.opacity, fillColor: currentObject.fillColor, strokeColor: currentObject.strokeColor, thicknes: currentObject.thickness, author: currentObject.author, subject: currentObject.subject, modifiedDate: currentObject.modifiedDate };
                    // tslint:disable-next-line:max-line-length
                    this.isMousedOver = true;
                    this.pdfViewer.fireAnnotationMouseover(currentObject.annotName, currentObject.pageIndex, currentObject.shapeAnnotationType, currentObject.bounds, annotationSettings, mousePositions, viewerPositions);
                }
                else {
                    if (this.isMousedOver) {
                        var pageIndex = this.pdfViewer.annotation.getEventPageNumber(event);
                        this.pdfViewer.fireAnnotationMouseLeave(pageIndex);
                        this.isMousedOver = false;
                    }
                    eventTarget.style.cursor = 'default';
                }
            }
        }
    };
    PdfViewerBase.prototype.setResizerCursorType = function () {
        var cursorType;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && isNullOrUndefined(this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType)) {
            if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'FreeText') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings) ? this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerCursorType : null;
            }
            else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Stamp') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings) ? this.pdfViewer.stampSettings.annotationSelectorSettings.resizerCursorType : null;
            }
            else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) ? this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerCursorType : null;
            }
            else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink') {
                // tslint:disable-next-line:max-line-length
                cursorType = !isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) ? this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerCursorType : null;
            }
            else if (!this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings) ? this.pdfViewer.lineSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings) ? this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings) ? this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings) ? this.pdfViewer.circleSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Polygon') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings) ? this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            }
            else if (this.pdfViewer.selectedItems.annotations[0].measureType) {
                if (this.pdfViewer.selectedItems.annotations[0].subject === 'Distance calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings) ? this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Perimeter calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings) ? this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Area calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings) ? this.pdfViewer.areaSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Radius calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings) ? this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerCursorType : null;
                }
                else if (this.pdfViewer.selectedItems.annotations[0].subject === 'Volume calculation') {
                    // tslint:disable-next-line:max-line-length
                    cursorType = !isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings) ? this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerCursorType : null;
                }
            }
        }
        else {
            cursorType = this.pdfViewer.selectedItems.annotations[0].annotationSelectorSettings.resizerCursorType;
        }
        if (!cursorType) {
            cursorType = this.pdfViewer.annotationSelectorSettings.resizerCursorType;
        }
        return cursorType;
    };
    /** @private */
    PdfViewerBase.prototype.getTool = function (action) {
        switch (action) {
            case 'Select':
                return new SelectTool(this.pdfViewer, this);
            case 'Drag':
                return new MoveTool(this.pdfViewer, this);
            case 'ResizeSouthEast':
            case 'ResizeSouthWest':
            case 'ResizeNorthEast':
            case 'ResizeNorthWest':
            case 'ResizeSouth':
            case 'ResizeNorth':
            case 'ResizeWest':
            case 'ResizeEast':
                return new ResizeTool(this.pdfViewer, this, action);
            case 'ConnectorSourceEnd':
            case 'ConnectorTargetEnd':
            case 'Leader':
            case 'ConnectorSegmentPoint':
                return new ConnectTool(this.pdfViewer, this, action);
            case 'DrawTool':
                return new NodeDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
            case 'Polygon':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Polygon');
            case 'Distance':
                return new LineTool(this.pdfViewer, this, 'Leader1', undefined);
            case 'Line':
                return new LineTool(this.pdfViewer, this, 'ConnectorSegmentPoint_1', this.pdfViewer.drawingObject);
            case 'Perimeter':
                return new PolygonDrawingTool(this.pdfViewer, this, 'Perimeter');
            case 'Rotate':
                return new RotateTool(this.pdfViewer, this);
            case 'Stamp':
                return new StampTool(this.pdfViewer, this);
            case 'Ink':
                return new InkDrawingTool(this.pdfViewer, this, this.pdfViewer.drawingObject);
        }
        if (action.indexOf('ConnectorSegmentPoint') > -1 || action.indexOf('Leader') > -1) {
            return new ConnectTool(this.pdfViewer, this, action);
        }
        return null;
    };
    /** @private */
    PdfViewerBase.prototype.diagramMouseUp = function (evt) {
        var touches;
        if (this.tool) {
            if (!this.inAction && evt.which !== 3) {
                if (this.action === 'Drag') {
                    this.action = 'Select';
                    var obj = findActiveElement(evt, this, this.pdfViewer);
                    var isMultipleSelect = true;
                }
            }
            var isGroupAction = void 0;
            if (!(this.tool instanceof PolygonDrawingTool) && !(this.tool instanceof LineTool) && !(this.tool instanceof NodeDrawingTool)) {
                this.inAction = false;
                this.isMouseDown = false;
            }
            this.currentPosition = this.getMousePosition(evt);
            if (this.tool) {
                this.eventArgs.position = this.currentPosition;
                this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt, this.eventArgs.source);
                var ctrlKey = this.isMetaKey(evt);
                var info = { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey };
                this.eventArgs.info = info;
                this.eventArgs.clickCount = evt.detail;
                this.tool.mouseUp(this.eventArgs);
                this.isAnnotationMouseDown = false;
                // tslint:disable-next-line:max-line-length
                if ((this.tool instanceof NodeDrawingTool || this.tool instanceof LineTool || this.tool instanceof PolygonDrawingTool) && !this.tool.dragging) {
                    this.inAction = false;
                    this.isMouseDown = false;
                }
                var obj = findActiveElement(evt, this, this.pdfViewer);
                if ((this.isShapeAnnotationModule() || this.isCalibrateAnnotationModule()) && !Browser.isDevice) {
                    this.pdfViewer.annotation.onShapesMouseup(obj, evt);
                }
                this.isAnnotationDrawn = false;
            }
        }
        var target = evt.target;
        // tslint:disable-next-line:max-line-length
        if (!touches && evt.cancelable && this.skipPreventDefault(target)) {
            evt.preventDefault();
        }
        this.eventArgs = {};
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.skipPreventDefault = function (target) {
        var isSkipped = false;
        var isSkip = false;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus) {
            isSkip = true;
        }
        // tslint:disable-next-line:max-line-length
        if (target && !target.classList.contains('e-pdfviewer-formFields')
            && !target.classList.contains('e-pdfviewer-ListBox') && !target.classList.contains('e-pdfviewer-signatureformFields')
            && !((target).className === 'free-text-input' && (target).tagName === 'TEXTAREA')
            && !isSkip && !((target).className === 'e-pv-hyperlink')) {
            isSkipped = true;
        }
        return isSkipped;
    };
    PdfViewerBase.prototype.isMetaKey = function (evt) {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.diagramMouseDown = function (evt) {
        var touches;
        touches = evt.touches;
        this.isMouseDown = true;
        this.isAnnotationAdded = false;
        this.currentPosition = this.prevPosition = this.getMousePosition(evt);
        this.eventArgs = {};
        var isStamp = false;
        if (this.pdfViewer.tool === 'Stamp') {
            this.pdfViewer.tool = '';
            isStamp = true;
        }
        var target;
        if (Browser.isDevice && this.pdfViewer.annotation) {
            this.activeElements.activePageID = this.pdfViewer.annotation.getEventPageNumber(evt);
        }
        var obj = findActiveElement(evt, this, this.pdfViewer);
        if (Browser.isDevice && obj) {
            evt.preventDefault();
        }
        if (this.pdfViewer.annotation && this.pdfViewer.enableStampAnnotations) {
            var stampModule = this.pdfViewer.annotationModule.stampAnnotationModule;
            if (stampModule && stampModule.isNewStampAnnot) {
                var stampObj = obj;
                if (stampObj === undefined && this.pdfViewer.selectedItems.annotations[0]) {
                    stampObj = this.pdfViewer.selectedItems.annotations[0];
                }
                if (stampObj) {
                    this.isViewerMouseDown = false;
                    stampObj.opacity = this.pdfViewer.stampSettings.opacity;
                    this.isNewStamp = true;
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.nodePropertyChange(stampObj, { opacity: this.pdfViewer.stampSettings.opacity });
                    this.pdfViewer.annotation.stampAnnotationModule.isStampAddMode = false;
                    if (stampObj.shapeAnnotationType === 'Image' && !this.isAlreadyAdded) {
                        this.stampAdded = true;
                        this.customStampCollection.push({ customStampName: stampObj.id, customStampImageSource: stampObj.data });
                    }
                    this.isAlreadyAdded = false;
                    stampModule.updateDeleteItems(stampObj.pageIndex, stampObj, stampObj.opacity);
                    stampModule.resetAnnotation();
                    stampModule.isNewStampAnnot = false;
                }
            }
        }
        if (this.isNewSignatureAdded) {
            this.signatureCount++;
            this.currentSignatureAnnot = null;
            var signObject = obj;
            if (signObject === undefined && this.pdfViewer.selectedItems.annotations[0]) {
                signObject = this.pdfViewer.selectedItems.annotations[0];
            }
            if (signObject) {
                this.signatureAdded = true;
                this.signatureModule.storeSignatureData(signObject.pageIndex, signObject);
                // tslint:disable-next-line
                var bounds = { left: signObject.bounds.x, top: signObject.bounds.y, width: signObject.bounds.width, height: signObject.bounds.height };
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.fireSignatureAdd(signObject.pageIndex, signObject.signatureName, signObject.shapeAnnotationType, bounds, signObject.opacity, signObject.strokeColor, signObject.thickness);
            }
            this.isNewSignatureAdded = false;
        }
        if (this.pdfViewer.annotationModule) {
            var freeTextAnnotModule = this.pdfViewer.annotationModule.freeTextAnnotationModule;
            // tslint:disable-next-line
            var currentObj = obj;
            if (freeTextAnnotModule.isNewFreeTextAnnot === true && !(currentObj && currentObj.shapeAnnotationType === 'FreeText')) {
                var canvas = void 0;
                // tslint:disable-next-line:max-line-length
                if (evt.target && (evt.target.id.indexOf('_text') > -1 || evt.target.id.indexOf('_annotationCanvas') > -1 || evt.target.classList.contains('e-pv-hyperlink')) && this.pdfViewer.annotation) {
                    var pageIndex = this.pdfViewer.annotation.getEventPageNumber(evt);
                    var diagram = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
                    if (diagram) {
                        var canvas1 = diagram.getBoundingClientRect();
                        var left = canvas1.x ? canvas1.x : canvas1.left;
                        var top_3 = canvas1.y ? canvas1.y : canvas1.top;
                        canvas = new Rect(left + 10, top_3 + 10, canvas1.width - 10, canvas1.height - 10);
                    }
                }
                if (touches) {
                    this.mouseX = touches[0].clientX;
                    this.mouseY = touches[0].clientY;
                }
                if (canvas && canvas.containsPoint({ x: this.mouseX, y: this.mouseY }) && freeTextAnnotModule.isNewAddedAnnot) {
                    freeTextAnnotModule.addInuptElemet(this.currentPosition);
                    if (this.pdfViewer.toolbar && this.pdfViewer.toolbar.annotationToolbarModule) {
                        // tslint:disable-next-line
                        var annotModule = this.pdfViewer.toolbar.annotationToolbarModule;
                        annotModule.primaryToolbar.deSelectItem(annotModule.freeTextEditItem);
                    }
                    evt.preventDefault();
                    freeTextAnnotModule.isNewAddedAnnot = false;
                }
            }
        }
        var sourceElement = null;
        if (obj) {
            sourceElement = obj.wrapper.children[0];
            if (sourceElement) {
                target = obj;
            }
        }
        if (!this.tool || (this.tool && !this.tool.drawingObject)) {
            if (!isStamp) {
                this.action = this.findToolToActivate(obj, this.currentPosition);
                // tslint:disable-next-line
                if (obj && obj.annotationSettings && obj.annotationSettings.isLock) {
                    if (this.action === 'Select') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = '';
                        }
                    }
                    if (this.action === 'Drag') {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Move', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = 'Select';
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.action === 'ResizeSouthEast' || this.action === 'ResizeNorthEast' || this.action === 'ResizeNorthWest' || this.action === 'ResizeSouth' ||
                        // tslint:disable-next-line:max-line-length
                        this.action === 'ResizeNorth' || this.action === 'ResizeWest' || this.action === 'ResizeEast' || this.action.includes('ConnectorSegmentPoint') || this.action.includes('Leader')) {
                        if (this.pdfViewer.annotationModule.checkAllowedInteractions('Resize', obj)) {
                            this.action = this.action;
                        }
                        else {
                            this.action = 'Select';
                        }
                    }
                }
                this.tool = this.getTool(this.action);
                if (!this.tool) {
                    this.action = this.pdfViewer.tool || 'Select';
                    this.tool = this.getTool(this.action);
                }
            }
            else {
                this.action = 'Select';
                this.tool = this.getTool(this.action);
            }
        }
        this.getMouseEventArgs(this.currentPosition, this.eventArgs, evt);
        this.eventArgs.position = this.currentPosition;
        if (this.tool) {
            this.isAnnotationMouseDown = false;
            this.isAnnotationMouseMove = false;
            this.tool.mouseDown(this.eventArgs);
            this.isAnnotationDrawn = true;
            this.signatureAdded = true;
        }
        if (this.pdfViewer.annotation) {
            this.pdfViewer.annotation.onAnnotationMouseDown();
        }
        this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
        this.initialEventArgs.position = this.currentPosition;
        this.initialEventArgs.info = this.eventArgs.info;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.exportAnnotationsAsObject = function () {
        var _this = this;
        if (this.pdfViewer.annotationModule) {
            var isAnnotations = this.updateExportItem();
            if (isAnnotations) {
                return new Promise(function (resolve, reject) {
                    _this.createRequestForExportAnnotations(true).then(function (value) {
                        resolve(value);
                    });
                });
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.exportFormFieldsAsObject = function () {
        var _this = this;
        if (this.pdfViewer.formFieldsModule) {
            return new Promise(function (resolve, reject) {
                _this.createRequestForExportFormfields(true).then(function (value) {
                    resolve(value);
                });
            });
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.importAnnotations = function (importData) {
        if (this.pdfViewer.annotationModule) {
            this.createRequestForImportAnnotations(importData);
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.exportAnnotations = function () {
        if (this.pdfViewer.annotationModule) {
            var isAnnotations = this.updateExportItem();
            if (isAnnotations) {
                this.createRequestForExportAnnotations();
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.createRequestForExportAnnotations = function (isObject) {
        var _this = this;
        var proxy = this;
        var promise = new Promise(function (resolve, reject) {
            // tslint:disable-next-line
            var jsonObject;
            // tslint:disable-next-line:max-line-length
            jsonObject = { hashId: proxy.hashId, action: 'ExportAnnotations', pdfAnnotation: proxy.createAnnotationJsonData(), elementId: proxy.pdfViewer.element.id };
            proxy.pdfViewer.fireExportStart(jsonObject.pdfAnnotation);
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                jsonObject.document = proxy.jsonDocumentId;
            }
            var url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.exportAnnotations;
            proxy.exportAnnotationRequestHandler = new AjaxHandler(_this.pdfViewer);
            proxy.exportAnnotationRequestHandler.url = url;
            proxy.exportAnnotationRequestHandler.mode = true;
            proxy.exportAnnotationRequestHandler.responseType = 'text';
            proxy.exportAnnotationRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onSuccess = function (result) {
                // tslint:disable-next-line
                var data = result.data;
                if (data) {
                    if (typeof data === 'object') {
                        data = JSON.parse(data);
                    }
                    if (data) {
                        if (isObject) {
                            if (data.split('base64,')[1]) {
                                // tslint:disable-next-line
                                var annotationJson = atob(data.split(',')[1]);
                                var exportObject = JSON.parse(annotationJson);
                                if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.exportAnnotationFileName);
                                }
                                else {
                                    proxy.pdfViewer.fireExportSuccess(exportObject, proxy.pdfViewer.fileName);
                                }
                                proxy.updateDocumentAnnotationCollections();
                                resolve(annotationJson);
                            }
                            else {
                                // tslint:disable-next-line:max-line-length
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        }
                        else {
                            if (data.split('base64,')[1]) {
                                var blobUrl = proxy.createBlobUrl(data.split('base64,')[1], 'application/json');
                                if (Browser.isIE || Browser.info.name === 'edge') {
                                    if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.exportAnnotationFileName.split('.')[0]);
                                    }
                                    else {
                                        window.navigator.msSaveOrOpenBlob(blobUrl, proxy.pdfViewer.fileName.split('.')[0]);
                                    }
                                }
                                else {
                                    proxy.downloadExportAnnotationJson(blobUrl);
                                }
                                proxy.updateDocumentAnnotationCollections();
                            }
                            else {
                                proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                                // tslint:disable-next-line:max-line-length
                                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            }
                        }
                    }
                    if (typeof data !== 'string') {
                        try {
                            if (typeof data === 'string') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                                data = null;
                            }
                        }
                        catch (error) {
                            // tslint:disable-next-line:max-line-length
                            proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, proxy.pdfViewer.localeObj.getConstant('Export Failed'));
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.exportAnnotations);
                            data = null;
                        }
                    }
                }
                else {
                    var fileName = void 0;
                    if (proxy.pdfViewer.exportAnnotationFileName !== null) {
                        fileName = proxy.pdfViewer.exportAnnotationFileName;
                    }
                    else {
                        fileName = proxy.pdfViewer.fileName;
                    }
                    proxy.pdfViewer.fireExportSuccess('Exported data saved in server side successfully', fileName);
                }
            };
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onFailure = function (result) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
            // tslint:disable-next-line
            proxy.exportAnnotationRequestHandler.onError = function (result) {
                proxy.pdfViewer.fireExportFailed(jsonObject.pdfAnnotation, result.statusText);
            };
        });
        if (isObject) {
            return promise;
        }
        else {
            return true;
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.createRequestForImportAnnotations = function (importData) {
        var jsonObject;
        var proxy = this;
        if (typeof importData === 'object') {
            proxy.reRenderAnnotations(importData.pdfAnnotation);
            proxy.isImportedAnnotation = true;
            proxy.pdfViewer.fireImportSuccess(importData.pdfAnnotation);
        }
        else {
            proxy.pdfViewer.fireImportStart(importData);
            // tslint:disable-next-line:max-line-length
            jsonObject = { fileName: importData, action: 'ImportAnnotations', elementId: proxy.pdfViewer.element.id };
            if (proxy.jsonDocumentId) {
                // tslint:disable-next-line
                jsonObject.document = proxy.jsonDocumentId;
            }
            var url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.importAnnotations;
            proxy.importAnnotationRequestHandler = new AjaxHandler(proxy.pdfViewer);
            proxy.importAnnotationRequestHandler.url = url;
            proxy.importAnnotationRequestHandler.mode = true;
            proxy.importAnnotationRequestHandler.responseType = 'text';
            proxy.importAnnotationRequestHandler.send(jsonObject);
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onSuccess = function (result) {
                // tslint:disable-next-line
                var data = result.data;
                if (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                            if (typeof data !== 'object') {
                                proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                                data = null;
                            }
                        }
                        catch (error) {
                            proxy.pdfViewer.fireImportFailed(importData, proxy.pdfViewer.localeObj.getConstant('File not found'));
                            proxy.openImportExportNotificationPopup(proxy.pdfViewer.localeObj.getConstant('File not found'));
                            proxy.onControlError(500, data, proxy.pdfViewer.serverActionSettings.importAnnotations);
                            data = null;
                        }
                    }
                    if (data) {
                        if (data.pdfAnnotation) {
                            proxy.reRenderAnnotations(data.pdfAnnotation);
                            proxy.isImportedAnnotation = true;
                            proxy.pdfViewer.fireImportSuccess(data.pdfAnnotation);
                        }
                    }
                }
            };
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onFailure = function (result) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
            // tslint:disable-next-line
            proxy.importAnnotationRequestHandler.onError = function (result) {
                proxy.pdfViewer.fireImportFailed(importData, result.statusText);
            };
        }
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.openImportExportNotificationPopup = function (errorDetails) {
        if (this.pdfViewer.showNotificationDialog) {
            this.textLayer.createNotificationPopup(errorDetails);
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.reRenderAnnotations = function (annotation) {
        if (annotation) {
            this.isImportAction = true;
            var count = void 0;
            if (this.isImportedAnnotation) {
                this.importedAnnotation = this.combineImportedData(this.importedAnnotation, annotation);
            }
            else {
                if (this.pageCount > 0) {
                    this.importedAnnotation = annotation;
                }
            }
            if (!this.isImportedAnnotation) {
                count = 0;
            }
            for (var i = 0; i < this.pageCount; i++) {
                if (annotation[i]) {
                    // tslint:disable-next-line
                    var importPageCollections = [];
                    // tslint:disable-next-line
                    var textMarkupObject = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                    // tslint:disable-next-line
                    var shapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                    // tslint:disable-next-line
                    var measureShapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                    // tslint:disable-next-line
                    var stampObject = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                    // tslint:disable-next-line
                    var stickyObject = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                    // tslint:disable-next-line
                    var freeTextObject = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                    // tslint:disable-next-line
                    var signatureObject = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                    // tslint:disable-next-line
                    var inkObject = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                    if (this.isStorageExceed) {
                        textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                        shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                        measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                        stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                        stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                        freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                        inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                    }
                    var annotationCanvas = this.getElement('_annotationCanvas_' + i);
                    if (annotationCanvas) {
                        this.drawPageAnnotations(annotation[i], i);
                        if (this.isImportedAnnotation) {
                            var isAdded = false;
                            for (var j = 0; j < this.annotationPageList.length; j++) {
                                if (this.annotationPageList[j] === i) {
                                    isAdded = true;
                                }
                            }
                            if (isAdded) {
                                this.annotationPageList[count] = i;
                                count = count + 1;
                            }
                        }
                        else {
                            this.annotationPageList[count] = i;
                            count = count + 1;
                        }
                    }
                    if (annotation[i].textMarkupAnnotation && annotation[i].textMarkupAnnotation.length !== 0) {
                        if (textMarkupObject) {
                            var annotObject = JSON.parse(textMarkupObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].textMarkupAnnotation, i);
                        }
                        annotation[i].textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation[i].textMarkupAnnotation, i);
                        importPageCollections.textMarkupAnnotation = annotation[i].textMarkupAnnotation;
                        if (annotation[i].textMarkupAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].textMarkupAnnotation, i);
                            for (var j = 0; j < annotation[i].textMarkupAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.textMarkupAnnotationModule.updateTextMarkupAnnotationCollections(annotation[i].textMarkupAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].shapeAnnotation && annotation[i].shapeAnnotation.length !== 0) {
                        if (shapeObject) {
                            var annotObject = JSON.parse(shapeObject);
                            annotation[i].shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].shapeAnnotation, i);
                        }
                        annotation[i].shapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].shapeAnnotation, i);
                        importPageCollections.shapeAnnotation = annotation[i].shapeAnnotation;
                        if (annotation[i].shapeAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].shapeAnnotation, i);
                            for (var j = 0; j < annotation[i].shapeAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.shapeAnnotationModule.updateShapeAnnotationCollections(annotation[i].shapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].measureShapeAnnotation && annotation[i].measureShapeAnnotation.length !== 0) {
                        if (measureShapeObject) {
                            var annotObject = JSON.parse(measureShapeObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].measureShapeAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation[i].measureShapeAnnotation, i);
                        importPageCollections.measureShapeAnnotation = annotation[i].measureShapeAnnotation;
                        if (annotation[i].measureShapeAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].measureShapeAnnotation, i);
                            for (var j = 0; j < annotation[i].measureShapeAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.measureAnnotationModule.updateMeasureAnnotationCollections(annotation[i].measureShapeAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].stampAnnotations && annotation[i].stampAnnotations.length !== 0) {
                        if (stampObject) {
                            var annotObject = JSON.parse(stampObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].stampAnnotations = this.checkAnnotationCollections(annotObject, annotation[i].stampAnnotations, i);
                        }
                        annotation[i].stampAnnotations = this.checkAnnotationCommentsCollections(annotation[i].stampAnnotations, i);
                        importPageCollections.stampAnnotations = annotation[i].stampAnnotations;
                        if (annotation[i].stampAnnotations.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stampAnnotations, i);
                            for (var j = 0; j < annotation[i].stampAnnotations.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stampAnnotationModule.updateStampAnnotationCollections(annotation[i].stampAnnotations[j], i));
                            }
                        }
                    }
                    if (annotation[i].stickyNotesAnnotation && annotation[i].stickyNotesAnnotation.length !== 0) {
                        if (stickyObject) {
                            var annotObject = JSON.parse(stickyObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].stickyNotesAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation[i].stickyNotesAnnotation, i);
                        importPageCollections.stickyNotesAnnotation = annotation[i].stickyNotesAnnotation;
                        if (annotation[i].stickyNotesAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].stickyNotesAnnotation, i);
                            for (var j = 0; j < annotation[i].stickyNotesAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateStickyNotesAnnotationCollections(annotation[i].stickyNotesAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].freeTextAnnotation && annotation[i].freeTextAnnotation.length !== 0) {
                        if (freeTextObject) {
                            var annotObject = JSON.parse(freeTextObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].freeTextAnnotation, i);
                        }
                        annotation[i].freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation[i].freeTextAnnotation, i);
                        importPageCollections.freeTextAnnotation = annotation[i].freeTextAnnotation;
                        if (annotation[i].freeTextAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].freeTextAnnotation, i);
                            for (var j = 0; j < annotation[i].freeTextAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    if (annotation[i].signatureAnnotation && annotation[i].signatureAnnotation.length !== 0) {
                        if (signatureObject) {
                            var annotObject = JSON.parse(signatureObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].signatureAnnotation = this.checkSignatureCollections(annotObject, annotation[i].signatureAnnotation, i);
                        }
                        importPageCollections.signatureAnnotation = annotation[i].signatureAnnotation;
                        if (annotation[i].signatureAnnotation.length !== 0) {
                            for (var j = 0; j < annotation[i].signatureAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.signatureModule.updateSignatureCollections(annotation[i].signatureAnnotation[j], i), true);
                            }
                        }
                    }
                    if (annotation[i].signatureInkAnnotation && annotation[i].signatureInkAnnotation.length !== 0) {
                        if (inkObject) {
                            var annotObject = JSON.parse(inkObject);
                            // tslint:disable-next-line:max-line-length
                            annotation[i].signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation[i].signatureInkAnnotation, i);
                        }
                        // tslint:disable-next-line:max-line-length
                        annotation[i].signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation[i].signatureInkAnnotation, i);
                        importPageCollections.signatureInkAnnotation = annotation[i].signatureInkAnnotation;
                        if (annotation[i].signatureInkAnnotation.length !== 0) {
                            // tslint:disable-next-line:max-line-length
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderAnnotationComments(annotation[i].signatureInkAnnotation, i);
                            for (var j = 0; j < annotation[i].signatureInkAnnotation.length; j++) {
                                // tslint:disable-next-line:max-line-length
                                // this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateCollections(this.pdfViewer.annotationModule.freeTextAnnotationModule.updateFreeTextAnnotationCollections(annotation[i].freeTextAnnotation[j], i));
                            }
                        }
                    }
                    this.updateImportedAnnotationsInDocumentCollections(importPageCollections, i);
                }
            }
            if (this.pageCount > 0) {
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.annotationModule.stickyNotesAnnotationModule && !this.pdfViewer.annotationModule.stickyNotesAnnotationModule.isAnnotationRendered) {
                    // tslint:disable-next-line
                    var annotationCollection = this.createAnnotationsCollection();
                    if (annotationCollection) {
                        // tslint:disable-next-line:max-line-length
                        this.documentAnnotationCollections = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationsInDocumentCollections(this.importedAnnotation, annotationCollection);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.updateImportedAnnotationsInDocumentCollections = function (importedAnnotations, pageNumber) {
        if (this.documentAnnotationCollections) {
            // tslint:disable-next-line
            var documentAnnotationCollection = this.documentAnnotationCollections;
            // tslint:disable-next-line
            var pageCollections = documentAnnotationCollection[pageNumber];
            if (pageCollections) {
                if (importedAnnotations.textMarkupAnnotation && importedAnnotations.textMarkupAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.textMarkupAnnotation.length; i++) {
                        pageCollections.textMarkupAnnotation.push(importedAnnotations.textMarkupAnnotation[i]);
                    }
                }
                if (importedAnnotations.shapeAnnotation && importedAnnotations.shapeAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.shapeAnnotation.length; i++) {
                        pageCollections.shapeAnnotation.push(importedAnnotations.shapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.measureShapeAnnotation && importedAnnotations.measureShapeAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.measureShapeAnnotation.length; i++) {
                        pageCollections.measureShapeAnnotation.push(importedAnnotations.measureShapeAnnotation[i]);
                    }
                }
                if (importedAnnotations.stampAnnotations && importedAnnotations.stampAnnotations.length !== 0) {
                    for (var i = 0; i < importedAnnotations.stampAnnotations.length; i++) {
                        pageCollections.stampAnnotations.push(importedAnnotations.stampAnnotations[i]);
                    }
                }
                if (importedAnnotations.stickyNotesAnnotation && importedAnnotations.stickyNotesAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.stickyNotesAnnotation.length; i++) {
                        pageCollections.stickyNotesAnnotation.push(importedAnnotations.stickyNotesAnnotation[i]);
                    }
                }
                if (importedAnnotations.freeTextAnnotation && importedAnnotations.freeTextAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.freeTextAnnotation.length; i++) {
                        pageCollections.freeTextAnnotation.push(importedAnnotations.freeTextAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureAnnotation && importedAnnotations.signatureAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.signatureAnnotation.length; i++) {
                        pageCollections.signatureAnnotation.push(importedAnnotations.signatureAnnotation[i]);
                    }
                }
                if (importedAnnotations.signatureInkAnnotation && importedAnnotations.signatureInkAnnotation.length !== 0) {
                    for (var i = 0; i < importedAnnotations.signatureInkAnnotation.length; i++) {
                        pageCollections.signatureInkAnnotation.push(importedAnnotations.signatureInkAnnotation[i]);
                    }
                }
                this.documentAnnotationCollections[pageNumber] = pageCollections;
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkDocumentCollectionData = function (pageIndex, pageCollections) {
        // tslint:disable-next-line
        var importPageCollections;
        if (pageCollections) {
            importPageCollections = pageCollections;
        }
        else if (this.documentAnnotationCollections) {
            // tslint:disable-next-line
            var documetCollections = this.documentAnnotationCollections[pageIndex];
            if (documetCollections) {
                importPageCollections = cloneObject(documetCollections);
            }
        }
        if (importPageCollections) {
            // tslint:disable-next-line
            var textMarkupObject = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
            // tslint:disable-next-line
            var shapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
            // tslint:disable-next-line
            var measureShapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
            // tslint:disable-next-line
            var stampObject = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
            // tslint:disable-next-line
            var stickyObject = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
            // tslint:disable-next-line
            var freeTextObject = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
            // tslint:disable-next-line
            var inkObject = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
            if (this.isStorageExceed) {
                textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
            }
            if (importPageCollections.textMarkupAnnotation && importPageCollections.textMarkupAnnotation.length !== 0) {
                if (textMarkupObject) {
                    var annotationObject = JSON.parse(textMarkupObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.textMarkupAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.textMarkupAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.shapeAnnotation && importPageCollections.shapeAnnotation.length !== 0) {
                if (shapeObject) {
                    var annotationObject = JSON.parse(shapeObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.shapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.shapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.measureShapeAnnotation && importPageCollections.measureShapeAnnotation.length !== 0) {
                if (measureShapeObject) {
                    var annotationObject = JSON.parse(measureShapeObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.measureShapeAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.measureShapeAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.stampAnnotations && importPageCollections.stampAnnotations.length !== 0) {
                if (stampObject) {
                    var annotationObject = JSON.parse(stampObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.stampAnnotations = this.findImportedAnnotations(annotationObject, importPageCollections.stampAnnotations, pageIndex);
                    }
                }
            }
            if (importPageCollections.stickyNotesAnnotation && importPageCollections.stickyNotesAnnotation.length !== 0) {
                if (stickyObject) {
                    var annotationObject = JSON.parse(stickyObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.stickyNotesAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.stickyNotesAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.freeTextAnnotation && importPageCollections.freeTextAnnotation.length !== 0) {
                if (freeTextObject) {
                    var annotationObject = JSON.parse(freeTextObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.freeTextAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.freeTextAnnotation, pageIndex);
                    }
                }
            }
            if (importPageCollections.signatureInkAnnotation && importPageCollections.signatureInkAnnotation.length !== 0) {
                if (inkObject) {
                    var annotationObject = JSON.parse(inkObject);
                    if (annotationObject) {
                        // tslint:disable-next-line:max-line-length
                        importPageCollections.signatureInkAnnotation = this.findImportedAnnotations(annotationObject, importPageCollections.signatureInkAnnotation, pageIndex);
                    }
                }
            }
            return importPageCollections;
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.findImportedAnnotations = function (annotationCollection, importAnnotations, pageNumber) {
        // tslint:disable-next-line
        var pageCollections = null;
        for (var a = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (var i = 0; i < pageCollections.length; i++) {
                for (var j = 0; j < importAnnotations.length; j++) {
                    if (pageCollections[i].annotName === importAnnotations[j].AnnotName) {
                        importAnnotations.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return importAnnotations;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.drawPageAnnotations = function (annotation, pageIndex, isNewlyAdded) {
        if (isNewlyAdded) {
            annotation = annotation[pageIndex];
        }
        if (annotation) {
            if (annotation.textMarkupAnnotation && annotation.textMarkupAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    if (annotObject) {
                        // tslint:disable-next-line:max-line-length
                        annotation.textMarkupAnnotation = this.checkAnnotationCollections(annotObject, annotation.textMarkupAnnotation, pageIndex);
                    }
                }
                annotation.textMarkupAnnotation = this.checkAnnotationCommentsCollections(annotation.textMarkupAnnotation, pageIndex);
                if (annotation.textMarkupAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, null, annotation.textMarkupAnnotation, null, true);
                }
            }
            if (annotation.shapeAnnotation && annotation.shapeAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    annotation.shapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.shapeAnnotation, pageIndex);
                }
                annotation.shapeAnnotation = this.checkAnnotationCommentsCollections(annotation.shapeAnnotation, pageIndex);
                if (annotation.shapeAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, annotation.shapeAnnotation, null, null, null, true);
                }
            }
            if (annotation.measureShapeAnnotation && annotation.measureShapeAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.measureShapeAnnotation = this.checkAnnotationCollections(annotObject, annotation.measureShapeAnnotation, pageIndex);
                }
                annotation.measureShapeAnnotation = this.checkAnnotationCommentsCollections(annotation.measureShapeAnnotation, pageIndex);
                if (annotation.measureShapeAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.renderAnnotations(pageIndex, null, annotation.measureShapeAnnotation, null, null, true);
                }
            }
            if (annotation.stampAnnotations && annotation.stampAnnotations.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    annotation.stampAnnotations = this.checkAnnotationCollections(annotObject, annotation.stampAnnotations, pageIndex);
                }
                annotation.stampAnnotations = this.checkAnnotationCommentsCollections(annotation.stampAnnotations, pageIndex);
                if (annotation.stampAnnotations.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stampAnnotationModule.renderStampAnnotations(annotation.stampAnnotations, pageIndex, null, true);
                }
            }
            if (annotation.stickyNotesAnnotation && annotation.stickyNotesAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.stickyNotesAnnotation = this.checkAnnotationCollections(annotObject, annotation.stickyNotesAnnotation, pageIndex);
                }
                annotation.stickyNotesAnnotation = this.checkAnnotationCommentsCollections(annotation.stickyNotesAnnotation, pageIndex);
                if (annotation.stickyNotesAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.stickyNotesAnnotationModule.renderStickyNotesAnnotations(annotation.stickyNotesAnnotation, pageIndex);
                }
            }
            if (annotation.freeTextAnnotation && annotation.freeTextAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    annotation.freeTextAnnotation = this.checkAnnotationCollections(annotObject, annotation.freeTextAnnotation, pageIndex);
                }
                annotation.freeTextAnnotation = this.checkAnnotationCommentsCollections(annotation.freeTextAnnotation, pageIndex);
                if (annotation.freeTextAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.freeTextAnnotationModule.renderFreeTextAnnotations(annotation.freeTextAnnotation, pageIndex, true);
                }
            }
            if (annotation.signatureAnnotation && annotation.signatureAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
                var annotObject = JSON.parse(storeObject);
                if (annotObject) {
                    annotation.signatureAnnotation = this.checkSignatureCollections(annotObject, annotation.signatureAnnotation, pageIndex);
                }
                this.signatureModule.renderExistingSignature(annotation.signatureAnnotation, pageIndex, true);
            }
            if (annotation.signatureInkAnnotation && annotation.signatureInkAnnotation.length !== 0) {
                // tslint:disable-next-line
                var storeObject = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
                if (this.isStorageExceed) {
                    storeObject = this.annotationStorage[this.documentId + '_annotations_ink'];
                }
                if (storeObject) {
                    var annotObject = JSON.parse(storeObject);
                    // tslint:disable-next-line:max-line-length
                    annotation.signatureInkAnnotation = this.checkAnnotationCollections(annotObject, annotation.signatureInkAnnotation, pageIndex);
                }
                annotation.signatureInkAnnotation = this.checkAnnotationCommentsCollections(annotation.signatureInkAnnotation, pageIndex);
                if (annotation.signatureInkAnnotation.length !== 0) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewer.annotationModule.inkAnnotationModule.renderExistingInkSignature(annotation.signatureInkAnnotation, pageIndex, true);
                }
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkSignatureCollections = function (annotationCollection, annotation, pageNumber) {
        // tslint:disable-next-line
        var pageCollections = null;
        for (var a = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (var i = 0; i < pageCollections.length; i++) {
                for (var j = 0; j < annotation.length; j++) {
                    if (pageCollections[i].signatureName === annotation[j].SignatureName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkAnnotationCollections = function (annotationCollection, annotation, pageNumber) {
        // tslint:disable-next-line
        var pageCollections = null;
        for (var a = 0; a < annotationCollection.length; a++) {
            if (annotationCollection[a].pageIndex === pageNumber) {
                pageCollections = annotationCollection[a].annotations;
            }
        }
        if (pageCollections) {
            for (var i = 0; i < pageCollections.length; i++) {
                for (var j = 0; j < annotation.length; j++) {
                    if (pageCollections[i].annotName === annotation[j].AnnotName) {
                        annotation.splice(j, 1);
                        j = j - 1;
                    }
                }
            }
        }
        pageCollections = null;
        return annotation;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkAnnotationCommentsCollections = function (annotation, pageNumber) {
        if (this.annotationComments) {
            // tslint:disable-next-line
            var annotationCollections = this.annotationComments[pageNumber];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (var i = 0; i < annotationCollections.length; i++) {
                    for (var j = 0; j < annotation.length; j++) {
                        if (annotationCollections[i].AnnotName === annotation[j].AnnotName) {
                            annotation.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
            annotationCollections = null;
        }
        return annotation;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.selectAnnotationCollections = function (pageAnnotations) {
        // tslint:disable-next-line
        var pageCollections = [];
        if (pageAnnotations) {
            if (pageAnnotations.textMarkupAnnotation && pageAnnotations.textMarkupAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.textMarkupAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.textMarkupAnnotation[i]);
                }
            }
            if (pageAnnotations.shapeAnnotation && pageAnnotations.shapeAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.shapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.shapeAnnotation[i]);
                }
            }
            if (pageAnnotations.measureShapeAnnotation && pageAnnotations.measureShapeAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.measureShapeAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.measureShapeAnnotation[i]);
                }
            }
            if (pageAnnotations.stampAnnotations && pageAnnotations.stampAnnotations.length !== 0) {
                for (var i = 0; i < pageAnnotations.stampAnnotations.length; i++) {
                    pageCollections.push(pageAnnotations.stampAnnotations[i]);
                }
            }
            if (pageAnnotations.stickyNotesAnnotation && pageAnnotations.stickyNotesAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.stickyNotesAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.stickyNotesAnnotation[i]);
                }
            }
            if (pageAnnotations.freeTextAnnotation && pageAnnotations.freeTextAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.freeTextAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.freeTextAnnotation[i]);
                }
            }
            if (pageAnnotations.signatureInkAnnotation && pageAnnotations.signatureInkAnnotation.length !== 0) {
                for (var i = 0; i < pageAnnotations.signatureInkAnnotation.length; i++) {
                    pageCollections.push(pageAnnotations.signatureInkAnnotation[i]);
                }
            }
        }
        return pageCollections;
    };
    PdfViewerBase.prototype.saveImportedAnnotations = function () {
        // tslint:disable-next-line
        var textMarkupObject = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        var shapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // tslint:disable-next-line
        var measureShapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // tslint:disable-next-line
        var stampObject = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // tslint:disable-next-line
        var stickyObject = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // tslint:disable-next-line
        var freeTextObject = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        // tslint:disable-next-line
        var inkObject = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        if (this.isStorageExceed) {
            textMarkupObject = this.annotationStorage[this.documentId + '_annotations_textMarkup'];
            shapeObject = this.annotationStorage[this.documentId + '_annotations_shape'];
            measureShapeObject = this.annotationStorage[this.documentId + '_annotations_shape_measure'];
            stampObject = this.annotationStorage[this.documentId + '_annotations_stamp'];
            stickyObject = this.annotationStorage[this.documentId + '_annotations_sticky'];
            freeTextObject = this.annotationStorage[this.documentId + '_annotations_freetext'];
            inkObject = this.annotationStorage[this.documentId + '_annotations_ink'];
        }
        // tslint:disable-next-line:max-line-length
        this.downloadCollections = { textMarkupObject: textMarkupObject, shapeObject: shapeObject, measureShapeObject: measureShapeObject, stampObject: stampObject, stickyObject: stickyObject, freeTextObject: freeTextObject, inkObject: inkObject };
        if (this.documentAnnotationCollections) {
            for (var i = 0; i < this.pageCount; i++) {
                if (this.documentAnnotationCollections[i]) {
                    // tslint:disable-next-line
                    var pageCollections = cloneObject(this.documentAnnotationCollections[i]);
                    pageCollections = this.checkDocumentCollectionData(i, pageCollections);
                    this.savePageAnnotations(pageCollections, i);
                }
            }
        }
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.savePageAnnotations = function (annotation, pageIndex) {
        if (annotation.textMarkupAnnotation.length !== 0) {
            for (var s = 0; s < annotation.textMarkupAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveImportedTextMarkupAnnotations(annotation.textMarkupAnnotation[s], pageIndex);
            }
        }
        if (annotation.shapeAnnotation.length !== 0) {
            for (var s = 0; s < annotation.shapeAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.shapeAnnotationModule.saveImportedShapeAnnotations(annotation.shapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.measureShapeAnnotation.length !== 0) {
            for (var s = 0; s < annotation.measureShapeAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.measureAnnotationModule.saveImportedMeasureAnnotations(annotation.measureShapeAnnotation[s], pageIndex);
            }
        }
        if (annotation.stampAnnotations.length !== 0) {
            for (var s = 0; s < annotation.stampAnnotations.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stampAnnotationModule.saveImportedStampAnnotations(annotation.stampAnnotations[s], pageIndex);
            }
        }
        if (annotation.stickyNotesAnnotation.length !== 0) {
            for (var s = 0; s < annotation.stickyNotesAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveImportedStickyNotesAnnotations(annotation.stickyNotesAnnotation[s], pageIndex);
            }
        }
        if (annotation.freeTextAnnotation.length !== 0) {
            for (var s = 0; s < annotation.freeTextAnnotation.length; s++) {
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.annotationModule.freeTextAnnotationModule.saveImportedFreeTextAnnotations(annotation.freeTextAnnotation[s], pageIndex);
            }
        }
    };
    PdfViewerBase.prototype.updateDocumentAnnotationCollections = function () {
        window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
        window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
        window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
        window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
        window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
        window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
        if (this.downloadCollections) {
            if (this.downloadCollections.textMarkupObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_textMarkup', this.downloadCollections.textMarkupObject);
            }
            if (this.downloadCollections.shapeObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_shape', this.downloadCollections.shapeObject);
            }
            if (this.downloadCollections.measureShapeObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_shape_measure', this.downloadCollections.measureShapeObject);
            }
            if (this.downloadCollections.stampObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_stamp', this.downloadCollections.stampObject);
            }
            if (this.downloadCollections.stickyObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_sticky', this.downloadCollections.stickyObject);
            }
            if (this.downloadCollections.freeTextObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_freetext', this.downloadCollections.freeTextObject);
            }
            if (this.downloadCollections.inkObject) {
                window.sessionStorage.setItem(this.documentId + '_annotations_ink', this.downloadCollections.inkObject);
            }
            if (this.isStorageExceed) {
                this.annotationStorage[this.documentId + '_annotations_textMarkup'] = this.downloadCollections.textMarkupObject;
                this.annotationStorage[this.documentId + '_annotations_shape'] = this.downloadCollections.shapeObject;
                this.annotationStorage[this.documentId + '_annotations_shape_measure'] = this.downloadCollections.measureShapeObject;
                this.annotationStorage[this.documentId + '_annotations_stamp'] = this.downloadCollections.stampObject;
                this.annotationStorage[this.documentId + '_annotations_sticky'] = this.downloadCollections.stickyObject;
                this.annotationStorage[this.documentId + '_annotations_freetext'] = this.downloadCollections.freeTextObject;
                this.annotationStorage[this.documentId + '_annotations_ink'] = this.downloadCollections.inkObject;
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.createAnnotationJsonData = function () {
        // tslint:disable-next-line
        var annotationCollection = {};
        var textMarkupAnnotationCollection;
        var shapeAnnotations;
        var calibrateAnnotations;
        var stampAnnotationCollection;
        var stickyAnnotationCollection;
        var freeTextAnnotationCollection;
        var signaturCollection;
        var signaturInkCollection;
        this.saveImportedAnnotations();
        if (this.isTextMarkupAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            textMarkupAnnotationCollection = this.pdfViewer.annotationModule.textMarkupAnnotationModule.saveTextMarkupAnnotations();
        }
        if (this.isShapeAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            shapeAnnotations = this.pdfViewer.annotationModule.shapeAnnotationModule.saveShapeAnnotations();
        }
        if (this.isCalibrateAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            calibrateAnnotations = this.pdfViewer.annotationModule.measureAnnotationModule.saveMeasureShapeAnnotations();
        }
        if (this.isStampAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            stampAnnotationCollection = this.pdfViewer.annotationModule.stampAnnotationModule.saveStampAnnotations();
        }
        if (this.isCommentAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            stickyAnnotationCollection = this.pdfViewer.annotationModule.stickyNotesAnnotationModule.saveStickyAnnotations();
        }
        if (this.isFreeTextAnnotationModule()) {
            // tslint:disable-next-line:max-line-length
            freeTextAnnotationCollection = this.pdfViewer.annotationModule.freeTextAnnotationModule.saveFreeTextAnnotations();
        }
        if (this.isInkAnnotationModule()) {
            // tslint:disable-next-line
            signaturInkCollection = this.pdfViewer.annotationModule.inkAnnotationModule.saveInkSignature();
        }
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            signaturCollection = this.signatureModule.saveSignature();
        }
        else {
            // tslint:disable-next-line
            var annotations = new Array();
            for (var j = 0; j < this.pageCount; j++) {
                annotations[j] = [];
            }
            signaturCollection = JSON.stringify(annotations);
        }
        for (var s = 0; s < this.pageCount; s++) {
            // tslint:disable-next-line:max-line-length
            var annotation = {
                textMarkupAnnotation: JSON.parse(textMarkupAnnotationCollection)[s], shapeAnnotation: JSON.parse(shapeAnnotations)[s],
                measureShapeAnnotation: JSON.parse(calibrateAnnotations)[s], stampAnnotations: JSON.parse(stampAnnotationCollection)[s],
                // tslint:disable-next-line:max-line-length
                stickyNotesAnnotation: JSON.parse(stickyAnnotationCollection)[s], freeTextAnnotation: JSON.parse(freeTextAnnotationCollection)[s], signatureAnnotation: JSON.parse(signaturCollection)[s], signatureInkAnnotation: JSON.parse(signaturInkCollection)[s]
            };
            annotationCollection[s] = annotation;
        }
        return JSON.stringify(annotationCollection);
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.combineImportedData = function (excistingImportAnnotation, newlyImportAnnotation) {
        for (var i = 0; i < this.pageCount; i++) {
            if (newlyImportAnnotation[i]) {
                if (excistingImportAnnotation[i]) {
                    if (newlyImportAnnotation[i].textMarkupAnnotation && newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].textMarkupAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].textMarkupAnnotation = this.checkImportedData(excistingImportAnnotation[i].textMarkupAnnotation, newlyImportAnnotation[i].textMarkupAnnotation, i);
                            if (newlyImportAnnotation[i].textMarkupAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].textMarkupAnnotation = excistingImportAnnotation[i].textMarkupAnnotation.concat(newlyImportAnnotation[i].textMarkupAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].textMarkupAnnotation = newlyImportAnnotation[i].textMarkupAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].shapeAnnotation && newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].shapeAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].shapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].shapeAnnotation, newlyImportAnnotation[i].shapeAnnotation, i);
                            if (newlyImportAnnotation[i].shapeAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].shapeAnnotation = excistingImportAnnotation[i].shapeAnnotation.concat(newlyImportAnnotation[i].shapeAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].shapeAnnotation = newlyImportAnnotation[i].shapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].measureShapeAnnotation && newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].measureShapeAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].measureShapeAnnotation = this.checkImportedData(excistingImportAnnotation[i].measureShapeAnnotation, newlyImportAnnotation[i].measureShapeAnnotation, i);
                            if (newlyImportAnnotation[i].measureShapeAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].measureShapeAnnotation = excistingImportAnnotation[i].measureShapeAnnotation.concat(newlyImportAnnotation[i].measureShapeAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].measureShapeAnnotation = newlyImportAnnotation[i].measureShapeAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].stampAnnotations && newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                        if (excistingImportAnnotation[i].stampAnnotations) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].stampAnnotations = this.checkImportedData(excistingImportAnnotation[i].stampAnnotations, newlyImportAnnotation[i].stampAnnotations, i);
                            if (newlyImportAnnotation[i].stampAnnotations.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].stampAnnotations = excistingImportAnnotation[i].stampAnnotations.concat(newlyImportAnnotation[i].stampAnnotations);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].stampAnnotations = newlyImportAnnotation[i].stampAnnotations;
                        }
                    }
                    if (newlyImportAnnotation[i].stickyNotesAnnotation && newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].stickyNotesAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].stickyNotesAnnotation = this.checkImportedData(excistingImportAnnotation[i].stickyNotesAnnotation, newlyImportAnnotation[i].stickyNotesAnnotation, i);
                            if (newlyImportAnnotation[i].stickyNotesAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].stickyNotesAnnotation = excistingImportAnnotation[i].stickyNotesAnnotation.concat(newlyImportAnnotation[i].stickyNotesAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].stickyNotesAnnotation = newlyImportAnnotation[i].stickyNotesAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].freeTextAnnotation && newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].freeTextAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].freeTextAnnotation = this.checkImportedData(excistingImportAnnotation[i].freeTextAnnotation, newlyImportAnnotation[i].freeTextAnnotation, i);
                            if (newlyImportAnnotation[i].freeTextAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].freeTextAnnotation = excistingImportAnnotation[i].freeTextAnnotation.concat(newlyImportAnnotation[i].freeTextAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].freeTextAnnotation = newlyImportAnnotation[i].freeTextAnnotation;
                        }
                    }
                    if (newlyImportAnnotation[i].signatureInkAnnotation && newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                        if (excistingImportAnnotation[i].signatureInkAnnotation) {
                            // tslint:disable-next-line:max-line-length
                            newlyImportAnnotation[i].signatureInkAnnotation = this.checkImportedData(excistingImportAnnotation[i].signatureInkAnnotation, newlyImportAnnotation[i].signatureInkAnnotation, i);
                            if (newlyImportAnnotation[i].signatureInkAnnotation.length !== 0) {
                                // tslint:disable-next-line:max-line-length
                                excistingImportAnnotation[i].signatureInkAnnotation = excistingImportAnnotation[i].signatureInkAnnotation.concat(newlyImportAnnotation[i].signatureInkAnnotation);
                            }
                        }
                        else {
                            excistingImportAnnotation[i].signatureInkAnnotation = newlyImportAnnotation[i].signatureInkAnnotation;
                        }
                    }
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    var annotation = {
                        textMarkupAnnotation: newlyImportAnnotation[i].textMarkupAnnotation, shapeAnnotation: newlyImportAnnotation[i].shapeAnnotation,
                        // tslint:disable-next-line:max-line-length
                        measureShapeAnnotation: newlyImportAnnotation[i].measureShapeAnnotation, stampAnnotations: newlyImportAnnotation[i].stampAnnotations,
                        stickyNotesAnnotation: newlyImportAnnotation[i].stickyNotesAnnotation, freeTextAnnotation: newlyImportAnnotation[i].freeTextAnnotation,
                        signatureInkAnnotation: newlyImportAnnotation[i].signatureInkAnnotation
                    };
                    excistingImportAnnotation[i] = annotation;
                }
            }
        }
        return excistingImportAnnotation;
    };
    PdfViewerBase.prototype.updateExportItem = function () {
        // tslint:disable-next-line
        var shapeObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape');
        // tslint:disable-next-line
        var measureObject = window.sessionStorage.getItem(this.documentId + '_annotations_shape_measure');
        // tslint:disable-next-line
        var stampObject = window.sessionStorage.getItem(this.documentId + '_annotations_stamp');
        // tslint:disable-next-line
        var stickyObject = window.sessionStorage.getItem(this.documentId + '_annotations_sticky');
        // tslint:disable-next-line
        var textMarkupObject = window.sessionStorage.getItem(this.documentId + '_annotations_textMarkup');
        // tslint:disable-next-line
        var freeTextObject = window.sessionStorage.getItem(this.documentId + '_annotations_freetext');
        var isSignatureEditable = false;
        // tslint:disable-next-line
        var inkAnnotationObjct = window.sessionStorage.getItem(this.documentId + '_annotations_ink');
        if (this.pdfViewer.isSignatureEditable) {
            // tslint:disable-next-line
            var signatureObject = window.sessionStorage.getItem(this.documentId + '_annotations_sign');
            if (signatureObject) {
                isSignatureEditable = true;
            }
        }
        // tslint:disable-next-line:max-line-length
        if (shapeObject || measureObject || stampObject || stickyObject || textMarkupObject || freeTextObject || this.isImportAction || this.isStorageExceed || isSignatureEditable || inkAnnotationObjct) {
            return true;
        }
        else {
            return false;
        }
    };
    PdfViewerBase.prototype.isFreeTextAnnotation = function (annotations) {
        var resut = false;
        if (annotations && annotations.length > 0) {
            resut = annotations.some(function (s) { return s.shapeAnnotationType === 'FreeText' && s.subject === 'Text Box'; });
        }
        return resut;
    };
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkImportedData = function (existingCollection, newCollection, pageIndex) {
        for (var i = 0; i < existingCollection.length; i++) {
            for (var j = 0; j < newCollection.length; j++) {
                if (existingCollection[i].AnnotName === newCollection[j].AnnotName) {
                    newCollection.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        if (this.annotationComments) {
            // tslint:disable-next-line
            var annotationCollections = this.annotationComments[pageIndex];
            annotationCollections = this.selectAnnotationCollections(annotationCollections);
            if (annotationCollections) {
                for (var i = 0; i < annotationCollections.length; i++) {
                    for (var j = 0; j < newCollection.length; j++) {
                        if (annotationCollections[i].AnnotName === newCollection[j].AnnotName) {
                            newCollection.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }
        }
        return newCollection;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.checkAnnotationWidth = function (points) {
        var width;
        var height;
        var minWidth;
        var maxWidth;
        var minHeight;
        var maxHeight;
        for (var i = 0; i < points.length; i++) {
            if (!minWidth) {
                minWidth = points[i].x;
                maxWidth = points[i].x;
                minHeight = points[i].y;
                maxHeight = points[i].y;
            }
            else {
                if (minWidth > points[i].x) {
                    minWidth = points[i].x;
                }
                else if (maxWidth < points[i].x) {
                    maxWidth = points[i].x;
                }
                if (minHeight > points[i].y) {
                    minHeight = points[i].y;
                }
                else if (maxHeight < points[i].y) {
                    maxHeight = points[i].y;
                }
            }
        }
        width = maxWidth - minWidth;
        height = maxHeight - minHeight;
        return { width: width, height: height };
    };
    /**
     * @private
     */
    PdfViewerBase.prototype.deleteAnnotations = function () {
        if (this.pdfViewer.annotationModule) {
            this.pdfViewer.annotations = [];
            this.pdfViewer.zIndexTable = [];
            this.pdfViewer.annotationCollection = [];
            this.pdfViewer.signatureCollection = [];
            // tslint:disable-next-line
            var annotationCollection = this.createAnnotationsCollection();
            this.annotationComments = annotationCollection;
            this.documentAnnotationCollections = annotationCollection;
            this.annotationRenderredList = [];
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape');
            window.sessionStorage.removeItem(this.documentId + '_annotations_shape_measure');
            window.sessionStorage.removeItem(this.documentId + '_annotations_stamp');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sticky');
            window.sessionStorage.removeItem(this.documentId + '_annotations_textMarkup');
            window.sessionStorage.removeItem(this.documentId + '_annotations_freetext');
            window.sessionStorage.removeItem(this.documentId + '_annotations_sign');
            window.sessionStorage.removeItem(this.documentId + '_annotations_ink');
            for (var i = 0; i < this.pageCount; i++) {
                this.pdfViewer.annotationModule.renderAnnotations(i, null, null, null);
                this.pdfViewer.renderDrawing(undefined, i);
                this.pdfViewer.clearSelection(i);
                var accordionContent = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + (i + 1));
                if (accordionContent) {
                    accordionContent.remove();
                }
                // tslint:disable-next-line:max-line-length
                var accordionContentContainer = document.getElementById(this.pdfViewer.element.id + '_accordionContentContainer');
                if (accordionContentContainer) {
                    if (accordionContentContainer.childElementCount === 0) {
                        accordionContentContainer.style.display = 'none';
                        if (document.getElementById(this.pdfViewer.element.id + '_commentsPanelText')) {
                            // tslint:disable-next-line:max-line-length
                            this.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], false);
                            document.getElementById(this.pdfViewer.element.id + '_commentsPanelText').style.display = 'block';
                        }
                    }
                }
            }
            this.isImportedAnnotation = false;
            this.isImportAction = false;
            this.importedAnnotation = [];
            this.annotationPageList = [];
            this.pdfViewer.annotationModule.freeTextAnnotationModule.freeTextPageNumbers = [];
            this.pdfViewer.annotationModule.stampAnnotationModule.stampPageNumber = [];
            this.pdfViewer.annotation.inkAnnotationModule.inkAnnotationindex = [];
            this.isAnnotationCollectionRemoved = true;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    PdfViewerBase.prototype.createAnnotationsCollection = function () {
        var annotationCollectionList = [];
        for (var i = 0; i < this.pageCount; i++) {
            var annotation = {
                // tslint:disable-next-line:max-line-length
                textMarkupAnnotation: [], shapeAnnotation: [], measureShapeAnnotation: [], stampAnnotations: [], stickyNotesAnnotation: [], freeTextAnnotation: [], signatureAnnotation: [], signatureInkAnnotation: [],
            };
            annotationCollectionList.push(annotation);
        }
        return annotationCollectionList;
    };
    return PdfViewerBase;
}());
export { PdfViewerBase };
