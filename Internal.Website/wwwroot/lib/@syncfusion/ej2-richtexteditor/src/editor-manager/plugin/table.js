import { createElement, closest, detach, Browser, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as CONSTANT from './../base/constant';
import { InsertHtml } from './inserthtml';
/**
 * Link internal component
 * @hidden

 */
var TableCommand = /** @class */ (function () {
    /**
     * Constructor for creating the Formats plugin
     * @hidden

     */
    function TableCommand(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    TableCommand.prototype.addEventListener = function () {
        this.parent.observer.on(CONSTANT.TABLE, this.createTable, this);
        this.parent.observer.on(CONSTANT.INSERT_ROW, this.insertRow, this);
        this.parent.observer.on(CONSTANT.INSERT_COLUMN, this.insertColumn, this);
        this.parent.observer.on(CONSTANT.DELETEROW, this.deleteRow, this);
        this.parent.observer.on(CONSTANT.DELETECOLUMN, this.deleteColumn, this);
        this.parent.observer.on(CONSTANT.REMOVETABLE, this.removeTable, this);
        this.parent.observer.on(CONSTANT.TABLEHEADER, this.tableHeader, this);
        this.parent.observer.on(CONSTANT.TABLE_VERTICAL_ALIGN, this.tableVerticalAlign, this);
    };
    TableCommand.prototype.createTable = function (e) {
        var table = createElement('table', { className: 'e-rte-table' });
        var tblBody = createElement('tbody');
        if (!isNOU(e.item.width.width)) {
            table.style.width = this.calculateStyleValue(e.item.width.width);
        }
        if (!isNOU(e.item.width.minWidth)) {
            table.style.minWidth = this.calculateStyleValue(e.item.width.minWidth);
        }
        if (!isNOU(e.item.width.maxWidth)) {
            table.style.maxWidth = this.calculateStyleValue(e.item.width.maxWidth);
        }
        var tdWid = parseInt(e.item.width.width, 10) / e.item.columns;
        for (var i = 0; i < e.item.row; i++) {
            var row = createElement('tr');
            for (var j = 0; j < e.item.columns; j++) {
                var cell = createElement('td');
                cell.appendChild(createElement('br'));
                cell.style.width = tdWid + '%';
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        table.appendChild(tblBody);
        e.item.selection.restore();
        InsertHtml.Insert(this.parent.currentDocument, table, this.parent.editableElement);
        this.removeEmptyNode();
        e.item.selection.setSelectionText(this.parent.currentDocument, table.querySelector('td'), table.querySelector('td'), 0, 0);
        table.querySelector('td').classList.add('e-cell-select');
        if (e.callBack) {
            e.callBack({
                requestType: 'Table',
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: [table]
            });
        }
        return table;
    };
    TableCommand.prototype.calculateStyleValue = function (value) {
        var styleValue;
        if (typeof (value) === 'string') {
            if (value.indexOf('px') || value.indexOf('%') || value.indexOf('auto')) {
                styleValue = value;
            }
            else {
                styleValue = value + 'px';
            }
        }
        else {
            styleValue = value + 'px';
        }
        return styleValue;
    };
    TableCommand.prototype.removeEmptyNode = function () {
        var emptyUl = this.parent.editableElement.querySelectorAll('ul:empty, ol:empty');
        for (var i = 0; i < emptyUl.length; i++) {
            detach(emptyUl[i]);
        }
        var emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
        for (var i = 0; i < emptyLiChild.length; i++) {
            detach(emptyLiChild[i]);
            if (emptyLiChild.length === i + 1) {
                emptyLiChild = this.parent.editableElement.querySelectorAll('li *:empty');
                i = -1;
            }
        }
        var emptyLi = this.parent.editableElement.querySelectorAll('li:empty');
        for (var i = 0; i < emptyLi.length; i++) {
            detach(emptyLi[i]);
        }
    };
    TableCommand.prototype.insertAfter = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };
    TableCommand.prototype.insertRow = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        if (selectedCell.nodeName.toLowerCase() === 'th' && e.item.subCommand === 'InsertRowBefore') {
            return;
        }
        var curRow = closest(selectedCell, 'tr');
        var newRow;
        if (selectedCell.nodeName.toLowerCase() !== 'th') {
            newRow = closest(selectedCell, 'tr').cloneNode(true);
            var tabCell = Array.prototype.slice.call(newRow.querySelectorAll('td'));
            Array.prototype.forEach.call(tabCell, function (cell) {
                cell.innerHTML = '';
                cell.appendChild(createElement('br'));
                cell.removeAttribute('class');
            });
        }
        else {
            var childNodes = curRow.childNodes;
            newRow = createElement('tr');
            for (var i = 0; i < childNodes.length; i++) {
                var tdElement = createElement('td');
                tdElement.appendChild(createElement('br'));
                newRow.appendChild(tdElement);
            }
        }
        (e.item.subCommand === 'InsertRowBefore') ?
            curRow.parentElement.insertBefore(newRow, curRow) : this.insertAfter(newRow, curRow);
        e.item.selection.setSelectionText(this.parent.currentDocument, e.item.selection.range.startContainer, e.item.selection.range.startContainer, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.insertColumn = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        selectedCell = (selectedCell.nodeName !== 'TD') ? closest(selectedCell, 'td,th') : selectedCell;
        var curRow = closest(selectedCell, 'tr');
        var curCell;
        var allRows = closest((curRow), 'table').rows;
        var colIndex = Array.prototype.slice.call(curRow.querySelectorAll('th,td')).indexOf(selectedCell);
        var width = parseInt(e.item.width, 10) / (curRow.querySelectorAll('td,th').length + 1);
        for (var j = 0; j < closest(curRow, 'table').querySelectorAll('th,td').length; j++) {
            closest(curRow, 'table').querySelectorAll('th,td')[j].style.width = width + '%';
        }
        for (var i = 0; i < allRows.length; i++) {
            curCell = allRows[i].querySelectorAll('th,td')[colIndex];
            var colTemplate = curCell.cloneNode(true);
            colTemplate.innerHTML = '';
            colTemplate.appendChild(createElement('br'));
            colTemplate.removeAttribute('class');
            (e.item.subCommand === 'InsertColumnLeft') ? curCell.parentElement.insertBefore(colTemplate, curCell) :
                this.insertAfter(colTemplate, curCell);
        }
        e.item.selection.setSelectionText(this.parent.currentDocument, selectedCell, selectedCell, 0, 0);
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.deleteColumn = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var selectedCellIndex = selectedCell.cellIndex;
        var parentTable = closest(selectedCell, 'table');
        var curRow = closest(selectedCell, 'tr');
        var allRows = closest(curRow, 'table').rows;
        if (curRow.querySelectorAll('th,td').length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        }
        else {
            for (var i = 0; i < allRows.length; i++) {
                allRows[i].deleteCell(selectedCellIndex);
                if (Browser.isIE) {
                    e.item.selection.setSelectionText(this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
                    parentTable.querySelector('td, th').classList.add('e-cell-select');
                }
            }
        }
        if (e.callBack) {
            var sContainer = this.parent.nodeSelection.getRange(this.parent.currentDocument).startContainer;
            if (sContainer.nodeName !== 'TD') {
                var startChildLength = this.parent.nodeSelection.getRange(this.parent.currentDocument).startOffset;
                var focusNode = sContainer.children[startChildLength];
                this.parent.nodeSelection.setCursorPoint(this.parent.currentDocument, focusNode, 0);
            }
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.deleteRow = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var selectedRowIndex = selectedCell.parentNode.rowIndex;
        var parentTable = closest(selectedCell, 'table');
        if (parentTable.rows.length === 1) {
            e.item.selection.restore();
            detach(closest(selectedCell.parentElement, 'table'));
        }
        else {
            if (selectedCell.tagName === 'TH') {
                detach(parentTable.querySelector('thead'));
            }
            else {
                parentTable.deleteRow(selectedRowIndex);
            }
            e.item.selection.setSelectionText(this.parent.currentDocument, parentTable.querySelector('td'), parentTable.querySelector('td'), 0, 0);
            parentTable.querySelector('td, th').classList.add('e-cell-select');
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.removeTable = function (e) {
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var seletedTable = closest(selectedCell.parentElement, 'table');
        if (seletedTable) {
            e.item.selection.restore();
            detach(seletedTable);
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.tableHeader = function (e) {
        var headerExit = false;
        var selectedCell = e.item.selection.range.startContainer;
        selectedCell = (selectedCell.nodeType === 3) ? selectedCell.parentNode : selectedCell;
        var table = closest(selectedCell.parentElement, 'table');
        [].slice.call(table.childNodes).forEach(function (el) {
            if (el.nodeName === 'THEAD') {
                headerExit = true;
            }
        });
        if (table && !headerExit) {
            var cellCount = table.querySelector('tr').childElementCount;
            var header = table.createTHead();
            var row = header.insertRow(0);
            for (var i = 0; i < cellCount; i++) {
                var th = createElement('th');
                th.appendChild(createElement('br'));
                row.appendChild(th);
            }
        }
        else {
            table.deleteTHead();
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    TableCommand.prototype.tableVerticalAlign = function (e) {
        if (e.item.subCommand === 'AlignTop') {
            e.item.tableCell.style.verticalAlign = 'top';
        }
        else if (e.item.subCommand === 'AlignMiddle') {
            e.item.tableCell.style.verticalAlign = 'middle';
        }
        else {
            e.item.tableCell.style.verticalAlign = 'bottom';
        }
        if (e.callBack) {
            e.callBack({
                requestType: e.item.subCommand,
                editorMode: 'HTML',
                event: e.event,
                range: this.parent.nodeSelection.getRange(this.parent.currentDocument),
                elements: this.parent.nodeSelection.getSelectedNodes(this.parent.currentDocument)
            });
        }
    };
    return TableCommand;
}());
export { TableCommand };
