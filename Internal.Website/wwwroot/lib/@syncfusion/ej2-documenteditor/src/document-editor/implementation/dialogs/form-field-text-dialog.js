import { createElement, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { FieldElementBox, TextFormField } from '../viewer/page';
// tslint:disable-next-line:max-line-length
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ComboBox } from '@syncfusion/ej2-dropdowns';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { HelperMethods } from '../editor/editor-helper';
/**
 * Form field text dialog is used to modify the value in text form field.
 */
var TextFormFieldDialog = /** @class */ (function () {
    function TextFormFieldDialog(owner) {
        var _this = this;
        /**
         * @private
         */
        this.updateTextFormtas = function () {
            var defautText = _this.updateFormats(_this.defaultTextInput.value);
            _this.defaultTextInput.value = !isNullOrUndefined(defautText) ? defautText : '';
        };
        /**
         * @private
         */
        this.onCancelButtonClick = function () {
            _this.documentHelper.dialog.hide();
        };
        /**
         * @private
         */
        this.insertTextField = function () {
            var valid = true;
            if (_this.typeDropDown.value === 'Date') {
                valid = _this.isValidDateFormat();
            }
            if (valid) {
                _this.updateTextFormtas();
                if (_this.defaultTextInput.value.length > _this.maxLengthNumber.value && !isNullOrUndefined(_this.maxLengthNumber.value) &&
                    _this.maxLengthNumber.value !== 0) {
                    DialogUtility.alert({
                        content: 'The maximum length value must be equal or greater than the length of the default text.',
                        showCloseIcon: true,
                        closeOnEscape: true,
                        position: { X: 'center', Y: 'center' },
                        animationSettings: { effect: 'Zoom' }
                    });
                }
                else {
                    var type = void 0;
                    if (_this.typeDropDown.value === 'Date') {
                        type = 'Date';
                    }
                    else if (_this.typeDropDown.value === 'Number') {
                        type = 'Number';
                    }
                    else {
                        type = 'Text';
                    }
                    var format = _this.textFormatDropDown.value;
                    var formField = new TextFormField();
                    formField.type = type;
                    formField.defaultValue = _this.defaultTextInput.value;
                    formField.maxLength = _this.maxLengthNumber.value;
                    formField.format = !isNullOrUndefined(format) ? format : '';
                    formField.name = _this.bookmarkTextInput.value;
                    formField.helpText = _this.tooltipTextInput.value;
                    formField.enabled = _this.fillInEnable.checked;
                    _this.owner.editor.editFormField('Text', formField);
                    _this.closeTextField();
                }
            }
            else {
                DialogUtility.alert({
                    content: 'A valid date or time is required',
                    showCloseIcon: true,
                    closeOnEscape: true,
                    position: { X: 'center', Y: 'center' },
                    animationSettings: { effect: 'Zoom' }
                });
            }
        };
        this.closeTextField = function () {
            _this.documentHelper.dialog.hide();
            _this.documentHelper.dialog.element.style.pointerEvents = '';
        };
        this.owner = owner;
    }
    Object.defineProperty(TextFormFieldDialog.prototype, "documentHelper", {
        get: function () {
            return this.owner.documentHelper;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    TextFormFieldDialog.prototype.getModuleName = function () {
        return 'TextFormFieldDialog';
    };
    //tslint:disable: max-func-body-length
    TextFormFieldDialog.prototype.initTextDialog = function (localValue, isRtl) {
        var _this = this;
        this.target = createElement('div');
        var dialogDiv = createElement('div');
        var firstDiv = createElement('div', { className: 'e-de-div-seperate-dlg' });
        var typeDiv = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        this.defaultTextDiv = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        var typeLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Type')
        });
        var typeDropDownList = createElement('input');
        var typeDropDownitems = ['Regular text', 'Number', 'Date'];
        this.typeDropDown = new DropDownList({
            dataSource: typeDropDownitems,
            popupHeight: '150px',
            value: 'Regular text',
            change: this.changeTypeDropDown.bind(this)
        });
        this.defaultTextLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Default text')
        });
        // tslint:disable-next-line:max-line-length 
        this.defaultTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input', styles: 'margin-top:3px' });
        var secondDiv = createElement('div', { className: 'e-de-div-seperate-dlg' });
        var maxLengthDiv = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        var maxLengthLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Maximum length')
        });
        var maxLength = createElement('input');
        this.maxLengthNumber = new NumericTextBox({
            format: 'n', value: 0, min: 0, max: 32767, width: '100%', enablePersistence: false,
            change: function (args) {
                if (!args.value) {
                    this.element.value = 'Unlimited';
                }
            },
            focus: function (args) {
                if (!args.value) {
                    this.element.value = 'Unlimited';
                }
            },
            blur: function (args) {
                if (!args.value) {
                    var proxy_1 = this;
                    /* tslint:disable:align */
                    setTimeout(function () {
                        proxy_1.element.value = 'Unlimited';
                    }, 0);
                }
            },
        });
        var textFromatDiv = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        this.textFormatLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Text format')
        });
        var textFormatList = createElement('input');
        var formatDropDownitems = ['Uppercase', 'Lowercase', 'FirstCapital', 'Titlecase'];
        this.textFormatDropDown = new ComboBox({
            dataSource: formatDropDownitems,
            popupHeight: '150px',
            allowCustom: true,
            showClearButton: false,
            change: this.updateTextFormtas.bind(this)
        });
        this.textFormatDropDown.focus = function () {
            _this.textFormatDropDown.element.select();
        };
        // tslint:disable-next-line:max-line-length
        var fileSettingsLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading',
            innerHTML: localValue.getConstant('Field settings')
        });
        var thirdDiv = createElement('div', { className: 'e-de-div-seperate-dlg' });
        var toolTipTotalDiv = createElement('div', { className: 'e-de-ff-dlg-lft-hlf' });
        var bookmarkTotalDiv = createElement('div', { className: 'e-de-ff-dlg-rght-hlf' });
        var toolTipHeadingLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Tooltip')
        });
        this.tooltipTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' });
        var bookmarkHeadingLabel = createElement('div', {
            className: 'e-de-ff-dlg-heading-small',
            innerHTML: localValue.getConstant('Name')
        });
        this.bookmarkTextInput = createElement('input', { className: 'e-input e-bookmark-textbox-input' });
        var fillInEnableDiv = createElement('div');
        var fillInEnableEle = createElement('input', { attrs: { type: 'checkbox' } });
        this.fillInEnable = new CheckBox({
            cssClass: 'e-de-ff-dlg-check',
            label: localValue.getConstant('Fillin enabled'),
            enableRtl: isRtl
        });
        if (isRtl) {
            typeDiv.classList.add('e-de-rtl');
            maxLengthDiv.classList.add('e-de-rtl');
            toolTipTotalDiv.classList.add('e-de-rtl');
            bookmarkTotalDiv.classList.add('e-de-rtl');
        }
        this.target.appendChild(dialogDiv);
        dialogDiv.appendChild(firstDiv);
        firstDiv.appendChild(typeDiv);
        typeDiv.appendChild(typeLabel);
        typeDiv.appendChild(typeDropDownList);
        this.typeDropDown.appendTo(typeDropDownList);
        firstDiv.appendChild(this.defaultTextDiv);
        this.defaultTextDiv.appendChild(this.defaultTextLabel);
        this.defaultTextDiv.appendChild(this.defaultTextInput);
        dialogDiv.appendChild(secondDiv);
        secondDiv.appendChild(maxLengthDiv);
        maxLengthDiv.appendChild(maxLengthLabel);
        maxLengthDiv.appendChild(maxLength);
        this.maxLengthNumber.appendTo(maxLength);
        secondDiv.appendChild(textFromatDiv);
        textFromatDiv.appendChild(this.textFormatLabel);
        textFromatDiv.appendChild(textFormatList);
        this.textFormatDropDown.appendTo(textFormatList);
        dialogDiv.appendChild(fileSettingsLabel);
        dialogDiv.appendChild(thirdDiv);
        thirdDiv.appendChild(toolTipTotalDiv);
        toolTipTotalDiv.appendChild(toolTipHeadingLabel);
        toolTipTotalDiv.appendChild(this.tooltipTextInput);
        thirdDiv.appendChild(bookmarkTotalDiv);
        bookmarkTotalDiv.appendChild(bookmarkHeadingLabel);
        bookmarkTotalDiv.appendChild(this.bookmarkTextInput);
        dialogDiv.appendChild(fillInEnableDiv);
        fillInEnableDiv.appendChild(fillInEnableEle);
        this.fillInEnable.appendTo(fillInEnableEle);
    };
    TextFormFieldDialog.prototype.show = function () {
        this.localObj = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        this.localObj.setLocale(this.documentHelper.owner.locale);
        if (isNullOrUndefined(this.target)) {
            this.initTextDialog(this.localObj, this.documentHelper.owner.enableRtl);
        }
        this.loadTextDialog();
        this.documentHelper.dialog.header = this.localObj.getConstant('Text Form Field');
        this.documentHelper.dialog.position = { X: 'center', Y: 'center' };
        this.documentHelper.dialog.height = 'auto';
        this.documentHelper.dialog.width = '448px';
        this.documentHelper.dialog.content = this.target;
        this.documentHelper.dialog.buttons = [{
                click: this.insertTextField,
                buttonModel: { content: this.localObj.getConstant('Ok'), cssClass: 'e-flat e-table-cell-margin-okay', isPrimary: true }
            },
            {
                click: this.onCancelButtonClick,
                buttonModel: { content: this.localObj.getConstant('Cancel'), cssClass: 'e-flat e-table-cell-margin-cancel' }
            }];
        this.documentHelper.dialog.show();
    };
    /**
     * @private
     */
    TextFormFieldDialog.prototype.changeTypeDropDown = function (args) {
        if (args.isInteracted) {
            this.defaultTextInput.value = '';
            this.textFormatDropDown.value = '';
        }
        if (args.value === 'Regular text') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default text');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Text format');
            this.textFormatDropDown.dataSource = ['Uppercase', 'Lowercase', 'FirstCapital', 'Titlecase'];
        }
        else if (args.value === 'Number') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default number');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Number format');
            this.textFormatDropDown.dataSource = ['0', '0.00', '#,##0', '#,##0.00', '$#,##0.00;($#,##0.00)', '0%'];
        }
        else if (args.value === 'Date') {
            this.defaultTextLabel.innerHTML = this.localObj.getConstant('Default date');
            this.textFormatLabel.innerHTML = this.localObj.getConstant('Date format');
            // tslint:disable:max-line-length
            this.textFormatDropDown.dataSource = ['M/d/yyyy', 'dddd, MMMM d, yyyy', 'MMMM d, yyyy', 'M/d/yy', 'yyyy-MM-dd', 'd-MMM-yy',
                'M.d.yyyy', 'MMM. d, yy', 'd MMMM yyyy', 'MMMM yy', 'MMM-yy', 'M/d/yyyy h:mm am/pm', 'M/d/yyyy h:mm:ss am/pm', 'h:mm am/pm', 'h:mm:ss am/pm',
                'HH:mm', 'HH:mm:ss'];
            // tslint:enable:max-line-length
        }
    };
    /**
     * @private
     */
    TextFormFieldDialog.prototype.loadTextDialog = function () {
        var inline = this.owner.selection.getCurrentFormField();
        if (inline instanceof FieldElementBox) {
            this.fieldBegin = inline;
            var data = inline.formFieldData;
            if (data.maxLength > 0) {
                this.maxLengthNumber.value = data.maxLength;
            }
            else {
                this.maxLengthNumber.value = 0;
                this.maxLengthNumber.element.value = 'Unlimited';
            }
            if (data.type === 'Date') {
                this.typeDropDown.value = 'Date';
            }
            else if (data.type === 'Number') {
                this.typeDropDown.value = 'Number';
            }
            else {
                this.typeDropDown.value = 'Regular text';
            }
            if (data.format) {
                this.textFormatDropDown.value = data.format;
            }
            else {
                this.textFormatDropDown.value = '';
            }
            this.defaultTextInput.value = !isNullOrUndefined(data.defaultValue) ? data.defaultValue : '';
            this.fillInEnable.checked = data.enabled;
            this.tooltipTextInput.value = !isNullOrUndefined(data.helpText) ? data.helpText : '';
            this.bookmarkTextInput.value = !isNullOrUndefined(data.name) ? data.name : '';
        }
    };
    TextFormFieldDialog.prototype.updateFormats = function (value) {
        var format = isNullOrUndefined(this.textFormatDropDown.value) ? '' : this.textFormatDropDown.value.toString();
        if (this.typeDropDown.value === 'Regular text') {
            return HelperMethods.formatText(format, value);
        }
        if (this.typeDropDown.value === 'Number') {
            var data = HelperMethods.formatNumber(format, value);
            if (!(data.toString() === 'NaN')) {
                return data;
            }
            return '';
        }
        if (this.typeDropDown.value === 'Date') {
            return HelperMethods.formatDate(format, value);
        }
        return '';
    };
    /**
     * @private
     */
    TextFormFieldDialog.prototype.isValidDateFormat = function () {
        var value = this.defaultTextInput.value;
        if (value !== '') {
            var date = new Date(value);
            if (isNaN(date.getDate())) {
                return false;
            }
        }
        return true;
    };
    TextFormFieldDialog.prototype.destroy = function () {
        var textDialogTarget = this.target;
        if (textDialogTarget) {
            if (textDialogTarget.parentElement) {
                textDialogTarget.parentElement.removeChild(textDialogTarget);
            }
            this.target = undefined;
        }
        if (this.maxLengthNumber) {
            this.maxLengthNumber.destroy();
            this.maxLengthNumber = undefined;
        }
        if (this.fillInEnable) {
            this.fillInEnable.destroy();
            this.fillInEnable = undefined;
        }
        if (this.typeDropDown) {
            this.typeDropDown.destroy();
            this.typeDropDown = undefined;
        }
        if (this.textFormatDropDown) {
            this.textFormatDropDown.destroy();
            this.textFormatDropDown = undefined;
        }
        this.owner = undefined;
        this.defaultTextInput = undefined;
        this.tooltipTextInput = undefined;
        this.bookmarkTextInput = undefined;
        this.defaultTextLabel = undefined;
        this.defaultTextDiv = undefined;
        this.textFormatLabel = undefined;
    };
    return TextFormFieldDialog;
}());
export { TextFormFieldDialog };
