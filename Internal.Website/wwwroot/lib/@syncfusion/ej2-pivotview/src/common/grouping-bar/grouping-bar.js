import { createElement, remove, Droppable, setStyleAttribute, removeClass } from '@syncfusion/ej2-base';
import { EventHandler, Touch, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, formatUnit } from '@syncfusion/ej2-base';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { AxisFields } from './axis-field-renderer';
/**
 * Module for GroupingBar rendering
 */
/** @hidden */
var GroupingBar = /** @class */ (function () {
    /** Constructor for GroupingBar module */
    function GroupingBar(parent) {
        this.parent = parent;
        this.parent.groupingBarModule = this;
        this.resColWidth = (this.parent.isAdaptive ? 180 : 249);
        this.addEventListener();
        this.parent.axisFieldModule = new AxisFields(this.parent);
        this.touchObj = new Touch(this.parent.element, {
            tapHold: this.tapHoldHandler.bind(this)
        });
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    GroupingBar.prototype.getModuleName = function () {
        return 'groupingbar';
    };
    /** @hidden */
    GroupingBar.prototype.renderLayout = function () {
        this.groupingTable = createElement('div', { className: cls.GROUPING_BAR_CLASS });
        this.leftAxisPanel = createElement('div', { className: cls.LEFT_AXIS_PANEL_CLASS });
        this.rightAxisPanel = createElement('div', { className: cls.RIGHT_AXIS_PANEL_CLASS });
        var rowAxisPanel = createElement('div', { className: cls.AXIS_ROW_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper' });
        var columnAxisPanel = createElement('div', {
            className: cls.AXIS_COLUMN_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        var valueAxisPanel = createElement('div', {
            className: cls.AXIS_VALUE_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        var filterAxisPanel = createElement('div', {
            className: cls.AXIS_FILTER_CLASS + ' ' + cls.AXIS_ICON_CLASS + 'wrapper'
        });
        this.rowPanel = createElement('div', { className: cls.GROUP_ROW_CLASS + ' ' + cls.ROW_AXIS_CLASS });
        this.columnPanel = createElement('div', { className: cls.GROUP_COLUMN_CLASS + ' ' + cls.COLUMN_AXIS_CLASS });
        this.valuePanel = createElement('div', { className: cls.GROUP_VALUE_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
        this.filterPanel = createElement('div', { className: cls.GROUP_FILTER_CLASS + ' ' + cls.FILTER_AXIS_CLASS });
        rowAxisPanel.appendChild(this.rowPanel);
        columnAxisPanel.appendChild(this.columnPanel);
        valueAxisPanel.appendChild(this.valuePanel);
        filterAxisPanel.appendChild(this.filterPanel);
        this.rowAxisPanel = rowAxisPanel;
        this.columnAxisPanel = columnAxisPanel;
        this.valueAxisPanel = valueAxisPanel;
        this.filterAxisPanel = filterAxisPanel;
        this.leftAxisPanel.appendChild(valueAxisPanel);
        this.leftAxisPanel.appendChild(rowAxisPanel);
        this.rightAxisPanel.appendChild(filterAxisPanel);
        this.rightAxisPanel.appendChild(columnAxisPanel);
        this.groupingTable.appendChild(this.leftAxisPanel);
        this.groupingTable.appendChild(this.rightAxisPanel);
        this.groupingTable.classList.add(cls.GRID_GROUPING_BAR_CLASS);
        this.groupingTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.add(cls.GROUP_PIVOT_ROW);
        var axisPanels = [this.rowPanel, this.columnPanel, this.valuePanel, this.filterPanel];
        for (var _i = 0, axisPanels_1 = axisPanels; _i < axisPanels_1.length; _i++) {
            var element = axisPanels_1[_i];
            if (this.parent.groupingBarSettings.allowDragAndDrop) {
                new Droppable(element, {});
            }
            this.unWireEvent(element);
            this.wireEvent(element);
        }
        if (this.parent.displayOption.view !== 'Table' && this.parent.groupingBarSettings.displayMode !== 'Table') {
            this.groupingChartTable = this.groupingTable.cloneNode(true);
            this.groupingChartTable.classList.add(cls.CHART_GROUPING_BAR_CLASS);
            this.groupingChartTable.classList.remove(cls.GRID_GROUPING_BAR_CLASS);
            this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.add(cls.GROUP_CHART_ROW);
            this.groupingChartTable.querySelector('.' + cls.GROUP_ROW_CLASS).classList.remove(cls.GROUP_PIVOT_ROW);
            if (this.parent.chartSettings.enableMultiAxis && this.parent.chartSettings.chartSeries &&
                ['Pie', 'Pyramid', 'Doughnut', 'Funnel'].indexOf(this.parent.chartSettings.chartSeries.type) < 0) {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_MULTI_VALUE);
            }
            else {
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.add(cls.GROUP_CHART_VALUE);
                this.groupingChartTable.querySelector('.' + cls.GROUP_VALUE_CLASS).classList.remove(cls.DROPPABLE_CLASS);
            }
            if (this.parent.chartSettings.chartSeries &&
                ['Pie', 'Pyramid', 'Doughnut', 'Funnel'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) {
                this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.add(cls.GROUP_CHART_COLUMN);
                this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.remove(cls.DROPPABLE_CLASS);
            }
            else {
                this.groupingChartTable.querySelector('.' + cls.GROUP_COLUMN_CLASS).classList.add(cls.GROUP_CHART_ACCUMULATION_COLUMN);
            }
            this.groupingChartTable.querySelector('.' + cls.GROUP_FILTER_CLASS).classList.add(cls.GROUP_CHART_FILTER);
        }
        else {
            this.groupingChartTable = undefined;
        }
        if (this.parent.displayOption.view === 'Chart' || this.parent.groupingBarSettings.displayMode === 'Chart') {
            this.groupingTable = undefined;
        }
    };
    /* tslint:disable:max-func-body-length */
    GroupingBar.prototype.appendToElement = function () {
        if (this.parent.element.querySelector('.' + cls.GRID_CLASS) || this.parent.element.querySelector('.' + cls.PIVOTCHART)) {
            if (this.parent.showGroupingBar) {
                if (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                    /* tslint:disable-next-line:no-any */
                    for (var _i = 0, _a = this.parent.element.querySelectorAll('.' + cls.GROUPING_BAR_CLASS); _i < _a.length; _i++) {
                        var element = _a[_i];
                        remove(element);
                    }
                }
                if (this.groupingChartTable) {
                    if (this.parent.element.querySelector('#' + this.parent.element.id + '_chart')) {
                        setStyleAttribute(this.groupingChartTable, {
                            width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                        });
                        this.parent.element.insertBefore(this.groupingChartTable, this.parent.element.querySelector('#' + this.parent.element.id + '_chart'));
                    }
                    else {
                        this.groupingChartTable = undefined;
                    }
                }
                if (this.parent.displayOption.view !== 'Chart' && this.groupingTable) {
                    if (this.parent.isAdaptive) {
                        this.leftAxisPanel.style.minWidth = '180px';
                        this.valuePanel.style.minWidth = '180px';
                    }
                    if (this.parent.firstColWidth) {
                        this.leftAxisPanel.style.minWidth = 'auto';
                        this.valuePanel.style.minWidth = 'auto';
                    }
                    this.filterPanel.removeAttribute('style');
                    this.columnPanel.removeAttribute('style');
                    this.rowPanel.removeAttribute('style');
                    this.filterPanel.removeAttribute('style');
                    var emptyRowCount = void 0;
                    if (this.parent.dataType === 'olap') {
                        emptyRowCount = this.parent.olapEngineModule.headerContent ?
                            Object.keys(this.parent.olapEngineModule.headerContent).length : 0;
                    }
                    else {
                        emptyRowCount = this.parent.engineModule.headerContent ?
                            Object.keys(this.parent.engineModule.headerContent).length : 0;
                    }
                    if (!isNullOrUndefined(emptyRowCount)) {
                        var emptyHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
                        emptyHeader.removeAttribute('style');
                        addClass([emptyHeader.querySelector('.e-headercell')], 'e-group-row');
                        emptyHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
                        emptyHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv').style.display = 'none';
                        emptyHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv').style.display = 'none';
                    }
                    this.parent.element.insertBefore(this.groupingTable, this.parent.element.querySelector('.' + cls.GRID_CLASS));
                    setStyleAttribute(this.groupingTable, {
                        width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
                    });
                    this.groupingTable.style.minWidth = '400px';
                    this.parent.axisFieldModule.render();
                    this.setGridRowWidth();
                    var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
                    var rightAxisPanelWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
                    setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
                    setStyleAttribute(this.rightAxisPanel, { width: rightAxisPanelWidth });
                    var rightPanelHeight = (this.valuePanel.offsetHeight / 2);
                    if (rightPanelHeight > this.columnPanel.offsetHeight) {
                        setStyleAttribute(this.filterPanel, { height: formatUnit(rightPanelHeight) });
                        setStyleAttribute(this.columnPanel, { height: formatUnit(rightPanelHeight + 2) });
                    }
                    var topLeftHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
                    setStyleAttribute(this.rowPanel, {
                        height: topLeftHeight + 'px'
                    });
                    if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                        this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                            topLeftHeight + 'px';
                    }
                    var colRows = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
                    var columnRows = colRows.filter(function (trCell) {
                        return (trCell.childNodes.length > 0);
                    });
                    var colHeight = topLeftHeight / columnRows.length;
                    for (var _b = 0, columnRows_1 = columnRows; _b < columnRows_1.length; _b++) {
                        var element = columnRows_1[_b];
                        setStyleAttribute(element, { 'height': colHeight + 'px' });
                        var rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
                        for (var _c = 0, rowHeader_1 = rowHeader; _c < rowHeader_1.length; _c++) {
                            var rhElement = rowHeader_1[_c];
                            setStyleAttribute(rhElement, { 'height': colHeight + 'px' });
                        }
                    }
                }
                else {
                    this.parent.axisFieldModule.render();
                }
                if (this.parent.showToolbar && this.parent.displayOption.view === 'Both') {
                    if (this.parent.currentView === 'Table') {
                        this.parent.element.querySelector('.e-chart-grouping-bar').style.display = 'none';
                    }
                    else {
                        this.parent.element.querySelector('.e-pivot-grouping-bar').style.display = 'none';
                    }
                }
            }
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.refreshUI = function () {
        if (this.groupingChartTable) {
            setStyleAttribute(this.groupingChartTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
        }
        if (this.groupingTable) {
            setStyleAttribute(this.groupingTable, {
                width: formatUnit(this.parent.grid ? this.parent.getGridWidthAsNumber() : this.parent.getWidthAsNumber())
            });
            this.groupingTable.style.minWidth = '400px';
            var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
            var rightAxisWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
            setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
            setStyleAttribute(this.rightAxisPanel, { width: rightAxisWidth });
            if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(this.alignIcon.bind(this));
            }
            if (!this.parent.grid.element.querySelector('.e-group-row')) {
                var emptyRowHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
                addClass([emptyRowHeader.querySelector('.e-headercell')], 'e-group-row');
                setStyleAttribute(this.rowPanel, {
                    height: this.parent.element.querySelector('.e-headercontent').offsetHeight + 'px'
                });
                emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv'), {
                    display: 'none'
                });
                setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv'), {
                    display: 'none'
                });
                var groupHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
                setStyleAttribute(this.rowPanel, {
                    height: groupHeight + 'px'
                });
                if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                    this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                        groupHeight + 'px';
                }
                var colRowElements = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
                var columnRows = colRowElements.filter(function (trCell) {
                    return (trCell.childNodes.length > 0);
                });
                var colHeight = groupHeight / columnRows.length;
                for (var _i = 0, columnRows_2 = columnRows; _i < columnRows_2.length; _i++) {
                    var element = columnRows_2[_i];
                    setStyleAttribute(element, { 'height': colHeight + 'px' });
                    var rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
                    for (var _a = 0, rowHeader_2 = rowHeader; _a < rowHeader_2.length; _a++) {
                        var handlerElement = rowHeader_2[_a];
                        setStyleAttribute(handlerElement, { 'height': colHeight + 'px' });
                    }
                }
            }
        }
    };
    /** @hidden */
    GroupingBar.prototype.alignIcon = function () {
        var element = this.parent.pivotFieldListModule.element;
        var currentWidth;
        if (this.parent.currentView === 'Table') {
            currentWidth = this.parent.grid ? this.parent.grid.element.offsetWidth : currentWidth;
        }
        else {
            currentWidth = this.parent.chart ? this.parent.chartModule.calculatedWidth : currentWidth;
        }
        if (currentWidth) {
            var actWidth = currentWidth < 400 ? 400 : currentWidth;
            setStyleAttribute(element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS), {
                left: formatUnit(this.parent.enableRtl ?
                    -Math.abs((actWidth) -
                        element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).offsetWidth) :
                    (actWidth) -
                        element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS).offsetWidth)
            });
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.setGridRowWidth = function () {
        var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        if (this.rowPanel.querySelector('.' + cls.PIVOT_BUTTON_CLASS)) {
            if (!this.parent.isAdaptive) {
                var pivotButtons = [].slice.call(this.rowPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_WRAPPER_CLASS));
                var lastButton = pivotButtons[pivotButtons.length - 1];
                var lastButtonWidth = (lastButton.querySelector('.' + cls.PIVOT_BUTTON_CLASS).offsetWidth +
                    lastButton.querySelector('.e-indent-div').offsetWidth + 20);
                var buttonWidth = formatUnit(lastButtonWidth < this.resColWidth ? this.resColWidth : lastButtonWidth);
                var rowHeaderTable = this.parent.element.querySelector('.e-frozenheader').querySelector('table');
                var rowContentTable = this.parent.element.querySelector('.e-frozencontent').querySelector('table');
                var rowContent = this.parent.element.querySelector('.e-frozencontent').querySelector('colgroup').children[0];
                var colwidth = parseInt(buttonWidth, 10);
                var gridColumn = this.parent.grid.columns;
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = (gridColumn[0].width >= this.resColWidth ?
                        (colwidth > this.resColWidth ? colwidth : this.resColWidth) :
                        (colwidth > this.resColWidth ? colwidth : this.resColWidth));
                }
                var valueColWidth = void 0;
                if (this.parent.dataType === 'olap') {
                    valueColWidth = this.parent.renderModule.calculateColWidth(this.parent.olapEngineModule.pivotValues.length > 0 ?
                        this.parent.olapEngineModule.pivotValues[0].length : 2);
                }
                else {
                    valueColWidth = this.parent.renderModule.calculateColWidth((this.parent.dataSourceSettings.values.length > 0 &&
                        this.parent.engineModule.pivotValues.length > 0) ?
                        this.parent.engineModule.pivotValues[0].length : 2);
                }
                for (var cCnt = 0; cCnt < gridColumn.length; cCnt++) {
                    if (cCnt !== 0) {
                        if (gridColumn[cCnt].columns) {
                            this.setColWidth(gridColumn[cCnt].columns, valueColWidth);
                        }
                        else {
                            if (gridColumn[cCnt].width !== 'auto') {
                                /* tslint:disable:no-any */
                                var levelName = gridColumn[cCnt].customAttributes ?
                                    gridColumn[cCnt].customAttributes.cell.valueSort.levelName : '';
                                gridColumn[cCnt].width = this.parent.renderModule.setSavedWidth(levelName, valueColWidth);
                                /* tslint:enable:no-any */
                            }
                            else {
                                gridColumn[cCnt].minWidth = valueColWidth;
                            }
                        }
                    }
                }
                this.parent.posCount = 0;
                this.parent.setGridColumns(this.parent.grid.columns);
                this.parent.grid.headerModule.refreshUI();
                if (!this.parent.firstColWidth) {
                    colGroupElement.style.width = buttonWidth;
                    rowContent.style.width = buttonWidth;
                    rowHeaderTable.style.width = buttonWidth;
                    rowContentTable.style.width = buttonWidth;
                    setStyleAttribute(rowHeaderTable, { 'width': buttonWidth });
                    setStyleAttribute(rowContentTable, { 'width': buttonWidth });
                }
            }
            else {
                if (!this.parent.firstColWidth) {
                    var gridColumn = this.parent.grid.columns;
                    if (gridColumn && gridColumn.length > 0) {
                        gridColumn[0].width = this.resColWidth;
                    }
                    this.parent.posCount = 0;
                    this.parent.grid.headerModule.refreshUI();
                }
            }
        }
        else {
            if (this.parent.grid.columns && this.parent.grid.columns.length > 0) {
                this.parent.grid.columns[0].width = this.parent.grid.columns[0].width > this.resColWidth ?
                    this.parent.grid.columns[0].width : this.resColWidth;
            }
            this.parent.grid.headerModule.refreshUI();
        }
        if (this.groupingTable) {
            this.refreshUI();
        }
    };
    GroupingBar.prototype.setColWidth = function (columns, width) {
        for (var cCnt = 0; cCnt < columns.length; cCnt++) {
            if (columns[cCnt].columns) {
                this.setColWidth(columns[cCnt].columns, width);
            }
            else {
                if (columns[cCnt].width != "auto") {
                    columns[cCnt].width = width;
                }
                else {
                    columns[cCnt].minWidth = width;
                }
            }
        }
    };
    GroupingBar.prototype.wireEvent = function (element) {
        EventHandler.add(element, 'mouseover', this.dropIndicatorUpdate, this);
        EventHandler.add(element, 'mouseleave', this.dropIndicatorUpdate, this);
    };
    GroupingBar.prototype.unWireEvent = function (element) {
        EventHandler.remove(element, 'mouseover', this.dropIndicatorUpdate);
        EventHandler.remove(element, 'mouseleave', this.dropIndicatorUpdate);
    };
    GroupingBar.prototype.dropIndicatorUpdate = function (e) {
        if ((this.parent.isDragging && e.target.classList.contains(cls.DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS + '-last')), cls.INDICATOR_HOVER_CLASS);
        }
    };
    GroupingBar.prototype.tapHoldHandler = function (e) {
        var target = closest(e.originalEvent.target, '.' + cls.PIVOT_BUTTON_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            var pos = target.getBoundingClientRect();
            this.parent.contextMenuModule.fieldElement = target;
            this.parent.contextMenuModule.menuObj.open(pos.top, pos.left);
            return;
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.addEventListener = function () {
        this.handlers = {
            load: this.renderLayout,
            end: this.appendToElement,
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initSubComponent, this.handlers.load, this); //For initial rendering
        this.parent.on(events.uiUpdate, this.handlers.end, this);
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.uiUpdate, this.handlers.end);
        this.parent.off(events.initSubComponent, this.handlers.load);
    };
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    GroupingBar.prototype.destroy = function () {
        this.removeEventListener();
        if (this.parent.pivotButtonModule) {
            this.parent.pivotButtonModule.destroy();
        }
        if (this.touchObj && !this.touchObj.isDestroyed) {
            this.touchObj.destroy();
        }
        if (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            remove(this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS));
        }
    };
    return GroupingBar;
}());
export { GroupingBar };
