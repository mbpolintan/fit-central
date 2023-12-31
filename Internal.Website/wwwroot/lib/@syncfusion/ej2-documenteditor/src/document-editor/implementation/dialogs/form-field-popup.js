import { createElement, isNullOrUndefined, classList } from '@syncfusion/ej2-base';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { Popup } from '@syncfusion/ej2-popups';
import { TextFormField, DropDownFormField, CheckBoxFormField } from '../viewer/page';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
/**
 * @private
 */
var FormFieldPopUp = /** @class */ (function () {
    function FormFieldPopUp(owner) {
        var _this = this;
        this.applyTextFormFieldValue = function () {
            _this.owner.editor.updateFormField(_this.formField, _this.textBoxInstance.value);
            // tslint:disable-next-line:max-line-length
            _this.owner.trigger('afterFormFieldFill', { 'fieldName': _this.formField.formFieldData.name, value: _this.formField.resultText, isCanceled: false });
            _this.hidePopup();
        };
        this.applyNumberFormFieldValue = function () {
            _this.owner.editor.updateFormField(_this.formField, _this.numberInput.value.toString());
            // tslint:disable-next-line:max-line-length
            _this.owner.trigger('afterFormFieldFill', { 'fieldName': _this.formField.formFieldData.name, value: _this.formField.resultText, isCanceled: false });
            _this.hidePopup();
        };
        this.applyDateFormFieldValue = function () {
            if (!isNullOrUndefined(_this.datePickerInstance.value)) {
                _this.owner.editor.updateFormField(_this.formField, _this.dateInput.value);
                // tslint:disable-next-line:max-line-length
                _this.owner.trigger('afterFormFieldFill', { 'fieldName': _this.formField.formFieldData.name, value: _this.formField.resultText, isCanceled: false });
                _this.hidePopup();
            }
        };
        this.applyDropDownFormFieldValue = function () {
            _this.owner.editor.updateFormField(_this.formField, _this.ddlInstance.index);
            // tslint:disable-next-line:max-line-length
            _this.owner.trigger('afterFormFieldFill', { 'fieldName': _this.formField.formFieldData.name, value: _this.formField.formFieldData.selectedIndex, isCanceled: false });
            _this.hidePopup();
        };
        this.enableDisableDatePickerOkButton = function (args) {
            if (args.isInteracted) {
                _this.dataPickerOkButton.disabled = false;
            }
        };
        /**
         * @private
         */
        this.closeButton = function () {
            var field = _this.formField;
            _this.hidePopup();
            var eventArgs = { 'fieldName': field.formFieldData.name };
            if (field.formFieldData instanceof TextFormField) {
                eventArgs.value = field.resultText;
            }
            else if (field.formFieldData instanceof CheckBoxFormField) {
                eventArgs.value = field.formFieldData.checked;
            }
            else {
                eventArgs.value = field.formFieldData.selectedIndex;
            }
            eventArgs.isCanceled = true;
            _this.owner.trigger('afterFormFieldFill', eventArgs);
        };
        /**
         * @private
         */
        this.hidePopup = function () {
            _this.owner.documentHelper.isFormFilling = false;
            _this.formField = undefined;
            if (_this.target) {
                _this.target.style.display = 'none';
            }
            if (_this.popupObject) {
                _this.popupObject.hide();
                _this.popupObject.destroy();
                _this.popupObject = undefined;
            }
        };
        this.owner = owner;
    }
    FormFieldPopUp.prototype.initPopup = function () {
        var popupElement = createElement('div', { className: 'e-de-form-popup' });
        this.textBoxContainer = this.initTextBoxInput();
        popupElement.appendChild(this.textBoxContainer);
        popupElement.appendChild(this.initNumericTextBox());
        popupElement.appendChild(this.initDatePicker());
        popupElement.appendChild(this.initDropDownList());
        this.target = popupElement;
        this.owner.documentHelper.viewerContainer.appendChild(popupElement);
    };
    FormFieldPopUp.prototype.initTextBoxInput = function () {
        var textBoxDiv = createElement('div', { className: 'e-de-txt-field' });
        var textBoxInput = createElement('input', { className: 'e-de-txt-form' });
        var textBox = new TextBox();
        this.textBoxInput = textBoxInput;
        var textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        var textBoxOkButton = createElement('button');
        var textBoxCancelButton = createElement('button');
        textBoxOkButton.addEventListener('click', this.applyTextFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        textBoxDiv.appendChild(textBoxInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        textBoxDiv.appendChild(textBoxButtonDiv);
        textBox.appendTo(textBoxInput);
        var okButton = new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        var cancelButton = new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.textBoxInstance = textBox;
        return textBoxDiv;
    };
    FormFieldPopUp.prototype.initNumericTextBox = function () {
        var numericDiv = createElement('div', { className: 'e-de-num-field' });
        var numberInput = createElement('input', { className: 'e-de-txt-form' });
        var numericTextBox = new NumericTextBox();
        this.numberInput = numberInput;
        var textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        var textBoxOkButton = createElement('button');
        var textBoxCancelButton = createElement('button');
        textBoxOkButton.addEventListener('click', this.applyNumberFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        numericDiv.appendChild(numberInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        numericDiv.appendChild(textBoxButtonDiv);
        numericTextBox.appendTo(numberInput);
        var okButton = new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        var cancelButton = new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.numericTextBoxInstance = numericTextBox;
        return numericDiv;
    };
    FormFieldPopUp.prototype.initDatePicker = function () {
        var dateDiv = createElement('div', { className: 'e-de-date-field' });
        var dateInput = createElement('input', { className: 'e-de-txt-form' });
        // tslint:disable-next-line:max-line-length
        var datePicker = new DateTimePicker({ allowEdit: false, strictMode: true, change: this.enableDisableDatePickerOkButton });
        this.dateInput = dateInput;
        var textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        var textBoxOkButton = createElement('button');
        var textBoxCancelButton = createElement('button');
        textBoxOkButton.addEventListener('click', this.applyDateFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        dateDiv.appendChild(dateInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        dateDiv.appendChild(textBoxButtonDiv);
        datePicker.appendTo(dateInput);
        this.dataPickerOkButton = new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        var cancelButton = new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.datePickerInstance = datePicker;
        return dateDiv;
    };
    FormFieldPopUp.prototype.initDropDownList = function () {
        var dropDownDiv = createElement('div', { className: 'e-de-ddl-field' });
        var dropDownInput = createElement('input', { className: 'e-de-txt-form' });
        var ddl = new DropDownList();
        this.dropDownInput = dropDownInput;
        var textBoxButtonDiv = createElement('div', { className: 'e-de-cmt-action-button' });
        var textBoxOkButton = createElement('button');
        var textBoxCancelButton = createElement('button');
        textBoxOkButton.addEventListener('click', this.applyDropDownFormFieldValue);
        textBoxCancelButton.addEventListener('click', this.closeButton);
        dropDownDiv.appendChild(dropDownInput);
        textBoxButtonDiv.appendChild(textBoxOkButton);
        textBoxButtonDiv.appendChild(textBoxCancelButton);
        dropDownDiv.appendChild(textBoxButtonDiv);
        ddl.appendTo(dropDownInput);
        var okButton = new Button({ cssClass: 'e-de-save', iconCss: 'e-de-save-icon' }, textBoxOkButton);
        var cancelButton = new Button({ cssClass: 'e-de-cancel', iconCss: 'e-de-cancel-icon' }, textBoxCancelButton);
        this.ddlInstance = ddl;
        return dropDownDiv;
    };
    /**
     * @private
     */
    FormFieldPopUp.prototype.showPopUp = function (formField, point) {
        var _this = this;
        if (formField) {
            this.formField = formField;
            this.owner.selection.selectField();
            if (isNullOrUndefined(this.target)) {
                this.initPopup();
            }
            classList(this.target, [], ['e-de-txt-form', 'e-de-num-form', 'e-de-date-form', 'e-de-ddl-form']);
            var formFieldData = formField.formFieldData;
            if (formFieldData) {
                if (formFieldData instanceof TextFormField) {
                    var resultText = formField.resultText;
                    var rex = new RegExp(this.owner.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    var maxLength = formFieldData.maxLength;
                    var formFieldType = formFieldData.type;
                    var inputElement_1;
                    resultText = resultText ? resultText : '';
                    if (formFieldType === 'Text') {
                        classList(this.target, ['e-de-txt-form'], []);
                        inputElement_1 = this.textBoxInput;
                        this.textBoxInstance.value = resultText;
                    }
                    else if (formFieldData.type === 'Number') {
                        classList(this.target, ['e-de-num-form'], []);
                        inputElement_1 = this.numberInput;
                        this.numericTextBoxInstance.format = formFieldData.format;
                        this.numericTextBoxInstance.value = parseFloat(resultText.replace(/,/gi, ''));
                    }
                    else if (formFieldType === 'Date') {
                        classList(this.target, ['e-de-date-form'], []);
                        inputElement_1 = this.dateInput;
                        var format = formFieldData.format;
                        if (format.indexOf('am/pm') !== -1) {
                            format = format.replace(/am\/pm/gi, 'a');
                        }
                        this.datePickerInstance.format = format;
                        this.datePickerInstance.value = new Date(resultText);
                        this.dataPickerOkButton.disabled = true;
                    }
                    if (inputElement_1) {
                        if (maxLength > 0) {
                            inputElement_1.maxLength = maxLength;
                        }
                        else {
                            inputElement_1.removeAttribute('maxlength');
                        }
                        setTimeout(function () {
                            inputElement_1.focus();
                        });
                    }
                }
                else if (formFieldData instanceof DropDownFormField) {
                    classList(this.target, ['e-de-ddl-form'], []);
                    this.ddlInstance.dataSource = formFieldData.dropdownItems;
                    this.ddlInstance.index = formFieldData.selectedIndex;
                    setTimeout(function () {
                        _this.ddlInstance.showPopup();
                    });
                }
                var left = this.owner.selection.getLeftInternal(formField.line, formField, 0);
                var lineHeight = formField.line.height * this.owner.documentHelper.zoomFactor;
                var position = this.owner.selection.getTooltipPosition(formField, left, this.target, true);
                if (!this.popupObject) {
                    this.popupObject = new Popup(this.target, {
                        height: 'auto',
                        width: 'auto',
                        relateTo: this.owner.documentHelper.viewerContainer.parentElement,
                        position: { X: position.x, Y: position.y + lineHeight }
                    });
                }
                this.target.style.display = 'block';
                this.popupObject.show();
            }
            this.owner.documentHelper.isFormFilling = true;
        }
    };
    return FormFieldPopUp;
}());
export { FormFieldPopUp };
