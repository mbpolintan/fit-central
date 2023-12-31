import { Dialog, Tooltip } from '@syncfusion/ej2-popups';
import { Droppable, createElement, extend, remove, addClass, closest, getInstance, isBlazor } from '@syncfusion/ej2-base';
import { prepend, append, KeyboardEvents, removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button, RadioButton, CheckBox } from '@syncfusion/ej2-buttons';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import * as cls from '../../common/base/css-constant';
import { TreeView } from '@syncfusion/ej2-navigations';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
import * as events from '../../common/base/constant';
import { Accordion } from '@syncfusion/ej2-navigations';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { PivotUtil } from '../../base/util';
/**
 * Module to render Calculated Field Dialog
 */
var COUNT = 'Count';
var AVG = 'Avg';
var MIN = 'Min';
var MAX = 'Max';
var SUM = 'Sum';
var DISTINCTCOUNT = 'DistinctCount';
var PRODUCT = 'Product';
var STDEV = 'SampleStDev';
var STDEVP = 'PopulationStDev';
var VAR = 'SampleVar';
var VARP = 'PopulationVar';
var CALC = 'CalculatedField';
var AGRTYPE = 'AggregateType';
/** @hidden */
var CalculatedField = /** @class */ (function () {
    /** Constructor for calculatedfield module */
    function CalculatedField(parent) {
        /** @hidden */
        this.isFormula = false;
        /** @hidden */
        this.isRequireUpdate = false;
        this.parent = parent;
        this.existingReport = null;
        this.parent.calculatedFieldModule = this;
        this.removeEventListener();
        this.addEventListener();
        this.parentID = this.parent.element.id;
        this.dialog = null;
        this.inputObj = null;
        this.treeObj = null;
        this.droppable = null;
        this.menuObj = null;
        this.newFields = null;
        this.isFieldExist = true;
        this.formulaText = null;
        this.fieldText = null;
        this.formatText = null;
        this.formatType = null;
        this.fieldType = null;
        this.parentHierarchy = null;
        this.isEdit = false;
        this.currentFieldName = null;
        this.confirmPopUp = null;
    }
    /**
     * To get module name.
     * @returns string
     */
    CalculatedField.prototype.getModuleName = function () {
        return 'calculatedfield';
    };
    CalculatedField.prototype.keyActionHandler = function (e) {
        var node = e.currentTarget.querySelector('.e-hover.e-node-focus');
        if (node) {
            switch (e.action) {
                case 'moveRight':
                case 'shiftE':
                    if (this.parent.dataType === 'pivot') {
                        this.displayMenu(node);
                    }
                    break;
                case 'delete':
                    if (node.tagName === 'LI' && !node.querySelector('.e-list-icon.e-format') && !node.querySelector('.e-list-icon').classList.contains('.e-icons') && (node.querySelector('.' + cls.GRID_REMOVE) &&
                        node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-list-icon'))) {
                        this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, node);
                    }
                    break;
                case 'enter':
                    var field = node.getAttribute('data-field');
                    var type = node.getAttribute('data-type');
                    var dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
                    if (this.parent.dataType === 'pivot') {
                        if (dropField.value === '') {
                            if (type === CALC) {
                                dropField.value = node.getAttribute('data-uid');
                            }
                            else {
                                dropField.value = '"' + type + '(' + field + ')' + '"';
                            }
                        }
                        else if (dropField.value !== '') {
                            if (type === CALC) {
                                dropField.value = dropField.value + node.getAttribute('data-uid');
                            }
                            else {
                                dropField.value = dropField.value + '"' + type + '(' + field + ')' + '"';
                            }
                        }
                    }
                    else {
                        if (this.parent.olapEngineModule && this.parent.olapEngineModule.fieldList[field] &&
                            this.parent.olapEngineModule.fieldList[field].isCalculatedField) {
                            field = this.parent.olapEngineModule.fieldList[field].tag;
                        }
                        if (dropField.value === '') {
                            dropField.value = field;
                        }
                        else if (dropField.value !== '') {
                            dropField.value = dropField.value + field;
                        }
                    }
                    break;
            }
        }
    };
    /* tslint:disable:max-line-length */
    /**
     * Trigger while click treeview icon.
     * @param  {NodeClickEventArgs} e
     * @returns void
     */
    CalculatedField.prototype.fieldClickHandler = function (e) {
        var node = closest(e.event.target, 'li');
        if (e.event.target.classList.contains(cls.FORMAT) ||
            e.event.target.classList.contains(cls.CALC_EDIT) ||
            e.event.target.classList.contains(cls.CALC_EDITED) ||
            e.event.target.classList.contains(cls.GRID_REMOVE)) {
            if (!this.parent.isAdaptive) {
                this.displayMenu(node, e.node, e.event.target);
            }
            else if (this.parent.dataType === 'olap' && this.parent.isAdaptive) {
                if (node.tagName === 'LI' && node.querySelector('.e-list-edit-icon').classList.contains(cls.CALC_EDIT) && e.event.target.classList.contains(cls.CALC_EDIT)) {
                    this.isEdit = true;
                    this.currentFieldName = node.getAttribute('data-field');
                    this.fieldText = node.getAttribute('data-caption');
                    this.formulaText = node.getAttribute('data-formula');
                    this.formatType = node.getAttribute('data-formatString');
                    this.formatText = this.formatType === 'Custom' ? node.getAttribute('data-customString') : null;
                    this.fieldType = node.getAttribute('data-membertype');
                    this.parentHierarchy = this.fieldType === 'Dimension' ? node.getAttribute('data-hierarchy') : null;
                    addClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDITED);
                    removeClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDIT);
                    this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
                }
                else if (node.tagName === 'LI' && node.querySelector('.e-list-edit-icon').classList.contains(cls.CALC_EDITED) && e.event.target.classList.contains(cls.CALC_EDITED)) {
                    this.isEdit = false;
                    this.fieldText = this.formatText = this.formulaText = this.currentFieldName = null;
                    this.parentHierarchy = this.fieldType = this.formatType = null;
                    addClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDIT);
                    removeClass([node.querySelector('.e-list-edit-icon')], cls.CALC_EDITED);
                }
                else if (node.tagName === 'LI' && node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-icons') && e.event.target.classList.contains(cls.GRID_REMOVE)) {
                    this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, e.node);
                }
            }
        }
    };
    /* tslint:enable:max-line-length */
    /**
     * Trigger while click treeview icon.
     * @param  {AccordionClickArgs} e
     * @returns void
     */
    CalculatedField.prototype.accordionClickHandler = function (e) {
        if (e.item && e.item.iconCss.indexOf('e-list-icon') !== -1 &&
            closest(e.originalEvent.target, '.e-acrdn-header-icon')) {
            var node = closest(e.originalEvent.target, '.e-acrdn-header').querySelector('.' + cls.CALCCHECK);
            var fieldName = node.getAttribute('data-field');
            var formatObj = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings);
            var optionElement = closest(e.originalEvent.target, '.e-acrdn-header-icon');
            if (optionElement.querySelector('.' + cls.CALC_EDIT) && e.originalEvent.target.classList.contains(cls.CALC_EDIT)) {
                this.isEdit = true;
                this.currentFieldName = this.fieldText = fieldName;
                this.formulaText = this.parent.engineModule.fieldList[fieldName].formula;
                this.formatText = formatObj ? formatObj.format : '';
                addClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDITED);
                removeClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDIT);
                this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
            }
            else if (optionElement.querySelector('.' + cls.CALC_EDITED) &&
                e.originalEvent.target.classList.contains(cls.CALC_EDITED)) {
                this.isEdit = false;
                this.fieldText = this.formatText = this.formulaText = this.currentFieldName = null;
                addClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDIT);
                removeClass([optionElement.querySelector('.e-list-icon')], cls.CALC_EDITED);
            }
            else if (optionElement.querySelector('.' + cls.GRID_REMOVE) &&
                e.originalEvent.target.classList.contains(cls.GRID_REMOVE)) {
                this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('removeCalculatedField'), {}, true, node);
            }
        }
    };
    CalculatedField.prototype.accordionCreated = function () {
        var allElement = this.accordion.element.querySelectorAll('.e-acrdn-item');
        for (var i = 0; i < allElement.length; i++) {
            if (allElement[i].querySelector('.' + cls.CALC_EDIT) || allElement[i].querySelector('.' + cls.CALC_EDITED)) {
                var element = createElement('span', {
                    className: 'e-list-icon ' + cls.GRID_REMOVE + ' e-icons',
                });
                append([element], allElement[i].querySelector('.e-acrdn-header-icon'));
            }
        }
    };
    CalculatedField.prototype.clearFormula = function () {
        if (this.treeObj && this.treeObj.element.querySelector('li')) {
            removeClass(this.treeObj.element.querySelectorAll('li'), 'e-active');
            this.displayMenu(this.treeObj.element.querySelector('li'));
        }
    };
    /**
     * To display context menu.
     * @param  {HTMLElement} node
     * @returns void
     */
    /* tslint:disable:max-func-body-length */
    CalculatedField.prototype.displayMenu = function (node, treeNode, target) {
        var edit = target ? target.classList.contains(cls.CALC_EDIT) : true;
        var edited = target ? target.classList.contains(cls.CALC_EDITED) : true;
        /* tslint:disable:max-line-length */
        if (this.parent.dataType === 'pivot' && node.querySelector('.e-list-icon.e-format') &&
            node.querySelector('.e-list-icon.e-format').classList.contains(cls.ICON) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDITED) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.GRID_REMOVE) &&
            !node.querySelector('.e-list-icon').classList.contains(cls.CALC_EDIT) && node.tagName === 'LI') {
            if (this.menuObj && !this.menuObj.isDestroyed) {
                this.menuObj.destroy();
            }
            this.curMenu = node.querySelector('.' + cls.LIST_TEXT_CLASS);
            this.openContextMenu(node);
        }
        else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDIT) &&
            node.querySelector('.' + cls.CALC_EDIT).classList.contains('e-list-icon') && edit ||
            (this.parent.dataType === 'olap' && node.getAttribute('data-type') === CALC && node.classList.contains('e-active') && ((target && !target.classList.contains(cls.GRID_REMOVE)) || !target)))) {
            this.isEdit = true;
            var fieldName = node.getAttribute('data-field');
            var caption = node.getAttribute('data-caption');
            this.currentFieldName = fieldName;
            this.inputObj.value = caption;
            this.inputObj.dataBind();
            var formatString = node.getAttribute('data-formatString');
            var dialogElement = this.dialog.element;
            var customFormat = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
            if (this.parent.dataType === 'olap') {
                var memberType = node.getAttribute('data-membertype');
                var parentHierarchy = node.getAttribute('data-hierarchy');
                var expression = node.getAttribute('data-formula');
                var customString = node.getAttribute('data-customString');
                var fieldTitle = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                var memberTypeDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
                var hierarchyDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
                var formatDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
                /* tslint:enable:max-line-length */
                fieldTitle.innerHTML = this.parent.localeObj.getConstant('caption');
                document.querySelector('#' + this.parentID + 'droppable').value = expression;
                memberTypeDrop.readonly = true;
                memberTypeDrop.value = memberType;
                memberTypeDrop.dataBind();
                if (memberType === 'Dimension') {
                    hierarchyDrop.value = parentHierarchy;
                }
                if (formatString !== '') {
                    formatDrop.value = formatString;
                    formatDrop.dataBind();
                }
                customFormat.value = customString;
            }
            else {
                customFormat.value = formatString;
                addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                addClass([node.querySelector('.e-list-icon')], cls.CALC_EDITED);
                removeClass([node.querySelector('.e-list-icon')], cls.CALC_EDIT);
                node.querySelector('.' + cls.CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clearCalculatedField'));
                document.querySelector('#' + this.parentID + 'droppable').value = node.getAttribute('data-uid');
            }
            customFormat.dataBind();
        }
        else if (node.tagName === 'LI' && (node.querySelector('.' + cls.CALC_EDITED) &&
            node.querySelector('.' + cls.CALC_EDITED).classList.contains('e-list-icon') && edited ||
            (this.parent.dataType === 'olap' && !node.classList.contains('e-active')))) {
            this.isEdit = false;
            this.inputObj.value = '';
            this.inputObj.dataBind();
            var dialogElement = this.dialog.element;
            /* tslint:disable:max-line-length */
            var customFormat = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
            customFormat.value = '';
            customFormat.dataBind();
            if (this.parent.dataType === 'olap') {
                var hierarchyDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
                var formatDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
                var memberTypeDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
                var fieldTitle = dialogElement.querySelector('#' + this.parentID + '_' + 'FieldNameTitle');
                /* tslint:enable:max-line-length */
                fieldTitle.innerHTML = this.parent.localeObj.getConstant('fieldTitle');
                hierarchyDrop.index = 0;
                hierarchyDrop.dataBind();
                formatDrop.index = 0;
                formatDrop.dataBind();
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
            }
            else {
                addClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDIT);
                removeClass(this.treeObj.element.querySelectorAll('.' + cls.CALC_EDITED), cls.CALC_EDITED);
                node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            }
            document.querySelector('#' + this.parentID + 'droppable').value = '';
        }
        else if (node.tagName === 'LI' && (node.querySelector('.' + cls.GRID_REMOVE) &&
            node.querySelector('.' + cls.GRID_REMOVE).classList.contains('e-list-icon')) && !edit && !edited) {
            var dropField = document.querySelector('#' + this.parentID + 'droppable');
            var field = {
                name: this.isEdit ? this.currentFieldName : this.inputObj.value,
                caption: this.inputObj.value,
                formula: dropField.value
            };
            this.createConfirmDialog(this.parent.localeObj.getConstant('alert'), this.parent.localeObj.getConstant('removeCalculatedField'), field, true, treeNode);
        }
    };
    CalculatedField.prototype.removeCalcField = function (node) {
        var dataSourceSettings = this.parent.dataSourceSettings;
        var fieldName = node.getAttribute('data-field');
        var calcfields = dataSourceSettings.calculatedFieldSettings;
        var engineModule;
        if (this.parent.dataType === 'pivot') {
            if (!this.parent.isAdaptive) {
                this.treeObj.removeNodes([node]);
            }
            else {
                var index = parseInt(node.getAttribute('id').split(this.parentID + '_')[1], 10);
                if (typeof index === 'number') {
                    this.accordion.removeItem(index);
                }
            }
        }
        for (var i = 0; i < calcfields.length; i++) {
            if (calcfields[i] && calcfields[i].name === fieldName) {
                calcfields.splice(i, 1);
                break;
            }
        }
        /* tslint:disable:max-line-length */
        if (this.parent.dataType === 'olap') {
            engineModule = this.parent.olapEngineModule;
            var fields_1 = engineModule.fieldListData ? engineModule.fieldListData : [];
            /* tslint:disable:no-any */
            for (var _i = 0, _a = Object.keys(fields_1); _i < _a.length; _i++) {
                var item = _a[_i];
                if (fields_1[item].name === fieldName) {
                    var index = parseInt(item, 10);
                    if (typeof (index) === 'number') {
                        fields_1.splice(index, 1);
                        break;
                    }
                }
            }
            /* tslint:enable:no-any */
            var parentID = this.treeObj.getNode(node).parentID;
            this.treeObj.removeNodes([node]);
            if (calcfields.length <= 0) {
                this.treeObj.removeNodes([parentID]);
            }
        }
        else {
            engineModule = this.parent.engineModule;
        }
        if (engineModule.fields) {
            for (var i = 0; i < engineModule.fields.length; i++) {
                if (engineModule.fields[i] === fieldName) {
                    engineModule.fields.splice(i, 1);
                    break;
                }
            }
        }
        if (engineModule.savedFieldList && engineModule.savedFieldList[fieldName]) {
            delete engineModule.savedFieldList[fieldName];
        }
        if (engineModule.fieldList && engineModule.fieldList[fieldName]) {
            delete engineModule.fieldList[fieldName];
        }
        var formatFields = dataSourceSettings.formatSettings;
        for (var i = 0; i < formatFields.length; i++) {
            if (formatFields[i] && formatFields[i].name === fieldName) {
                formatFields.splice(i, 1);
                break;
            }
        }
        var fields = [dataSourceSettings.values, dataSourceSettings.rows, dataSourceSettings.columns, dataSourceSettings.filters];
        for (var i = 0, n = fields.length; i < n; i++) {
            for (var j = 0, length_1 = fields[i].length; j < length_1; j++) {
                if (fields[i][j].name === fieldName) {
                    fields[i].splice(j, 1);
                    break;
                }
            }
        }
        /* tslint:enable:max-line-length */
        if (this.isEdit && this.currentFieldName === fieldName) {
            this.isEdit = false;
            this.inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
        }
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() !== 'pivotfieldlist') {
            this.parent.updateDataSource();
        }
        this.removeErrorDialog();
    };
    /**
     * To set position for context menu.
     * @returns void
     */
    CalculatedField.prototype.openContextMenu = function (node) {
        var _this = this;
        var fieldName = node.getAttribute('data-field');
        var type = this.parent.engineModule.fieldList[fieldName].type !== 'number' ? 'string' : 'number';
        var validSummaryTypes = (type === 'string' ? this.getValidSummaryType().slice(0, 2) : this.getValidSummaryType());
        var eventArgs = {
            cancel: false, fieldName: fieldName,
            aggregateTypes: this.getMenuItems(type).slice()
        };
        var control = this.parent.getModuleName() === 'pivotfieldlist' && this.parent.isPopupView ?
            this.parent.pivotGridModule : this.parent;
        control.trigger(events.aggregateMenuOpen, eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                var duplicateTypes = [];
                var items = [];
                for (var _i = 0, _a = observedArgs.aggregateTypes; _i < _a.length; _i++) {
                    var option = _a[_i];
                    if (validSummaryTypes.indexOf(option) > -1 && duplicateTypes.indexOf(option) === -1) {
                        duplicateTypes.push(option);
                        items.push({
                            id: _this.parent.element.id + 'Calc_' + option,
                            text: _this.parent.localeObj.getConstant(option)
                        });
                    }
                }
                _this.createMenu(items, node);
                var pos = node.getBoundingClientRect();
                var offset = window.scrollY || document.documentElement.scrollTop;
                if (_this.parent.enableRtl) {
                    _this.menuObj.open(pos.top + offset, pos.left - 100);
                }
                else {
                    _this.menuObj.open(pos.top + offset, pos.left + 150);
                }
            }
        });
    };
    /**
     * Triggers while select menu.
     * @param  {MenuEventArgs} menu
     * @returns void
     */
    CalculatedField.prototype.selectContextMenu = function (menu) {
        if (menu.element.textContent !== null) {
            var field = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.id.split('_').pop());
            this.curMenu.textContent = field + ' (' + menu.element.textContent + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '-1');
            this.curMenu.parentElement.parentElement.focus();
        }
    };
    /**
     * To create context menu.
     * @returns void
     */
    CalculatedField.prototype.createMenu = function (menuItems, node) {
        var _this = this;
        var menuOptions = {
            cssClass: this.parentID + 'calculatedmenu',
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            // beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this),
            onClose: function () {
                _this.treeObj.element.focus();
                addClass([node], ['e-hover', 'e-node-focus']);
            }
        };
        var contextMenu;
        if (document.querySelector('#' + this.parentID + 'CalcContextmenu')) {
            contextMenu = document.querySelector('#' + this.parentID + 'CalcContextmenu');
        }
        else {
            contextMenu = createElement('ul', {
                id: this.parentID + 'CalcContextmenu'
            });
        }
        this.dialog.element.appendChild(contextMenu);
        this.menuObj = new Menu(menuOptions);
        this.menuObj.isStringTemplate = true;
        this.menuObj.appendTo(contextMenu);
    };
    /**
     * Triggers while click OK button.
     * @returns void
     */
    /* tslint:disable:max-func-body-length */
    CalculatedField.prototype.applyFormula = function () {
        var _this = this;
        var currentObj = this;
        var isExist = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
        this.newFields =
            extend([], this.parent.dataSourceSettings.calculatedFieldSettings, null, true);
        var eventArgs = {
            fieldName: this.isEdit ? this.currentFieldName : this.inputObj.value,
            calculatedField: this.getCalculatedFieldInfo(),
            calculatedFieldSettings: PivotUtil.cloneCalculatedFieldSettings(this.parent.dataSourceSettings.calculatedFieldSettings),
            cancel: false
        };
        var control = this.parent.getModuleName() === 'pivotfieldlist' &&
            /* tslint:disable-next-line:max-line-length */
            this.parent.isPopupView ? this.parent.pivotGridModule : this.parent;
        control.trigger(events.calculatedFieldCreate, eventArgs, function (observedArgs) {
            if (!observedArgs.cancel) {
                var calcInfo = observedArgs.calculatedField;
                if (!_this.isEdit) {
                    if (currentObj.parent.dataType === 'olap') {
                        var field = calcInfo.name;
                        if (currentObj.parent.olapEngineModule.fieldList[field] &&
                            currentObj.parent.olapEngineModule.fieldList[field].type !== 'CalculatedField') {
                            isExist = true;
                        }
                    }
                    else {
                        for (var _i = 0, _a = Object.keys(currentObj.parent.engineModule.fieldList); _i < _a.length; _i++) {
                            var key = _a[_i];
                            if (calcInfo.name && calcInfo.name === key &&
                                currentObj.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                                isExist = true;
                            }
                        }
                    }
                }
                if (isExist) {
                    currentObj.parent.pivotCommon.errorDialog.createErrorDialog(currentObj.parent.localeObj.getConstant('error'), currentObj.parent.localeObj.getConstant('fieldExist'));
                    return;
                }
                _this.existingReport = extend({}, _this.parent.dataSourceSettings, null, true);
                var report = _this.parent.dataSourceSettings;
                if (!isNullOrUndefined(calcInfo.name) && calcInfo.name !== '' &&
                    !isNullOrUndefined(calcInfo.caption) && calcInfo.caption !== '' && calcInfo.formula && calcInfo.formula !== '') {
                    var field = void 0;
                    if (_this.parent.dataType === 'olap') {
                        field = {
                            name: calcInfo.name,
                            formula: calcInfo.formula,
                            formatString: calcInfo.formatString
                        };
                        if (!isNullOrUndefined(calcInfo.hierarchyUniqueName)) {
                            field.hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                        }
                        _this.isFieldExist = false;
                        if (!_this.isEdit) {
                            for (var i = 0; i < report.calculatedFieldSettings.length; i++) {
                                if (report.calculatedFieldSettings[i].name === field.name) {
                                    _this.createConfirmDialog(currentObj.parent.localeObj.getConstant('alert'), currentObj.parent.localeObj.getConstant('confirmText'), calcInfo);
                                    return;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < report.calculatedFieldSettings.length; i++) {
                                if (report.calculatedFieldSettings[i].name === field.name && _this.isEdit) {
                                    report.calculatedFieldSettings[i].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                                    _this.parent.olapEngineModule.fieldList[field.name].caption = calcInfo.caption;
                                    report.calculatedFieldSettings[i].formatString = field.formatString;
                                    report.calculatedFieldSettings[i].formula = field.formula;
                                    field = report.calculatedFieldSettings[i];
                                    _this.isFieldExist = true;
                                    break;
                                }
                            }
                            var axisFields = [report.rows, report.columns, report.values, report.filters];
                            var isFieldExist = false;
                            for (var _b = 0, axisFields_1 = axisFields; _b < axisFields_1.length; _b++) {
                                var fields = axisFields_1[_b];
                                for (var _c = 0, fields_2 = fields; _c < fields_2.length; _c++) {
                                    var item = fields_2[_c];
                                    if (item.isCalculatedField && field.name !== null &&
                                        item.name === field.name && _this.isEdit) {
                                        item.caption = calcInfo.caption;
                                        _this.isFieldExist = true;
                                        isFieldExist = true;
                                        break;
                                    }
                                }
                                if (isFieldExist) {
                                    break;
                                }
                            }
                        }
                        if (!_this.isFieldExist) {
                            report.calculatedFieldSettings.push(field);
                        }
                        _this.parent.lastCalcFieldInfo = field;
                    }
                    else {
                        field = {
                            name: calcInfo.name,
                            caption: calcInfo.caption,
                            type: 'CalculatedField'
                        };
                        var cField = {
                            name: calcInfo.name,
                            formula: calcInfo.formula
                        };
                        if (!isNullOrUndefined(calcInfo.formatString)) {
                            cField.formatString = calcInfo.formatString;
                        }
                        _this.isFieldExist = true;
                        if (!_this.isEdit) {
                            for (var i = 0; i < report.values.length; i++) {
                                if (report.values[i].type === CALC && report.values[i].name === field.name) {
                                    for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j].name === field.name) {
                                            _this.createConfirmDialog(currentObj.parent.localeObj.getConstant('alert'), currentObj.parent.localeObj.getConstant('confirmText'), calcInfo);
                                            return;
                                        }
                                    }
                                    _this.isFieldExist = false;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < report.values.length; i++) {
                                if (report.values[i].type === CALC && field.name !== null &&
                                    report.values[i].name === field.name && _this.isEdit) {
                                    for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
                                        if (report.calculatedFieldSettings[j].name === field.name) {
                                            report.values[i].caption = calcInfo.caption;
                                            _this.currentFormula = report.calculatedFieldSettings[j].formula;
                                            report.calculatedFieldSettings[j].formula = calcInfo.formula;
                                            _this.parent.engineModule.fieldList[field.name].caption = calcInfo.caption;
                                            _this.updateFormatSettings(report, field.name, calcInfo.formatString);
                                            _this.isFieldExist = false;
                                        }
                                    }
                                }
                            }
                        }
                        if (_this.isFieldExist) {
                            report.values.push(field);
                            report.calculatedFieldSettings.push(cField);
                            _this.updateFormatSettings(report, field.name, calcInfo.formatString);
                        }
                        _this.parent.lastCalcFieldInfo = cField;
                    }
                    _this.addFormula(report, field.name);
                }
                else {
                    if (isNullOrUndefined(calcInfo.name) || calcInfo.name === '' ||
                        isNullOrUndefined(calcInfo.caption) || calcInfo.caption === '') {
                        _this.inputObj.value = '';
                        addClass([document.getElementById(_this.parentID + 'ddlelement')], cls.EMPTY_FIELD);
                        document.getElementById(_this.parentID + 'ddlelement').focus();
                    }
                    else {
                        _this.parent.pivotCommon.errorDialog.createErrorDialog(_this.parent.localeObj.getConstant('error'), _this.parent.localeObj.getConstant('invalidFormula'));
                    }
                }
            }
            else {
                _this.endDialog();
                _this.parent.lastCalcFieldInfo = {};
                _this.isFormula = false;
            }
        });
    };
    /* tslint:disable:max-line-length */
    CalculatedField.prototype.getCalculatedFieldInfo = function () {
        var field;
        var dropField = document.querySelector('#' + this.parentID + 'droppable');
        var dialogElement = this.parent.isAdaptive ? this.parent.dialogRenderer.adaptiveElement.element : this.dialog.element;
        var customFormat = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
        field = {
            name: this.isEdit ? this.currentFieldName : this.inputObj.value,
            caption: this.inputObj.value,
            formula: dropField.value
        };
        if (this.parent.dataType === 'olap') {
            var formatDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
            var memberTypeDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
            var hierarchyDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
            field.formatString = (formatDrop.value === 'Custom' ? customFormat.value : formatDrop.value);
            if (memberTypeDrop.value === 'Dimension') {
                field.hierarchyUniqueName = hierarchyDrop.value;
            }
        }
        else {
            field.formatString = customFormat.value;
        }
        return field;
    };
    /* tslint:enable:max-line-length */
    CalculatedField.prototype.updateFormatSettings = function (report, fieldName, formatString) {
        var newFormat = { name: fieldName, format: formatString, useGrouping: true };
        var isFormatExist = false;
        for (var i = 0; i < report.formatSettings.length; i++) {
            if (report.formatSettings[i].name === fieldName) {
                if (formatString === 'undefined' || formatString === undefined || formatString === '') {
                    report.formatSettings.splice(i, 1);
                    isFormatExist = true;
                    break;
                }
                else {
                    var formatObj = report.formatSettings[i].properties ?
                        report.formatSettings[i].properties : report.formatSettings[i];
                    formatObj.format = formatString;
                    report.formatSettings.splice(i, 1, formatObj);
                    isFormatExist = true;
                    break;
                }
            }
        }
        if (!isFormatExist && formatString !== '') {
            report.formatSettings.push(newFormat);
        }
    };
    CalculatedField.prototype.addFormula = function (report, field) {
        this.isFormula = true;
        this.field = field;
        if (isBlazor()) {
            PivotUtil.updateDataSourceSettings(this.parent, PivotUtil.getClonedDataSourceSettings(report));
        }
        else {
            this.parent.setProperties({ dataSourceSettings: report }, true);
        }
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
            this.parent.isRequiredUpdate = false;
        }
        try {
            this.parent.updateDataSource(false);
            var pivot = this.parent.getModuleName() === 'pivotfieldlist' ?
                this.parent.pivotGridModule : this.parent;
            if (!(isBlazor() && pivot && pivot.enableVirtualization)) {
                this.endDialog();
            }
            else {
                this.isRequireUpdate = true;
            }
            if (this.parent.getModuleName() === 'pivotfieldlist' &&
                this.parent.renderMode === 'Fixed' && this.parent.allowDeferLayoutUpdate) {
                this.parent.pivotChange = true;
            }
        }
        catch (exception) {
            this.showError();
        }
    };
    /** @hidden */
    CalculatedField.prototype.endDialog = function () {
        this.isEdit = false;
        if (this.dialog) {
            this.dialog.close();
        }
        else {
            this.inputObj.value = '';
            this.currentFieldName = this.formatText = this.fieldText = this.formatType = null;
            this.formulaText = this.fieldType = this.parentHierarchy = null;
            /* tslint:disable:max-line-length */
            var dialogElement = this.parent.isAdaptive ? this.parent.dialogRenderer.parentElement : this.dialog.element;
            this.parent.dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT).value = '';
            this.parent.dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable').value = '';
            this.parent.dialogRenderer.parentElement.querySelector('#' + this.parentID + 'Custom_Format_Element').value = '';
            if (this.parent.dataType === 'olap') {
                var customFormat = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
                var formatDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
                var memberTypeDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
                var hierarchyDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
                formatDrop.index = 0;
                formatDrop.dataBind();
                memberTypeDrop.index = 0;
                memberTypeDrop.readonly = false;
                memberTypeDrop.dataBind();
                hierarchyDrop.index = 0;
                hierarchyDrop.enabled = false;
                hierarchyDrop.dataBind();
                customFormat.enabled = false;
                customFormat.dataBind();
            }
            /* tslint:enable:max-line-length */
        }
    };
    /** @hidden */
    CalculatedField.prototype.showError = function () {
        if (this.parent.engineModule.fieldList[this.field]) {
            delete this.parent.engineModule.fieldList[this.field];
        }
        this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
        if (isBlazor()) {
            PivotUtil.updateDataSourceSettings(this.parent, PivotUtil.getClonedDataSourceSettings(this.existingReport));
        }
        else {
            this.parent.setProperties({ dataSourceSettings: this.existingReport }, true);
        }
        if (this.isEdit) {
            var calcFields = this.parent.dataSourceSettings.calculatedFieldSettings;
            for (var i = 0; calcFields && i < calcFields.length; i++) {
                if (calcFields[i].name === this.field) {
                    calcFields[i].formula = this.currentFormula;
                    break;
                }
            }
        }
        else if (this.parent.engineModule.fields) {
            for (var i = 0; i < this.parent.engineModule.fields.length; i++) {
                if (this.parent.engineModule.fields[i] === this.field) {
                    this.parent.engineModule.fields.splice(i, 1);
                    break;
                }
            }
        }
        this.parent.lastCalcFieldInfo = {};
        this.parent.updateDataSource(false);
        this.isFormula = false;
    };
    /**
     * To get treeview data
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    CalculatedField.prototype.getFieldListData = function (parent) {
        var fields = [];
        if (this.parent.dataType === 'olap') {
            /* tslint:disable-next-line:max-line-length */
            fields = PivotUtil.getClonedData(parent.olapEngineModule.fieldListData ? parent.olapEngineModule.fieldListData : []);
            for (var _i = 0, _a = fields; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                        item.spriteCssClass.indexOf('e-level-members') > -1)) {
                    item.hasChildren = true;
                }
                else if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-namedSetCDB-icon') > -1)) {
                    item.hasChildren = false;
                }
                else if (item.spriteCssClass &&
                    (item.spriteCssClass.indexOf('e-calcMemberGroupCDB') > -1)) {
                    item.expanded = this.isEdit;
                }
            }
        }
        else {
            for (var _b = 0, _c = (parent.engineModule.fieldList ? Object.keys(parent.engineModule.fieldList) : []); _b < _c.length; _b++) {
                var key = _c[_b];
                var type = null;
                var typeVal = null;
                if ((parent.engineModule.fieldList[key].type !== 'number' || parent.engineModule.fieldList[key].type === 'include' ||
                    parent.engineModule.fieldList[key].type === 'exclude') &&
                    (parent.engineModule.fieldList[key].aggregateType !== 'DistinctCount')) {
                    typeVal = COUNT;
                }
                else {
                    typeVal = parent.engineModule.fieldList[key].aggregateType !== undefined ?
                        (parent.engineModule.fieldList[key].aggregateType) : SUM;
                }
                type = this.parent.localeObj.getConstant(typeVal);
                fields.push({
                    index: parent.engineModule.fieldList[key].index,
                    name: parent.engineModule.fieldList[key].caption + ' (' + type + ')',
                    type: typeVal,
                    icon: cls.FORMAT + ' ' + cls.ICON,
                    formula: parent.engineModule.fieldList[key].formula,
                    field: key,
                    caption: parent.engineModule.fieldList[key].caption ? parent.engineModule.fieldList[key].caption : key
                });
            }
        }
        return fields;
    };
    /**
     * Triggers before menu opens.
     * @param  {BeforeOpenCloseMenuEventArgs} args
     * @returns void
     */
    /**
     * Trigger while drop node in formula field.
     * @param  {DragAndDropEventArgs} args
     * @returns void
     */
    CalculatedField.prototype.fieldDropped = function (args) {
        args.cancel = true;
        var dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
        removeClass([dropField], 'e-copy-drop');
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        var field = args.draggedNode.getAttribute('data-field');
        if (this.parent.dataType === 'olap') {
            if (this.parent.olapEngineModule.fieldList[field] &&
                this.parent.olapEngineModule.fieldList[field].isCalculatedField) {
                field = this.parent.olapEngineModule.fieldList[field].tag;
            }
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                dropField.value = field;
                dropField.focus();
            }
            else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                var textCovered = void 0;
                var currentValue = dropField.value;
                var cursorPos = dropField.selectionStart;
                var textAfterText = currentValue.substring(cursorPos, currentValue.length);
                var textBeforeText = currentValue.substring(0, cursorPos);
                textCovered = textBeforeText + field;
                dropField.value = textBeforeText + field + textAfterText;
                dropField.focus();
                dropField.setSelectionRange(textCovered.length, textCovered.length);
            }
            else {
                args.cancel = true;
            }
        }
        else {
            var type = args.draggedNode.getAttribute('data-type');
            if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
                if (type === CALC) {
                    dropField.value = args.draggedNodeData.id.toString();
                }
                else {
                    dropField.value = '"' + type + '(' + field + ')' + '"';
                }
                dropField.focus();
            }
            else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
                var textCovered = void 0;
                var cursorPos = dropField.selectionStart;
                var currentValue = dropField.value;
                var textBeforeText = currentValue.substring(0, cursorPos);
                var textAfterText = currentValue.substring(cursorPos, currentValue.length);
                if (type === CALC) {
                    textCovered = textBeforeText + args.draggedNodeData.id.toString();
                    dropField.value = textBeforeText + args.draggedNodeData.id.toString() + textAfterText;
                }
                else {
                    textCovered = textBeforeText + '"' + type + '(' + field + ')' + '"';
                    dropField.value = textBeforeText + '"' + type + '(' + field + ')' + '"' + textAfterText;
                }
                dropField.focus();
                dropField.setSelectionRange(textCovered.length, textCovered.length);
            }
            else {
                args.cancel = true;
            }
        }
    };
    /**
     * To create dialog.
     * @returns void
     */
    CalculatedField.prototype.createDialog = function () {
        var _this = this;
        if (document.querySelector('#' + this.parentID + 'calculateddialog') !== null) {
            remove(document.querySelector('#' + this.parentID + 'calculateddialog'));
            while (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
                remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
            }
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'calculateddialog',
            className: cls.CALCDIALOG + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_CALCDIALOG : '')
        }));
        var calcButtons = [
            {
                click: this.applyFormula.bind(this),
                buttonModel: {
                    content: this.parent.localeObj.getConstant('ok'),
                    isPrimary: true
                }
            },
            {
                click: this.cancelClick.bind(this),
                buttonModel: {
                    content: this.parent.localeObj.getConstant('cancel')
                }
            }
        ];
        if (this.parent.dataType === 'olap') {
            var clearButton = {
                click: this.clearFormula.bind(this),
                buttonModel: {
                    cssClass: 'e-calc-clear-btn',
                    content: this.parent.localeObj.getConstant('clear'),
                }
            };
            calcButtons.splice(0, 0, clearButton);
        }
        this.dialog = new Dialog({
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: calcButtons,
            close: this.closeDialog.bind(this),
            beforeOpen: this.beforeOpen.bind(this),
            open: function () {
                if (_this.dialog.element.querySelector('#' + _this.parentID + 'ddlelement')) {
                    _this.dialog.element.querySelector('#' + _this.parentID + 'ddlelement').focus();
                }
            },
            animationSettings: { effect: 'Zoom' },
            width: '25%',
            isModal: false,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            showCloseIcon: true,
            header: this.parent.localeObj.getConstant('createCalculatedField'),
            target: document.body
        });
        this.dialog.isStringTemplate = true;
        this.dialog.appendTo('#' + this.parentID + 'calculateddialog');
    };
    CalculatedField.prototype.cancelClick = function () {
        this.dialog.close();
        this.isEdit = false;
    };
    CalculatedField.prototype.beforeOpen = function (args) {
        // this.dialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('createCalculatedField');
        this.dialog.element.querySelector('.e-dlg-header').
            setAttribute('title', this.parent.localeObj.getConstant('createCalculatedField'));
    };
    CalculatedField.prototype.closeDialog = function (args) {
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parent.axisFieldModule.render();
            if (this.parent.renderMode !== 'Fixed') {
                addClass([this.parent.element.querySelector('.' + cls.TOGGLE_FIELD_LIST_CLASS)], cls.ICON_HIDDEN);
                this.parent.dialogRenderer.fieldListDialog.show();
            }
        }
        this.treeObj.destroy();
        this.dialog.destroy();
        this.newFields = null;
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
        remove(document.getElementById(this.parentID + 'calculateddialog'));
        if (!isNullOrUndefined(document.querySelector('.' + this.parentID + 'calculatedmenu'))) {
            remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
        }
        var timeOut = ((this.parent.getModuleName() === 'pivotview') ||
            ((this.parent.getModuleName() === 'pivotfieldlist') &&
                this.parent.renderMode === 'Fixed')) ? 0 : 500;
        if (this.buttonCall) {
            this.buttonCall = false;
            setTimeout(this.setFocus.bind(this), timeOut);
        }
    };
    CalculatedField.prototype.setFocus = function () {
        var parentElement;
        if (this.parent.getModuleName() === 'pivotview' && this.parent.element) {
            parentElement = this.parent.element;
        }
        else if (document.getElementById(this.parent.element.id + '_Wrapper')) {
            parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
        }
        if (parentElement) {
            var pivotButtons = [].slice.call(parentElement.querySelectorAll('.e-pivot-button'));
            for (var _i = 0, pivotButtons_1 = pivotButtons; _i < pivotButtons_1.length; _i++) {
                var item = pivotButtons_1[_i];
                if (item.getAttribute('data-uid') === this.currentFieldName) {
                    item.focus();
                    break;
                }
            }
        }
    };
    /* tslint:disable:max-line-length */
    /**
     * To render dialog elements.
     * @returns void
     */
    CalculatedField.prototype.renderDialogElements = function () {
        var outerDiv = createElement('div', {
            id: this.parentID + 'outerDiv',
            className: (this.parent.dataType === 'olap' ? cls.OLAP_CALCOUTERDIV + ' ' : '') + cls.CALCOUTERDIV
        });
        var olapFieldTreeDiv = createElement('div', { id: this.parentID + 'Olap_Tree_Div', className: 'e-olap-field-tree-div' });
        var olapCalcDiv = createElement('div', { id: this.parentID + 'Olap_Calc_Div', className: 'e-olap-calculated-div' });
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            var accordDiv = createElement('div', { id: this.parentID + 'accordDiv', className: cls.CALCACCORD });
            outerDiv.appendChild(accordDiv);
            var buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
            var addBtn = createElement('button', {
                id: this.parentID + 'addBtn', innerHTML: this.parent.localeObj.getConstant('add'),
                className: cls.CALCADDBTN, attrs: { 'type': 'button' }
            });
            var cancelBtn = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: this.parent.localeObj.getConstant('cancel'),
                className: cls.CALCCANCELBTN, attrs: { 'type': 'button' }
            });
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        }
        else {
            if (!this.parent.isAdaptive && this.parent.dataType === 'olap') {
                var formulaTitle = createElement('div', {
                    className: cls.PIVOT_FIELD_TITLE_CLASS, id: this.parentID + '_' + 'FieldNameTitle',
                    innerHTML: this.parent.localeObj.getConstant('fieldTitle')
                });
                olapCalcDiv.appendChild(formulaTitle);
            }
            var inputDiv = createElement('div', { id: this.parentID + 'outerDiv', className: cls.CALCINPUTDIV });
            var inputObj = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text' },
                className: cls.CALCINPUT
            });
            inputDiv.appendChild(inputObj);
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapCalcDiv.appendChild(inputDiv) : outerDiv.appendChild(inputDiv));
            var wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
            if (!this.parent.isAdaptive) {
                var fieldTitle = createElement('div', {
                    className: cls.PIVOT_ALL_FIELD_TITLE_CLASS,
                    innerHTML: (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('allFields') :
                        this.parent.localeObj.getConstant('formulaField'))
                });
                if (this.parent.dataType === 'olap') {
                    var headerWrapperDiv = createElement('div', { className: cls.PIVOT_ALL_FIELD_TITLE_CLASS + '-wrapper' });
                    headerWrapperDiv.appendChild(fieldTitle);
                    var spanElement = createElement('span', {
                        attrs: {
                            'tabindex': '0',
                            'aria-disabled': 'false',
                            'aria-label': this.parent.localeObj.getConstant('fieldTooltip'),
                        },
                        className: cls.ICON + ' ' + cls.CALC_INFO
                    });
                    headerWrapperDiv.appendChild(spanElement);
                    var tooltip = new Tooltip({
                        content: this.parent.localeObj.getConstant('fieldTooltip'),
                        position: (this.parent.enableRtl ? 'RightCenter' : 'LeftCenter'),
                        target: '.' + cls.CALC_INFO,
                        offsetY: (this.parent.enableRtl ? -10 : -10),
                        width: 220
                    });
                    tooltip.appendTo(headerWrapperDiv);
                    wrapDiv.appendChild(headerWrapperDiv);
                }
                else {
                    outerDiv.appendChild(fieldTitle);
                }
            }
            var treeOuterDiv = createElement('div', { className: cls.TREEVIEW + '-outer-div' });
            wrapDiv.appendChild(treeOuterDiv);
            treeOuterDiv.appendChild(createElement('div', { id: this.parentID + 'tree', className: cls.TREEVIEW }));
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapFieldTreeDiv.appendChild(wrapDiv) : outerDiv.appendChild(wrapDiv));
            if (!this.parent.isAdaptive) {
                var formulaTitle = createElement('div', {
                    className: cls.PIVOT_FORMULA_TITLE_CLASS,
                    innerHTML: (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('expressionField') :
                        this.parent.localeObj.getConstant('formula'))
                });
                (this.parent.dataType === 'olap' ? olapCalcDiv.appendChild(formulaTitle) : outerDiv.appendChild(formulaTitle));
            }
            var dropDiv = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: cls.FORMULA,
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        (this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('olapDropText') :
                            this.parent.localeObj.getConstant('dropText'))
                }
            });
            (this.parent.dataType === 'olap' && !this.parent.isAdaptive ? olapCalcDiv.appendChild(dropDiv) : outerDiv.appendChild(dropDiv));
            if (this.parent.isAdaptive) {
                var buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: cls.CALCBUTTONDIV });
                var okBtn = createElement('button', {
                    id: this.parentID + 'okBtn', innerHTML: this.parent.localeObj.getConstant('apply'),
                    className: cls.CALCOKBTN, attrs: { 'type': 'button' }
                });
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
            if (this.parent.dataType === 'olap') {
                if (!this.parent.isAdaptive) {
                    var memberTypeTitle = createElement('div', {
                        className: cls.OLAP_MEMBER_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('memberType')
                    });
                    olapCalcDiv.appendChild(memberTypeTitle);
                }
                var memberTypeDrop = createElement('div', { id: this.parentID + 'Member_Type_Div', className: cls.CALC_MEMBER_TYPE_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(memberTypeDrop) : olapCalcDiv.appendChild(memberTypeDrop));
                if (!this.parent.isAdaptive) {
                    var hierarchyTitle = createElement('div', {
                        className: cls.OLAP_HIERARCHY_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('selectedHierarchy')
                    });
                    olapCalcDiv.appendChild(hierarchyTitle);
                }
                var hierarchyDrop = createElement('div', { id: this.parentID + 'Hierarchy_List_Div', className: cls.CALC_HIERARCHY_LIST_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(hierarchyDrop) : olapCalcDiv.appendChild(hierarchyDrop));
                if (!this.parent.isAdaptive) {
                    var formatTitle = createElement('div', {
                        className: cls.OLAP_FORMAT_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('formatString')
                    });
                    olapCalcDiv.appendChild(formatTitle);
                }
                var formatDrop = createElement('div', { id: this.parentID + 'Format_Div', className: cls.CALC_FORMAT_TYPE_DIV });
                (this.parent.isAdaptive ? outerDiv.appendChild(formatDrop) : olapCalcDiv.appendChild(formatDrop));
                var customFormatDiv = createElement('div', { id: this.parentID + 'custom_Format_Div', className: cls.OLAP_CALC_CUSTOM_FORMAT_INPUTDIV });
                var customFormatObj = createElement('input', {
                    id: this.parentID + 'Custom_Format_Element',
                    attrs: { 'type': 'text' },
                    className: cls.CALC_FORMAT_INPUT
                });
                customFormatDiv.appendChild(customFormatObj);
                olapCalcDiv.appendChild(customFormatDiv);
                (this.parent.isAdaptive ? outerDiv.appendChild(customFormatDiv) : olapCalcDiv.appendChild(customFormatDiv));
                if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.
                    dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) === null && this.parent.isAdaptive) {
                    var okBtn = outerDiv.querySelector('.' + cls.CALCOKBTN);
                    outerDiv.appendChild(okBtn);
                }
                else {
                    outerDiv.appendChild(olapFieldTreeDiv);
                    outerDiv.appendChild(olapCalcDiv);
                }
            }
            else {
                var customFormatDiv = createElement('div', { id: this.parentID + 'custom_Format_Div', className: cls.CALC_CUSTOM_FORMAT_INPUTDIV });
                if (!this.parent.isAdaptive) {
                    var formatTitle = createElement('div', {
                        className: cls.OLAP_FORMAT_TITLE_CLASS,
                        innerHTML: this.parent.localeObj.getConstant('formatString')
                    });
                    customFormatDiv.appendChild(formatTitle);
                }
                var customFormatObj = createElement('input', {
                    id: this.parentID + 'Custom_Format_Element',
                    attrs: { 'type': 'text' },
                    className: cls.CALC_FORMAT_INPUT
                });
                customFormatDiv.appendChild(customFormatObj);
                (this.parent.isAdaptive ? outerDiv.insertBefore(customFormatDiv, outerDiv.querySelector('#' + this.parentID + 'buttonDiv')) : outerDiv.appendChild(customFormatDiv));
            }
        }
        return outerDiv;
    };
    /**
     * To create calculated field adaptive layout.
     * @returns void
     */
    CalculatedField.prototype.renderAdaptiveLayout = function (isEdit) {
        var dialogElement = this.parent.dialogRenderer.adaptiveElement;
        if (isEdit) {
            if (dialogElement.element.querySelector('#' + this.parentID + 'droppable')) {
                this.formulaText = document.querySelector('#' + this.parentID + 'droppable').value;
                this.fieldText = this.inputObj.value;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV)) {
                var memberTypeDrop = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
                this.fieldType = memberTypeDrop.value;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV)) {
                var hierarchyDrop = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
                this.parentHierarchy = this.fieldType === 'Dimension' ? hierarchyDrop.value : null;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV)) {
                var formatDrop = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
                this.formatType = formatDrop.value;
            }
            if (dialogElement.element.querySelector('.' + cls.CALC_FORMAT_INPUT)) {
                var customFormat = getInstance(dialogElement.element.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
                this.formatText = this.parent.dataType === 'olap' ? this.formatType === 'Custom' ? customFormat.value : null : customFormat.value;
            }
        }
        else {
            this.currentFieldName = this.formulaText = this.fieldText = this.formatText = null;
            this.fieldType = this.formatType = this.parentHierarchy = null;
        }
        this.renderMobileLayout(dialogElement);
    };
    /**
     * To update calculated field info in adaptive layout.
     * @returns void
     */
    CalculatedField.prototype.updateAdaptiveCalculatedField = function (isEdit, fieldName) {
        var dialogElement = this.parent.dialogRenderer.adaptiveElement.element;
        this.isEdit = isEdit;
        var calcInfo = (isEdit ? (this.parent.dataType === 'pivot' ?
            this.parent.engineModule.fieldList[fieldName] : this.parent.olapEngineModule.fieldList[fieldName]) :
            {
                id: null, caption: null, formula: null, fieldType: 'Measure',
                formatString: (this.parent.dataType === 'pivot' ? null : 'Standard'), parentHierarchy: null
            });
        this.currentFieldName = calcInfo.id;
        if (dialogElement.querySelector('#' + this.parentID + 'droppable')) {
            this.formulaText = document.querySelector('#' + this.parentID + 'droppable').value = calcInfo.formula;
            this.fieldText = this.inputObj.value = calcInfo.caption;
            this.inputObj.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_MEMBER_TYPE_DIV)) {
            var memberTypeDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'), DropDownList);
            this.fieldType = memberTypeDrop.value = calcInfo.fieldType;
            memberTypeDrop.readonly = isEdit ? true : false;
            memberTypeDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_HIERARCHY_LIST_DIV)) {
            var hierarchyDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'), DropDownList);
            if (this.fieldType === 'Dimension') {
                this.parentHierarchy = hierarchyDrop.value = calcInfo.parentHierarchy;
            }
            else {
                this.parentHierarchy = null;
                hierarchyDrop.index = 0;
            }
            hierarchyDrop.dataBind();
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_TYPE_DIV)) {
            var formatStringData = ['Standard', 'Currency', 'Percent'];
            var formatDrop = getInstance(dialogElement.querySelector('#' + this.parentID + 'Format_Div'), DropDownList);
            this.formatType = formatDrop.value = (formatStringData.indexOf(calcInfo.formatString) > -1 ? calcInfo.formatString : 'Custom');
        }
        if (dialogElement.querySelector('.' + cls.CALC_FORMAT_INPUT)) {
            var customFormat = getInstance(dialogElement.querySelector('#' + this.parentID + 'Custom_Format_Element'), MaskedTextBox);
            var formatObj = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.formatSettings);
            if (this.parent.dataType === 'pivot') {
                this.formatText = customFormat.value = formatObj ? formatObj.format : null;
            }
            else {
                this.formatText = customFormat.value = (this.formatType === 'Custom' ? calcInfo.formatString : null);
            }
            customFormat.dataBind();
        }
    };
    /* tslint:enable:max-line-length */
    /**
     * To create treeview.
     * @returns void
     */
    CalculatedField.prototype.createOlapDropElements = function () {
        var _this = this;
        var dialogElement = (this.parent.isAdaptive ?
            this.parent.dialogRenderer.parentElement : this.dialog.element);
        var mData = [];
        var fData = [];
        var fieldData = [];
        var memberTypeData = ['Measure', 'Dimension'];
        var formatStringData = ['Standard', 'Currency', 'Percent', 'Custom'];
        for (var _i = 0, memberTypeData_1 = memberTypeData; _i < memberTypeData_1.length; _i++) {
            var type = memberTypeData_1[_i];
            mData.push({ value: type, text: this.parent.localeObj.getConstant(type) });
        }
        for (var _a = 0, formatStringData_1 = formatStringData; _a < formatStringData_1.length; _a++) {
            var format = formatStringData_1[_a];
            fData.push({ value: format, text: this.parent.localeObj.getConstant(format) });
        }
        var fields = PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData);
        for (var _b = 0, _c = fields; _b < _c.length; _b++) {
            var item = _c[_b];
            if (item.spriteCssClass &&
                (item.spriteCssClass.indexOf('e-attributeCDB-icon') > -1 ||
                    item.spriteCssClass.indexOf('e-hierarchyCDB-icon') > -1)) {
                fieldData.push({ value: item.id, text: item.caption });
            }
        }
        var memberTypeObj = new DropDownList({
            dataSource: mData, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: this.fieldType !== null ? this.fieldType : mData[0].value,
            readonly: this.isEdit,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                hierarchyListObj.enabled = args.value === 'Dimension' ? true : false;
                _this.fieldType = args.value;
                _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
                hierarchyListObj.dataBind();
            }
        });
        memberTypeObj.isStringTemplate = true;
        memberTypeObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Member_Type_Div'));
        var hierarchyListObj = new DropDownList({
            dataSource: fieldData, enableRtl: this.parent.enableRtl,
            allowFiltering: true,
            enabled: memberTypeObj.value === 'Dimension' ? true : false,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldData[0].text.toString(),
            fields: { value: 'value', text: 'text' },
            value: this.parentHierarchy !== null && memberTypeObj.value === 'Dimension' ?
                this.parentHierarchy : fieldData[0].value,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                _this.parentHierarchy = args.value;
                _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
            }
        });
        hierarchyListObj.isStringTemplate = true;
        hierarchyListObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Hierarchy_List_Div'));
        var formatStringObj = new DropDownList({
            dataSource: fData, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: this.formatType !== null ? this.formatType : fData[0].value,
            cssClass: cls.MEMBER_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                customerFormatObj.enabled = args.value === 'Custom' ? true : false;
                _this.formatType = args.value;
                _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
                customerFormatObj.dataBind();
            }
        });
        formatStringObj.isStringTemplate = true;
        formatStringObj.appendTo(dialogElement.querySelector('#' + this.parentID + 'Format_Div'));
        var customerFormatObj = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('customFormat'),
            value: this.formatText !== null && formatStringObj.value === 'Custom' ? this.formatText : null,
            enabled: formatStringObj.value === 'Custom' ? true : false,
            change: function (args) {
                _this.formatText = args.value;
                _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
            }
        });
        customerFormatObj.isStringTemplate = true;
        customerFormatObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
    };
    /**
     * To create treeview.
     * @returns void
     */
    CalculatedField.prototype.createTreeView = function () {
        var _this = this;
        if (this.parent.dataType === 'olap') {
            this.treeObj = new TreeView({
                /* tslint:disable-next-line:max-line-length */
                fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                nodeDragStart: this.dragStart.bind(this),
                nodeDragging: function (e) {
                    if (e.event.target && e.event.target.classList.contains(cls.FORMULA)) {
                        removeClass([e.clonedNode], cls.NO_DRAG_CLASS);
                        addClass([e.event.target], 'e-copy-drop');
                    }
                    else {
                        addClass([e.clonedNode], cls.NO_DRAG_CLASS);
                        removeClass([e.event.target], 'e-copy-drop');
                        e.dropIndicator = 'e-no-drop';
                        addClass([e.clonedNode.querySelector('.' + cls.ICON)], 'e-icon-expandable');
                        removeClass([e.clonedNode.querySelector('.' + cls.ICON)], 'e-list-icon');
                    }
                },
                nodeClicked: this.fieldClickHandler.bind(this),
                nodeSelected: function (args) {
                    if (args.node.getAttribute('data-type') === CALC) {
                        _this.displayMenu(args.node);
                    }
                    else {
                        removeClass([args.node], 'e-active');
                        args.cancel = true;
                    }
                },
                nodeDragStop: this.fieldDropped.bind(this),
                drawNode: this.drawTreeNode.bind(this),
                nodeExpanding: this.updateNodeIcon.bind(this),
                nodeCollapsed: this.updateNodeIcon.bind(this),
                sortOrder: 'None'
            });
        }
        else {
            this.treeObj = new TreeView({
                fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
                allowDragAndDrop: true,
                enableRtl: this.parent.enableRtl,
                nodeCollapsing: this.nodeCollapsing.bind(this),
                nodeDragStart: this.dragStart.bind(this),
                nodeClicked: this.fieldClickHandler.bind(this),
                nodeDragStop: this.fieldDropped.bind(this),
                drawNode: this.drawTreeNode.bind(this),
                keyPress: function (args) {
                    if (args.event.keyCode === 39) {
                        args.cancel = true;
                    }
                },
                sortOrder: 'Ascending'
            });
        }
        this.treeObj.isStringTemplate = true;
        this.treeObj.appendTo('#' + this.parentID + 'tree');
    };
    CalculatedField.prototype.updateNodeIcon = function (args) {
        if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable.e-process') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
            var node = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-icon');
            addClass([node], 'e-folderCDB-open-icon');
        }
        else if (args.node && args.node.querySelector('.e-list-icon') &&
            args.node.querySelector('.e-icon-expandable') &&
            (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
            var node = args.node.querySelector('.e-list-icon');
            removeClass([node], 'e-folderCDB-open-icon');
            addClass([node], 'e-folderCDB-icon');
        }
        else {
            var curTreeData = this.treeObj.fields.dataSource;
            var fieldListData = curTreeData;
            var childNodes = [];
            for (var _i = 0, fieldListData_1 = fieldListData; _i < fieldListData_1.length; _i++) {
                var item = fieldListData_1[_i];
                if (item.pid === args.nodeData.id.toString()) {
                    childNodes.push(item);
                }
            }
            if (childNodes.length === 0) {
                this.parent.olapEngineModule.calcChildMembers = [];
                this.parent.olapEngineModule.getCalcChildMembers(this.parent.dataSourceSettings, args.nodeData.id.toString());
                childNodes = this.parent.olapEngineModule.calcChildMembers;
                this.parent.olapEngineModule.calcChildMembers = [];
                for (var _a = 0, childNodes_1 = childNodes; _a < childNodes_1.length; _a++) {
                    var node = childNodes_1[_a];
                    node.pid = args.nodeData.id.toString();
                    node.hasChildren = false;
                    node.spriteCssClass = 'e-level-members';
                    node.caption = (node.caption === '' ? this.parent.localeObj.getConstant('blank') : node.caption);
                    curTreeData.push(node);
                }
                this.treeObj.addNodes(childNodes, args.node);
            }
            else {
                return;
            }
        }
    };
    CalculatedField.prototype.nodeCollapsing = function (args) {
        args.cancel = true;
    };
    CalculatedField.prototype.dragStart = function (args) {
        var isDrag = false;
        var dragItem = args.clonedNode;
        if (dragItem && ((this.parent.dataType === 'olap' &&
            (dragItem.querySelector('.e-calc-dimension-icon,.e-calc-measure-icon,.e-measure-icon') ||
                dragItem.querySelector('.e-dimensionCDB-icon,.e-attributeCDB-icon,.e-hierarchyCDB-icon') ||
                dragItem.querySelector('.e-level-members,.e-namedSetCDB-icon'))) || (this.parent.dataType === 'pivot' &&
            args.event.target.classList.contains(cls.DRAG_CLASS)))) {
            isDrag = true;
        }
        if (isDrag) {
            addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            addClass([dragItem], cls.PIVOTCALC);
            dragItem.style.zIndex = (this.dialog.zIndex + 1).toString();
            dragItem.style.display = 'inline';
        }
        else {
            args.cancel = true;
        }
    };
    /**
     * Trigger before treeview text append.
     * @param  {DrawNodeEventArgs} args
     * @returns void
     */
    CalculatedField.prototype.drawTreeNode = function (args) {
        if (this.parent.dataType === 'olap') {
            if (args.node.querySelector('.e-measure-icon')) {
                args.node.querySelector('.e-list-icon').style.display = 'none';
            }
            var field = args.nodeData;
            args.node.setAttribute('data-field', field.id);
            args.node.setAttribute('data-caption', field.caption);
            var liTextElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
            if (args.nodeData && args.nodeData.type === CALC &&
                liTextElement && args.node.querySelector('.e-list-icon.e-calc-member')) {
                args.node.setAttribute('data-type', field.type);
                args.node.setAttribute('data-membertype', field.fieldType);
                args.node.setAttribute('data-hierarchy', field.parentHierarchy ? field.parentHierarchy : '');
                args.node.setAttribute('data-formula', field.formula);
                var formatStringData = ['Standard', 'Currency', 'Percent'];
                var formatString = void 0;
                formatString = (field.formatString ? formatStringData.indexOf(field.formatString) > -1 ?
                    field.formatString : 'Custom' : '');
                args.node.setAttribute('data-formatString', formatString);
                args.node.setAttribute('data-customString', (formatString === 'Custom' ? field.formatString : ''));
                var removeElement = createElement('span', {
                    className: cls.GRID_REMOVE + ' e-icons e-list-icon'
                });
                liTextElement.classList.add('e-calcfieldmember');
                if (this.parent.isAdaptive) {
                    var editElement = createElement('span', {
                        className: 'e-list-edit-icon' + (this.isEdit && this.currentFieldName === field.id ?
                            ' e-edited ' : ' e-edit ') + cls.ICON
                    });
                    var editWrapper = createElement('div', { className: 'e-list-header-icon' });
                    editWrapper.appendChild(editElement);
                    editWrapper.appendChild(removeElement);
                    liTextElement.appendChild(editWrapper);
                }
                else {
                    liTextElement.appendChild(removeElement);
                }
            }
            if (this.parent.isAdaptive) {
                var liTextElement_1 = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
                if (args.node && args.node.querySelector('.e-list-icon') && liTextElement_1) {
                    var liIconElement = args.node.querySelector('.e-list-icon');
                    liTextElement_1.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
                }
                if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon')) {
                    args.node.querySelector('.e-checkbox-wrapper').style.display = 'none';
                }
                if (args.node && args.node.querySelector('.e-level-members')) {
                    args.node.querySelector('.e-list-icon').style.display = 'none';
                }
            }
        }
        else {
            var field = args.nodeData.field;
            args.node.setAttribute('data-field', field);
            args.node.setAttribute('data-caption', args.nodeData.caption);
            args.node.setAttribute('data-type', args.nodeData.type);
            var formatObj = PivotUtil.getFieldByName(field, this.parent.dataSourceSettings.formatSettings);
            args.node.setAttribute('data-formatString', formatObj ? formatObj.format : '');
            var dragElement = createElement('span', {
                attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('dragField') },
                className: cls.ICON + ' e-drag'
            });
            var spaceElement = createElement('div', {
                className: ' e-iconspace'
            });
            prepend([dragElement], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS));
            /* tslint:disable-next-line:max-line-length */
            append([spaceElement, args.node.querySelector('.' + cls.FORMAT)], args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS));
            if (this.getMenuItems(this.parent.engineModule.fieldList[field].type).length <= 0) {
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.ICON);
            }
            else {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('format'));
            }
            if (this.parent.engineModule.fieldList[field].aggregateType === CALC) {
                args.node.querySelector('.' + cls.FORMAT).setAttribute('title', this.parent.localeObj.getConstant('remove'));
                addClass([args.node.querySelector('.' + cls.FORMAT)], cls.GRID_REMOVE);
                addClass([args.node.querySelector('.' + 'e-iconspace')], [cls.CALC_EDIT, cls.ICON, 'e-list-icon']);
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('aria-disabled', 'false');
                args.node.querySelector('.' + cls.CALC_EDIT).setAttribute('tabindex', '-1');
                removeClass([args.node.querySelector('.' + cls.FORMAT)], cls.FORMAT);
                removeClass([args.node.querySelector('.e-iconspace')], 'e-iconspace');
            }
        }
    };
    /**
     * To create radio buttons.
     * @param  {string} key
     * @returns HTMLElement
     */
    CalculatedField.prototype.createTypeContainer = function (key) {
        var wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: cls.TREEVIEWOUTER });
        var type = this.getMenuItems(this.parent.engineModule.fieldList[key].type);
        for (var i = 0; i < type.length; i++) {
            var input = createElement('input', {
                id: this.parentID + 'radio' + key + type[i],
                attrs: { 'type': 'radio', 'data-ftxt': key, 'data-value': type[i] },
                className: cls.CALCRADIO
            });
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    };
    CalculatedField.prototype.getMenuItems = function (fieldType, summaryType) {
        var menuItems = !isNullOrUndefined(summaryType) ? summaryType : this.parent.aggregateTypes;
        var type = [];
        var menuTypes = this.getValidSummaryType();
        for (var i = 0; i < menuItems.length; i++) {
            if ((menuTypes.indexOf(menuItems[i]) > -1) && (type.indexOf(menuItems[i]) < 0)) {
                if (((menuItems[i] === COUNT || menuItems[i] === DISTINCTCOUNT) && fieldType !== 'number')
                    || (fieldType === 'number')) {
                    type.push(menuItems[i]);
                }
            }
        }
        return type;
    };
    CalculatedField.prototype.getValidSummaryType = function () {
        return [COUNT, DISTINCTCOUNT, SUM, AVG,
            MIN, MAX, PRODUCT, STDEV, STDEVP,
            VAR, VARP];
    };
    /**
     * To get Accordion Data.
     * @param  {PivotView | PivotFieldList} parent
     * @returns AccordionItemModel
     */
    CalculatedField.prototype.getAccordionData = function (parent) {
        var data = [];
        var keys = Object.keys(parent.engineModule.fieldList);
        for (var index = 0, i = keys.length; index < i; index++) {
            var key = keys[index];
            data.push({
                header: '<input id=' + this.parentID + '_' + index + ' class=' + cls.CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption=' + this.parent.engineModule.fieldList[key].caption + ' data-type=' +
                    this.parent.engineModule.fieldList[key].type + '/>',
                content: (this.parent.engineModule.fieldList[key].aggregateType === CALC ||
                    (this.getMenuItems(this.parent.engineModule.fieldList[key].type).length < 1)) ? '' :
                    this.createTypeContainer(key).outerHTML,
                iconCss: this.parent.engineModule.fieldList[key].aggregateType === CALC ? 'e-list-icon' + ' ' +
                    (this.isEdit && this.currentFieldName === key ? 'e-edited' : 'e-edit') : ''
            });
        }
        return data;
    };
    /**
     * To render mobile layout.
     * @param  {Tab} tabObj
     * @returns void
     */
    CalculatedField.prototype.renderMobileLayout = function (tabObj) {
        var _this = this;
        tabObj.items[4].content = this.renderDialogElements().outerHTML;
        tabObj.dataBind();
        if (this.parent.dataType === 'olap' && this.parent.isAdaptive && this.parent.
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null) {
            this.createOlapDropElements();
        }
        var cancelBtn = new Button({ cssClass: cls.FLAT, isPrimary: true });
        cancelBtn.isStringTemplate = true;
        cancelBtn.appendTo('#' + this.parentID + 'cancelBtn');
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if (this.parent.
            dialogRenderer.parentElement.querySelector('.' + cls.FORMULA) !== null && this.parent.isAdaptive) {
            var okBtn = new Button({ cssClass: cls.FLAT + ' ' + cls.OUTLINE_CLASS, isPrimary: true });
            okBtn.isStringTemplate = true;
            okBtn.appendTo('#' + this.parentID + 'okBtn');
            this.inputObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName'),
                change: function (args) {
                    _this.fieldText = args.value;
                    _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
                }
            });
            this.inputObj.isStringTemplate = true;
            this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
            if (this.parent.dataType === 'pivot') {
                var formatInputObj = new MaskedTextBox({
                    placeholder: this.parent.localeObj.getConstant('numberFormatString'),
                    change: function (args) {
                        _this.formatText = args.value;
                        _this.formulaText = document.querySelector('#' + _this.parentID + 'droppable').value;
                    }
                });
                formatInputObj.isStringTemplate = true;
                formatInputObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
                if (this.formatText !== null && this.parent.
                    dialogRenderer.parentElement.querySelector('.' + cls.CALC_FORMAT_INPUT) !== null) {
                    this.parent.
                        /* tslint:disable-next-line:max-line-length */
                        dialogRenderer.parentElement.querySelector('.' + cls.CALC_FORMAT_INPUT).value = this.formatText;
                    formatInputObj.value = this.formatText;
                }
            }
            if (this.formulaText !== null && this.parent.
                dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') !== null) {
                var drop = this.parent.
                    dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable');
                drop.value = this.formulaText;
            }
            if (this.fieldText !== null && this.parent.
                dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT) !== null) {
                this.parent.
                    dialogRenderer.parentElement.querySelector('.' + cls.CALCINPUT).value = this.fieldText;
                this.inputObj.value = this.fieldText;
            }
            if (okBtn.element) {
                okBtn.element.onclick = this.applyFormula.bind(this);
            }
        }
        else if (this.parent.isAdaptive) {
            var addBtn = new Button({ cssClass: cls.FLAT, isPrimary: true });
            addBtn.isStringTemplate = true;
            addBtn.appendTo('#' + this.parentID + 'addBtn');
            if (this.parent.dataType === 'olap') {
                this.treeObj = new TreeView({
                    /* tslint:disable-next-line:max-line-length */
                    fields: { dataSource: this.getFieldListData(this.parent), id: 'id', text: 'caption', parentID: 'pid', iconCss: 'spriteCssClass' },
                    showCheckBox: true,
                    autoCheck: false,
                    sortOrder: 'None',
                    enableRtl: this.parent.enableRtl,
                    nodeClicked: this.fieldClickHandler.bind(this),
                    drawNode: this.drawTreeNode.bind(this),
                    nodeExpanding: this.updateNodeIcon.bind(this),
                    nodeCollapsed: this.updateNodeIcon.bind(this),
                    nodeSelected: function (args) {
                        removeClass([args.node], 'e-active');
                        args.cancel = true;
                    }
                });
                this.treeObj.isStringTemplate = true;
                this.treeObj.appendTo('#' + this.parentID + 'accordDiv');
            }
            else {
                this.accordion = new Accordion({
                    items: this.getAccordionData(this.parent),
                    enableRtl: this.parent.enableRtl,
                    expanding: this.accordionExpand.bind(this),
                    clicked: this.accordionClickHandler.bind(this),
                    created: this.accordionCreated.bind(this)
                });
                this.accordion.isStringTemplate = true;
                this.accordion.appendTo('#' + this.parentID + 'accordDiv');
                this.updateType();
            }
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    };
    CalculatedField.prototype.accordionExpand = function (args) {
        if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
            var keys = Object.keys(this.parent.engineModule.fieldList);
            for (var index = 0, i = keys.length; index < i; index++) {
                var key = keys[index];
                var type = this.parent.engineModule.fieldList[key].type !== 'number' ? [COUNT, DISTINCTCOUNT] :
                    [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                var radiobutton = void 0;
                if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                    for (var i_1 = 0; i_1 < type.length; i_1++) {
                        radiobutton = new RadioButton({
                            label: this.parent.localeObj.getConstant(type[i_1]),
                            name: AGRTYPE + key,
                            checked: args.element.querySelector('[data-type').getAttribute('data-type') === type[i_1],
                            change: this.onChange.bind(this),
                        });
                        radiobutton.isStringTemplate = true;
                        radiobutton.appendTo('#' + this.parentID + 'radio' + key + type[i_1]);
                    }
                }
            }
        }
    };
    CalculatedField.prototype.onChange = function (args) {
        var type = args.event.target.parentElement.querySelector('.e-label')
            .innerText;
        var field = args.event.target.closest('.e-acrdn-item').
            querySelector('[data-field').getAttribute('data-caption');
        args.event.target.
            closest('.e-acrdn-item').querySelector('.e-label').
            innerText = field + ' (' + type + ')';
        args.event.target.closest('.e-acrdn-item').
            querySelector('[data-type').setAttribute('data-type', args.event.target.getAttribute('data-value'));
    };
    CalculatedField.prototype.updateType = function () {
        var keys = Object.keys(this.parent.engineModule.fieldList);
        for (var index = 0, i = keys.length; index < i; index++) {
            var key = keys[index];
            var type = null;
            if ((this.parent.engineModule.fieldList[key].type !== 'number' ||
                this.parent.engineModule.fieldList[key].type === 'include' ||
                this.parent.engineModule.fieldList[key].type === 'exclude') &&
                (this.parent.engineModule.fieldList[key].aggregateType !== 'DistinctCount')) {
                type = COUNT;
            }
            else {
                type = this.parent.engineModule.fieldList[key].aggregateType !== undefined ?
                    this.parent.engineModule.fieldList[key].aggregateType : SUM;
            }
            var checkbox = new CheckBox({
                label: this.parent.engineModule.fieldList[key].caption + ' (' + this.parent.localeObj.getConstant(type) + ')'
            });
            checkbox.isStringTemplate = true;
            checkbox.appendTo('#' + this.parentID + '_' + index);
            document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-field', key);
            document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-type', type);
        }
    };
    /**
     * Trigger while click cancel button.
     * @returns void
     */
    CalculatedField.prototype.cancelBtnClick = function () {
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    };
    /**
     * Trigger while click add button.
     * @returns void
     */
    CalculatedField.prototype.addBtnClick = function () {
        var fieldText = '';
        var field = null;
        var type = null;
        if (this.parent.dataType === 'pivot') {
            var node = document.querySelectorAll('.e-accordion .e-check');
            for (var i = 0; i < node.length; i++) {
                field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
                type = node[i].parentElement.querySelector('[data-field]').getAttribute('data-type');
                if (type.indexOf(CALC) === -1) {
                    fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
                }
                else {
                    for (var j = 0; j < this.parent.dataSourceSettings.calculatedFieldSettings.length; j++) {
                        if (this.parent.dataSourceSettings.calculatedFieldSettings[j].name === field) {
                            fieldText = fieldText + this.parent.dataSourceSettings.calculatedFieldSettings[j].formula;
                            break;
                        }
                    }
                }
            }
        }
        else {
            var nodes = this.treeObj.getAllCheckedNodes();
            var olapEngine = this.parent.olapEngineModule;
            for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
                var item = nodes_1[_i];
                fieldText = fieldText + (olapEngine.fieldList[item] &&
                    olapEngine.fieldList[item].type === CALC ? olapEngine.fieldList[item].tag : item);
            }
        }
        this.formulaText = this.formulaText !== null ? (this.formulaText + fieldText) : fieldText;
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    };
    /**
     * To create calculated field dialog elements.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.createCalculatedFieldDialog = function (args) {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout(args && args.edit !== undefined ? args.edit : true);
            this.isEdit = (args && args.edit !== undefined ? args.edit : this.isEdit);
        }
        else if (!this.parent.isAdaptive) {
            this.isEdit = (args && args.edit !== undefined ? args.edit : false);
            this.renderDialogLayout();
            if (args && args.edit) {
                var target = this.treeObj.element.querySelector('li[data-field="' + args.fieldName + '"]');
                if (target) {
                    addClass([target], ['e-active', 'e-node-focus']);
                    target.setAttribute('aria-selected', 'true');
                    target.id = this.treeObj.element.id + '_active';
                    if (this.parent.dataType === 'pivot') {
                        /* tslint:disable-next-line */
                        var e = { event: { target: target.querySelector('.e-list-icon.e-edit.e-icons') } };
                        this.fieldClickHandler(e);
                    }
                    else {
                        this.displayMenu(target);
                    }
                }
            }
            this.dialog.element.style.top = parseInt(this.dialog.element.style.top, 10) < 0 ? '0px' : this.dialog.element.style.top;
        }
    };
    /**
     * To create calculated field desktop layout.
     * @returns void
     */
    CalculatedField.prototype.renderDialogLayout = function () {
        this.newFields =
            extend([], this.parent.dataSourceSettings.calculatedFieldSettings, null, true);
        this.createDialog();
        this.dialog.content = this.renderDialogElements();
        this.dialog.refresh();
        this.inputObj = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('fieldName')
        });
        this.inputObj.isStringTemplate = true;
        this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
        if (this.parent.dataType === 'pivot') {
            var customerFormatObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('numberFormatString')
            });
            customerFormatObj.isStringTemplate = true;
            customerFormatObj.appendTo('#' + this.parentID + 'Custom_Format_Element');
        }
        if (this.parent.dataType === 'olap' && !this.parent.isAdaptive) {
            this.createOlapDropElements();
        }
        this.createTreeView();
        this.droppable = new Droppable(this.dialog.element.querySelector('#' + this.parentID + 'droppable'));
        this.keyboardEvents = new KeyboardEvents(this.parent.calculatedFieldModule.dialog.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: { moveRight: 'rightarrow', enter: 'enter', shiftE: 'shift+E', delete: 'delete' },
            eventName: 'keydown'
        });
    };
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createConfirmDialog
     * @return {void}
     * @hidden
     */
    CalculatedField.prototype.createConfirmDialog = function (title, description, calcInfo, isRemove, node) {
        var errorDialog = createElement('div', {
            id: this.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        /* tslint:disable:max-line-length */
        this.parent.element.appendChild(errorDialog);
        this.confirmPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: isRemove ? this.removeCalcField.bind(this, node) : this.replaceFormula.bind(this, calcInfo),
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS + ' ' + cls.FLAT_CLASS,
                        content: isRemove ? this.parent.localeObj.getConstant('yes') : this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.removeErrorDialog.bind(this),
                    buttonModel: {
                        cssClass: cls.CANCEL_BUTTON_CLASS,
                        content: isRemove ? this.parent.localeObj.getConstant('no') : this.parent.localeObj.getConstant('cancel'), isPrimary: true
                    }
                }
            ],
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this),
        });
        /* tslint:enable:max-line-length */
        this.confirmPopUp.isStringTemplate = true;
        this.confirmPopUp.appendTo(errorDialog);
        // this.confirmPopUp.element.querySelector('.e-dlg-header').innerHTML = title;
    };
    CalculatedField.prototype.replaceFormula = function (calcInfo) {
        var report = this.parent.dataSourceSettings;
        if (this.parent.dataType === 'olap') {
            for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
                if (report.calculatedFieldSettings[j].name === calcInfo.name) {
                    if (!isNullOrUndefined(calcInfo.hierarchyUniqueName)) {
                        report.calculatedFieldSettings[j].hierarchyUniqueName = calcInfo.hierarchyUniqueName;
                    }
                    report.calculatedFieldSettings[j].formatString = calcInfo.formatString;
                    report.calculatedFieldSettings[j].formula = calcInfo.formula;
                    this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < report.values.length; i++) {
                if (report.values[i].type === CALC && report.values[i].name === calcInfo.name) {
                    for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
                        if (report.calculatedFieldSettings[j].name === calcInfo.name) {
                            report.calculatedFieldSettings[j].formula = calcInfo.formula;
                            this.parent.lastCalcFieldInfo = report.calculatedFieldSettings[j];
                            this.updateFormatSettings(report, calcInfo.name, calcInfo.formatString);
                        }
                    }
                }
            }
        }
        this.addFormula(report, calcInfo.name);
        this.removeErrorDialog();
    };
    CalculatedField.prototype.removeErrorDialog = function () {
        if (document.getElementById(this.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parentID + '_ErrorDialog').parentElement);
        }
    };
    /**
     * To add event listener.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initCalculatedField, this.createCalculatedFieldDialog, this);
    };
    /**
     * To remove event listener.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initCalculatedField, this.createCalculatedFieldDialog);
    };
    /**
     * To destroy the calculated field dialog
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.destroy = function () {
        this.removeEventListener();
    };
    return CalculatedField;
}());
export { CalculatedField };
