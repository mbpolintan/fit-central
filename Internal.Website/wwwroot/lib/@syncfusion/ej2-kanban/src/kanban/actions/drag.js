import { Draggable, formatUnit, createElement, isNullOrUndefined, addClass, closest } from '@syncfusion/ej2-base';
import { removeClass, classList, remove, Browser, EventHandler } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
/**
 * Drag and Drop module is used to perform card actions.
 * @hidden
 */
var DragAndDrop = /** @class */ (function () {
    /**
     * Constructor for drag and drop module
     * @private
     */
    function DragAndDrop(parent) {
        this.parent = parent;
        this.dragObj = {
            element: null, cloneElement: null, instance: null,
            targetClone: null, draggedClone: null, targetCloneMulti: null,
            selectedCards: [], pageX: 0, pageY: 0, navigationInterval: null, cardDetails: [], modifiedData: []
        };
        this.dragEdges = { left: false, right: false, top: false, bottom: false };
        this.isDragging = false;
    }
    DragAndDrop.prototype.wireDragEvents = function (element) {
        this.dragObj.instance = new Draggable(element, {
            clone: true,
            enableTapHold: this.parent.isAdaptive,
            enableTailMode: true,
            cursorAt: { top: -10, left: -10 },
            dragArea: this.parent.element.querySelector('.' + cls.CONTENT_CLASS),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            enableAutoScroll: false,
            helper: this.dragHelper.bind(this),
        });
        if (!(this.dragObj.instance.enableTapHold && Browser.isDevice && Browser.isTouch)) {
            // tslint:disable-next-line:no-any
            EventHandler.remove(element, 'touchstart', this.dragObj.instance.initialize);
        }
    };
    DragAndDrop.prototype.dragHelper = function (e) {
        if (this.parent.isAdaptive && this.parent.touchModule.mobilePopup &&
            this.parent.touchModule.mobilePopup.element.classList.contains(cls.POPUP_OPEN_CLASS)) {
            this.parent.touchModule.mobilePopup.hide();
        }
        this.dragObj.element = closest(e.sender.target, '.' + cls.CARD_CLASS);
        if (isNullOrUndefined(this.dragObj.element)) {
            return null;
        }
        this.dragObj.element.style.width = formatUnit(this.dragObj.element.offsetWidth);
        var cloneWrapper = createElement('div', { innerHTML: this.dragObj.element.outerHTML });
        this.dragObj.cloneElement = cloneWrapper.children.item(0);
        addClass([this.dragObj.cloneElement], cls.CLONED_CARD_CLASS);
        this.dragObj.element.parentElement.appendChild(this.dragObj.cloneElement);
        this.dragObj.targetCloneMulti = createElement('div', { className: cls.TARGET_MULTI_CLONE_CLASS });
        this.dragObj.targetClone = createElement('div', {
            className: cls.DROPPED_CLONE_CLASS,
            styles: 'width:' + formatUnit(this.dragObj.element.offsetWidth) + ';height:' + formatUnit(this.dragObj.element.offsetHeight)
        });
        this.dragObj.modifiedData = [];
        return this.dragObj.cloneElement;
    };
    DragAndDrop.prototype.dragStart = function (e) {
        var _this = this;
        this.dragObj.selectedCards = this.dragObj.element;
        if (this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
            var className = '.' + cls.CARD_CLASS + '.' + cls.CARD_SELECTION_CLASS + ':not(.' + cls.CLONED_CARD_CLASS + ')';
            var closestEle = closest(this.dragObj.element, '.' + cls.CONTENT_ROW_CLASS);
            this.dragObj.selectedCards = [].slice.call(closestEle.querySelectorAll(className));
            this.dragObj.selectedCards.forEach(function (element) {
                _this.dragObj.cardDetails.push(_this.parent.getCardDetails(element));
            });
        }
        else {
            this.dragObj.cardDetails = [this.parent.getCardDetails(this.dragObj.element)];
        }
        var dragArgs = { cancel: false, data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(events.dragStart, dragArgs, function (dragEventArgs) {
            if (dragEventArgs.cancel) {
                _this.removeElement(_this.dragObj.cloneElement);
                _this.dragObj.instance.intDestroy(e);
                _this.dragObj.element = null;
                _this.dragObj.targetClone = null;
                _this.dragObj.draggedClone = null;
                _this.dragObj.cloneElement = null;
                _this.dragObj.targetCloneMulti = null;
                return;
            }
            if (_this.parent.isBlazorRender()) {
                e.bindEvents(e.dragElement);
            }
            if (_this.dragObj.element.classList.contains(cls.CARD_SELECTION_CLASS)) {
                _this.dragObj.selectedCards.forEach(function (element) { _this.draggedClone(element); });
                if (_this.dragObj.selectedCards.length > 1) {
                    _this.dragObj.cloneElement.innerHTML = '';
                    var drag = createElement('div', {
                        className: 'e-multi-card-text',
                        innerHTML: _this.dragObj.selectedCards.length + ' Cards',
                    });
                    _this.dragObj.cloneElement.appendChild(drag);
                    classList(_this.dragObj.cloneElement, ['e-multi-card-clone'], [cls.CARD_SELECTION_CLASS]);
                    _this.parent.layoutModule.disableAttributeSelection(_this.dragObj.cloneElement);
                    _this.dragObj.cloneElement.style.width = '90px';
                }
            }
            else {
                _this.draggedClone(_this.dragObj.element);
            }
            _this.parent.notify(events.contentReady, {});
        });
    };
    DragAndDrop.prototype.draggedClone = function (element) {
        this.dragObj.draggedClone = createElement('div', {
            className: cls.DRAGGED_CLONE_CLASS,
            styles: 'width:' + formatUnit(element.offsetWidth - 1) + ';height:' + formatUnit(element.offsetHeight)
        });
        element.insertAdjacentElement('afterend', this.dragObj.draggedClone);
        addClass([element], cls.DRAGGED_CARD_CLASS);
    };
    DragAndDrop.prototype.drag = function (e) {
        var _this = this;
        if (!e.target) {
            return;
        }
        var cardElement = closest(e.target, '.' + cls.CARD_CLASS);
        var target = cardElement || e.target;
        var selector = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ') .' + cls.CONTENT_CELLS_CLASS;
        var contentCell = closest(target, selector);
        this.calculateArgs(e);
        if (contentCell) {
            var targetKey = this.getColumnKey(contentCell);
            var keys = targetKey.split(',');
            this.multiCloneRemove();
            var isDrag = (targetKey === this.getColumnKey(closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS)))
                ? true : false;
            if (keys.length === 1 || isDrag) {
                if (target.classList.contains(cls.CARD_CLASS) || target.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
                    var element = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ?
                        (target.previousElementSibling.classList.contains(cls.DRAGGED_CARD_CLASS) ? null : target.previousElementSibling)
                        : target.previousElementSibling;
                    var insertClone = 'afterend';
                    if (isNullOrUndefined(element)) {
                        var pageY = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? (this.dragObj.pageY / 2) :
                            this.dragObj.pageY;
                        var height = target.classList.contains(cls.DRAGGED_CLONE_CLASS) ? target.offsetHeight :
                            (target.offsetHeight / 2);
                        if ((pageY - (this.parent.element.getBoundingClientRect().top + target.offsetTop)) < height) {
                            insertClone = 'beforebegin';
                        }
                    }
                    target.insertAdjacentElement(insertClone, this.dragObj.targetClone);
                }
                else if (target.classList.contains(cls.CONTENT_CELLS_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)) {
                    target.querySelector('.' + cls.CARD_WRAPPER_CLASS).appendChild(this.dragObj.targetClone);
                }
                else if (target.classList.contains(cls.CARD_WRAPPER_CLASS) && !closest(target, '.' + cls.SWIMLANE_ROW_CLASS)
                    && contentCell.querySelectorAll('.' + cls.CARD_CLASS).length === 0) {
                    target.appendChild(this.dragObj.targetClone);
                }
            }
            else if (keys.length > 1) {
                this.multiCloneCreate(keys, contentCell);
            }
            this.parent.notify(events.contentReady, {});
        }
        this.addDropping();
        var isCollapsed = false;
        if (contentCell) {
            isCollapsed = contentCell.classList.contains(cls.COLLAPSED_CLASS) && contentCell.classList.contains(cls.DROPPING_CLASS);
        }
        if (isCollapsed) {
            this.toggleVisible(target, undefined);
            addClass([contentCell], cls.TOGGLE_VISIBLE_CLASS);
        }
        var tColumn = [].slice.call(this.parent.element.querySelectorAll('.' + cls.TOGGLE_VISIBLE_CLASS));
        if (tColumn.length > 0 && !target.classList.contains(cls.TOGGLE_VISIBLE_CLASS)
            && !closest(target, '.' + cls.TOGGLE_VISIBLE_CLASS)) {
            this.toggleVisible(target, tColumn.slice(-1)[0]);
            removeClass(tColumn, cls.TOGGLE_VISIBLE_CLASS);
        }
        this.parent.notify(events.contentReady, {});
        var cloneCell = closest(target, '.' + cls.CONTENT_CELLS_CLASS + ':not(.' + cls.COLLAPSED_CLASS + ')');
        if (cloneCell) {
            this.dragObj.targetClone.style.width = formatUnit((cloneCell.offsetWidth - 2) - events.cardSpace);
        }
        var multiKeyTarget = closest(target, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        if (multiKeyTarget) {
            var columnKeys = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS)).filter(function (element) { return _this.getColumnKey(element) === _this.getColumnKey(multiKeyTarget); });
            if (columnKeys.length > 0) {
                addClass(columnKeys, cls.MULTI_ACTIVE_CLASS);
                if (columnKeys[0].previousElementSibling) {
                    addClass([columnKeys[0].previousElementSibling], 'e-multi-bottom-border');
                }
            }
        }
        document.body.style.cursor = contentCell ? '' : 'not-allowed';
        if (this.parent.swimlaneSettings.keyField && !this.parent.swimlaneSettings.allowDragAndDrop) {
            var dragElement = closest(this.dragObj.element, '.' + cls.CONTENT_ROW_CLASS);
            var classSelector = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
            var dropElement = closest(target, classSelector);
            if (dragElement && dropElement) {
                if (dragElement.rowIndex !== dropElement.rowIndex) {
                    document.body.style.cursor = 'not-allowed';
                }
            }
        }
        if (document.body.style.cursor === 'not-allowed') {
            this.removeElement(this.dragObj.targetClone);
            this.multiCloneRemove();
        }
        this.updateScrollPosition(e);
        var dragArgs = {
            data: this.dragObj.cardDetails, event: e, element: this.dragObj.selectedCards
        };
        this.parent.trigger(events.drag, dragArgs);
    };
    DragAndDrop.prototype.removeElement = function (element) {
        if (this.parent.element.getElementsByClassName(element.className).length > 0) {
            remove(element);
        }
    };
    DragAndDrop.prototype.multiCloneCreate = function (keys, contentCell) {
        var offsetHeight = contentCell.offsetHeight;
        var limitEle = contentCell.querySelector('.' + cls.LIMITS_CLASS);
        if (limitEle) {
            offsetHeight -= limitEle.offsetHeight;
        }
        this.dragObj.targetCloneMulti.style.height = formatUnit(offsetHeight);
        if (contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
            addClass([contentCell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_WRAPPER_CLASS);
        }
        addClass([contentCell.querySelector('.' + cls.CARD_WRAPPER_CLASS)], cls.MULTI_CARD_WRAPPER_CLASS);
        contentCell.querySelector('.' + cls.CARD_WRAPPER_CLASS).style.height = 'auto';
        contentCell.style.borderStyle = 'none';
        this.removeElement(this.dragObj.targetClone);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var colKey = createElement('div', {
                className: cls.MULTI_COLUMN_KEY_CLASS,
                attrs: { 'data-key': key.trim() }
            });
            var text = createElement('div', { className: 'e-text', innerHTML: key.trim() });
            contentCell.appendChild(this.dragObj.targetCloneMulti).appendChild(colKey).appendChild(text);
            colKey.style.lineHeight = colKey.style.height = formatUnit((offsetHeight / keys.length));
            text.style.top = formatUnit((offsetHeight / 2) - (text.offsetHeight / 2));
        }
    };
    DragAndDrop.prototype.addDropping = function () {
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            var className = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + '):not(.' + cls.COLLAPSED_CLASS + ')';
            var cells = [].slice.call(this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
            cells.forEach(function (cell) { return addClass([cell], cls.DROPPING_CLASS); });
        }
        else {
            var row = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_ROW_CLASS);
            if (row) {
                [].slice.call(row.children).forEach(function (cell) { return addClass([cell], cls.DROPPING_CLASS); });
            }
        }
        var cell = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS);
        if (cell) {
            removeClass([cell], cls.DROPPING_CLASS);
        }
    };
    DragAndDrop.prototype.dragStop = function (e) {
        var _this = this;
        var contentCell = closest(this.dragObj.targetClone, '.' + cls.CONTENT_CELLS_CLASS);
        var columnKey;
        if (this.parent.element.querySelector('.' + cls.TARGET_MULTI_CLONE_CLASS)) {
            columnKey = closest(e.target, '.' + cls.MULTI_COLUMN_KEY_CLASS);
        }
        if (contentCell || columnKey) {
            var cardStatus_1;
            if (contentCell) {
                cardStatus_1 = this.getColumnKey(contentCell);
            }
            else {
                cardStatus_1 = this.getColumnKey(columnKey);
                contentCell = closest(columnKey, '.' + cls.CONTENT_CELLS_CLASS);
            }
            if (this.dragObj.selectedCards instanceof HTMLElement) {
                this.updateDroppedData(this.dragObj.selectedCards, cardStatus_1, contentCell);
            }
            else {
                this.dragObj.selectedCards.forEach(function (element) {
                    _this.updateDroppedData(element, cardStatus_1, contentCell);
                });
            }
            if (this.parent.sortSettings.field && this.parent.sortSettings.sortBy === 'Index') {
                this.changeOrder(this.dragObj.modifiedData);
            }
        }
        var dragArgs = { cancel: false, data: this.dragObj.modifiedData, event: e, element: this.dragObj.selectedCards };
        this.parent.trigger(events.dragStop, dragArgs, function (dragEventArgs) {
            if (!dragEventArgs.cancel) {
                if (contentCell || columnKey) {
                    _this.parent.crudModule.updateCard(dragEventArgs.data);
                }
            }
            _this.removeElement(_this.dragObj.draggedClone);
            _this.removeElement(_this.dragObj.targetClone);
            _this.removeElement(_this.dragObj.cloneElement);
            var dragMultiClone = [].slice.call(_this.parent.element.querySelectorAll('.' + cls.DRAGGED_CLONE_CLASS));
            dragMultiClone.forEach(function (clone) { return remove(clone); });
            if (_this.parent.isBlazorRender()) {
                _this.dragObj.element.style.removeProperty('width');
                _this.multiCloneRemove();
            }
            removeClass([_this.dragObj.element], cls.DRAGGED_CARD_CLASS);
            clearInterval(_this.dragObj.navigationInterval);
            _this.dragObj.navigationInterval = null;
            if (document.body.style.cursor === 'not-allowed') {
                document.body.style.cursor = '';
            }
            var className = '.' + cls.CONTENT_ROW_CLASS + ':not(.' + cls.SWIMLANE_ROW_CLASS + ')';
            var cells = [].slice.call(_this.parent.element.querySelectorAll(className + ' .' + cls.CONTENT_CELLS_CLASS));
            cells.forEach(function (cell) { return removeClass([cell], cls.DROPPING_CLASS); });
            if (_this.parent.isAdaptive) {
                _this.parent.touchModule.tabHold = false;
            }
            _this.dragObj.cardDetails = _this.dragObj.modifiedData = [];
            _this.isDragging = false;
        });
    };
    DragAndDrop.prototype.updateDroppedData = function (element, cardStatus, contentCell) {
        var crudData = this.parent.getCardDetails(element);
        if (cardStatus.split(',').length === 1) {
            crudData[this.parent.keyField] = cardStatus;
        }
        if (this.parent.swimlaneSettings.keyField && this.parent.swimlaneSettings.allowDragAndDrop) {
            var prev = closest(contentCell, '.' + cls.CONTENT_ROW_CLASS).previousElementSibling;
            if (this.parent.isAdaptive) {
                var keyField = this.parent.layoutModule.kanbanRows[this.parent.layoutModule.swimlaneIndex].keyField;
                crudData[this.parent.swimlaneSettings.keyField] = keyField;
            }
            else {
                crudData[this.parent.swimlaneSettings.keyField] = this.getColumnKey(prev);
            }
        }
        this.dragObj.modifiedData.push(crudData);
    };
    DragAndDrop.prototype.changeOrder = function (modifieddata) {
        var _this = this;
        var prevele = false;
        var element = this.parent.sortSettings.direction === 'Ascending' ?
            this.dragObj.targetClone.previousElementSibling : this.dragObj.targetClone.nextElementSibling;
        if (element && !element.classList.contains(cls.DRAGGED_CARD_CLASS) && !element.classList.contains(cls.CLONED_CARD_CLASS)
            && !element.classList.contains(cls.DRAGGED_CLONE_CLASS)) {
            prevele = true;
        }
        else if (this.dragObj.targetClone.nextElementSibling && this.parent.sortSettings.direction === 'Ascending') {
            element = this.dragObj.targetClone.nextElementSibling;
        }
        else if (this.dragObj.targetClone.previousElementSibling && this.parent.sortSettings.direction === 'Descending') {
            element = this.dragObj.targetClone.previousElementSibling;
        }
        else {
            return;
        }
        var obj = this.parent.getCardDetails(element);
        var keyIndex = obj[this.parent.sortSettings.field];
        if (modifieddata.length > 1 && this.parent.sortSettings.direction === 'Descending') {
            modifieddata = modifieddata.reverse();
        }
        modifieddata.forEach(function (data, index) {
            if (prevele) {
                data[_this.parent.sortSettings.field] = ++keyIndex;
            }
            else if (keyIndex !== 1 && index <= data[_this.parent.sortSettings.field]) {
                data[_this.parent.sortSettings.field] = --keyIndex;
            }
            else if (keyIndex === 1) {
                data[_this.parent.sortSettings.field] = index + 1;
            }
        });
    };
    DragAndDrop.prototype.toggleVisible = function (target, tColumn) {
        var _this = this;
        var headerCells = '.' + cls.HEADER_CELLS_CLASS + ':not(.' + cls.STACKED_HEADER_CELL_CLASS + ')';
        var lists = [].slice.call(this.parent.element.querySelectorAll(headerCells));
        lists.forEach(function (list) {
            if (_this.getColumnKey(list) === _this.getColumnKey(tColumn || target)) {
                _this.parent.actionModule.columnToggle(list);
            }
        });
        var cloneTarget = closest(this.dragObj.draggedClone, '.' + cls.CONTENT_CELLS_CLASS);
        if (cloneTarget) {
            var width = formatUnit(cloneTarget.offsetWidth - events.cardSpace);
            this.dragObj.draggedClone.style.width = width;
            this.dragObj.cloneElement.style.width = width;
        }
    };
    DragAndDrop.prototype.multiCloneRemove = function () {
        var cloneMulti = [].slice.call(this.parent.element.querySelectorAll('.' + cls.TARGET_MULTI_CLONE_CLASS));
        if (cloneMulti.length > 0) {
            var columnKey = [].slice.call(this.parent.element.querySelectorAll('.' + cls.MULTI_COLUMN_KEY_CLASS));
            columnKey.forEach(function (node) { return remove(node); });
            cloneMulti.forEach(function (node) {
                var cell = closest(node, '.' + cls.CONTENT_CELLS_CLASS);
                if (cell) {
                    cell.style.borderStyle = '';
                    if (cell.querySelector('.' + cls.SHOW_ADD_BUTTON)) {
                        removeClass([cell.querySelector('.' + cls.SHOW_ADD_BUTTON)], cls.MULTI_CARD_WRAPPER_CLASS);
                    }
                    removeClass([cell.querySelector('.' + cls.CARD_WRAPPER_CLASS)], cls.MULTI_CARD_WRAPPER_CLASS);
                }
            });
            this.removeElement(this.dragObj.targetCloneMulti);
        }
    };
    DragAndDrop.prototype.calculateArgs = function (e) {
        var eventArgs = this.getPageCoordinates(e);
        this.dragObj.pageY = eventArgs.pageY;
        this.dragObj.pageX = eventArgs.pageX;
        this.isDragging = true;
        if (this.parent.isAdaptive && this.parent.tooltipModule) {
            this.parent.tooltipModule.tooltipObj.close();
        }
    };
    DragAndDrop.prototype.getPageCoordinates = function (e) {
        var eventArgs = e.event;
        return eventArgs && eventArgs.changedTouches ? eventArgs.changedTouches[0] : e.changedTouches ? e.changedTouches[0] :
            eventArgs || e;
    };
    DragAndDrop.prototype.getColumnKey = function (target) {
        if (target && target.getAttribute('data-key')) {
            return target.getAttribute('data-key').trim();
        }
        return '';
    };
    DragAndDrop.prototype.updateScrollPosition = function (e) {
        var _this = this;
        if (isNullOrUndefined(this.dragObj.navigationInterval)) {
            this.dragObj.navigationInterval = window.setInterval(function () {
                if (_this.autoScrollValidation(e)) {
                    _this.autoScroll();
                }
            }, 100);
        }
    };
    DragAndDrop.prototype.autoScrollValidation = function (e) {
        var pageY = this.dragObj.pageY;
        var pageX = this.dragObj.pageX;
        var autoScrollDistance = 30;
        var dragEdges = { left: false, right: false, top: false, bottom: false };
        if (this.dragObj.pageY - window.scrollY < (autoScrollDistance + 36)) {
            dragEdges.top = true;
        }
        if ((pageY > (window.innerHeight - autoScrollDistance) + window.pageYOffset) &&
            (pageY < window.innerHeight + window.pageYOffset)) {
            dragEdges.bottom = true;
        }
        if ((pageX < 0 + autoScrollDistance + window.pageXOffset) && (pageX > 0 + window.pageXOffset)) {
            dragEdges.left = true;
        }
        if ((pageX > (window.innerWidth - autoScrollDistance) + window.pageXOffset) &&
            (pageX < window.innerWidth + window.pageXOffset)) {
            dragEdges.right = true;
        }
        this.dragEdges = dragEdges;
        return dragEdges.bottom || dragEdges.top || dragEdges.left || dragEdges.right;
    };
    DragAndDrop.prototype.autoScroll = function () {
        var scrollSensitivity = 30;
        if (this.parent.isAdaptive) {
            var parent_1;
            if (this.dragEdges.top || this.dragEdges.bottom) {
                if (this.dragObj.targetClone) {
                    parent_1 = closest(this.dragObj.targetClone, '.' + cls.CARD_WRAPPER_CLASS);
                }
                else {
                    parent_1 = closest(this.dragObj.draggedClone, '.' + cls.CARD_WRAPPER_CLASS);
                }
            }
            else if (this.dragEdges.right || this.dragEdges.left) {
                parent_1 = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
            }
            if (parent_1) {
                var yIsScrollable = parent_1.offsetHeight <= parent_1.scrollHeight;
                var xIsScrollable = parent_1.offsetWidth <= parent_1.scrollWidth;
                var yInBounds = parent_1.scrollTop >= 0 && parent_1.scrollTop + parent_1.offsetHeight <= parent_1.scrollHeight;
                var xInBounds = parent_1.scrollLeft >= 0 && parent_1.scrollLeft + parent_1.offsetWidth <= parent_1.scrollWidth;
                if (yIsScrollable && yInBounds && (this.dragEdges.top || this.dragEdges.bottom)) {
                    parent_1.scrollTop += this.dragEdges.top ? -(scrollSensitivity + 36) : scrollSensitivity;
                }
                if (xIsScrollable && xInBounds && (this.dragEdges.left || this.dragEdges.right)) {
                    var scroll_1;
                    scroll_1 = (this.parent.layoutModule.getWidth() * (this.parent.columns.length - 1)) > parent_1.scrollLeft;
                    if (scroll_1 || this.dragEdges.left) {
                        parent_1.scrollLeft += this.dragEdges.left ? -scrollSensitivity : scrollSensitivity;
                    }
                }
            }
        }
        else {
            if (this.dragObj.pageY - window.scrollY < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY - scrollSensitivity);
            }
            else if (window.innerHeight - (this.dragObj.pageY - window.scrollY) < scrollSensitivity) {
                window.scrollTo(window.scrollX, window.scrollY + scrollSensitivity);
            }
        }
    };
    DragAndDrop.prototype.unWireDragEvents = function (element) {
        var dragInstance = element.ej2_instances[0];
        if (dragInstance && !dragInstance.isDestroyed) {
            dragInstance.destroy();
        }
    };
    return DragAndDrop;
}());
export { DragAndDrop };
