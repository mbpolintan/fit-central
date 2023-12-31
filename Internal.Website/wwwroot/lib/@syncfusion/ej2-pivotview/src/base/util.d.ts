import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings } from './engine';
import { IDrillOptions, IGroupSettings, FieldItemInfo } from './engine';
import { ICalculatedFieldSettings } from './engine';
import { PivotView, PivotViewModel } from '../pivotview';
import { PivotFieldList, PivotFieldListModel } from '../pivotfieldlist';
/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */
export declare class PivotUtil {
    static getType(value: Date): string;
    static resetTime(date: Date): Date;
    static getClonedData(data: {
        [key: string]: Object;
    }[]): {
        [key: string]: Object;
    }[];
    static getClonedPivotValues(pivotValues: IPivotValues): IPivotValues;
    private static getClonedPivotValueObj;
    private static getDefinedObj;
    static inArray(value: Object, collection: Object[]): number;
    static isContainCommonElements(collection1: Object[], collection2: Object[]): boolean;
    static setPivotProperties(control: any, properties: any): void;
    static getClonedDataSourceSettings(dataSourceSettings: IDataOptions): IDataOptions;
    static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void;
    static cloneFieldSettings(collection: IFieldOptions[]): IFieldOptions[];
    static cloneFilterSettings(collection: IFilter[]): IFilter[];
    private static cloneSortSettings;
    static cloneDrillMemberSettings(collection: IDrillOptions[]): IDrillOptions[];
    static cloneFormatSettings(collection: IFormatSettings[]): IFormatSettings[];
    private static CloneValueSortObject;
    private static CloneAuthenticationObject;
    static cloneCalculatedFieldSettings(collection: ICalculatedFieldSettings[]): ICalculatedFieldSettings[];
    private static cloneConditionalFormattingSettings;
    static cloneGroupSettings(collection: IGroupSettings[]): IGroupSettings[];
    private static cloneCustomGroups;
    static getFilterItemByName(fieldName: string, fields: IFilter[]): IFilter;
    static getFieldByName(fieldName: string, fields: IFieldOptions[] | ISort[] | IFormatSettings[] | IDrillOptions[] | IGroupSettings[] | ICalculatedFieldSettings[]): IFieldOptions | ISort | IFormatSettings | IDrillOptions | IGroupSettings | ICalculatedFieldSettings;
    static getFieldInfo(fieldName: string, control: PivotView | PivotFieldList): FieldItemInfo;
    static isButtonIconRefesh(prop: string, oldProp: PivotViewModel | PivotFieldListModel, newProp: PivotViewModel | PivotFieldListModel): boolean;
}
