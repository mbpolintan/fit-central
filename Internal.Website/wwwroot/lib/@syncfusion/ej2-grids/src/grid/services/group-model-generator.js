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
import { Row } from '../models/row';
import { isNullOrUndefined, extend, setValue, isBlazor } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { getForeignData, getUid } from '../../grid/base/util';
/**
 * GroupModelGenerator is used to generate group caption rows and data rows.
 * @hidden
 */
var GroupModelGenerator = /** @class */ (function (_super) {
    __extends(GroupModelGenerator, _super);
    function GroupModelGenerator(parent) {
        var _this = _super.call(this, parent) || this;
        _this.rows = [];
        _this.index = 0;
        _this.parent = parent;
        _this.summaryModelGen = new GroupSummaryModelGenerator(parent);
        _this.captionModelGen = new CaptionSummaryModelGenerator(parent);
        return _this;
    }
    GroupModelGenerator.prototype.generateRows = function (data, args) {
        if (this.parent.groupSettings.columns.length === 0) {
            return _super.prototype.generateRows.call(this, data, args);
        }
        var isInfiniteScroll = this.parent.enableInfiniteScrolling && args.requestType === 'infiniteScroll';
        this.rows = [];
        this.index = this.parent.enableVirtualization || isInfiniteScroll ? args.startIndex : 0;
        for (var i = 0, len = data.length; i < len; i++) {
            this.getGroupedRecords(0, data[i], data.level, i, undefined, this.rows.length);
        }
        this.index = 0;
        if (this.parent.isCollapseStateEnabled()) {
            this.ensureRowVisibility();
        }
        return this.rows;
    };
    GroupModelGenerator.prototype.getGroupedRecords = function (index, data, raw, parentid, childId, tIndex, parentUid) {
        var _a;
        var isRenderCaption = this.parent.enableInfiniteScrolling && this.prevKey === data.key;
        var level = raw;
        if (isNullOrUndefined(data.items)) {
            if (isNullOrUndefined(data.GroupGuid)) {
                this.rows = this.rows.concat(this.generateDataRows(data, index, parentid, this.rows.length, parentUid));
            }
            else {
                for (var j = 0, len = data.length; j < len; j++) {
                    this.getGroupedRecords(index, data[j], data.level, parentid, index, this.rows.length, parentUid);
                }
            }
        }
        else {
            var captionRow = this.generateCaptionRow(data, index, parentid, childId, tIndex, parentUid);
            if (!isRenderCaption) {
                this.rows = this.rows.concat(captionRow);
            }
            if (data.items && data.items.length) {
                this.getGroupedRecords(index + 1, data.items, data.items.level, parentid, index + 1, this.rows.length, captionRow.uid);
            }
            if (this.parent.aggregates.length) {
                var rowCnt = this.rows.length;
                (_a = this.rows).push.apply(_a, this.summaryModelGen.generateRows(data, { level: level, parentUid: captionRow.uid }));
                for (var i = rowCnt - 1; i >= 0; i--) {
                    if (this.rows[i].isCaptionRow) {
                        this.rows[i].aggregatesCount = this.rows.length - rowCnt;
                    }
                    else if (!this.rows[i].isCaptionRow && !this.rows[i].isDataRow) {
                        break;
                    }
                }
            }
        }
        this.prevKey = data.key;
    };
    GroupModelGenerator.prototype.getCaptionRowCells = function (field, indent, data) {
        var cells = [];
        var visibles = [];
        var column = this.parent.getColumnByField(field);
        var indexes = this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization) {
            column = this.parent.columns.filter(function (c) { return c.field === field; })[0];
        }
        var groupedLen = this.parent.groupSettings.columns.length;
        var gObj = this.parent;
        if (!this.parent.enableColumnVirtualization || indexes.indexOf(indent) !== -1) {
            for (var i = 0; i < indent; i++) {
                cells.push(this.generateIndentCell());
            }
            cells.push(this.generateCell({}, null, CellType.Expand));
        }
        indent = this.parent.enableColumnVirtualization ? 1 :
            (this.parent.getVisibleColumns().length + groupedLen + (gObj.detailTemplate || gObj.childGrid ? 1 : 0) -
                indent + (this.parent.getVisibleColumns().length ? -1 : 0));
        //Captionsummary cells will be added here.    
        if (this.parent.aggregates.length && !this.captionModelGen.isEmpty()) {
            var captionCells = this.captionModelGen.generateRows(data)[0];
            extend(data, captionCells.data);
            var cIndex_1 = 0;
            captionCells.cells.some(function (cell, index) { cIndex_1 = index; return cell.visible && cell.isDataCell; });
            visibles = captionCells.cells.slice(cIndex_1).filter(function (cell) { return cell.visible; });
            if (captionCells.visible && visibles[0].column.field === this.parent.getVisibleColumns()[0].field) {
                visibles = visibles.slice(1);
            }
            if (this.parent.getVisibleColumns().length === 1) {
                visibles = [];
            }
            indent = indent - visibles.length;
        }
        var cols = (!this.parent.enableColumnVirtualization ? [column] : this.parent.getColumns());
        var wFlag = true;
        for (var j = 0; j < cols.length; j++) {
            var tmpFlag = wFlag && indexes.indexOf(indent) !== -1;
            if (tmpFlag) {
                wFlag = false;
            }
            var cellType = !this.parent.enableColumnVirtualization || tmpFlag ?
                CellType.GroupCaption : CellType.GroupCaptionEmpty;
            indent = this.parent.enableColumnVirtualization && cellType === CellType.GroupCaption ? indent + groupedLen : indent;
            if (gObj.isRowDragable()) {
                indent++;
            }
            cells.push(this.generateCell(column, null, cellType, indent));
        }
        cells.push.apply(cells, visibles);
        return cells;
    };
    GroupModelGenerator.prototype.generateCaptionRow = function (data, indent, parentID, childID, tIndex, parentUid) {
        var options = {};
        var tmp = [];
        var records = 'records';
        var col = this.parent.getColumnByField(data.field);
        options.data = extend({}, data);
        if (col) {
            options.data.field = data.field;
        }
        options.isDataRow = false;
        options.isExpand = !this.parent.isCollapseStateEnabled();
        options.parentGid = parentID;
        options.childGid = childID;
        options.tIndex = tIndex;
        options.isCaptionRow = true;
        options.parentUid = parentUid;
        options.gSummary = !isNullOrUndefined(data.items[records]) ? data.items[records].length : data.items.length;
        options.uid = isBlazor() && this.parent.isServerRendered ? this.parent.getRowUid('grid-row') : getUid('grid-row');
        var row = new Row(options);
        row.indent = indent;
        this.getForeignKeyData(row);
        row.cells = this.getCaptionRowCells(data.field, indent, row.data);
        return row;
    };
    GroupModelGenerator.prototype.getForeignKeyData = function (row) {
        var data = row.data;
        var col = this.parent.getColumnByField(data.field);
        if (col && col.isForeignColumn && col.isForeignColumn()) {
            var fkValue = (isNullOrUndefined(data.key) ? '' : col.valueAccessor(col.foreignKeyValue, getForeignData(col, {}, data.key)[0], col));
            setValue('foreignKey', fkValue, row.data);
        }
    };
    GroupModelGenerator.prototype.generateDataRows = function (data, indent, childID, tIndex, parentUid) {
        var rows = [];
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = data.length; i < len; i++, tIndex++) {
            rows[i] = this.generateRow(data[i], this.index, i ? undefined : 'e-firstchildrow', indent, childID, tIndex, parentUid);
            for (var j = 0; j < indent; j++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(indent) === -1) {
                    continue;
                }
                rows[i].cells.unshift(this.generateIndentCell());
            }
            this.index++;
        }
        return rows;
    };
    GroupModelGenerator.prototype.generateIndentCell = function () {
        return this.generateCell({}, null, CellType.Indent);
    };
    GroupModelGenerator.prototype.refreshRows = function (input) {
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0; i < input.length; i++) {
            if (input[i].isDataRow) {
                input[i].cells = this.generateCells(input[i]);
                for (var j = 0; j < input[i].indent; j++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(input[i].indent) === -1) {
                        continue;
                    }
                    input[i].cells.unshift(this.generateIndentCell());
                }
            }
            else {
                var cRow = this.generateCaptionRow(input[i].data, input[i].indent);
                input[i].cells = cRow.cells;
            }
        }
        return input;
    };
    GroupModelGenerator.prototype.ensureRowVisibility = function () {
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            if (!row.isCaptionRow) {
                continue;
            }
            for (var j = i + 1; j < this.rows.length; j++) {
                var childRow = this.rows[j];
                if (row.uid === childRow.parentUid) {
                    this.rows[j].visible = row.isExpand;
                }
            }
        }
    };
    return GroupModelGenerator;
}(RowModelGenerator));
export { GroupModelGenerator };
