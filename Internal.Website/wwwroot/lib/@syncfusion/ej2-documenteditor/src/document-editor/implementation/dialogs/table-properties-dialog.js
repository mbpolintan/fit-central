import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Tab } from '@syncfusion/ej2-navigations';
import { classList } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
/**
 * The Table properties dialog is used to modify properties of selected table.
 */
var TablePropertiesDialog = /** @class */ (function () {
    /**
     * @private
     */
    function TablePropertiesDialog(documentHelper) {
        var _this = this;
        this.hasTableWidth = false;
        this.hasCellWidth = false;
        this.bidi = false;
        /**
         * @private
         */
        this.isTableBordersAndShadingUpdated = false;
        /**
         * @private
         */
        this.isCellBordersAndShadingUpdated = false;
        this.tabObj = undefined;
        this.localValue = undefined;
        /**
         * @private
         */
        this.isCellOptionsUpdated = false;
        /**
         * @private
         */
        this.isTableOptionsUpdated = false;
        this.onBeforeOpen = function () {
            _this.documentHelper.updateFocus();
            _this.loadTableProperties();
        };
        /**
         * @private
         */
        this.onCloseTablePropertyDialog = function () {
            _this.unWireEvent.bind(_this);
            _this.documentHelper.updateFocus();
        };
        /**
         * @private
         */
        this.applyTableProperties = function () {
            var selection = _this.documentHelper.selection;
            if (!_this.preferCheckBox.checked && !_this.preferCheckBox.indeterminate) {
                if (isNullOrUndefined(selection.tableFormat.preferredWidth) || selection.tableFormat.preferredWidth !== 0) {
                    _this.tableFormat.preferredWidth = 0;
                    _this.tableFormat.preferredWidthType = 'Point';
                }
            }
            if (_this.tableFormat.hasValue('tableAlignment') && _this.tableFormat.tableAlignment !== 'Left') {
                if (isNullOrUndefined(selection.tableFormat.leftIndent) || selection.tableFormat.leftIndent !== 0) {
                    _this.tableFormat.leftIndent = 0;
                }
            }
            if (!_this.rowHeightCheckBox.checked && !_this.rowHeightCheckBox.indeterminate) {
                if (isNullOrUndefined(selection.rowFormat.height) || selection.rowFormat.height !== 0) {
                    _this.rowFormat.heightType = 'AtLeast';
                    _this.rowFormat.height = 0;
                }
            }
            if (!_this.preferredCellWidthCheckBox.checked && !_this.preferredCellWidthCheckBox.indeterminate) {
                if (isNullOrUndefined(selection.cellFormat.preferredWidth) || selection.cellFormat.preferredWidth === 0) {
                    _this.cellFormat.preferredWidthType = 'Point';
                    _this.cellFormat.preferredWidth = 0;
                }
            }
            else {
                if (_this.cellFormat.preferredWidthType === 'Percent') {
                    if (!_this.tableFormat.hasValue('preferredWidth') && !_this.tableFormat.hasValue('preferredWidthType')
                        && _this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidth === 0) {
                        // tslint:disable-next-line:max-line-length
                        var containerWidth = _this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.getOwnerWidth(true);
                        var tableWidth = _this.documentHelper.selection.start.paragraph.associatedCell.ownerTable.getTableClientWidth(containerWidth);
                        _this.tableFormat.preferredWidthType = 'Percent';
                        // tslint:disable-next-line:max-line-length
                        _this.tableFormat.preferredWidth = tableWidth / HelperMethods.convertPixelToPoint(_this.documentHelper.owner.viewer.clientArea.width) * 100;
                    }
                }
            }
            if (_this.rowHeightValue) {
                _this.rowFormat.height = _this.rowHeightValue;
            }
            _this.documentHelper.owner.editorModule.initComplexHistory('TableProperties');
            _this.documentHelper.owner.editorModule.onTableFormat(_this.tableFormat);
            _this.documentHelper.owner.editorModule.onRowFormat(_this.rowFormat);
            _this.documentHelper.owner.editorModule.onCellFormat(_this.cellFormat);
            _this.documentHelper.owner.editorHistory.updateComplexHistory();
            _this.closeTablePropertiesDialog();
            _this.documentHelper.updateFocus();
        };
        /**
         * @private
         */
        this.applyTableSubProperties = function () {
            if (_this.isCellOptionsUpdated) {
                var cellFormat = _this.documentHelper.owner.cellOptionsDialogModule.cellFormat;
                _this.documentHelper.owner.cellOptionsDialogModule.applySubCellOptions(cellFormat);
            }
            if (_this.isTableOptionsUpdated) {
                var tableFormat = _this.documentHelper.owner.tableOptionsDialogModule.tableFormat;
                _this.documentHelper.owner.tableOptionsDialogModule.applySubTableOptions(tableFormat);
            }
            _this.isCellOptionsUpdated = false;
            _this.isTableOptionsUpdated = false;
        };
        /**
         * @private
         */
        this.unWireEvent = function () {
            //Table Format
            _this.preferCheckBox.change = undefined;
            _this.tableWidthBox.change = undefined;
            _this.tableWidthType.change = undefined;
            _this.leftIndentBox.change = undefined;
            //Row Format
            _this.rowHeightCheckBox.change = undefined;
            _this.rowHeightBox.change = undefined;
            _this.rowHeightType.change = undefined;
            _this.repeatHeader.change = undefined;
            _this.allowRowBreak.change = undefined;
            //Cell Format
            _this.preferredCellWidthCheckBox.change = undefined;
            _this.cellWidthBox.change = undefined;
            _this.cellWidthType.change = undefined;
            _this.cellFormat.destroy();
            _this.rowFormat.destroy();
            _this.tableFormat.destroy();
            _this.rowHeightValue = undefined;
            _this.documentHelper.dialog2.open = _this.documentHelper.selection.hideCaret.bind(_this.documentHelper.owner.viewer);
        };
        /**
         * @private
         */
        this.closeTablePropertiesDialog = function () {
            _this.documentHelper.dialog2.hide();
            _this.documentHelper.updateFocus();
        };
        this.changeBidirectional = function (event) {
            if (event.value === 'ltr') {
                _this.rtlButton.checked = !_this.ltrButton.checked;
                _this.tableFormat.bidi = false;
            }
            else {
                _this.ltrButton.checked = !_this.rtlButton.checked;
                _this.tableFormat.bidi = true;
            }
            if (_this.tableFormat.bidi && _this.tableFormat.tableAlignment === 'Left') {
                _this.tableFormat.tableAlignment = 'Right';
            }
            else if (!_this.tableFormat.bidi && _this.tableFormat.tableAlignment === 'Right') {
                _this.tableFormat.tableAlignment = 'Left';
            }
            _this.activeTableAlignment(_this.tableFormat, true);
        };
        /**
         * @private
         */
        this.changeTableCheckBox = function () {
            var enable = (_this.preferCheckBox.checked || _this.preferCheckBox.indeterminate);
            _this.tableWidthBox.enabled = enable;
            _this.tableWidthType.enabled = enable;
            if (enable) {
                _this.tableFormat.preferredWidthType = (_this.tableWidthType.value === 'Points') ?
                    'Point' : _this.tableWidthType.value;
            }
            else {
                _this.tableFormat.preferredWidthType = _this.documentHelper.selection.tableFormat.preferredWidthType;
            }
        };
        /**
         * @private
         */
        this.changeTableAlignment = function (event) {
            _this.updateClassForAlignmentProperties(_this.tableTab);
            var element = event.target;
            classList(element, ['e-de-table-alignment-active'], ['e-de-table-properties-alignment']);
            var bidi = _this.tableFormat.bidi || _this.rtlButton.checked;
            if ((element.classList.contains('e-de-table-left-alignment') && !bidi) ||
                (element.classList.contains('e-de-table-right-alignment') && bidi)) {
                _this.leftIndentBox.enabled = true;
            }
            else {
                _this.leftIndentBox.enabled = false;
            }
            _this.tableFormat.tableAlignment = _this.getTableAlignment();
        };
        /**
         * @private
         */
        this.changeTableRowCheckBox = function () {
            _this.rowHeightType.enabled = _this.rowHeightCheckBox.checked;
            _this.rowHeightBox.enabled = _this.rowHeightCheckBox.checked;
            if (_this.rowHeightType.enabled) {
                _this.rowFormat.heightType = _this.rowHeightType.value;
            }
            else {
                _this.rowFormat.heightType = _this.documentHelper.selection.rowFormat.heightType;
            }
        };
        /**
         * @private
         */
        this.changeTableCellCheckBox = function () {
            _this.cellWidthType.enabled = _this.preferredCellWidthCheckBox.checked;
            _this.cellWidthBox.enabled = _this.preferredCellWidthCheckBox.checked;
        };
        /**
         * @private
         */
        this.changeCellAlignment = function (event) {
            _this.updateClassForCellAlignment(_this.cellTab);
            var element = event.target;
            classList(element, ['e-de-table-alignment-active'], ['e-de-tablecell-alignment']);
            _this.cellFormat.verticalAlignment = _this.getCellAlignment();
        };
        //#endregion
        /**
         * @private
         */
        this.showTableOptionsDialog = function () {
            _this.documentHelper.owner.tableOptionsDialogModule.show();
            _this.documentHelper.dialog2.element.style.pointerEvents = 'none';
        };
        /**
         * @private
         */
        this.showBordersShadingsPropertiesDialog = function () {
            _this.documentHelper.owner.bordersAndShadingDialogModule.show();
            _this.documentHelper.dialog2.element.style.pointerEvents = 'none';
        };
        /**
         * @private
         */
        this.showCellOptionsDialog = function () {
            _this.documentHelper.owner.cellOptionsDialogModule.show();
            _this.documentHelper.dialog2.element.style.pointerEvents = 'none';
        };
        this.documentHelper = documentHelper;
    }
    Object.defineProperty(TablePropertiesDialog.prototype, "cellFormat", {
        /**
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.cellFormatIn)) {
                return this.cellFormatIn = new WCellFormat();
            }
            return this.cellFormatIn;
        },
        /**
         * @private
         */
        set: function (value) {
            this.cellFormatIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TablePropertiesDialog.prototype, "tableFormat", {
        /**
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.tableFormatIn)) {
                this.tableFormatIn = new WTableFormat();
                return this.tableFormatIn;
            }
            return this.tableFormatIn;
        },
        /**
         * @private
         */
        set: function (value) {
            this.tableFormatIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TablePropertiesDialog.prototype, "rowFormat", {
        /**
         * @private
         */
        get: function () {
            if (isNullOrUndefined(this.rowFormatInternal)) {
                this.rowFormatInternal = new WRowFormat();
                return this.rowFormatInternal;
            }
            return this.rowFormatInternal;
        },
        enumerable: true,
        configurable: true
    });
    TablePropertiesDialog.prototype.getModuleName = function () {
        return 'TablePropertiesDialog';
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.initTablePropertyDialog = function (localValue, isRtl) {
        this.localValue = localValue;
        var id = this.documentHelper.owner.containerId + '_TablePropertiesDialog';
        this.target = createElement('div', { id: id, className: 'e-de-table-properties-dlg' });
        var ejtabContainer = createElement('div', { id: this.target.id + '_TabContainer' });
        this.target.appendChild(ejtabContainer);
        this.tableTab = createElement('div', {
            id: this.target.id + '_TablePropertiesContentDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        this.rowTab = createElement('div', {
            id: this.target.id + '_RowPropertiesDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        this.cellTab = createElement('div', {
            id: this.target.id + '_CellPropertiesDialogTab', className: 'e-de-table-ppty-dlg-tabs'
        });
        var separatorLine = createElement('div', { className: 'e-de-table-dialog-separator-line' });
        // tslint:disable-next-line:max-line-length
        var ejtab = createElement('div', { id: this.target.id + '_TablePropertiesDialogTab', className: 'e-de-table-ppty-tab' });
        var headerContainer = createElement('div', { className: 'e-tab-header' });
        var tableHeader = createElement('div', {
            id: this.target.id + '_tableHeader', innerHTML: localValue.getConstant('Table')
        });
        var rowHeader = createElement('div', {
            id: this.target.id + '_rowHeader', innerHTML: localValue.getConstant('Row')
        });
        var cellHeader = createElement('div', {
            id: this.target.id + '_cellHeader', innerHTML: localValue.getConstant('Cell')
        });
        headerContainer.appendChild(tableHeader);
        headerContainer.appendChild(rowHeader);
        headerContainer.appendChild(cellHeader);
        var tableContent = createElement('div', { id: this.target.id + '_tableContent' });
        var rowContent = createElement('div', { id: this.target.id + '_rowContent' });
        var cellContent = createElement('div', { id: this.target.id + '_cellContent' });
        var items = [
            { header: { text: tableHeader }, content: tableContent },
            { header: { text: rowHeader }, content: rowContent },
            { header: { text: cellHeader }, content: cellContent }
        ];
        tableContent.appendChild(this.tableTab);
        rowContent.appendChild(this.rowTab);
        cellContent.appendChild(this.cellTab);
        ejtabContainer.appendChild(ejtab);
        this.initTableProperties(this.tableTab, localValue, this.documentHelper.owner.enableRtl);
        this.initTableRowProperties(this.rowTab, localValue, this.documentHelper.owner.enableRtl);
        this.initTableCellProperties(this.cellTab, localValue, this.documentHelper.owner.enableRtl);
        this.tabObj = new Tab({ items: items, enableRtl: isRtl }, ejtab);
        this.tabObj.isStringTemplate = true;
        this.target.appendChild(separatorLine);
        var alignMentButtons = this.tableTab.getElementsByClassName(this.tableTab.id + 'e-de-table-alignment');
        for (var i = 0; i < alignMentButtons.length; i++) {
            alignMentButtons[i].addEventListener('click', this.changeTableAlignment);
        }
        var cellAlignment = this.cellTab.getElementsByClassName(this.cellTab.id + 'e-de-table-cell-alignment');
        for (var i = 0; i < cellAlignment.length; i++) {
            cellAlignment[i].addEventListener('click', this.changeCellAlignment);
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.show = function () {
        var localValue = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        localValue.setLocale(this.documentHelper.owner.locale);
        if (!this.target) {
            this.initTablePropertyDialog(localValue, this.documentHelper.owner.enableRtl);
        }
        if (this.documentHelper.selection.caret.style.display !== 'none') {
            this.documentHelper.selection.caret.style.display = 'none';
        }
        this.documentHelper.dialog2.header = localValue.getConstant('Table Properties');
        this.documentHelper.dialog2.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog2.width = 'auto';
        this.documentHelper.dialog2.height = 'auto';
        this.documentHelper.dialog2.content = this.target;
        this.documentHelper.dialog2.beforeOpen = this.onBeforeOpen;
        this.documentHelper.dialog2.close = this.onCloseTablePropertyDialog;
        this.documentHelper.dialog2.open = this.wireEvent.bind(this);
        this.documentHelper.dialog2.buttons = [{
                click: this.applyTableProperties,
                buttonModel: { content: localValue.getConstant('Ok'), cssClass: 'e-flat e-table-ppty-okay', isPrimary: true }
            },
            {
                click: this.closeTablePropertiesDialog,
                buttonModel: { content: localValue.getConstant('Cancel'), cssClass: 'e-flat e-table-ppty-cancel' }
            }];
        //this.tabObj.select(0);
        this.documentHelper.dialog2.dataBind();
        this.documentHelper.dialog2.show();
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.calculateGridValue = function (table) {
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.documentHelper.selection.owner.isLayoutEnabled = true;
        this.documentHelper.layout.reLayoutTable(table);
        this.documentHelper.owner.editorModule.reLayout(this.documentHelper.selection);
        this.documentHelper.owner.editorModule.updateSelectionTextPosition(true);
        var history = this.documentHelper.owner.editorHistory;
        if (history && history.currentBaseHistoryInfo) {
            if (history.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                history.currentBaseHistoryInfo.updateSelection();
            }
            history.updateHistory();
        }
        this.documentHelper.owner.editorModule.fireContentChange();
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.loadTableProperties = function () {
        this.setTableProperties();
        this.setTableRowProperties();
        this.setTableCellProperties();
        if (!this.documentHelper.owner.bordersAndShadingDialogModule) {
            this.bordersAndShadingButton.disabled = true;
        }
        else {
            this.bordersAndShadingButton.disabled = false;
        }
        // if (!this.documentHelper.owner.tableOptionsDialogModule) {
        //     this.tableOptionButton.disabled = true;
        // } else {
        this.tableOptionButton.disabled = false;
        // }
        // if (!this.documentHelper.owner.cellOptionsDialogModule) {
        //     this.cellOptionButton.disabled = true;
        // } else {
        this.cellOptionButton.disabled = false;
        // }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.wireEvent = function () {
        this.documentHelper.selection.hideCaret();
        //Table Format
        this.preferCheckBox.change = this.changeTableCheckBox.bind(this);
        this.tableWidthBox.change = this.onTableWidthChange.bind(this);
        this.tableWidthType.change = this.onTableWidthTypeChange.bind(this);
        this.leftIndentBox.change = this.onLeftIndentChange.bind(this);
        //Row Format
        this.rowHeightCheckBox.change = this.changeTableRowCheckBox.bind(this);
        this.rowHeightBox.change = this.onRowHeightChange.bind(this);
        this.rowHeightType.change = this.onRowHeightTypeChange.bind(this);
        this.allowRowBreak.change = this.onAllowBreakAcrossPage.bind(this);
        this.repeatHeader.change = this.onRepeatHeader.bind(this);
        //Cell Format
        this.preferredCellWidthCheckBox.change = this.changeTableCellCheckBox.bind(this);
        this.cellWidthBox.change = this.onCellWidthChange.bind(this);
        this.cellWidthType.change = this.onCellWidthTypeChange.bind(this);
    };
    //#region Table Format
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    TablePropertiesDialog.prototype.initTableProperties = function (element, localValue, isRtl) {
        var container = createElement('div', { id: element.id + '_table_TabContainer' });
        var sizeHeader = createElement('div', {
            id: container.id + '_sizeLabel', innerHTML: localValue.getConstant('Size'),
            styles: 'width:100%;margin:0px;', className: 'e-de-table-dialog-options-label'
        });
        var parentContainer = createElement('div', { styles: 'display: inline-flex;' });
        var childContainer1 = createElement('div', {
            styles: 'float: left;',
            className: 'e-de-table-container-div'
        });
        var childContainer2 = createElement('div', {
            className: 'e-de-table-ppty-dlg-preferred-width-div'
        });
        var child1 = createElement('div', {
            styles: 'display: inline;',
            className: 'e-de-table-ppty-dlg-measure-div'
        });
        var child2 = createElement('div', {
            styles: 'display: inline;position: absolute;',
            className: 'e-de-table-ppty-dlg-measure-drop-down-div'
        });
        var childContainer3 = createElement('div');
        var preferCheckBox = createElement('input', {
            id: element.id + '_Prefer_Width_CheckBox', attrs: { 'type': 'checkbox' }
        });
        this.preferredWidth = createElement('input', { id: element.id + 'preferred_Width' });
        var controlDiv = createElement('div');
        var tableWidthType = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('Points') +
                '</option><option>' + localValue.getConstant('Percent') + '</option>', id: element.id + '_width_dropdown'
        });
        var labeltext = createElement('label', {
            innerHTML: localValue.getConstant('Measure in'), styles: 'width: 60px;font-size: 11px; font-weight: normal;'
        });
        var alignmentHeader = createElement('div', {
            innerHTML: localValue.getConstant('Alignment'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;'
        });
        var alignmentContainer = createElement('div', { styles: 'height:85px;display:inline-flex' });
        var classDivName = element.id + 'e-de-table-alignment';
        var leftAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        this.left = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment e-de-table-left-alignment ' + classDivName,
            id: element.id + '_left_alignment', styles: 'width:54px;height:54px;margin:2px'
        });
        leftAlignDiv.appendChild(this.left);
        var centerAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        this.center = createElement('div', {
            className: 'e-icons e-de-table-properties-alignment  e-de-table-center-alignment ' + classDivName,
            id: element.id + '_center_alignment', styles: 'width:54px;height:54px;margin:2px'
        });
        centerAlignDiv.appendChild(this.center);
        this.right = createElement('div', {
            styles: 'width:54px;height:54px;margin:2px', id: element.id + '_right_alignment',
            className: 'e-icons e-de-table-properties-alignment  e-de-table-right-alignment ' + classDivName
        });
        var rightAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        rightAlignDiv.appendChild(this.right);
        var leftlabel = createElement('label', {
            innerHTML: localValue.getConstant('Left'), className: 'e-de-table-dia-align-label'
        });
        var centerlabel = createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        });
        var rightlabel = createElement('label', {
            innerHTML: localValue.getConstant('Right'), className: 'e-de-table-dia-align-label'
        });
        var leftIndenetContainer = createElement('div', {
            className: 'e-de-table-ppty-dlg-left-indent-container'
        });
        var leftIndentLabelMargin;
        var leftIndentBoxMargin;
        if (isRtl) {
            leftIndentLabelMargin = 'left: 45px;';
            leftIndentBoxMargin = 'left: 45px;';
        }
        else {
            leftIndentLabelMargin = 'right: 45px;';
            leftIndentBoxMargin = 'right: 45px;';
        }
        this.indentingLabel = createElement('label', {
            innerHTML: localValue.getConstant('Indent from left'),
            // tslint:disable-next-line:max-line-length
            styles: 'font-weight: normal;font-size: 11px;position:relative;display:block;margin-bottom:18px;top:10px;' + leftIndentLabelMargin
        });
        var leftIndentBox = createElement('div', {
            styles: 'margin-top: 15px;position: relative;' + leftIndentBoxMargin
        });
        this.leftIndent = createElement('input', { id: element.id + '_left_indent' });
        var tableDirHeader = createElement('div', {
            innerHTML: localValue.getConstant('Table direction'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;margin: 0px;padding-top:14px;'
        });
        var tableDirContainer = createElement('div', { styles: 'display:flex' });
        var rtlDiv = createElement('div', { id: element.id + '_TableDirDiv', className: 'e-de-tbl-rtl-btn-div' });
        var rtlInputELe = createElement('input', { id: element.id + '_rtlEle' });
        rtlDiv.appendChild(rtlInputELe);
        tableDirContainer.appendChild(rtlDiv);
        var ltrDiv = createElement('div', { id: element.id + '_DirDiv', className: 'e-de-tbl-ltr-btn-div' });
        var ltrInputELe = createElement('input', { id: element.id + '_ltrEle' });
        ltrDiv.appendChild(ltrInputELe);
        tableDirContainer.appendChild(ltrDiv);
        this.rtlButton = new RadioButton({
            label: localValue.getConstant('Right-to-left'),
            value: 'rtl', cssClass: 'e-small', change: this.changeBidirectional,
            enableRtl: isRtl
        });
        this.rtlButton.appendTo(rtlInputELe);
        this.ltrButton = new RadioButton({
            label: localValue.getConstant('Left-to-right'),
            value: 'ltr', cssClass: 'e-small', change: this.changeBidirectional,
            enableRtl: isRtl
        });
        this.ltrButton.appendTo(ltrInputELe);
        var tableOptionContiner = createElement('div', {
            className: 'e-de-tbl-dlg-border-btn'
        });
        if (isRtl) {
            tableOptionContiner.style.cssFloat = 'left';
        }
        this.bordersAndShadingButton = createElement('button', {
            innerHTML: localValue.getConstant('Borders and Shading') + '...',
            id: element.id + '_borders_and_shadings', className: 'e-control e-btn e-flat e-de-ok-button',
            attrs: { type: 'button' }
        });
        this.tableOptionButton = createElement('button', {
            className: 'e-control e-btn e-flat', innerHTML: localValue.getConstant('Options') + '...',
            id: element.id + '_table_cellmargin', attrs: { type: 'button' }
        });
        this.tableOptionButton.addEventListener('click', this.showTableOptionsDialog);
        this.bordersAndShadingButton.addEventListener('click', this.showBordersShadingsPropertiesDialog);
        tableOptionContiner.appendChild(this.bordersAndShadingButton);
        tableOptionContiner.appendChild(this.tableOptionButton);
        leftIndenetContainer.appendChild(this.indentingLabel);
        leftIndentBox.appendChild(this.leftIndent);
        leftIndenetContainer.appendChild(leftIndentBox);
        alignmentContainer.appendChild(leftAlignDiv);
        alignmentContainer.appendChild(centerAlignDiv);
        alignmentContainer.appendChild(rightAlignDiv);
        leftAlignDiv.appendChild(leftlabel);
        centerAlignDiv.appendChild(centerlabel);
        rightAlignDiv.appendChild(rightlabel);
        alignmentContainer.appendChild(leftIndenetContainer);
        container.appendChild(sizeHeader);
        element.appendChild(container);
        childContainer1.appendChild(preferCheckBox);
        parentContainer.appendChild(childContainer1);
        childContainer2.appendChild(this.preferredWidth);
        parentContainer.appendChild(childContainer2);
        controlDiv.appendChild(tableWidthType);
        child1.appendChild(labeltext);
        child2.appendChild(controlDiv);
        childContainer3.appendChild(child1);
        childContainer3.appendChild(child2);
        parentContainer.appendChild(childContainer3);
        element.appendChild(parentContainer);
        element.appendChild(alignmentHeader);
        element.appendChild(alignmentContainer);
        element.appendChild(tableDirHeader);
        element.appendChild(tableDirContainer);
        element.appendChild(tableOptionContiner);
        this.tableWidthBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.tableWidthBox.appendTo(this.preferredWidth);
        this.leftIndentBox = new NumericTextBox({
            value: 0, decimals: 2, min: -1584, max: 1584, width: 140, enablePersistence: false
        });
        this.leftIndentBox.appendTo(this.leftIndent);
        this.preferCheckBox = new CheckBox({
            label: localValue.getConstant('Preferred Width'), enableRtl: isRtl
        });
        this.preferCheckBox.appendTo(preferCheckBox);
        this.tableWidthType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.tableWidthType.appendTo(tableWidthType);
        if (isRtl) {
            rtlDiv.classList.add('e-de-rtl');
            childContainer2.classList.add('e-de-rtl');
            child1.classList.add('e-de-rtl');
            child2.classList.add('e-de-rtl');
            leftIndenetContainer.classList.add('e-de-rtl');
            tableOptionContiner.classList.add('e-de-rtl');
            this.bordersAndShadingButton.classList.add('e-de-rtl');
            leftAlignDiv.classList.add('e-de-rtl');
            centerAlignDiv.classList.add('e-de-rtl');
            rightAlignDiv.classList.add('e-de-rtl');
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onTableWidthChange = function () {
        this.tableFormat.preferredWidth = this.tableWidthBox.value;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onTableWidthTypeChange = function () {
        var value;
        var table = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
        var width = HelperMethods.convertPixelToPoint(this.documentHelper.owner.viewer.clientArea.width);
        if (this.tableWidthType.text === 'Percent' && this.documentHelper.selection.tableFormat.preferredWidthType !== 'Percent') {
            value = this.tableWidthBox.value / width * 100;
            this.formatNumericTextBox(this.tableWidthBox, 'Percent', value);
        }
        else if (this.tableWidthType.text === 'Points' && this.documentHelper.selection.tableFormat.preferredWidthType !== 'Point') {
            value = width / 100 * this.tableWidthBox.value;
            this.formatNumericTextBox(this.tableWidthBox, 'Point', value);
        }
        else {
            if (this.tableWidthBox.format === '#\'\%\'') {
                if (this.tableWidthType.text === 'Points') {
                    value = width / 100 * this.tableWidthBox.value;
                }
                else {
                    value = this.tableWidthBox.value;
                }
            }
            else {
                if (this.tableWidthType.text === 'Percent') {
                    value = this.tableWidthBox.value / width * 100;
                }
                else {
                    value = this.tableWidthBox.value;
                }
            }
            // tslint:disable-next-line:max-line-length
            this.formatNumericTextBox(this.tableWidthBox, (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text, value);
        }
        this.tableFormat.preferredWidthType = (this.tableWidthType.text === 'Points') ? 'Point' : this.tableWidthType.text;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onLeftIndentChange = function () {
        this.tableFormat.leftIndent = this.leftIndentBox.value;
    };
    TablePropertiesDialog.prototype.setTableProperties = function () {
        //instance of Table Property values
        var tableFormat = this.documentHelper.selection.tableFormat;
        var tableHasWidth = tableFormat.preferredWidth > 0;
        var preferredWidth = tableFormat.preferredWidth;
        if (isNullOrUndefined(tableFormat.preferredWidth)) {
            this.preferCheckBox.indeterminate = true;
            var startTable = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
            var table = startTable.combineWidget(this.documentHelper.owner.viewer);
            preferredWidth = table.tableFormat.preferredWidth;
        }
        else {
            this.preferCheckBox.checked = tableHasWidth;
        }
        this.tableWidthBox.enabled = tableHasWidth;
        this.tableWidthType.enabled = tableHasWidth;
        this.formatNumericTextBox(this.tableWidthBox, tableFormat.preferredWidthType, preferredWidth);
        if (tableFormat.preferredWidthType === 'Auto' || tableFormat.preferredWidthType === 'Point') {
            this.tableWidthType.index = 0;
        }
        else {
            this.tableWidthType.index = 1;
        }
        this.activeTableAlignment(tableFormat, false);
        if (tableFormat.bidi) {
            this.rtlButton.checked = true;
            this.ltrButton.checked = false;
        }
        else {
            this.ltrButton.checked = true;
            this.rtlButton.checked = false;
        }
    };
    TablePropertiesDialog.prototype.activeTableAlignment = function (tableFormat, isChanged) {
        var tableAlignment = isChanged ? this.tableFormat.tableAlignment : undefined;
        // Consider the TableAlignment based on the Bidirectional property.
        if (isNullOrUndefined(tableAlignment)) {
            if (tableFormat.bidi) {
                if (tableFormat.tableAlignment === 'Left') {
                    tableAlignment = 'Right';
                }
                else if (tableFormat.tableAlignment === 'Right') {
                    tableAlignment = 'Left';
                }
            }
            else {
                tableAlignment = tableFormat.tableAlignment;
            }
        }
        if (tableFormat.bidi) {
            this.leftIndentBox.enabled = tableAlignment === 'Right';
            this.indentingLabel.innerHTML = this.localValue.getConstant('Indent from right');
        }
        else {
            this.leftIndentBox.enabled = tableAlignment === 'Left';
            this.indentingLabel.innerHTML = this.localValue.getConstant('Indent from left');
        }
        this.leftIndentBox.value = tableFormat.leftIndent;
        classList(this.left, [], ['e-de-table-alignment-active']);
        classList(this.right, [], ['e-de-table-alignment-active']);
        classList(this.center, [], ['e-de-table-alignment-active']);
        if (tableAlignment === 'Left') {
            this.left.classList.add('e-de-table-alignment-active');
        }
        else if (tableAlignment === 'Center') {
            this.center.classList.add('e-de-table-alignment-active');
        }
        else if (tableAlignment === 'Right') {
            this.right.classList.add('e-de-table-alignment-active');
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.getTableAlignment = function () {
        var id = this.tableTab.id;
        var groupButtons = this.tableTab.getElementsByClassName(id + 'e-de-table-alignment');
        for (var j = 0; j < groupButtons.length; j++) {
            var groupButton = groupButtons[j];
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                if (j === 0) {
                    return this.ltrButton.checked ? 'Left' : 'Right';
                }
                else if (j === 1) {
                    return 'Center';
                }
                else {
                    return this.ltrButton.checked ? 'Right' : 'Left';
                }
            }
        }
        return undefined;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.updateClassForAlignmentProperties = function (element) {
        var id = element.id;
        var groupButtons = element.getElementsByClassName(id + 'e-de-table-alignment');
        for (var j = 0; j < groupButtons.length; j++) {
            var groupButton = groupButtons[j];
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                classList(groupButton, ['e-de-table-properties-alignment'], ['e-de-table-alignment-active']);
            }
        }
    };
    //#endregion
    //#region Row Format
    /**
     * @private
     */
    TablePropertiesDialog.prototype.initTableRowProperties = function (element, localValue, isRtl) {
        var rowDiv = createElement('div', { styles: 'width: 100%;' });
        var sizeLabeldiv = createElement('div', {
            innerHTML: localValue.getConstant('Size'),
            styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label'
        });
        var parentDiv = createElement('div', { styles: 'display: inline-flex;width: 100%;' });
        var childDiv1Float;
        if (isRtl) {
            childDiv1Float = 'float: right;';
        }
        else {
            childDiv1Float = 'float: left;';
        }
        var childDiv1 = createElement('div', {
            className: 'e-de-table-header-div', styles: 'margin-top:6px'
        });
        var rowHeightCheckBox = createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_height_CheckBox'
        });
        var childdiv2 = createElement('div', {
            className: 'e-de-row-ht-top'
        });
        this.rowHeight = createElement('input', {
            attrs: { 'type': 'text' }, 'id': element.id + '_table_row_height'
        });
        var child2Float;
        if (isRtl) {
            child2Float = 'float: left;';
        }
        else {
            child2Float = 'float: right;';
        }
        var child2 = createElement('div', { className: 'e-de-ht-wdth-type' });
        var child3 = createElement('div');
        var child4 = createElement('div');
        var controlDiv = createElement('div');
        var rowHeightType = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('At least')
                + '</option><option>' + localValue.getConstant('Exactly') + '</option>',
            id: element.id + '_height_type'
        });
        // tslint:disable-next-line:max-line-length
        var labeltext = createElement('label', {
            innerHTML: localValue.getConstant('Row height is'), styles: 'font-size: 11px;font-weight: normal;width: 75px;display:block;margin-bottom:8px'
        });
        rowDiv.appendChild(sizeLabeldiv);
        element.appendChild(rowDiv);
        childDiv1.appendChild(rowHeightCheckBox);
        parentDiv.appendChild(childDiv1);
        childdiv2.appendChild(this.rowHeight);
        parentDiv.appendChild(childdiv2);
        controlDiv.appendChild(rowHeightType);
        child3.appendChild(labeltext);
        child4.appendChild(controlDiv);
        child2.appendChild(child3);
        child2.appendChild(child4);
        parentDiv.appendChild(child2);
        element.appendChild(parentDiv);
        var alignmentDiv = createElement('div', {
            innerHTML: localValue.getConstant('Options') + '...', styles: 'width: 100%;',
            className: 'e-de-table-dialog-options-label'
        });
        // tslint:disable-next-line:max-line-length
        var allowRowContainer = createElement('div', { className: 'e-de-table-ppty-options-break' });
        var repeatHeaderContaniner = createElement('div', { className: 'e-de-table-ppty-options-header-row' });
        var allowRowBreak = createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_allow_row_break'
        });
        var repeatHeader = createElement('input', {
            attrs: { 'type': 'checkbox' }, 'id': element.id + '_repeat_header'
        });
        allowRowContainer.appendChild(allowRowBreak);
        repeatHeaderContaniner.appendChild(repeatHeader);
        element.appendChild(alignmentDiv);
        element.appendChild(allowRowContainer);
        element.appendChild(repeatHeaderContaniner);
        this.rowHeightBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.rowHeightBox.appendTo(this.rowHeight);
        this.rowHeightCheckBox = new CheckBox({
            label: localValue.getConstant('Specify height'),
            enableRtl: isRtl
        });
        this.rowHeightCheckBox.appendTo(rowHeightCheckBox);
        this.rowHeightType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.rowHeightType.appendTo(rowHeightType);
        this.allowRowBreak = new CheckBox({
            label: localValue.getConstant('Allow row to break across pages'),
            enableRtl: isRtl
        });
        this.allowRowBreak.appendTo(allowRowBreak);
        this.repeatHeader = new CheckBox({
            label: localValue.getConstant('Repeat as header row at the top of each page'),
            enableRtl: isRtl
        });
        this.repeatHeader.appendTo(repeatHeader);
        if (isRtl) {
            child3.classList.add('e-de-rtl');
            child4.classList.add('e-de-rtl');
            childdiv2.classList.add('e-de-rtl');
        }
    };
    TablePropertiesDialog.prototype.setTableRowProperties = function () {
        var rowFormat = this.documentHelper.selection.rowFormat;
        var enableRowHeight = (rowFormat.height > 0 || rowFormat.heightType === 'Exactly');
        //instance of table row values
        if (enableRowHeight) {
            this.rowHeightCheckBox.checked = true;
        }
        else {
            if (rowFormat.heightType === undefined) {
                this.rowHeightCheckBox.indeterminate = true;
                enableRowHeight = true;
            }
            else {
                this.rowHeightCheckBox.checked = false;
            }
        }
        this.rowHeightBox.enabled = enableRowHeight;
        this.rowHeightType.enabled = enableRowHeight;
        var enabledHeader = this.enableRepeatHeader() ? false : true;
        if (isNullOrUndefined(this.documentHelper.selection.rowFormat.isHeader)) {
            this.repeatHeader.indeterminate = true;
            this.repeatHeader.disabled = true;
        }
        else if (this.documentHelper.selection.rowFormat.isHeader) {
            this.repeatHeader.checked = !enabledHeader;
            this.repeatHeader.indeterminate = enabledHeader;
            this.repeatHeader.disabled = enabledHeader;
        }
        else {
            this.repeatHeader.checked = false;
            this.repeatHeader.indeterminate = false;
            this.repeatHeader.disabled = enabledHeader;
        }
        if (isNullOrUndefined(rowFormat.allowBreakAcrossPages)) {
            this.allowRowBreak.indeterminate = true;
        }
        else {
            this.allowRowBreak.checked = rowFormat.allowBreakAcrossPages;
        }
        this.rowHeightBox.value = rowFormat.height;
        if (rowFormat.heightType === 'Auto' || rowFormat.heightType === 'AtLeast') {
            this.rowHeightType.index = 0;
        }
        else {
            this.rowHeightType.index = 1;
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onRowHeightChange = function () {
        this.rowHeightValue = this.rowHeightBox.value;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onRowHeightTypeChange = function () {
        this.rowFormat.heightType = this.rowHeightType.text;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onAllowBreakAcrossPage = function () {
        this.rowFormat.allowBreakAcrossPages = this.allowRowBreak.checked;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onRepeatHeader = function () {
        this.rowFormat.isHeader = this.repeatHeader.checked;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.enableRepeatHeader = function () {
        var selection = this.documentHelper.selection;
        var start = selection.start;
        var end = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        var startCell = start.paragraph.associatedCell;
        var endCell = end.paragraph.associatedCell;
        return startCell.ownerRow.index === 0 && endCell.ownerTable.equals(startCell.ownerTable);
    };
    //#endregion
    //#region Cell Format
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    TablePropertiesDialog.prototype.initTableCellProperties = function (element, localValue, isRtl) {
        var sizeDiv = createElement('div', { styles: 'width: 100%;' });
        var div = createElement('div', {
            innerHTML: localValue.getConstant('Size'), className: 'e-de-table-dialog-options-label',
            styles: 'width: 100%;',
        });
        var parentdiv = createElement('div', { styles: 'width: 100%;display: inline-flex;' });
        var childdiv1Float;
        if (isRtl) {
            childdiv1Float = 'float: right';
        }
        else {
            childdiv1Float = 'float: left';
        }
        var childdiv1 = createElement('div', {
            className: 'e-de-table-cell-header-div', styles: 'margin-top:9px'
        });
        var preferredCellWidthCheckBox = createElement('input', {
            attrs: { 'type': 'checkbox' }, id: element.id + '_Prefer_Width_CheckBox_cell'
        });
        var childdiv2 = createElement('div', {
            styles: 'padding:0px 20px',
        });
        this.preferredCellWidth = createElement('input', {
            id: element.id + 'tablecell_Width_textBox', attrs: { 'type': 'text' }
        });
        var child2Float;
        if (isRtl) {
            child2Float = 'float: left;';
        }
        else {
            child2Float = 'float: right;';
        }
        var child2 = createElement('div', {
            className: 'e-de-ht-wdth-type'
        });
        var child3 = createElement('div');
        var child4Float;
        if (isRtl) {
            child4Float = 'float: left;';
        }
        else {
            child4Float = 'float: right;';
        }
        var child4 = createElement('div');
        var controlDiv = createElement('div');
        var cellWidthType = createElement('select', {
            innerHTML: '<option>' + localValue.getConstant('Points') + '</option><option>' +
                localValue.getConstant('Percent') + '</option>', 'id': element.id + '_measure_type_cell'
        });
        var labeltext = createElement('label', {
            innerHTML: localValue.getConstant('Measure in'),
            styles: 'font-size: 11px;font-weight: normal;display:block;margin-bottom:8px'
        });
        sizeDiv.appendChild(div);
        element.appendChild(sizeDiv);
        childdiv1.appendChild(preferredCellWidthCheckBox);
        parentdiv.appendChild(childdiv1);
        childdiv2.appendChild(this.preferredCellWidth);
        parentdiv.appendChild(childdiv2);
        controlDiv.appendChild(cellWidthType);
        child3.appendChild(labeltext);
        child4.appendChild(controlDiv);
        child2.appendChild(child3);
        child2.appendChild(child4);
        parentdiv.appendChild(child2);
        element.appendChild(parentdiv);
        var alignmentDiv = createElement('div', {
            innerHTML: localValue.getConstant('Vertical alignment'),
            styles: 'width: 100%;margin: 0px;',
            className: 'e-de-table-dialog-options-label'
        });
        var classDivName = element.id + 'e-de-table-cell-alignment';
        var divAlignment = createElement('div', {
            styles: 'width: 100%;height: 100px;'
        });
        var divStyle = 'width:54px;height:54px;margin:2px;border-style:solid;border-width:1px';
        var topAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellTopAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_top-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-top-alignment ' + classDivName
        });
        topAlignDiv.appendChild(this.cellTopAlign);
        var centerAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellCenterAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_center-alignment',
            className: 'e-icons e-de-tablecell-alignment  e-de-tablecell-center-alignment ' + classDivName
        });
        centerAlignDiv.appendChild(this.cellCenterAlign);
        var bottomAlignDiv = createElement('div', { className: 'e-de-table-dia-align-div' });
        this.cellBottomAlign = createElement('div', {
            styles: divStyle, id: element.id + '_cell_bottom-alignment',
            className: 'e-icons e-de-tablecell-alignment e-de-tablecell-bottom-alignment  ' + classDivName
        });
        bottomAlignDiv.appendChild(this.cellBottomAlign);
        var topLabel = createElement('label', {
            innerHTML: localValue.getConstant('Top'), className: 'e-de-table-dia-align-label'
        });
        var centerLabel = createElement('label', {
            innerHTML: localValue.getConstant('Center'), className: 'e-de-table-dia-align-label'
        });
        var bottomLabel = createElement('label', {
            innerHTML: localValue.getConstant('Bottom'), className: 'e-de-table-dia-align-label'
        });
        this.cellOptionButton = createElement('button', {
            innerHTML: localValue.getConstant('Options') + '...', id: element.id + '_table_cellmargin',
            className: 'e-control e-btn e-flat', attrs: { type: 'button' }
        });
        this.cellOptionButton.style.cssFloat = isRtl ? 'left' : 'right';
        divAlignment.appendChild(topAlignDiv);
        divAlignment.appendChild(centerAlignDiv);
        divAlignment.appendChild(bottomAlignDiv);
        topAlignDiv.appendChild(topLabel);
        centerAlignDiv.appendChild(centerLabel);
        bottomAlignDiv.appendChild(bottomLabel);
        element.appendChild(alignmentDiv);
        element.appendChild(divAlignment);
        element.appendChild(this.cellOptionButton);
        this.cellOptionButton.addEventListener('click', this.showCellOptionsDialog);
        this.cellWidthBox = new NumericTextBox({
            value: 0, decimals: 2, min: 0, max: 1584, width: 120, enablePersistence: false
        });
        this.cellWidthBox.appendTo(this.preferredCellWidth);
        this.preferredCellWidthCheckBox = new CheckBox({ label: localValue.getConstant('Preferred Width'), enableRtl: isRtl });
        this.preferredCellWidthCheckBox.appendTo(preferredCellWidthCheckBox);
        this.cellWidthType = new DropDownList({ width: '120px', enableRtl: isRtl });
        this.cellWidthType.appendTo(cellWidthType);
        if (isRtl) {
            childdiv2.classList.add('e-de-rtl');
            child3.classList.add('e-de-rtl');
            child4.classList.add('e-de-rtl');
            this.cellOptionButton.classList.add('e-de-rtl');
            topAlignDiv.classList.add('e-de-rtl');
            centerAlignDiv.classList.add('e-de-rtl');
            bottomAlignDiv.classList.add('e-de-rtl');
        }
    };
    TablePropertiesDialog.prototype.setTableCellProperties = function () {
        var cellFormat = this.documentHelper.selection.cellFormat;
        //instance of table cell Values
        this.hasCellWidth = cellFormat.preferredWidth > 0;
        var preferredWidth = cellFormat.preferredWidth;
        if (isNullOrUndefined(cellFormat.preferredWidth)) {
            this.preferredCellWidthCheckBox.indeterminate = true;
            preferredWidth = this.documentHelper.selection.start.paragraph.associatedCell.cellFormat.preferredWidth;
        }
        else {
            this.preferredCellWidthCheckBox.checked = this.hasCellWidth;
        }
        this.cellWidthBox.enabled = this.hasCellWidth;
        this.cellWidthType.enabled = this.hasCellWidth;
        if (cellFormat.preferredWidthType === 'Auto' || cellFormat.preferredWidthType === 'Point') {
            this.cellWidthType.index = 0;
        }
        else {
            this.cellWidthType.index = 1;
        }
        this.formatNumericTextBox(this.cellWidthBox, cellFormat.preferredWidthType, preferredWidth);
        classList(this.cellTopAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
        classList(this.cellCenterAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
        classList(this.cellBottomAlign, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
        if (cellFormat.verticalAlignment === 'Top') {
            this.cellTopAlign.classList.add('e-de-table-alignment-active');
        }
        else if (cellFormat.verticalAlignment === 'Center') {
            this.cellCenterAlign.classList.add('e-de-table-alignment-active');
        }
        else if (cellFormat.verticalAlignment === 'Bottom') {
            this.cellBottomAlign.classList.add('e-de-table-alignment-active');
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.updateClassForCellAlignment = function (element) {
        var cellAlignments = element.getElementsByClassName(element.id + 'e-de-table-cell-alignment');
        for (var j = 0; j < cellAlignments.length; j++) {
            var cellAlignment = cellAlignments[j];
            if (cellAlignment.classList.contains('e-de-table-alignment-active')) {
                classList(cellAlignment, ['e-de-tablecell-alignment'], ['e-de-table-alignment-active']);
            }
        }
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.formatNumericTextBox = function (textBox, format, value) {
        if (format === 'Auto' || format === 'Point') {
            textBox.format = 'n2';
        }
        else {
            textBox.format = '#\'\%\'';
        }
        textBox.step = 1;
        textBox.decimals = 2;
        textBox.value = value;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.getCellAlignment = function () {
        var id = this.cellTab.id;
        var groupButtons = this.cellTab.getElementsByClassName(id + 'e-de-table-cell-alignment');
        for (var j = 0; j < groupButtons.length; j++) {
            var groupButton = groupButtons[j];
            if (groupButton.classList.contains('e-de-table-alignment-active')) {
                if (j === 0) {
                    return 'Top';
                }
                else if (j === 1) {
                    return 'Center';
                }
                else {
                    return 'Bottom';
                }
            }
        }
        return this.documentHelper.selection.cellFormat.verticalAlignment;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onCellWidthChange = function () {
        this.cellFormat.preferredWidth = this.cellWidthBox.value;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.onCellWidthTypeChange = function () {
        var value;
        var table = this.documentHelper.selection.start.paragraph.associatedCell.ownerTable;
        var containerWidth = table.getOwnerWidth(true);
        var tableWidth = table.getTableClientWidth(containerWidth);
        if (this.cellWidthType.text === 'Percent' && this.documentHelper.selection.cellFormat.preferredWidthType !== 'Percent') {
            value = this.cellWidthBox.value / tableWidth * 100;
            this.formatNumericTextBox(this.cellWidthBox, 'Percent', value);
        }
        else if (this.cellWidthType.text === 'Points' && this.documentHelper.selection.cellFormat.preferredWidthType !== 'Point') {
            value = tableWidth / 100 * this.cellWidthBox.value;
            this.formatNumericTextBox(this.cellWidthBox, 'Point', value);
        }
        else {
            if (this.cellWidthBox.format === '#\'\%\'') {
                if (this.cellWidthType.text === 'Points') {
                    value = tableWidth / 100 * this.cellWidthBox.value;
                }
                else {
                    value = this.cellWidthBox.value;
                }
            }
            else {
                if (this.cellWidthType.text === 'Percent') {
                    value = this.cellWidthBox.value / tableWidth * 100;
                }
                else {
                    value = this.cellWidthBox.value;
                }
            }
            // tslint:disable-next-line:max-line-length
            this.formatNumericTextBox(this.cellWidthBox, (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text, value);
        }
        this.cellFormat.preferredWidthType = (this.cellWidthType.text === 'Points') ? 'Point' : this.cellWidthType.text;
    };
    /**
     * @private
     */
    TablePropertiesDialog.prototype.destroy = function () {
        if (!isNullOrUndefined(this.target)) {
            if (this.target.parentElement) {
                this.target.parentElement.removeChild(this.target);
            }
            for (var s = 0; s < this.target.childNodes.length; s++) {
                this.target.removeChild(this.target.childNodes[s]);
                s--;
            }
            this.target = undefined;
        }
        this.dialog = undefined;
        this.target = undefined;
        this.cellAlignment = undefined;
        this.tableAlignment = undefined;
        this.documentHelper = undefined;
        this.preferCheckBox = undefined;
        this.tableWidthType = undefined;
        this.preferredWidth = undefined;
        this.rowHeightType = undefined;
        this.rowHeightCheckBox = undefined;
        this.rowHeight = undefined;
        this.cellWidthType = undefined;
        this.preferredCellWidthCheckBox = undefined;
        this.preferredCellWidth = undefined;
        this.tableTab = undefined;
        this.rowTab = undefined;
        this.cellTab = undefined;
        this.left = undefined;
        this.center = undefined;
        this.right = undefined;
        this.leftIndent = undefined;
        this.allowRowBreak = undefined;
        this.repeatHeader = undefined;
        this.cellTopAlign = undefined;
        this.cellCenterAlign = undefined;
        this.cellBottomAlign = undefined;
        this.tableFormat.destroy();
        this.cellFormat.destroy();
        this.tableFormat = undefined;
        this.cellFormat = undefined;
    };
    return TablePropertiesDialog;
}());
export { TablePropertiesDialog };
