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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* tslint:disable-next-line:max-line-length */
import { getValue, Event, NotifyPropertyChanges, Base, Property, isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { BasicFormulas } from './../formulas/index';
import { getModules, ModuleLoader } from '../common/index';
import { CommonErrors, FormulasErrorsStrings } from '../common/enum';
import { Parser } from './parser';
/**
 * Represents the calculate library.
 */
var Calculate = /** @class */ (function (_super) {
    __extends(Calculate, _super);
    /**
     * Base constructor for creating Calculate library.
     */
    function Calculate(parent) {
        var _this = _super.call(this, null, null) || this;
        _this.lFormulas = new Map();
        /** @hidden */
        _this.storedData = new Map();
        _this.keyToRowsMap = new Map();
        _this.rowsToKeyMap = new Map();
        /** @hidden */
        _this.rightBracket = String.fromCharCode(161);
        /** @hidden */
        _this.leftBracket = String.fromCharCode(162);
        /** @hidden */
        _this.sheetToken = '!';
        _this.emptyString = '';
        _this.leftBrace = '{';
        _this.rightBrace = '}';
        _this.cell = _this.emptyString;
        _this.cellPrefix = '!0!A';
        _this.treatEmptyStringAsZero = false;
        /** @hidden */
        _this.tic = '\"';
        /** @hidden */
        _this.singleTic = '\'';
        /** @hidden */
        _this.trueValue = 'TRUE';
        /** @hidden */
        _this.falseValue = 'FALSE';
        _this.parseDecimalSeparator = '.';
        /** @hidden */
        _this.arithMarker = String.fromCharCode(180);
        /** @hidden */
        _this.arithMarker2 = _this.arithMarker + _this.arithMarker;
        _this.dependentCells = null;
        _this.dependentFormulaCells = null;
        _this.minValue = Number.MIN_SAFE_INTEGER;
        _this.maxValue = Number.MAX_SAFE_INTEGER;
        _this.categoryCollection = ['All'];
        _this.dependencyLevel = 0;
        _this.refreshedCells = new Map();
        _this.computedValues = null;
        /** @hidden */
        _this.randomValues = new Map();
        /** @hidden */
        _this.isRandomVal = false;
        /** @hidden */
        _this.randCollection = [];
        /**
         * @hidden
         */
        _this.formulaErrorStrings = [
            'binary operators cannot start an expression',
            'cannot parse',
            'bad library',
            'invalid char in front of',
            'number contains 2 decimal points',
            'expression cannot end with an operator',
            'invalid characters following an operator',
            'invalid character in number',
            'mismatched parentheses',
            'unknown formula name',
            'requires a single argument',
            'requires 3 arguments',
            'invalid Math argument',
            'requires 2 arguments',
            '#NAME?',
            'too complex',
            'circular reference: ',
            'missing formula',
            'improper formula',
            'invalid expression',
            'cell empty',
            'bad formula',
            'empty expression',
            '',
            'mismatched string quotes',
            'wrong number of arguments',
            'invalid arguments',
            'iterations do not converge',
            'Control is already registered',
            'Calculation overflow',
            'Missing sheet',
            'cannot_parse',
            'expression_cannot_end_with_an_operator'
        ];
        _this.errorStrings = null;
        _this.parseArgumentSeparator = ',';
        _this.dateTime1900 = new Date(1900, 0, 1, 0, 0, 0);
        _this.isParseDecimalSeparatorChanged = false;
        _this.isArgumentSeparatorChanged = false;
        _this.sheetFamilyID = 0;
        _this.defaultFamilyItem = null;
        _this.sheetFamiliesList = null;
        _this.modelToSheetID = null;
        /** @hidden */
        _this.tokenCount = 0;
        _this.sortedSheetNames = null;
        _this.tempSheetPlaceHolder = String.fromCharCode(133);
        /** @hidden */
        _this.namedRanges = new Map();
        _this.formulaInfoTable = null;
        _this.oaDate = new Date(1899, 11, 30);
        _this.millisecondsOfaDay = 24 * 60 * 60 * 1000;
        _this.parseDateTimeSeparator = '/';
        var moduleLoader = new ModuleLoader(_this);
        if (_this.includeBasicFormulas) {
            Calculate_1.Inject(BasicFormulas);
        }
        if (_this.injectedModules && _this.injectedModules.length) {
            moduleLoader.inject(_this.requiredModules(), _this.injectedModules);
        }
        _this.parentObject = isNullOrUndefined(parent) ? _this : parent;
        _this.grid = _this.parentObject;
        _this.parser = new Parser(_this);
        return _this;
    }
    Calculate_1 = Calculate;
    Object.defineProperty(Calculate.prototype, "libraryFormulas", {
        /* tslint:disable-next-line:no-any */
        get: function () {
            return this.lFormulas;
        },
        /* tslint:disable-next-line:no-any */
        set: function (formulaColl) {
            this.lFormulas.set(formulaColl.fName, { handler: formulaColl.handler, category: formulaColl.category, description: formulaColl.description });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To get the argument separator to split the formula arguments.
     * @returns string
     */
    Calculate.prototype.getParseArgumentSeparator = function () {
        var seperator = ',';
        if (!this.isArgumentSeparatorChanged && seperator !== this.parseArgumentSeparator) {
            this.parseArgumentSeparator = seperator;
        }
        return this.parseArgumentSeparator;
    };
    /**
     * To set the argument separator to split the formula arguments.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    Calculate.prototype.setParseArgumentSeparator = function (value) {
        this.parseArgumentSeparator = value;
        this.isArgumentSeparatorChanged = true;
    };
    /**
     * To get the date separator to split the date value.
     * @returns string
     */
    Calculate.prototype.getParseDateTimeSeparator = function () {
        return this.parseDateTimeSeparator;
    };
    /**
     * To set whether the empty string is treated as zero or not.
     * @param {boolean} value
     * @returns boolean
     */
    Calculate.prototype.setTreatEmptyStringAsZero = function (value) {
        this.treatEmptyStringAsZero = value;
    };
    /**
     * To get whether the empty string is treated as zero or not.
     * @returns boolean
     */
    Calculate.prototype.getTreatEmptyStringAsZero = function () {
        return this.treatEmptyStringAsZero;
    };
    /**
     * To set the date separator to split the date value.
     * @param {string} value - Argument separator based on the culture.
     * @returns void
     */
    Calculate.prototype.setParseDateTimeSeparator = function (value) {
        this.parseDateTimeSeparator = value;
    };
    /**
     * To provide the array of modules needed.
     * @hidden
     */
    Calculate.prototype.requiredModules = function () {
        return getModules(this);
    };
    /**
     * Dynamically injects the required modules to the library.
     * @hidden
     */
    Calculate.Inject = function () {
        var moduleList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            moduleList[_i] = arguments[_i];
        }
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (var j = 0; j < moduleList.length; j++) {
            if (this.prototype.injectedModules.indexOf(moduleList[j]) === -1) {
                this.prototype.injectedModules.push(moduleList[j]);
            }
        }
    };
    /**
     * Get injected modules
     * @hidden
     */
    Calculate.prototype.getInjectedModules = function () {
        return this.injectedModules;
    };
    Calculate.prototype.onPropertyChanged = function (newProp, oldProp) {
        /** code snippets */
    };
    Calculate.prototype.getModuleName = function () {
        return 'calculate';
    };
    /** @hidden */
    Calculate.prototype.getFormulaCharacter = function () {
        return '=';
    };
    /** @hidden */
    Calculate.prototype.isUpperChar = function (text) {
        var charCode = text.charCodeAt(0);
        return ((charCode > 64) && (charCode < 91));
    };
    Calculate.prototype.resetKeys = function () {
        this.storedData.clear();
        this.keyToRowsMap.clear();
        this.rowsToKeyMap.clear();
    };
    /**
     * @hidden
     */
    Calculate.prototype.updateDependentCell = function (cellRef) {
        var family = this.getSheetFamilyItem(this.grid);
        var cell = this.cell;
        if (family.sheetNameToParentObject !== null) {
            var token = family.parentObjectToToken.get(this.grid);
            if (cell.indexOf(this.sheetToken) === -1) {
                cell = token + cell;
            }
            if (cellRef.indexOf(this.sheetToken) === -1) {
                cellRef = token + cellRef;
            }
        }
        if (this.getDependentCells().has(cellRef)) {
            var formulaCells = this.getDependentCells().get(cellRef);
            if (formulaCells.indexOf(cell) < 0) {
                formulaCells.push(cell);
            }
        }
        else {
            this.getDependentCells().set(cellRef, [cell]);
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.getDependentCells = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentCells == null) {
                family.sheetDependentCells = new Map();
            }
            return family.sheetDependentCells;
        }
        else {
            if (this.dependentCells == null) {
                this.dependentCells = new Map();
            }
            return this.dependentCells;
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.getDependentFormulaCells = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetDependentFormulaCells == null) {
                family.sheetDependentFormulaCells = new Map();
            }
            return family.sheetDependentFormulaCells;
        }
        else {
            if (this.dependentFormulaCells == null) {
                this.dependentFormulaCells = new Map();
            }
            return this.dependentFormulaCells;
        }
    };
    /**
     * To get library formulas collection.
     * @returns Map<string, Function>
     */
    Calculate.prototype.getLibraryFormulas = function () {
        return this.lFormulas;
    };
    /**
     * To get library function.
     * @param {string} libFormula - Library formula to get a corresponding function.
     * @returns Function
     */
    Calculate.prototype.getFunction = function (libFormula) {
        if (this.getLibraryFormulas().has(libFormula.toUpperCase())) {
            return this.getLibraryFormulas().get(libFormula.toUpperCase()).handler;
        }
        else {
            return null;
        }
    };
    /** @hidden */
    Calculate.prototype.intToDate = function (val) {
        var dateVal = Number(val);
        dateVal = (dateVal > 0 && dateVal < 1) ? (1 + dateVal) : (dateVal === 0) ? 1 : dateVal;
        if (dateVal > 60) {
            dateVal -= 1; // Due to leap year issue of 1900 in MSExcel.
        }
        return new Date(((dateVal - 1) * (1000 * 3600 * 24)) + new Date('01/01/1900').getTime());
    };
    Calculate.prototype.getFormulaInfoTable = function () {
        if (this.isSheetMember()) {
            var family = this.getSheetFamilyItem(this.grid);
            if (family.sheetFormulaInfotable === null) {
                family.sheetFormulaInfotable = new Map();
            }
            return family.sheetFormulaInfotable;
        }
        else {
            if (this.formulaInfoTable === null) {
                this.formulaInfoTable = new Map();
            }
            return this.formulaInfoTable;
        }
    };
    /**
     * To get the formula text.
     * @private
     */
    Calculate.prototype.getFormula = function (key) {
        key = key.toUpperCase();
        if (this.storedData.has(key)) {
            return this.storedData.get(key).getFormulaText();
        }
        return '';
    };
    /**
     * To get the formula text.
     * @returns void
     */
    Calculate.prototype.getParseDecimalSeparator = function () {
        var seperator = '.';
        if (!this.isParseDecimalSeparatorChanged && seperator !== this.parseDecimalSeparator) {
            this.parseDecimalSeparator = seperator;
        }
        return this.parseDecimalSeparator;
    };
    /**
     * To get the formula text.
     * @param {string} value - Specifies the decimal separator value.
     * @returns void
     */
    Calculate.prototype.setParseDecimalSeparator = function (value) {
        this.parseDecimalSeparator = value;
        this.isParseDecimalSeparatorChanged = true;
    };
    /** @hidden */
    Calculate.prototype.getSheetToken = function (cellRef) {
        var i = 0;
        var temp = this.emptyString;
        if (i < cellRef.length && cellRef[i] === this.sheetToken) {
            i++;
            while (i < cellRef.length && cellRef[i] !== this.sheetToken) {
                i++;
            }
            temp = cellRef.substring(0, i + 1);
        }
        if (i < cellRef.length) {
            return temp;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    };
    /** @hidden */
    Calculate.prototype.getSheetID = function (grd) {
        var family = this.getSheetFamilyItem(grd);
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.size > 0) {
            var token = family.parentObjectToToken.get(grd);
            token = token.split(this.sheetToken).join(this.emptyString);
            var id = this.parseFloat(token);
            if (!this.isNaN(id)) {
                return id;
            }
        }
        return -1;
    };
    /** @hidden */
    Calculate.prototype.parseFloat = function (value) {
        return Number(value);
    };
    /**
     * To get the row index of the given cell.
     * @param {string} cell - Cell address for getting row index.
     * @returns number
     */
    Calculate.prototype.rowIndex = function (cell) {
        var i = 0;
        var result;
        var isLetter = false;
        if (i < cell.length && cell[i] === this.sheetToken) {
            i++;
            while (i < cell.length && cell[i] !== this.sheetToken) {
                i++;
            }
            i++;
        }
        while (i < cell.length && this.isChar(cell[i])) {
            isLetter = true;
            i++;
        }
        result = parseInt(cell.substring(i), 10);
        if (i < cell.length && !this.isNaN(result)) {
            return result;
        }
        if (isLetter) {
            return -1;
        }
        throw this.formulaErrorStrings[FormulasErrorsStrings.bad_index];
    };
    /**
     * To get the column index of the given cell.
     * @param {string} cell - Cell address for getting column index.
     * @returns number
     */
    Calculate.prototype.colIndex = function (cell) {
        var j = 0;
        var k = 0;
        cell = cell.toUpperCase();
        if (j < cell.length && cell[j] === this.sheetToken) {
            j++;
            while (j < cell.length && cell[j] !== this.sheetToken) {
                j++;
            }
            j++;
        }
        while (j < cell.length && this.isChar(cell[j])) {
            var charCode = cell[j].charCodeAt(0);
            k = k * 26 + charCode - 64;
            j++;
        }
        if (k === 0) {
            return -1;
        }
        return k;
    };
    /**
     * To get the valid error strings.
     * @hidden
     */
    Calculate.prototype.getErrorStrings = function () {
        if (this.errorStrings === null) {
            this.errorStrings = ['#N/A', '#VALUE!', '#REF!', '#DIV/0!', '#NUM!', '#NAME?', '#NULL!'];
        }
        return this.errorStrings;
    };
    /** @hidden */
    Calculate.prototype.substring = function (text, startIndex, length) {
        return text.substring(startIndex, length + startIndex);
    };
    /** @hidden */
    Calculate.prototype.isChar = function (c) {
        if ((c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) || (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)) {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.getSheetFamilyItem = function (model) {
        if (this.sheetFamilyID === 0) {
            if (this.defaultFamilyItem == null) {
                this.defaultFamilyItem = new CalcSheetFamilyItem();
            }
            return this.defaultFamilyItem;
        }
        if (this.sheetFamiliesList == null) {
            this.sheetFamiliesList = new Map();
        }
        var i = this.modelToSheetID.get(model);
        if (!this.sheetFamiliesList.has(i)) {
            this.sheetFamiliesList.set(i, new CalcSheetFamilyItem());
        }
        return this.sheetFamiliesList.get(i);
    };
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for formula reference .
     * @param {string | number} value - Value for the corresponding key.
     * @returns void
     */
    Calculate.prototype.setKeyValue = function (key, value) {
        key = key.toUpperCase();
        var str = value.toString().trim();
        if (!this.storedData.get(key) || str.indexOf(this.leftBrace) === 0) {
            this.storedData.set(key, new FormulaInfo());
            this.keyToRowsMap.set(key, this.keyToRowsMap.size + 1);
            this.rowsToKeyMap.set(this.rowsToKeyMap.size + 1, key);
        }
        var fInfo = this.storedData.get(key);
        if (fInfo.getFormulaText() != null && fInfo.getFormulaText().length > 0 && fInfo.getFormulaText() !== str) {
            var s1 = this.cellPrefix + this.keyToRowsMap.get(key).toString();
            var formulaDependent = this.getDependentFormulaCells().get(s1);
            if (formulaDependent != null) {
                this.clearFormulaDependentCells(s1);
            }
        }
        if (str.length > 0 && str[0] === this.getFormulaCharacter()) {
            fInfo.setFormulaText(str);
        }
        else if (fInfo.getFormulaValue() !== str) {
            fInfo.setFormulaText('');
            fInfo.setParsedFormula('');
            fInfo.setFormulaValue(str);
        }
    };
    /**
     * @hidden
     */
    Calculate.prototype.clearFormulaDependentCells = function (cell) {
        var _this = this;
        var dependentFormula = this.getDependentFormulaCells().get(cell);
        if (dependentFormula != null) {
            dependentFormula.forEach(function (value, key) {
                var s = key;
                var dependent = _this.getDependentCells().get(s);
                _this.arrayRemove(dependent, cell);
                if (dependent.length === 0) {
                    _this.getDependentCells().delete(s);
                }
            });
            this.getDependentFormulaCells().delete(cell);
        }
    };
    Calculate.prototype.arrayRemove = function (array, value) {
        var index = null;
        while (index !== -1) {
            index = array.indexOf(value);
            array.splice(index, 1);
        }
        return array;
    };
    /**
     * Register a key value pair for formula.
     * @param {string} key - Key for getting the corresponding value.
     * @returns string | number
     */
    Calculate.prototype.getKeyValue = function (key) {
        key = key.toUpperCase();
        if (this.storedData.has(key) !== null) {
            var fInfo = this.storedData.get(key);
            var fText = fInfo.getFormulaText();
            if (fText.length > 0 && fText[0] === this.getFormulaCharacter()) {
                this.cell = this.cellPrefix + this.keyToRowsMap.get(key).toString();
                fText = fText.substring(1);
                try {
                    fInfo.setParsedFormula(this.parser.parseFormula(fText, key));
                }
                catch (ex) {
                    var args = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    fInfo.setFormulaValue(args.message);
                    return this.storedData.get(key).getFormulaValue();
                }
                try {
                    fInfo.setFormulaValue(this.computeFormula(fInfo.getParsedFormula()));
                }
                catch (ex) {
                    var args = {
                        message: ex.message, exception: ex, isForceCalculable: false,
                        computeForceCalculate: false
                    };
                    this.trigger('onFailure', args);
                    var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
                    return (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
                }
            }
            return this.storedData.get(key).getFormulaValue();
        }
        else {
            return this.emptyString;
        }
    };
    Calculate.prototype.getNamedRanges = function () {
        return this.namedRanges;
    };
    /**
     * Adds a named range to the NamedRanges collection.
     * @param {string} name - Name of the named range.
     * @param {string} range - Range for the specified name.
     * @param {number} sheetIndex - Defined scope for the specified name. Default - Workbook scope.
     * @returns boolean
     */
    Calculate.prototype.addNamedRange = function (name, range) {
        var sheetScopeName = name.split(this.sheetToken);
        if (sheetScopeName.length > 1) {
            var family = this.getSheetFamilyItem(this.grid);
            if (!family.parentObjectToToken.get(sheetScopeName[0])) {
                return false;
            }
            name = sheetScopeName[0] + this.sheetToken + sheetScopeName[1].toUpperCase();
        }
        else {
            name = name.toUpperCase();
        }
        this.namedRanges.set(name, range);
        return true;
    };
    /**
     * Remove the specified named range form the named range collection.
     * @param {string} name - Name of the specified named range.
     * @returns boolean
     */
    Calculate.prototype.removeNamedRange = function (name) {
        name = name.toUpperCase();
        if (this.namedRanges.get(name) != null) {
            this.namedRanges.delete(name);
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.convertAlpha = function (col) {
        var arrCol = [];
        var n = 0;
        var charText = 'A';
        while (col > 0) {
            col--;
            var aCharValue = charText.charCodeAt(0);
            arrCol[n] = String.fromCharCode(col % 26 + aCharValue);
            col = parseInt((col / 26).toString(), 10);
            n++;
        }
        return arrCol.join('');
    };
    /** @hidden */
    Calculate.prototype.getCellCollection = function (cellRange) {
        if (cellRange.indexOf(':') < 0) {
            if (!this.isCellReference(cellRange)) {
                return cellRange.split(this.getParseArgumentSeparator());
            }
            else {
                cellRange = cellRange + ':' + cellRange;
            }
        }
        var token = this.emptyString;
        var sheetTokenIndex = cellRange.indexOf(this.sheetToken);
        if (sheetTokenIndex > -1) {
            var index = sheetTokenIndex;
            var s = index + 1;
            while (s < cellRange.length) {
                if (cellRange[s] === this.sheetToken) {
                    token = cellRange.substr(0, s + 1);
                    break;
                }
                s++;
            }
        }
        var i = cellRange.indexOf(':');
        var row1;
        var row2;
        var col1;
        var col2;
        if (i > 0 && this.isChar(cellRange[i - 1])) {
            var k = i - 2;
            while (k >= 0 && this.isDigit(cellRange[k])) {
                k--;
            }
        }
        row1 = this.rowIndex(this.substring(cellRange, 0, i));
        row2 = this.rowIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        col1 = this.colIndex(this.substring(cellRange, 0, i));
        col2 = this.colIndex(this.substring(cellRange, i + 1, i + cellRange.length - i - 1));
        if (row1 > row2) {
            i = row2;
            row2 = row1;
            row1 = i;
        }
        if (col1 > col2) {
            i = col2;
            col2 = col1;
            col1 = i;
        }
        var cells = [];
        var j;
        var c = 0;
        for (i = row1; i <= row2; i++) {
            for (j = col1; j <= col2; j++) {
                cells[c] = token + this.emptyString + this.convertAlpha(j) + i.toString();
                c++;
            }
        }
        return cells;
    };
    /**
     * Compute the given formula.
     * @param {string} formulaText - Specifies to compute the given formula.
     * @returns string | number
     */
    Calculate.prototype.computeFormula = function (formulaText) {
        var parsedText;
        var lastIndexOfq;
        var formulatResult;
        var nestedFormula = false;
        var fNested;
        if (this.parser.isError) {
            return formulaText;
        }
        if (!this.parser.isFormulaParsed) {
            parsedText = this.parser.parseFormula(formulaText);
        }
        else {
            parsedText = formulaText;
        }
        this.parser.isFormulaParsed = false;
        try {
            lastIndexOfq = this.findLastIndexOfq(parsedText);
            if (lastIndexOfq > 0) {
                nestedFormula = true;
            }
            if (parsedText !== this.emptyString && lastIndexOfq > -1) {
                var i = lastIndexOfq + 1;
                while (i > -1) {
                    if (parsedText[i] !== this.rightBracket) {
                        i++;
                        continue;
                    }
                    var sFormula = parsedText.substring(lastIndexOfq, i + 1);
                    var libFormula = sFormula.split(this.leftBracket)[0].split('q').join(this.emptyString);
                    var args = sFormula.substring(sFormula.indexOf(this.leftBracket) + 1, sFormula.indexOf(this.rightBracket))
                        .split(this.getParseArgumentSeparator());
                    if (this.getLibraryFormulas().get(libFormula.toUpperCase()).isCustom) {
                        var j = 0;
                        var customArgs = [];
                        for (j = 0; j < args.length; j++) {
                            customArgs.push(this.getValueFromArg(args[j]));
                        }
                        args = customArgs;
                    }
                    formulatResult = isNullOrUndefined(this.getFunction(libFormula)) ? this.getErrorStrings()[CommonErrors.name] : this.getFunction(libFormula).apply(void 0, args);
                    if (nestedFormula) {
                        fNested = this.processNestedFormula(parsedText, sFormula, formulatResult);
                        var q = this.findLastIndexOfq(fNested);
                        if (q === 0) {
                            nestedFormula = false;
                        }
                        if (q === -1) {
                            formulatResult = this.computeValue(fNested);
                        }
                        lastIndexOfq = i = q;
                        parsedText = fNested;
                        continue;
                    }
                    break;
                }
            }
            else if (this.formulaErrorStrings.indexOf(parsedText) > -1) {
                formulatResult = parsedText;
            }
            else if (parsedText !== this.emptyString && lastIndexOfq === -1) {
                formulatResult = this.computeValue(parsedText);
            }
        }
        catch (ex) {
            var args = { message: ex.message, exception: ex, isForceCalculable: false, computeForceCalculate: false };
            this.trigger('onFailure', args);
            var errorMessage = (typeof args.exception === 'string') ? args.exception : args.message;
            formulatResult = (isNullOrUndefined(this.getErrorLine(ex)) ? '' : '#' + this.getErrorLine(ex) + ': ') + errorMessage;
        }
        return formulatResult;
    };
    /** @hidden */
    Calculate.prototype.computeSumIfAndAvgIf = function (range) {
        if (isNullOrUndefined(range) || range[0] === this.emptyString || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = range;
        var argCount = argArr.length;
        if (argCount !== 2 && argCount !== 3 && argCount === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var rangevalue = argArr[0];
        var criteria = argCount > 2 ? argArr[2].trim() : argArr[1].trim();
        criteria = criteria.split(this.tic).join(this.emptyString);
        if (criteria.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        var opt = this.parser.tokenEqual;
        if (criteria.startsWith('<=')) {
            opt = this.parser.tokenLessEq;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('>=')) {
            opt = this.parser.tokenGreaterEq;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('<>')) {
            opt = this.parser.tokenNotEqual;
            criteria = criteria.substring(2);
        }
        else if (criteria.startsWith('<')) {
            opt = this.parser.tokenLess;
            criteria = criteria.substring(1);
        }
        else if (criteria.startsWith('>')) {
            opt = this.parser.tokenGreater;
            criteria = criteria.substring(1);
        }
        else if (criteria.startsWith('=')) {
            opt = this.parser.tokenEqual;
            criteria = criteria.substring(1);
        }
        var checkCriteria = this.parseFloat(criteria);
        var criteriaRangeArray = argCount === 2 ? rangevalue : argArr[1];
        var sumRange = this.getCellCollection(argArr[0]);
        var criteriaRange = this.getCellCollection(criteriaRangeArray);
        var result = this.getComputeSumIfValue(criteriaRange, sumRange, criteria, checkCriteria, opt);
        return [result[0], result[1]];
    };
    /** @hidden */
    Calculate.prototype.computeLookup = function (range) {
        if (range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var checkCrte = [];
        var findMaxVal = [];
        var argArr = range;
        var argCount = argArr.length;
        var criterias = argArr[0].split(this.tic).join(this.emptyString);
        var rangevalue = argArr[1];
        var lookupRangeArray = argCount === 2 ? rangevalue : argArr[2];
        var criteriaRange = this.getCellCollection(argArr[1]);
        var lookupRange = this.getCellCollection(lookupRangeArray);
        for (var i = 0; i < criteriaRange.length; i++) {
            findMaxVal[i] = this.getValueFromArg(criteriaRange[i]).split(this.tic).join('');
        }
        var s = findMaxVal.toString().split(this.getParseArgumentSeparator());
        var maxVal = this.parseFloat(s[s.sort().length - 1]);
        var minVal = this.parseFloat(s[0]);
        for (var j = 0; j < criteriaRange.length; j++) {
            checkCrte[j] = this.getValueFromArg(criteriaRange[j]).split(this.tic).join('');
            if (criterias === checkCrte[j]) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            }
            else if (this.parseFloat(criterias) === this.parseFloat(checkCrte[j])) {
                return this.getValueFromArg(lookupRange[j]).split(this.tic).join('');
            }
            else if (this.parseFloat(criterias) < minVal) {
                return this.getErrorStrings()[CommonErrors.na];
            }
            else if (this.parseFloat(criterias) > maxVal) {
                var index = findMaxVal.indexOf(maxVal.toString());
                return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
            }
        }
        if (findMaxVal.indexOf(criterias) < 0) {
            var temp = [];
            for (var n = 0; n < s.length; n++) {
                if (this.parseFloat(criterias) > this.parseFloat(s[n])) {
                    temp.push(s[n]);
                }
            }
            var index = findMaxVal.indexOf(temp[temp.length - 1]);
            return this.getValueFromArg(lookupRange[index]).split(this.tic).join('');
        }
        return this.getErrorStrings()[CommonErrors.na];
    };
    Calculate.prototype.computeVLookup = function (range) {
        var argArr = range;
        var findMaxValue = [];
        var lookupValue = argArr[0].split(this.tic).join('');
        if (lookupValue.indexOf(':') > -1) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        if (this.isCellReference(lookupValue)) {
            lookupValue = this.getValueFromArg(lookupValue);
        }
        if (argArr[1].indexOf(':') < -1) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        var lookupRange = [];
        var firstCol = '';
        var secCol = '';
        if (this.isCellReference(argArr[1])) {
            lookupRange = this.getCellCollection(argArr[1]);
            if (argArr[1].indexOf(':') > -1) {
                var index = argArr[1].indexOf(':');
                for (var i = 0; i < index; i++) {
                    var tempCell = this.isChar(argArr[1][i]) ? argArr[1][i] : '';
                    firstCol = firstCol + tempCell;
                }
                for (var j = index; j < argArr[1].length; j++) {
                    var tempCell2 = this.isChar(argArr[1][j]) ? argArr[1][j] : '';
                    secCol = secCol + tempCell2;
                }
            }
        }
        var lookupCol = this.colIndex(firstCol) + this.parseFloat(argArr[2]);
        if (lookupCol > this.colIndex(secCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        if (lookupCol === this.colIndex(firstCol)) {
            return this.getErrorStrings()[CommonErrors.na];
        }
        var lookupCell = this.convertAlpha(lookupCol);
        argArr[3] = isNullOrUndefined(argArr[3]) ? this.trueValue : argArr[3].split(this.tic).join('');
        var cellValue = '';
        for (var i = 0; i < lookupRange.length; i++) {
            findMaxValue[i] = this.getValueFromArg(lookupRange[i]).split(this.tic).join('');
        }
        var s = findMaxValue.toString().split(this.getParseArgumentSeparator());
        var maxValue = this.parseFloat(s[s.sort().length - 1]);
        var minValue = this.parseFloat(s[0]);
        for (var j = 0; j < lookupRange.length; j++) {
            cellValue = this.getValueFromArg(lookupRange[j]);
            if (argArr[3].toUpperCase() === this.trueValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                }
                else if (this.parseFloat(lookupValue) === this.parseFloat(cellValue)) {
                    return this.getValueFromArg(lookupCell + j).split(this.tic).join('');
                }
                else if (this.parseFloat(lookupValue) < minValue) {
                    return this.getErrorStrings()[CommonErrors.na];
                }
                else if (this.parseFloat(lookupValue) > maxValue) {
                    var index = findMaxValue.indexOf(maxValue.toString());
                    return this.getValueFromArg(lookupCell + index).split(this.tic).join('');
                }
            }
            if (argArr[3] === this.falseValue) {
                if (lookupValue === cellValue) {
                    return this.getValueFromArg(lookupCell + j);
                }
            }
        }
        return this.getErrorStrings()[CommonErrors.na];
    };
    Calculate.prototype.findWildCardValue = function (lookVal, cellValue) {
        var finalText = '';
        if (lookVal.indexOf('?') > -1) {
            var index = lookVal.indexOf('?');
            var checStr1 = lookVal[index - 1];
            var checStr2 = lookVal[index + 1];
            if (cellValue.indexOf(checStr1) > -1 && cellValue.indexOf(checStr2) > -1) {
                var newIndex = cellValue.indexOf(checStr1);
                if (cellValue[newIndex] === checStr1 && cellValue[newIndex + 2] === checStr2) {
                    finalText = lookVal;
                }
                else {
                    finalText = cellValue;
                }
            }
            else {
                finalText = cellValue;
            }
        }
        else if (lookVal.indexOf('*') > -1) {
            var index = lookVal.indexOf('*');
            var left = '';
            var right = '';
            var compRight = this.falseValue;
            var compLeft = this.falseValue;
            for (var i = index - 1; i >= 0; i--) {
                left = left + lookVal[i];
                compLeft = this.trueValue;
            }
            for (var i = index + 1; i < lookVal.length; i++) {
                right = right + lookVal[i];
                compRight = this.trueValue;
            }
            var leftVal = left === '' ? -1 : cellValue.indexOf(left.split('').reverse().join(''));
            var rightVal = right === '' ? -1 : cellValue.indexOf(right);
            if (leftVal > -1 || rightVal > -1) {
                if (compLeft === this.trueValue) {
                    finalText = (left.split('').reverse().join('') === cellValue.substr(0, left.length)) ? lookVal : cellValue;
                }
                else if (compRight === this.trueValue) {
                    finalText = (right === cellValue.substring(cellValue.length - right.length, cellValue.length)) ? lookVal : cellValue;
                }
            }
            else {
                finalText = cellValue;
            }
        }
        return finalText;
    };
    /** @hidden */
    /* tslint:disable-next-line */
    Calculate.prototype.getComputeSumIfValue = function (criteriaRange, sumRange, criteria, checkCriteria, op) {
        var sum = 0;
        var count = 0;
        switch (op) {
            case this.parser.tokenEqual:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (value === criteria && val === checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLess:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val < checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreater:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val > checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenLessEq:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val <= checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenGreaterEq:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (val >= checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
            case this.parser.tokenNotEqual:
                {
                    for (var i = 0; i < criteriaRange.length; i++) {
                        var value = this.getValueFromArg(criteriaRange[i].split(this.tic).join(''));
                        var val = this.parseFloat(value);
                        if (value !== criteria && val !== checkCriteria) {
                            var value1 = this.getValueFromArg(sumRange[i].split(this.tic).join(''));
                            var val1 = this.parseFloat(value1);
                            sum = sum + val1;
                            count = count + 1;
                        }
                    }
                }
                break;
        }
        return [sum, count];
    };
    /** @hidden */
    Calculate.prototype.computeAndOr = function (args, op) {
        var result = op === 'and' ? true : false;
        var value;
        var parseVal;
        if (args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var l = 0, len = args.length; l < len; l++) {
            if (args[l].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        var ranges = args;
        for (var i = 0; i < ranges.length; i++) {
            if (ranges[i] === (this.tic)) {
                return this.getErrorStrings()[CommonErrors.value];
            }
            if (ranges[i].indexOf(':') > -1 && this.isCellReference(ranges[i])) {
                var cells = this.getCellCollection(ranges[i]);
                for (var j = 0; j < cells.length; j++) {
                    if (this.getErrorStrings().indexOf(cells[j]) > -1) {
                        return cells[j];
                    }
                    else if (cells[j][0] === this.tic) {
                        return this.getErrorStrings()[CommonErrors.name];
                    }
                    value = this.getValueFromArg(cells[j]);
                    if (value === '') {
                        value = this.trueValue;
                    }
                    if (this.getErrorStrings().indexOf(value) > -1) {
                        return value;
                    }
                    parseVal = this.parseFloat(value);
                }
            }
            else {
                value = this.getValueFromArg(ranges[i]).split(this.tic).join('').toUpperCase();
                if (this.getErrorStrings().indexOf(value) > -1) {
                    return value;
                }
                var tempdate = Date.parse(value.split(this.tic).join(''));
                if (!isNaN(tempdate)) {
                    result = true;
                }
                else if (!(value === this.trueValue || value === this.falseValue)) {
                    return this.getErrorStrings()[CommonErrors.value].toString();
                }
                parseVal = this.parseFloat(value);
            }
            result = op === 'and' ? (result && ((value === this.trueValue) || !(isNaN(parseVal)))) :
                (result || ((value === this.trueValue) || !(isNaN(parseVal))));
        }
        return result ? this.trueValue : this.falseValue;
    };
    /** @hidden */
    // To strip out the tic from the formula arguments.
    Calculate.prototype.removeTics = function (text) {
        if (text.length > 1 && text[0] === this.tic[0] && text[text.length - 1] === this.tic[0]) {
            text = this.substring(text, 1, text.length - 2);
        }
        return text;
    };
    /* tslint:disable-next-line:max-func-body-length */
    Calculate.prototype.computeValue = function (pFormula) {
        try {
            var stack = [];
            var i = 0;
            var sheet = '';
            stack.length = 0;
            while (i < pFormula.length) {
                var uFound = pFormula[i] === 'u'; // for 3*-2
                if (pFormula[i] === this.arithMarker) {
                    i = i + 1;
                    continue;
                }
                else if (this.isDigit(pFormula[i])) {
                    var s = this.emptyString;
                    while (i < pFormula.length && this.isDigit(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s);
                }
                if (pFormula[i] === this.sheetToken) {
                    sheet = pFormula[i];
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.sheetToken) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                    if (i < pFormula.length) {
                        sheet = sheet + pFormula[i];
                        i = i + 1;
                    }
                }
                else if (this.isUpperChar(pFormula[i])) {
                    var s = this.emptyString;
                    var textName = '';
                    while (i < pFormula.length && this.isUpperChar(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    while (i < pFormula.length && this.isDigit(pFormula[i])) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    s = sheet + s;
                    textName = this.getParentObjectCellValue(s).toString();
                    if (typeof textName === 'string' && this.getErrorStrings().indexOf(textName) > -1) {
                        return textName;
                    }
                    stack.push(textName);
                }
                else if (pFormula[i] === 'q') {
                    var leftIdx = pFormula.substring(i + 1).indexOf(this.leftBracket);
                    var j = pFormula.substring(i + leftIdx + 1).indexOf(this.rightBracket);
                    pFormula = this.substring(pFormula, i + leftIdx + 2, j - 1);
                }
                else if (pFormula[i] === this.tic[0]) {
                    var s = pFormula[i].toString();
                    i = i + 1;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s.split(this.tic).join(this.emptyString));
                    i = i + 1;
                }
                else if (pFormula[i] === '%' && stack.length > 0) {
                    var stackValue = stack[0];
                    var value = this.parseFloat(stackValue);
                    if (!this.isNaN(value)) {
                        stack.pop();
                        stack.push((value / 100).toString());
                    }
                    i = i + 1;
                }
                else if ((pFormula.substring(i)).indexOf(this.trueValue) === 0) {
                    stack.push(this.trueValue);
                    i += this.trueValue.length;
                }
                else if (pFormula.substring(i).indexOf(this.falseValue) === 0) {
                    stack.push(this.falseValue);
                    i += this.falseValue.length;
                }
                else if (pFormula[i] === this.tic[0] || pFormula[i] === '|') {
                    var s = pFormula[i].toString();
                    i++;
                    while (i < pFormula.length && pFormula[i] !== this.tic[0]) {
                        s = s + pFormula[i];
                        i = i + 1;
                    }
                    stack.push(s + this.tic);
                    i += 1;
                }
                else {
                    switch (pFormula[i]) {
                        case '#':
                            {
                                var errIndex = 0;
                                if (this.getErrorStrings().indexOf(pFormula.substring(i)) > -1) {
                                    if (pFormula.indexOf('!') === -1 || pFormula.substring(i).indexOf('!') === -1) {
                                        errIndex = pFormula.indexOf('#N/A') > -1 ?
                                            (pFormula.indexOf('#N/A') + 4 + i) : pFormula.indexOf('?') + 1 + i;
                                    }
                                    else {
                                        errIndex = pFormula.indexOf('!') + 1 + i;
                                    }
                                    stack.push(this.substring(pFormula, i, errIndex - i));
                                }
                                else {
                                    errIndex = i + 1;
                                    stack.push(this.substring(pFormula, i, errIndex - i));
                                }
                                i = errIndex;
                            }
                            break;
                        case 'n':
                            {
                                i = i + 1;
                                var s = '';
                                if (pFormula.substring(i).indexOf('Infinity') === 0) {
                                    s = 'Infinity';
                                    i += s.length;
                                }
                                else {
                                    if (pFormula[i] === 'u' || uFound) {
                                        s = '-';
                                        if (!uFound) {
                                            i = i + 1;
                                        }
                                        else {
                                            uFound = false;
                                        }
                                    }
                                    while (i < pFormula.length && (this.isDigit(pFormula[i]))
                                        || pFormula[i] === this.getParseDecimalSeparator()) {
                                        s = s + pFormula[i];
                                        i = i + 1;
                                    }
                                }
                                stack.push(s);
                            }
                            break;
                        case this.parser.tokenAdd:
                            {
                                this.getValArithmetic(stack, 'add');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenSubtract:
                            {
                                this.getValArithmetic(stack, 'sub');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenMultiply:
                            {
                                this.getValArithmetic(stack, 'mul');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenDivide:
                            {
                                this.getValArithmetic(stack, 'div');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenLess:
                            {
                                this.processLogical(stack, 'less');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenGreater:
                            {
                                this.processLogical(stack, 'greater');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenGreaterEq:
                            {
                                this.processLogical(stack, 'greaterEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenLessEq:
                            {
                                this.processLogical(stack, 'lessEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenNotEqual:
                            {
                                this.processLogical(stack, 'notEq');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenOr:
                            {
                                this.processLogical(stack, 'or');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenAnd:
                            {
                                this.processLogical(stack, 'and');
                                i = i + 1;
                            }
                            break;
                        case this.parser.tokenEqual:
                            {
                                this.processLogical(stack, 'equal');
                                i = i + 1;
                            }
                            break;
                        default: {
                            return this.getErrorStrings()[CommonErrors.value];
                        }
                    }
                }
            }
            if (stack.length === 0) {
                return this.emptyString;
            }
            else {
                var s = this.emptyString;
                var countValue = stack.length;
                while (countValue > 0) {
                    s = stack.pop() + s;
                    if (s === this.emptyString && this.isCellReference(pFormula) &&
                        this.getTreatEmptyStringAsZero()) {
                        return '0';
                    }
                    countValue--;
                }
                return s;
            }
        }
        catch (ex) {
            if (this.getErrorStrings().indexOf(ex) > -1 || this.formulaErrorStrings.indexOf(ex) > -1) {
                throw ex;
            }
            throw new FormulaError(this.formulaErrorStrings[FormulasErrorsStrings.invalid_expression]);
        }
    };
    Calculate.prototype.getValArithmetic = function (stack, operator) {
        var num1 = stack.pop();
        num1 = num1 === this.emptyString ? '0' : num1;
        var num = Number(num1);
        if (isNaN(num)) {
            throw this.getErrorStrings()[CommonErrors.value];
        }
        var num2 = stack.pop();
        num2 = num2 === this.emptyString ? '0' : num2;
        num = Number(num2);
        if (isNaN(num)) {
            throw this.getErrorStrings()[CommonErrors.value];
        }
        if (operator === 'add') {
            stack.push((Number(num2) + Number(num1)).toString());
        }
        if (operator === 'sub') {
            stack.push((Number(num2) - Number(num1)).toString());
        }
        if (operator === 'mul') {
            stack.push((Number(num2) * Number(num1)).toString());
        }
        if (operator === 'div') {
            if (this.isNaN(this.parseFloat(num1)) || this.isNaN(this.parseFloat(num2))) {
                stack.push(this.getErrorStrings()[CommonErrors.value]);
            }
            else if (this.parseFloat(num1) === 0) {
                stack.push(this.getErrorStrings()[CommonErrors.divzero]);
            }
            else {
                stack.push((Number(num2) / Number(num1)).toString());
            }
        }
    };
    /** @hidden */
    Calculate.prototype.processLogical = function (stack, operator) {
        var val1;
        var val2;
        var value1;
        var value2;
        if (operator !== 'and' && operator !== 'equal') {
            val1 = stack.pop();
            val2 = stack.pop();
            value1 = val1.indexOf(this.tic) > -1 ? val1 : this.parseFloat(val1);
            value2 = val2.indexOf(this.tic) > -1 ? val2 : this.parseFloat(val2);
        }
        var result;
        if (operator === 'less') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 < value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) < 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greater') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 > value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) > 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'lessEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 <= value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) <= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'greaterEq') {
            if (!this.isNaN(value1) && !this.isNaN(value2)) {
                result = (value2 >= value1) ? this.trueValue : this.falseValue;
            }
            else {
                result = (val2.toUpperCase().split(this.tic).join('').localeCompare(val1.toUpperCase().split(this.tic).join('')) >= 0) ?
                    this.trueValue : this.falseValue;
            }
        }
        if (operator === 'notEq') {
            result = (val2 !== val1) ? this.trueValue : this.falseValue;
        }
        if (operator === 'and') {
            val1 = stack.pop().toString();
            val2 = '';
            if (stack.length > 0) {
                val2 = stack.pop().toString();
            }
            result = this.emptyString + val2 + val1 + this.emptyString;
            result = result.split(this.tic).join('');
        }
        if (operator === 'equal') {
            val1 = stack.pop().toString();
            val2 = stack.pop().toString();
            result = val1 === val2 ? this.trueValue : this.falseValue;
        }
        if (operator === 'or') {
            result = Math.pow(this.parseFloat(value2), this.parseFloat(value1)).toString();
        }
        stack.push(result);
        return result;
    };
    /** @hidden */
    Calculate.prototype.computeStoreCells = function (sCell) {
        var cellValue = sCell.cellValue;
        var cellRanges = sCell.cellRange;
        var criterias = sCell.criteria;
        var argArr = sCell.argArray;
        var isCriteria = sCell.isCriteria;
        var storeCell = sCell.storedCells;
        var isCountIfs = sCell.isCountIfS;
        var i = sCell.countVal;
        var rangeLength = isCriteria === this.trueValue ? storeCell : cellValue;
        var tempStoredCell = [];
        for (var j = 0; j < rangeLength.length; j++) {
            var stack = [];
            var cellVal = this.getValueFromArg(cellValue[j]);
            var criteria = void 0;
            var newCell = '';
            criteria = argArr[2].split(this.tic).join(this.emptyString);
            isCriteria = isCountIfs === this.trueValue ? this.trueValue : isCriteria;
            if (isCriteria === this.trueValue) {
                var cell = '';
                var count = 0;
                var newCount = 0;
                storeCell[j] = isCountIfs === this.trueValue && i === 0 ? cellValue[j] : storeCell[j];
                cell = storeCell[j];
                // convert the new cell ranges  for find in range with criteria.
                while (!this.isDigit(cell[count])) {
                    count = count + 1;
                }
                if (this.isCellReference(cellRanges[i]) && cellRanges[i].indexOf(':') > -1) {
                    var k = cellRanges[i].indexOf(':');
                    newCell = this.substring(cellRanges[i], k);
                    while (!this.isDigit(newCell[newCount])) {
                        newCount = newCount + 1;
                    }
                }
                var cellAlpha = this.substring(cell, count);
                var newCellAlpha = this.substring(newCell, newCount);
                newCell = storeCell[j].split(cellAlpha).join(newCellAlpha);
                cellVal = this.getValueFromArg(newCell);
                criteria = isCountIfs === this.trueValue ? criterias[i].split(this.tic).join(this.emptyString) :
                    criterias[i - 1].split(this.tic).join(this.emptyString);
            }
            var op = 'equal';
            if (criteria.startsWith('<=')) {
                op = 'lessEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('>=')) {
                op = 'greaterEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('<>')) {
                op = 'notEq';
                criteria = criteria.substring(2);
            }
            else if (criteria.startsWith('<')) {
                op = 'less';
                criteria = criteria.substring(1);
            }
            else if (criteria.startsWith('>')) {
                op = 'greater';
                criteria = criteria.substring(1);
            }
            else if (criteria.startsWith('=')) {
                op = 'equal';
                criteria = criteria.substring(1);
            }
            if (criteria.indexOf('*') > -1 || criteria.indexOf('?') > -1) {
                cellVal = this.findWildCardValue(criteria, cellVal);
            }
            stack.push(cellVal.toLowerCase());
            stack.push(criteria.toLowerCase());
            if (this.processLogical(stack, op) === this.trueValue) {
                if (isCriteria === this.falseValue) {
                    tempStoredCell.push(cellValue[j]);
                }
                else {
                    tempStoredCell.push(newCell);
                }
            }
        }
        storeCell = tempStoredCell;
        tempStoredCell = [];
        return storeCell;
    };
    Calculate.prototype.computeIfsFormulas = function (range, isCountIfs, isAvgIfs) {
        if (isNullOrUndefined(range) || range[0] === '' || range.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var argArr = range;
        var argCount = argArr.length;
        if (argCount < 2 || argCount > 127) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        var cellRanges = [];
        var criterias = [];
        var storedCell = [];
        var storedCellLength = 0;
        var sum = 0;
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                cellRanges.push(argArr[i]);
            }
            else {
                criterias.push(argArr[i]);
            }
        }
        cellRanges = cellRanges.toString().split(',,').join(',');
        cellRanges = cellRanges.split(this.getParseArgumentSeparator());
        var cellvalue;
        var isCriteria;
        if (isCountIfs === this.falseValue) {
            isCriteria = this.falseValue;
            cellvalue = this.getCellCollection(cellRanges[1]);
            var sCell = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        // Compare criteria and convert the new cell ranges.
        var startRange;
        startRange = isCountIfs === this.trueValue ? 0 : 2;
        for (var i = startRange; i < cellRanges.length; i++) {
            isCriteria = this.trueValue;
            isCriteria = isCountIfs === this.trueValue && i === 0 ? this.falseValue : this.trueValue;
            cellvalue = this.getCellCollection(cellRanges[i]);
            var sCell = {
                cellValue: cellvalue, cellRange: cellRanges, criteria: criterias,
                argArray: argArr, isCriteria: isCriteria, storedCells: storedCell, isCountIfS: isCountIfs, countVal: i
            };
            storedCell = this.computeStoreCells(sCell);
            storedCellLength = storedCell.length;
            if (storedCellLength === 0) {
                return 0;
            }
        }
        for (var j = 0; j < storedCell.length; j++) {
            // convert the new cell ranges  for find sum in range 0(first range)
            var cell = '';
            var newCell = '';
            var count = 0;
            var newCount = 0;
            cell = storedCell[j];
            while (!this.isDigit(cell[count])) {
                count = count + 1;
            }
            if (this.isCellReference(cellRanges[0]) && cellRanges[0].indexOf(':') > -1) {
                var k = cellRanges[0].indexOf(':');
                newCell = this.substring(cellRanges[0], k);
                while (!this.isDigit(newCell[newCount])) {
                    newCount = newCount + 1;
                }
            }
            var cellAlpha = this.substring(cell, count);
            var newCellAlpha = this.substring(newCell, newCount);
            cellvalue = storedCell[j].split(cellAlpha).join(newCellAlpha);
            if (isCountIfs === this.trueValue) {
                sum = sum + 1;
            }
            else {
                var argValue = this.getValueFromArg(cellvalue);
                sum = sum + parseFloat(argValue === '' ? '0' : argValue);
            }
        }
        if (isAvgIfs === this.trueValue) {
            sum = sum / cellvalue.length;
        }
        return sum;
    };
    Calculate.prototype.processNestedFormula = function (pText, sFormula, fResult) {
        var lastIndexq = this.findLastIndexOfq(pText);
        var interiorCalcFString = pText.split(sFormula).join('n' + fResult);
        return interiorCalcFString;
    };
    /** @hidden */
    Calculate.prototype.isNaN = function (value) {
        if (value.toString() === 'NaN' || typeof value === 'string') {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.fromOADate = function (doubleNumber) {
        var result = new Date();
        result.setTime((doubleNumber * this.millisecondsOfaDay) + Date.parse(this.oaDate.toString()));
        return result;
    };
    /** @hidden */
    Calculate.prototype.getSerialDateFromDate = function (year, month, day) {
        var days = 0;
        if (year < 1900) {
            year += 1900;
        }
        var isValidMonth = false;
        while (!isValidMonth) {
            while (month > 12) {
                year++;
                month -= 12;
            }
            isValidMonth = true;
            var tempDay = new Date(year, month, 1, -1).getDate();
            while (day > tempDay) {
                tempDay = new Date(year, month, 1, -1).getDate();
                month++;
                day -= tempDay;
                isValidMonth = false;
            }
            if (day < 1) {
                month--;
                tempDay = new Date(year, month, 1, -1).getDate();
                day = tempDay - day;
            }
        }
        var dateTime = Date.parse(year.toString() + this.getParseDateTimeSeparator() + month.toString() +
            this.getParseDateTimeSeparator() + day.toString());
        if (!this.isNaN(dateTime)) {
            days = this.toOADate(new Date(dateTime));
        }
        return days;
    };
    /** @hidden */
    Calculate.prototype.toOADate = function (dateTime) {
        var result = (dateTime.getTime() - Date.parse(this.oaDate.toString())) / this.millisecondsOfaDay;
        return result;
    };
    /** @hidden */
    Calculate.prototype.calculateDate = function (date) {
        return (this.parseFloat(date) < 10) ? '0' + date : date;
    };
    /** @hidden */
    Calculate.prototype.isTextEmpty = function (s) {
        return s === null || s === '';
    };
    /** @hidden */
    Calculate.prototype.isDigit = function (text) {
        var charCode = text.charCodeAt(0);
        if ((charCode > 47) && (charCode < 58)) {
            return true;
        }
        return false;
    };
    Calculate.prototype.findLastIndexOfq = function (fString) {
        return fString.lastIndexOf('q');
    };
    /**
     * To get the exact value from argument.
     * @param {string} arg - Formula argument for getting a exact value.
     * @returns string
     */
    Calculate.prototype.getValueFromArg = function (arg) {
        arg = arg.trim();
        var s = arg;
        var dateTime = this.dateTime1900;
        var pObjCVal = s;
        if (isNullOrUndefined(s) || this.isTextEmpty(s)) {
            return s;
        }
        else if (arg[0] === this.tic || arg[0] === this.singleTic) {
            dateTime = this.isDate(arg.split(this.tic).join(''));
            if (this.isNaN(this.parseFloat(arg.split(this.tic).join(''))) && !isNullOrUndefined(dateTime) &&
                !this.isNaN(dateTime.getDate()) && this.dateTime1900 <= dateTime) {
                return this.toOADate(dateTime).toString();
            }
            return arg;
        }
        else {
            arg = arg.split('u').join('-');
            /* tslint:disable:max-line-length */
            if (!this.isUpperChar(s[0]) && (this.isDigit(s[0]) || s[0] === this.getParseDecimalSeparator() || s[0] === '-' || s[0] === 'n')) {
                if (s[0] === 'n') {
                    s = s.substring(1);
                }
                return s;
            }
        }
        var symbolArray = ['+', '-', '/', '*', ')', ')', '{'];
        if ((this.parser.indexOfAny(s, symbolArray) === -1 && this.isUpperChar(s[0])) || s[0] === this.sheetToken) {
            if (s !== this.trueValue && s !== this.falseValue && this.isCellReference(s)) {
                var f = this.getSheetFamilyItem(this.grid);
                if (f.sheetNameToParentObject !== null && f.sheetNameToParentObject.size > 0 && s.indexOf(this.sheetToken) === -1) {
                    var token = f.parentObjectToToken.get(this.grid);
                    s = token + s;
                }
            }
            if (s === this.cell) {
                var dependent = this.getDependentCells().get(s);
                if (dependent != null && dependent.indexOf(s) > -1) {
                    this.arrayRemove(dependent, s);
                }
                if (!this.getDependentFormulaCells().has(this.cell)) {
                    this.clearFormulaDependentCells(this.cell);
                }
                throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference] + s;
            }
            pObjCVal = this.getParentObjectCellValue(s);
            this.updateDependentCell(s);
            return pObjCVal.toString();
        }
        if (this.getErrorStrings().indexOf(arg) > -1) {
            return arg;
        }
        return this.computeValue(pObjCVal.toString());
    };
    /* tslint:disable-next-line */
    Calculate.prototype.isDate = function (date) {
        if (typeof date === 'object' || Date.parse(date) !== null) {
            var dateval = new Date(Date.parse(date));
            if (dateval >= this.dateTime1900) {
                return dateval;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    Calculate.prototype.isValidCellReference = function (text) {
        var start = 0;
        var end = 0;
        var j = 0;
        var numArr = [89, 71, 69];
        var cellTxt = this.emptyString;
        if (this.namedRanges.has(text)) {
            return false;
        }
        for (var i = 0; i < text.length; i++) {
            if (this.isChar(text[i])) {
                end++;
            }
        }
        cellTxt = text.substring(start, end);
        if (cellTxt.length < 4) {
            while (j < cellTxt.length) {
                if (!isNullOrUndefined(cellTxt[j]) && cellTxt[j].charCodeAt(0) < numArr[j]) {
                    j++;
                    continue;
                }
                else if (isNullOrUndefined(cellTxt[j]) && j > 0) {
                    break;
                }
                else {
                    return false;
                }
            }
            var cellNum = this.parseFloat(text.substring(end, text.length));
            if (cellNum < 1048576) { // Maximum number of rows in excel.
                return true;
            }
        }
        return false;
    };
    /** @hidden */
    /* tslint:disable-next-line */
    Calculate.prototype.parseDate = function (date) {
        if (!this.isNaN(date)) {
            if (date instanceof Date) {
                return new Date(date);
            }
            var d = parseInt(date, 10);
            if (d < 0) {
                return this.getErrorStrings()[CommonErrors.num];
            }
            if (d <= 60) {
                return new Date(this.dateTime1900.getTime() + (d - 1) * 86400000);
            }
            return new Date(this.dateTime1900.getTime() + (d - 2) * 86400000);
        }
        if (typeof date === 'string') {
            date = new Date(date);
            if (!this.isNaN(date)) {
                return date;
            }
        }
        return this.getErrorStrings()[CommonErrors.value];
    };
    /** @hidden */
    Calculate.prototype.isCellReference = function (args) {
        if (args === this.emptyString) {
            return false;
        }
        args = args.trim();
        args = this.setTokensForSheets(args);
        var sheetToken1 = this.getSheetToken(args);
        var containsBoth = false;
        if (sheetToken1 !== '') {
            args = args.split(sheetToken1).join(this.emptyString);
        }
        var isAlpha = false;
        var isNum = false;
        if (args.indexOf(':') !== args.lastIndexOf(':')) {
            return false;
        }
        var charArray = (args.split('').join(this.getParseArgumentSeparator())).split(this.getParseArgumentSeparator());
        for (var c = 0; c < charArray.length; c++) {
            if (this.isChar(charArray[c])) {
                isAlpha = true;
            }
            else if (this.isDigit(charArray[c])) {
                isNum = true;
            }
            else if (charArray[c] === ':') {
                if (isAlpha && isNum) {
                    containsBoth = true;
                }
                isAlpha = false;
                isNum = false;
            }
            else {
                return false;
            }
        }
        if (args.indexOf(':') > -1 && args.indexOf(this.tic) === -1) {
            if (containsBoth && isAlpha && isNum) {
                return true;
            }
            else if (((isAlpha && !isNum) || (!isAlpha && isNum)) && !containsBoth) {
                return true;
            }
            else {
                return false;
            }
        }
        if (isAlpha && isNum && args.indexOf(this.tic) === -1) {
            return true;
        }
        return false;
    };
    /** @hidden */
    Calculate.prototype.setTokensForSheets = function (text) {
        var family = this.getSheetFamilyItem(this.grid);
        var sortedSheetNamesCollection = this.getSortedSheetNames();
        if (sortedSheetNamesCollection != null) {
            for (var n = 0; n < sortedSheetNamesCollection.length; n++) {
                var token = family.sheetNameToToken.get(sortedSheetNamesCollection[n]);
                token = token.split(this.sheetToken).join(this.tempSheetPlaceHolder);
                var s = this.singleTic + 'SHEET' + sortedSheetNamesCollection[n] + this.singleTic + this.sheetToken;
                if (text.indexOf(s) === -1) {
                    s = 'SHEET' + sortedSheetNamesCollection[n] + this.sheetToken;
                }
                text = text.split(s).join(token);
                s = sortedSheetNamesCollection[n] + this.sheetToken;
                text = text.split(s).join(token);
            }
        }
        text = text.split(this.tempSheetPlaceHolder).join(this.sheetToken);
        return text;
    };
    Calculate.prototype.getParentObjectCellValue = function (val) {
        if (val === this.trueValue || val === this.falseValue) {
            return val;
        }
        var i = val.lastIndexOf(this.sheetToken);
        var row = 0;
        var col = 0;
        var grid = this.grid;
        var family = this.getSheetFamilyItem(grid);
        if (i > -1 && family.tokenToParentObject !== null) {
            this.grid = family.tokenToParentObject.get(val.substring(0, i + 1));
            row = this.rowIndex(val);
            col = this.colIndex(val);
        }
        else if (i === -1) {
            var j = 0;
            while (j < val.length && this.isChar(val[j])) {
                j++;
            }
            if (j === val.length) {
                val = val.toLowerCase();
                return this.getErrorStrings()[CommonErrors.name];
            }
            else {
                row = this.rowIndex(val);
                col = this.colIndex(val);
                if (family.isSheetMember && family.parentObjectToToken != null) {
                    val = family.parentObjectToToken.get(this.grid) + val;
                }
            }
        }
        var saveCell = (this.cell === '' || this.cell === null) ? '' : this.cell;
        this.cell = val;
        if (saveCell === this.cell) {
            throw this.formulaErrorStrings[FormulasErrorsStrings.circular_reference];
        }
        var cValue = this.getParentCellValue(row, col, this.grid);
        this.grid = grid;
        this.cell = saveCell;
        return cValue;
    };
    Calculate.prototype.getParentCellValue = function (row, col, grd) {
        var alreadyComputed = false;
        // formulainfotable
        var cValue;
        /* tslint:disable-next-line */
        if (this.parentObject.getValueRowCol === undefined) {
            cValue = this.getValueRowCol(this.getSheetID(grd), row, col);
        }
        else {
            /* tslint:disable-next-line */
            cValue = this.parentObject.getValueRowCol(this.getSheetID(grd), row, col);
            return isNullOrUndefined(cValue) ? this.emptyString : cValue.toString();
        }
        if (cValue === '' || cValue === undefined) {
            cValue = '';
        }
        // if (cValue[cValue.length - 1] == ("%") && !this.isNaN(d)) {
        //     cValue = (Number(d) / 100).toString();
        // }
        return cValue;
    };
    /**
     * Getting the formula result.
     * @param {Object} grid - Specifies the parent object.
     * @param {number} row - Row index of the parent object or key.
     * @param {number} col - Column index of the parent object.
     * @returns string
     */
    Calculate.prototype.getValueRowCol = function (grid, row, col) {
        var key = this.rowsToKeyMap.get(row).toString();
        var result = this.getKeyValue(key).toString();
        if (result != null && result[result.length - 1] === ('%') && result.length > 1) {
            var d = this.parseFloat(result.substring(0, result.length - 1));
            if (this.isNaN(d)) {
                result = (Number(d) / 100).toString();
            }
        }
        return result;
    };
    /**
     * To add custom library formula.
     * @param {string} formulaName - Custom Formula name.
     * @param {string} functionName - Custom function name.
     * @returns void
     */
    Calculate.prototype.defineFunction = function (formulaName, functionName) {
        if (typeof functionName === 'string') {
            functionName = getValue(functionName, window);
        }
        formulaName = formulaName.toUpperCase();
        this.libraryFormulas.set(formulaName, { handler: functionName, isCustom: true });
    };
    /**
     * Specifies when changing the value.
     * @param {string} grid - Parent object reference name.
     * @param {ValueChangedArgs} changeArgs - Value changed arguments.
     * @param {boolean} isCalculate - Value that allow to calculate.
     */
    Calculate.prototype.valueChanged = function (grid, changeArgs, isCalculate) {
        var pgrid = grid;
        this.grid = grid;
        var isComputedValueChanged = true;
        var isCompute = true;
        var calcFamily = this.getSheetFamilyItem(pgrid);
        var cellTxt = getAlphalabel(changeArgs.getColIndex()) + changeArgs.getRowIndex().toString();
        if (calcFamily.sheetNameToParentObject !== null && calcFamily.sheetNameToParentObject.size > 0) {
            var token = calcFamily.parentObjectToToken.get(pgrid);
            cellTxt = token + cellTxt;
        }
        var argVal = changeArgs.getValue().toUpperCase();
        if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > -1 ||
            argVal.indexOf('RANDBETWEEN(') > -1 || this.randomValues.has(cellTxt)) {
            var randStrVal = this.randCollection.toString();
            if (!this.randomValues.has(cellTxt)) {
                this.randomValues.set(cellTxt, changeArgs.getValue());
                this.randCollection.push(cellTxt);
                this.isRandomVal = true;
            }
            else if (this.randomValues.has(cellTxt)) {
                if (argVal.indexOf('=RAND()') > -1 || argVal.indexOf('RAND()') > -1 || argVal.indexOf('=RANDBETWEEN(') > -1 ||
                    argVal.indexOf('RANDBETWEEN(') > -1) {
                    this.randomValues.set(cellTxt, changeArgs.getValue());
                }
                else if (changeArgs.getValue().toUpperCase() !== this.randomValues.get(cellTxt.toUpperCase())) {
                    this.randomValues.delete(cellTxt);
                    randStrVal = randStrVal.split(cellTxt + this.parseArgumentSeparator).join('').split(this.parseArgumentSeparator + cellTxt).join('').split(cellTxt).join('');
                    this.randCollection = randStrVal.split(this.parseArgumentSeparator);
                }
                if (this.randomValues.size === 0 && this.randCollection.length) {
                    this.isRandomVal = false;
                    this.randomValues.clear();
                    this.randCollection = [];
                }
            }
        }
        if (changeArgs.getValue() && changeArgs.getValue()[0] === this.getFormulaCharacter()) {
            this.cell = cellTxt;
            var formula = void 0;
            if (!isNullOrUndefined(isCompute)) {
                isCompute = isCalculate;
            }
            if (this.getFormulaInfoTable().has(cellTxt)) {
                formula = this.getFormulaInfoTable().get(cellTxt);
                if (changeArgs.getValue() !== formula.getFormulaText() || formula.getParsedFormula() == null) {
                    formula.setFormulaText(changeArgs.getValue());
                    if (this.getDependentFormulaCells().has(this.cell)) {
                        this.clearFormulaDependentCells(this.cell);
                    }
                    try {
                        formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                    }
                    catch (ex) {
                        formula.setFormulaValue(ex);
                        isCompute = false;
                    }
                }
                if (isCompute) {
                    this.parser.isFormulaParsed = true;
                    var cValue = this.computeFormula(formula.getParsedFormula());
                    isComputedValueChanged = (cValue !== formula.getFormulaValue());
                    formula.setFormulaValue(cValue);
                }
            }
            else {
                formula = new FormulaInfo();
                formula.setFormulaText(changeArgs.getValue());
                if (!this.getDependentFormulaCells().has(cellTxt)) {
                    this.getDependentFormulaCells().set(cellTxt, new Map());
                }
                try {
                    formula.setParsedFormula(this.parser.parseFormula(changeArgs.getValue()));
                }
                catch (ex) {
                    formula.setFormulaValue(ex);
                    isCompute = false;
                }
                if (isCompute) {
                    formula.setFormulaValue(this.computeFormula(formula.getParsedFormula()));
                }
                if (this.getFormulaInfoTable().has(cellTxt)) {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                }
                else {
                    this.getFormulaInfoTable().set(cellTxt, formula);
                }
            }
            if (isCompute) {
                /* tslint:disable */
                if (this.parentObject.setValueRowCol === undefined) {
                    this.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                }
                else {
                    this.parentObject.setValueRowCol(this.getSheetID(pgrid) + 1, formula.getFormulaValue(), changeArgs.getRowIndex(), changeArgs.getColIndex());
                }
                /* tslint:enable */
            }
        }
        else if (this.getFormulaInfoTable().has(cellTxt)) {
            this.getFormulaInfoTable().delete(cellTxt);
            if (this.getDependentFormulaCells().has(cellTxt)) {
                this.clearFormulaDependentCells(cellTxt);
            }
        }
        if (isCompute && isComputedValueChanged && this.getDependentCells().has(cellTxt) &&
            this.getDependentCells().get(cellTxt).toString() !== cellTxt) {
            this.getComputedValue().clear();
            this.refresh(cellTxt);
        }
    };
    /** @hidden */
    Calculate.prototype.getComputedValue = function () {
        if (this.computedValues === null) {
            this.computedValues = new Map();
        }
        return this.computedValues;
    };
    /**
     * @hidden
     */
    Calculate.prototype.setValueRowCol = function (value, formulaValue, row, col) {
        /* No Implementation */
    };
    Calculate.prototype.getSortedSheetNames = function () {
        var family = this.getSheetFamilyItem(this.grid);
        if (family != null && family.sheetNameToToken != null) {
            var arr_1 = [];
            family.sheetNameToToken.forEach(function (value, key) {
                arr_1.push(key);
                arr_1.sort();
            });
            this.sortedSheetNames = arr_1;
            this.sortedSheetNames.sort();
        }
        return this.sortedSheetNames;
    };
    /** @hidden */
    Calculate.prototype.getErrorLine = function (error) {
        /* tslint:disable-next-line */
        var errorStack = error.stack ? error.stack.split('\n')[1].split(':') : null;
        return errorStack ? errorStack[errorStack.length - 2] : null; // Getting row number of the error file.
    };
    /** @hidden */
    Calculate.prototype.createSheetFamilyID = function () {
        if (this.sheetFamilyID === Number.MAX_SAFE_INTEGER) {
            this.sheetFamilyID = Number.MIN_SAFE_INTEGER;
        }
        return this.sheetFamilyID++;
    };
    /** @hidden */
    Calculate.prototype.computeMinMax = function (args, operation) {
        var result;
        var argVal;
        var countStrVal = 0;
        if (isNullOrUndefined(args) || args.length === 0) {
            return this.formulaErrorStrings[FormulasErrorsStrings.wrong_number_arguments];
        }
        for (var k = 0, len = args.length; k < len; k++) {
            if (args[k].split(this.tic).join('').trim() === this.emptyString) {
                return this.getErrorStrings()[CommonErrors.value];
            }
        }
        result = (operation === 'max') ? this.minValue : this.maxValue;
        var argArr = args;
        if (argArr.length > 255) {
            return this.getErrorStrings()[CommonErrors.value];
        }
        for (var i = 0; i < argArr.length; i++) {
            if (argArr[i].indexOf(':') > -1 && this.isCellReference(argArr[i])) {
                var cellValue = this.getCellCollection(argArr[i]);
                for (var j = 0; j < cellValue.length; j++) {
                    argVal = this.getValueFromArg(cellValue[j]);
                    if (this.getErrorStrings().indexOf(argVal) > -1) {
                        return argVal;
                    }
                    var cellVal = this.parseFloat(argVal);
                    if (argVal === '' || this.isNaN(this.parseFloat(cellVal))) {
                        countStrVal = countStrVal + 1;
                        if (countStrVal === cellValue.length) {
                            result = 0;
                        }
                        continue;
                    }
                    else {
                        result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                    }
                }
            }
            else {
                var val = void 0;
                val = this.getValueFromArg(argArr[i]);
                if (this.getErrorStrings().indexOf(val) > -1) {
                    return val;
                }
                var cellVal = this.parseFloat(val);
                if (val === '' || this.isNaN(this.parseFloat(cellVal))) {
                    countStrVal = countStrVal + 1;
                    if (countStrVal === argVal.length) {
                        result = 0;
                    }
                    continue;
                }
                else {
                    result = (operation === 'max') ? Math.max(result, cellVal) : Math.min(result, cellVal);
                }
            }
        }
        return result.toString();
    };
    /** @hidden */
    Calculate.prototype.calculateAvg = function (args) {
        var sumCell = 0;
        var argArr = args;
        var cellVal = [];
        var avgVal = 0;
        var countNum = 0;
        var countNum1 = 0;
        for (var k = 0; k < argArr.length; k++) {
            if (argArr[k].indexOf(':') > -1 && this.isCellReference(argArr[k])) {
                countNum = 0;
                cellVal = this.getCellCollection(argArr[k]);
                avgVal = 0;
                for (var i = 0; i < cellVal.length; i++) {
                    var value = this.getValueFromArg(cellVal[i]);
                    if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                        continue;
                    }
                    avgVal = avgVal + this.parseFloat(value);
                    countNum = countNum + 1;
                }
                if (countNum === 0) {
                    return this.getErrorStrings()[CommonErrors.divzero];
                }
                avgVal = avgVal / countNum;
                sumCell = avgVal + sumCell;
            }
            else {
                if (argArr[k].indexOf(this.tic) > -1) {
                    if (isNaN(parseFloat(argArr[k].split(this.tic).join('')))) {
                        return this.getErrorStrings()[CommonErrors.value];
                    }
                }
                if (argArr[k].length === 0) {
                    argArr[k] = '1';
                }
                var value = this.getValueFromArg(argArr[k].split(this.tic).join(''));
                if (isNullOrUndefined(value) || isNaN(this.parseFloat(value))) {
                    return this.getErrorStrings()[CommonErrors.name];
                }
                sumCell = sumCell + this.parseFloat(value);
            }
        }
        return (sumCell / (argArr.length - countNum1)).toString();
    };
    /**
     * @hidden
     */
    Calculate.prototype.registerGridAsSheet = function (refName, model, sheetFamilyID) {
        if (isNullOrUndefined(this.modelToSheetID)) {
            this.modelToSheetID = new Map();
        }
        if (isNullOrUndefined(this.modelToSheetID.get(model))) {
            this.modelToSheetID.set(model, sheetFamilyID);
        }
        var family = this.getSheetFamilyItem(model);
        family.isSheetMember = true;
        var tempRef = refName.toUpperCase();
        if (family.parentObjectToToken.size === 0) {
            family.parentObjectToToken = new Map();
        }
        if (family.sheetNameToParentObject.size === 0) {
            family.sheetNameToParentObject = new Map();
        }
        if (family.sheetNameToToken.size === 0) {
            family.sheetNameToToken = new Map();
        }
        if (family.tokenToParentObject.size === 0) {
            family.tokenToParentObject = new Map();
        }
        if (!isUndefined(family.sheetNameToParentObject.get(tempRef))) {
            var token = family.sheetNameToToken.get(tempRef);
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
        }
        else {
            var token = this.sheetToken + this.tokenCount.toString() + this.sheetToken;
            this.tokenCount++;
            family.tokenToParentObject.set(token, model);
            family.parentObjectToToken.set(model, token);
            family.sheetNameToToken.set(tempRef, token);
            family.sheetNameToParentObject.set(tempRef, model);
        }
        return refName;
    };
    /**
     * @hidden
     */
    Calculate.prototype.unregisterGridAsSheet = function (refName, model) {
        var family = this.getSheetFamilyItem(model);
        var refName1 = refName.toUpperCase();
        if (family.sheetNameToParentObject != null && family.sheetNameToParentObject.has(refName1)) {
            family.sheetNameToParentObject.delete(refName1);
            var token = family.sheetNameToToken.get(refName1);
            family.sheetNameToToken.delete(refName1);
            family.tokenToParentObject.delete(token);
            family.parentObjectToToken.delete(model);
        }
    };
    ;
    /**
     * @hidden
     */
    Calculate.prototype.computeExpression = function (formula) {
        var parsedFormula = this.parser.parseFormula(formula);
        var calcValue = this.computeFormula(parsedFormula);
        return calcValue;
    };
    ;
    Calculate.prototype.isSheetMember = function () {
        var family = this.getSheetFamilyItem(this.grid);
        return isNullOrUndefined(family) ? false : family.isSheetMember;
    };
    /**
     * To dispose the calculate engine.
     * @returns void
     */
    Calculate.prototype.dispose = function () {
        this.resetKeys();
        // this.dependentCells.clear();
        // this.dependentFormulaCells.clear();
        this.namedRanges.clear();
        // this.sheetFamiliesList.clear();
        this.lFormulas.clear();
    };
    Calculate.prototype.refreshRandValues = function (cellRef) {
        var rowIdx;
        var colIdx;
        var value;
        var tokenRef = '';
        var stringCollection = this.randCollection.toString();
        var family;
        if (this.randomValues.has(cellRef)) {
            this.randomValues.delete(cellRef);
            stringCollection = stringCollection.split(cellRef + this.parseArgumentSeparator).join('').split(this.parseArgumentSeparator + cellRef).join('').split(cellRef).join('');
            if (this.randomValues.size === 0 && stringCollection === '') {
                this.randomValues.clear();
                this.randCollection = [];
            }
            else {
                this.randCollection = stringCollection.split(this.parseArgumentSeparator);
            }
        }
        for (var i = 0; i < this.randomValues.size; i++) {
            rowIdx = this.rowIndex(this.randCollection[i]);
            colIdx = this.colIndex(this.randCollection[i]);
            tokenRef = (parseFloat(this.getSheetToken(this.randCollection[i]).split(this.sheetToken).join('')) + 1).toString();
            family = this.getSheetFamilyItem(tokenRef);
            this.grid = family.sheetNameToParentObject.get(tokenRef);
            value = this.randomValues.get(this.randCollection[i]);
            value = this.computeFormula(value);
            if (this.parentObject.setValueRowCol === undefined) {
                this.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            }
            else {
                this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, value, rowIdx, colIdx);
            }
        }
    };
    Calculate.prototype.refresh = function (cellRef) {
        if (this.dependencyLevel === 0) {
            this.refreshedCells.clear();
        }
        if (this.getDependentCells().has(cellRef) && this.getDependentCells().get(cellRef) !== null) {
            var family = this.getSheetFamilyItem(this.grid);
            this.dependencyLevel = this.dependencyLevel + 1;
            try {
                var dependentCells = this.getDependentCells().get(cellRef);
                var i = void 0;
                for (i = 0; i < dependentCells.length; i++) {
                    var dCell = dependentCells[i];
                    var token = this.getSheetToken(dCell);
                    if (token.length) {
                        this.grid = family.tokenToParentObject.get(token);
                    }
                    try {
                        var rowIdx = this.rowIndex(dCell);
                        var colIdx = this.colIndex(dCell);
                        var formulaInfo = this.getFormulaInfoTable().get(dCell);
                        var result = void 0;
                        if (formulaInfo) {
                            this.cell = dCell;
                            if (!this.getComputedValue().has(dCell)) {
                                this.parser.isFormulaParsed = true;
                                result = this.computeFormula(formulaInfo.getParsedFormula());
                                this.computedValues.set(dCell, result);
                            }
                            else {
                                result = this.getComputedValue().get(dCell);
                            }
                            formulaInfo.setFormulaValue(result);
                        }
                        if (this.parentObject.setValueRowCol === undefined) {
                            this.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        }
                        else {
                            this.parentObject.setValueRowCol(this.getSheetID(this.grid) + 1, formulaInfo.getFormulaValue(), rowIdx, colIdx);
                        }
                        if (!this.refreshedCells.has(dCell)) {
                            this.refreshedCells.set(dCell, []);
                            this.refresh(dCell);
                        }
                    }
                    catch (ex) {
                        continue;
                    }
                }
            }
            finally {
                this.grid = family.tokenToParentObject.get(this.getSheetToken(cellRef));
                this.dependencyLevel--;
                if (this.dependencyLevel === 0) {
                    this.refreshedCells.clear();
                }
            }
        }
    };
    var Calculate_1;
    __decorate([
        Property(true)
    ], Calculate.prototype, "includeBasicFormulas", void 0);
    __decorate([
        Event()
    ], Calculate.prototype, "onFailure", void 0);
    Calculate = Calculate_1 = __decorate([
        NotifyPropertyChanges
    ], Calculate);
    return Calculate;
}(Base));
export { Calculate };
/** @hidden */
var FormulaError = /** @class */ (function () {
    function FormulaError(errorMessage, formulaAutoCorrection) {
        this.formulaCorrection = false;
        this.message = errorMessage;
        this.formulaCorrection = formulaAutoCorrection;
    }
    return FormulaError;
}());
export { FormulaError };
/** @hidden */
var FormulaInfo = /** @class */ (function () {
    function FormulaInfo() {
        /**
         * @hidden
         */
        this.calcID = Number.MIN_VALUE + 1;
        this.calcID1 = Number.MIN_VALUE + 1;
    }
    /**
     * @hidden
     */
    FormulaInfo.prototype.getFormulaText = function () {
        return this.formulaText;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setFormulaText = function (value) {
        this.formulaText = value;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.getFormulaValue = function () {
        return this.formulaValue;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setFormulaValue = function (value) {
        this.formulaValue = value;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.getParsedFormula = function () {
        return this.parsedFormula;
    };
    /**
     * @hidden
     */
    FormulaInfo.prototype.setParsedFormula = function (value) {
        this.parsedFormula = value;
    };
    return FormulaInfo;
}());
export { FormulaInfo };
/** @hidden */
var CalcSheetFamilyItem = /** @class */ (function () {
    function CalcSheetFamilyItem() {
        /**
         * @hidden
         */
        this.isSheetMember = false;
        /**
         * @hidden
         */
        this.parentObjectToToken = new Map();
        /**
         * @hidden
         */
        this.sheetDependentCells = new Map();
        /**
         * @hidden
         */
        this.sheetDependentFormulaCells = new Map();
        /**
         * @hidden
         */
        this.sheetNameToParentObject = new Map();
        /**
         * @hidden
         */
        this.sheetNameToToken = new Map();
        /**
         * @hidden
         */
        this.tokenToParentObject = new Map();
        /**
         * @hidden
         */
        this.sheetFormulaInfotable = new Map();
    }
    return CalcSheetFamilyItem;
}());
export { CalcSheetFamilyItem };
/**
 * @hidden
 */
export function getAlphalabel(col) {
    var cols = [];
    var n = 0;
    var charText = 'A';
    while (col > 0 && n < 9) {
        col--;
        var aCharNo = charText.charCodeAt(0);
        cols[n] = String.fromCharCode(col % 26 + aCharNo);
        col = parseInt((col / 26).toString(), 10);
        n++;
    }
    var chs = [];
    for (var i = 0; i < n; i++) {
        chs[n - i - 1] = cols[i];
    }
    return chs.join('');
}
var ValueChangedArgs = /** @class */ (function () {
    function ValueChangedArgs(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.getRowIndex = function () {
            return row;
        };
        this.setRowIndex = function (value) {
            row = value;
        };
        this.getColIndex = function () {
            return col;
        };
        this.setColIndex = function (value) {
            col = value;
        };
        this.getValue = function () {
            return value;
        };
        this.setValue = function (value) {
            value = value;
        };
        return this;
    }
    return ValueChangedArgs;
}());
export { ValueChangedArgs };
