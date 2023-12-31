import { Component, ModuleDeclaration } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, KeyboardEvents } from '@syncfusion/ej2-base';
import { Column, ColumnModel } from '../models/column';
import { BeforeBatchSaveArgs, BeforeBatchAddArgs, BatchDeleteArgs, BeforeBatchDeleteArgs } from '@syncfusion/ej2-grids';
import { ColumnQueryModeType, HeaderCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { RowDragEventArgs, RowDropSettingsModel } from '@syncfusion/ej2-grids';
import { DetailDataBoundEventArgs, ClipMode, ColumnChooser } from '@syncfusion/ej2-grids';
import { SearchEventArgs, AddEventArgs, EditEventArgs, DeleteEventArgs } from '@syncfusion/ej2-grids';
import { SaveEventArgs, CellSaveArgs, BatchAddArgs, BatchCancelArgs, BeginEditArgs, CellEditArgs } from '@syncfusion/ej2-grids';
import { TextWrapSettingsModel } from '../models/textwrap-settings-model';
import { Filter } from '../actions/filter';
import { BeforeCopyEventArgs, BeforePasteEventArgs } from '@syncfusion/ej2-grids';
import { TreeClipboard } from '../actions/clipboard';
import { Aggregate } from '../actions/summary';
import { Reorder } from '../actions/reorder';
import { Resize } from '../actions/resize';
import { Selection as TreeGridSelection } from '../actions/selection';
import { ColumnMenu } from '../actions/column-menu';
import { DetailRow } from '../actions/detail-row';
import { Freeze } from '../actions/freeze-column';
import { Print } from '../actions/print';
import { TreeGridModel } from './treegrid-model';
import { FilterSettingsModel } from '../models/filter-settings-model';
import { SearchSettingsModel } from '../models/search-settings-model';
import { RowInfo, RowDataBoundEventArgs, PageEventArgs, FilterEventArgs, FailureEventArgs, SortEventArgs } from '@syncfusion/ej2-grids';
import { RowSelectingEventArgs, RowSelectEventArgs, RowDeselectEventArgs, IIndex, ISelectedCell } from '@syncfusion/ej2-grids';
import { CellSelectEventArgs, CellDeselectEventArgs } from '@syncfusion/ej2-grids';
import { SelectionSettingsModel } from '../models/selection-settings-model';
import { SortDirection, ColumnDragEventArgs } from '@syncfusion/ej2-grids';
import { PrintMode, Data, ContextMenuItemModel } from '@syncfusion/ej2-grids';
import { ColumnMenuItem, ColumnMenuItemModel, CheckBoxChangeEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExportCompleteArgs, ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { PdfExportCompleteArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelExportProperties, PdfExportProperties, CellSelectingEventArgs, PrintEventArgs } from '@syncfusion/ej2-grids';
import { ColumnMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { BeforeDataBoundArgs } from '@syncfusion/ej2-grids';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Grid, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Render } from '../renderer/render';
import { DataManipulation } from './data';
import { RowDD } from '../actions/rowdragdrop';
import { Sort } from '../actions/sort';
import { ITreeData, RowExpandedEventArgs } from './interface';
import { CellSaveEventArgs, DataStateChangeEventArgs, RowExpandingEventArgs } from './interface';
import { GridLine } from '@syncfusion/ej2-grids';
import { DataSourceChangedEventArgs, RecordDoubleClickEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';
import { ToolbarItems, ToolbarItem, ContextMenuItem, RowPosition, CopyHierarchyType } from '../enum';
import { ItemModel, ClickEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { PageSettingsModel } from '../models/page-settings-model';
import { AggregateRowModel } from '../models/summary-model';
import { ExcelExport } from '../actions/excel-export';
import { PdfExport } from '../actions/pdf-export';
import { Toolbar } from '../actions/toolbar';
import { Page } from '../actions/page';
import { ContextMenu } from '../actions/context-menu';
import { EditSettingsModel } from '../models/edit-settings-model';
import { Edit } from '../actions/edit';
import { SortSettingsModel } from '../models/sort-settings-model';
/**
 * Represents the TreeGrid component.
 * ```html
 * <div id='treegrid'></div>
 * <script>
 *  var treegridObj = new TreeGrid({ allowPaging: true });
 *  treegridObj.appendTo('#treegrid');
 * </script>
 * ```
 */
export declare class TreeGrid extends Component<HTMLElement> implements INotifyPropertyChanged {
    constructor(options?: TreeGridModel, element?: Element);
    private defaultLocale;
    private dataResults;
    private l10n;
    dataModule: DataManipulation;
    private registeredTemplate;
    private uniqueIDCollection;
    private uniqueIDFilterCollection;
    private changedRecords;
    private deletedRecords;
    private addedRecords;
    private targetElement;
    private isGantt;
    /**
     * The `sortModule` is used to manipulate sorting in TreeGrid.
     */
    sortModule: Sort;
    private isSelfReference;
    private columnModel;
    private isExpandAll;
    private isCollapseAll;
    private isExpandRefresh;
    private gridSettings;
    private isEditCollapse;
    /** @hidden */
    initialRender: boolean;
    /** @hidden */
    flatData: Object[];
    /** @hidden */
    isLocalData: boolean;
    /** @hidden */
    parentData: Object[];
    /**
     * @hidden
     */
    renderModule: Render;
    /** @hidden */
    summaryModule: Aggregate;
    /**
     * The `reorderModule` is used to manipulate reordering in TreeGrid.
     */
    reorderModule: Reorder;
    /**
     * The `columnMenuModule` is used to manipulate column menu items and its action in TreeGrid.
     */
    columnMenuModule: ColumnMenu;
    /**
     * The `rowDragandDrop` is used to manipulate Row Reordering in TreeGrid.
     */
    rowDragAndDropModule: RowDD;
    /**
     * The `contextMenuModule` is used to handle context menu items and its action in the TreeGrid.
     */
    contextMenuModule: ContextMenu;
    /**
     * `detailRowModule` is used to handle detail rows rendering in the TreeGrid.
     * @hidden
     */
    detailRowModule: DetailRow;
    /**
     * `freezeModule` is used to freeze the rows and columns in the TreeGrid.
     * @hidden
     */
    freezeModule: Freeze;
    /**
     * Gets or sets the number of frozen rows.
     * @default 0
     */
    frozenRows: number;
    /**
     * Gets or sets the number of frozen columns.
     * @default 0
     */
    frozenColumns: number;
    /**
     *  Defines the mode of clip. The available modes are,
     * `Clip`: Truncates the cell content when it overflows its area.
     * `Ellipsis`: Displays ellipsis when the cell content overflows its area.
     * `EllipsisWithTooltip`:  Displays ellipsis when the cell content overflows its area,
     *  also it will display the tooltip while hover on ellipsis is applied..
     * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
     * @aspType Syncfusion.EJ2.Grids.ClipMode
     * @isEnumeration true
     * @blazorType Syncfusion.Blazor.Grids.ClipMode
     */
    clipMode: ClipMode;
    /**
     * `resizeModule` is used to manipulate resizing in the TreeGrid.
     * @hidden
     */
    resizeModule: Resize;
    /**
     * The `keyboardModule` is used to manipulate keyboard interactions in TreeGrid.
     */
    keyboardModule: KeyboardEvents;
    /**
     * The `printModule` is used to handle the printing feature of the TreeGrid.
     */
    printModule: Print;
    /**
     * `clipboardModule` is used to handle TreeGrid copy action.
     */
    clipboardModule: TreeClipboard;
    private keyConfigs;
    /** @hidden */
    filterModule: Filter;
    excelExportModule: ExcelExport;
    pdfExportModule: PdfExport;
    selectionModule: TreeGridSelection;
    /** @hidden */
    /** @hidden */
    grid: Grid;
    /**
     * Defines the schema of dataSource.
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.
     * @default []
     */
    columns: ColumnModel[] | string[] | Column[];
    /**
     * Specifies the mapping property path for child records in data source
     * @default null
     */
    childMapping: string;
    /**
     * Specifies whether record is parent or not for the remote data binding
     * @default null
     */
    hasChildMapping: string;
    /**
     * Specifies the index of the column that needs to have the expander button.
     * @default 0
     */
    treeColumnIndex: number;
    /**
     * Specifies the name of the field in the dataSource, which contains the id of that row.
     * @default null
     */
    idMapping: string;
    /**
     * Specifies the name of the field in the dataSource, which contains the parent’s id
     * @default null
     */
    parentIdMapping: string;
    /**
     * Specifies whether to load all the rows in collapsed state when the TreeGrid is rendered for the first time.
     * @default false
     */
    enableCollapseAll: boolean;
    /**
     * Specifies the mapping property path for the expand status of a record in data source.
     * @default null
     */
    expandStateMapping: string;
    /**
     * If `allowRowDragAndDrop` is set to true, you can drag and drop treegrid rows at another treegrid.
     * @default false
     */
    allowRowDragAndDrop: boolean;
    /**
     * It is used to render TreeGrid table rows.
     * @default []
     * @isGenericType true
     * @isDataSource true
     */
    dataSource: Object | DataManager;
    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     * @default null
     * @blazorType Syncfusion.Blazor.Data.Query
     */
    query: Query;
    /**
     * @hidden
     */
    cloneQuery: Query;
    /**
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the TreeGrid.
     * * `CurrentPage`: Prints the current page of the TreeGrid.
     * @default Syncfusion.EJ2.Grids.PrintMode.AllPages
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.PrintMode
     * @blazorType Syncfusion.Blazor.Grids.PrintMode
     */
    printMode: PrintMode;
    /**
     * If `allowPaging` is set to true, pager renders.
     * @default false
     */
    allowPaging: boolean;
    /**
     * If `loadChildOnDemand` is enabled, parent records are render in expanded state.
     * @default false
     */
    loadChildOnDemand: boolean;
    /**
     * If `allowTextWrap` set to true,
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells.
     * @default false
     */
    allowTextWrap: boolean;
    /**
     * Configures the text wrap in the TreeGrid.
     * @default {wrapMode:"Both"}
     */
    textWrapSettings: TextWrapSettingsModel;
    /**
     * If `allowReordering` is set to true, TreeGrid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If TreeGrid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * @default false
     */
    allowReordering: boolean;
    /**
     * If `allowResizing` is set to true, TreeGrid columns can be resized.
     * @default false
     */
    allowResizing: boolean;
    /**
     * If `autoCheckHierarchy` is set to true, hierarchy checkbox selection is enabled in TreeGrid.
     * @default false
     */
    autoCheckHierarchy: boolean;
    /**
     * Configures the pager in the TreeGrid.
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}
     */
    pageSettings: PageSettingsModel;
    /**
     * Configures the row drop settings of the TreeGrid.
     */
    rowDropSettings: RowDropSettingsModel;
    /**
     * @hidden
     * It used to render pager template
     * @default null
     */
    pagerTemplate: string;
    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [`Column menu`](../../treegrid/columns/#column-menu/) for its configuration.
     * @default false
     */
    showColumnMenu: boolean;
    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.
     * @default false
     */
    showColumnChooser: boolean;
    /**
     * If `allowSorting` is set to true, it allows sorting of treegrid records when column header is clicked.
     * @default false
     */
    allowSorting: boolean;
    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the treegrid.
     * > `allowSorting` should be true.
     * @default true
     */
    allowMultiSorting: boolean;
    /**
     * Configures the sort settings of the TreeGrid.
     * @default {columns:[]}
     */
    sortSettings: SortSettingsModel;
    /**
     * Configures the TreeGrid aggregate rows.
     * > Check the [`Aggregates`](../../treegrid/aggregates/) for its configuration.
     * @default []
     */
    aggregates: AggregateRowModel[];
    /**
     * Configures the edit settings.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    editSettings: EditSettingsModel;
    /**
     * If `allowFiltering` is set to true the filter bar will be displayed.
     * If set to false the filter bar will not be displayed.
     * Filter bar allows the user to filter tree grid records with required criteria.
     * @default false
     */
    allowFiltering: boolean;
    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     *
     */
    detailTemplate: string;
    /**
     * Configures the filter settings of the TreeGrid.
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
     */
    filterSettings: FilterSettingsModel;
    /**
     * Configures the search settings of the TreeGrid.
     * @default {search: [] , operators: {}}
     */
    searchSettings: SearchSettingsModel;
    /**
     * `toolbar` defines the ToolBar items of the TreeGrid.
     * It contains built-in and custom toolbar items.
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole TreeGrid ToolBar.
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the TreeGrid's Toolbar.
     * <br><br>
     * The available built-in ToolBar items are:
     * * Search: Searches records by the given key.
     * * ExpandAll: Expands all the rows in TreeGrid
     * * CollapseAll: Collapses all the rows in TreeGrid
     * * ExcelExport - Export the TreeGrid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the TreeGrid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the TreeGrid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     * @default null
     */
    toolbar: (ToolbarItems | string | ItemModel | ToolbarItem)[];
    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate: string;
    /**
     * Defines the mode of TreeGrid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical TreeGrid lines.
     * * `None`: No TreeGrid lines are displayed.
     * * `Horizontal`: Displays the horizontal TreeGrid lines only.
     * * `Vertical`: Displays the vertical TreeGrid lines only.
     * * `Default`: Displays TreeGrid lines based on the theme.
     * @default Syncfusion.EJ2.Grids.GridLine.Default
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.GridLine
     * @blazorType Syncfusion.Blazor.Grids.GridLine
     */
    gridLines: GridLine;
    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `PdfExport` - Export the grid as Pdf format.
     * * `ExcelExport` - Export the grid as Excel format.
     * * `CsvExport` - Export the grid as CSV format.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `FirstPage` - Go to the first page.
     * * `PrevPage` - Go to the previous page.
     * * `LastPage` - Go to the last page.
     * * `NextPage` - Go to the next page.
     *
     * @default null
     */
    contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];
    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like filterbar, menu filter.
     * @default null
     */
    columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];
    /**
     * The row template that renders customized rows from the given template.
     * By default, TreeGrid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine/) or HTML element ID.
     * > * The row template must be a table row.
     *
     * > Check the [`Row Template`](../../treegrid/row) customization.
     */
    rowTemplate: string;
    /**
     * `copyHierarchyMode` Defines the copy clipboard types.
     * <br><br>
     * The available built-in items are,
     * * `Parent` - Copy the selected data with parent record.
     * * `Child` - Copy the selected data with child record.
     * * `Both` - Copy the selected data with both parent and child record.
     * * `None` - Copy only the selected record.
     * @default Parent
     */
    copyHierarchyMode: CopyHierarchyType;
    /**
     * Defines the height of TreeGrid rows.
     * @default null
     */
    rowHeight: number;
    /**
     * If `enableAltRow` is set to true, the TreeGrid will render with `e-altrow` CSS class to the alternative tr elements.
     * > Check the [`AltRow`](../../treegrid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     * @default true
     */
    enableAltRow: boolean;
    /**
     * Enables or disables the key board interaction of TreeGrid.
     * @hidden
     * @default true
     */
    allowKeyboard: boolean;
    /**
     * If `enableHover` is set to true, the row hover is enabled in the TreeGrid.
     * @default false
     */
    enableHover: boolean;
    /**
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     * @default false
     */
    enableAutoFill: boolean;
    /**
     * Defines the scrollable height of the TreeGrid content.
     * @default 'auto'
     */
    height: string | number;
    /**
     * Defines the TreeGrid width.
     * @default 'auto'
     */
    width: string | number;
    /**
     * If `enableVirtualization` set to true, then the TreeGrid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in TreeGrid.
     * @default false
     */
    enableVirtualization: boolean;
    /**
     * `columnQueryMode`provides options to retrieves data from the data source.Their types are
     * * `All`: It retrieves whole data source.
     * * `Schema`: retrieves data for all the defined columns in TreeGrid from the data source.
     * * `ExcludeHidden`: retrieves data only for visible columns of TreeGrid from the data Source.
     * @default All
     */
    columnQueryMode: ColumnQueryModeType;
    /**
     * Triggers when the component is created.
     * @event
     * @blazorproperty 'Created'
     */
    created: EmitType<Object>;
    /**
     * This event allows customization of TreeGrid properties before rendering.
     * @event
     * @blazorproperty 'OnLoad'
     */
    load: EmitType<Object>;
    /**
     * Triggers while expanding the TreeGrid record
     * @event
     * @blazorproperty 'Expanding'
     */
    expanding: EmitType<RowExpandingEventArgs>;
    /**
     * Triggers after the record is expanded
     * @event
     * @blazorproperty 'Expanded'
     */
    expanded: EmitType<RowExpandedEventArgs>;
    /**
     * Triggers while collapsing the TreeGrid record
     * @event
     * @blazorproperty 'Collapsing'
     */
    collapsing: EmitType<RowExpandingEventArgs>;
    /**
     * Triggers after the record is collapsed.
     * @event
     * @blazorproperty 'Collapsed'
     */
    collapsed: EmitType<RowExpandingEventArgs>;
    /**
     * Triggers when cell is saved.
     * @event
     * @blazorproperty 'OnCellSave'
     * @blazorType Syncfusion.Blazor.Grids.CellSaveArgs<TValue>
     */
    cellSave: EmitType<CellSaveArgs>;
    /**
     * Triggers when cell is saved.
     * @event
     * @blazorproperty 'CellSaved'
     * @blazorType Syncfusion.Blazor.Grids.CellSaveArgs<TValue>
     */
    cellSaved: EmitType<CellSaveArgs>;
    /**
     * Triggers when TreeGrid actions such as sorting, filtering, paging etc., starts.
     * @event
     * @blazorproperty 'OnActionBegin'
     * @blazorType Syncfusion.Blazor.Grids.ActionEventArgs<TValue>
     */
    actionBegin: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs>;
    /**
     * Triggers when TreeGrid actions such as sorting, filtering, paging etc. are completed.
     * @event
     * @blazorproperty 'OnActionComplete'
     * @blazorType Syncfusion.Blazor.Grids.ActionEventArgs<TValue>
     */
    actionComplete: EmitType<PageEventArgs | FilterEventArgs | SortEventArgs | SearchEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | CellSaveEventArgs>;
    /**
     * Triggers before the record is to be edit.
     * @event
     * @blazorproperty 'OnBeginEdit'
     * @blazorType Syncfusion.Blazor.Grids.BeginEditArgs<TValue>
     */
    beginEdit: EmitType<BeginEditArgs>;
    /**
     * Triggers when records are added in batch mode.
     * @event
     */
    batchAdd: EmitType<BatchAddArgs>;
    /**
     * Triggers when records are deleted in batch mode.
     * @event
     */
    batchDelete: EmitType<BatchDeleteArgs>;
    /**
     * Triggers before records are added in batch mode.
     * @event
     */
    batchCancel: EmitType<BatchCancelArgs>;
    /**
     * Triggers before records are added in batch mode.
     * @event
     */
    beforeBatchAdd: EmitType<BeforeBatchAddArgs>;
    /**
     * Triggers before records are deleted in batch mode.
     * @event
     */
    beforeBatchDelete: EmitType<BeforeBatchDeleteArgs>;
    /**
     * Triggers before records are saved in batch mode.
     * @event
     */
    beforeBatchSave: EmitType<BeforeBatchSaveArgs>;
    /**
     * Triggers when the cell is being edited.
     * @event
     * @blazorproperty 'OnCellEdit'
     * @blazorType Syncfusion.Blazor.Grids.CellEditArgs<TValue>
     */
    cellEdit: EmitType<CellEditArgs>;
    /**
     * Triggers when any TreeGrid action failed to achieve the desired results.
     * @event
     * @blazorproperty 'OnActionFailure'
     * @blazorType Syncfusion.Blazor.Grids.FailureEventArgs
     */
    actionFailure: EmitType<FailureEventArgs>;
    /**
     * Triggers when data source is populated in the TreeGrid.
     * @event
     * @blazorproperty 'DataBound'
     */
    dataBound: EmitType<Object>;
    /**
     * Triggers when the TreeGrid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     * @event

     * @blazorProperty 'dataSourceUpdated'
     * @blazorType Syncfusion.Blazor.Grids.DataSourceChangedEventArgs
     */
    dataSourceChanged: EmitType<DataSourceChangedEventArgs>;
    /**
     * Triggers when the TreeGrid actions such as Sorting, Paging etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.DataStateChangeEventArgs
     */
    dataStateChange: EmitType<DataStateChangeEventArgs>;
    /**
     * Triggers when record is double clicked.
     * @event
     * @blazorproperty 'OnRecordDoubleClick'
     * @blazorType Syncfusion.Blazor.Grids.RecordDoubleClickEventArgs<TValue>
     */
    recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;
    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This will be triggered before the row element is appended to the TreeGrid element.
     * @event
     * @blazorproperty 'RowDataBound'
     * @blazorType Syncfusion.Blazor.Grids.RowDataBoundEventArgs<TValue>
     */
    rowDataBound: EmitType<RowDataBoundEventArgs>;
    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.
     * @event
     * @blazorproperty 'DetailDataBound'
     * @blazorType Syncfusion.Blazor.Grids.DetailDataBoundEventArgs<TValue>
     */
    detailDataBound: EmitType<DetailDataBoundEventArgs>;
    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the TreeGrid element.
     * @event
     * @blazorproperty 'QueryCellInfo'
     * @blazorType Syncfusion.Blazor.Grids.QueryCellInfoEventArgs<TValue>
     */
    queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) TreeGrid records by clicking it.
     * @default true
     */
    allowSelection: boolean;
    /**
     * Triggers before row selection occurs.
     * @event
     * @blazorproperty 'RowSelecting'
     * @blazorType Syncfusion.Blazor.Grids.RowSelectingEventArgs<TValue>
     */
    rowSelecting: EmitType<RowSelectingEventArgs>;
    /**
     * Triggers after a row is selected.
     * @event
     * @blazorproperty 'RowSelected'
     * @blazorType Syncfusion.Blazor.Grids.RowSelectEventArgs<TValue>
     */
    rowSelected: EmitType<RowSelectEventArgs>;
    /**
     * Triggers before deselecting the selected row.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.RowDeselectEventArgs<TValue>
     */
    rowDeselecting: EmitType<RowDeselectEventArgs>;
    /**
     * Triggers when a selected row is deselected.
     * @event
     * @blazorproperty 'RowDeselected'
     * @blazorType Syncfusion.Blazor.Grids.RowDeselectEventArgs<TValue>
     */
    rowDeselected: EmitType<RowDeselectEventArgs>;
    /**
     * Triggered for stacked header.
     * @event
     * @blazorproperty 'HeaderCellInfo'
     * @blazorType Syncfusion.Blazor.Grids.HeaderCellInfoEventArgs
     */
    headerCellInfo: EmitType<HeaderCellInfoEventArgs>;
    /**
     * Triggers before any cell selection occurs.
     * @event
     * @blazorproperty 'CellSelecting'
     * @blazorType Syncfusion.Blazor.Grids.CellSelectingEventArgs<TValue>
     */
    cellSelecting: EmitType<CellSelectingEventArgs>;
    /**
     * Triggers before column menu opens.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ColumnMenuOpenEventArgs
     */
    columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;
    /**
     * Triggers when click on column menu.
     * @event
     * @blazorproperty 'ColumnMenuItemClicked'
     * @blazorType Syncfusion.Blazor.Navigations.MenuEventArgs
     */
    columnMenuClick: EmitType<MenuEventArgs>;
    /**
     * Triggers after a cell is selected.
     * @event
     * @blazorproperty 'CellSelected'
     * @blazorType Syncfusion.Blazor.Grids.CellSelectEventArgs<TValue>
     */
    cellSelected: EmitType<CellSelectEventArgs>;
    /**
     * Triggers before the selected cell is deselecting.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.CellDeselectEventArgs
     */
    cellDeselecting: EmitType<CellDeselectEventArgs>;
    /**
     * Triggers when a particular selected cell is deselected.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.CellDeselectEventArgs
     */
    cellDeselected: EmitType<CellDeselectEventArgs>;
    /**
     * Triggers when column resize starts.
     * @event

     */
    resizeStart: EmitType<ResizeArgs>;
    /**
     * Triggers on column resizing.
     * @event

     */
    resizing: EmitType<ResizeArgs>;
    /**
     * Triggers when column resize ends.
     * @event

     */
    resizeStop: EmitType<ResizeArgs>;
    /**
     * Triggers when column header element drag (move) starts.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ColumnDragEventArgs
     */
    columnDragStart: EmitType<ColumnDragEventArgs>;
    /**
     * Triggers when column header element is dragged (moved) continuously.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ColumnDragEventArgs
     */
    columnDrag: EmitType<ColumnDragEventArgs>;
    /**
     * Triggers when a column header element is dropped on the target column.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ColumnDragEventArgs
     */
    columnDrop: EmitType<ColumnDragEventArgs>;
    /**
     * Triggers when the check box state change in checkbox column.
     * @event

     */
    checkboxChange: EmitType<CheckBoxChangeEventArgs>;
    /**
     * Triggers after print action is completed.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.PrintEventArgs
     */
    printComplete: EmitType<PrintEventArgs>;
    /**
     * Triggers before the print action starts.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.PrintEventArgs
     */
    beforePrint: EmitType<PrintEventArgs>;
    /**
     * Triggers when toolbar item is clicked.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick: EmitType<ClickEventArgs>;
    /**
     * Triggers before data is bound to Tree Grid.
     * @event
     * @blazorproperty 'OnDataBound'
     * @blazorType Syncfusion.Blazor.Grids.BeforeDataBoundArgs<TValue>
     */
    beforeDataBound: EmitType<BeforeDataBoundArgs>;
    /**
     * Triggers before context menu opens.
     * @event

     * @blazorType Syncfusion.Blazor.Navigations.BeforeOpenCloseMenuEventArgs
     */
    contextMenuOpen: EmitType<BeforeOpenCloseMenuEventArgs>;
    /**
     * Triggers when click on context menu.
     * @event
     * @blazorproperty 'ContextMenuItemClicked'
     * @blazorType Syncfusion.Blazor.Navigations.MenuEventArgs
     */
    contextMenuClick: EmitType<MenuEventArgs>;
    /**
     * Triggers before TreeGrid copy action.
     * @event

     */
    beforeCopy: EmitType<BeforeCopyEventArgs>;
    /**
     * Triggers before TreeGrid paste action.
     * @event

     */
    beforePaste: EmitType<BeforePasteEventArgs>;
    /**
     * Triggers when row elements are dragged (moved) continuously.
     * @event

     */
    rowDrag: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row element’s drag(move) starts.
     * @event

     */
    rowDragStart: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row element’s before drag(move).
     * @event

     */
    rowDragStartHelper: EmitType<RowDragEventArgs>;
    /**
     * Triggers when row elements are dropped on the target row.
     * @event

     */
    rowDrop: EmitType<RowDragEventArgs>;
    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     * @default -1
     */
    selectedRowIndex: number;
    /**
     * Configures the selection settings.
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    selectionSettings: SelectionSettingsModel;
    /**
     * If `allowExcelExport` set to true, then it will allow the user to export treegrid to Excel file.
     *
     * > Check the [`ExcelExport`](../../treegrid/excel-exporting/) to configure exporting document.
     * @default false
     */
    allowExcelExport: boolean;
    /**
     * If `allowPdfExport` set to true, then it will allow the user to export treegrid to Pdf file.
     *
     * > Check the [`Pdfexport`](../../treegrid/pdf-export/) to configure the exporting document.
     * @default false
     */
    allowPdfExport: boolean;
    /**
     * Triggers before exporting each cell to PDF document.
     * You can also customize the PDF cells.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.PdfQueryCellInfoEventArgs
     */
    pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;
    /**
     * Triggers before exporting each header cell to PDF document.
     * You can also customize the PDF cells.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.PdfHeaderQueryCellInfoEventArgs
     */
    pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;
    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ExcelQueryCellInfoEventArgs
     */
    excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;
    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ExcelHeaderQueryCellInfoEventArgs
     */
    excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;
    /**
     * Triggers before TreeGrid data is exported to Excel file.
     * @event
     * @blazorproperty 'OnExcelExport'
     */
    beforeExcelExport: EmitType<Object>;
    /**
     * Triggers after TreeGrid data is exported to Excel file.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.ExcelExportCompleteArgs
     */
    excelExportComplete: EmitType<ExcelExportCompleteArgs>;
    /**
     * Triggers before TreeGrid data is exported to PDF document.
     * @event
     * @blazorproperty 'OnPdfExport'
     */
    beforePdfExport: EmitType<Object>;
    /**
     * Triggers after TreeGrid data is exported to PDF document.
     * @event

     * @blazorType Syncfusion.Blazor.Grids.PdfExportCompleteArgs
     */
    pdfExportComplete: EmitType<PdfExportCompleteArgs>;
    /**
     * Export TreeGrid data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    excelExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any>;
    /**
     * Export TreeGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the TreeGrid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    csvExport(excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean, workbook?: any, isBlob?: boolean): Promise<any>;
    /**
     * Export TreeGrid data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @return {Promise<any>}
     * @blazorType void
     */
    pdfExport(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object>;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void;
    /**
     * Sorts a column with the given options.
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     * @return {void}
     */
    sortByColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void;
    /**
     * Clears all the sorted columns of the TreeGrid.
     * @return {void}
     */
    clearSorting(): void;
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    removeSortColumn(field: string): void;
    /**
     * Searches TreeGrid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     * @param  {string} searchString - Defines the key.
     * @return {void}
     */
    search(searchString: string): void;
    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @return {void}
     *
     *
     *
     */
    autoFitColumns(fieldNames?: string | string[]): void;
    /**
     * Changes the TreeGrid column positions by field names.
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    reorderColumns(fromFName: string | string[], toFName: string): void;
    private TreeGridLocale;
    /**
     * By default, prints all the pages of the TreeGrid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     * @return {void}
     */
    print(): void;
    private treeGridkeyActionHandler;
    private findnextRowElement;
    private findPreviousRowElement;
    private initProperties;
    /**
     * Binding events to the element while component creation.
     * @hidden
     */
    wireEvents(): void;
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules(): ModuleDeclaration[];
    extendRequiredModules(modules: ModuleDeclaration[]): void;
    private isCommandColumn;
    /**
     * Unbinding events from the element while component destroy.
     * @hidden
     */
    unwireEvents(): void;
    /**
     * For internal use only - To Initialize the component rendering.
     * @private
     */
    protected render(): void;
    private afterGridRender;
    private gridRendered;
    private setColIndex;
    private setBlazorGUID;
    private convertTreeData;
    private bindGridProperties;
    private triggerEvents;
    private bindGridEvents;
    private lastRowBorder;
    private isPixelHeight;
    private extendedGridDataBoundEvent;
    private bindCallBackEvents;
    private extendedGridEditEvents;
    private updateRowTemplate;
    private bindedDataSource;
    private extendedGridActionEvents;
    private extendedGridEvents;
    private bindGridDragEvents;
    /**
     * Renders TreeGrid component
     * @private
     */
    protected loadGrid(): void;
    /**
     * AutoGenerate TreeGrid columns from first record
     * @hidden
     */
    private autoGenerateColumns;
    private getGridEditSettings;
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    private getContextMenu;
    /**
     * Defines grid toolbar from treegrid toolbar model
     * @hidden
     */
    private getGridToolbar;
    /**
     * Convert TreeGrid ColumnModel to Grid Column
     * @hidden
     */
    private getGridColumns;
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(newProp: TreeGridModel, oldProp: TreeGridModel): void;
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    destroy(): void;
    /**
     * Update the TreeGrid model
     * @method dataBind
     * @return {void}
     * @private
     */
    dataBind(): void;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    getPersistData(): string;
    private ignoreInArrays;
    private ignoreInColumn;
    private mouseClickHandler;
    /**
     * Returns TreeGrid rows
     * @return {HTMLTableRowElement[]}
     */
    getRows(): HTMLTableRowElement[];
    /**
     * Gets the pager of the TreeGrid.
     * @return {Element}
     */
    getPager(): Element;
    /**
     * Adds a new record to the TreeGrid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added.
     * @param {RowPosition} position - Defines the new row position to be added.
     */
    addRecord(data?: Object, index?: number, position?: RowPosition): void;
    /**
     * Cancels edited state.
     */
    closeEdit(): void;
    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     */
    saveCell(): void;
    /**
     * To update the specified cell by given value without changing into edited state.
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     */
    updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void;
    /**
     * To update the specified row by given values without changing into edited state.
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     */
    updateRow(index: number, data: Object): void;
    /**
     * Delete a record with Given options. If fieldName and data is not given then TreeGrid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     * @param {string} fieldName - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     */
    deleteRecord(fieldName?: string, data?: Object): void;
    /**
     * To edit any particular row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row to be edited.
     */
    startEdit(row?: HTMLTableRowElement): void;
    /**
     * To edit any particular cell using row index and cell index.
     * @param {number} rowIndex - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform cell edit.
     */
    editCell(rowIndex?: number, field?: string): void;
    /**
     * Enables or disables ToolBar items.
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     */
    enableToolbarItems(items: string[], isEnable: boolean): void;
    /**
     * If TreeGrid is in editable state, you can save a record by invoking endEdit.
     */
    endEdit(): void;
    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @return {void}
     */
    openColumnChooser(x?: number, y?: number): void;
    /**
     * Delete any visible row by TR element.
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     */
    deleteRow(tr: HTMLTableRowElement): void;
    /**
     * Get the names of the primary key columns of the TreeGrid.
     * @return {string[]}
     */
    getPrimaryKeyFieldNames(): string[];
    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     */
    setCellValue(key: string | number, field: string, value: string | number | boolean | Date): void;
    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *  @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     *  @param {Object} rowData - To update new data for the particular row.
     */
    setRowData(key: string | number, rowData?: ITreeData): void;
    /**
     * Navigates to the specified target page.
     * @param  {number} pageNo - Defines the page number to navigate.
     * @return {void}
     */
    goToPage(pageNo: number): void;
    /**
     * Defines the text of external message.
     * @param  {string} message - Defines the message to update.
     * @return {void}
     */
    updateExternalMessage(message: string): void;
    /**
     * Gets a cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    getCellFromIndex(rowIndex: number, columnIndex: number): Element;
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     */
    getColumnByField(field: string): Column;
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     */
    getColumnByUid(uid: string): Column;
    /**
     * Gets the collection of column fields.
     * @return {string[]}
     */
    getColumnFieldNames(): string[];
    /**
     * Gets the footer div of the TreeGrid.
     * @return {Element}
     */
    getFooterContent(): Element;
    /**
     * Gets the footer table element of the TreeGrid.
     * @return {Element}
     */
    getFooterContentTable(): Element;
    /**
     * Shows a column by its column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    showColumns(keys: string | string[], showBy?: string): void;
    /**
     * Hides a column by column name.
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     * @return {void}
     */
    hideColumns(keys: string | string[], hideBy?: string): void;
    /**
     * Gets a column header by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Element}
     */
    getColumnHeaderByField(field: string): Element;
    /**
     * Gets a column header by column index.
     * @param  {number} index - Specifies the column index.
     * @return {Element}
     */
    getColumnHeaderByIndex(index: number): Element;
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    getColumnHeaderByUid(uid: string): Element;
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    getColumnIndexByField(field: string): number;
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    getColumnIndexByUid(uid: string): number;
    /**
     * Gets the columns from the TreeGrid.
     * @return {Column[]}
     */
    getColumns(isRefresh?: boolean): Column[];
    private updateColumnModel;
    /**
     * Gets the content div of the TreeGrid.
     * @return {Element}
     */
    getContent(): Element;
    private mergePersistTreeGridData;
    private mergeColumns;
    private updateTreeGridModel;
    /**
     * Gets the content table of the TreeGrid.
     * @return {Element}
     */
    getContentTable(): Element;
    /**
     * Gets all the TreeGrid's data rows.
     * @return {Element[]}
     */
    getDataRows(): Element[];
    /**
     * Get current visible data of TreeGrid.
     * @return {Object[]}
     * @isGenericType true
     */
    getCurrentViewRecords(): Object[];
    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     * @return {Object}
     */
    getBatchChanges(): Object;
    /**
     * Gets the header div of the TreeGrid.
     * @return {Element}
     */
    getHeaderContent(): Element;
    /**
     * Gets the header table element of the TreeGrid.
     * @return {Element}
     */
    getHeaderTable(): Element;
    /**
     * Gets a row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    getRowByIndex(index: number): Element;
    /**
     * Get a row information based on cell
     * @param {Element}
     * @return RowInfo
     */
    getRowInfo(target: Element | EventTarget): RowInfo;
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    getUidByColumnField(field: string): string;
    /**
     * Gets the visible columns from the TreeGrid.
     * @return {Column[]}
     */
    getVisibleColumns(): Column[];
    /**
     * By default, TreeGrid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     */
    showSpinner(): void;
    /**
     * Manually shown spinner needs to hide by `hideSpinnner`.
     */
    hideSpinner(): void;
    /**
     * Refreshes the TreeGrid header and content.
     */
    refresh(): void;
    /**
     * Get the records of checked rows.
     * @return {Object[]}
     * @isGenericType true
     */
    getCheckedRecords(): Object[];
    /**
     * Get the indexes of checked rows.
     * @return {number[]}
     */
    getCheckedRowIndexes(): number[];
    /**
     * Checked the checkboxes using rowIndexes.
     */
    selectCheckboxes(indexes: number[]): void;
    /**
     * Refreshes the TreeGrid column changes.
     */
    refreshColumns(refreshUI?: boolean): void;
    /**
     * Refreshes the TreeGrid header.
     */
    refreshHeader(): void;
    /**
     * Expands or collapse child records
     * @return {string}
     * @hidden
     */
    private expandCollapseRequest;
    /**
     * Expands child rows
     * @return {void}
     */
    expandRow(row: HTMLTableRowElement, record?: Object): void;
    private getCollapseExpandRecords;
    /**
     * Collapses child rows
     * @return {void}
     */
    collapseRow(row: HTMLTableRowElement, record?: Object): void;
    /**
     * Expands the records at specific hierarchical level
     * @return {void}
     */
    expandAtLevel(level: number): void;
    private getRecordDetails;
    /**
     * Collapses the records at specific hierarchical level
     * @return {void}
     */
    collapseAtLevel(level: number): void;
    /**
     * Expands All the rows
     * @return {void}
     */
    expandAll(): void;
    /**
     * Collapses All the rows
     * @return {void}
     */
    collapseAll(): void;
    private expandCollapseAll;
    private expandCollapse;
    private updateChildOnDemand;
    private remoteExpand;
    private localExpand;
    private updateAltRow;
    private treeColumnRowTemplate;
    private collapseRemoteChild;
    /**
     * @hidden
     */
    addListener(): void;
    private updateResultModel;
    /**
     * @hidden
     */
    private removeListener;
    /**
     * Filters TreeGrid row by column name with the given options.
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, TreeGrid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    filterByColumn(fieldName: string, filterOperator: string, filterValue: string | number | Date | boolean | number[] | string[] | Date[] | boolean[], predicate?: string, matchCase?: boolean, ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void;
    /**
     * Clears all the filtered rows of the TreeGrid.
     * @return {void}
     */
    clearFiltering(): void;
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void;
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectRow(index: number, isToggle?: boolean): void;
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    selectRows(rowIndexes: number[]): void;
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    clearSelection(): void;
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     */
    copy(withHeader?: boolean): void;
    /**
     * Paste data from clipboard to selected cells.
     * @param {boolean} data - Specifies the date for paste.
     * @param {boolean} rowIndex - Specifies the row index.
     * @param {boolean} colIndex - Specifies the column index.
     */
    paste(data: string, rowIndex: number, colIndex: number): void;
    /**
     * Selects a cell by the given index.
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    selectCell(cellIndex: IIndex, isToggle?: boolean): void;
    /**
     * Gets the collection of selected rows.
     * @return {Element[]}
     */
    getSelectedRows(): Element[];
    /**
     * Gets a movable table cell by row and column index.
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @return {Element}
     */
    getMovableCellFromIndex(rowIndex: number, columnIndex: number): Element;
    /**
     * Gets all the TreeGrid's movable table data rows.
     * @return {Element[]}
     */
    getMovableDataRows(): Element[];
    /**
     * Gets a movable tables row by index.
     * @param  {number} index - Specifies the row index.
     * @return {Element}
     */
    getMovableRowByIndex(index: number): Element;
    /**
     * Gets the TreeGrid's movable content rows from frozen treegrid.
     * @return {Element[]}
     */
    getMovableRows(): Element[];
    /**
     * @hidden
     */
    getFrozenColumns(): number;
    private getFrozenCount;
    /**
     * Gets the collection of selected row indexes.
     * @return {number[]}
     */
    getSelectedRowIndexes(): number[];
    /**
     * Gets the collection of selected row and cell indexes.
     * @return {number[]}
     */
    getSelectedRowCellIndexes(): ISelectedCell[];
    /**
     * Gets the collection of selected records.
     * @isGenericType true
     * @return {Object[]}
     */
    getSelectedRecords(): Object[];
    /**
     * Gets the data module.
     * @return {Data}
     */
    getDataModule(): {
        baseModule: Data;
        treeModule: DataManipulation;
    };
    /**
     * Reorder the rows based on given indexes and position
     */
    reorderRows(fromIndexes: number[], toIndex: number, position: string): void;
    /**
     * `columnchooserModule` is used to dynamically show or hide the TreeGrid columns.
     * @hidden
     */
    columnChooserModule: ColumnChooser;
    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the TreeGrid.
     */
    toolbarModule: Toolbar;
    /**
     * The `editModule` is used to handle TreeGrid content manipulation.
     */
    editModule: Edit;
    /**
     * The `pagerModule` is used to manipulate paging in the TreeGrid.
     */
    pagerModule: Page;
}
