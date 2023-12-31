import { createElement, L10n, classList, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CommentCharacterElementBox } from '../../implementation/viewer/page';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Button } from '@syncfusion/ej2-buttons';
import { Toolbar, Tab } from '@syncfusion/ej2-navigations';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { Dictionary } from '../../base/index';
import { HelperMethods } from '../editor/editor-helper';
/**
 * @private
 */
var CommentReviewPane = /** @class */ (function () {
    function CommentReviewPane(owner) {
        var _this = this;
        this.isNewComment = false;
        /**
         * @private
         */
        this.selectedTab = 0;
        this.onTabSelection = function (arg) {
            _this.selectedTab = arg.selectedIndex;
            if (_this.selectedTab === 1) {
                _this.owner.trackChangesPane.updateHeight();
            }
            else {
                _this.commentPane.updateHeight();
            }
            _this.owner.resize();
        };
        this.owner = owner;
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        this.initReviewPane(localObj);
        this.parentPaneElement.style.display = 'none';
    }
    Object.defineProperty(CommentReviewPane.prototype, "previousSelectedComment", {
        get: function () {
            return this.previousSelectedCommentInt;
        },
        set: function (value) {
            if (!isNullOrUndefined(value) && value !== this.previousSelectedCommentInt) {
                if (this.commentPane.comments.containsKey(value)) {
                    var commentStart = this.commentPane.getCommentStart(value);
                    var commentMark = commentStart.commentMark;
                    if (commentMark) {
                        classList(commentMark, [], ['e-de-cmt-mark-selected']);
                        this.commentPane.removeSelectionMark('e-de-cmt-selection');
                        this.commentPane.removeSelectionMark('e-de-cmt-mark-selected');
                    }
                    var commentView = this.commentPane.comments.get(value);
                    commentView.hideDrawer();
                    for (var i = 0; i < value.replyComments.length; i++) {
                        commentView = this.commentPane.comments.get(value.replyComments[i]);
                        if (commentView) {
                            commentView.hideDrawer();
                            commentView.hideMenuItems();
                        }
                    }
                }
            }
            this.previousSelectedCommentInt = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    CommentReviewPane.prototype.showHidePane = function (show, tab) {
        if (this.parentPaneElement) {
            this.updateTabHeaderWidth();
            this.parentPaneElement.style.display = show ? 'block' : 'none';
            if (tab === 'Changes') {
                this.reviewTab.select(1);
            }
            else {
                this.reviewTab.select(0);
            }
        }
        this.owner.trackChangesPane.updateTrackChanges(show);
        if (show) {
            this.commentPane.updateHeight();
        }
        if (this.owner) {
            this.owner.resize();
        }
    };
    CommentReviewPane.prototype.updateTabHeaderWidth = function () {
        var reviewTabsEle = this.reviewTab.getRootElement().getElementsByClassName('e-tab-wrap');
        reviewTabsEle[0].style.padding = '0 8px';
        reviewTabsEle[1].style.padding = '0 8px';
    };
    CommentReviewPane.prototype.initReviewPane = function (localValue) {
        var reviewContainer = this.owner.documentHelper.optionsPaneContainer;
        reviewContainer.style.display = 'inline-flex';
        this.initPaneHeader(localValue);
        reviewContainer.appendChild(this.addReviewTab(localValue));
        this.initCommentPane();
    };
    CommentReviewPane.prototype.addReviewTab = function (localValue) {
        var commentHeader = createElement('div', { innerHTML: localValue.getConstant('Comments') });
        var changesHeader = createElement('div', { innerHTML: localValue.getConstant('Changes') });
        // tslint:disable-next-line:max-line-length
        this.parentPaneElement = createElement('div', { styles: 'height:100%;overflow:auto;display:none', className: 'e-de-review-pane' });
        this.element = createElement('div', { className: 'e-de-property-tab' });
        // tslint:disable-next-line:max-line-length
        var items = [{ header: { text: commentHeader }, content: this.reviewPane }, { header: { text: changesHeader } }];
        this.reviewTab = new Tab({ items: items, selected: this.onTabSelection, animation: { previous: { effect: 'None' }, next: { effect: 'None' } } });
        this.reviewTab.appendTo(this.element);
        if (this.owner.enableRtl) {
            this.reviewTab.enableRtl = true;
        }
        this.reviewTab.enablePersistence = true;
        this.parentPaneElement.appendChild(this.element);
        this.closeButton = createElement('button', {
            className: 'e-de-close-icon e-btn e-flat e-icon-btn', id: 'close',
            attrs: { type: 'button', style: 'position:absolute;top:6px;right:1px' }
        });
        this.closeButton.title = localValue.getConstant('Close');
        var closeSpan = createElement('span', { className: 'e-de-op-close-icon e-de-close-icon e-btn-icon e-icons' });
        this.closeButton.appendChild(closeSpan);
        this.element.appendChild(this.closeButton);
        this.closeButton.addEventListener('click', this.closePane.bind(this));
        return this.parentPaneElement;
    };
    CommentReviewPane.prototype.initPaneHeader = function (localValue) {
        this.headerContainer = createElement('div');
        this.reviewPane = createElement('div', { className: 'e-de-cmt-pane' });
        if (this.owner.enableRtl) {
            classList(this.reviewPane, ['e-rtl'], []);
        }
        this.headerContainer.appendChild(this.initToolbar(localValue));
        this.reviewPane.appendChild(this.headerContainer);
        this.reviewPane.style.display = 'block';
        return this.reviewPane;
    };
    CommentReviewPane.prototype.closePane = function () {
        if (this.commentPane && this.commentPane.isEditMode) {
            if (!isNullOrUndefined(this.commentPane.currentEditingComment)
                && this.commentPane.isInsertingReply && this.commentPane.currentEditingComment.replyViewTextBox.value === '') {
                this.owner.documentHelper.currentSelectedComment = undefined;
                this.commentPane.currentEditingComment.cancelReply();
                this.owner.showComments = false;
            }
            else if (this.isNewComment || !isNullOrUndefined(this.commentPane.currentEditingComment)
                && this.commentPane.isInsertingReply && this.commentPane.currentEditingComment.replyViewTextBox.value !== '' ||
                !isNullOrUndefined(this.commentPane.currentEditingComment) && !this.commentPane.isInsertingReply &&
                    this.commentPane.currentEditingComment.textArea.value !== this.commentPane.currentEditingComment.comment.text) {
                var localObj = new L10n('documenteditor', this.owner.defaultLocale);
                localObj.setLocale(this.owner.locale);
                this.confirmDialog = DialogUtility.confirm({
                    title: localObj.getConstant('Un-posted comments'),
                    content: localObj.getConstant('Discard Comment'),
                    okButton: {
                        text: 'Discard', click: this.discardButtonClick.bind(this)
                    },
                    cancelButton: {
                        text: 'Cancel', click: this.closeDialogUtils.bind(this)
                    },
                    showCloseIcon: true,
                    closeOnEscape: true,
                    animationSettings: { effect: 'Zoom' },
                    position: { X: 'Center', Y: 'Center' }
                });
            }
            else {
                this.owner.documentHelper.currentSelectedComment = undefined;
                this.commentPane.currentEditingComment.cancelEditing();
                this.owner.showComments = false;
            }
        }
        else {
            this.owner.documentHelper.currentSelectedComment = undefined;
            this.owner.showComments = false;
            this.owner.showRevisions = false;
            this.owner.documentHelper.currentSelectedRevision = undefined;
        }
    };
    CommentReviewPane.prototype.discardButtonClick = function () {
        if (this.commentPane.currentEditingComment) {
            var isNewComment = this.isNewComment;
            if (this.commentPane.currentEditingComment && this.commentPane.isInsertingReply) {
                this.commentPane.currentEditingComment.cancelReply();
            }
            else {
                this.commentPane.currentEditingComment.cancelEditing();
                if (isNewComment) {
                    this.discardComment(this.commentPane.currentEditingComment.comment);
                }
            }
            this.owner.documentHelper.currentSelectedComment = undefined;
            this.closeDialogUtils();
            this.owner.showComments = false;
        }
    };
    CommentReviewPane.prototype.closeDialogUtils = function () {
        this.confirmDialog.close();
        this.confirmDialog = undefined;
    };
    CommentReviewPane.prototype.initToolbar = function (localValue) {
        this.toolbarElement = createElement('div');
        this.toolbar = new Toolbar({
            items: [
                {
                    prefixIcon: 'e-de-new-cmt e-de-cmt-tbr', tooltipText: localValue.getConstant('New Comment'),
                    text: localValue.getConstant('New Comment'), click: this.insertComment.bind(this)
                },
                {
                    prefixIcon: 'e-de-nav-left-arrow e-de-cmt-tbr', align: 'Right',
                    tooltipText: localValue.getConstant('Previous Comment'), click: this.navigatePreviousComment.bind(this)
                },
                {
                    prefixIcon: 'e-de-nav-right-arrow e-de-cmt-tbr', align: 'Right',
                    tooltipText: localValue.getConstant('Next Comment'), click: this.navigateNextComment.bind(this)
                }
            ],
            enableRtl: this.owner.enableRtl
        });
        this.toolbar.appendTo(this.toolbarElement);
        return this.toolbarElement;
    };
    CommentReviewPane.prototype.insertComment = function () {
        if (this.owner && this.owner.editorModule) {
            this.owner.editorModule.insertComment('');
        }
    };
    CommentReviewPane.prototype.addComment = function (comment, isNewComment) {
        this.isNewComment = isNewComment;
        this.owner.documentHelper.currentSelectedComment = comment;
        this.commentPane.insertComment(comment);
        if (!isNewComment) {
            var commentView = this.commentPane.comments.get(comment);
            commentView.cancelEditing();
            this.enableDisableToolbarItem();
        }
        this.selectComment(comment);
    };
    CommentReviewPane.prototype.deleteComment = function (comment) {
        if (this.commentPane) {
            this.commentPane.deleteComment(comment);
        }
    };
    CommentReviewPane.prototype.selectComment = function (comment) {
        if (this.commentPane.isEditMode) {
            return;
        }
        if (comment.isReply) {
            comment = comment.ownerComment;
        }
        if (this.owner && this.owner.viewer && this.owner.documentHelper.currentSelectedComment !== comment) {
            this.owner.documentHelper.currentSelectedComment = comment;
        }
        this.commentPane.selectComment(comment);
    };
    CommentReviewPane.prototype.resolveComment = function (comment) {
        this.commentPane.resolveComment(comment);
    };
    CommentReviewPane.prototype.reopenComment = function (comment) {
        this.commentPane.reopenComment(comment);
    };
    CommentReviewPane.prototype.addReply = function (comment, newComment) {
        this.isNewComment = newComment;
        this.commentPane.insertReply(comment);
        if (!newComment) {
            var commentView = this.commentPane.comments.get(comment);
            commentView.cancelEditing();
            this.enableDisableToolbarItem();
        }
        this.selectComment(comment.ownerComment);
    };
    CommentReviewPane.prototype.navigatePreviousComment = function () {
        if (this.owner && this.owner.editorModule) {
            this.owner.selection.navigatePreviousComment();
        }
    };
    CommentReviewPane.prototype.navigateNextComment = function () {
        if (this.owner && this.owner.editorModule) {
            this.owner.selection.navigateNextComment();
        }
    };
    CommentReviewPane.prototype.enableDisableToolbarItem = function () {
        if (this.toolbar) {
            var enable = true;
            if (this.commentPane.isEditMode) {
                enable = !this.commentPane.isEditMode;
            }
            var elements = this.toolbar.element.querySelectorAll('.' + 'e-de-cmt-tbr');
            this.toolbar.enableItems(elements[0].parentElement.parentElement, enable);
            if (enable && this.owner && this.owner.viewer) {
                enable = !(this.owner.documentHelper.comments.length === 0);
            }
            this.toolbar.enableItems(elements[1].parentElement.parentElement, enable);
            this.toolbar.enableItems(elements[2].parentElement.parentElement, enable);
        }
    };
    CommentReviewPane.prototype.initCommentPane = function () {
        this.commentPane = new CommentPane(this.owner, this);
        this.commentPane.initCommentPane();
    };
    CommentReviewPane.prototype.layoutComments = function () {
        for (var i = 0; i < this.owner.documentHelper.comments.length; i++) {
            this.commentPane.addComment(this.owner.documentHelper.comments[i]);
        }
    };
    CommentReviewPane.prototype.clear = function () {
        this.previousSelectedCommentInt = undefined;
        this.commentPane.clear();
    };
    CommentReviewPane.prototype.discardComment = function (comment) {
        if (comment) {
            if (this.owner.editorHistory) {
                this.owner.editorHistory.undo();
                this.owner.editorHistory.redoStack.pop();
            }
            else if (this.owner.editor) {
                this.owner.editor.deleteCommentInternal(comment);
            }
        }
    };
    CommentReviewPane.prototype.destroy = function () {
        if (this.commentPane) {
            this.commentPane.destroy();
        }
        this.commentPane = undefined;
        if (this.closeButton && this.closeButton.parentElement) {
            this.closeButton.parentElement.removeChild(this.closeButton);
        }
        this.closeButton = undefined;
        if (this.toolbar) {
            this.toolbar.destroy();
        }
        this.toolbar = undefined;
        if (this.toolbarElement && this.toolbarElement.parentElement) {
            this.toolbarElement.parentElement.removeChild(this.toolbarElement);
        }
        this.toolbarElement = undefined;
        if (this.headerContainer && this.headerContainer.parentElement) {
            this.headerContainer.parentElement.removeChild(this.headerContainer);
        }
        this.headerContainer = undefined;
        this.previousSelectedCommentInt = undefined;
        if (this.reviewPane && this.reviewPane.parentElement) {
            this.reviewPane.parentElement.removeChild(this.reviewPane);
        }
        this.reviewPane.innerHTML = '';
        this.reviewPane = undefined;
        this.owner = undefined;
    };
    return CommentReviewPane;
}());
export { CommentReviewPane };
/**
 * @private
 */
var CommentPane = /** @class */ (function () {
    function CommentPane(owner, pane) {
        this.isEditModeInternal = false;
        this.isInsertingReply = false;
        this.owner = owner;
        this.parentPane = pane;
        this.parent = pane.reviewPane;
        this.comments = new Dictionary();
    }
    Object.defineProperty(CommentPane.prototype, "isEditMode", {
        /**
         * @private
         */
        get: function () {
            return this.isEditModeInternal;
        },
        /**
         * @private
         */
        set: function (value) {
            this.isEditModeInternal = value;
            var keys = this.comments.keys;
            for (var i = 0; i < keys.length; i++) {
                var commentView = this.comments.get(keys[i]);
                if (value) {
                    commentView.menuBar.style.display = 'none';
                }
                else if (!commentView.comment.isReply) {
                    commentView.menuBar.style.display = 'block';
                }
            }
            if (this.parentPane) {
                this.parentPane.enableDisableToolbarItem();
            }
            if (this.owner) {
                if (this.isEditModeInternal) {
                    this.owner.trigger('commentBegin');
                }
                else {
                    this.owner.trigger('commentEnd');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    CommentPane.prototype.initCommentPane = function () {
        this.commentPane = createElement('div', { className: 'e-de-cmt-container' });
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        this.noCommentIndicator = createElement('div', {
            className: 'e-de-cmt-no-cmt',
            innerHTML: localObj.getConstant('No comments in this document')
        });
        this.commentPane.appendChild(this.noCommentIndicator);
        this.parent.appendChild(this.commentPane);
    };
    CommentPane.prototype.addComment = function (comment) {
        var commentView = new CommentView(this.owner, this, comment);
        var commentParent = commentView.layoutComment(false);
        this.comments.add(comment, commentView);
        this.commentPane.appendChild(commentParent);
        for (var i = 0; i < comment.replyComments.length; i++) {
            var replyView = new CommentView(this.owner, this, comment.replyComments[i]);
            this.comments.add(comment.replyComments[i], replyView);
            commentParent.insertBefore(replyView.layoutComment(true), commentView.replyViewContainer);
        }
        this.updateCommentStatus();
        commentView.hideDrawer();
    };
    CommentPane.prototype.updateHeight = function () {
        // tslint:disable-next-line:max-line-length
        var tabHeaderHeight = this.parentPane.reviewTab.getRootElement().getElementsByClassName('e-tab-header')[0].getBoundingClientRect().height;
        // tslint:disable-next-line:max-line-length
        this.commentPane.style.height = this.parentPane.parentPaneElement.clientHeight - this.parentPane.headerContainer.clientHeight - tabHeaderHeight + 'px';
    };
    CommentPane.prototype.insertReply = function (replyComment) {
        var parentComment = replyComment.ownerComment;
        var parentView = this.comments.get(parentComment);
        var replyView = new CommentView(this.owner, this, replyComment);
        this.comments.add(replyComment, replyView);
        var replyElement = replyView.layoutComment(true);
        var replyIndex = parentComment.replyComments.indexOf(replyComment);
        if (replyIndex === parentComment.replyComments.length - 1) {
            parentView.parentElement.insertBefore(replyElement, parentView.replyViewContainer);
        }
        else {
            var nextReply = parentComment.replyComments[replyIndex + 1];
            parentView.parentElement.insertBefore(replyElement, this.comments.get(nextReply).parentElement);
        }
        replyView.editComment();
    };
    CommentPane.prototype.insertComment = function (comment) {
        var commentView = new CommentView(this.owner, this, comment);
        var commentParent = commentView.layoutComment(false);
        this.comments.add(comment, commentView);
        if (this.owner.documentHelper.comments.indexOf(comment) === this.owner.documentHelper.comments.length - 1) {
            this.commentPane.appendChild(commentParent);
        }
        else {
            var index = this.owner.documentHelper.comments.indexOf(comment);
            var element = this.comments.get(this.owner.documentHelper.comments[index + 1]).parentElement;
            this.commentPane.insertBefore(commentParent, element);
            commentParent.focus();
        }
        this.updateCommentStatus();
        commentView.editComment();
    };
    CommentPane.prototype.removeSelectionMark = function (className) {
        if (this.parent) {
            var elements = this.parent.getElementsByClassName(className);
            for (var i = 0; i < elements.length; i++) {
                classList(elements[i], [], [className]);
            }
        }
    };
    CommentPane.prototype.selectComment = function (comment) {
        this.removeSelectionMark('e-de-cmt-selection');
        if (comment.isReply) {
            comment = comment.ownerComment;
        }
        if (comment) {
            var commentView = this.comments.get(comment);
            var selectedElement = commentView.parentElement;
            if (selectedElement) {
                classList(selectedElement, ['e-de-cmt-selection'], []);
                selectedElement.focus();
            }
            var commentStart = this.getCommentStart(comment);
            if (!commentStart.commentMark) {
                commentStart.renderCommentMark();
            }
            classList(commentStart.commentMark, ['e-de-cmt-mark-selected'], []);
            commentView.showDrawer();
        }
    };
    CommentPane.prototype.getCommentStart = function (comment) {
        var localValue = new L10n('documenteditor', this.owner.defaultLocale);
        localValue.setLocale(this.owner.locale);
        var commentStart = undefined;
        if (comment && comment.commentStart) {
            commentStart = comment.commentStart;
        }
        if (commentStart.commentMark !== undefined) {
            commentStart.commentMark.title = localValue.getConstant('Click to see this comment');
        }
        return this.getFirstCommentInLine(commentStart);
    };
    CommentPane.prototype.getFirstCommentInLine = function (commentStart) {
        for (var i = 0; i < commentStart.line.children.length; i++) {
            var startComment = commentStart.line.children[i];
            if (startComment instanceof CommentCharacterElementBox && startComment.commentType === 0) {
                return startComment;
            }
        }
        return commentStart;
    };
    CommentPane.prototype.deleteComment = function (comment) {
        var commentView = this.comments.get(comment);
        if (commentView.parentElement && commentView.parentElement.parentElement) {
            commentView.parentElement.parentElement.removeChild(commentView.parentElement);
        }
        //this.commentPane.removeChild();
        this.comments.remove(comment);
        commentView.destroy();
        this.updateCommentStatus();
    };
    CommentPane.prototype.resolveComment = function (comment) {
        var commentView = this.comments.get(comment);
        if (commentView) {
            commentView.resolveComment();
        }
    };
    CommentPane.prototype.reopenComment = function (comment) {
        var commentView = this.comments.get(comment);
        if (commentView) {
            commentView.reopenComment();
        }
    };
    CommentPane.prototype.updateCommentStatus = function () {
        if (this.owner.documentHelper.comments.length === 0) {
            if (!this.noCommentIndicator.parentElement) {
                this.commentPane.appendChild(this.noCommentIndicator);
            }
            this.noCommentIndicator.style.display = 'block';
        }
        else {
            this.noCommentIndicator.style.display = 'none';
        }
        if (this.parentPane) {
            this.parentPane.enableDisableToolbarItem();
        }
    };
    CommentPane.prototype.clear = function () {
        this.isEditMode = false;
        this.currentEditingComment = undefined;
        this.isInsertingReply = false;
        this.removeChildElements();
        this.commentPane.innerHTML = '';
        this.updateCommentStatus();
    };
    CommentPane.prototype.removeChildElements = function () {
        var comments = this.comments.keys;
        for (var i = 0; i < comments.length; i++) {
            this.comments.get(comments[i]).destroy();
        }
        this.comments.clear();
    };
    CommentPane.prototype.destroy = function () {
        this.removeChildElements();
        if (this.noCommentIndicator && this.noCommentIndicator) {
            this.noCommentIndicator.parentElement.removeChild(this.noCommentIndicator);
        }
        this.noCommentIndicator = undefined;
        if (this.commentPane && this.commentPane.parentElement) {
            this.commentPane.parentElement.removeChild(this.commentPane);
        }
        this.commentPane.innerHTML = '';
        this.parentPane = undefined;
        this.owner = undefined;
    };
    return CommentPane;
}());
export { CommentPane };
/**
 * @private
 */
var CommentView = /** @class */ (function () {
    function CommentView(owner, commentPane, comment) {
        this.isReply = false;
        this.isDrawerExpand = false;
        this.owner = owner;
        this.comment = comment;
        this.commentPane = commentPane;
    }
    CommentView.prototype.layoutComment = function (isReply) {
        this.isReply = isReply;
        var classList = 'e-de-cmt-sub-container';
        if (isReply) {
            classList += ' e-de-cmt-reply';
        }
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        this.parentElement = createElement('div', { className: classList });
        this.initCommentHeader(localObj);
        this.initCommentView(localObj);
        this.initDateView();
        if (!this.comment.isReply) {
            this.parentElement.tabIndex = 0;
            this.initReplyView(localObj);
            this.initResolveOption(localObj);
            this.initDrawer();
            if (this.comment.isResolved) {
                this.resolveComment();
            }
        }
        else {
            this.menuBar.style.display = 'none';
        }
        this.commentView.addEventListener('mouseenter', this.showMenuItems.bind(this));
        this.commentView.addEventListener('mouseleave', this.hideMenuItemOnMouseLeave.bind(this));
        return this.parentElement;
    };
    CommentView.prototype.initCommentHeader = function (localObj) {
        var commentDiv = createElement('div', { className: 'e-de-cmt-view' });
        var commentUserInfo = createElement('div', { className: 'e-de-cmt-author' });
        var userName = createElement('div', { className: 'e-de-cmt-author-name' });
        userName.textContent = this.comment.author;
        if (!isNullOrUndefined(this.comment.author)) {
            commentUserInfo.style.display = 'flex';
            this.owner.documentHelper.getAvatar(commentUserInfo, userName, this.comment, undefined);
        }
        //if (this.comment.author === this.owner.currentUser) {
        this.menuBar = createElement('button', { className: 'e-de-cp-option', attrs: { type: 'button' } });
        var userOption = [{ text: localObj.getConstant('Edit') },
            { text: localObj.getConstant('Delete') },
            { text: localObj.getConstant('Reply') },
            { text: localObj.getConstant('Resolve') }];
        var menuItem = new DropDownButton({
            items: this.isReply ? userOption.splice(0, 2) : userOption,
            select: this.userOptionSelectEvent.bind(this),
            iconCss: 'e-de-menu-icon',
            cssClass: 'e-caret-hide',
            enableRtl: this.owner.enableRtl
        });
        this.menuBar.title = localObj.getConstant('More Options') + '...';
        menuItem.appendTo(this.menuBar);
        commentUserInfo.appendChild(this.menuBar);
        this.dropDownButton = menuItem;
        commentDiv.appendChild(commentUserInfo);
        this.commentView = commentDiv;
        this.parentElement.appendChild(commentDiv);
        commentDiv.addEventListener('click', this.selectComment.bind(this));
    };
    CommentView.prototype.selectComment = function (event) {
        if (this.commentPane) {
            if (!this.commentPane.isEditMode) {
                this.owner.selection.selectComment(this.comment);
            }
            else if (this.commentPane.isEditMode && this.commentPane.isInsertingReply
                && this.commentPane.currentEditingComment && this.commentPane.currentEditingComment.replyViewTextBox.value === '') {
                var comment = this.comment;
                if (comment && comment.isReply) {
                    comment = this.comment.ownerComment;
                }
                if (comment && this.owner.documentHelper.currentSelectedComment === comment) {
                    return;
                }
                this.commentPane.currentEditingComment.cancelReply();
                this.owner.selection.selectComment(this.comment);
            }
        }
    };
    CommentView.prototype.initCommentView = function (localObj) {
        this.commentText = createElement('div', { className: 'e-de-cmt-readonly' });
        this.commentText.innerText = this.comment.text;
        this.commentView.appendChild(this.commentText);
        this.initEditView(localObj);
    };
    CommentView.prototype.initEditView = function (localObj) {
        this.textAreaContainer = createElement('div', { styles: 'display:none' });
        this.textArea = createElement('textarea', { className: 'e-de-cmt-textarea e-input' });
        this.textArea.placeholder = localObj.getConstant('Type your comment here');
        this.textArea.rows = 1;
        this.textArea.value = this.comment.text.trim();
        this.textArea.addEventListener('keydown', this.updateTextAreaHeight.bind(this));
        this.textArea.addEventListener('keyup', this.enableDisablePostButton.bind(this));
        var editRegionFooter = createElement('div', { className: 'e-de-cmt-action-button' });
        //tslint:disable-next-line:max-line-length
        var postButton = createElement('button', { className: 'e-de-cmt-post-btn e-btn e-flat', attrs: { type: 'button' } });
        //tslint:disable-next-line:max-line-length
        this.postButton = new Button({ cssClass: 'e-btn e-flat e-primary e-de-overlay', iconCss: 'e-de-cmt-post', disabled: true }, postButton);
        postButton.addEventListener('click', this.postComment.bind(this));
        postButton.title = localObj.getConstant('Post');
        var cancelButton = createElement('button', {
            className: 'e-de-cmt-cancel-btn e-btn e-flat',
            attrs: { type: 'button' }
        });
        this.cancelButton = new Button({ cssClass: 'e-btn e-flat', iconCss: 'e-de-cmt-cancel' }, cancelButton);
        cancelButton.title = localObj.getConstant('Cancel');
        cancelButton.addEventListener('click', this.cancelEditing.bind(this));
        editRegionFooter.appendChild(postButton);
        editRegionFooter.appendChild(cancelButton);
        this.textAreaContainer.appendChild(this.textArea);
        this.textAreaContainer.appendChild(editRegionFooter);
        this.commentView.appendChild(this.textAreaContainer);
    };
    CommentView.prototype.initDateView = function () {
        this.commentDate = createElement('div', { className: 'e-de-cmt-date' });
        this.commentDate.innerText = HelperMethods.getModifiedDate(this.comment.date);
        this.commentView.appendChild(this.commentDate);
    };
    CommentView.prototype.initDrawer = function () {
        this.drawerElement = createElement('div', { styles: 'display:none;', className: 'e-de-cmt-drawer-cnt' });
        var leftPane = createElement('div', { className: 'e-de-cmt-drawer' });
        var spanElement = createElement('span');
        leftPane.appendChild(spanElement);
        this.drawerElement.appendChild(leftPane);
        this.drawerSpanElement = spanElement;
        this.drawerAction = leftPane;
        this.drawerAction.addEventListener('click', this.showOrHideDrawer.bind(this));
        this.parentElement.appendChild(this.drawerElement);
    };
    CommentView.prototype.initReplyView = function (localObj) {
        this.replyViewContainer = createElement('div', { className: 'e-de-cmt-rply-view' });
        if (this.commentPane.parentPane.isNewComment) {
            this.replyViewContainer.style.display = 'none';
        }
        this.replyViewTextBox = createElement('textarea', { className: 'e-de-cmt-textarea e-input' });
        this.replyViewTextBox.placeholder = localObj.getConstant('Reply');
        this.replyViewTextBox.rows = 1;
        this.replyViewTextBox.value = '';
        this.replyViewTextBox.readOnly = true;
        this.replyViewTextBox.addEventListener('click', this.enableReplyView.bind(this));
        this.replyViewTextBox.addEventListener('keydown', this.updateReplyTextAreaHeight.bind(this));
        this.replyViewTextBox.addEventListener('keyup', this.enableDisableReplyPostButton.bind(this));
        var editRegionFooter = createElement('div', { styles: 'display:none', className: 'e-de-cmt-action-button' });
        //tslint:disable-next-line:max-line-length
        var postButton = createElement('button', { className: 'e-de-cmt-post-btn e-de-overlay e-btn e-flat', attrs: { type: 'button' } });
        this.replyPostButton = new Button({ cssClass: 'e-btn e-flat e-primary', iconCss: 'e-de-cmt-post', disabled: true }, postButton);
        postButton.addEventListener('click', this.postReply.bind(this));
        postButton.title = localObj.getConstant('Post');
        var cancelButton = createElement('button', {
            className: 'e-de-cmt-cancel-btn e-btn e-flat',
            attrs: { type: 'button' }
        });
        this.replyCancelButton = new Button({ cssClass: 'e-btn e-flat', iconCss: 'e-de-cmt-cancel' }, cancelButton);
        cancelButton.addEventListener('click', this.cancelReply.bind(this));
        cancelButton.title = localObj.getConstant('Cancel');
        editRegionFooter.appendChild(postButton);
        editRegionFooter.appendChild(cancelButton);
        this.replyFooter = editRegionFooter;
        this.replyViewContainer.appendChild(this.replyViewTextBox);
        this.replyViewContainer.appendChild(editRegionFooter);
        this.parentElement.appendChild(this.replyViewContainer);
    };
    CommentView.prototype.initResolveOption = function (localObj) {
        var editRegionFooter = createElement('div', { className: 'e-de-cmt-resolve-btn' });
        //tslint:disable-next-line:max-line-length
        var postButton = createElement('button', { className: 'e-de-cmt-post-btn e-btn e-flat', attrs: { type: 'button' } });
        //tslint:disable-next-line:max-line-length
        this.reopenButton = new Button({ cssClass: 'e-btn e-flat', iconCss: 'e-de-cmt-reopen' }, postButton);
        postButton.title = localObj.getConstant('Reopen');
        postButton.addEventListener('click', this.reopenButtonClick.bind(this));
        var cancelButton = createElement('button', {
            className: 'e-de-cmt-cancel-btn e-btn e-flat',
            attrs: { type: 'button' }
        });
        cancelButton.title = localObj.getConstant('Delete');
        this.deleteButton = new Button({ cssClass: 'e-btn e-flat', iconCss: 'e-de-cmt-delete' }, cancelButton);
        cancelButton.addEventListener('click', this.deleteComment.bind(this));
        editRegionFooter.appendChild(postButton);
        editRegionFooter.appendChild(cancelButton);
        this.parentElement.appendChild(editRegionFooter);
    };
    CommentView.prototype.reopenButtonClick = function () {
        this.owner.editor.reopenComment(this.comment);
    };
    CommentView.prototype.deleteComment = function () {
        var eventArgs = { author: this.comment.author, cancel: false };
        this.owner.trigger('commentDelete', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.owner.editorModule.deleteCommentInternal(this.comment);
    };
    CommentView.prototype.updateReplyTextAreaHeight = function () {
        var _this = this;
        setTimeout(function () {
            _this.replyViewTextBox.style.height = 'auto';
            var scrollHeight = _this.replyViewTextBox.scrollHeight;
            _this.replyViewTextBox.style.height = scrollHeight + 'px';
        });
    };
    CommentView.prototype.enableDisableReplyPostButton = function () {
        this.replyPostButton.disabled = this.replyViewTextBox.value === '';
        if (this.replyPostButton.disabled) {
            classList(this.replyPostButton.element, ['e-de-overlay'], []);
        }
        else if (this.replyPostButton.element.classList.contains('e-de-overlay')) {
            classList(this.replyPostButton.element, [], ['e-de-overlay']);
        }
    };
    CommentView.prototype.enableReplyView = function () {
        var _this = this;
        if (this.commentPane.isEditMode) {
            return;
        }
        this.commentPane.currentEditingComment = this;
        this.commentPane.isInsertingReply = true;
        if (this.owner.documentHelper.currentSelectedComment !== this.comment) {
            this.owner.selection.selectComment(this.comment);
        }
        this.commentPane.isEditMode = true;
        this.replyViewTextBox.readOnly = false;
        this.replyFooter.style.display = 'block';
        setTimeout(function () {
            _this.replyViewTextBox.focus();
        });
    };
    CommentView.prototype.postReply = function () {
        var replyText = this.replyViewTextBox.value;
        this.cancelReply();
        this.updateReplyTextAreaHeight();
        this.owner.editorModule.replyComment(this.comment, replyText);
    };
    CommentView.prototype.cancelReply = function () {
        this.commentPane.currentEditingComment = undefined;
        this.commentPane.isInsertingReply = true;
        this.commentPane.isEditMode = false;
        this.replyPostButton.disabled = true;
        this.replyViewTextBox.value = '';
        this.replyViewTextBox.readOnly = true;
        this.replyFooter.style.display = 'none';
    };
    CommentView.prototype.updateTextAreaHeight = function () {
        var _this = this;
        setTimeout(function () {
            _this.textArea.style.height = 'auto';
            var scrollHeight = _this.textArea.scrollHeight;
            _this.textArea.style.height = scrollHeight + 'px';
        });
    };
    CommentView.prototype.showMenuItems = function () {
        if (this.comment.isReply) {
            if (!this.commentPane.isEditMode && (!isNullOrUndefined(this.comment) && !this.comment.isResolved)) {
                this.menuBar.style.display = 'block';
            }
        }
        var commentStart = this.commentPane.getCommentStart(this.comment);
        if (!isNullOrUndefined(commentStart) && !isNullOrUndefined(commentStart.commentMark)) {
            commentStart.commentMark.classList.add('e-de-cmt-mark-hover');
        }
    };
    CommentView.prototype.hideMenuItemOnMouseLeave = function () {
        if (this.comment.isReply) {
            if (this.owner.documentHelper.currentSelectedComment !== this.comment.ownerComment) {
                this.hideMenuItems();
            }
        }
        if (this.commentPane) {
            var commentStart = this.commentPane.getCommentStart(this.comment);
            if (!isNullOrUndefined(commentStart) && !isNullOrUndefined(commentStart.commentMark)) {
                commentStart.commentMark.classList.remove('e-de-cmt-mark-hover');
            }
        }
    };
    CommentView.prototype.hideMenuItems = function () {
        this.menuBar.style.display = 'none';
    };
    CommentView.prototype.enableDisablePostButton = function () {
        this.postButton.disabled = this.textArea.value === '';
        if (this.postButton.disabled) {
            classList(this.postButton.element, ['e-de-overlay'], []);
        }
        else if (this.postButton.element.classList.contains('e-de-overlay')) {
            classList(this.postButton.element, [], ['e-de-overlay']);
        }
    };
    CommentView.prototype.editComment = function () {
        var _this = this;
        this.commentPane.currentEditingComment = this;
        this.commentPane.isInsertingReply = false;
        this.commentPane.isEditMode = true;
        this.commentText.style.display = 'none';
        this.textAreaContainer.style.display = 'block';
        this.commentDate.style.display = 'none';
        this.menuBar.style.display = 'none';
        this.updateTextAreaHeight();
        setTimeout(function () {
            _this.textArea.focus();
        });
    };
    CommentView.prototype.resolveComment = function () {
        classList(this.parentElement, ['e-de-cmt-resolved'], []);
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        this.dropDownButton.items = [{ text: localObj.getConstant('Reopen') }, { text: localObj.getConstant('Delete') }];
    };
    CommentView.prototype.reopenComment = function () {
        classList(this.parentElement, [], ['e-de-cmt-resolved']);
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        this.dropDownButton.items = [{ text: localObj.getConstant('Edit') },
            { text: localObj.getConstant('Delete') },
            { text: localObj.getConstant('Reply') },
            { text: localObj.getConstant('Resolve') }];
        this.showDrawer();
    };
    CommentView.prototype.postComment = function () {
        var updatedText = this.textArea.value;
        this.commentText.innerText = updatedText;
        this.comment.text = updatedText;
        this.showCommentView();
        if (this.commentPane && this.commentPane.parentPane) {
            this.commentPane.parentPane.isNewComment = false;
        }
        if (!isNullOrUndefined(this.replyViewContainer)) {
            this.replyViewContainer.style.display = '';
        }
    };
    CommentView.prototype.showCommentView = function () {
        this.commentPane.isEditMode = false;
        this.textAreaContainer.style.display = 'none';
        this.commentText.style.display = 'block';
        this.commentDate.style.display = 'block';
        this.menuBar.style.display = 'block';
    };
    CommentView.prototype.cancelEditing = function () {
        this.showCommentView();
        this.textArea.value = this.comment.text.trim();
        if (this.commentPane.parentPane.isNewComment) {
            if (this.commentPane && this.commentPane.parentPane) {
                this.commentPane.parentPane.isNewComment = false;
            }
            this.commentPane.parentPane.discardComment(this.comment);
        }
    };
    CommentView.prototype.showOrHideDrawer = function () {
        if (this.isDrawerExpand) {
            this.hideDrawer();
        }
        else {
            this.showDrawer();
        }
    };
    CommentView.prototype.hideDrawer = function () {
        if (this.parentElement) {
            var localObj = new L10n('documenteditor', this.owner.defaultLocale);
            localObj.setLocale(this.owner.locale);
            var elements = this.parentElement.getElementsByClassName('e-de-cmt-sub-container');
            if (elements.length > 1) {
                for (var i = 1; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                this.drawerElement.style.display = 'block';
                classList(this.drawerSpanElement, [], ['e-de-nav-up']);
                this.drawerSpanElement.innerText = '+' + (elements.length - 1) + ' ' + localObj.getConstant('more') + '...';
            }
            this.isDrawerExpand = false;
        }
    };
    CommentView.prototype.showDrawer = function () {
        if (this.parentElement) {
            var elements = this.parentElement.getElementsByClassName('e-de-cmt-sub-container');
            if (elements.length > 1) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                this.drawerElement.style.display = 'block';
                this.drawerSpanElement.innerText = '';
                classList(this.drawerSpanElement, ['e-de-nav-up'], []);
            }
            this.isDrawerExpand = true;
        }
    };
    CommentView.prototype.userOptionSelectEvent = function (event) {
        var selectedItem = event.item.text;
        var localObj = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        switch (selectedItem) {
            case localObj.getConstant('Edit'):
                this.editComment();
                break;
            case localObj.getConstant('Reply'):
                this.enableReplyView();
                break;
            case localObj.getConstant('Delete'):
                this.deleteComment();
                break;
            case localObj.getConstant('Resolve'):
                this.owner.editor.resolveComment(this.comment);
                break;
            case localObj.getConstant('Reopen'):
                this.owner.editor.reopenComment(this.comment);
        }
    };
    CommentView.prototype.unwireEvent = function () {
        if (this.drawerAction) {
            this.drawerAction.removeEventListener('click', this.showOrHideDrawer.bind(this));
        }
        if (this.textArea) {
            this.textArea.removeEventListener('keydown', this.updateTextAreaHeight.bind(this));
            this.textArea.removeEventListener('keyup', this.enableDisablePostButton.bind(this));
        }
        if (this.postButton) {
            this.postButton.removeEventListener('click', this.postComment.bind(this));
        }
        if (this.cancelButton) {
            this.cancelButton.removeEventListener('click', this.cancelEditing.bind(this));
        }
        if (this.commentView) {
            this.commentView.removeEventListener('click', this.selectComment.bind(this));
            this.commentView.removeEventListener('mouseenter', this.showMenuItems.bind(this));
            this.commentView.removeEventListener('mouseleave', this.hideMenuItemOnMouseLeave.bind(this));
        }
    };
    CommentView.prototype.destroy = function () {
        this.unwireEvent();
        if (this.comment) {
            this.comment = undefined;
        }
        if (this.dropDownButton) {
            this.dropDownButton.destroy();
        }
        this.dropDownButton = undefined;
        if (this.postButton) {
            this.postButton.destroy();
        }
        this.postButton = undefined;
        if (this.cancelButton) {
            this.cancelButton.destroy();
        }
        if (this.replyPostButton) {
            this.replyPostButton.destroy();
            this.replyPostButton = undefined;
        }
        if (this.replyCancelButton) {
            this.replyCancelButton.destroy();
            this.replyCancelButton = undefined;
        }
        if (this.reopenButton) {
            this.reopenButton.destroy();
            this.reopenButton = undefined;
        }
        if (this.deleteButton) {
            this.deleteButton.destroy();
            this.deleteButton = undefined;
        }
        this.replyViewContainer = undefined;
        this.replyViewTextBox = undefined;
        this.replyFooter = undefined;
        if (this.parentElement && this.parentElement.parentElement) {
            this.parentElement.parentElement.removeChild(this.parentElement);
        }
        this.commentPane = undefined;
        this.parentElement.innerHTML = '';
        this.cancelButton = undefined;
        this.owner = undefined;
        this.menuBar = undefined;
        this.commentView = undefined;
        this.drawerAction = undefined;
        this.commentText = undefined;
        this.commentDate = undefined;
        this.textAreaContainer = undefined;
        this.textArea = undefined;
        this.drawerElement = undefined;
        this.drawerSpanElement = undefined;
        this.parentElement = null;
    };
    return CommentView;
}());
export { CommentView };
