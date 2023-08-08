var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { append, createElement, formatUnit, EventHandler, addClass, remove, extend, Browser } from '@syncfusion/ej2-base';
import { removeClass, closest } from '@syncfusion/ej2-base';
import { MobileLayout } from './mobile-layout';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * Kanban layout rendering module
 */
var LayoutRender = /** @class */ (function (_super) {
    __extends(LayoutRender, _super);
    /**
     * Constructor for layout module
     */
    function LayoutRender(parent) {
        var _this = _super.call(this, parent) || this;
        _this.kanbanRows = [];
        _this.parent = parent;
        _this.columnKeys = [];
        _this.swimlaneIndex = 0;
        _this.swimlaneData = {};
        _this.scrollLeft = 0;
        _this.parent.on(events.dataReady, _this.initRender, _this);
        _this.parent.on(events.contentReady, _this.scrollUiUpdate, _this);
        return _this;
    }
    LayoutRender.prototype.initRender = function () {
        if (!this.parent.isBlazorRender()) {
            if (this.parent.columns.length === 0) {
                return;
            }
            this.columnData = this.getColumnCards();
            this.kanbanRows = this.getRows();
            this.swimlaneData = this.getSwimlaneCards();
        }
        if (this.parent.isAdaptive) {
            var parent_1 = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
            if (parent_1) {
                this.scrollLeft = parent_1.scrollLeft;
            }
        }
        if (!this.parent.isBlazorRender()) {
            this.destroy();
            this.parent.on(events.dataReady, this.initRender, this);
            this.parent.on(events.contentReady, this.scrollUiUpdate, this);
        }
        if (this.parent.isAdaptive && this.parent.swimlaneSettings.keyField && this.parent.kanbanData.length !== 0) {
            this.renderSwimlaneHeader();
        }
        if (!this.parent.isBlazorRender()) {
            var header = createElement('div', { className: cls.HEADER_CLASS });
            this.parent.element.appendChild(header);
            this.renderHeader(header);
            this.renderContent();
            this.renderCards();
            this.renderValidation();
        }
        else {
            this.initializeSwimlaneTree();
        }
        this.parent.notify(events.contentReady, {});
        this.wireEvents();
    };
    LayoutRender.prototype.renderHeader = function (header) {
        var headerWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        header.appendChild(headerWrap);
        var headerTable = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.HEADER_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        headerWrap.appendChild(headerTable);
        this.renderColGroup(headerTable);
        var tableHead = createElement('thead');
        headerTable.appendChild(tableHead);
        if (this.parent.stackedHeaders.length > 0) {
            tableHead.appendChild(this.createStackedRow(this.parent.stackedHeaders));
        }
        var tr = createElement('tr', { className: cls.HEADER_ROW_CLASS });
        tableHead.appendChild(tr);
        var _loop_1 = function (column) {
            if (this_1.isColumnVisible(column)) {
                var index = this_1.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                var th_1 = createElement('th', {
                    className: index === -1 ? cls.HEADER_CELLS_CLASS : cls.HEADER_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS,
                    attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField }
                });
                var classList = [];
                if (column.allowToggle) {
                    classList.push(cls.HEADER_ROW_TOGGLE_CLASS);
                    if (!column.isExpanded) {
                        classList.push(cls.COLLAPSED_CLASS);
                    }
                }
                addClass([th_1], classList);
                var headerWrapper = createElement('div', { className: cls.HEADER_WRAP_CLASS });
                th_1.appendChild(headerWrapper);
                var noOfCard = this_1.columnData[column.keyField].length;
                var headerTitle = createElement('div', { className: cls.HEADER_TITLE_CLASS });
                headerWrapper.appendChild(headerTitle);
                if (column.template) {
                    var templateArgs = {
                        keyField: column.keyField, headerText: column.headerText, minCount: column.minCount, maxCount: column.maxCount,
                        allowToggle: column.allowToggle, isExpanded: column.isExpanded, showItemCount: column.showItemCount, count: noOfCard
                    };
                    addClass([th_1], cls.TEMPLATE_CLASS);
                    var templateHeader = this_1.parent.templateParser(column.template)(templateArgs);
                    append(templateHeader, headerTitle);
                }
                else {
                    var header_1 = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: column.headerText });
                    headerTitle.appendChild(header_1);
                    if (column.showItemCount) {
                        var itemCount = createElement('div', {
                            className: cls.CARD_ITEM_COUNT_CLASS,
                            innerHTML: '- ' + noOfCard.toString() + ' ' + this_1.parent.localeObj.getConstant('items')
                        });
                        headerTitle.appendChild(itemCount);
                    }
                }
                if (column.allowToggle) {
                    var isExpand = (column.isExpanded && index === -1) ? true : false;
                    var name_1 = (isExpand) ? cls.COLUMN_EXPAND_CLASS : cls.COLUMN_COLLAPSE_CLASS;
                    var icon = createElement('div', {
                        className: cls.HEADER_ICON_CLASS + ' ' + cls.ICON_CLASS + ' ' + name_1,
                        attrs: { 'tabindex': '0' }
                    });
                    icon.setAttribute('aria-label', isExpand ? column.keyField + ' Expand' : column.keyField + ' Collapse');
                    th_1.setAttribute('aria-expanded', isExpand.toString());
                    headerWrapper.appendChild(icon);
                }
                var dataObj = [{ keyField: column.keyField, textField: column.headerText, count: noOfCard }];
                var args = { data: dataObj, element: tr, cancel: false, requestType: 'headerRow' };
                this_1.parent.trigger(events.queryCellInfo, args, function (columnArgs) {
                    if (!columnArgs.cancel) {
                        tr.appendChild(th_1);
                    }
                });
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.parent.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            _loop_1(column);
        }
    };
    LayoutRender.prototype.renderContent = function () {
        var content = createElement('div', { className: cls.CONTENT_CLASS });
        this.parent.element.appendChild(content);
        var contentWrap = createElement('div', { className: this.parent.swimlaneSettings.keyField ? cls.SWIMLANE_CLASS : '' });
        content.appendChild(contentWrap);
        var contentTable = createElement('table', {
            className: cls.TABLE_CLASS + ' ' + cls.CONTENT_TABLE_CLASS,
            attrs: { 'role': 'presentation' }
        });
        contentWrap.appendChild(contentTable);
        this.renderColGroup(contentTable);
        var tBody = createElement('tbody');
        contentTable.appendChild(tBody);
        var className;
        var isCollaspsed = false;
        this.swimlaneRow = this.kanbanRows;
        this.initializeSwimlaneTree();
        var _loop_2 = function (row) {
            if (this_2.parent.swimlaneSettings.keyField && this_2.parent.swimlaneToggleArray.length !== 0) {
                var index = this_2.parent.swimlaneToggleArray.indexOf(row.keyField);
                isCollaspsed = index !== -1;
            }
            className = isCollaspsed ? cls.CONTENT_ROW_CLASS + ' ' + cls.COLLAPSED_CLASS : cls.CONTENT_ROW_CLASS;
            var tr = createElement('tr', { className: className, attrs: { 'aria-expanded': 'true' } });
            if (this_2.parent.swimlaneSettings.keyField && !this_2.parent.isAdaptive && row.keyField !== '') {
                this_2.renderSwimlaneRow(tBody, row, isCollaspsed);
            }
            for (var _i = 0, _a = this_2.parent.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                if (this_2.isColumnVisible(column)) {
                    var index = this_2.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                    var className_1 = index === -1 ? cls.CONTENT_CELLS_CLASS : cls.CONTENT_CELLS_CLASS + ' ' + cls.COLLAPSED_CLASS;
                    var td = createElement('td', {
                        className: className_1,
                        attrs: { 'data-role': 'kanban-column', 'data-key': column.keyField, 'aria-expanded': 'true', 'tabindex': '0' }
                    });
                    if (column.allowToggle && !column.isExpanded || index !== -1) {
                        addClass([td], cls.COLLAPSED_CLASS);
                        var text = (column.showItemCount ? '[' +
                            this_2.getColumnData(column.keyField, this_2.swimlaneData[row.keyField]).length + '] ' : '') + column.headerText;
                        td.appendChild(createElement('div', { className: cls.COLLAPSE_HEADER_TEXT_CLASS, innerHTML: text }));
                        td.setAttribute('aria-expanded', 'false');
                    }
                    if (column.showAddButton) {
                        var button = createElement('div', { className: cls.SHOW_ADD_BUTTON, attrs: { 'tabindex': '-1' } });
                        button.appendChild(createElement('div', { className: cls.SHOW_ADD_ICON + ' ' + cls.ICON_CLASS }));
                        td.appendChild(button);
                    }
                    tr.appendChild(td);
                }
            }
            var dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
            var args = { data: dataObj, element: tr, cancel: false, requestType: 'contentRow' };
            this_2.parent.trigger(events.queryCellInfo, args, function (columnArgs) {
                if (!columnArgs.cancel) {
                    tBody.appendChild(tr);
                }
            });
        };
        var this_2 = this;
        for (var _i = 0, _a = this.swimlaneRow; _i < _a.length; _i++) {
            var row = _a[_i];
            _loop_2(row);
        }
    };
    LayoutRender.prototype.initializeSwimlaneTree = function () {
        if (this.parent.swimlaneSettings.keyField && this.parent.isAdaptive && this.parent.kanbanData.length !== 0) {
            if (!this.parent.isBlazorRender()) {
                this.swimlaneRow = [this.kanbanRows[this.swimlaneIndex]];
                this.renderSwimlaneTree();
                this.parent.element.querySelector('.' + cls.TOOLBAR_SWIMLANE_NAME_CLASS).innerHTML = this.swimlaneRow[0].textField;
            }
            else {
                this.renderSwimlaneTree();
            }
        }
    };
    LayoutRender.prototype.renderSwimlaneRow = function (tBody, row, isCollapsed) {
        var name = cls.CONTENT_ROW_CLASS + ' ' + cls.SWIMLANE_ROW_CLASS;
        var className = isCollapsed ? ' ' + cls.COLLAPSED_CLASS : '';
        var tr = createElement('tr', {
            className: name + className, attrs: {
                'data-key': row.keyField,
                'aria-expanded': (!isCollapsed).toString()
            }
        });
        var col = this.parent.columns.length - this.parent.actionModule.hideColumnKeys.length;
        var td = createElement('td', {
            className: cls.CONTENT_CELLS_CLASS,
            attrs: { 'data-role': 'kanban-column', 'colspan': col.toString() }
        });
        var swimlaneHeader = createElement('div', { className: cls.SWIMLANE_HEADER_CLASS });
        td.appendChild(swimlaneHeader);
        var iconClass = isCollapsed ? cls.SWIMLANE_ROW_COLLAPSE_CLASS : cls.SWIMLANE_ROW_EXPAND_CLASS;
        var iconDiv = createElement('div', {
            className: cls.ICON_CLASS + ' ' + iconClass, attrs: {
                'tabindex': '0',
                'aria-label': isCollapsed ? row.keyField + ' Collapse' : row.keyField + ' Expand'
            }
        });
        swimlaneHeader.appendChild(iconDiv);
        var headerWrap = createElement('div', { className: cls.HEADER_WRAP_CLASS });
        swimlaneHeader.appendChild(headerWrap);
        var cardCount = this.swimlaneData[row.keyField].length;
        if (this.parent.swimlaneSettings.template) {
            var templateArgs = extend({}, row, { count: cardCount }, true);
            addClass([td], cls.TEMPLATE_CLASS);
            var swimlaneTemplate = this.parent.templateParser(this.parent.swimlaneSettings.template)(templateArgs);
            append(swimlaneTemplate, headerWrap);
        }
        else {
            headerWrap.appendChild(createElement('div', {
                className: cls.SWIMLANE_ROW_TEXT_CLASS,
                innerHTML: row.textField,
                attrs: { 'data-role': row.textField }
            }));
        }
        if (this.parent.swimlaneSettings.showItemCount) {
            swimlaneHeader.appendChild(createElement('div', {
                className: cls.CARD_ITEM_COUNT_CLASS,
                innerHTML: "- " + cardCount.toString() + " " + this.parent.localeObj.getConstant('items')
            }));
        }
        tr.appendChild(td);
        var dataObj = [{ keyField: row.keyField, textField: row.textField, count: row.count }];
        var args = { data: dataObj, element: tr, cancel: false, requestType: 'swimlaneRow' };
        this.parent.trigger(events.queryCellInfo, args, function (columnArgs) {
            if (!columnArgs.cancel) {
                tBody.appendChild(tr);
            }
        });
    };
    LayoutRender.prototype.renderCards = function () {
        var _this = this;
        var rows = this.swimlaneRow;
        var cardRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)'));
        var swimlaneRows = [].slice.call(this.parent.element.querySelectorAll('.e-content-row.e-swimlane-row'));
        var removeTrs = [];
        cardRows.forEach(function (tr, index) {
            var dataCount = 0;
            var _loop_3 = function (column) {
                if (_this.isColumnVisible(column)) {
                    var columnData = _this.parent.swimlaneSettings.keyField ?
                        _this.getColumnData(column.keyField, _this.swimlaneData[rows[index].keyField]) : _this.columnData[column.keyField];
                    dataCount += columnData.length;
                    var columnWrapper = tr.querySelector('[data-key="' + column.keyField + '"]');
                    var cardWrapper_1 = createElement('div', { className: cls.CARD_WRAPPER_CLASS });
                    columnWrapper.appendChild(cardWrapper_1);
                    var _loop_4 = function (data) {
                        var cardText = data[_this.parent.cardSettings.headerField];
                        var cardIndex = _this.parent.actionModule.selectionArray.indexOf(cardText);
                        var className = cardIndex === -1 ? '' : ' ' + cls.CARD_SELECTION_CLASS;
                        var cardElement = createElement('div', {
                            className: cls.CARD_CLASS + className,
                            attrs: {
                                'data-id': data[_this.parent.cardSettings.headerField], 'data-key': data[_this.parent.keyField],
                                'aria-selected': 'false', 'tabindex': '-1'
                            }
                        });
                        if (cardIndex !== -1) {
                            cardElement.setAttribute('aria-selected', 'true');
                        }
                        if (_this.parent.cardSettings.template) {
                            addClass([cardElement], cls.TEMPLATE_CLASS);
                            var cardTemplate = _this.parent.templateParser(_this.parent.cardSettings.template)(data);
                            append(cardTemplate, cardElement);
                        }
                        else {
                            var tooltipClass = _this.parent.enableTooltip ? ' ' + cls.TOOLTIP_TEXT_CLASS : '';
                            if (_this.parent.cardSettings.showHeader) {
                                var cardHeader = createElement('div', { className: cls.CARD_HEADER_CLASS });
                                var cardCaption = createElement('div', { className: cls.CARD_HEADER_TEXT_CLASS });
                                var cardText_1 = createElement('div', {
                                    className: cls.CARD_HEADER_TITLE_CLASS + tooltipClass,
                                    innerHTML: data[_this.parent.cardSettings.headerField] || ''
                                });
                                cardHeader.appendChild(cardCaption);
                                cardCaption.appendChild(cardText_1);
                                cardElement.appendChild(cardHeader);
                            }
                            var cardContent = createElement('div', {
                                className: cls.CARD_CONTENT_CLASS + tooltipClass,
                                innerHTML: data[_this.parent.cardSettings.contentField] || ''
                            });
                            cardElement.appendChild(cardContent);
                            if (_this.parent.cardSettings.tagsField && data[_this.parent.cardSettings.tagsField]) {
                                var cardTags = createElement('div', { className: cls.CARD_TAGS_CLASS });
                                var tags = data[_this.parent.cardSettings.tagsField].toString().split(',');
                                for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                                    var tag = tags_1[_i];
                                    cardTags.appendChild(createElement('div', {
                                        className: cls.CARD_TAG_CLASS + ' ' + cls.CARD_LABEL_CLASS,
                                        innerHTML: tag
                                    }));
                                }
                                cardElement.appendChild(cardTags);
                            }
                            if (_this.parent.cardSettings.grabberField && data[_this.parent.cardSettings.grabberField]) {
                                addClass([cardElement], cls.CARD_COLOR_CLASS);
                                cardElement.style.borderLeftColor = data[_this.parent.cardSettings.grabberField];
                            }
                            if (_this.parent.cardSettings.footerCssField) {
                                var cardFields = createElement('div', { className: cls.CARD_FOOTER_CLASS });
                                var keys = data[_this.parent.cardSettings.footerCssField].split(',');
                                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                                    var key = keys_1[_a];
                                    cardFields.appendChild(createElement('div', {
                                        className: key.trim() + ' ' + cls.CARD_FOOTER_CSS_CLASS
                                    }));
                                }
                                cardElement.appendChild(cardFields);
                            }
                        }
                        var args = { data: data, element: cardElement, cancel: false };
                        _this.parent.trigger(events.cardRendered, args, function (cardArgs) {
                            if (!cardArgs.cancel) {
                                cardWrapper_1.appendChild(cardElement);
                            }
                        });
                    };
                    for (var _i = 0, _a = columnData; _i < _a.length; _i++) {
                        var data = _a[_i];
                        _loop_4(data);
                    }
                }
            };
            for (var _i = 0, _a = _this.parent.columns; _i < _a.length; _i++) {
                var column = _a[_i];
                _loop_3(column);
            }
            if (dataCount === 0) {
                removeTrs.push(tr);
                if (swimlaneRows.length > 0) {
                    removeTrs.push(swimlaneRows[index]);
                }
            }
        });
        if (!this.parent.swimlaneSettings.showEmptyRow && (this.parent.kanbanData.length === 0 && !this.parent.showEmptyColumn)) {
            removeTrs.forEach(function (tr) { return remove(tr); });
        }
    };
    LayoutRender.prototype.renderColGroup = function (table) {
        var _this = this;
        var colGroup = createElement('colgroup');
        this.parent.columns.forEach(function (column) {
            if (_this.isColumnVisible(column)) {
                var index = _this.parent.actionModule.columnToggleArray.indexOf(column.keyField);
                var isToggle = column.allowToggle && !column.isExpanded;
                var className = index === -1 ? (isToggle ? cls.COLLAPSED_CLASS : '') : cls.COLLAPSED_CLASS;
                var col = createElement('col', {
                    className: className,
                    attrs: { 'data-key': column.keyField },
                    styles: _this.parent.isAdaptive ? 'width: ' +
                        (isToggle ? formatUnit(events.toggleWidth) : formatUnit(_this.getWidth())) : ''
                });
                colGroup.appendChild(col);
            }
        });
        table.appendChild(colGroup);
    };
    LayoutRender.prototype.getRows = function () {
        var _this = this;
        var kanbanRows = [];
        if (this.parent.swimlaneSettings.keyField) {
            this.parent.kanbanData.map(function (obj) {
                if (!_this.parent.swimlaneSettings.showEmptyRow) {
                    if (_this.columnKeys.indexOf(obj[_this.parent.keyField]) === -1) {
                        return;
                    }
                }
                kanbanRows.push({
                    keyField: obj[_this.parent.swimlaneSettings.keyField],
                    textField: obj[_this.parent.swimlaneSettings.textField] || obj[_this.parent.swimlaneSettings.keyField]
                });
            });
            kanbanRows = kanbanRows.filter(function (item, index, arr) {
                return index === arr.map(function (item) { return item.keyField; }).indexOf(item.keyField);
            });
            kanbanRows.sort(function (firstRow, secondRow) {
                var first = firstRow.textField.toLowerCase();
                var second = secondRow.textField.toLowerCase();
                return (first > second) ? 1 : ((second > first) ? -1 : 0);
            });
            if (this.parent.swimlaneSettings.sortDirection === 'Descending') {
                kanbanRows.reverse();
            }
            kanbanRows.forEach(function (row) {
                row.count = _this.parent.kanbanData.filter(function (obj) {
                    return _this.columnKeys.indexOf(obj[_this.parent.keyField]) > -1 &&
                        obj[_this.parent.swimlaneSettings.keyField] === row.keyField;
                }).length;
            });
            if (kanbanRows.length === 0) {
                kanbanRows.push({ keyField: '', textField: '' });
            }
        }
        else {
            kanbanRows.push({ keyField: '', textField: '' });
        }
        return kanbanRows;
    };
    LayoutRender.prototype.createStackedRow = function (rows) {
        var tr = createElement('tr', { className: cls.HEADER_ROW_CLASS + ' ' + cls.STACKED_HEADER_ROW_CLASS });
        var stackedHeaders = [];
        this.parent.columns.forEach(function (column) {
            var headerText = '';
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                if (row.keyFields.indexOf(column.keyField) !== -1) {
                    headerText = row.text;
                }
            }
            stackedHeaders.push(headerText);
        });
        for (var h = 0; h < stackedHeaders.length; h++) {
            var colSpan = 1;
            for (var j = h + 1; j < stackedHeaders.length; j++) {
                if ((stackedHeaders[h] !== '') && (stackedHeaders[j] !== '') && stackedHeaders[h] === stackedHeaders[j]) {
                    colSpan++;
                }
                else {
                    break;
                }
            }
            var div = createElement('div', { className: cls.HEADER_TEXT_CLASS, innerHTML: stackedHeaders[h] });
            var th = createElement('th', {
                className: cls.HEADER_CELLS_CLASS + ' ' + cls.STACKED_HEADER_CELL_CLASS,
                attrs: { 'colspan': colSpan.toString() }
            });
            tr.appendChild(th).appendChild(div);
            h += colSpan - 1;
        }
        return tr;
    };
    LayoutRender.prototype.scrollUiUpdate = function () {
        var _this = this;
        var header = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        var content = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        var height = this.parent.element.offsetHeight - header.offsetHeight;
        if (this.parent.isAdaptive) {
            height = window.innerHeight - (header.offsetHeight + events.bottomSpace);
            var swimlaneToolbar = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS);
            if (swimlaneToolbar) {
                height -= swimlaneToolbar.offsetHeight;
            }
            var cardWrappers = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_CELLS_CLASS));
            cardWrappers.forEach(function (cell) {
                var cardWrapper = cell.querySelector('.' + cls.CARD_WRAPPER_CLASS);
                if (!cardWrapper.classList.contains(cls.MULTI_CARD_WRAPPER_CLASS)) {
                    cardWrapper.style.height = formatUnit(height);
                    EventHandler.add(cell, 'touchmove', _this.onAdaptiveScroll, _this);
                }
            });
        }
        if (this.parent.height !== 'auto' && this.parent.height !== '100%') {
            content.style.height = formatUnit(height);
        }
        [].slice.call(header.children).forEach(function (node) {
            var paddingValue = 0;
            if ((content.offsetWidth - content.clientWidth) > 0) {
                paddingValue = 17;
                if ((content.offsetHeight - content.clientHeight) > 0) {
                    node.style.width = formatUnit(content.clientWidth);
                }
            }
            if (_this.parent.enableRtl) {
                node.style.paddingLeft = formatUnit(paddingValue);
            }
            else {
                node.style.paddingRight = formatUnit(paddingValue);
            }
        });
    };
    LayoutRender.prototype.onContentScroll = function (e) {
        var header = this.parent.element.querySelector('.' + cls.HEADER_CLASS + ' div');
        header.scrollLeft = e.target.scrollLeft;
    };
    LayoutRender.prototype.onAdaptiveScroll = function (e) {
        if (this.parent.touchModule.tabHold && !this.parent.touchModule.mobilePopup) {
            e.preventDefault();
        }
    };
    LayoutRender.prototype.isColumnVisible = function (column) {
        var _this = this;
        var isVisible = false;
        column.keyField.split(',').forEach(function (key) { isVisible = _this.parent.actionModule.hideColumnKeys.indexOf(key) === -1; });
        return isVisible;
    };
    LayoutRender.prototype.renderLimits = function (column, target) {
        var limits = createElement('div', { className: cls.LIMITS_CLASS });
        if (column.minCount) {
            limits.appendChild(createElement('div', {
                className: cls.MIN_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('min') + ': ' + column.minCount.toString()
            }));
        }
        if (column.maxCount) {
            limits.appendChild(createElement('div', {
                className: cls.MAX_COUNT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('max') + ': ' + column.maxCount.toString()
            }));
        }
        if (limits.childElementCount > 0) {
            if (target.querySelector('.' + cls.CARD_WRAPPER_CLASS)) {
                target.insertBefore(limits, target.firstElementChild);
            }
            else {
                target.appendChild(limits);
            }
        }
    };
    LayoutRender.prototype.renderValidation = function () {
        var _this = this;
        var getValidationClass = function (column, count) {
            var colorClass;
            if (column.maxCount && count > column.maxCount) {
                colorClass = cls.MAX_COLOR_CLASS;
            }
            else if (column.minCount && count < column.minCount) {
                colorClass = cls.MIN_COLOR_CLASS;
            }
            return colorClass;
        };
        this.parent.columns.forEach(function (column) {
            if (!column.minCount && !column.maxCount) {
                return;
            }
            var cardData = _this.columnData[column.keyField];
            var keySelector = "[data-key=\"" + column.keyField + "\"]";
            var headerCell = _this.parent.element.querySelector("." + (cls.HEADER_CELLS_CLASS + keySelector));
            var rowCells = [].slice.call(_this.parent.element.querySelectorAll("." + (cls.CONTENT_CELLS_CLASS + keySelector)));
            if (_this.parent.constraintType === 'Swimlane' && _this.parent.swimlaneSettings.keyField) {
                _this.swimlaneRow.forEach(function (row, index) {
                    _this.renderLimits(column, rowCells[index]);
                    var rowCards = cardData.filter(function (card) {
                        return card[_this.parent.swimlaneSettings.keyField] === row.keyField;
                    });
                    var colorClass = getValidationClass(column, rowCards.length);
                    if (colorClass) {
                        addClass([rowCells[index]], colorClass);
                    }
                });
            }
            else {
                _this.renderLimits(column, headerCell);
                var colorClass = getValidationClass(column, cardData.length);
                if (colorClass) {
                    addClass(rowCells.concat(headerCell), colorClass);
                }
            }
        });
    };
    LayoutRender.prototype.getColumnData = function (columnValue, dataSource) {
        var _this = this;
        if (dataSource === void 0) { dataSource = this.parent.kanbanData; }
        var cardData = [];
        var columnKeys = columnValue.split(',');
        var _loop_5 = function (key) {
            var keyData = dataSource.filter(function (cardObj) { return cardObj[_this.parent.keyField] === key.trim(); });
            cardData = cardData.concat(keyData);
        };
        for (var _i = 0, columnKeys_1 = columnKeys; _i < columnKeys_1.length; _i++) {
            var key = columnKeys_1[_i];
            _loop_5(key);
        }
        this.sortCategory(cardData);
        return cardData;
    };
    LayoutRender.prototype.sortCategory = function (cardData) {
        var key;
        var direction = this.parent.sortSettings.direction;
        switch (this.parent.sortSettings.sortBy) {
            case 'DataSourceOrder':
                if (direction === 'Descending') {
                    cardData.reverse();
                }
                break;
            case 'Custom':
            case 'Index':
                if (this.parent.sortSettings.field) {
                    key = this.parent.sortSettings.field;
                    if (this.parent.sortSettings.sortBy === 'Custom') {
                        direction = this.parent.sortSettings.direction;
                    }
                    this.sortOrder(key, direction, cardData);
                }
                break;
        }
        return cardData;
    };
    LayoutRender.prototype.sortOrder = function (key, direction, cardData) {
        var isNumeric;
        if (this.parent.kanbanData.length > 0) {
            isNumeric = typeof this.parent.kanbanData[0][key] === 'number';
        }
        else {
            isNumeric = true;
        }
        if (!isNumeric && this.parent.sortSettings.sortBy === 'Index') {
            return cardData;
        }
        var first;
        var second;
        cardData = cardData.sort(function (firstData, secondData) {
            if (!isNumeric) {
                first = firstData[key].toLowerCase();
                second = secondData[key].toLowerCase();
            }
            else {
                first = firstData[key];
                second = secondData[key];
            }
            return (first > second) ? 1 : ((second > first) ? -1 : 0);
        });
        if (direction === 'Descending') {
            cardData.reverse();
        }
        return cardData;
    };
    LayoutRender.prototype.documentClick = function (args) {
        if (args.target.classList.contains(cls.SWIMLANE_OVERLAY_CLASS) &&
            this.parent.element.querySelector('.' + cls.SWIMLANE_RESOURCE_CLASS).classList.contains('e-popup-open')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], 'e-enable');
        }
        if (closest(args.target, "." + cls.ROOT_CLASS)) {
            return;
        }
        var cards = [].slice.call(this.parent.element.querySelectorAll("." + cls.CARD_CLASS + "." + cls.CARD_SELECTION_CLASS));
        removeClass(cards, cls.CARD_SELECTION_CLASS);
        this.disableAttributeSelection(cards);
    };
    LayoutRender.prototype.disableAttributeSelection = function (cards) {
        if (cards instanceof Element) {
            cards.setAttribute('aria-selected', 'false');
        }
        else {
            cards.forEach(function (card) {
                card.setAttribute('aria-selected', 'false');
            });
        }
    };
    LayoutRender.prototype.getColumnCards = function (data) {
        var _this = this;
        var columnData = {};
        this.columnKeys = [];
        this.parent.columns.forEach(function (column) {
            _this.columnKeys = _this.columnKeys.concat(column.keyField.split(',').map(function (e) { return e.trim(); }));
            var cardData = _this.getColumnData(column.keyField, data);
            columnData[column.keyField] = cardData;
        });
        return columnData;
    };
    LayoutRender.prototype.getSwimlaneCards = function () {
        var _this = this;
        var swimlaneData = {};
        if (this.parent.swimlaneSettings.keyField) {
            this.kanbanRows.forEach(function (row) {
                return swimlaneData[row.keyField] = _this.parent.kanbanData.filter(function (obj) {
                    return _this.columnKeys.indexOf(obj[_this.parent.keyField]) > -1 &&
                        obj[_this.parent.swimlaneSettings.keyField] === row.keyField;
                });
            });
        }
        return swimlaneData;
    };
    LayoutRender.prototype.refreshHeaders = function () {
        var header = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        [].slice.call(header.children).forEach(function (child) { return remove(child); });
        this.renderHeader(header);
    };
    LayoutRender.prototype.refreshCards = function () {
        var cards = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CARD_WRAPPER_CLASS));
        cards.forEach(function (card) { return remove(card); });
        this.renderCards();
    };
    LayoutRender.prototype.wireEvents = function () {
        EventHandler.add(this.parent.element, 'click', this.parent.actionModule.clickHandler, this.parent.actionModule);
        EventHandler.add(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler, this.parent.actionModule);
        EventHandler.add(document, Browser.touchStartEvent, this.documentClick, this);
        var content = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        EventHandler.add(content, 'scroll', this.onContentScroll, this);
        if (this.parent.isAdaptive) {
            this.parent.touchModule.wireTouchEvents();
            content.scrollLeft = this.scrollLeft;
        }
        this.wireDragEvent();
    };
    LayoutRender.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.element, 'click', this.parent.actionModule.clickHandler);
        EventHandler.remove(this.parent.element, 'dblclick', this.parent.actionModule.doubleClickHandler);
        EventHandler.remove(document, Browser.touchStartEvent, this.documentClick);
        var content = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        if (content) {
            EventHandler.remove(content, 'scroll', this.onContentScroll);
            if (this.parent.allowDragAndDrop) {
                this.unWireDragEvent();
            }
        }
        if (this.parent.isAdaptive) {
            this.parent.touchModule.unWireTouchEvents();
        }
    };
    LayoutRender.prototype.wireDragEvent = function () {
        if (this.parent.allowDragAndDrop) {
            addClass(this.parent.element.querySelectorAll('.' + cls.CARD_CLASS), cls.DRAGGABLE_CLASS);
            this.parent.dragAndDropModule.wireDragEvents(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
        }
    };
    LayoutRender.prototype.unWireDragEvent = function () {
        this.parent.dragAndDropModule.unWireDragEvents(this.parent.element.querySelector('.' + cls.CONTENT_CLASS));
    };
    LayoutRender.prototype.destroy = function () {
        this.parent.off(events.dataReady, this.initRender);
        this.parent.off(events.contentReady, this.scrollUiUpdate);
        this.unWireEvents();
        var header = this.parent.element.querySelector('.' + cls.HEADER_CLASS);
        if (header) {
            remove(header);
        }
        var content = this.parent.element.querySelector('.' + cls.CONTENT_CLASS);
        if (content) {
            remove(content);
        }
        if (this.treeViewObj) {
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
        }
        var swimlaneToolBarEle = this.parent.element.querySelector('.' + cls.SWIMLANE_HEADER_CLASS);
        if (swimlaneToolBarEle) {
            remove(swimlaneToolBarEle);
        }
        var swimlaneContent = this.parent.element.querySelector('.' + cls.SWIMLANE_CONTENT_CLASS);
        if (swimlaneContent) {
            remove(swimlaneContent);
        }
    };
    return LayoutRender;
}(MobileLayout));
export { LayoutRender };
