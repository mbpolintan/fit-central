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
import { remove, extend } from '@syncfusion/ej2-base';
import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { VirtualContentRenderer, VirtualHeaderRenderer } from './virtual-content-renderer';
import { FreezeRowModelGenerator } from '../services/freeze-row-model-generator';
import * as events from '../base/constant';
/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen table
 * @hidden
 */
var VirtualFreezeRenderer = /** @class */ (function (_super) {
    __extends(VirtualFreezeRenderer, _super);
    function VirtualFreezeRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.frzeeLoad = 1;
        _this.serviceLoc = locator;
        return _this;
    }
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.renderTable = function () {
        this.freezeRowGenerator = new FreezeRowModelGenerator(this.parent);
        this.virtualRenderer = new VirtualContentRenderer(this.parent, this.serviceLoc);
        this.virtualRenderer.setPanel(this.parent.getContent());
        this.virtualRenderer.renderTable();
        var virtualTable = this.parent.getContent().querySelector('.e-virtualtable');
        var virtualTrack = this.parent.getContent().querySelector('.e-virtualtrack');
        virtualTrack.style.position = '';
        this.getFrozenContent().appendChild(virtualTable);
        this.getFrozenContent().appendChild(virtualTrack);
        var mTbl = virtualTable.cloneNode(true);
        var mTblT = virtualTrack.cloneNode(true);
        this.getMovableContent().appendChild(mTbl);
        this.getMovableContent().appendChild(mTblT);
        remove(this.getMovableContent().querySelector('colgroup'));
        var colGroup = this.parent.getMovableVirtualHeader().querySelector('colgroup')
            .cloneNode(true);
        mTbl.firstElementChild.insertBefore(colGroup, mTbl.firstElementChild.querySelector('tbody'));
        this.setTable(this.parent.element.querySelector('.e-frozencontent').querySelector('.e-table'));
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.appendContent = function (target, newChild, e) {
        this.virtualRenderer.appendContent(target, newChild, e);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.generateRows = function (data, notifyArgs) {
        var virtualRows = this.virtualRenderer.vgenerator.generateRows(data, notifyArgs);
        var arr = [];
        arr = virtualRows.map(function (row) { return extend({}, row); });
        if (!this.firstPageRecords) {
            this.firstPageRecords = data;
        }
        var rows = this.freezeRowGenerator.generateRows(data, notifyArgs, arr);
        return rows;
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRowByIndex = function (index) {
        return this.virtualRenderer.getRowByIndex(index);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getMovableRowByIndex = function (index) {
        return this.virtualRenderer.getMovableVirtualRowByIndex(index);
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getMovableRows = function () {
        return this.virtualRenderer.vgenerator.getRows();
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRows = function () {
        return this.getMovableRows();
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getColGroup = function () {
        var mCol = this.parent.getMovableVirtualContent().querySelector('colgroup');
        var fCol = this.parent.getFrozenVirtualContent().querySelector('colgroup');
        var colGroup = this.isXaxis() ? mCol : fCol;
        return colGroup;
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getReorderedFrozenRows = function (args) {
        var rows;
        var bIndex = args.virtualInfo.blockIndexes;
        var colIndex = args.virtualInfo.columnIndexes;
        var page = args.virtualInfo.page;
        args.virtualInfo.blockIndexes = [1, 2];
        args.virtualInfo.page = 1;
        if (!args.renderMovableContent) {
            args.virtualInfo.columnIndexes = [];
        }
        var virtualRows = this.virtualRenderer.vgenerator.generateRows(this.firstPageRecords, args);
        rows = this.splitReorderedRows(virtualRows);
        args.virtualInfo.blockIndexes = bIndex;
        args.virtualInfo.columnIndexes = colIndex;
        args.virtualInfo.page = page;
        return rows.splice(0, this.parent.frozenRows);
    };
    VirtualFreezeRenderer.prototype.splitReorderedRows = function (rows) {
        var frzCols = this.parent.getFrozenColumns();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (this.frzeeLoad % 2 === 0) {
                rows[i].cells = rows[i].cells.slice(frzCols, rows[i].cells.length);
            }
            else {
                rows[i].isFreezeRow = true;
                rows[i].cells = rows[i].cells.slice(0, frzCols);
            }
        }
        this.frzeeLoad++;
        return rows;
    };
    VirtualFreezeRenderer.prototype.isXaxis = function () {
        var value = false;
        if (this.virtualRenderer) {
            value = this.virtualRenderer.requestType === 'virtualscroll'
                && this.virtualRenderer.currentInfo.sentinelInfo.axis === 'X';
        }
        return value;
    };
    VirtualFreezeRenderer.prototype.getHeaderCells = function () {
        var content = this.isXaxis() ? this.parent.getMovableVirtualHeader() : this.parent.getHeaderContent();
        return content ? [].slice.call(content.querySelectorAll('.e-headercell:not(.e-stackedheadercell)')) : [];
    };
    VirtualFreezeRenderer.prototype.getVirtualFreezeHeader = function () {
        var headerTable;
        if (this.isXaxis()) {
            headerTable = this.parent.getMovableVirtualHeader().querySelector('.e-table');
        }
        else {
            headerTable = this.parent.getFrozenVirtualHeader().querySelector('.e-table');
        }
        return headerTable;
    };
    VirtualFreezeRenderer.prototype.ensureFrozenCols = function (columns) {
        var frozenCols = this.parent.columns.slice(0, this.parent.getFrozenColumns());
        columns = frozenCols.concat(columns);
        return columns;
    };
    /**
     * @hidden
     */
    VirtualFreezeRenderer.prototype.getRowObjectByIndex = function (index) {
        return this.virtualRenderer.getRowObjectByIndex(index);
    };
    return VirtualFreezeRenderer;
}(FreezeContentRender));
export { VirtualFreezeRenderer };
var VirtualFreezeHdrRenderer = /** @class */ (function (_super) {
    __extends(VirtualFreezeHdrRenderer, _super);
    function VirtualFreezeHdrRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.serviceLoc = locator;
        return _this;
    }
    /**
     * @hidden
     */
    VirtualFreezeHdrRenderer.prototype.renderTable = function () {
        this.virtualHdrRenderer = new VirtualHeaderRenderer(this.parent, this.serviceLoc);
        this.virtualEle = this.virtualHdrRenderer.virtualEle;
        this.virtualHdrRenderer.setPanel(this.parent.getHeaderContent());
        this.virtualHdrRenderer.renderTable();
        this.rfhMovable();
        this.updateColgroup();
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.setTable(this.parent.element.querySelector('.e-frozenheader').querySelector('.e-table'));
        this.parent.notify(events.headerRefreshed, { rows: this.rows, args: { isFrozen: false } });
    };
    VirtualFreezeHdrRenderer.prototype.rfhMovable = function () {
        var fvTbl = this.parent.getHeaderContent().querySelector('.e-virtualtable');
        var fvTck = this.parent.getHeaderContent().querySelector('.e-virtualtrack');
        this.getFrozenHeader().appendChild(fvTbl);
        this.getFrozenHeader().appendChild(fvTck);
        this.virtualHdrRenderer.virtualEle.table = this.createTable();
        this.virtualHdrRenderer.virtualEle.renderWrapper();
        this.virtualHdrRenderer.virtualEle.renderPlaceHolder();
        var mvTbl = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-virtualtable'));
        var mvTck = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-virtualtrack'));
        this.getMovableHeader().appendChild(mvTbl[1]);
        this.getMovableHeader().appendChild(mvTck[1]);
    };
    /**
     * @hidden
     */
    VirtualFreezeHdrRenderer.prototype.getTable = function () {
        return this.virtualHdrRenderer.getTable();
    };
    return VirtualFreezeHdrRenderer;
}(FreezeRender));
export { VirtualFreezeHdrRenderer };
