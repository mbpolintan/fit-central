import { createElement, Browser } from '@syncfusion/ej2-base';
import { ContextMenu as Context } from '@syncfusion/ej2-navigations';
import { ContextMenuItem } from './types';
/**
 * ContextMenu module is used to handle the context menus used in the control.
 * @hidden
 */
var ContextMenu = /** @class */ (function () {
    /**
     * @private
     */
    function ContextMenu(pdfViewer, pdfViewerBase) {
        this.copyContextMenu = [];
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
        this.copyContextMenu = [{ text: this.pdfViewer.localeObj.getConstant('Cut'), iconCss: 'e-pv-cut-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Copy'), iconCss: 'e-pv-copy-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Highlight context'), iconCss: 'e-pv-highlight-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Underline context'), iconCss: 'e-pv-underline-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Strikethrough context'), iconCss: 'e-pv-strikethrough-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Paste'), iconCss: 'e-pv-paste-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Delete Context'), iconCss: 'e-pv-delete-icon' },
            { text: this.pdfViewer.localeObj.getConstant('Scale Ratio'), iconCss: 'e-pv-scale-ratio-icon' },
            { separator: true, id: pdfViewer.element.id + '_context_menu_comment_separator' },
            { text: this.pdfViewer.localeObj.getConstant('Comment'), iconCss: 'e-pv-comment-icon' },
            { separator: true, id: pdfViewer.element.id + '_context_menu_separator' },
            { text: this.pdfViewer.localeObj.getConstant('Properties') }
        ];
    }
    /**
     * @private
     */
    ContextMenu.prototype.createContextMenu = function () {
        this.contextMenuElement = createElement('ul', { id: this.pdfViewer.element.id + '_context_menu', className: 'e-pv-context-menu' });
        this.pdfViewer.element.appendChild(this.contextMenuElement);
        this.contextMenuObj = new Context({
            target: '#' + this.pdfViewerBase.viewerContainer.id, items: this.copyContextMenu,
            beforeOpen: this.contextMenuOnBeforeOpen.bind(this), select: this.onMenuItemSelect.bind(this),
            created: this.contextMenuOnCreated.bind(this)
        });
        if (this.pdfViewer.enableRtl) {
            this.contextMenuObj.enableRtl = true;
        }
        this.contextMenuObj.appendTo(this.contextMenuElement);
        if (Browser.isDevice) {
            this.contextMenuObj.animationSettings.effect = 'ZoomIn';
        }
        else {
            this.contextMenuObj.animationSettings.effect = 'SlideDown';
        }
    };
    ContextMenu.prototype.contextMenuOnCreated = function (args) {
        // tslint:disable-next-line:max-line-length
        var items = [this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'),
            this.pdfViewer.localeObj.getConstant('Strikethrough context')];
        if (this.pdfViewer.annotationModule) {
            if (!this.pdfViewer.annotationModule.textMarkupAnnotationModule) {
                this.contextMenuObj.enableItems(items, false);
            }
        }
        else {
            this.contextMenuObj.enableItems(items, false);
        }
    };
    ContextMenu.prototype.setTarget = function (args) {
        var target = null;
        if (args.event && args.event.target) {
            target = args.event.target;
            this.currentTarget = target;
        }
        return target;
    };
    // tslint:disable-next-line:max-func-body-length
    ContextMenu.prototype.contextMenuOnBeforeOpen = function (args) {
        var target = this.setTarget(args);
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA') {
            this.pdfViewerBase.isFreeTextContextMenu = true;
        }
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'),
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'),
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
        this.pdfViewerBase.getElement('_context_menu_separator').classList.remove('e-menu-hide');
        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context')], true);
        this.pdfViewer.annotationModule.checkContextMenuDeleteItem(this.contextMenuObj);
        if (this.pdfViewer.textSelectionModule || this.pdfViewerBase.isShapeBasedAnnotationsEnabled()) {
            if (args.event) {
                var isClickWithinSelectionBounds = this.isClickWithinSelectionBounds(args.event);
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu) {
                    this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment'),
                        this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Delete Context')]);
                    this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                    this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.isTextSelected) {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Copy')], true);
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut')], true);
                    }
                    else {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Copy')], false);
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut')], false);
                        window.getSelection().removeAllRanges();
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation.freeTextAnnotationModule && this.pdfViewer.annotation.freeTextAnnotationModule.selectedText !== '') {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], true);
                    }
                    else {
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], false);
                    }
                }
                else if (isClickWithinSelectionBounds && this.pdfViewer.textSelectionModule) {
                    // tslint:disable-next-line:max-line-length
                    if ((!args.event.target.classList.contains('e-pv-maintaincontent') && args.event.target.classList.contains('e-pv-text') || args.event.target.classList.contains('e-pv-text-layer'))) {
                        if (this.pdfViewerBase.checkIsNormalText()) {
                            args.cancel = true;
                        }
                        // tslint:disable-next-line:max-line-length
                    }
                    else if ((Browser.isIE || Browser.info.name === 'edge') && args.event.target.classList.contains('e-pv-page-container')) {
                        args.cancel = true;
                    }
                    // tslint:disable-next-line:max-line-length
                    this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
                    this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                    this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
                    // tslint:disable-next-line:max-line-length
                }
                else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'HandWrittenSignature') {
                    this.onOpeningForShape(false, true);
                    // tslint:disable-next-line:max-line-length
                }
                else if (this.pdfViewer.selectedItems.annotations.length !== 0 && this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType !== 'Path') {
                    this.onOpeningForShape(true);
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied && (args.event.target.classList.contains('e-pv-text-layer') ||
                        args.event.target.classList.contains('e-pv-text')) && !this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        this.onOpeningForShape(false);
                        // tslint:disable-next-line:max-line-length
                    }
                    else if (this.pdfViewerBase.isCalibrateAnnotationModule() && this.pdfViewer.annotationModule.measureAnnotationModule.currentAnnotationMode) {
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties')]);
                        this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Comment')], false);
                    }
                    else if (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Cut'),
                            this.pdfViewer.localeObj.getConstant('Copy'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Scale Ratio')]);
                        this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                        this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.remove('e-menu-hide');
                        // tslint:disable-next-line:max-line-length
                        this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Comment')], false);
                    }
                    else {
                        args.cancel = true;
                    }
                }
            }
            else if (this.pdfViewer.textSelectionModule && (this.pdfViewer.contextMenuOption === 'MouseUp')) {
                // tslint:disable-next-line:max-line-length
                this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Comment'), this.pdfViewer.localeObj.getConstant('Properties')]);
                this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
            }
            else {
                this.hideContextItems();
            }
            this.enableCommentPanelItem();
        }
        else {
            args.cancel = true;
        }
        if (this.pdfViewer.contextMenuOption === 'None') {
            args.cancel = true;
        }
        else {
            this.contextMenuItems(args);
        }
    };
    ContextMenu.prototype.contextMenuItems = function (args) {
        if (this.pdfViewer.contextMenuSettings.contextMenuItems.length) {
            var hideMenuItems = [];
            var ul = this.contextMenuObj.getRootElement();
            for (var j = 0; j < this.pdfViewer.contextMenuSettings.contextMenuItems.length; j++) {
                for (var i = 0; i < this.copyContextMenu.length; i++) {
                    var menuItem = this.copyContextMenu[i].text;
                    switch (menuItem) {
                        case 'Highlight':
                            menuItem = 'Highlight context';
                            break;
                        case 'Underline':
                            menuItem = 'Underline context';
                            break;
                        case 'Strike through':
                            menuItem = 'Strikethrough context';
                            break;
                        case 'Delete':
                            menuItem = 'Delete Context';
                            break;
                        case 'Scale Ratio':
                            menuItem = 'Scale Ratio';
                            break;
                        case 'Comment':
                            this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
                            break;
                        case 'Properties':
                            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
                            break;
                    }
                    var menuName = this.pdfViewer.localeObj.getConstant(menuItem);
                    if (menuName === 'Strike through') {
                        menuName = 'Strikethrough';
                    }
                    if (menuName === 'Scale Ratio') {
                        menuName = 'ScaleRatio';
                    }
                    if (j === 0 && menuName !== ContextMenuItem[this.pdfViewer.contextMenuSettings.contextMenuItems[j]]) {
                        if (menuName === 'Strikethrough') {
                            menuName = 'Strike through';
                        }
                        if (menuName === 'ScaleRatio') {
                            menuName = 'Scale Ratio';
                        }
                        hideMenuItems.push(menuName);
                    }
                    if (j > 0 && menuName === ContextMenuItem[this.pdfViewer.contextMenuSettings.contextMenuItems[j]]) {
                        if (menuName === 'Strikethrough') {
                            menuName = 'Strike through';
                        }
                        if (menuName === 'ScaleRatio') {
                            menuName = 'Scale Ratio';
                        }
                        for (var k = 0; k < hideMenuItems.length; k++) {
                            if (hideMenuItems[k] === menuName) {
                                hideMenuItems.splice(k, 1);
                            }
                        }
                    }
                }
            }
            this.contextMenuObj.hideItems(hideMenuItems);
            if (this.getEnabledItemCount(ul) === 0) {
                args.cancel = true;
            }
        }
    };
    ContextMenu.prototype.getEnabledItemCount = function (ul) {
        var enabledItemCount = this.copyContextMenu.length;
        var liCollection = ul.children;
        for (var i = 0; i < liCollection.length; i++) {
            // tslint:disable-next-line
            var li = liCollection[i];
            if (li.classList.contains('e-menu-hide') || li.classList.contains('e-disabled')) {
                enabledItemCount = enabledItemCount - 1;
            }
        }
        return enabledItemCount;
    };
    ContextMenu.prototype.hideContextItems = function () {
        if (this.pdfViewer.selectedItems.annotations.length === 0) {
            // tslint:disable-next-line:max-line-length
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Paste'), this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Scale Ratio'), this.pdfViewer.localeObj.getConstant('Properties')]);
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
        }
    };
    ContextMenu.prototype.enableCommentPanelItem = function () {
        if (this.pdfViewer.enableCommentPanel) {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Comment')], true);
        }
        else {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Comment')], false);
        }
    };
    ContextMenu.prototype.onOpeningForShape = function (isProp, isSignature) {
        if (this.pdfViewer.annotation && this.pdfViewer.annotation.isShapeCopied) {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], true);
        }
        else {
            this.contextMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Paste')], false);
        }
        // tslint:disable-next-line:max-line-length
        this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Highlight context'), this.pdfViewer.localeObj.getConstant('Underline context'), this.pdfViewer.localeObj.getConstant('Strikethrough context'), this.pdfViewer.localeObj.getConstant('Scale Ratio')]);
        if (isProp) {
            // tslint:disable-next-line:max-line-length
            if (this.pdfViewer.selectedItems.annotations.length !== 0 && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance')) {
                this.contextMenuObj.showItems([this.pdfViewer.localeObj.getConstant('Properties')]);
            }
            else {
                this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Properties')]);
                this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            }
        }
        else if (isSignature) {
            // tslint:disable-next-line:max-line-length
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment')]);
            // tslint:disable-next-line:max-line-length
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
        }
        else {
            this.contextMenuObj.hideItems([this.pdfViewer.localeObj.getConstant('Cut'), this.pdfViewer.localeObj.getConstant('Copy'),
                // tslint:disable-next-line:max-line-length
                this.pdfViewer.localeObj.getConstant('Delete Context'), this.pdfViewer.localeObj.getConstant('Properties'), this.pdfViewer.localeObj.getConstant('Comment')]);
            this.pdfViewerBase.getElement('_context_menu_separator').classList.add('e-menu-hide');
            this.pdfViewerBase.getElement('_context_menu_comment_separator').classList.add('e-menu-hide');
        }
    };
    // tslint:disable-next-line
    ContextMenu.prototype.isClickWithinSelectionBounds = function (event) {
        var isWithin = false;
        if (this.pdfViewer.textSelectionModule) {
            var bounds = this.pdfViewer.textSelectionModule.getCurrentSelectionBounds(this.pdfViewerBase.currentPageNumber - 1);
            if (bounds) {
                var currentBound = bounds;
                if (this.getHorizontalValue(currentBound.left) < event.clientX && this.getHorizontalValue(currentBound.right) >
                    event.clientX && this.getVerticalValue(currentBound.top) < event.clientY &&
                    this.getVerticalValue(currentBound.bottom) > event.clientY) {
                    isWithin = true;
                }
            }
            if ((Browser.isIE || Browser.info.name === 'edge') && bounds) {
                isWithin = true;
            }
        }
        return isWithin;
    };
    ContextMenu.prototype.getHorizontalClientValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.left);
    };
    ContextMenu.prototype.getVerticalClientValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value - pageBounds.top);
    };
    ContextMenu.prototype.getHorizontalValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.left;
    };
    ContextMenu.prototype.getVerticalValue = function (value) {
        var pageDiv = this.pdfViewerBase.getElement('_pageDiv_' + (this.pdfViewerBase.currentPageNumber - 1));
        var pageBounds = pageDiv.getBoundingClientRect();
        return (value * this.pdfViewerBase.getZoomFactor()) + pageBounds.top;
    };
    ContextMenu.prototype.onMenuItemSelect = function (args) {
        // tslint:disable-next-line
        var target = this.currentTarget;
        switch (args.item.text) {
            case this.pdfViewer.localeObj.getConstant('Copy'):
                var isSkip = false;
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || (this.pdfViewer.annotationModule && this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus)) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.copySelectedText();
                    this.contextMenuObj.close();
                    isSkip = true;
                }
                else if (this.pdfViewer.textSelectionModule) {
                    this.pdfViewer.textSelectionModule.copyText();
                    this.contextMenuObj.close();
                }
                if (this.pdfViewer.selectedItems.annotations.length && !isSkip) {
                    this.pdfViewer.copy();
                    this.previousAction = 'Copy';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Highlight context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Highlight');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Underline context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Underline');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Strikethrough context'):
                if (this.pdfViewer.annotation && this.pdfViewer.annotation.textMarkupAnnotationModule) {
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.drawTextMarkupAnnotations('Strikethrough');
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isTextMarkupAnnotationMode = false;
                    this.pdfViewer.annotation.textMarkupAnnotationModule.currentTextMarkupAddMode = '';
                    this.pdfViewer.annotation.textMarkupAnnotationModule.isSelectionMaintained = true;
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Properties'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Line' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'LineWidthArrowHead' ||
                    this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Distance') {
                    this.pdfViewer.annotation.createPropertiesWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Cut'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.cutSelectedText(target);
                    this.contextMenuObj.close();
                }
                else if (this.pdfViewer.selectedItems.annotations.length === 1) {
                    var pageIndex = this.pdfViewer.selectedItems.annotations[0].pageIndex;
                    this.pdfViewer.cut();
                    this.pdfViewer.clearSelection(pageIndex);
                    this.previousAction = 'Cut';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Paste'):
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.isFreeTextContextMenu || this.pdfViewer.annotationModule.freeTextAnnotationModule.isInuptBoxInFocus && (target && target.className === 'free-text-input' && target.tagName === 'TEXTAREA')) {
                    this.pdfViewer.annotation.freeTextAnnotationModule.pasteSelectedText(target);
                    this.contextMenuObj.close();
                }
                else {
                    this.pdfViewer.paste();
                    this.previousAction = 'Paste';
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Delete Context'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.deleteAnnotation();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Scale Ratio'):
                if (this.pdfViewerBase.isCalibrateAnnotationModule()) {
                    this.pdfViewer.annotation.measureAnnotationModule.createScaleRatioWindow();
                }
                break;
            case this.pdfViewer.localeObj.getConstant('Comment'):
                if (this.pdfViewer.annotation) {
                    this.pdfViewer.annotation.showCommentsPanel();
                    if (this.pdfViewer.selectedItems.annotations.length !== 0 ||
                        this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                        // tslint:disable-next-line
                        var currentAnnotation = void 0;
                        if (this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation) {
                            currentAnnotation = this.pdfViewer.annotationModule.textMarkupAnnotationModule.currentTextMarkupAnnotation;
                        }
                        else {
                            currentAnnotation = this.pdfViewer.selectedItems.annotations[0];
                        }
                        // tslint:disable-next-line
                        var accordionExpand = document.getElementById(this.pdfViewer.element.id + '_accordionContainer' + this.pdfViewer.currentPageNumber);
                        if (accordionExpand) {
                            accordionExpand.ej2_instances[0].expandItem(true);
                        }
                        // tslint:disable-next-line
                        var commentsDiv = document.getElementById(currentAnnotation.annotName);
                        if (commentsDiv) {
                            if (!commentsDiv.classList.contains('e-pv-comments-border')) {
                                commentsDiv.firstChild.click();
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    /**
     * @private
     */
    ContextMenu.prototype.destroy = function () {
        if (this.contextMenuObj) {
            this.previousAction = '';
            this.contextMenuObj.destroy();
        }
    };
    return ContextMenu;
}());
export { ContextMenu };
