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
import { isNullOrUndefined, getValue, closest } from '@syncfusion/ej2-base';
import { attributes } from '@syncfusion/ej2-base';
import { CellRenderer } from './cell-renderer';
import { Input } from '@syncfusion/ej2-inputs';
import { appendChildren } from '../base/util';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import * as events from '../base/constant';
/**
 * FilterCellRenderer class which responsible for building filter cell.
 * @hidden
 */
var FilterCellRenderer = /** @class */ (function (_super) {
    __extends(FilterCellRenderer, _super);
    function FilterCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = _this.parent.createElement('TH', { className: 'e-filterbarcell' });
        return _this;
    }
    /**
     * Function to return the wrapper for the TH content.
     * @returns string
     */
    FilterCellRenderer.prototype.getGui = function () {
        return this.parent.createElement('div');
    };
    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data
     */
    FilterCellRenderer.prototype.render = function (cell, data) {
        var tr = this.parent.element.querySelector('.e-filterbar');
        var node = this.element.cloneNode();
        var innerDIV = this.getGui();
        var input;
        var column = cell.column;
        tr.appendChild(node);
        node.setAttribute('e-mappinguid', column.uid);
        if (column.filterTemplate) {
            var fltrData = {};
            if (data) {
                fltrData[column.field] = data[column.field];
            }
            var col = 'column';
            fltrData[col] = column;
            if (column.visible) {
                var tempID = this.parent.element.id + column.uid + 'filterTemplate';
                var element = column.getFilterTemplate()(fltrData, this.parent, 'filterTemplate', tempID);
                appendChildren(node, element);
            }
            else {
                node.classList.add('e-hide');
            }
        }
        else {
            if (column.type !== 'checkbox') {
                if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                    node.classList.add('e-fltrtemp');
                    attributes(innerDIV, {
                        'class': 'e-fltrtempdiv'
                    });
                    if (isNullOrUndefined(column.filterBarTemplate.create)) {
                        input = this.parent.createElement('input', {
                            id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                            attrs: { type: 'search', title: column.headerText }
                        });
                        innerDIV.appendChild(input);
                    }
                    else {
                        var args = { column: column, node: Element };
                        var temp = column.filterBarTemplate.create;
                        if (typeof temp === 'string') {
                            temp = getValue(temp, window);
                        }
                        input = temp(args);
                        if (typeof input === 'string') {
                            var div = this.parent.createElement('div');
                            div.innerHTML = input;
                            input = div.firstChild;
                        }
                        attributes(innerDIV, {
                            class: 'e-filterUi_input e-filtertext e-fltrTemp',
                            title: column.headerText,
                            id: column.field + '_filterBarcell',
                        });
                        innerDIV.appendChild(input);
                    }
                }
                else {
                    attributes(innerDIV, {
                        'class': 'e-filterdiv e-fltrinputdiv'
                    });
                    input = this.parent.createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filtertext',
                        attrs: {
                            type: 'search', title: column.headerText + cell.attributes.title,
                            value: data[cell.column.field] ? data[cell.column.field] : '', role: 'search'
                        }
                    });
                    innerDIV.appendChild(input);
                    var args = {
                        element: input, floatLabelType: 'Never',
                        properties: {
                            enableRtl: this.parent.enableRtl, showClearButton: true
                        }
                    };
                    Input.createInput(args, this.parent.createElement);
                }
                //TODO: apply intial filtering
                if (column.allowFiltering === false || column.field === '' || isNullOrUndefined(column.field)) {
                    input.setAttribute('disabled', 'true');
                    input.classList.add('e-disable');
                }
                if (!column.visible) {
                    node.classList.add('e-hide');
                }
                this.appendHtml(node, innerDIV);
                // render's the dropdownlist component if showFilterBarOperator sets to true
                if (this.parent.filterSettings.showFilterBarOperator && this.parent.filterSettings.type === 'FilterBar'
                    && !this.parent.isPrinting && isNullOrUndefined(column.filterTemplate)) {
                    this.operatorIconRender(innerDIV, column, cell);
                }
                if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                    var templateWrite = column.filterBarTemplate.write;
                    var args = { element: input, column: column };
                    if (typeof templateWrite === 'string') {
                        templateWrite = getValue(templateWrite, window);
                    }
                    templateWrite.call(this, args);
                }
            }
        }
        return node;
    };
    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHTML
     * @returns Element
     */
    FilterCellRenderer.prototype.appendHtml = function (node, innerHtml) {
        node.appendChild(innerHtml);
        return node;
    };
    FilterCellRenderer.prototype.operatorIconRender = function (innerDIV, column, cell) {
        var gObj = this.parent;
        var fbicon = this.parent.createElement('input', {
            className: ' e-filterbaroperator e-icons e-icon-filter',
            id: cell.column.uid
        });
        innerDIV.querySelector('span').appendChild(fbicon);
        var operators = 'equal';
        if (!isNullOrUndefined(gObj.filterModule.operators[column.field])) {
            operators = gObj.filterModule.operators[column.field];
        }
        this.dropOptr = new DropDownList({
            fields: { text: 'text', value: 'value' },
            popupHeight: 'auto',
            value: operators,
            width: '0px',
            enabled: column.allowFiltering,
            popupWidth: 'auto',
            enableRtl: this.parent.enableRtl,
            change: this.internalEvent.bind(this),
            beforeOpen: function () {
                var operator = gObj.filterModule.customOperators;
                this.dataSource = operator[gObj.getColumnByUid(this.element.id).type + 'Operator'];
                for (var i = 0; i < this.dataSource.length; i++) {
                    if (column.filter && column.filter.operator && isNullOrUndefined(gObj.filterModule.operators[column.field]) &&
                        this.dataSource[i].value === column.filter.operator) {
                        this.value = column.filter.operator;
                    }
                }
            },
        });
        this.dropOptr.appendTo(fbicon);
        var spanElmt = closest(this.dropOptr.element, 'span');
        spanElmt.classList.add('e-filterbardropdown');
        spanElmt.removeAttribute('tabindex');
    };
    FilterCellRenderer.prototype.internalEvent = function (e) {
        var gObj = this.parent;
        var col = gObj.getColumnByUid(e.element.getAttribute('id'));
        e.column = col;
        gObj.filterModule.operators[col.field] = e.value;
        gObj.notify(events.getFilterBarOperator, e);
    };
    return FilterCellRenderer;
}(CellRenderer));
export { FilterCellRenderer };
