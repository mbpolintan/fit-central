import { createElement, Browser } from '@syncfusion/ej2-base';
import { TreeView } from '@syncfusion/ej2-navigations';
import { ListView } from '@syncfusion/ej2-lists';
import { AjaxHandler } from '../index';
/**
 * BookmarkView module
 */
var BookmarkView = /** @class */ (function () {
    /**
     * @private
     */
    function BookmarkView(pdfViewer, pdfViewerBase) {
        var _this = this;
        /**
         * @private
         */
        this.childNavigateCount = 0;
        // tslint:disable-next-line
        this.bookmarkClick = function (args) {
            // tslint:disable-next-line
            if (!args.event.target.classList.contains('e-icons')) {
                var bookid = args.data.Id;
                _this.childNavigateCount = 0;
                _this.pdfViewerBase.navigationPane.goBackToToolbar();
                _this.navigateToBookmark(bookid);
            }
            else {
                _this.childNavigateCount++;
            }
            return false;
        };
        this.nodeClick = function (args) {
            _this.setHeight(args.node);
            var bookid = Number(args.nodeData.id);
            _this.navigateToBookmark(bookid);
            if (_this.pdfViewer.annotationModule && _this.pdfViewer.annotationModule.inkAnnotationModule) {
                // tslint:disable-next-line
                var currentPageNumber = parseInt(_this.pdfViewer.annotationModule.inkAnnotationModule.currentPageNumber);
                _this.pdfViewer.annotationModule.inkAnnotationModule.drawInkAnnotation(currentPageNumber);
            }
            return false;
        };
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    BookmarkView.prototype.createRequestForBookmarks = function () {
        var proxy = this;
        // tslint:disable-next-line:max-line-length
        var jsonObject = { hashId: this.pdfViewerBase.hashId, action: 'Bookmarks', elementId: this.pdfViewer.element.id, uniqueId: this.pdfViewerBase.documentId };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.documentId = this.pdfViewerBase.jsonDocumentId;
        }
        this.bookmarkRequestHandler = new AjaxHandler(this.pdfViewer);
        this.bookmarkRequestHandler.url = proxy.pdfViewer.serviceUrl + '/Bookmarks';
        this.bookmarkRequestHandler.responseType = 'json';
        this.bookmarkRequestHandler.send(jsonObject);
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onSuccess = function (result) {
            if (proxy.pdfViewerBase.navigationPane) {
                proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
            }
            // tslint:disable-next-line
            var data = result.data;
            if (data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    }
                    catch (error) {
                        proxy.pdfViewerBase.onControlError(500, data, 'Bookmarks');
                        data = null;
                    }
                }
                if (data && data.uniqueId === proxy.pdfViewerBase.documentId) {
                    proxy.bookmarks = { bookMark: data.Bookmarks };
                    proxy.bookmarksDestination = { bookMarkDestination: data.BookmarksDestination };
                }
            }
            if (proxy.pdfViewerBase.navigationPane) {
                if (proxy.bookmarks == null) {
                    proxy.pdfViewerBase.navigationPane.disableBookmarkButton();
                }
                else {
                    proxy.pdfViewerBase.navigationPane.enableBookmarkButton();
                    proxy.isBookmarkViewDiv = false;
                }
            }
        };
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, 'Bookmarks');
        };
        // tslint:disable-next-line
        this.bookmarkRequestHandler.onError = function (result) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, 'Bookmarks');
        };
    };
    /**
     * @private
     */
    BookmarkView.prototype.renderBookmarkcontent = function () {
        var _this = this;
        if (!this.isBookmarkViewDiv) {
            this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
            this.pdfViewerBase.navigationPane.sideBarContent.appendChild(this.bookmarkView);
            // tslint:disable-next-line:max-line-length
            var bookmarkIconView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_iconview', className: 'e-pv-bookmark-icon-view' });
            // tslint:disable-next-line:max-line-length
            if (!this.pdfViewer.enableRtl) {
                // tslint:disable-next-line:max-line-length
                var bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            else {
                // tslint:disable-next-line:max-line-length
                var bookmarkIcon = createElement('span', { id: this.pdfViewer.element.id + '_bookmark_icon', className: 'e-pv-bookmark-icon e-pv-icon e-right' });
                bookmarkIconView.appendChild(bookmarkIcon);
            }
            // tslint:disable-next-line:max-line-length
            var bookmarkTitle = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_Title', className: 'e-pv-bookmark-Title' });
            if (this.pdfViewer.enableRtl) {
                bookmarkTitle.style.paddingRight = 26 + 'px';
            }
            else {
                bookmarkTitle.style.paddingLeft = 40 + 'px';
            }
            bookmarkTitle.innerText = '${Title}';
            bookmarkIconView.appendChild(bookmarkTitle);
            // tslint:disable-next-line:max-line-length
            this.treeObj = new TreeView({
                fields: {
                    dataSource: this.bookmarks.bookMark,
                    id: 'Id',
                    text: 'Title',
                    child: 'Child',
                    hasChildren: 'HasChild',
                },
                nodeTemplate: bookmarkIconView.outerHTML,
                nodeSelected: this.nodeClick.bind(this),
            });
            this.treeObj.isStringTemplate = true;
            if (this.pdfViewer.enableRtl) {
                this.treeObj.enableRtl = true;
            }
            this.treeObj.appendTo(this.bookmarkView);
            // tslint:disable-next-line
            var event_1 = ['mouseover', 'keydown'];
            for (var m = 0; m < event_1.length; m++) {
                this.bookmarkView.addEventListener(event_1[m], function (event) {
                    _this.setHeight(event.target);
                });
            }
            this.isBookmarkViewDiv = true;
        }
        this.bookmarkView.style.display = 'block';
    };
    /**
     * @private
     */
    BookmarkView.prototype.renderBookmarkContentMobile = function () {
        if (this.bookmarkView != null) {
            this.bookmarkView.remove();
        }
        this.bookmarkView = createElement('div', { id: this.pdfViewer.element.id + '_bookmark_view', className: 'e-pv-bookmark-view' });
        this.pdfViewerBase.getElement('_bookmarks_container').appendChild(this.bookmarkView);
        this.bookmarkList = new ListView({
            dataSource: this.bookmarks.bookMark,
            fields: {
                id: 'Id',
                text: 'Title',
                child: 'Child'
            },
            showHeader: false,
            select: this.bookmarkClick.bind(this)
        });
        this.bookmarkList.isStringTemplate = true;
        if (this.pdfViewer.enableRtl) {
            this.bookmarkList.enableRtl = true;
        }
        this.bookmarkList.appendTo(this.bookmarkView);
    };
    // tslint:disable-next-line
    BookmarkView.prototype.setHeight = function (element) {
        if (this.treeObj.fullRowSelect && element.classList) {
            if (element.classList.contains('e-treeview')) {
                element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
            }
            else if (element.classList.contains('e-list-parent')) {
                element = element.querySelector('.e-fullrow');
            }
            else if (element.classList.value !== ('e-fullrow')) {
                if (element.closest && element.closest('.e-list-item')) {
                    element = element.closest('.e-list-item').querySelector('.e-fullrow');
                }
                else {
                    if (element.classList.contains('e-list-item')) {
                        element = element.querySelector('.e-fullrow');
                    }
                    else if (element.classList.contains('e-icons') && element.classList.contains('interaction')
                        && element.parentElement.parentElement.classList.contains('e-list-item')) {
                        element = element.parentElement.parentElement.querySelector('.e-fullrow');
                    }
                }
            }
            if (element.nextElementSibling) {
                element.style.height = element.nextElementSibling.offsetHeight + 'px';
            }
        }
    };
    /**
     * @private
     */
    BookmarkView.prototype.setBookmarkContentHeight = function () {
        if (this.treeObj) {
            // tslint:disable-next-line
            var element = this.treeObj.element;
            if (this.treeObj.fullRowSelect) {
                if (element.classList.contains('e-treeview')) {
                    element = element.querySelector('.e-node-focus').querySelector('.e-fullrow');
                }
                if (element.nextElementSibling) {
                    element.style.height = element.nextElementSibling.offsetHeight + 'px';
                }
            }
        }
    };
    BookmarkView.prototype.navigateToBookmark = function (bookid) {
        var pageIndex = this.bookmarksDestination.bookMarkDestination[bookid].PageIndex;
        var Y = this.bookmarksDestination.bookMarkDestination[bookid].Y;
        this.goToBookmark(pageIndex, Y);
    };
    /**
     * Get Bookmarks of the PDF document being loaded in the ejPdfViewer control
     * @returns any
     */
    // tslint:disable-next-line
    BookmarkView.prototype.getBookmarks = function () {
        if (this.bookmarks && this.bookmarksDestination) {
            // tslint:disable-next-line:max-line-length
            return { bookmarks: this.bookmarks, bookmarksDestination: this.bookmarksDestination };
        }
    };
    /**
     * Navigate To current Bookmark location of the PDF document being loaded in the ejPdfViewer control.
     * @param  {number} pageIndex - Specifies the pageIndex for Navigate
     * @param  {number} y - Specifies the Y coordinates value of the Page
     * @returns void
     */
    BookmarkView.prototype.goToBookmark = function (pageIndex, y) {
        var proxy = this;
        var destPage = (this.pdfViewerBase.pageSize[pageIndex].height);
        var scrollValue;
        if (y === 0) {
            scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor();
        }
        else {
            // tslint:disable-next-line:max-line-length
            scrollValue = this.pdfViewerBase.pageSize[pageIndex].top * this.pdfViewerBase.getZoomFactor() + ((destPage - y) * this.pdfViewerBase.getZoomFactor());
        }
        var scroll = scrollValue.toString();
        // tslint:disable-next-line:radix
        proxy.pdfViewerBase.viewerContainer.scrollTop = parseInt(scroll);
        if (Browser.isDevice) {
            this.pdfViewerBase.mobileScrollerContainer.style.display = '';
            this.pdfViewerBase.updateMobileScrollerPosition();
        }
        proxy.pdfViewerBase.focusViewerContainer();
        return false;
    };
    /**
     * @private
     */
    BookmarkView.prototype.clear = function () {
        if (this.pdfViewerBase.navigationPane) {
            this.pdfViewerBase.navigationPane.disableBookmarkButton();
            this.pdfViewerBase.navigationPane.updateViewerContainerOnClose();
        }
        if (this.bookmarks) {
            this.bookmarks.bookMark = [];
            this.bookmarks = null;
        }
        if (this.bookmarksDestination) {
            this.bookmarksDestination.bookMarkDestination = [];
        }
        if (this.bookmarkView != null) {
            if (this.bookmarkView.parentElement !== null) {
                this.bookmarkView.parentElement.removeChild(this.bookmarkView);
            }
            while (this.bookmarkView.hasChildNodes()) {
                this.bookmarkView.removeChild(this.bookmarkView.lastChild);
            }
        }
    };
    /**
     * @private
     */
    BookmarkView.prototype.destroy = function () {
        this.clear();
    };
    /**
     * @private
     */
    BookmarkView.prototype.getModuleName = function () {
        return 'BookmarkView';
    };
    return BookmarkView;
}());
export { BookmarkView };
