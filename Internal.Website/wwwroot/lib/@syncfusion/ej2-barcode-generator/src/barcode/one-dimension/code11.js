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
import { OneDimension } from '../one-dimension';
/**
 * code39 used to calculate the barcode of type 39
 */
var Code11 = /** @class */ (function (_super) {
    __extends(Code11, _super);
    function Code11() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Validate the given input to check whether the input is valid one or not
     */
    /** @private */
    Code11.prototype.validateInput = function (value) {
        if (value.search(/^[0-9\-\*]+$/) === -1) {
            return 'This bar code support 0-9 , * , -';
        }
        else {
            return undefined;
        }
    };
    /**
     * get the code value to check
     */
    Code11.prototype.getCodeValue = function () {
        var codes = {
            '0': '111121',
            '1': '211121',
            '2': '121121',
            '3': '221111',
            '4': '112121',
            '5': '212111',
            '6': '122111',
            '7': '111221',
            '8': '211211',
            '9': '211111',
            '-': '112111',
            '*': '112211'
        };
        return codes;
    };
    Code11.prototype.getPatternCollection = function (givenChar) {
        var codeNumber;
        var code = [];
        var codes = this.getCodeValue();
        for (var i = 0; i < givenChar.length; i++) {
            code.push(codes[givenChar[i]]);
        }
        return code;
    };
    /** @private */
    Code11.prototype.draw = function (canvas) {
        var codes = [];
        var givenChar = '*' + this.value + '*';
        codes = this.getPatternCollection(givenChar);
        this.calculateBarCodeAttributes(codes, canvas);
    };
    return Code11;
}(OneDimension));
export { Code11 };
