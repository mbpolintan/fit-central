import { NumberFormatType } from '../common/index';
import { CellModel, Workbook } from '../base/index';
/**
 * Specifies number format.
 */
export declare class WorkbookNumberFormat {
    private parent;
    private localeObj;
    private decimalSep;
    private groupSep;
    constructor(parent: Workbook);
    private numberFormatting;
    /**
     * @hidden
     */
    getFormattedCell(args: {
        [key: string]: string | number | boolean | CellModel;
    }): string;
    private processFormats;
    private autoDetectGeneralFormat;
    private findSuffix;
    private applyNumberFormat;
    private currencyFormat;
    private percentageFormat;
    private accountingFormat;
    private shortDateFormat;
    private longDateFormat;
    private timeFormat;
    private scientificFormat;
    private fractionFormat;
    private findDecimalPlaces;
    checkDateFormat(args: {
        [key: string]: string | number | boolean | Date | CellModel;
    }): void;
    private checkCustomDateFormat;
    private formattedBarText;
    /**
     * Adding event listener for number format.
     */
    addEventListener(): void;
    /**
     * Removing event listener for number format.
     */
    removeEventListener(): void;
    /**
     * To Remove the event listeners.
     */
    destroy(): void;
    /**
     * Get the workbook number format module name.
     */
    getModuleName(): string;
}
/**
 * To Get the number built-in format code from the number format type.
 * @param {string} type - Specifies the type of the number formatting.
 */
export declare function getFormatFromType(type: NumberFormatType): string;
/**
 * @hidden
 */
export declare function getTypeFromFormat(format: string): string;
