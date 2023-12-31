import { Internationalization, L10n } from '@syncfusion/ej2-base';
import { IDataOptions, PivotEngine } from '../../base/engine';
import { CommonArgs, TreeDataInfo } from './interface';
import { Mode } from '../base/enum';
import { CommonKeyboardInteraction } from '../actions/keyboard';
import { EventBase } from '../actions/event-base';
import { NodeStateModified } from '../actions/node-state-modified';
import { DataSourceUpdate } from '../actions/dataSource-update';
import { ErrorDialog } from '../popups/error-dialog';
import { FilterDialog } from '../popups/filter-dialog';
import { PivotView } from '../../pivotview';
import { PivotFieldList } from '../../pivotfieldlist';
import { OlapEngine } from '../../base/olap/engine';
/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource
 * @hidden
 */
/** @hidden */
export declare class PivotCommon {
    /** @hidden */
    globalize: Internationalization;
    /** @hidden */
    localeObj: L10n;
    /** @hidden */
    engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    dataSourceSettings: IDataOptions;
    /** @hidden */
    element: HTMLElement;
    /** @hidden */
    moduleName: string;
    /** @hidden */
    enableRtl: boolean;
    /** @hidden */
    isAdaptive: boolean;
    /** @hidden */
    renderMode: Mode;
    /** @hidden */
    parentID: string;
    /** @hidden */
    control: PivotView | PivotFieldList;
    /** @hidden */
    currentTreeItems: {
        [key: string]: Object;
    }[];
    /** @hidden */
    savedTreeFilterPos: {
        [key: number]: string;
    };
    /** @hidden */
    currentTreeItemsPos: {
        [key: string]: TreeDataInfo;
    };
    /** @hidden */
    searchTreeItems: {
        [key: string]: Object;
    }[];
    /** @hidden */
    editorLabelElement: HTMLLabelElement;
    /** @hidden */
    isDataOverflow: boolean;
    /** @hidden */
    isDateField: boolean;
    /** @hidden */
    dataType: string;
    /** @hidden */
    nodeStateModified: NodeStateModified;
    /** @hidden */
    dataSourceUpdate: DataSourceUpdate;
    /** @hidden */
    eventBase: EventBase;
    /** @hidden */
    errorDialog: ErrorDialog;
    /** @hidden */
    filterDialog: FilterDialog;
    /** @hidden */
    keyboardModule: CommonKeyboardInteraction;
    /**
     * Constructor for Pivot Common class
     * @param  {CommonArgs} control?
     * @hidden
     */
    constructor(control: CommonArgs);
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    destroy(): void;
}
