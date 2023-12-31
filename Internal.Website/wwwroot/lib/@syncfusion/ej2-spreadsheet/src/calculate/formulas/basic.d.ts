import { IBasicFormula } from '../common/index';
import { Calculate } from '../base/index';
/**
 * Represents the basic formulas module.
 */
export declare class BasicFormulas {
    private parent;
    formulas: IBasicFormula[];
    private isConcat;
    constructor(parent?: Calculate);
    private init;
    private addFormulaCollection;
    /** @hidden */
    ComputeSUM(...args: string[]): string | number;
    /** @hidden */
    ComputeCOUNT(...args: string[]): number | string;
    /** @hidden */
    ComputeDATE(...args: string[]): Date | string;
    /** @hidden */
    ComputeFLOOR(...args: string[]): number | string;
    /** @hidden */
    ComputeCEILING(...args: string[]): number | string;
    /** @hidden */
    ComputeDAY(...serialNumber: string[]): number | string;
    /** @hidden */
    ComputeIF(...args: string[]): string | number;
    /** @hidden */
    ComputeIFERROR(...args: string[]): number | string;
    /** @hidden */
    ComputePRODUCT(...range: string[]): string | number;
    /** @hidden */
    ComputeDAYS(...range: string[]): number | string;
    /** @hidden */
    ComputeCHOOSE(...args: string[]): string | number;
    /** @hidden */
    ComputeSUMIF(...range: string[]): string | number;
    /** @hidden */
    ComputeABS(...absValue: string[]): string | number;
    /** @hidden */
    ComputeAVERAGE(...args: string[]): string;
    /** @hidden */
    ComputeAVERAGEIF(...range: string[]): string | number;
    /** @hidden */
    ComputeCONCATENATE(...range: string[]): string;
    /** @hidden */
    ComputeCONCAT(...range: string[]): string;
    /** @hidden */
    ComputeMAX(...args: string[]): string;
    /** @hidden */
    ComputeMIN(...args: string[]): string;
    /** @hidden */
    ComputeRAND(...args: string[]): string;
    /** @hidden */
    ComputeAND(...args: string[]): string;
    /** @hidden */
    ComputeOR(...args: string[]): string;
    /** @hidden */
    ComputeFIND(...args: string[]): string | number;
    /** @hidden */
    ComputeINDEX(...range: string[]): string | number;
    /** @hidden */
    ComputeIFS(...range: string[]): string | number;
    /** @hidden */
    ComputeCOUNTA(...args: string[]): number | string;
    /** @hidden */
    ComputeAVERAGEA(...args: string[]): number | string;
    /** @hidden */
    ComputeCOUNTIF(...args: string[]): number | string;
    /** @hidden */
    ComputeSUMIFS(...range: string[]): string | number;
    /** @hidden */
    ComputeCOUNTIFS(...args: string[]): number | string;
    /** @hidden */
    ComputeAVERAGEIFS(...args: string[]): number | string;
    /** @hidden */
    ComputeMATCH(...args: string[]): string | number;
    /** @hidden */
    ComputeLOOKUP(...range: string[]): string | number;
    /** @hidden */
    ComputeVLOOKUP(...range: string[]): string | number;
    /** @hidden */
    ComputeSUBTOTAL(...range: string[]): string | number;
    /** @hidden */
    ComputeRADIANS(...range: string[]): string | number;
    /** @hidden */
    ComputeRANDBETWEEN(...range: string[]): string | number;
    /** @hidden */
    ComputeSLOPE(...range: string[]): string | number;
    /** @hidden */
    ComputeINTERCEPT(...range: string[]): string | number;
    /** @hidden */
    ComputeLN(...logValue: string[]): string | number;
    /** @hidden */
    ComputeISNUMBER(...logValue: string[]): boolean | string;
    /** @hidden */
    ComputeROUND(...logValue: string[]): number | string;
    /** @hidden */
    ComputePOWER(...logValue: string[]): boolean | string;
    /** @hidden */
    ComputeLOG(...logValue: string[]): number | string;
    /** @hidden */
    ComputeTRUNC(...logValue: string[]): boolean | string;
    /** @hidden */
    ComputeEXP(...logValue: string[]): boolean | string;
    /** @hidden */
    ComputeGEOMEAN(...logValue: string[]): boolean | string;
    private getDataCollection;
    protected getModuleName(): string;
}
