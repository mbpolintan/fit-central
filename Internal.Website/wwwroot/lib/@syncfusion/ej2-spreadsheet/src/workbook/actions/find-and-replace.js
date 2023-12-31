import { getCellIndexes, getCellAddress, findNext, findPrevious, count, } from '../common/index';
import { goto, replaceHandler, replaceAllHandler, showDialog, findUndoRedo, replaceAllDialog } from '../common/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { findAllValues, workBookeditAlert } from '../common/index';
/**
 * `WorkbookFindAndReplace` module is used to handle the search action in Spreadsheet.
 */
var WorkbookFindAndReplace = /** @class */ (function () {
    /**
     * Constructor for WorkbookFindAndReplace module.
     */
    function WorkbookFindAndReplace(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * To destroy the FindAndReplace module.
     */
    WorkbookFindAndReplace.prototype.destroy = function () {
        this.removeEventListener();
        this.parent = null;
    };
    WorkbookFindAndReplace.prototype.addEventListener = function () {
        this.parent.on(findNext, this.findNext, this);
        this.parent.on(findPrevious, this.findPrevious, this);
        this.parent.on(replaceHandler, this.replace, this);
        this.parent.on(replaceAllHandler, this.replaceAll, this);
        this.parent.on(count, this.totalCount, this);
        this.parent.on(findAllValues, this.findAllValues, this);
    };
    WorkbookFindAndReplace.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(findNext, this.findNext);
            this.parent.off(findPrevious, this.findPrevious);
            this.parent.off(replaceHandler, this.replace);
            this.parent.off(replaceAllHandler, this.replaceAll);
            this.parent.off(count, this.totalCount);
            this.parent.off(findAllValues, this.findAllValues);
        }
    };
    WorkbookFindAndReplace.prototype.findNext = function (args) {
        var sheets = this.parent.sheets;
        var val;
        var sheetIndex = args.sheetIndex;
        var sheet = sheets[this.parent.activeSheetIndex];
        var activecell = getCellIndexes(sheet.activeCell);
        var usedRange = sheet.usedRange;
        var endColumn = usedRange.colIndex;
        var stringValue = args.value.toString();
        var cidx;
        var ridx;
        var count = 0;
        var endRow = usedRange.rowIndex;
        var loopCount = 0;
        var cellFormat;
        var valueOfCell;
        cidx = activecell[1];
        ridx = activecell[0];
        var startColumn = cidx;
        var startRow = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    var dispTxt = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = dispTxt.toString();
                }
                else {
                    valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                }
            }
        }
        if (valueOfCell) {
            var lcValueOfCell = valueOfCell.toLowerCase();
            var ivalueOfCell = valueOfCell.indexOf(args.value) > -1;
            var lowerCaseIndex = lcValueOfCell.indexOf(args.value) > -1;
            if ((stringValue === valueOfCell) || (stringValue === lcValueOfCell) || (ivalueOfCell) || (lowerCaseIndex)) {
                if (args.searchBy === 'By Column') {
                    ridx++;
                }
                else {
                    cidx++;
                }
                count++;
            }
        }
        if (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex) {
            if (activecell[0] > sheet.usedRange.rowIndex && activecell[1] <= sheet.usedRange.colIndex) {
                ridx = 0;
                cidx = activecell[1];
            }
            else if (activecell[0] <= sheet.usedRange.rowIndex && activecell[1] > sheet.usedRange.colIndex) {
                ridx = activecell[0];
                cidx = 0;
            }
            else {
                ridx = 0;
                cidx = 0;
            }
        }
        var findNextArgs = {
            rowIndex: ridx, colIndex: cidx, usedRange: usedRange, endRow: endRow, endColumn: endColumn, startRow: startRow,
            mode: args.mode, loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheetIndex: this.parent.activeSheetIndex, startColumn: startColumn, sheets: sheets
        };
        if (args.searchBy === 'By Row') {
            this.findNxtRow(findNextArgs);
        }
        if (args.searchBy === 'By Column') {
            this.findNxtCol(findNextArgs);
        }
    };
    WorkbookFindAndReplace.prototype.findNxtRow = function (findNextArgs) {
        var usedRange;
        var sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
        var sheetsLen = this.parent.sheets.length;
        var activecell = getCellIndexes(sheet.activeCell);
        if (findNextArgs.colIndex >= findNextArgs.usedRange.colIndex + 1) {
            findNextArgs.colIndex = 0;
            findNextArgs.rowIndex++;
        }
        for (findNextArgs.rowIndex; findNextArgs.rowIndex <= findNextArgs.endRow + 1; findNextArgs.rowIndex++) {
            if (findNextArgs.rowIndex > findNextArgs.endRow) {
                if (findNextArgs.mode === 'Workbook') {
                    var noCellfound = this.parent.activeSheetIndex;
                    findNextArgs.sheetIndex++;
                    if (sheetsLen === findNextArgs.sheetIndex) {
                        findNextArgs.sheetIndex = 0;
                    }
                    if (noCellfound === findNextArgs.sheetIndex) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
                    usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findNextArgs.rowIndex = 0;
                    findNextArgs.colIndex = 0;
                    findNextArgs.endColumn = usedRange.colIndex;
                    findNextArgs.endRow = usedRange.rowIndex;
                }
                if (findNextArgs.colIndex === 0 && findNextArgs.rowIndex > findNextArgs.endRow) {
                    if ((activecell[0] === 0 && activecell[1] === 0) ||
                        (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex)) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    else if ((activecell[0] !== 0 && activecell[1] !== 0) || (activecell[0] !== 0 || activecell[1] !== 0)) {
                        findNextArgs.startColumn = 0;
                        findNextArgs.startRow = 0;
                        findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                        findNextArgs.endRow = activecell[0];
                        findNextArgs.rowIndex = findNextArgs.startRow;
                        findNextArgs.colIndex = findNextArgs.startColumn;
                        findNextArgs.loopCount++;
                    }
                }
            }
            if (findNextArgs.count > 0) {
                if (findNextArgs.usedRange.rowIndex < findNextArgs.rowIndex) {
                    findNextArgs.rowIndex = 0;
                    if (findNextArgs.rowIndex === 0) {
                        findNextArgs.colIndex = 0;
                    }
                }
            }
            if (sheet.rows[findNextArgs.rowIndex]) {
                var row = sheet.rows[findNextArgs.rowIndex];
                for (findNextArgs.colIndex; findNextArgs.colIndex <= findNextArgs.endColumn; findNextArgs.colIndex++) {
                    if (row) {
                        if (row.cells[findNextArgs.colIndex]) {
                            var checkTrue = this.nextCommon(findNextArgs);
                            if (checkTrue) {
                                return;
                            }
                        }
                    }
                }
                if (findNextArgs.colIndex > findNextArgs.endColumn) {
                    findNextArgs.colIndex = 0;
                }
                if (findNextArgs.loopCount > 0) {
                    if (activecell[0] === findNextArgs.rowIndex) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                }
            }
        }
        if (findNextArgs.count === 0) {
            this.parent.notify(showDialog, null);
            return;
        }
    };
    WorkbookFindAndReplace.prototype.findNxtCol = function (findNextArgs) {
        var sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
        var noFound;
        var activecell = getCellIndexes(sheet.activeCell);
        var sheetsLen = this.parent.sheets.length;
        if (findNextArgs.rowIndex >= findNextArgs.usedRange.rowIndex) {
            findNextArgs.rowIndex = 0;
            findNextArgs.colIndex++;
        }
        for (findNextArgs.colIndex; findNextArgs.colIndex <= findNextArgs.usedRange.colIndex + 1; findNextArgs.colIndex++) {
            if (findNextArgs.colIndex >= findNextArgs.endColumn + 1) {
                if (findNextArgs.mode === 'Workbook') {
                    noFound = this.parent.activeSheetIndex;
                    findNextArgs.sheetIndex++;
                    if (sheetsLen === findNextArgs.sheetIndex) {
                        findNextArgs.sheetIndex = 0;
                    }
                    if (noFound === findNextArgs.sheetIndex) {
                        if (findNextArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
                    findNextArgs.usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findNextArgs.colIndex = 0;
                    findNextArgs.rowIndex = 0;
                    findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                    findNextArgs.endRow = findNextArgs.usedRange.rowIndex;
                }
            }
            if (findNextArgs.colIndex >= findNextArgs.endColumn + 1) {
                findNextArgs.colIndex = 0;
            }
            if (findNextArgs.rowIndex > findNextArgs.endRow && findNextArgs.colIndex === 0) {
                if ((activecell[0] === 0 && activecell[1] === 0) ||
                    (activecell[1] > sheet.usedRange.rowIndex || activecell[0] > sheet.usedRange.colIndex)) {
                    if (findNextArgs.count === 0) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                }
                else if ((activecell[1] !== 0 || activecell[0] !== 0) || (activecell[1] !== 0 && activecell[0] !== 0)) {
                    findNextArgs.startRow = 0;
                    findNextArgs.startColumn = 0;
                    findNextArgs.endRow = activecell[0];
                    findNextArgs.endColumn = findNextArgs.usedRange.colIndex;
                    findNextArgs.colIndex = findNextArgs.startColumn;
                    findNextArgs.rowIndex = findNextArgs.startRow;
                    findNextArgs.loopCount++;
                }
            }
            if (findNextArgs.count > 0) {
                if (findNextArgs.usedRange.colIndex + 1 < findNextArgs.colIndex) {
                    findNextArgs.colIndex = 0;
                    findNextArgs.rowIndex = 0;
                }
            }
            if (findNextArgs.rowIndex >= findNextArgs.endRow) {
                findNextArgs.rowIndex = 0;
            }
            if (findNextArgs.colIndex <= findNextArgs.usedRange.colIndex) {
                for (findNextArgs.rowIndex; findNextArgs.rowIndex <= findNextArgs.usedRange.rowIndex; findNextArgs.rowIndex++) {
                    if (sheet.rows[findNextArgs.rowIndex]) {
                        if (sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex]) {
                            var checkTrue = this.nextCommon(findNextArgs);
                            if (checkTrue) {
                                return;
                            }
                        }
                    }
                }
                if (findNextArgs.loopCount > 0) {
                    if (activecell[1] === findNextArgs.colIndex) {
                        this.parent.notify(showDialog, null);
                        return;
                    }
                }
            }
        }
        if (findNextArgs.count === 0) {
            this.parent.notify(showDialog, null);
            return;
        }
    };
    WorkbookFindAndReplace.prototype.nextCommon = function (findNextArgs) {
        var sheet = findNextArgs.sheets[findNextArgs.sheetIndex];
        if (sheet.rows[findNextArgs.rowIndex]) {
            if (sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex]) {
                var cellType = sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex];
                if (cellType) {
                    var cellval = void 0;
                    if (cellType.format) {
                        var displayTxt = this.parent.getDisplayText(sheet.rows[findNextArgs.rowIndex].
                            cells[findNextArgs.colIndex]);
                        cellval = displayTxt;
                    }
                    else {
                        cellval = sheet.rows[findNextArgs.rowIndex].cells[findNextArgs.colIndex].value.toString();
                    }
                    if (findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        if (cellval === findNextArgs.stringValue) {
                            var address = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                    else if (findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        var index = cellval.indexOf(findNextArgs.args.value) > -1;
                        if ((cellval === findNextArgs.stringValue) || (index)) {
                            var address = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                    else if (!findNextArgs.args.isCSen && findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        if (findNextArgs.val === findNextArgs.stringValue) {
                            var address = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                    else if (!findNextArgs.args.isCSen && !findNextArgs.args.isEMatch) {
                        findNextArgs.val = cellval.toString().toLowerCase();
                        var index = cellval.indexOf(findNextArgs.args.value) > -1;
                        var lowerCaseIndex = findNextArgs.val.indexOf(findNextArgs.args.value) > -1;
                        if ((findNextArgs.val === findNextArgs.stringValue) || ((cellval === findNextArgs.stringValue) || (index)) ||
                            (cellval === findNextArgs.stringValue) || (lowerCaseIndex)) {
                            var address = sheet.name + '!' + getCellAddress(findNextArgs.rowIndex, findNextArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findNextArgs.count++;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    WorkbookFindAndReplace.prototype.findPrevious = function (args) {
        var sheets = this.parent.sheets;
        var sheetIndex = args.sheetIndex;
        var sheet = sheets[sheetIndex];
        var valueOfCell;
        var cellFormat;
        var val;
        var activecell = getCellIndexes(sheet.activeCell);
        var loopCount = 0;
        var count = 0;
        var endRow = sheet.usedRange.rowIndex;
        var endColumn = sheet.usedRange.colIndex;
        var stringValue = args.value.toString();
        var cidx = activecell[1];
        var ridx = activecell[0];
        var startColumn = cidx;
        var startRow = ridx;
        if (sheet.rows[ridx]) {
            if (sheet.rows[ridx].cells[cidx]) {
                cellFormat = sheet.rows[ridx].cells[cidx].format;
                if (cellFormat) {
                    var displayTxt = this.parent.getDisplayText(sheet.rows[ridx].cells[cidx]);
                    valueOfCell = displayTxt.toString();
                }
                else {
                    valueOfCell = sheet.rows[ridx].cells[cidx].value.toString();
                }
            }
        }
        if (valueOfCell) {
            var lcValue = valueOfCell.toLowerCase();
            var ivalue = valueOfCell.indexOf(args.value) > -1;
            var lowerCaseIndex = lcValue.indexOf(args.value) > -1;
            if ((stringValue === valueOfCell) || (stringValue === lcValue) || (ivalue) || (lowerCaseIndex)) {
                if (args.searchBy === 'By Row') {
                    cidx--;
                }
                if (args.searchBy === 'By Column') {
                    ridx--;
                }
                count++;
            }
        }
        if (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex) {
            if (activecell[0] > sheet.usedRange.rowIndex && activecell[1] <= sheet.usedRange.colIndex) {
                ridx = sheet.usedRange.rowIndex;
                cidx = activecell[1];
            }
            else if (activecell[0] <= sheet.usedRange.rowIndex && activecell[1] > sheet.usedRange.colIndex) {
                ridx = activecell[0];
                cidx = sheet.usedRange.colIndex;
            }
            else {
                ridx = sheet.usedRange.rowIndex;
                cidx = sheet.usedRange.colIndex;
            }
        }
        var findPrevArgs = {
            rowIndex: ridx, colIndex: cidx, endRow: endRow, endColumn: endColumn, startRow: startRow,
            loopCount: loopCount, count: count, args: args, val: val, stringValue: stringValue,
            sheets: sheets, sheetIndex: sheetIndex, startColumn: startColumn,
        };
        if (args.searchBy === 'By Row') {
            this.findPreRow(findPrevArgs);
        }
        if (args.searchBy === 'By Column') {
            this.findPreCol(findPrevArgs);
        }
    };
    WorkbookFindAndReplace.prototype.findPreRow = function (findPrevArgs) {
        var usedRan;
        var sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        var sheetsLength = this.parent.sheets.length;
        var noValueBoolean = false;
        var activecell = getCellIndexes(sheet.activeCell);
        if (findPrevArgs.colIndex === -1) {
            findPrevArgs.colIndex = findPrevArgs.endColumn;
            findPrevArgs.rowIndex--;
        }
        for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= -1; findPrevArgs.rowIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex < 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    var noCellfound = this.parent.activeSheetIndex;
                    findPrevArgs.sheetIndex--;
                    if (findPrevArgs.sheetIndex === -1) {
                        findPrevArgs.sheetIndex = sheetsLength - 1;
                    }
                    if (noCellfound === findPrevArgs.sheetIndex) {
                        if (findPrevArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
                    usedRan = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findPrevArgs.rowIndex = usedRan.rowIndex;
                    findPrevArgs.colIndex = usedRan.colIndex;
                    findPrevArgs.endColumn = 0;
                    findPrevArgs.endRow = 0;
                }
                noValueBoolean = this.commonCondition(findPrevArgs, activecell);
            }
            if (!noValueBoolean) {
                if (findPrevArgs.args.mode !== 'Workbook') {
                    if (findPrevArgs.count > 0) {
                        if (findPrevArgs.rowIndex === -1) {
                            findPrevArgs.rowIndex = findPrevArgs.endRow;
                        }
                    }
                }
                if (findPrevArgs.rowIndex === -1) {
                    findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                    findPrevArgs.colIndex = sheet.usedRange.colIndex;
                }
                if (sheet.rows[findPrevArgs.rowIndex]) {
                    if (findPrevArgs.colIndex === -1) {
                        findPrevArgs.colIndex = sheet.usedRange.colIndex;
                    }
                    for (findPrevArgs.colIndex; findPrevArgs.colIndex >= 0; findPrevArgs.colIndex--) {
                        if (sheet.rows[findPrevArgs.rowIndex]) {
                            if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                                var checkTrue = this.prevCommon(findPrevArgs);
                                if (checkTrue) {
                                    return;
                                }
                            }
                        }
                    }
                    if (findPrevArgs.loopCount > 0) {
                        if (activecell[0] === findPrevArgs.rowIndex) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                }
            }
        }
        if (!noValueBoolean) {
            if (findPrevArgs.count === 0) {
                this.parent.notify(showDialog, null);
                return;
            }
        }
    };
    WorkbookFindAndReplace.prototype.findPreCol = function (findPrevArgs) {
        var usedRange;
        var sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        var sheetsLen = this.parent.sheets.length;
        var noValueBoolean = false;
        var activecell = getCellIndexes(sheet.activeCell);
        for (findPrevArgs.colIndex; findPrevArgs.colIndex >= -1; findPrevArgs.colIndex--) {
            if (findPrevArgs.rowIndex < 0 && findPrevArgs.colIndex < 0) {
                if (findPrevArgs.args.mode === 'Workbook') {
                    var noCellfound = this.parent.activeSheetIndex;
                    findPrevArgs.sheetIndex--;
                    if (findPrevArgs.sheetIndex === -1) {
                        findPrevArgs.sheetIndex = sheetsLen - 1;
                    }
                    if (noCellfound === findPrevArgs.sheetIndex) {
                        if (findPrevArgs.count === 0) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                    sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
                    usedRange = sheet.usedRange;
                    activecell = getCellIndexes(sheet.activeCell);
                    findPrevArgs.rowIndex = usedRange.rowIndex;
                    findPrevArgs.colIndex = usedRange.colIndex;
                    findPrevArgs.endColumn = 0;
                    findPrevArgs.endRow = 0;
                }
                noValueBoolean = this.commonCondition(findPrevArgs, activecell);
            }
            if (!noValueBoolean) {
                if (findPrevArgs.count > 0) {
                    if (findPrevArgs.colIndex < 0) {
                        findPrevArgs.colIndex = findPrevArgs.endColumn;
                    }
                }
                if (findPrevArgs.rowIndex < 0) {
                    findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                }
                if (findPrevArgs.colIndex < -1) {
                    findPrevArgs.colIndex = sheet.usedRange.colIndex;
                    findPrevArgs.rowIndex--;
                }
                if (sheet.rows[findPrevArgs.rowIndex]) {
                    if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                        if (findPrevArgs.rowIndex === -1) {
                            findPrevArgs.rowIndex = sheet.usedRange.rowIndex;
                        }
                    }
                }
                for (findPrevArgs.rowIndex; findPrevArgs.rowIndex >= 0; findPrevArgs.rowIndex--) {
                    if (sheet.rows[findPrevArgs.rowIndex]) {
                        if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                            var check = this.prevCommon(findPrevArgs);
                            if (check) {
                                return;
                            }
                        }
                    }
                    if (findPrevArgs.loopCount > 0) {
                        if (activecell[1] === findPrevArgs.colIndex) {
                            this.parent.notify(showDialog, null);
                            return;
                        }
                    }
                }
            }
        }
        if (!noValueBoolean) {
            if (findPrevArgs.count === 0) {
                this.parent.notify(showDialog, null);
                return;
            }
        }
    };
    WorkbookFindAndReplace.prototype.commonCondition = function (findPrevArgs, activecell) {
        var sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        var isTrue;
        if ((activecell[0] !== findPrevArgs.endRow && activecell[1] !== findPrevArgs.endColumn) ||
            (activecell[0] !== findPrevArgs.endRow || activecell[1] !== findPrevArgs.endColumn)) {
            findPrevArgs.startColumn = sheet.usedRange.colIndex;
            findPrevArgs.startRow = sheet.usedRange.rowIndex;
            findPrevArgs.endColumn = 0;
            findPrevArgs.endRow = activecell[0];
            findPrevArgs.rowIndex = findPrevArgs.startRow;
            findPrevArgs.colIndex = findPrevArgs.startColumn;
            findPrevArgs.loopCount++;
            isTrue = false;
        }
        else if ((activecell[0] === sheet.usedRange.rowIndex && activecell[1] === sheet.usedRange.colIndex) ||
            (activecell[0] > sheet.usedRange.rowIndex || activecell[1] > sheet.usedRange.colIndex)) {
            this.parent.notify(showDialog, null);
            isTrue = true;
        }
        return isTrue;
    };
    WorkbookFindAndReplace.prototype.prevCommon = function (findPrevArgs) {
        var sheet = findPrevArgs.sheets[findPrevArgs.sheetIndex];
        if (sheet.rows[findPrevArgs.rowIndex]) {
            if (sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex]) {
                var cellType = sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex];
                if (cellType) {
                    var cellvalue = void 0;
                    if (cellType.format) {
                        var displayTxt = this.parent.getDisplayText(sheet.rows[findPrevArgs.rowIndex]
                            .cells[findPrevArgs.colIndex]);
                        cellvalue = displayTxt;
                    }
                    else {
                        cellvalue = sheet.rows[findPrevArgs.rowIndex].cells[findPrevArgs.colIndex].value.toString();
                    }
                    if (findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        if (cellvalue === findPrevArgs.stringValue) {
                            var address = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                    else if (findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        var index = cellvalue.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || (index)) {
                            var address = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                    else if (!findPrevArgs.args.isCSen && findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        if (findPrevArgs.val === findPrevArgs.stringValue) {
                            var address = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                    else if (!findPrevArgs.args.isCSen && !findPrevArgs.args.isEMatch) {
                        findPrevArgs.val = cellvalue.toString().toLowerCase();
                        var index = cellvalue.indexOf(findPrevArgs.args.value) > -1;
                        var lowerCaseIndex = findPrevArgs.val.indexOf(findPrevArgs.args.value) > -1;
                        if ((cellvalue === findPrevArgs.stringValue) || ((cellvalue === findPrevArgs.stringValue) ||
                            (index)) || (findPrevArgs.val === findPrevArgs.stringValue) || (lowerCaseIndex)) {
                            var address = sheet.name + '!' + getCellAddress(findPrevArgs.rowIndex, findPrevArgs.colIndex);
                            this.parent.notify(goto, { address: address });
                            findPrevArgs.count++;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    WorkbookFindAndReplace.prototype.replace = function (args) {
        if (this.parent.getActiveSheet().isProtected) {
            this.parent.notify(workBookeditAlert, null);
            return;
        }
        var sheet = this.parent.getActiveSheet();
        var activecell = getCellIndexes(sheet.activeCell);
        var currentCell = sheet.rows[activecell[0]].cells[activecell[1]].value.toString();
        var index = currentCell.indexOf(args.value) > -1;
        var lowerCaseIndex = currentCell.toLowerCase().indexOf(args.value) > -1;
        var val = currentCell.toString().toLowerCase();
        if ((currentCell !== args.value) && (!index) && (val !== args.value) && (!lowerCaseIndex)) {
            args.findOpt = 'next';
            this.findNext(args);
        }
        this.parent.getActiveSheet();
        var activecel = getCellIndexes(sheet.activeCell);
        var address = sheet.activeCell;
        var cell = sheet.rows[activecel[0]].cells[activecel[1]];
        var cellFormat = sheet.rows[activecel[0]].cells[activecel[1]].format;
        var compareVal;
        var replaceAddress = sheet.name + '!' + getCellAddress(activecel[0], activecel[1]);
        if (cellFormat) {
            var dispTxt = this.parent.getDisplayText(sheet.rows[activecel[0]].cells[activecel[1]]);
            compareVal = dispTxt.toString();
        }
        else {
            compareVal = sheet.rows[activecel[0]].cells[activecel[1]].value.toString();
        }
        var replaceAllCollection = { undoRedoOpt: 'before', address: replaceAddress, compareVal: compareVal };
        this.parent.notify(findUndoRedo, replaceAllCollection);
        var lcValueOfCell = compareVal.toLowerCase();
        var ivalueOfCell = compareVal.indexOf(args.value) > -1;
        var caseInSensitive = lcValueOfCell.indexOf(args.value) > -1;
        if ((args.value === compareVal) || (args.value === lcValueOfCell)) {
            sheet.rows[activecel[0]].cells[activecel[1]].value = args.replaceValue;
            this.parent.updateCell(cell, address);
            var replaceAllCollection_1 = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection_1);
        }
        else if (ivalueOfCell) {
            var newValue = compareVal.replace(args.value, args.replaceValue);
            sheet.rows[activecel[0]].cells[activecel[1]].value = newValue;
            this.parent.updateCell(cell, address);
            var replaceAllCollection_2 = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection_2);
        }
        else if (caseInSensitive) {
            var regx = new RegExp(args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
            var updateValue = compareVal.replace(regx, args.replaceValue);
            sheet.rows[activecel[0]].cells[activecel[1]].value = updateValue;
            this.parent.updateCell(cell, address);
            var replaceAllCollection_3 = { address: replaceAddress, compareVal: args.replaceValue, undoRedoOpt: 'after' };
            this.parent.notify(findUndoRedo, replaceAllCollection_3);
        }
    };
    WorkbookFindAndReplace.prototype.replaceAll = function (args) {
        var startSheet = 0;
        var sheet = this.parent.sheets[startSheet];
        var endRow = sheet.usedRange.rowIndex;
        var count = 0;
        var undoRedoOpt = 'beforeReplaceAll';
        var startRow = 0;
        var endColumn = sheet.usedRange.colIndex;
        var startColumn = 0;
        var addressCollection = [];
        var address;
        for (startRow; startRow <= endRow; startRow++) {
            if (startColumn > endColumn && startRow === endRow) {
                if (args.mode === 'Workbook') {
                    startSheet++;
                    sheet = this.parent.sheets[startSheet];
                    if (sheet) {
                        startColumn = 0;
                        startRow = 0;
                        endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                        sheet = sheet;
                    }
                }
            }
            if (sheet) {
                if (sheet.rows[startRow]) {
                    var row = sheet.rows[startRow];
                    if (startColumn === endColumn + 1) {
                        startColumn = 0;
                    }
                    for (startColumn; startColumn <= endColumn; startColumn++) {
                        var cell = sheet.rows[startRow].cells[startColumn];
                        if (row) {
                            if (row.cells[startColumn]) {
                                var cellType = sheet.rows[startRow].cells[startColumn];
                                if (cellType) {
                                    var cellTypeVal = cellType.format;
                                    var cellval = void 0;
                                    if (cellTypeVal) {
                                        var displayTxt = this.parent.getDisplayText(sheet.rows[startRow].
                                            cells[startColumn]);
                                        cellval = displayTxt.toString();
                                    }
                                    else {
                                        cellval = sheet.rows[startRow].cells[startColumn].value.toString();
                                    }
                                    if (args.isCSen && args.isEMatch) {
                                        if (cellval === args.value) {
                                            sheet.rows[startRow].cells[startColumn].value = args.replaceValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (args.isCSen && !args.isEMatch) {
                                        var index = cellval.indexOf(args.value) > -1;
                                        if ((cellval === args.value) || (index)) {
                                            var newValue = cellval.replace(args.value, args.replaceValue);
                                            sheet.rows[startRow].cells[startColumn].value = newValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (!args.isCSen && args.isEMatch) {
                                        var val = cellval.toString().toLowerCase();
                                        if (val === args.value) {
                                            sheet.rows[startRow].cells[startColumn].value = args.replaceValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (!args.isCSen && !args.isEMatch) {
                                        var val = cellval.toString().toLowerCase();
                                        var index = cellval.indexOf(args.value) > -1;
                                        var lowerCaseValue = val.indexOf(args.value) > -1;
                                        if (((cellval === args.value) || (index)) || (val === args.value) || (cellval === args.value) ||
                                            (lowerCaseValue)) {
                                            var regExepression = new RegExp(args.value.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
                                            var newValue = cellval.replace(regExepression, args.replaceValue);
                                            sheet.rows[startRow].cells[startColumn].value = newValue;
                                            address = sheet.name + '!' + getCellAddress(startRow, startColumn);
                                            this.parent.updateCell(cell, address);
                                            addressCollection.push(address);
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var replaceAllCollection = {
            undoRedoOpt: undoRedoOpt, Collection: addressCollection,
            replaceValue: args.value
        };
        this.parent.notify(findUndoRedo, replaceAllCollection);
        replaceAllCollection = {
            undoRedoOpt: 'afterReplaceAll', Collection: addressCollection,
            replaceValue: args.replaceValue
        };
        this.parent.notify(findUndoRedo, replaceAllCollection);
        var countNumber = count;
        this.parent.notify(replaceAllDialog, { count: countNumber, replaceValue: args.replaceValue });
    };
    WorkbookFindAndReplace.prototype.totalCount = function (args) {
        var startSheet = 0;
        var sheet = this.parent.sheets[startSheet];
        var endRow = sheet.usedRange.rowIndex;
        var count = 0;
        var rowIndex = 0;
        var endColumn = sheet.usedRange.colIndex;
        var columnIndex = 0;
        for (rowIndex; rowIndex <= endRow; rowIndex++) {
            if (sheet.rows[rowIndex]) {
                var row = sheet.rows[rowIndex];
                if (columnIndex === endColumn + 1) {
                    columnIndex = 0;
                }
                for (columnIndex; columnIndex <= endColumn; columnIndex++) {
                    if (row) {
                        if (row.cells[columnIndex]) {
                            var cellType = sheet.rows[rowIndex].cells[columnIndex];
                            if (cellType) {
                                var cellFormat = cellType.format;
                                var cellvalue = void 0;
                                if (cellFormat) {
                                    var displayTxt = this.parent.getDisplayText(sheet.rows[rowIndex].
                                        cells[columnIndex]);
                                    cellvalue = displayTxt.toString();
                                }
                                else {
                                    cellvalue = cellType.value.toString();
                                }
                                if (args.isCSen && args.isEMatch) {
                                    if (cellvalue === args.value) {
                                        count++;
                                    }
                                }
                                else if (args.isCSen && !args.isEMatch) {
                                    var index = cellvalue.indexOf(args.value) > -1;
                                    if ((cellvalue === args.value) || (index)) {
                                        count++;
                                    }
                                }
                                else if (!args.isCSen && args.isEMatch) {
                                    var val = cellvalue.toString().toLowerCase();
                                    if (val === args.value) {
                                        count++;
                                    }
                                }
                                else if (!args.isCSen && !args.isEMatch) {
                                    var val = cellvalue.toString().toLowerCase();
                                    var index = cellvalue.indexOf(args.value) > -1;
                                    var lowerCaseValue = val.indexOf(args.value) > -1;
                                    if ((val === args.value) || ((cellvalue === args.value) || (index)) || (cellvalue === args.value) ||
                                        (lowerCaseValue)) {
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var totalCount = count;
        var requiredCount = this.requiredCount(args) - 1;
        count = totalCount - requiredCount;
        args.findCount = count + ' ' + 'of' + ' ' + totalCount;
        return;
    };
    WorkbookFindAndReplace.prototype.requiredCount = function (args) {
        var sheetIndex = this.parent.activeSheetIndex;
        var sheet = this.parent.sheets[sheetIndex];
        var activecel = getCellIndexes(sheet.activeCell);
        var endRow = sheet.usedRange.rowIndex;
        var requiredCount = 0;
        var startRow = activecel[0];
        var endColumn = sheet.usedRange.colIndex;
        var startColumn = activecel[1];
        for (startRow; startRow <= endRow; startRow++) {
            if (sheet.rows[startRow]) {
                var row = sheet.rows[startRow];
                if (startColumn === endColumn + 1) {
                    startColumn = 0;
                }
                for (startColumn; startColumn <= endColumn; startColumn++) {
                    if (row) {
                        if (row.cells[startColumn]) {
                            if (sheet.rows[startRow].cells[startColumn]) {
                                var cellval = void 0;
                                if (sheet.rows[startRow].cells[startColumn].format) {
                                    var displayTxt = this.parent.getDisplayText(sheet.rows[startRow].
                                        cells[startColumn]);
                                    cellval = displayTxt.toString();
                                }
                                else {
                                    cellval = sheet.rows[startRow].cells[startColumn].value.toString();
                                }
                                if (args.isCSen && !args.isEMatch) {
                                    var index = cellval.indexOf(args.value) > -1;
                                    if ((cellval === args.value) || (index)) {
                                        requiredCount++;
                                    }
                                }
                                else if (args.isCSen && args.isEMatch) {
                                    if (cellval === args.value) {
                                        requiredCount++;
                                    }
                                }
                                else if (!args.isCSen && args.isEMatch) {
                                    var val = cellval.toString().toLowerCase();
                                    if (val === args.value) {
                                        requiredCount++;
                                    }
                                }
                                else if (!args.isCSen && !args.isEMatch) {
                                    var val = cellval.toString().toLowerCase();
                                    var index = cellval.indexOf(args.value) > -1;
                                    var lowerCaseVal = val.indexOf(args.value) > -1;
                                    if ((cellval === args.value) || ((cellval === args.value) || (index)) || (val === args.value) ||
                                        (lowerCaseVal)) {
                                        requiredCount++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return requiredCount;
    };
    WorkbookFindAndReplace.prototype.findAllValues = function (findAllArguments) {
        var startSheet = findAllArguments.sheetIndex;
        var sheet = this.parent.sheets[startSheet];
        var endRow = sheet.usedRange.rowIndex;
        var rowIndex = 0;
        var count = 0;
        var address;
        var endColumn = sheet.usedRange.colIndex;
        var columnIndex = 0;
        var sheetName;
        var sheetLength = this.parent.sheets.length;
        var initialSheet = findAllArguments.sheetIndex;
        for (rowIndex; rowIndex <= endRow + 1; rowIndex++) {
            if ((initialSheet !== 1) && (findAllArguments.sheetIndex === sheetLength)) {
                startSheet = 1;
            }
            if (rowIndex > endRow && columnIndex > endColumn) {
                if (findAllArguments.mode === 'Workbook') {
                    startSheet++;
                    if (initialSheet === startSheet) {
                        if (count === 0) {
                            return;
                        }
                        return;
                    }
                    if (startSheet > sheetLength - 1) {
                        startSheet = 0;
                    }
                    sheet = this.parent.sheets[startSheet];
                    if (sheet) {
                        rowIndex = 0;
                        columnIndex = 0;
                        endColumn = sheet.usedRange.colIndex;
                        endRow = sheet.usedRange.rowIndex;
                        sheet = sheet;
                    }
                }
            }
            if (!isNullOrUndefined(sheet)) {
                if (sheet.rows[rowIndex]) {
                    var row = sheet.rows[rowIndex];
                    if (columnIndex === endColumn + 2) {
                        columnIndex = 0;
                    }
                    for (columnIndex; columnIndex <= endColumn + 1; columnIndex++) {
                        if (row) {
                            if (row.cells[columnIndex]) {
                                var cell = sheet.rows[rowIndex].cells[columnIndex];
                                if (cell) {
                                    var cellFormat = cell.format;
                                    var cellvalue = void 0;
                                    if (cellFormat) {
                                        var displayTxt = this.parent.getDisplayText(sheet.rows[rowIndex].
                                            cells[columnIndex]);
                                        cellvalue = displayTxt.toString();
                                    }
                                    else {
                                        cellvalue = cell.value.toString();
                                    }
                                    if (findAllArguments.isCSen && findAllArguments.isEMatch) {
                                        if (cellvalue === findAllArguments.value) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (findAllArguments.isCSen && !findAllArguments.isEMatch) {
                                        var index = cellvalue.indexOf(findAllArguments.value) > -1;
                                        if ((cellvalue === findAllArguments.value) || (index)) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (!findAllArguments.isCSen && findAllArguments.isEMatch) {
                                        var val = cellvalue.toString().toLowerCase();
                                        if (val === findAllArguments.value) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    }
                                    else if (!findAllArguments.isCSen && !findAllArguments.isEMatch) {
                                        var val = cellvalue.toString().toLowerCase();
                                        var index = cellvalue.indexOf(findAllArguments.value) > -1;
                                        if ((val === findAllArguments.value) || ((cellvalue === findAllArguments.value) || (index)) ||
                                            ((cellvalue === findAllArguments.value))) {
                                            address = sheet.name + '!' + getCellAddress(rowIndex, columnIndex);
                                            findAllArguments.findCollection.push(address);
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (count === 0) {
            return;
        }
        return;
    };
    /**
     * Gets the module name.
     * @returns string
     */
    WorkbookFindAndReplace.prototype.getModuleName = function () {
        return 'workbookfindAndReplace';
    };
    return WorkbookFindAndReplace;
}());
export { WorkbookFindAndReplace };
