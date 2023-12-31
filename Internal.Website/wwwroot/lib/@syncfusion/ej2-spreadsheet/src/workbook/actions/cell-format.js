import { getRangeIndexes, setCellFormat, applyCellFormat, activeCellChanged } from '../common/index';
import { getSwapRange, textDecorationUpdate } from '../common/index';
import { clear, getIndexesFromAddress } from '../common/index';
import { getSheetIndex, isHiddenRow, getSheet, getCell, setCell } from '../base/index';
/**
 * Workbook Cell format.
 */
var WorkbookCellFormat = /** @class */ (function () {
    function WorkbookCellFormat(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    WorkbookCellFormat.prototype.format = function (args) {
        var sheet;
        var rng = args.range;
        var eventArgs;
        if (rng && typeof rng === 'string' && rng.indexOf('!') > -1) {
            rng = rng.split('!')[1];
            sheet = this.parent.sheets[getSheetIndex(this.parent, args.range.split('!')[0])];
        }
        else {
            sheet = this.parent.getActiveSheet();
        }
        if (rng === undefined) {
            rng = sheet.selectedRange;
        }
        var triggerEvent = typeof (rng) !== 'object' && args.onActionUpdate;
        eventArgs = { range: rng, style: args.style, requestType: 'CellFormat' };
        if (triggerEvent) {
            this.parent.trigger('beforeCellFormat', eventArgs);
            this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'format' });
            if (eventArgs.cancel) {
                args.cancel = true;
                return;
            }
        }
        var indexes = typeof (eventArgs.range) === 'object' ? eventArgs.range :
            getSwapRange(getRangeIndexes(eventArgs.range));
        if (args.borderType) {
            this.setTypedBorder(sheet, args.style.border, indexes, args.borderType, args.onActionUpdate);
            delete args.style.border;
        }
        if (eventArgs.style.borderTop !== undefined) {
            for (var i = indexes[1]; i <= indexes[3]; i++) {
                this.checkAdjustantBorder(sheet, 'borderBottom', indexes[0] - 1, i);
                this.checkFullBorder(sheet, 'borderBottom', indexes[0] - 1, i);
                this.checkFullBorder(sheet, 'borderTop', indexes[0], i);
                this.setCellBorder(sheet, { borderTop: eventArgs.style.borderTop }, indexes[0], i, args.onActionUpdate, i === indexes[3]);
            }
            delete eventArgs.style.borderTop;
        }
        if (eventArgs.style.borderBottom !== undefined) {
            for (var i = indexes[1]; i <= indexes[3]; i++) {
                this.checkAdjustantBorder(sheet, 'borderTop', indexes[2] + 1, i);
                this.checkFullBorder(sheet, 'borderTop', indexes[2] + 1, i);
                this.checkFullBorder(sheet, 'borderBottom', indexes[2], i);
                this.setCellBorder(sheet, { borderBottom: eventArgs.style.borderBottom }, indexes[2], i, args.onActionUpdate, i === indexes[3]);
                this.setBottomBorderPriority(sheet, indexes[2], i);
            }
            delete eventArgs.style.borderBottom;
        }
        if (eventArgs.style.borderLeft !== undefined) {
            for (var i = indexes[0]; i <= indexes[2]; i++) {
                this.checkAdjustantBorder(sheet, 'borderRight', i, indexes[1] - 1);
                this.checkFullBorder(sheet, 'borderRight', i, indexes[1] - 1);
                this.checkFullBorder(sheet, 'borderLeft', i, indexes[1]);
                this.setCellBorder(sheet, { borderLeft: eventArgs.style.borderLeft }, i, indexes[1], args.onActionUpdate);
            }
            delete eventArgs.style.borderLeft;
        }
        if (eventArgs.style.borderRight !== undefined) {
            for (var i = indexes[0]; i <= indexes[2]; i++) {
                this.checkAdjustantBorder(sheet, 'borderLeft', i, indexes[3] - 1);
                this.checkFullBorder(sheet, 'borderLeft', i, indexes[3] - 1);
                this.checkFullBorder(sheet, 'borderRight', i, indexes[3]);
                this.setCellBorder(sheet, { borderRight: eventArgs.style.borderRight }, i, indexes[3], args.onActionUpdate);
            }
            delete eventArgs.style.borderRight;
        }
        var border;
        var isFullBorder;
        if (Object.keys(args.style).length) {
            for (var i = indexes[0]; i <= indexes[2]; i++) {
                for (var j = indexes[1]; j <= indexes[3]; j++) {
                    if (isFullBorder === undefined) {
                        if (eventArgs.style.border !== undefined) {
                            border = eventArgs.style.border;
                            eventArgs.style.border = undefined;
                            isFullBorder = true;
                        }
                        else {
                            isFullBorder = false;
                        }
                    }
                    if (isFullBorder) {
                        this.setFullBorder(sheet, border, indexes, i, j, args.onActionUpdate);
                    }
                    this.setCellStyle(sheet, i, j, eventArgs.style);
                    if (this.parent.getActiveSheet().id === sheet.id) {
                        this.parent.notify(applyCellFormat, { style: eventArgs.style, rowIdx: i, colIdx: j,
                            lastCell: j === indexes[3], isHeightCheckNeeded: true, manualUpdate: true, onActionUpdate: args.onActionUpdate
                        });
                    }
                }
            }
        }
        if (isFullBorder) {
            eventArgs.style.border = border;
        }
        this.parent.setUsedRange(indexes[2], indexes[3]);
        if (args.refreshRibbon) {
            this.parent.notify(activeCellChanged, null);
        }
        if (triggerEvent) {
            eventArgs.range = sheet.name + "!" + rng;
            this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'format' });
        }
    };
    WorkbookCellFormat.prototype.setBottomBorderPriority = function (sheet, rowIdx, colIdx) {
        if (isHiddenRow(sheet, rowIdx + 1)) {
            var pIdx = this.skipHiddenRows(sheet, rowIdx + 1);
            var pCellStyle = this.parent.getCellStyleValue(['borderTop'], [pIdx, colIdx]).borderTop;
            if (pCellStyle !== '') {
                sheet.rows[rowIdx].cells[colIdx].style.bottomPriority = true;
            }
        }
    };
    WorkbookCellFormat.prototype.setFullBorder = function (sheet, border, indexes, i, j, actionUpdate) {
        var style = {};
        if (i === indexes[0]) {
            this.checkAdjustantBorder(sheet, 'borderBottom', i - 1, j);
            this.checkFullBorder(sheet, 'borderBottom', i - 1, j);
        }
        if (j === indexes[1]) {
            this.checkAdjustantBorder(sheet, 'borderRight', i, j - 1);
            this.checkFullBorder(sheet, 'borderRight', i, j - 1);
        }
        if (j === indexes[3]) {
            this.checkAdjustantBorder(sheet, 'borderLeft', i, j + 1);
            this.checkFullBorder(sheet, 'borderLeft', i, j + 1);
        }
        else {
            this.checkAdjustantBorder(sheet, 'border', i, j + 1);
        }
        style.borderRight = border;
        style.borderTop = border;
        style.borderLeft = border;
        style.borderBottom = border;
        this.setCellBorder(sheet, style, i, j, actionUpdate, j === indexes[3]);
        if (i === indexes[2]) {
            this.checkAdjustantBorder(sheet, 'borderTop', i + 1, j);
            this.checkFullBorder(sheet, 'borderTop', i + 1, j);
            this.setBottomBorderPriority(sheet, i, j);
        }
        else {
            this.checkAdjustantBorder(sheet, 'border', i + 1, j);
        }
    };
    WorkbookCellFormat.prototype.checkAdjustantBorder = function (sheet, prop, rowIdx, colIdx) {
        var style = {};
        if (this.parent.getCellStyleValue([prop], [rowIdx, colIdx])[prop] !== '') {
            style[prop] = undefined;
            this.setCellStyle(sheet, rowIdx, colIdx, style);
        }
    };
    WorkbookCellFormat.prototype.checkFullBorder = function (sheet, prop, rowIdx, colIdx) {
        var border = this.parent.getCellStyleValue(['border'], [rowIdx, colIdx]).border;
        if (border !== '') {
            var style_1 = { border: undefined };
            ['borderBottom', 'borderTop', 'borderLeft', 'borderRight'].forEach(function (value) {
                if (value !== prop) {
                    style_1[value] = border;
                }
            });
            this.setCellStyle(sheet, rowIdx, colIdx, style_1);
        }
    };
    WorkbookCellFormat.prototype.textDecorationActionUpdate = function (args) {
        var sheet = this.parent.getActiveSheet();
        var eventArgs = { range: sheet.selectedRange, style: args.style, requestType: 'CellFormat' };
        this.parent.trigger('beforeCellFormat', eventArgs);
        this.parent.notify('actionBegin', { eventArgs: eventArgs, action: 'format' });
        if (eventArgs.cancel) {
            args.cancel = true;
            return;
        }
        var indexes = getSwapRange(getRangeIndexes(sheet.selectedRange));
        var value = args.style.textDecoration;
        var changedValue = value;
        var activeCellIndexes = getRangeIndexes(sheet.activeCell);
        var cellValue = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
        var changedStyle;
        var removeProp = false;
        if (cellValue === 'underline') {
            changedValue = value === 'underline' ? 'none' : 'underline line-through';
        }
        else if (cellValue === 'line-through') {
            changedValue = value === 'line-through' ? 'none' : 'underline line-through';
        }
        else if (cellValue === 'underline line-through') {
            changedValue = value === 'underline' ? 'line-through' : 'underline';
            removeProp = true;
        }
        if (changedValue === 'none') {
            removeProp = true;
        }
        this.format({
            style: { textDecoration: changedValue }, range: activeCellIndexes, refreshRibbon: args.refreshRibbon,
            onActionUpdate: true
        });
        for (var i = indexes[0]; i <= indexes[2]; i++) {
            for (var j = indexes[1]; j <= indexes[3]; j++) {
                if (i === activeCellIndexes[0] && j === activeCellIndexes[1]) {
                    continue;
                }
                changedStyle = {};
                cellValue = this.parent.getCellStyleValue(['textDecoration'], [i, j]).textDecoration;
                if (cellValue === 'none') {
                    if (removeProp) {
                        continue;
                    }
                    changedStyle.textDecoration = value;
                }
                else if (cellValue === 'underline' || cellValue === 'line-through') {
                    if (removeProp) {
                        if (value === cellValue) {
                            changedStyle.textDecoration = 'none';
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        changedStyle.textDecoration = value !== cellValue ? 'underline line-through' : value;
                    }
                }
                else if (cellValue === 'underline line-through') {
                    if (removeProp) {
                        changedStyle.textDecoration = value === 'underline' ? 'line-through' : 'underline';
                    }
                    else {
                        continue;
                    }
                }
                this.format({
                    style: changedStyle, range: [i, j, i, j], refreshRibbon: args.refreshRibbon,
                    onActionUpdate: true
                });
            }
        }
        eventArgs.range = sheet.name + '!' + eventArgs.range;
        this.parent.notify('actionComplete', { eventArgs: eventArgs, action: 'format' });
    };
    WorkbookCellFormat.prototype.setTypedBorder = function (sheet, border, range, type, actionUpdate) {
        var prevBorder;
        if (type === 'Outer') {
            for (var colIdx = range[1]; colIdx <= range[3]; colIdx++) {
                this.checkAdjustantBorder(sheet, 'borderBottom', range[0] - 1, colIdx);
                this.checkFullBorder(sheet, 'borderBottom', range[0] - 1, colIdx);
                this.setCellBorder(sheet, { borderTop: border }, range[0], colIdx, actionUpdate, colIdx === range[3]);
                this.checkAdjustantBorder(sheet, 'borderTop', range[2] + 1, colIdx);
                this.checkFullBorder(sheet, 'borderTop', range[2] + 1, colIdx);
                this.setCellBorder(sheet, { borderBottom: border }, range[2], colIdx, actionUpdate, colIdx === range[3]);
                this.setBottomBorderPriority(sheet, range[2], colIdx);
            }
            for (var rowIdx = range[0]; rowIdx <= range[2]; rowIdx++) {
                this.checkAdjustantBorder(sheet, 'borderRight', rowIdx, range[1] - 1);
                this.checkFullBorder(sheet, 'borderRight', rowIdx, range[1] - 1);
                this.setCellBorder(sheet, { borderLeft: border }, rowIdx, range[1], actionUpdate);
                this.checkAdjustantBorder(sheet, 'borderLeft', rowIdx, range[3] + 1);
                this.checkFullBorder(sheet, 'borderLeft', rowIdx, range[3] + 1);
                this.setCellBorder(sheet, { borderRight: border }, rowIdx, range[3], actionUpdate);
            }
        }
        else if (type === 'Inner') {
            for (var i = range[0]; i <= range[2]; i++) {
                for (var j = range[1]; j <= range[3]; j++) {
                    var style = {};
                    prevBorder = this.parent.getCellStyleValue(['border'], [i, j]).border;
                    if (prevBorder !== '') {
                        style.border = undefined;
                        if (j === range[3] || j === range[1] || i === range[0] || i === range[2]) {
                            if (i === range[0]) {
                                style.borderTop = prevBorder;
                            }
                            if (i === range[2]) {
                                style.borderBottom = prevBorder;
                            }
                            if (j === range[3]) {
                                style.borderRight = prevBorder;
                            }
                            if (j === range[1]) {
                                style.borderLeft = prevBorder;
                            }
                        }
                    }
                    if (j !== range[3]) {
                        style.borderRight = border;
                    }
                    if (i !== range[0]) {
                        style.borderTop = border;
                    }
                    if (i !== range[2]) {
                        style.borderBottom = border;
                    }
                    if (j !== range[1]) {
                        style.borderLeft = border;
                    }
                    this.setCellBorder(sheet, style, i, j, actionUpdate, j === range[3]);
                }
            }
        }
        else if (type === 'Vertical') {
            for (var i = range[0]; i <= range[2]; i++) {
                for (var j = range[1]; j <= range[3]; j++) {
                    var style = { borderRight: border, borderLeft: border };
                    if (j === range[1]) {
                        this.checkAdjustantBorder(sheet, 'borderRight', i, j - 1);
                        this.checkFullBorder(sheet, 'borderRight', i, j - 1);
                    }
                    if (j === range[3]) {
                        this.checkAdjustantBorder(sheet, 'borderLeft', i, j + 1);
                        this.checkFullBorder(sheet, 'borderLeft', i, j + 1);
                    }
                    this.setCellBorder(sheet, style, i, j, actionUpdate);
                }
            }
        }
        else {
            for (var i = range[0]; i <= range[2]; i++) {
                for (var j = range[1]; j <= range[3]; j++) {
                    var style = { borderTop: border, borderBottom: border };
                    if (i === range[0]) {
                        this.checkAdjustantBorder(sheet, 'borderBottom', i - 1, j);
                        this.checkFullBorder(sheet, 'borderBottom', i - 1, j);
                    }
                    this.setCellBorder(sheet, style, i, j, actionUpdate, j === range[3]);
                    if (i === range[2]) {
                        this.checkAdjustantBorder(sheet, 'borderTop', i + 1, j);
                        this.checkFullBorder(sheet, 'borderTop', i + 1, j);
                        this.setBottomBorderPriority(sheet, i, j);
                    }
                }
            }
        }
    };
    WorkbookCellFormat.prototype.setCellBorder = function (sheet, style, rowIdx, colIdx, actionUpdate, lastCell) {
        this.setCellStyle(sheet, rowIdx, colIdx, style);
        if (this.parent.getActiveSheet().id === sheet.id) {
            this.parent.notify(applyCellFormat, {
                style: style, rowIdx: rowIdx, colIdx: colIdx, onActionUpdate: actionUpdate, first: '', lastCell: lastCell,
                isHeightCheckNeeded: true, manualUpdate: true
            });
        }
    };
    WorkbookCellFormat.prototype.setCellStyle = function (sheet, rowIdx, colIdx, style) {
        if (!sheet.rows[rowIdx]) {
            sheet.rows[rowIdx] = { cells: [] };
        }
        else if (!sheet.rows[rowIdx].cells) {
            sheet.rows[rowIdx].cells = [];
        }
        if (!sheet.rows[rowIdx].cells[colIdx]) {
            sheet.rows[rowIdx].cells[colIdx] = {};
        }
        if (!sheet.rows[rowIdx].cells[colIdx].style) {
            sheet.rows[rowIdx].cells[colIdx].style = {};
        }
        Object.assign(sheet.rows[rowIdx].cells[colIdx].style, style, null, true);
    };
    WorkbookCellFormat.prototype.skipHiddenRows = function (sheet, startIdx) {
        startIdx++;
        if (isHiddenRow(sheet, startIdx)) {
            startIdx = this.skipHiddenRows(sheet, startIdx);
        }
        return startIdx;
    };
    WorkbookCellFormat.prototype.addEventListener = function () {
        this.parent.on(setCellFormat, this.format, this);
        this.parent.on(textDecorationUpdate, this.textDecorationActionUpdate, this);
        this.parent.on(clear, this.clearCellObj, this);
    };
    WorkbookCellFormat.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(setCellFormat, this.format);
            this.parent.off(textDecorationUpdate, this.textDecorationActionUpdate);
            this.parent.off(clear, this.clearCellObj);
        }
    };
    WorkbookCellFormat.prototype.clearCellObj = function (options) {
        var clrRange = options.range ? (options.range.indexOf('!') > 0) ? options.range.split('!')[1] : options.range.split('!')[0]
            : this.parent.getActiveSheet().selectedRange;
        var sheetIdx = (options.range && options.range.indexOf('!') > 0) ?
            getSheetIndex(this.parent, options.range.split('!')[0]) : this.parent.activeSheetIndex;
        var sheet = getSheet(this.parent, sheetIdx);
        var range = getIndexesFromAddress(clrRange);
        var sRowIdx = range[0];
        var eRowIdx = range[2];
        var sColIdx;
        var eColIdx;
        for (sRowIdx; sRowIdx <= eRowIdx; sRowIdx++) {
            sColIdx = range[1];
            eColIdx = range[3];
            for (sColIdx; sColIdx <= eColIdx; sColIdx++) {
                var cell = getCell(sRowIdx, sColIdx, sheet);
                if (cell) {
                    switch (options.type) {
                        case 'Clear Formats':
                            delete cell.format;
                            delete cell.rowSpan;
                            delete cell.style;
                            delete cell.wrap;
                            delete cell.colSpan;
                            break;
                        case 'Clear Contents':
                            delete cell.value;
                            delete cell.formula;
                            break;
                        case 'Clear Hyperlinks':
                            delete cell.hyperlink;
                            break;
                        case 'Clear All':
                            setCell(sRowIdx, sColIdx, sheet, {}, false);
                            break;
                    }
                }
            }
        }
    };
    /**
     * To destroy workbook cell format.
     */
    WorkbookCellFormat.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    /**
     * Get the workbook cell format module name.
     */
    WorkbookCellFormat.prototype.getModuleName = function () {
        return 'workbookcellformat';
    };
    return WorkbookCellFormat;
}());
export { WorkbookCellFormat };
