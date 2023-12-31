import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getSheetIndex, getSheetNameFromAddress } from '../base/index';
/**
 * To get range indexes.
 */
export function getRangeIndexes(range) {
    var cellindexes;
    var indexes = [];
    range = range.indexOf('!') > -1 ? range.split('!')[1] : range;
    range = range.indexOf(':') === -1 ? range + ':' + range : range;
    range.split(':').forEach(function (address) {
        cellindexes = getCellIndexes(address);
        indexes.push(cellindexes[0]);
        indexes.push(cellindexes[1]);
    });
    return indexes;
}
/**
 * To get single cell indexes
 */
export function getCellIndexes(address) {
    return [parseInt(address.match(/\d+/)[0], 10) - 1, getColIndex(address.match(/[A-Z]+/i)[0])];
}
/**
 * To get column index from text.
 * @hidden
 */
export function getColIndex(text) {
    var colIdx = 0;
    text = text.split('').reverse().join('');
    for (var i = text.length - 1; i >= 0; i--) {
        colIdx += (text[i].charCodeAt(0) - 64) * (Math.pow(26, i));
    }
    return colIdx - 1;
}
/**
 * To get cell address from given row and column index.
 */
export function getCellAddress(sRow, sCol) {
    return getColumnHeaderText(sCol + 1) + (sRow + 1);
}
/**
 * To get range address from given range indexes.
 */
export function getRangeAddress(range) {
    return getCellAddress(range[0], range[1]) + ':' + (!isNullOrUndefined(range[2]) ?
        getCellAddress(range[2], range[3]) : getCellAddress(range[0], range[1]));
}
/**
 * To get column header cell text
 */
export function getColumnHeaderText(colIndex) {
    var alphabet = 'Z';
    if (colIndex / 26 > 1) {
        return getColumnHeaderText((colIndex % 26 === 0) ? (colIndex / 26 - 1) : Math.floor(colIndex / 26))
            + String.fromCharCode((colIndex % 26) === 0 ? alphabet.charCodeAt(0) : 64 + (colIndex % 26));
    }
    else {
        return String.fromCharCode(64 + (colIndex));
    }
}
/**
 * @hidden
 */
export function getIndexesFromAddress(address) {
    return getRangeIndexes(getRangeFromAddress(address));
}
/**
 * @hidden
 */
export function getRangeFromAddress(address) {
    return address.split('!')[1] || address;
}
/**
 * Get complete address for selected range
 * @hidden
 */
export function getAddressFromSelectedRange(sheet) {
    return sheet.name + '!' + sheet.selectedRange;
}
/**
 * @hidden
 */
export function getAddressInfo(context, address) {
    var sIdx;
    if (address.indexOf('!') > -1) {
        sIdx = getSheetIndex(context, getSheetNameFromAddress(address));
    }
    else {
        sIdx = context.activeSheetIndex;
    }
    return { sheetIndex: sIdx, indices: getIndexesFromAddress(address) };
}
/**
 * Given range will be swapped/arranged in increasing order.
 * @hidden
 */
export function getSwapRange(range) {
    var clonedRange = range.slice();
    if (range[0] > range[2]) {
        swap(clonedRange, 0, 2);
    }
    if (range[1] > range[3]) {
        swap(clonedRange, 1, 3);
    }
    return clonedRange;
}
/**
 * Interchange values in an array
 */
function swap(range, x, y) {
    var tmp = range[x];
    range[x] = range[y];
    range[y] = tmp;
}
/**
 * @hidden
 */
export function isSingleCell(range) {
    return range[0] === range[2] && range[1] === range[3];
}
