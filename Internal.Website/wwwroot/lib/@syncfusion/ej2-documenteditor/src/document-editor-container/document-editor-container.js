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
// tslint:disable-next-line:max-line-length
import { Component, Property, NotifyPropertyChanges, L10n, isBlazor, Complex, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { Event } from '@syncfusion/ej2-base';
import { DocumentEditor, DocumentEditorSettings } from '../document-editor/document-editor';
import { TextProperties } from './properties-pane/text-properties-pane';
import { HeaderFooterProperties } from './properties-pane/header-footer-pane';
import { ImageProperties } from './properties-pane/image-properties-pane';
import { TocProperties } from './properties-pane/table-of-content-pane';
import { TableProperties } from './properties-pane/table-properties-pane';
import { StatusBar } from './properties-pane/status-bar';
import { createSpinner } from '@syncfusion/ej2-popups';
/**
 * Document Editor container component.
 */
var DocumentEditorContainer = /** @class */ (function (_super) {
    __extends(DocumentEditorContainer, _super);
    /**
     * Initialize the constructor of DocumentEditorContainer
     */
    function DocumentEditorContainer(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * @private
         */
        _this.previousContext = '';
        /**
         * @private
         */
        _this.showHeaderProperties = true;
        /**
         * default locale
         * @private
         */
        _this.defaultLocale = {
            'New': 'New',
            'Open': 'Open',
            'Undo': 'Undo',
            'Redo': 'Redo',
            'Image': 'Image',
            'Table': 'Table',
            'Link': 'Link',
            'Bookmark': 'Bookmark',
            'Table of Contents': 'Table of Contents',
            'HEADING - - - - 1': 'HEADING - - - - 1',
            'HEADING - - - - 2': 'HEADING - - - - 2',
            'HEADING - - - - 3': 'HEADING - - - - 3',
            'Header': 'Header',
            'Footer': 'Footer',
            'Page Setup': 'Page Setup',
            'Page Number': 'Page Number',
            'Break': 'Break',
            'Find': 'Find',
            'Local Clipboard': 'Local Clipboard',
            'Restrict Editing': 'Restrict Editing',
            'Upload from computer': 'Upload from computer',
            'By URL': 'By URL',
            'Page Break': 'Page Break',
            'Section Break': 'Section Break',
            'Header And Footer': 'Header & Footer',
            'Options': 'Options',
            'Levels': 'Levels',
            'Different First Page': 'Different First Page',
            'Different header and footer for odd and even pages': 'Different header and footer for odd and even pages.',
            'Different Odd And Even Pages': 'Different Odd & Even Pages',
            'Different header and footer for first page': 'Different header and footer for first page.',
            'Position': 'Position',
            'Header from Top': 'Header from Top',
            'Footer from Bottom': 'Footer from Bottom',
            'Distance from top of the page to top of the header': 'Distance from top of the page to top of the header.',
            'Distance from bottom of the page to bottom of the footer': 'Distance from bottom of the page to bottom of the footer.',
            'Aspect ratio': 'Aspect ratio',
            'W': 'W',
            'H': 'H',
            'Width': 'Width',
            'Height': 'Height',
            'Text': 'Text',
            'Paragraph': 'Paragraph',
            'Fill': 'Fill',
            'Fill color': 'Fill color',
            'Border Style': 'Border Style',
            'Outside borders': 'Outside borders',
            'All borders': 'All borders',
            'Inside borders': 'Inside borders',
            'Left border': 'Left border',
            'Inside vertical border': 'Inside vertical border',
            'Right border': 'Right border',
            'Top border': 'Top border',
            'Inside horizontal border': 'Inside horizontal border',
            'Bottom border': 'Bottom border',
            'Border color': 'Border color',
            'Border width': 'Border width',
            'Cell': 'Cell',
            'Merge cells': 'Merge cells',
            'Insert Or Delete': 'Insert / Delete',
            'Insert columns to the left': 'Insert columns to the left',
            'Insert columns to the right': 'Insert columns to the right',
            'Insert rows above': 'Insert rows above',
            'Insert rows below': 'Insert rows below',
            'Delete rows': 'Delete rows',
            'Delete columns': 'Delete columns',
            'Cell Margin': 'Cell Margin',
            'Top': 'Top',
            'Bottom': 'Bottom',
            'Left': 'Left',
            'Right': 'Right',
            'Align Text': 'Align Text',
            'Align top': 'Align top',
            'Align bottom': 'Align bottom',
            'Align center': 'Align center',
            // tslint:disable-next-line:max-line-length
            'Number of heading or outline levels to be shown in table of contents': 'Number of heading or outline levels to be shown in table of contents.',
            'Show page numbers': 'Show page numbers',
            'Show page numbers in table of contents': 'Show page numbers in table of contents.',
            'Right align page numbers': 'Right align page numbers',
            'Right align page numbers in table of contents': 'Right align page numbers in table of contents.',
            'Use hyperlinks': 'Use hyperlinks',
            'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers.',
            'Font': 'Font',
            'Font Size': 'Font Size',
            'Font color': 'Font color',
            'Text highlight color': 'Text highlight color',
            'Clear all formatting': 'Clear all formatting',
            'Bold Tooltip': 'Bold (Ctrl+B)',
            'Italic Tooltip': 'Italic (Ctrl+I)',
            'Underline Tooltip': 'Underline (Ctrl+U)',
            'Strikethrough': 'Strikethrough',
            'Superscript Tooltip': 'Superscript (Ctrl+Shift++)',
            'Subscript Tooltip': 'Subscript (Ctrl+=)',
            'Align left Tooltip': 'Align left (Ctrl+L)',
            'Center Tooltip': 'Center (Ctrl+E)',
            'Align right Tooltip': 'Align right (Ctrl+R)',
            'Justify Tooltip': 'Justify (Ctrl+J)',
            'Decrease indent': 'Decrease indent',
            'Increase indent': 'Increase indent',
            'Line spacing': 'Line spacing',
            'Bullets': 'Bullets',
            'Numbering': 'Numbering',
            'Styles': 'Styles',
            'Manage Styles': 'Manage Styles',
            'Page': 'Page',
            'of': 'of',
            'Fit one page': 'Fit one page',
            'Spell Check': 'Spell Check',
            'Underline errors': 'Underline errors',
            'Fit page width': 'Fit page width',
            'Update': 'Update',
            'Cancel': 'Cancel',
            'Insert': 'Insert',
            'No Border': 'No Border',
            'Create a new document': 'Create a new document.',
            'Open a document': 'Open a document.',
            'Undo Tooltip': 'Undo the last operation (Ctrl+Z).',
            'Redo Tooltip': 'Redo the last operation (Ctrl+Y).',
            'Insert inline picture from a file': 'Insert inline picture from a file.',
            'Insert a table into the document': 'Insert a table into the document',
            // tslint:disable-next-line:max-line-length
            'Create Hyperlink': 'Create a link in your document for quick access to web pages and files (Ctrl+K).',
            'Insert a bookmark in a specific place in this document': 'Insert a bookmark in a specific place in this document.',
            // tslint:disable-next-line:max-line-length
            'Provide an overview of your document by adding a table of contents': 'Provide an overview of your document by adding a table of contents.',
            'Add or edit the header': 'Add or edit the header.',
            'Add or edit the footer': 'Add or edit the footer.',
            'Open the page setup dialog': 'Open the page setup dialog.',
            'Add page numbers': 'Add page numbers.',
            'Find Text': 'Find text in the document (Ctrl+F).',
            'Toggle between the internal clipboard and system clipboard': 'Toggle between the internal clipboard and system clipboard.</br>' +
                'Access to system clipboard through script is denied due to browsers security policy. Instead, </br>' +
                ' 1. You can enable internal clipboard to cut, copy and paste within the component.</br>' +
                ' 2. You can use the keyboard shortcuts (Ctrl+X, Ctrl+C and Ctrl+V) to cut, copy and paste with system clipboard.',
            // tslint:disable-next-line:max-line-length
            'Current Page Number': 'The current page number in the document. Click or tap to navigate specific page.',
            'Read only': 'Read only',
            'Protections': 'Protections',
            'Error in establishing connection with web server': 'Error in establishing connection with web server',
            'Single': 'Single',
            'Double': 'Double',
            'New comment': 'New comment',
            'Comments': 'Comments',
            'Print layout': 'Print layout',
            'Web layout': 'Web layout',
            'Form Fields': 'Form Fields',
            'Text Form': 'Text Form',
            'Check Box': 'Check Box',
            'DropDown': 'Drop-Down',
            'Update Fields': 'Update Fields',
            'Update cross reference fields': 'Update cross reference fields',
            'Track Changes': 'Keep track of the changes made in the document',
            'TrackChanges': 'Track Changes'
        };
        return _this;
    }
    Object.defineProperty(DocumentEditorContainer.prototype, "documentEditor", {
        /**
         * Gets DocumentEditor instance.
         * @aspType DocumentEditor
         * @blazorType DocumentEditor
         */
        get: function () {
            return this.documentEditorInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditorContainer.prototype, "toolbar", {
        /**
         * Gets toolbar instance.
         * @blazorType Toolbar
         */
        get: function () {
            return this.toolbarModule;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    DocumentEditorContainer.prototype.getModuleName = function () {
        return 'DocumentEditorContainer';
    };
    /**
     * @private
     */
    // tslint:disable:max-func-body-length
    DocumentEditorContainer.prototype.onPropertyChanged = function (newModel, oldModel) {
        for (var _i = 0, _a = Object.keys(newModel); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'restrictEditing':
                    if (this.toolbarModule) {
                        this.toolbarModule.enableDisableToolBarItem(!newModel.restrictEditing, false);
                    }
                    this.documentEditor.isReadOnly = newModel.restrictEditing;
                    break;
                case 'showPropertiesPane':
                    this.showHidePropertiesPane(newModel.showPropertiesPane);
                    break;
                case 'enableTrackChanges':
                    if (this.documentEditor) {
                        this.documentEditor.enableTrackChanges = newModel.enableTrackChanges;
                        this.documentEditor.showRevisions = newModel.enableTrackChanges;
                        if (this.toolbarModule) {
                            this.toolbarModule.toggleTrackChanges(newModel.enableTrackChanges);
                        }
                        this.documentEditor.resize();
                    }
                    break;
                case 'enableLocalPaste':
                    if (this.documentEditor) {
                        this.documentEditor.enableLocalPaste = newModel.enableLocalPaste;
                    }
                    break;
                case 'serviceUrl':
                    if (this.documentEditor) {
                        this.documentEditor.serviceUrl = newModel.serviceUrl;
                    }
                    break;
                case 'serverActionSettings':
                    if (this.documentEditor) {
                        this.setserverActionSettings();
                    }
                    break;
                case 'zIndex':
                    if (this.documentEditor) {
                        this.documentEditor.zIndex = newModel.zIndex;
                    }
                    break;
                case 'headers':
                    if (this.documentEditor) {
                        this.documentEditor.headers = newModel.headers;
                    }
                    break;
                case 'locale':
                case 'enableRtl':
                    this.refresh();
                    break;
                case 'enableComment':
                    if (this.documentEditor) {
                        this.documentEditor.enableComment = newModel.enableComment;
                    }
                    if (this.toolbarModule) {
                        this.toolbarModule.enableDisableInsertComment(newModel.enableComment);
                    }
                    break;
                case 'enableSpellCheck':
                    if (this.documentEditor) {
                        this.documentEditor.enableSpellCheck = newModel.enableSpellCheck;
                    }
                    break;
                case 'documentEditorSettings':
                    if (this.documentEditor) {
                        this.customizeDocumentEditorSettings();
                    }
                    break;
                case 'toolbarItems':
                    if (this.toolbarModule) {
                        this.toolbarModule.reInitToolbarItems(newModel.toolbarItems);
                    }
                    break;
                case 'currentUser':
                    if (this.documentEditor) {
                        this.documentEditor.currentUser = newModel.currentUser;
                    }
                    break;
                case 'userColor':
                    if (this.documentEditor) {
                        this.documentEditor.userColor = newModel.userColor;
                    }
                    break;
                case 'layoutType':
                    if (this.documentEditor) {
                        this.documentEditor.layoutType = newModel.layoutType;
                    }
                    break;
                case 'enableToolbar':
                    this.createToolbarContainer(this.enableRtl, true);
                    if (newModel.enableToolbar && this.toolbarModule) {
                        this.toolbarModule.initToolBar(this.toolbarItems);
                        this.toolbarModule.enableDisableInsertComment(this.enableComment);
                        this.toolbarModule.toggleTrackChanges(this.enableTrackChanges);
                    }
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    if (this.documentEditor) {
                        this.documentEditor.resize();
                    }
                    break;
            }
        }
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.preRender = function () {
        this.localObj = new L10n('documenteditorcontainer', this.defaultLocale, this.locale);
        this.initContainerElement();
        //Prototype
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.render = function () {
        if (this.toolbarModule) {
            this.toolbarModule.initToolBar(this.toolbarItems);
            this.toolbarModule.enableDisableInsertComment(this.enableComment);
        }
        if (this.height !== '') {
            this.element.style.height = formatUnit(this.height);
        }
        if (this.width !== '') {
            this.element.style.width = formatUnit(this.width);
        }
        this.element.style.minHeight = '320px';
        this.initializeDocumentEditor();
        this.textProperties = new TextProperties(this, this.element.id, false, this.enableRtl);
        this.headerFooterProperties = new HeaderFooterProperties(this, this.enableRtl);
        this.imageProperties = new ImageProperties(this, this.enableRtl);
        this.tocProperties = new TocProperties(this, this.enableRtl);
        this.tableProperties = new TableProperties(this, this.imageProperties, this.textProperties, this.enableRtl);
        this.statusBar = new StatusBar(this.statusBarElement, this);
        // Waiting popup
        createSpinner({ target: this.containerTarget, cssClass: 'e-spin-overlay' });
        this.setserverActionSettings();
        this.customizeDocumentEditorSettings();
        this.renderComplete();
    };
    DocumentEditorContainer.prototype.setFormat = function () {
        if (this.characterFormat) {
            this.documentEditor.setDefaultCharacterFormat(this.characterFormat);
        }
        if (this.paragraphFormat) {
            this.documentEditor.setDefaultParagraphFormat(this.paragraphFormat);
        }
        if (this.sectionFormat) {
            this.documentEditor.setDefaultSectionFormat(this.sectionFormat);
        }
    };
    DocumentEditorContainer.prototype.setserverActionSettings = function () {
        if (this.serviceUrl) {
            this.documentEditor.serviceUrl = this.serviceUrl;
        }
        if (this.serverActionSettings.spellCheck) {
            this.documentEditor.serverActionSettings.spellCheck = this.serverActionSettings.spellCheck;
        }
        if (this.serverActionSettings.restrictEditing) {
            this.documentEditor.serverActionSettings.restrictEditing = this.serverActionSettings.restrictEditing;
        }
        if (this.serverActionSettings.systemClipboard) {
            this.documentEditor.serverActionSettings.systemClipboard = this.serverActionSettings.systemClipboard;
        }
        if (this.headers) {
            this.documentEditor.headers = this.headers;
        }
    };
    DocumentEditorContainer.prototype.customizeDocumentEditorSettings = function () {
        if (this.documentEditorSettings.formFieldSettings) {
            var settings = this.documentEditorSettings.formFieldSettings;
            var documentEditor = this.documentEditor;
            if (!isNullOrUndefined(settings.applyShading)) {
                documentEditor.documentEditorSettings.formFieldSettings.applyShading = settings.applyShading;
            }
            if (!isNullOrUndefined(settings.formFillingMode)) {
                documentEditor.documentEditorSettings.formFieldSettings.formFillingMode = settings.formFillingMode;
            }
            if (!isNullOrUndefined(settings.formattingExceptions)) {
                documentEditor.documentEditorSettings.formFieldSettings.formattingExceptions = settings.formattingExceptions;
            }
            if (!isNullOrUndefined(settings.selectionColor)) {
                documentEditor.documentEditorSettings.formFieldSettings.selectionColor = settings.selectionColor;
            }
            if (!isNullOrUndefined(settings.shadingColor)) {
                documentEditor.documentEditorSettings.formFieldSettings.shadingColor = settings.shadingColor;
            }
        }
        if (this.documentEditorSettings.searchHighlightColor) {
            this.documentEditor.documentEditorSettings.searchHighlightColor = this.documentEditorSettings.searchHighlightColor;
        }
        if (this.documentEditorSettings.fontFamilies) {
            this.documentEditor.documentEditorSettings.fontFamilies = this.documentEditorSettings.fontFamilies;
        }
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.getPersistData = function () {
        return 'documenteditor-container';
    };
    //tslint:disable: max-func-body-length
    DocumentEditorContainer.prototype.requiredModules = function () {
        var modules = [];
        if (this.enableToolbar) {
            modules.push({
                member: 'toolbar', args: [this]
            });
        }
        return modules;
    };
    DocumentEditorContainer.prototype.initContainerElement = function () {
        // Toolbar container
        var isRtl = this.enableRtl;
        this.containerTarget = this.createElement('div', { className: 'e-de-ctn' });
        this.createToolbarContainer(isRtl);
        var propertiesPaneContainerBorder;
        if (!isRtl) {
            propertiesPaneContainerBorder = 'e-de-pane';
        }
        else {
            propertiesPaneContainerBorder = 'e-de-pane-rtl';
        }
        this.propertiesPaneContainer = this.createElement('div', { className: propertiesPaneContainerBorder, styles: 'display:none' });
        this.editorContainer.appendChild(this.propertiesPaneContainer);
        this.containerTarget.appendChild(this.editorContainer);
        this.statusBarElement = this.createElement('div', { className: 'e-de-status-bar' });
        if (isRtl) {
            this.statusBarElement.style.direction = 'rtl';
        }
        this.containerTarget.appendChild(this.statusBarElement);
        this.element.appendChild(this.containerTarget);
    };
    DocumentEditorContainer.prototype.createToolbarContainer = function (isRtl, isCustom) {
        if (isNullOrUndefined((this.editorContainer))) {
            // tslint:disable-next-line:max-line-length
            this.editorContainer = this.createElement('div', { className: 'e-de-tool-ctnr-properties-pane' + (isRtl ? ' e-de-ctnr-rtl' : '') });
        }
        if (this.enableToolbar) {
            this.toolbarContainer = this.createElement('div', { className: 'e-de-ctnr-toolbar' + (isRtl ? ' e-de-ctnr-rtl' : '') });
            if (isCustom) {
                this.containerTarget.insertBefore(this.toolbarContainer, this.containerTarget.firstChild);
            }
            else {
                this.containerTarget.appendChild(this.toolbarContainer);
            }
            this.editorContainer.classList.remove('e-de-ctnr-properties-pane');
            this.editorContainer.classList.add('e-de-tool-ctnr-properties-pane');
        }
        else {
            this.editorContainer.classList.remove('e-de-tool-ctnr-properties-pane');
            this.editorContainer.classList.add('e-de-ctnr-properties-pane');
        }
    };
    DocumentEditorContainer.prototype.initializeDocumentEditor = function () {
        var id = this.element.id + '_editor';
        var documentEditorTarget = this.createElement('div', { id: id, styles: 'width:100%;height:100%' });
        this.documentEditorInternal = new DocumentEditor({
            isReadOnly: false, enableRtl: this.enableRtl,
            selectionChange: this.onSelectionChange.bind(this),
            contentChange: this.onContentChange.bind(this),
            documentChange: this.onDocumentChange.bind(this),
            zoomFactorChange: this.onZoomFactorChange.bind(this),
            requestNavigate: this.onRequestNavigate.bind(this),
            viewChange: this.onViewChange.bind(this),
            customContextMenuSelect: this.onCustomContextMenuSelect.bind(this),
            customContextMenuBeforeOpen: this.onCustomContextMenuBeforeOpen.bind(this),
            beforePaneSwitch: this.onBeforePaneSwitch.bind(this),
            commentBegin: this.onCommentBegin.bind(this),
            commentEnd: this.onCommentEnd.bind(this),
            commentDelete: this.onCommentDelete.bind(this),
            trackChange: this.onTrackChange.bind(this),
            locale: this.locale,
            acceptTab: true,
            zIndex: this.zIndex,
            enableLocalPaste: this.enableLocalPaste,
            layoutType: this.layoutType,
            pageOutline: '#E0E0E0',
            currentUser: this.currentUser,
            userColor: this.userColor,
            height: '100%',
            width: '100%',
            enableTrackChanges: this.enableTrackChanges,
            showRevisions: this.enableTrackChanges
        });
        this.documentEditor.enableAllModules();
        this.documentEditor.enableComment = this.enableComment;
        this.editorContainer.insertBefore(documentEditorTarget, this.editorContainer.firstChild);
        this.setFormat();
        this.documentEditor.appendTo(documentEditorTarget);
        this.documentEditor.resize();
    };
    DocumentEditorContainer.prototype.onCommentBegin = function () {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableInsertComment(false);
        }
    };
    DocumentEditorContainer.prototype.onCommentEnd = function () {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableInsertComment(true && this.enableComment);
        }
    };
    DocumentEditorContainer.prototype.onCommentDelete = function (args) {
        this.trigger('commentDelete', args);
    };
    DocumentEditorContainer.prototype.onTrackChange = function (args) {
        this.trigger('trackChange', args);
        if (this.toolbarModule) {
            this.toolbarModule.toggleTrackChanges(args.isTrackChangesEnabled);
        }
    };
    DocumentEditorContainer.prototype.onBeforePaneSwitch = function (args) {
        this.trigger('beforePaneSwitch', args);
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.showHidePropertiesPane = function (show) {
        if (this.showPropertiesPane) {
            this.showPropertiesPaneOnSelection();
        }
        this.propertiesPaneContainer.style.display = show ? 'block' : 'none';
        if (this.toolbarModule) {
            this.toolbarModule.propertiesPaneButton.element.style.opacity = show ? '1' : '0.5';
        }
        this.documentEditor.resize();
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onContentChange = function () {
        if (this.toolbarModule) {
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('contentChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onDocumentChange = function () {
        this.enableTrackChanges = this.documentEditor.enableTrackChanges;
        if (this.toolbarModule) {
            this.toolbarModule.isCommentEditing = false;
            this.toolbarModule.enableDisableInsertComment(true);
            this.toolbarModule.enableDisableUndoRedo();
        }
        if (this.textProperties) {
            this.textProperties.updateStyles();
        }
        if (this.statusBar) {
            this.statusBar.updatePageCount();
        }
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('documentChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onSelectionChange = function () {
        var _this = this;
        setTimeout(function () {
            _this.showPropertiesPaneOnSelection();
            var eventArgs = { source: isBlazor() ? null : _this };
            _this.trigger('selectionChange', eventArgs);
        });
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onZoomFactorChange = function () {
        if (this.statusBar) {
            this.statusBar.updateZoomContent();
        }
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onRequestNavigate = function (args) {
        if (args.linkType !== 'Bookmark') {
            var link = args.navigationLink;
            if (args.localReference.length > 0) {
                link += '#' + args.localReference;
            }
            window.open(link);
            args.isHandled = true;
        }
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onViewChange = function (args) {
        if (this.statusBar) {
            this.statusBar.updatePageNumberOnViewChange(args);
        }
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onCustomContextMenuSelect = function (args) {
        this.trigger('customContextMenuSelect', args);
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.onCustomContextMenuBeforeOpen = function (args) {
        this.trigger('customContextMenuBeforeOpen', args);
    };
    /**
     * @private
     */
    DocumentEditorContainer.prototype.showPropertiesPaneOnSelection = function () {
        if (this.restrictEditing || this.textProperties === undefined) {
            return;
        }
        var isProtectedDocument = this.documentEditor.documentHelper.protectionType !== 'NoProtection';
        var allowFormatting = isProtectedDocument && this.documentEditor.documentHelper.restrictFormatting;
        var isSelectionInProtectecRegion = this.documentEditor.editor.restrictEditing;
        if (isProtectedDocument) {
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(!isSelectionInProtectecRegion, true);
            }
            this.textProperties.enableDisableElements(!allowFormatting && !isSelectionInProtectecRegion);
            this.tableProperties.enableDisableElements(!allowFormatting && !isSelectionInProtectecRegion);
            this.tocProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.headerFooterProperties.enableDisableElements(!isSelectionInProtectecRegion);
            this.imageProperties.enableDisableElements(!isSelectionInProtectecRegion);
        }
        else {
            var isReadOnly = !this.documentEditor.isReadOnly;
            if (this.toolbarModule) {
                this.toolbarModule.enableDisableToolBarItem(isReadOnly, true);
            }
            this.textProperties.enableDisableElements(isReadOnly);
            this.tableProperties.enableDisableElements(true);
            this.tocProperties.enableDisableElements(true);
            this.headerFooterProperties.enableDisableElements(true);
            this.imageProperties.enableDisableElements(true);
        }
        var currentContext = this.documentEditor.selection.contextType;
        var isInHeaderFooter = currentContext.indexOf('Header') >= 0
            || currentContext.indexOf('Footer') >= 0;
        if (!isInHeaderFooter) {
            this.showHeaderProperties = true;
        }
        if (!this.showPropertiesPane) {
            this.showHidePropertiesPane(false);
            this.propertiesPaneContainer.style.display = 'none';
        }
        else {
            this.propertiesPaneContainer.style.display = 'block';
            if (isInHeaderFooter && this.showHeaderProperties) {
                this.showProperties('headerfooter');
            }
            else if (currentContext.indexOf('List') >= 0 || currentContext.indexOf('Text') >= 0
                && currentContext.indexOf('Table') < 0) {
                this.showProperties('text');
            }
            else if (currentContext.indexOf('Image') >= 0) {
                this.showProperties('image');
            }
            else if (currentContext.indexOf('TableOfContents') >= 0) {
                this.showProperties('toc');
            }
            else if (currentContext.indexOf('Table') >= 0) {
                this.showProperties('table');
            }
        }
        this.previousContext = this.documentEditor.selection.contextType;
        if (this.toolbarModule && this.toolbarModule.toolbar) {
            // tslint:disable-next-line:max-line-length
            this.toolbarModule.enableDisableInsertComment(!this.documentEditor.enableHeaderAndFooter && this.enableComment && !this.documentEditor.isReadOnlyMode);
        }
    };
    /**
     * @private
     * @param property
     */
    DocumentEditorContainer.prototype.showProperties = function (property) {
        if (this.toolbarModule && property !== 'headerfooter' && property !== 'toc') {
            this.toolbarModule.enableDisablePropertyPaneButton(true);
        }
        this.textProperties.showTextProperties(property === 'text');
        this.tableProperties.showTableProperties(property === 'table');
        this.imageProperties.showImageProperties(property === 'image');
        this.headerFooterProperties.showHeaderFooterPane(property === 'headerfooter');
        this.tocProperties.showTocPane(property === 'toc');
    };
    /**
     * Set the default character format for document editor container
     * @param characterFormat
     */
    DocumentEditorContainer.prototype.setDefaultCharacterFormat = function (characterFormat) {
        this.characterFormat = characterFormat;
    };
    /**
     * Set the default paragraph format for document editor container
     * @param paragraphFormat
     */
    DocumentEditorContainer.prototype.setDefaultParagraphFormat = function (paragraphFormat) {
        this.paragraphFormat = paragraphFormat;
    };
    /**
     * Set the default section format for document editor container
     * @param sectionFormat
     */
    DocumentEditorContainer.prototype.setDefaultSectionFormat = function (sectionFormat) {
        this.sectionFormat = sectionFormat;
    };
    /**
     * Destroys all managed resources used by this object.
     */
    DocumentEditorContainer.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.element) {
            this.element.classList.remove('e-documenteditorcontainer');
            this.element.innerHTML = '';
        }
        if (!this.refreshing) {
            this.element = undefined;
        }
        if (this.toolbarContainer && this.toolbarContainer.parentElement) {
            this.toolbarContainer.innerHTML = '';
            this.toolbarContainer.parentElement.removeChild(this.toolbarContainer);
        }
        this.toolbarContainer = undefined;
        if (this.documentEditorInternal) {
            this.documentEditorInternal.destroy();
        }
        this.documentEditorInternal = undefined;
        if (this.textProperties) {
            this.textProperties.destroy();
        }
        this.textProperties = undefined;
        if (this.headerFooterProperties) {
            this.headerFooterProperties.destroy();
        }
        this.headerFooterProperties = undefined;
        if (this.imageProperties) {
            this.imageProperties.destroy();
        }
        this.imageProperties = undefined;
        if (this.tocProperties) {
            this.tocProperties.destroy();
        }
        this.tocProperties = undefined;
        if (this.tableProperties) {
            this.tableProperties.destroy();
        }
        this.tableProperties = undefined;
        if (this.statusBar) {
            this.statusBar.destroy();
        }
        if (this.propertiesPaneContainer && this.editorContainer.parentElement) {
            this.propertiesPaneContainer.innerHTML = '';
            this.propertiesPaneContainer.parentElement.removeChild(this.propertiesPaneContainer);
        }
        this.propertiesPaneContainer = undefined;
        if (this.editorContainer && this.editorContainer.parentElement) {
            this.editorContainer.innerHTML = '';
            this.editorContainer.parentElement.removeChild(this.editorContainer);
        }
        if (this.statusBarElement && this.statusBarElement.parentElement) {
            this.statusBarElement.innerHTML = '';
            this.statusBarElement.parentElement.removeChild(this.statusBarElement);
        }
        if (this.containerTarget && this.containerTarget.parentElement) {
            this.containerTarget.innerHTML = '';
            this.containerTarget.parentElement.removeChild(this.containerTarget);
        }
        this.containerTarget = undefined;
        this.statusBarElement = undefined;
        this.editorContainer = undefined;
    };
    __decorate([
        Property(true)
    ], DocumentEditorContainer.prototype, "showPropertiesPane", void 0);
    __decorate([
        Property(true)
    ], DocumentEditorContainer.prototype, "enableToolbar", void 0);
    __decorate([
        Property(false)
    ], DocumentEditorContainer.prototype, "restrictEditing", void 0);
    __decorate([
        Property(false)
    ], DocumentEditorContainer.prototype, "enableSpellCheck", void 0);
    __decorate([
        Property(false)
    ], DocumentEditorContainer.prototype, "enableTrackChanges", void 0);
    __decorate([
        Property('Pages')
    ], DocumentEditorContainer.prototype, "layoutType", void 0);
    __decorate([
        Property('')
    ], DocumentEditorContainer.prototype, "currentUser", void 0);
    __decorate([
        Property('#FFFF00')
    ], DocumentEditorContainer.prototype, "userColor", void 0);
    __decorate([
        Property(false)
    ], DocumentEditorContainer.prototype, "enableLocalPaste", void 0);
    __decorate([
        Property()
    ], DocumentEditorContainer.prototype, "serviceUrl", void 0);
    __decorate([
        Property(2000)
    ], DocumentEditorContainer.prototype, "zIndex", void 0);
    __decorate([
        Property(false)
    ], DocumentEditorContainer.prototype, "enableCsp", void 0);
    __decorate([
        Property(true)
    ], DocumentEditorContainer.prototype, "enableComment", void 0);
    __decorate([
        Property('100%')
    ], DocumentEditorContainer.prototype, "width", void 0);
    __decorate([
        Property('320px')
    ], DocumentEditorContainer.prototype, "height", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "created", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "contentChange", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "selectionChange", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "documentChange", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "toolbarClick", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "customContextMenuSelect", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "customContextMenuBeforeOpen", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "beforePaneSwitch", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "commentDelete", void 0);
    __decorate([
        Event()
    ], DocumentEditorContainer.prototype, "trackChange", void 0);
    __decorate([
        Complex({}, DocumentEditorSettings)
    ], DocumentEditorContainer.prototype, "documentEditorSettings", void 0);
    __decorate([
        Property({ import: 'Import', systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', restrictEditing: 'RestrictEditing' })
    ], DocumentEditorContainer.prototype, "serverActionSettings", void 0);
    __decorate([
        Property(['New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields'])
    ], DocumentEditorContainer.prototype, "toolbarItems", void 0);
    __decorate([
        Property([])
    ], DocumentEditorContainer.prototype, "headers", void 0);
    DocumentEditorContainer = __decorate([
        NotifyPropertyChanges
    ], DocumentEditorContainer);
    return DocumentEditorContainer;
}(Component));
export { DocumentEditorContainer };
