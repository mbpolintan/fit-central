/**
 * Specifies spreadsheet internal events
 */
/** @hidden */
export var ribbon = 'ribbon';
/** @hidden */
export var formulaBar = 'formulaBar';
/** @hidden */
export var sheetTabs = 'sheetTabs';
/** @hidden */
export var refreshSheetTabs = 'refreshSheetTabs';
/** @hidden */
export var dataRefresh = 'dataRefresh';
/** @hidden */
export var initialLoad = 'initialLoad';
/** @hidden */
export var contentLoaded = 'contentLoaded';
/** @hidden */
export var mouseDown = 'mouseDown';
/** @hidden */
export var spreadsheetDestroyed = 'spreadsheetDestroyed';
/** @hidden */
export var editOperation = 'editOperation';
/** @hidden */
export var formulaOperation = 'formulaOperation';
/** @hidden */
export var formulaBarOperation = 'formulaBarOperation';
/** @hidden */
export var click = 'click';
/** @hidden */
export var keyUp = 'keyUp';
/** @hidden */
export var keyDown = 'keyDown';
/** @hidden */
export var formulaKeyUp = 'formulaKeyUp';
/** @hidden */
export var formulaBarUpdate = 'formulaBarUpdate';
/** @hidden */
export var onVerticalScroll = 'verticalScroll';
/** @hidden */
export var onHorizontalScroll = 'horizontalScroll';
/** @hidden */
export var beforeContentLoaded = 'beforeContentLoaded';
/** @hidden */
export var beforeVirtualContentLoaded = 'beforeVirtualContentLoaded';
/** @hidden */
export var virtualContentLoaded = 'virtualContentLoaded';
/** @hidden */
export var contextMenuOpen = 'contextMenuOpen';
/** @hidden */
export var cellNavigate = 'cellNavigate';
/** @hidden */
export var mouseUpAfterSelection = 'mouseUpAfterSelection';
/** @hidden */
export var selectionComplete = 'selectionComplete';
/** @hidden */
export var cMenuBeforeOpen = 'contextmenuBeforeOpen';
/** @hidden */
export var insertSheetTab = 'insertSheetTab';
/** @hidden */
export var removeSheetTab = 'removeSheetTab';
/** @hidden */
export var renameSheetTab = 'renameSheetTab';
/** @hidden */
export var ribbonClick = 'ribboClick';
/** @hidden */
export var refreshRibbon = 'ribbonRefresh';
/** @hidden */
export var enableToolbarItems = 'enableToolbarItems';
/** @hidden */
export var tabSwitch = 'tabSwitch';
/** @hidden */
export var selectRange = 'selectRange';
/** @hidden */
export var cut = 'cut';
/** @hidden */
export var copy = 'copy';
/** @hidden */
export var paste = 'paste';
/** @hidden */
export var clearCopy = 'clearCopy';
/** @hidden */
export var dataBound = 'dataBound';
/** @hidden */
export var beforeDataBound = 'beforeDataBound';
/** @hidden */
export var addContextMenuItems = 'addContextMenuItems';
/** @hidden */
export var removeContextMenuItems = 'removeContextMenuItems';
/** @hidden */
export var enableContextMenuItems = 'enableContextMenuItems';
/** @hidden */
export var enableFileMenuItems = 'enableFileMenuItems';
/** @hidden */
export var hideFileMenuItems = 'hideFileMenuItems';
/** @hidden */
export var addFileMenuItems = 'addFileMenuItems';
/** @hidden */
export var hideRibbonTabs = 'hideRibbonTabs';
/** @hidden */
export var enableRibbonTabs = 'enableRibbonTabs';
/** @hidden */
export var addRibbonTabs = 'addRibbonTabs';
/** @hidden */
export var addToolbarItems = 'addToolbarItems';
/** @hidden */
export var hideToolbarItems = 'hideToolbarItems';
/** @hidden */
export var beforeRibbonCreate = 'beforeRibbonCreate';
/** @hidden */
export var rowHeightChanged = 'rowHeightChanged';
/** @hidden */
export var colWidthChanged = 'colWidthChanged';
/** @hidden */
export var beforeHeaderLoaded = 'beforeHeaderLoaded';
/** @hidden */
export var onContentScroll = 'onContentScroll';
/** @hidden */
export var deInitProperties = 'deInitProperties';
/** @hidden */
export var activeSheetChanged = 'activeSheetChanged';
/** @hidden */
export var renameSheet = 'renameSheet';
/** @hidden */
export var initiateCustomSort = 'initiateCustomSort';
/** @hidden */
export var applySort = 'applySort';
/** @hidden */
export var collaborativeUpdate = 'collaborativeUpdate';
/** @hidden */
export var hideShow = 'hideShow';
/** @hidden */
export var autoFit = 'autoFitRowsColumns';
/** @hidden */
export var updateToggleItem = 'updateToggleItem';
/** @hidden */
export var initiateHyperlink = 'initiateHyperlink';
/** @hidden */
export var editHyperlink = 'editHyperlink';
/** @hidden */
export var openHyperlink = 'openHyperlink';
/** @hidden */
export var removeHyperlink = 'removeHyperlink';
/** @hidden */
export var createHyperlinkElement = 'createHyperlinkElement';
/** @hidden */
export var sheetNameUpdate = 'sheetNameUpdate';
/** @hidden */
export var hideSheet = 'hideSheet';
/** @hidden */
export var performUndoRedo = 'performUndoRedo';
/** @hidden */
export var updateUndoRedoCollection = 'updateUndoRedoCollection';
/** @hidden */
export var setActionData = 'setActionData';
/** @hidden */
export var getBeforeActionData = 'getBeforeActionData';
/** @hidden */
export var clearUndoRedoCollection = 'clearUndoRedoCollection';
/** @hidden */
export var initiateFilterUI = 'initiateFilterUI';
/** @hidden */
export var renderFilterCell = 'renderFilterCell';
/** @hidden */
export var reapplyFilter = 'reapplyFilter';
/** @hidden */
export var filterByCellValue = 'filterByCellValue';
/** @hidden */
export var clearFilter = 'clearFilter';
/** @hidden */
export var getFilteredColumn = 'getFilteredColumn';
/** @hidden */
export var completeAction = 'actionComplete';
/** @hidden */
export var beginAction = 'actionBegin';
/** @hidden */
export var filterCellKeyDown = 'filterCellKeyDown';
/** @hidden */
export var getFilterRange = 'getFilterRange';
/** @hidden */
export var setAutoFit = 'setAutoFit';
/** @hidden */
export var refreshFormulaDatasource = 'refreshFormulaDatasource';
/** @hidden */
export var setScrollEvent = 'setScrollEvent';
/** @hidden */
export var initiateDataValidation = 'initiatedatavalidation';
/** @hidden */
export var validationError = 'validationError';
/** @hidden */
export var startEdit = 'startEdit';
/** @hidden */
export var invalidData = 'invalidData';
/** @hidden */
export var clearInvalid = 'clearInvalid';
/** @hidden */
export var protectSheet = 'protectSheet';
/** @hidden */
export var applyProtect = 'applyProtect';
/** @hidden */
export var unprotectSheet = 'unprotectSheet';
/** @hidden */
export var protectCellFormat = 'protectCellFormat';
/** @hidden */
export var gotoDlg = 'renderGotoDlgt';
/** @hidden */
export var findDlg = 'renderFindDlg';
/** @hidden */
export var findHandler = 'findHandler';
/** @hidden */
export var replace = 'replaceHandler';
/** @hidden */
export var created = 'created';
/** @hidden */
export var editAlert = 'editAlert';
/** @hidden */
export var setUndoRedo = 'setUndoRedo';
/** @hidden */
export var enableFormulaInput = 'enableFormulaInput';
/** @hidden */
export var protectSelection = 'protectSelection';
/** @hidden */
export var hiddenMerge = 'hiddenMerge';
/** @hidden */
export var checkPrevMerge = 'checkPrevMerge';
/** @hidden */
export var checkMerge = 'checkMerge';
/** @hidden */
export var removeDataValidation = 'removeDataValidation';
/** @hidden */
export var showAggregate = 'showAggregate';
/** @hidden */
export var initiateConditionalFormat = 'initiateConditionalFormat';
/** @hidden */
export var checkConditionalFormat = 'checkConditionalFormat';
/** @hidden */
export var setCF = 'setCF';
/** @hidden */
export var clearViewer = 'clearViewer';
