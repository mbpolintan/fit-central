/* tslint:disable-next-line:max-line-length */
import { getSheetName, getSheetIndex, getSheet, getSheetIndexByName } from '../base/index';
import { workbookFormulaOperation, getColumnHeaderText, aggregateComputation, getRangeIndexes } from '../common/index';
import { Calculate, ValueChangedArgs, CommonErrors, getAlphalabel } from '../../calculate/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getCellAddress, getFormattedCellObject, isNumber } from '../common/index';
/**
 * @hidden
 * The `WorkbookFormula` module is used to handle the formula operation in Workbook.
 */
var WorkbookFormula = /** @class */ (function () {
    /**
     * Constructor for formula module in Workbook.
     * @private
     */
    function WorkbookFormula(workbook) {
        this.sheetInfo = [];
        this.parent = workbook;
        this.init();
    }
    WorkbookFormula.prototype.init = function () {
        this.addEventListener();
        this.initCalculate();
        this.registerSheet();
    };
    /**
     * To destroy the formula module.
     * @return {void}
     * @hidden
     */
    WorkbookFormula.prototype.destroy = function () {
        this.removeEventListener();
        this.calculateInstance.dispose();
        this.calculateInstance = null;
        this.parent = null;
    };
    WorkbookFormula.prototype.addEventListener = function () {
        this.parent.on(workbookFormulaOperation, this.performFormulaOperation, this);
        this.parent.on(aggregateComputation, this.aggregateComputation, this);
    };
    WorkbookFormula.prototype.removeEventListener = function () {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookFormulaOperation, this.performFormulaOperation);
            this.parent.off(aggregateComputation, this.aggregateComputation);
        }
    };
    /**
     * Get the module name.
     * @returns string
     * @private
     */
    WorkbookFormula.prototype.getModuleName = function () {
        return 'workbookFormula';
    };
    WorkbookFormula.prototype.initCalculate = function () {
        this.calculateInstance = new Calculate(this.parent);
        this.calcID = this.calculateInstance.createSheetFamilyID();
        this.calculateInstance.setTreatEmptyStringAsZero(true);
        this.calculateInstance.grid = this.parent.getActiveSheet().id.toString();
    };
    WorkbookFormula.prototype.performFormulaOperation = function (args) {
        var action = args.action;
        var formulas = this.calculateInstance.getLibraryFormulas();
        var formulaInfo = (Array.from(formulas.values()));
        switch (action) {
            case 'getLibraryFormulas':
                args.formulaCollection = Array.from(formulas.keys());
                break;
            case 'getFormulaCategory':
                var collection = ['All'];
                for (var i = 1; i < Array.from(formulas.values()).length; i++) {
                    if (collection.indexOf(formulaInfo[i].category) < 0) {
                        collection.push(formulaInfo[i].category);
                    }
                }
                args.categoryCollection = collection;
                break;
            case 'dropDownSelectFormulas':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectCategory === formulaInfo[i].category) {
                        args.formulaCollection[i] = Array.from(formulas.keys())[i];
                    }
                }
                break;
            case 'getFormulaDescription':
                for (var i = 0; i < Array.from(formulas.values()).length; i++) {
                    if (args.selectedList === Array.from(formulas.keys())[i]) {
                        args.description = formulaInfo[i].description;
                    }
                }
                break;
            case 'registerSheet':
                this.registerSheet(args.sheetIndex, args.sheetCount);
                if (args.isImport) {
                    this.updateSheetInfo();
                }
                break;
            case 'unRegisterSheet':
                this.unRegisterSheet(args.sheetIndex, args.sheetCount);
                break;
            case 'refreshCalculate':
                args.value = this.autoCorrectFormula(args.value);
                this.refreshCalculate(args.rowIndex, args.colIndex, args.value, args.isFormula, args.sheetIndex);
                break;
            case 'getArgumentSeparator':
                args.argumentSeparator = this.calculateInstance.getParseArgumentSeparator();
                break;
            case 'addDefinedName':
                args.isAdded = this.addDefinedName(args.definedName);
                break;
            case 'removeDefinedName':
                args.isRemoved = this.removeDefinedName(args.definedName, args.scope);
                break;
            case 'initiateDefinedNames':
                this.initiateDefinedNames();
                break;
            case 'renameUpdation':
                this.renameUpdation(args.value, args.sheetId);
                break;
            case 'addSheet':
                this.sheetInfo.push({ visibleName: args.visibleName, sheet: args.sheetName, index: args.index });
                break;
            case 'getSheetInfo':
                args.sheetInfo = this.sheetInfo;
                break;
            case 'deleteSheetTab':
                var length_1 = this.sheetInfo.length;
                for (var i = 0; i < length_1; i++) {
                    if (this.sheetInfo[i].index === args.index) {
                        args.sheetName = this.sheetInfo[i].sheet;
                        this.sheetInfo.splice(i, 1);
                        break;
                    }
                }
                this.sheetDeletion(args.sheetName, args.index, args.index);
                break;
            case 'getReferenceError':
                args.refError = this.referenceError();
                break;
            case 'getAlpha':
                args.col = getAlphalabel(args.col);
                break;
            case 'addCustomFunction':
                this.addCustomFunction(args.functionHandler, args.functionName);
                break;
            case 'computeExpression':
                args.calcValue = this.calculateInstance.computeExpression(args.formula);
                break;
        }
    };
    WorkbookFormula.prototype.referenceError = function () {
        return this.calculateInstance.getErrorStrings()[CommonErrors.ref];
    };
    WorkbookFormula.prototype.getSheetInfo = function () {
        return this.sheetInfo;
    };
    WorkbookFormula.prototype.addCustomFunction = function (functionHandler, functionName) {
        this.calculateInstance.defineFunction(functionName, functionHandler);
    };
    WorkbookFormula.prototype.updateSheetInfo = function () {
        var _this = this;
        this.sheetInfo = [];
        this.parent.sheets.forEach(function (sheet, idx) {
            _this.sheetInfo.push({ visibleName: sheet.name, sheet: 'Sheet' + sheet.id, index: idx });
        });
    };
    WorkbookFormula.prototype.sheetDeletion = function (delSheetName, sheetId, index) {
        var dependentCell = this.calculateInstance.getDependentCells();
        var cellRef = [];
        var fInfo = null;
        var formulaVal = '';
        var rowId;
        var colId;
        dependentCell.forEach(function (value, key) {
            cellRef.push(key);
        });
        this.removeSheetTokenIndex(formulaVal, index);
        for (var i = 0; i < cellRef.length; i++) {
            var dependentCellRef = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (var j = 0; j < dependentCellRef.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCellRef[j]);
                sheetId = getSheetIndexByName(this.parent, ('Sheet') + (parseInt(dependentCellRef[j].split('!')[1], 10) + 1), this.sheetInfo);
                if (!isNullOrUndefined(fInfo) && sheetId > -1) {
                    formulaVal = fInfo.formulaText;
                    if (formulaVal.toUpperCase().indexOf(delSheetName.toUpperCase()) > -1) {
                        formulaVal = formulaVal.toUpperCase().split(delSheetName.toUpperCase() +
                            this.calculateInstance.sheetToken).join(this.referenceError());
                        rowId = this.calculateInstance.rowIndex(dependentCellRef[j]);
                        colId = this.calculateInstance.colIndex(dependentCellRef[j]);
                        this.updateDataContainer([rowId - 1, colId - 1], { value: formulaVal, sheetId: sheetId, visible: false });
                        this.calculateInstance.refresh(fInfo.getParsedFormula());
                    }
                }
            }
        }
    };
    WorkbookFormula.prototype.removeSheetTokenIndex = function (value, index) {
        var family = this.calculateInstance.getSheetFamilyItem(this.calculateInstance.grid);
        family.sheetNameToToken.delete(index.toString());
        return value;
    };
    WorkbookFormula.prototype.renameUpdation = function (name, sheetIdx) {
        var dependentCellRef = this.calculateInstance.getDependentCells();
        var cellRef = [];
        var fInfo;
        var formulaVal = '';
        var savedTokens = [];
        var isSheetRenamed = false;
        var rowIndex;
        var colIndex;
        var sheetIndex;
        dependentCellRef.forEach(function (value, key) {
            cellRef.push(key);
        });
        for (var i = 0; i < this.sheetInfo.length; i++) {
            if (this.sheetInfo[i].index === sheetIdx) {
                this.sheetInfo[i].visibleName = name;
                break;
            }
        }
        var sheetNames = this.sheetInfo;
        for (var i = 0; i < cellRef.length; i++) {
            var dependentCells = this.calculateInstance.getDependentCells().get(cellRef[i]);
            for (var j = 0; j < dependentCells.length; j++) {
                fInfo = this.calculateInstance.getFormulaInfoTable().get(dependentCells[j]);
                formulaVal = fInfo.formulaText;
                for (var s = 0; s < sheetNames.length; s++) {
                    if (sheetNames[s].visibleName !== sheetNames[s].sheet) {
                        var name_1 = sheetNames[s].sheet.toUpperCase();
                        if (formulaVal.toUpperCase().indexOf(name_1) > -1) {
                            formulaVal = formulaVal.toUpperCase().split(name_1).join(s + '/');
                            savedTokens.push(s);
                            isSheetRenamed = true;
                        }
                    }
                }
                if (isSheetRenamed) {
                    for (var k = 0; k < savedTokens.length; k++) {
                        formulaVal = formulaVal.split(savedTokens[k].toString() + '/').join(sheetNames[savedTokens[k]].visibleName);
                    }
                    rowIndex = this.calculateInstance.rowIndex(dependentCells[j]);
                    colIndex = this.calculateInstance.colIndex(dependentCells[j]);
                    sheetIndex = getSheetIndexByName(this.parent, ('Sheet') + (parseInt(dependentCells[j].split('!')[1], 10) + 1), this.sheetInfo);
                    this.updateDataContainer([rowIndex - 1, colIndex - 1], { value: formulaVal, sheetId: sheetIndex, visible: true });
                }
            }
        }
    };
    WorkbookFormula.prototype.updateDataContainer = function (indexes, data) {
        var rowIndex = indexes[0];
        var colIndex = indexes[1];
        var sheetData;
        var rowData;
        var colObj;
        var len = this.parent.sheets.length;
        for (var i = 0; i < len; i++) {
            if (this.parent.sheets[i].id === data.sheetId) {
                sheetData = this.parent.sheets[i].rows;
                break;
            }
        }
        if (!isNullOrUndefined(data)) {
            if (rowIndex in sheetData) {
                rowData = sheetData[rowIndex];
                if (colIndex in rowData.cells) {
                    colObj = rowData.cells[colIndex];
                    colObj.formula = data.value;
                    colObj.value = data.visible ? colObj.value : this.referenceError();
                }
                else {
                    rowData.cells[colIndex] = colObj = {};
                }
            }
            else {
                rowData = sheetData[rowIndex] = {};
                rowData[colIndex] = colObj = {};
            }
        }
    };
    WorkbookFormula.prototype.parseSheetRef = function (value) {
        var regx;
        var escapeRegx = new RegExp('[!@#$%^&()+=\';,.{}|\":<>~_-]', 'g');
        var i = 0;
        var sheetCount = this.parent.sheets.length;
        var temp = [];
        temp.length = 0;
        var sheetInfo = this.getSheetInfo();
        var exp = '(?=[\'!])(?=[^"]*(?:"[^"]*"[^"]*)*$)';
        for (i = 0; i < sheetCount; i++) {
            if (sheetInfo[i].sheet !== sheetInfo[i].visibleName) {
                regx = new RegExp(sheetInfo[i].visibleName.replace(escapeRegx, '\\$&') + exp, 'gi');
                if (value.match(regx)) {
                    value = value.replace(regx, i + '/');
                    temp.push(i);
                }
            }
        }
        i = 0;
        while (i < temp.length) {
            regx = new RegExp(temp[i] + '/' + exp, 'gi');
            value = value.replace(regx, sheetInfo[temp[i]].sheet);
            i++;
        }
        return value;
    };
    WorkbookFormula.prototype.registerSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.registerGridAsSheet(id, id, this.calcID);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.unRegisterSheet = function (sheetIndex, sheetCount) {
        if (sheetIndex === void 0) { sheetIndex = 0; }
        if (sheetCount === void 0) { sheetCount = this.parent.sheets.length; }
        var id;
        this.calculateInstance.tokenCount = 0;
        while (sheetIndex < sheetCount) {
            id = getSheet(this.parent, sheetIndex).id + '';
            this.calculateInstance.unregisterGridAsSheet(id, id);
            sheetIndex++;
        }
    };
    WorkbookFormula.prototype.refreshCalculate = function (rowIdx, colIdx, value, isFormula, sheetIdx) {
        if (!sheetIdx) {
            sheetIdx = this.parent.activeSheetIndex;
        }
        var sheetName = getSheet(this.parent, sheetIdx).id + '';
        if (isFormula) {
            value = this.parseSheetRef(value);
            var cellArgs = new ValueChangedArgs(rowIdx + 1, colIdx + 1, value);
            this.calculateInstance.valueChanged(sheetName, cellArgs, true);
            var referenceCollection = this.calculateInstance.randCollection;
            if (this.calculateInstance.isRandomVal === true) {
                var rowId = void 0;
                var colId = void 0;
                var refValue = '';
                if (this.calculateInstance.randomValues.size > 1 && this.calculateInstance.randomValues.size ===
                    referenceCollection.length) {
                    for (var i = 0; i < this.calculateInstance.randomValues.size; i++) {
                        rowId = this.calculateInstance.rowIndex(referenceCollection[i]);
                        colId = this.calculateInstance.colIndex(referenceCollection[i]);
                        refValue = this.calculateInstance.randomValues.get(referenceCollection[i]);
                        sheetName = (parseFloat(this.calculateInstance.getSheetToken(referenceCollection[i]).split(this.calculateInstance.sheetToken).join('')) + 1).toString();
                        var tempArgs = new ValueChangedArgs(rowId, colId, refValue);
                        this.calculateInstance.valueChanged(sheetName, tempArgs, true);
                    }
                }
            }
        }
        else {
            var family = this.calculateInstance.getSheetFamilyItem(sheetName);
            var cellRef = getColumnHeaderText(colIdx + 1) + (rowIdx + 1);
            if (family.isSheetMember && !isNullOrUndefined(family.parentObjectToToken)) {
                cellRef = family.parentObjectToToken.get(sheetName) + cellRef;
            }
            if (this.calculateInstance.getFormulaInfoTable().has(cellRef)) {
                this.calculateInstance.getFormulaInfoTable().delete(cellRef);
                if (this.calculateInstance.getDependentCells().has(cellRef)) {
                    this.calculateInstance.clearFormulaDependentCells(cellRef);
                }
            }
            this.calculateInstance.getComputedValue().clear();
            this.calculateInstance.refresh(cellRef);
            this.calculateInstance.refreshRandValues(cellRef);
        }
        this.calculateInstance.cell = '';
    };
    WorkbookFormula.prototype.autoCorrectFormula = function (formula) {
        if (!isNullOrUndefined(formula)) {
            formula = formula.toString();
            if (formula.split('(').length === 2 && formula.indexOf(')') < 0) {
                formula += ')';
            }
        }
        return formula;
    };
    WorkbookFormula.prototype.initiateDefinedNames = function () {
        var definedNames = this.parent.definedNames;
        var len = definedNames.length;
        var i = 0;
        while (i < len) {
            var definedname = definedNames[i];
            this.addDefinedName(definedname, true);
            i++;
        }
    };
    /**
     * @hidden
     * Used to add defined name to workbook.
     * @param {DefineNameModel} name - Define named range.
     */
    WorkbookFormula.prototype.addDefinedName = function (definedName, isValidate) {
        var isAdded = true;
        var sheetIdx;
        var name = definedName.name;
        if (definedName.refersTo.indexOf('!') < 0) {
            var sheetName = getSheetName(this.parent);
            sheetName = sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName;
            definedName.refersTo = sheetName + '!' + ((definedName.refersTo.indexOf('=') < 0) ?
                definedName.refersTo : definedName.refersTo.split('=')[1]);
        }
        var visibleRefersTo = definedName.refersTo;
        var refersTo = this.parseSheetRef(definedName.refersTo);
        if (definedName.scope) {
            sheetIdx = getSheetIndex(this.parent, definedName.scope);
            if (sheetIdx > -1) {
                name = getSheetName(this.parent, sheetIdx) + '!' + name;
            }
        }
        else {
            definedName.scope = '';
        }
        if (!definedName.comment) {
            definedName.comment = '';
        }
        //need to extend once internal sheet value changes done.
        if (!isValidate && this.checkIsNameExist(definedName.name, definedName.scope)) {
            isAdded = false;
        }
        else {
            this.calculateInstance.addNamedRange(name, refersTo[0] === '=' ? refersTo.substr(1) : refersTo);
            if (refersTo[0] !== '=') {
                definedName.refersTo = '=' + visibleRefersTo;
            }
            if (this.parent.definedNames.indexOf(definedName) < 0) {
                this.parent.definedNames.push(definedName);
            }
        }
        return isAdded;
    };
    /**
     * @hidden
     * Used to remove defined name from workbook.
     * @param {string} name - Specifies the defined name.
     * @param {string} scope - Specifies the scope of the define name.
     */
    WorkbookFormula.prototype.removeDefinedName = function (name, scope) {
        var isRemoved = false;
        var index = this.getIndexFromNameColl(name, scope);
        if (index > -1) {
            var calcName = name;
            if (scope) {
                var sheetIdx = getSheetIndex(this.parent, scope);
                if (sheetIdx) {
                    calcName = getSheetName(this.parent, sheetIdx) + '!' + name;
                }
            }
            this.calculateInstance.removeNamedRange(calcName);
            this.parent.definedNames.splice(index, 1);
            isRemoved = true;
        }
        return isRemoved;
    };
    WorkbookFormula.prototype.checkIsNameExist = function (name, sheetName) {
        var isExist = this.parent.definedNames.some(function (key) {
            return key.name === name && (sheetName ? key.scope === sheetName : key.scope === '');
        });
        return isExist;
    };
    WorkbookFormula.prototype.getIndexFromNameColl = function (definedName, scope) {
        if (scope === void 0) { scope = ''; }
        var index = -1;
        this.parent.definedNames.filter(function (name, idx) {
            if (name.name === definedName && name.scope === scope) {
                index = idx;
            }
        });
        return index;
    };
    WorkbookFormula.prototype.toFixed = function (value) {
        var num = Number(value);
        if (Math.round(num) !== num) {
            value = num.toFixed(2);
        }
        return value;
    };
    WorkbookFormula.prototype.aggregateComputation = function (args) {
        var sheet = this.parent.getActiveSheet();
        var range = sheet.selectedRange;
        var indexes = getRangeIndexes(range.split(':')[1]);
        var i;
        var calcValue;
        var formulaVal = ['SUM', 'AVERAGE', 'MIN', 'MAX'];
        var formatedValues = [];
        if (indexes[0] + 1 === sheet.rowCount && indexes[1] + 1 === sheet.colCount) {
            range = "A1:" + getCellAddress(sheet.usedRange.rowIndex, sheet.usedRange.colIndex);
        }
        var actCell = getRangeIndexes(sheet.activeCell);
        var actCellModel = sheet.rows[actCell[0]] ? sheet.rows[actCell[0]].cells ?
            sheet.rows[actCell[0]].cells[actCell[1]] : {} : {};
        var actCellfrmt = (actCellModel) ? actCellModel.format : '';
        var cellValue;
        var cellCol = this.calculateInstance.getCellCollection(range);
        for (i = 0; i < cellCol.length; i++) {
            cellValue = this.calculateInstance.getValueFromArg(cellCol[i]);
            if (isNumber(cellValue)) {
                args.countOnly = false;
                break;
            }
        }
        args.Count = this.calculateInstance.getFunction('COUNTA')(range);
        if (!args.Count || args.countOnly) {
            return;
        }
        for (i = 0; i < 4; i++) {
            calcValue = this.toFixed(this.calculateInstance.getFunction(formulaVal[i])(range));
            var eventArgs = {
                formattedText: calcValue,
                value: calcValue,
                format: actCellfrmt,
                onLoad: true
            };
            if (actCellfrmt) {
                this.parent.notify(getFormattedCellObject, eventArgs);
                calcValue = eventArgs.formattedText;
            }
            formatedValues.push(calcValue);
        }
        args.Sum = formatedValues[0];
        args.Avg = formatedValues[1];
        args.Min = formatedValues[2];
        args.Max = formatedValues[3];
    };
    return WorkbookFormula;
}());
export { WorkbookFormula };
