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
import { Component, Property, NotifyPropertyChanges, Event, ChildProperty, isBlazor, classList, Complex, formatUnit } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, Browser } from '@syncfusion/ej2-base';
import { Save } from '@syncfusion/ej2-file-utils';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, BulletsAndNumberingDialog } from './index';
import { Print } from './index';
import { BodyWidget, ParagraphWidget } from './index';
import { WSectionFormat, WParagraphFormat, WCharacterFormat } from './index';
import { SfdtReader } from './index';
import { Selection } from './index';
import { Editor, EditorHistory } from './index';
import { WStyles } from './index';
import { Search } from './index';
import { OptionsPane } from './index';
import { WordExport } from './index';
import { TextExport } from './index';
import { ContextMenu } from './index';
import { ImageResizer } from './index';
import { SfdtExport } from './index';
import { HyperlinkDialog, TableDialog, BookmarkDialog, StylesDialog, TableOfContentsDialog } from './index';
import { PageSetupDialog, ParagraphDialog, ListDialog, StyleDialog, FontDialog } from './index';
import { TablePropertiesDialog, BordersAndShadingDialog, CellOptionsDialog, TableOptionsDialog } from './index';
import { SpellChecker } from './implementation/spell-check/spell-checker';
import { SpellCheckDialog } from './implementation/dialogs/spellCheck-dialog';
import { DocumentHelper } from './index';
// tslint:disable-next-line:max-line-length
import { CheckBoxFormFieldDialog, DropDownFormField, TextFormField, CheckBoxFormField } from './implementation/index';
import { TextFormFieldDialog } from './implementation/dialogs/form-field-text-dialog';
import { DropDownFormFieldDialog } from './implementation/dialogs/form-field-drop-down-dialog';
import { RevisionCollection } from './implementation/track-changes/track-changes';
/**
 * The `DocumentEditorSettings` module is used to provide the customize property of Document Editor.
 */
var DocumentEditorSettings = /** @class */ (function (_super) {
    __extends(DocumentEditorSettings, _super);
    function DocumentEditorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('#FFE97F')
    ], DocumentEditorSettings.prototype, "searchHighlightColor", void 0);
    __decorate([
        Property(['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'])
    ], DocumentEditorSettings.prototype, "fontFamilies", void 0);
    __decorate([
        Property({ shadingColor: '#cfcfcf', applyShading: true, selectionColor: '#cccccc', formFillingMode: 'Popup' })
    ], DocumentEditorSettings.prototype, "formFieldSettings", void 0);
    return DocumentEditorSettings;
}(ChildProperty));
export { DocumentEditorSettings };
/**
 * The Document editor component is used to draft, save or print rich text contents as page by page.
 */
var DocumentEditor = /** @class */ (function (_super) {
    __extends(DocumentEditor, _super);
    /**
     * Initialize the constructor of DocumentEditor
     */
    function DocumentEditor(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.enableHeaderFooterIn = false;
        /**
         * @private
         */
        _this.isShiftingEnabled = false;
        /**
         * @private
         */
        _this.isLayoutEnabled = true;
        /**
         * @private
         */
        _this.isPastingContent = false;
        /**
         * @private
         */
        _this.parser = undefined;
        _this.disableHistoryIn = false;
        /**
         * @private
         */
        _this.findResultsList = undefined;
        /**
         * @private
         */
        _this.tablePropertiesDialogModule = undefined;
        /**
         * @private
         */
        _this.bordersAndShadingDialogModule = undefined;
        /**
         * @private
         */
        _this.cellOptionsDialogModule = undefined;
        /**
         * @private
         */
        _this.tableOptionsDialogModule = undefined;
        /**
         * @private
         */
        _this.paragraphDialogModule = undefined;
        /**
         * @private
         */
        _this.imageResizerModule = undefined;
        /**
         * @private
         */
        _this.defaultLocale = {
            'Table': 'Table',
            'Row': 'Row',
            'Cell': 'Cell',
            'Ok': 'OK',
            'Cancel': 'Cancel',
            'Size': 'Size',
            'Preferred Width': 'Preferred width',
            'Points': 'Points',
            'Percent': 'Percent',
            'Measure in': 'Measure in',
            'Alignment': 'Alignment',
            'Left': 'Left',
            'Center': 'Center',
            'Right': 'Right',
            'Justify': 'Justify',
            'Indent from left': 'Indent from left',
            'Borders and Shading': 'Borders and Shading',
            'Options': 'Options',
            'Specify height': 'Specify height',
            'At least': 'At least',
            'Exactly': 'Exactly',
            'Row height is': 'Row height is',
            'Allow row to break across pages': 'Allow row to break across pages',
            'Repeat as header row at the top of each page': 'Repeat as header row at the top of each page',
            'Vertical alignment': 'Vertical alignment',
            'Top': 'Top',
            'Bottom': 'Bottom',
            'Default cell margins': 'Default cell margins',
            'Default cell spacing': 'Default cell spacing',
            'Allow spacing between cells': 'Allow spacing between cells',
            'Cell margins': 'Cell margins',
            'Same as the whole table': 'Same as the whole table',
            'Borders': 'Borders',
            'None': 'None',
            'Style': 'Style',
            'Width': 'Width',
            'Height': 'Height',
            'Letter': 'Letter',
            'Tabloid': 'Tabloid',
            'Legal': 'Legal',
            'Statement': 'Statement',
            'Executive': 'Executive',
            'A3': 'A3',
            'A4': 'A4',
            'A5': 'A5',
            'B4': 'B4',
            'B5': 'B5',
            'Custom Size': 'Custom size',
            'Different odd and even': 'Different odd and even',
            'Different first page': 'Different first page',
            'From edge': 'From edge',
            'Header': 'Header',
            'Footer': 'Footer',
            'Margin': 'Margins',
            'Paper': 'Paper',
            'Layout': 'Layout',
            'Orientation': 'Orientation',
            'Landscape': 'Landscape',
            'Portrait': 'Portrait',
            'Show page numbers': 'Show page numbers',
            'Right align page numbers': 'Right align page numbers',
            'Nothing': 'Nothing',
            'Tab leader': 'Tab leader',
            'Show levels': 'Show levels',
            'Use hyperlinks instead of page numbers': 'Use hyperlinks instead of page numbers',
            'Build table of contents from': 'Build table of contents from',
            'Styles': 'Styles',
            'Available styles': 'Available styles',
            'TOC level': 'TOC level',
            'Heading': 'Heading',
            'Heading 1': 'Heading 1',
            'Heading 2': 'Heading 2',
            'Heading 3': 'Heading 3',
            'Heading 4': 'Heading 4',
            'Heading 5': 'Heading 5',
            'Heading 6': 'Heading 6',
            'List Paragraph': 'List Paragraph',
            'Normal': 'Normal',
            'Outline levels': 'Outline levels',
            'Table entry fields': 'Table entry fields',
            'Modify': 'Modify',
            'Color': 'Color',
            'Setting': 'Setting',
            'Box': 'Box',
            'All': 'All',
            'Custom': 'Custom',
            'Preview': 'Preview',
            'Shading': 'Shading',
            'Fill': 'Fill',
            'Apply To': 'Apply to',
            'Table Properties': 'Table Properties',
            'Cell Options': 'Cell Options',
            'Table Options': 'Table Options',
            'Insert Table': 'Insert Table',
            'Number of columns': 'Number of columns',
            'Number of rows': 'Number of rows',
            'Text to display': 'Text to display',
            'Address': 'Address',
            'Insert Hyperlink': 'Insert Hyperlink',
            'Edit Hyperlink': 'Edit Hyperlink',
            'Insert': 'Insert',
            'General': 'General',
            'Indentation': 'Indentation',
            'Before text': 'Before text',
            'Special': 'Special',
            'First line': 'First line',
            'Hanging': 'Hanging',
            'After text': 'After text',
            'By': 'By',
            'Before': 'Before',
            'Line Spacing': 'Line spacing',
            'After': 'After',
            'At': 'At',
            'Multiple': 'Multiple',
            'Spacing': 'Spacing',
            'Define new Multilevel list': 'Define new Multilevel list',
            'List level': 'List level',
            'Choose level to modify': 'Choose level to modify',
            'Level': 'Level',
            'Number format': 'Number format',
            'Number style for this level': 'Number style for this level',
            'Enter formatting for number': 'Enter formatting for number',
            'Start at': 'Start at',
            'Restart list after': 'Restart list after',
            'Position': 'Position',
            'Text indent at': 'Text indent at',
            'Aligned at': 'Aligned at',
            'Follow number with': 'Follow number with',
            'Tab character': 'Tab character',
            'Space': 'Space',
            'Arabic': 'Arabic',
            'UpRoman': 'UpRoman',
            'LowRoman': 'LowRoman',
            'UpLetter': 'UpLetter',
            'LowLetter': 'LowLetter',
            'Number': 'Number',
            'Leading zero': 'Leading zero',
            'Bullet': 'Bullet',
            'Ordinal': 'Ordinal',
            'Ordinal Text': 'Ordinal Text',
            'For East': 'For East',
            'No Restart': 'No Restart',
            'Font': 'Font',
            'Font style': 'Font style',
            'Underline style': 'Underline style',
            'Font color': 'Font color',
            'Effects': 'Effects',
            'Strikethrough': 'Strikethrough',
            'Superscript': 'Superscript',
            'Subscript': 'Subscript',
            'Double strikethrough': 'Double strikethrough',
            'Regular': 'Regular',
            'Bold': 'Bold',
            'Italic': 'Italic',
            'Cut': 'Cut',
            'Copy': 'Copy',
            'Paste': 'Paste',
            'Hyperlink': 'Hyperlink',
            'Open Hyperlink': 'Open Hyperlink',
            'Copy Hyperlink': 'Copy Hyperlink',
            'Remove Hyperlink': 'Remove Hyperlink',
            'Paragraph': 'Paragraph',
            'Linked Style': 'Linked(Paragraph and Character)',
            'Character': 'Character',
            'Merge Cells': 'Merge Cells',
            'Insert Above': 'Insert Above',
            'Insert Below': 'Insert Below',
            'Insert Left': 'Insert Left',
            'Insert Right': 'Insert Right',
            'Delete': 'Delete',
            'Delete Table': 'Delete Table',
            'Delete Row': 'Delete Row',
            'Delete Column': 'Delete Column',
            'File Name': 'File Name',
            'Format Type': 'Format Type',
            'Save': 'Save',
            'Navigation': 'Navigation',
            'Results': 'Results',
            'Replace': 'Replace',
            'Replace All': 'Replace All',
            'We replaced all': 'We replaced all',
            'Find': 'Find',
            'No matches': 'No matches',
            'All Done': 'All Done',
            'Result': 'Result',
            'of': 'of',
            'instances': 'instances',
            'with': 'with',
            'Click to follow link': 'Click to follow link',
            'Continue Numbering': 'Continue Numbering',
            'Bookmark name': 'Bookmark name',
            'Close': 'Close',
            'Restart At': 'Restart At',
            'Properties': 'Properties',
            'Name': 'Name',
            'Style type': 'Style type',
            'Style based on': 'Style based on',
            'Style for following paragraph': 'Style for following paragraph',
            'Formatting': 'Formatting',
            'Numbering and Bullets': 'Numbering and Bullets',
            'Numbering': 'Numbering',
            'Update Field': 'Update Field',
            'Edit Field': 'Edit Field',
            'Bookmark': 'Bookmark',
            'Page Setup': 'Page Setup',
            'No bookmarks found': 'No bookmarks found',
            'Number format tooltip information': 'Single-level number format: </br>[PREFIX]%[LEVELNUMBER][SUFFIX]</br>'
                + 'For example, "Chapter %1." will display numbering like</br>Chapter 1. Item</br>Chapter 2. Item</br>…'
                + '</br>Chapter N. Item</br>'
                + '</br>Multilevel number format:</br>[PREFIX]%[LEVELNUMBER][SUFFIX]+[PREFIX]%[LEVELNUMBER][SUFFIX]'
                + '</br>For example, "%1.%2." will display numbering like</br>1.1. Item</br>1.2. Item</br>…</br>1.N. Item',
            'Format': 'Format',
            'Create New Style': 'Create New Style',
            'Modify Style': 'Modify Style',
            'New': 'New',
            'Bullets': 'Bullets',
            'Use bookmarks': 'Use bookmarks',
            'Table of Contents': 'Table of Contents',
            'AutoFit': 'AutoFit',
            'AutoFit to Contents': 'AutoFit to Contents',
            'AutoFit to Window': 'AutoFit to Window',
            'Fixed Column Width': 'Fixed Column Width',
            'Reset': 'Reset',
            'Match case': 'Match case',
            'Whole words': 'Whole words',
            'Add': 'Add',
            'Go To': 'Go To',
            'Search for': 'Search for',
            'Replace with': 'Replace with',
            'TOC 1': 'TOC 1',
            'TOC 2': 'TOC 2',
            'TOC 3': 'TOC 3',
            'TOC 4': 'TOC 4',
            'TOC 5': 'TOC 5',
            'TOC 6': 'TOC 6',
            'TOC 7': 'TOC 7',
            'TOC 8': 'TOC 8',
            'TOC 9': 'TOC 9',
            'Right-to-left': 'Right-to-left',
            'Left-to-right': 'Left-to-right',
            'Direction': 'Direction',
            'Table direction': 'Table direction',
            'Indent from right': 'Indent from right',
            /* tslint:disable */
            "Contextual Spacing": "Don't add space between the paragraphs of the same styles",
            "Password Mismatch": "The password don't match",
            /* tslint:enable */
            'Restrict Editing': 'Restrict Editing',
            'Formatting restrictions': 'Formatting restrictions',
            'Allow formatting': 'Allow formatting',
            'Editing restrictions': 'Editing restrictions',
            'Read only': 'Read only',
            'Exceptions Optional': 'Exceptions (optional)',
            // tslint:disable-next-line:max-line-length
            'Select Part Of Document And User': 'Select parts of the document and choose users who are allowed to freely edit them.',
            'Everyone': 'Everyone',
            'More users': 'More users',
            'Add Users': 'Add Users',
            'Enforcing Protection': 'Yes, Start Enforcing Protection',
            'Start Enforcing Protection': 'Start Enforcing Protection',
            'Enter User': 'Enter User',
            'Users': 'Users',
            'Enter new password': 'Enter new password',
            'Reenter new password to confirm': 'Reenter new password to confirm',
            'Your permissions': 'Your permissions',
            // tslint:disable-next-line:max-line-length
            'Protected Document': 'This document is protected from unintentional editing.You may edit in this region.',
            'FormFieldsOnly': 'This document is protected from unintentional editing. You may only fill in forms in this region.',
            'You may format text only with certain styles': 'You may format text only with certain styles.',
            'Stop Protection': 'Stop Protection',
            'Password': 'Password',
            'Spelling Editor': 'Spelling Editor',
            'Spelling': 'Spelling',
            'Spell Check': 'Spell Check',
            'Underline errors': 'Underline errors',
            'Ignore': 'Ignore',
            'Ignore all': 'Ignore All',
            'Add to Dictionary': 'Add to Dictionary',
            'Change': 'Change',
            'Change All': 'Change All',
            'Suggestions': 'Suggestions',
            'The password is incorrect': 'The password is incorrect',
            'Error in establishing connection with web server': 'Error in establishing connection with web server',
            'Highlight the regions I can edit': 'Highlight the regions I can edit',
            'Show All Regions I Can Edit': 'Show All Regions I Can Edit',
            'Find Next Region I Can Edit': 'Find Next Region I Can Edit',
            'Keep source formatting': 'Keep source formatting',
            'Match destination formatting': 'Match destination formatting',
            'Text only': 'Text only',
            'Comments': 'Comments',
            'Type your comment': 'Type your comment',
            'Post': 'Post',
            'Reply': 'Reply',
            'New Comment': 'New Comment',
            'Edit': 'Edit',
            'Resolve': 'Resolve',
            'Reopen': 'Reopen',
            'No comments in this document': 'No comments in this document',
            'more': 'more',
            'Type your comment here': 'Type your comment here',
            'Next Comment': 'Next Comment',
            'Previous Comment': 'Previous Comment',
            'Un-posted comments': 'Un-posted comments',
            // tslint:disable-next-line:max-line-length
            'Discard Comment': 'Added comments not posted. If you continue, that comment will be discarded.',
            'No Headings': 'No Heading Found!',
            'Add Headings': 'This document has no headings. Please add headings and try again.',
            'More Options': 'More Options',
            'Click to see this comment': 'Click to see this comment',
            'Form Fields': 'Form Fields',
            'Text Form': 'Text Form',
            'Check Box': 'Check Box',
            'Drop Down Form Field': 'Drop Down Form Field',
            'Dropdown items': 'Drop-down items',
            'Items in dropdown list': 'Items in drop-down list',
            'ADD': 'ADD',
            'REMOVE': 'REMOVE',
            'Field settings': 'Field settings',
            'Tooltip': 'Tooltip',
            'Dropdown enabled': 'Drop-down enabled',
            'Check Box Form Field': 'Check Box Form Field',
            'Check box size': 'Check box size',
            'Auto': 'Auto',
            'Default value': 'Default value',
            'Not checked': 'Not checked',
            'Checked': 'Checked',
            'Check box enabled': 'Check box enabled',
            'Text Form Field': 'Text Form Field',
            'Type': 'Type',
            'Default text': 'Default text',
            'Maximum length': 'Maximum length',
            'Text format': 'Text format',
            'Fillin enabled': 'Fill-in enabled',
            'Default number': 'Default number',
            'Default date': 'Default date',
            'Date format': 'Date format',
            'Merge Track': 'This action wont be marked as change. Do you want to continue?',
            'UnTrack': 'Cannot be tracked !',
            'Accept': 'Accept',
            'Reject': 'Reject',
            'Previous Changes': 'Previous Changes',
            'Next Changes': 'Next Changes',
            'Inserted': 'Inserted',
            'Deleted': 'Deleted',
            'Move From': 'Move From',
            'Move To': 'Move To',
            'Changes': 'Changes',
            'Accept all': 'Accept all',
            'Reject all': 'Reject all',
            'No changes': 'No changes',
            'Accept Changes': 'Accept Changes',
            'Reject Changes': 'Reject Changes',
            'User': 'User',
            'View': 'View',
            'Insertion': 'Insertion',
            'Deletion': 'Deletion'
        };
        _this.documentHelper = new DocumentHelper(_this);
        if (_this.layoutType === 'Pages') {
            _this.viewer = new PageLayoutViewer(_this);
        }
        else {
            _this.viewer = new WebLayoutViewer(_this);
        }
        _this.parser = new SfdtReader(_this.documentHelper);
        return _this;
    }
    DocumentEditor_1 = DocumentEditor;
    Object.defineProperty(DocumentEditor.prototype, "enableHeaderAndFooter", {
        /**
         * @private
         */
        get: function () {
            return this.enableHeaderFooterIn;
        },
        set: function (value) {
            this.enableHeaderFooterIn = value;
            if (!value && this.selection && this.selection.isWebLayout) {
                this.selection.isWebLayout = false;
            }
            this.viewer.updateScrollBars();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "pageCount", {
        /**
         * Gets the total number of pages.
         * @blazorType int
         * @returns {number}
         */
        get: function () {
            if (!this.isDocumentLoaded || isNullOrUndefined(this.viewer) || this.viewer instanceof WebLayoutViewer) {
                return 1;
            }
            return this.documentHelper.pages.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "selection", {
        /**
         *  Gets the selection object of the document editor.
         * @aspType Selection
         * @blazorType Selection
         * @returns {Selection}
         * @default undefined
         */
        get: function () {
            return this.selectionModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "editor", {
        /**
         *  Gets the editor object of the document editor.
         * @aspType Editor
         * @blazorType Editor
         * @returns {Editor}
         * @default undefined
         */
        get: function () {
            return this.editorModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "editorHistory", {
        /**
         * Gets the editor history object of the document editor.
         * @aspType EditorHistory
         * @blazorType EditorHistory
         * @returns {EditorHistory}
         */
        get: function () {
            return this.editorHistoryModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "search", {
        /**
         * Gets the search object of the document editor.
         * @aspType Search
         * @blazorType Search
         * @returns { Search }
         */
        get: function () {
            return this.searchModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "contextMenu", {
        /**
         * Gets the context menu object of the document editor.
         * @aspType ContextMenu
         * @blazorType ContextMenu
         * @returns {ContextMenu}
         */
        get: function () {
            return this.contextMenuModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "spellCheckDialog", {
        /**
         * Gets the spell check dialog object of the document editor.
         * @returns SpellCheckDialog
         */
        get: function () {
            return this.spellCheckDialogModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "spellChecker", {
        /**
         * Gets the spell check object of the document editor.
         * @aspType SpellChecker
         * @blazorType SpellChecker
         * @returns SpellChecker
         */
        get: function () {
            return this.spellCheckerModule;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "containerId", {
        /**
         * @private
         */
        get: function () {
            return this.element.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "isDocumentLoaded", {
        /**
         * @private
         */
        get: function () {
            return this.isDocumentLoadedIn;
        },
        set: function (value) {
            this.isDocumentLoadedIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "revisions", {
        /**
         * Gets the revision collection which contains information about changes made from original document
         */
        get: function () {
            if (isNullOrUndefined(this.revisionsInternal)) {
                this.revisionsInternal = new RevisionCollection(this);
            }
            return this.revisionsInternal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "enableHistoryMode", {
        /**
         * Determines whether history needs to be enabled or not.
         * @default - false
         * @private
         */
        get: function () {
            return this.enableEditorHistory && !isNullOrUndefined(this.editorHistoryModule);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "documentStart", {
        /**
         * Gets the start text position in the document.
         * @default undefined
         * @private
         */
        get: function () {
            if (!isNullOrUndefined(this.selectionModule)) {
                return this.selection.getDocumentStart();
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "documentEnd", {
        /**
         * Gets the end text position in the document.
         * @default undefined
         * @private
         */
        get: function () {
            if (!isNullOrUndefined(this.selectionModule)) {
                return this.selection.getDocumentEnd();
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "isReadOnlyMode", {
        /**
         * @private
         */
        get: function () {
            return this.isReadOnly || isNullOrUndefined(this.editorModule)
                || isNullOrUndefined(this.selectionModule) || !isNullOrUndefined(this.editor) && this.editor.restrictEditing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "isSpellCheck", {
        /**
         * @private
         */
        get: function () {
            return this.enableSpellCheck && this.spellChecker.enableSpellCheck;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DocumentEditor.prototype, "enableImageResizerMode", {
        /**
         * Specifies to enable image resizer option
         * default - false
         * @private
         */
        get: function () {
            return this.enableImageResizer && !isNullOrUndefined(this.imageResizerModule);
        },
        enumerable: true,
        configurable: true
    });
    DocumentEditor.prototype.preRender = function () {
        //pre render section
        this.findResultsList = [];
    };
    DocumentEditor.prototype.render = function () {
        if (!isNullOrUndefined(this.element)) {
            var container = this.element;
            container.style.minHeight = '200px';
            container.style.minWidth = '200px';
            if (this.height !== '') {
                this.element.style.height = formatUnit(this.height);
            }
            if (this.width !== '') {
                this.element.style.width = formatUnit(this.width);
            }
        }
        this.documentHelper.initializeComponents();
        this.openBlank();
        this.renderComplete();
    };
    /**
     * Get component name
     * @private
     */
    DocumentEditor.prototype.getModuleName = function () {
        return 'DocumentEditor';
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    DocumentEditor.prototype.onPropertyChanged = function (model, oldProp) {
        var _this = this;
        for (var _i = 0, _a = Object.keys(model); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'zoomFactor':
                    if (this.viewer) {
                        this.documentHelper.zoomFactor = model.zoomFactor;
                    }
                    break;
                case 'layoutType':
                    if (this.selection && this.selection.isWebLayout) {
                        break;
                    }
                    this.viewer.destroy();
                    if (this.layoutType === 'Pages') {
                        this.viewer = new PageLayoutViewer(this);
                    }
                    else {
                        if (this.enableHeaderAndFooter === true) {
                            this.selection.closeHeaderFooter();
                        }
                        this.viewer = new WebLayoutViewer(this);
                    }
                    this.editor.layoutWholeDocument(true);
                    setTimeout(function () { _this.fireViewChange(); }, 200);
                    break;
                case 'locale':
                    this.localizeDialogs();
                    break;
                case 'isReadOnly':
                    if (!isNullOrUndefined(this.optionsPaneModule) && this.optionsPaneModule.isOptionsPaneShow) {
                        this.optionsPaneModule.showHideOptionsPane(false);
                    }
                    if (this.showComments) {
                        this.commentReviewPane.showHidePane(true, 'Comments');
                    }
                    break;
                case 'currentUser':
                case 'userColor':
                    if (this.selection && this.documentHelper.isDocumentProtected) {
                        this.selection.highlightEditRegion();
                    }
                    break;
                case 'pageGap':
                case 'pageOutline':
                    this.viewer.updateScrollBars();
                    break;
                case 'zIndex':
                    if (this.documentHelper.dialog) {
                        this.documentHelper.dialog.zIndex = model.zIndex + 10;
                    }
                    if (this.documentHelper.dialog2) {
                        this.documentHelper.dialog2.zIndex = model.zIndex;
                    }
                    break;
                case 'showComments':
                    if (this.viewer) {
                        this.documentHelper.showComments(model.showComments);
                    }
                    break;
                case 'enableRtl':
                    this.localizeDialogs(model.enableRtl);
                    break;
                case 'enableComment':
                    if (this.viewer && this.showComments) {
                        this.showComments = this.showComments ? this.enableComment : false;
                        this.documentHelper.showComments(model.enableComment);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'showRevisions':
                    if (this.viewer) {
                        this.documentHelper.showRevisions(model.showRevisions);
                    }
                    this.viewer.updateScrollBars();
                    break;
                case 'documentEditorSettings':
                    this.viewer.updateScrollBars();
                    break;
                case 'height':
                    this.element.style.height = formatUnit(this.height);
                    this.resize();
                    break;
                case 'width':
                    this.element.style.width = formatUnit(this.width);
                    this.resize();
                    break;
            }
        }
    };
    DocumentEditor.prototype.localizeDialogs = function (enableRtl) {
        if (this.locale !== '') {
            var l10n = new L10n('documenteditor', this.defaultLocale);
            l10n.setLocale(this.locale);
            if (!isNullOrUndefined(enableRtl)) {
                this.documentHelper.dialog.enableRtl = enableRtl;
                this.documentHelper.dialog2.enableRtl = enableRtl;
            }
            if (this.optionsPaneModule) {
                this.optionsPaneModule.initOptionsPane(l10n, enableRtl);
            }
            if (this.paragraphDialogModule) {
                this.paragraphDialogModule.initParagraphDialog(l10n);
            }
            if (this.pageSetupDialogModule) {
                this.pageSetupDialogModule.initPageSetupDialog(l10n, enableRtl);
            }
            if (this.fontDialogModule) {
                this.fontDialogModule.initFontDialog(l10n, enableRtl);
            }
            if (this.hyperlinkDialogModule) {
                this.hyperlinkDialogModule.initHyperlinkDialog(l10n, enableRtl);
            }
            if (this.contextMenuModule) {
                this.contextMenuModule.contextMenuInstance.destroy();
                this.contextMenuModule.initContextMenu(l10n, enableRtl);
            }
            if (this.listDialogModule) {
                this.listDialogModule.initListDialog(l10n, enableRtl);
            }
            if (this.tablePropertiesDialogModule) {
                this.tablePropertiesDialogModule.initTablePropertyDialog(l10n, enableRtl);
            }
            if (this.bordersAndShadingDialogModule) {
                this.bordersAndShadingDialogModule.initBordersAndShadingsDialog(l10n, enableRtl);
            }
            if (this.cellOptionsDialogModule) {
                this.cellOptionsDialogModule.initCellMarginsDialog(l10n, enableRtl);
            }
            if (this.tableOptionsDialogModule) {
                this.tableOptionsDialogModule.initTableOptionsDialog(l10n, enableRtl);
            }
            if (this.tableDialogModule) {
                this.tableDialogModule.initTableDialog(l10n);
            }
            if (this.styleDialogModule) {
                this.styleDialogModule.initStyleDialog(l10n, enableRtl);
            }
            if (this.tableOfContentsDialogModule) {
                this.tableOfContentsDialogModule.initTableOfContentDialog(l10n, enableRtl);
            }
            if (this.commentReviewPane && this.commentReviewPane.parentPaneElement) {
                if (this.enableRtl) {
                    classList(this.commentReviewPane.parentPaneElement, ['e-rtl'], []);
                }
                else {
                    classList(this.commentReviewPane.parentPaneElement, [], ['e-rtl']);
                }
            }
        }
    };
    /**
     * Set the default character format for document editor
     * @param characterFormat
     */
    DocumentEditor.prototype.setDefaultCharacterFormat = function (characterFormat) {
        this.characterFormat = characterFormat;
    };
    /**
     * Set the default paragraph format for document editor
     * @param paragraphFormat
     */
    DocumentEditor.prototype.setDefaultParagraphFormat = function (paragraphFormat) {
        this.paragraphFormat = paragraphFormat;
    };
    /**
     * Set the default section format for document editor
     * @param sectionFormat
     */
    DocumentEditor.prototype.setDefaultSectionFormat = function (sectionFormat) {
        this.sectionFormat = sectionFormat;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    DocumentEditor.prototype.getPersistData = function () {
        return 'documenteditor';
    };
    DocumentEditor.prototype.clearPreservedCollectionsInViewer = function () {
        if (this.viewer instanceof LayoutViewer) {
            this.documentHelper.clearDocumentItems();
        }
    };
    /**
     * @private
     */
    DocumentEditor.prototype.getDocumentEditorElement = function () {
        return this.element;
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireContentChange = function () {
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('contentChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireDocumentChange = function () {
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('documentChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireSelectionChange = function () {
        if (!this.documentHelper.isCompositionStart && Browser.isDevice && this.editorModule) {
            this.editorModule.predictText();
        }
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('selectionChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireZoomFactorChange = function () {
        var eventArgs = { source: isBlazor() ? null : this };
        this.trigger('zoomFactorChange', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireBeformFieldFill = function () {
        var eventArgs = {};
        this.trigger('beforeFieldFill', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireAfterFormFieldFill = function () {
        var eventArgs = {};
        this.trigger('afterFieldFill', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireServiceFailure = function (eventArgs) {
        this.trigger('serviceFailure', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireViewChange = function () {
        if (this.viewer && this.documentHelper.pages.length > 0) {
            if (this.viewer.visiblePages.length > 0) {
                var pages = this.viewer.visiblePages;
                var eventArgs = {
                    startPage: pages[0].index + 1,
                    endPage: pages[pages.length - 1].index + 1,
                    source: isBlazor() ? null : this
                };
                this.trigger('viewChange', eventArgs);
            }
        }
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireCustomContextMenuSelect = function (item) {
        var eventArgs = { id: item };
        this.trigger('customContextMenuSelect', eventArgs);
    };
    /**
     * @private
     */
    DocumentEditor.prototype.fireCustomContextMenuBeforeOpen = function (item) {
        var eventArgs = { ids: item };
        this.trigger('customContextMenuBeforeOpen', eventArgs);
    };
    /**
     * Shows the Paragraph dialog
     * @private
     */
    DocumentEditor.prototype.showParagraphDialog = function (paragraphFormat) {
        if (this.paragraphDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.paragraphDialogModule.show(paragraphFormat);
        }
    };
    /**
     * Shows the margin dialog
     * @private
     */
    DocumentEditor.prototype.showPageSetupDialog = function () {
        if (this.pageSetupDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.pageSetupDialogModule.show();
        }
    };
    /**
     * Shows the font dialog
     * @private
     */
    DocumentEditor.prototype.showFontDialog = function (characterFormat) {
        if (this.fontDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.fontDialogModule.showFontDialog(characterFormat);
        }
    };
    /**
     * Shows the cell option dialog
     * @private
     */
    DocumentEditor.prototype.showCellOptionsDialog = function () {
        if (this.cellOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.cellOptionsDialogModule.show();
        }
    };
    /**
     * Shows the table options dialog.
     * @private
     */
    DocumentEditor.prototype.showTableOptionsDialog = function () {
        if (this.tableOptionsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOptionsDialogModule.show();
        }
    };
    /**
     * Shows insert table dialog
     * @private
     */
    DocumentEditor.prototype.showTableDialog = function () {
        if (this.tableDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableDialogModule.show();
        }
    };
    /**
     * Shows the table of content dialog
     * @private
     */
    DocumentEditor.prototype.showTableOfContentsDialog = function () {
        if (this.tableOfContentsDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tableOfContentsDialogModule.show();
        }
    };
    /**
     * Shows the style dialog
     * @private
     */
    DocumentEditor.prototype.showStyleDialog = function () {
        if (this.styleDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.styleDialogModule.show();
        }
    };
    /**
     * Shows the hyperlink dialog
     * @private
     */
    DocumentEditor.prototype.showHyperlinkDialog = function () {
        if (this.hyperlinkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.hyperlinkDialogModule.show();
        }
    };
    /**
     * Shows the bookmark dialog.
     * @private
     */
    DocumentEditor.prototype.showBookmarkDialog = function () {
        if (this.bookmarkDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bookmarkDialogModule.show();
        }
    };
    /**
     * Shows the styles dialog.
     * @private
     */
    DocumentEditor.prototype.showStylesDialog = function () {
        if (this.stylesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.stylesDialogModule.show();
        }
    };
    /**
     * Shows the List dialog
     * @private
     */
    DocumentEditor.prototype.showListDialog = function () {
        if (this.listDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.listDialogModule.showListDialog();
        }
    };
    /**
     * Shows the table properties dialog
     * @private
     */
    DocumentEditor.prototype.showTablePropertiesDialog = function () {
        if (this.tablePropertiesDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.tablePropertiesDialogModule.show();
        }
    };
    /**
     * Shows the borders and shading dialog
     * @private
     */
    DocumentEditor.prototype.showBordersAndShadingDialog = function () {
        if (this.bordersAndShadingDialogModule && !this.isReadOnlyMode && this.viewer) {
            this.bordersAndShadingDialogModule.show();
        }
    };
    //tslint:disable: max-func-body-length
    DocumentEditor.prototype.requiredModules = function () {
        var modules = [];
        if (this.enablePrint) {
            modules.push({
                member: 'Print', args: []
            });
        }
        if (this.enableSfdtExport || this.enableWordExport || this.enableTextExport || this.enableSelection || this.enableEditor) {
            modules.push({
                member: 'SfdtExport', args: [this.documentHelper]
            });
        }
        if (this.enableWordExport) {
            modules.push({
                member: 'WordExport', args: []
            });
        }
        if (this.enableTextExport) {
            modules.push({
                member: 'TextExport', args: []
            });
        }
        if (this.enableSelection || this.enableSearch || this.enableEditor) {
            modules.push({
                member: 'Selection', args: [this]
            });
            if (this.enableContextMenu) {
                modules.push({
                    member: 'ContextMenu', args: [this.documentHelper]
                });
            }
        }
        if (this.enableSearch) {
            modules.push({
                member: 'Search', args: [this]
            });
            if (this.enableOptionsPane) {
                modules.push({
                    member: 'OptionsPane', args: [this.documentHelper]
                });
            }
        }
        if (this.enableEditor) {
            modules.push({
                member: 'Editor', args: [this.documentHelper]
            });
            if (this.enableImageResizer) {
                modules.push({
                    member: 'ImageResizer', args: [this, this.documentHelper]
                });
            }
            if (this.enableEditorHistory) {
                modules.push({
                    member: 'EditorHistory', args: [this]
                });
            }
            if (this.enableHyperlinkDialog) {
                modules.push({
                    member: 'HyperlinkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableDialog) {
                modules.push({
                    member: 'TableDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBookmarkDialog) {
                modules.push({
                    member: 'BookmarkDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOfContentsDialog) {
                modules.push({
                    member: 'TableOfContentsDialog', args: [this.documentHelper]
                });
            }
            if (this.enablePageSetupDialog) {
                modules.push({
                    member: 'PageSetupDialog', args: [this.documentHelper]
                });
            }
            if (this.enableStyleDialog) {
                modules.push({
                    member: 'StylesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'StyleDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'BulletsAndNumberingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableListDialog) {
                modules.push({
                    member: 'ListDialog', args: [this.documentHelper]
                });
            }
            if (this.enableParagraphDialog) {
                modules.push({
                    member: 'ParagraphDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFontDialog) {
                modules.push({
                    member: 'FontDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTablePropertiesDialog) {
                modules.push({
                    member: 'TablePropertiesDialog', args: [this.documentHelper]
                });
                modules.push({
                    member: 'CellOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableBordersAndShadingDialog) {
                modules.push({
                    member: 'BordersAndShadingDialog', args: [this.documentHelper]
                });
            }
            if (this.enableTableOptionsDialog) {
                modules.push({
                    member: 'TableOptionsDialog', args: [this.documentHelper]
                });
            }
            if (this.enableSpellCheck) {
                modules.push({
                    member: 'SpellChecker', args: [this.documentHelper]
                });
                modules.push({
                    member: 'SpellCheckDialog', args: [this.documentHelper]
                });
            }
            if (this.enableFormField) {
                modules.push({
                    member: 'TextFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'DropDownFormFieldDialog', args: [this]
                });
                modules.push({
                    member: 'CheckBoxFormFieldDialog', args: [this]
                });
            }
        }
        return modules;
    };
    // Public Implementation Starts
    /**
     * Opens the given Sfdt text.
     * @param {string} sfdtText.
     */
    DocumentEditor.prototype.open = function (sfdtText) {
        if (!isNullOrUndefined(this.viewer)) {
            this.showComments = false;
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.lists = [];
            this.documentHelper.abstractLists = [];
            this.documentHelper.styles = new WStyles();
            this.documentHelper.cachedPages = [];
            this.showRevisions = false;
            if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                this.documentHelper.triggerElementsOnLoading = true;
                this.documentHelper.triggerSpellCheck = true;
            }
            if (!isNullOrUndefined(sfdtText) && this.viewer) {
                this.documentHelper.onDocumentChanged(this.parser.convertJsonToDocument(sfdtText));
                if (this.editorModule) {
                    this.editorModule.intializeDefaultStyles();
                }
            }
            if (this.isSpellCheck && !this.spellChecker.enableOptimizedSpellCheck) {
                this.documentHelper.triggerElementsOnLoading = false;
                this.documentHelper.triggerSpellCheck = false;
            }
        }
    };
    /**
     * Scrolls view to start of the given page number if exists.
     * @param  {number} pageNumber.
     * @returns void
     */
    DocumentEditor.prototype.scrollToPage = function (pageNumber) {
        if (isNullOrUndefined(this.viewer) || pageNumber < 1 || pageNumber > this.documentHelper.pages.length) {
            return false;
        }
        this.viewer.scrollToPage(pageNumber - 1);
        return true;
    };
    /**
     * Enables all the modules.
     * @returns void
     */
    DocumentEditor.prototype.enableAllModules = function () {
        this.enablePrint = this.enableSfdtExport = this.enableWordExport = this.enableTextExport
            = this.enableSelection = this.enableContextMenu = this.enableSearch = this.enableOptionsPane
                = this.enableEditor = this.enableImageResizer = this.enableEditorHistory
                    = this.enableHyperlinkDialog = this.enableTableDialog = this.enableBookmarkDialog
                        = this.enableTableOfContentsDialog = this.enablePageSetupDialog = this.enableStyleDialog
                            = this.enableListDialog = this.enableParagraphDialog = this.enableFontDialog
                                = this.enableTablePropertiesDialog = this.enableBordersAndShadingDialog
                                    = this.enableTableOptionsDialog = this.enableSpellCheck = this.enableComment = this.enableFormField = true;
        // tslint:disable-next-line:max-line-length
        DocumentEditor_1.Inject(Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog, SpellChecker, SpellCheckDialog, CheckBoxFormFieldDialog, TextFormFieldDialog, DropDownFormFieldDialog);
    };
    /**
     * Resizes the component and its sub elements based on given size or container size.
     * @param width
     * @param height
     */
    DocumentEditor.prototype.resize = function (width, height) {
        if (this.element) {
            if (!isNullOrUndefined(width) && width > 200) {
                this.element.style.width = width + 'px';
            }
            if (!isNullOrUndefined(height) && height > 200) {
                this.element.style.height = height + 'px';
            }
            if (this.viewer) {
                this.documentHelper.updateViewerSize();
            }
        }
    };
    /**
     * Get all form field names.
     */
    DocumentEditor.prototype.getFormFieldNames = function () {
        var formFieldNames = [];
        var formFields = this.documentHelper.formFields;
        for (var i = 0; i < formFields.length; i++) {
            if (formFields[i].formFieldData.name !== '') {
                formFieldNames.push(formFields[i].formFieldData.name);
            }
        }
        return formFieldNames;
    };
    /**
     * Get form field by name
     * @param name - Form field name.
     */
    DocumentEditor.prototype.getFormFieldInfo = function (name) {
        var formFields = this.documentHelper.formFields;
        for (var i = 0; i < formFields.length; i++) {
            if ((formFields[i].formFieldData.name === name) && (formFields[i].formFieldData.name !== '')) {
                return formFields[i].formFieldData.getFormFieldInfo();
            }
        }
        return undefined;
    };
    /**
     * Set form field.
     * @param name - Form field name.
     * @param formFieldInfo - Form Field info
     */
    DocumentEditor.prototype.setFormFieldInfo = function (name, formFieldInfo) {
        var formFields = this.documentHelper.formFields;
        for (var i = 0; i < formFields.length; i++) {
            if ((formFields[i].formFieldData.name === name) && (formFields[i].formFieldData.name !== '')) {
                var currentField = formFields[i];
                if (this.selection) {
                    this.selection.selectFieldInternal(currentField);
                    if (this.editor) {
                        this.editor.setFormField(currentField, formFieldInfo);
                    }
                }
                return;
            }
        }
    };
    /**
     * Reset form field value to default.
     * @param name - specify form field name
     */
    DocumentEditor.prototype.resetFormFields = function (name) {
        var formFields = this.documentHelper.formFields;
        for (var i = 0; i < formFields.length; i++) {
            if (isNullOrUndefined(name) || name === formFields[i].formFieldData.name) {
                if (formFields[i].formFieldData instanceof TextFormField) {
                    this.editor.updateFormField(formFields[i], formFields[i].formFieldData.defaultValue, true);
                }
                else if (formFields[i].formFieldData instanceof CheckBoxFormField) {
                    // tslint:disable-next-line:max-line-length
                    this.editor.toggleCheckBoxFormField(formFields[i], true, formFields[i].formFieldData.defaultValue);
                }
                else if (formFields[i].formFieldData instanceof DropDownFormField) {
                    this.editor.updateFormField(formFields[i], 0, true);
                }
            }
        }
    };
    /**
     * Import form field values.
     * @param - formDate  - { FormFieldData[] }
     */
    DocumentEditor.prototype.importFormData = function (formData) {
        var formField = this.documentHelper.formFields;
        for (var i = 0; i < formData.length; i++) {
            var formFieldData = formData[i];
            var fieldName = formFieldData.fieldName;
            for (var j = 0; j < formField.length; j++) {
                if (formField[j].formFieldData.name === fieldName) {
                    if (formField[j].formFieldData instanceof CheckBoxFormField) {
                        this.editor.toggleCheckBoxFormField(formField[j], true, formFieldData.value);
                    }
                    else if (formField[j].formFieldData instanceof TextFormField) {
                        this.editor.updateFormField(formField[j], formFieldData.value);
                    }
                    else if (formField[j].formFieldData instanceof DropDownFormField) {
                        this.editor.updateFormField(formField[j], formFieldData.value);
                    }
                }
            }
        }
    };
    /**
     * Export form field values.
     * @returns - { FormFieldData[] }
     */
    DocumentEditor.prototype.exportFormData = function () {
        var data = [];
        var formField = this.documentHelper.formFields;
        for (var i = 0; i < formField.length; i++) {
            if (formField[i].formFieldData.name !== '') {
                var formData = { fieldName: '', value: '' };
                formData.fieldName = formField[i].formFieldData.name;
                if (formField[i].formFieldData instanceof CheckBoxFormField) {
                    // tslint:disable-next-line:max-line-length
                    formData.value = formField[i].formFieldData.checked;
                }
                else if (formField[i].formFieldData instanceof TextFormField) {
                    var resultText = '';
                    if (this.documentHelper.isInlineFormFillProtectedMode) {
                        resultText = this.editorModule.getFormFieldText(formField[i]);
                    }
                    else {
                        resultText = formField[i].resultText;
                    }
                    var rex = new RegExp(this.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
                    if (resultText.replace(rex, '') === '') {
                        resultText = '';
                    }
                    formData.value = resultText;
                }
                else if (formField[i].formFieldData instanceof DropDownFormField) {
                    // tslint:disable-next-line:max-line-length
                    formData.value = formField[i].formFieldData.selectedIndex;
                }
                data.push(formData);
            }
        }
        return data;
    };
    /**
     * Updated fields in document.
     * Currently cross reference field only supported.
     */
    DocumentEditor.prototype.updateFields = function () {
        for (var i = 0; i < this.documentHelper.fields.length; i++) {
            var field = this.documentHelper.fields[i];
            var code = this.selection.getFieldCode(field);
            if (code.toLowerCase().trim().indexOf('ref ') === 0) {
                this.selection.updateRefField(field);
            }
        }
    };
    /**
     * Shifts the focus to the document.
     */
    DocumentEditor.prototype.focusIn = function () {
        if (this.viewer) {
            this.documentHelper.updateFocus();
        }
    };
    /**
     * Fits the page based on given fit type.
     * @param  {PageFitType} pageFitType? - Default value of ‘pageFitType’ parameter is 'None'
     * @returns void
     */
    DocumentEditor.prototype.fitPage = function (pageFitType) {
        if (isNullOrUndefined(pageFitType)) {
            pageFitType = 'None';
        }
        if (this.viewer) {
            this.viewer.pageFitType = pageFitType;
        }
    };
    /**
     * Prints the document.
     * @param  {Window} printWindow? - Default value of 'printWindow' parameter is undefined.
     */
    DocumentEditor.prototype.print = function (printWindow) {
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation.');
        }
        if (this.printModule) {
            if (this.layoutType === 'Continuous') {
                this.documentHelper.isWebPrinting = true;
                this.viewer = new PageLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.printModule.print(this.documentHelper, printWindow);
                this.viewer = new WebLayoutViewer(this);
                this.editor.layoutWholeDocument();
                this.documentHelper.isWebPrinting = false;
            }
            else {
                this.printModule.print(this.documentHelper, printWindow);
            }
        }
        else {
            throw new Error('Invalid operation. Print is not enabled.');
        }
    };
    /**
     * Serialize the data to JSON string.
     */
    DocumentEditor.prototype.serialize = function () {
        var json = '';
        if (this.enableSfdtExport && this.sfdtExportModule instanceof SfdtExport) {
            json = this.sfdtExportModule.serialize();
        }
        else {
            throw new Error('Invalid operation. Sfdt export is not enabled.');
        }
        return json;
    };
    /**
     * Saves the document.
     * @param {string} fileName
     * @param {FormatType} formatType
     */
    DocumentEditor.prototype.save = function (fileName, formatType) {
        fileName = fileName || 'Untitled';
        if (isNullOrUndefined(this.documentHelper)) {
            throw new Error('Invalid operation.');
        }
        if (formatType === 'Docx' && this.wordExportModule) {
            if (this.wordExportModule) {
                this.wordExportModule.save(this.documentHelper, fileName);
            }
        }
        else if (formatType === 'Txt' && this.textExportModule) {
            this.textExportModule.save(this.documentHelper, fileName);
        }
        else if (formatType === 'Sfdt' && this.enableSfdtExport && this.sfdtExportModule) {
            var jsonString = this.serialize();
            var blob = new Blob([jsonString], {
                type: 'application/json'
            });
            Save.save(fileName + '.sfdt', blob);
        }
        else {
            throw new Error('Invalid operation. Specified export is not enabled.');
        }
    };
    /**
     * Saves the document as blob.
     * @param {FormatType} formatType
     */
    DocumentEditor.prototype.saveAsBlob = function (formatType) {
        var _this = this;
        if (isNullOrUndefined(this.viewer)) {
            throw new Error('Invalid operation');
        }
        return new Promise(function (resolve, reject) {
            if (formatType === 'Docx' && _this.wordExportModule) {
                resolve(_this.wordExportModule.saveAsBlob(_this.documentHelper));
            }
            else if (formatType === 'Txt' && _this.textExportModule) {
                resolve(_this.textExportModule.saveAsBlob(_this.documentHelper));
            }
            else if (formatType === 'Sfdt' && _this.enableSfdtExport && _this.sfdtExportModule) {
                resolve(_this.sfdtExportModule.saveAsBlob(_this.documentHelper));
            }
        });
    };
    /**
     * Opens a blank document.
     */
    DocumentEditor.prototype.openBlank = function () {
        var section = new BodyWidget();
        section.index = 0;
        section.sectionFormat = new WSectionFormat(section);
        if (this.sectionFormat) {
            this.parser.parseSectionFormat(this.sectionFormat, section.sectionFormat);
        }
        var paragraph = new ParagraphWidget();
        paragraph.index = 0;
        paragraph.paragraphFormat = new WParagraphFormat(paragraph);
        paragraph.characterFormat = new WCharacterFormat(paragraph);
        section.childWidgets.push(paragraph);
        paragraph.containerWidget = section;
        var sections = [];
        sections.push(section);
        // tslint:disable-next-line:max-line-length
        var hfs = this.parser.parseHeaderFooter({ header: {}, footer: {}, evenHeader: {}, evenFooter: {}, firstPageHeader: {}, firstPageFooter: {} }, undefined);
        if (this.viewer) {
            this.clearPreservedCollectionsInViewer();
            this.documentHelper.userCollection.push('Everyone');
            this.documentHelper.cachedPages = [];
            this.documentHelper.setDefaultDocumentFormat();
            this.documentHelper.headersFooters.push(hfs);
            this.documentHelper.onDocumentChanged(sections);
            if (this.editorModule) {
                this.editorModule.intializeDefaultStyles();
                var style = this.documentHelper.styles.findByName('Normal');
                paragraph.paragraphFormat.baseStyle = style;
                paragraph.paragraphFormat.listFormat.baseStyle = style;
            }
        }
    };
    /**
     * Gets the style names based on given style type.
     * @param styleType
     */
    DocumentEditor.prototype.getStyleNames = function (styleType) {
        if (this.viewer) {
            return this.documentHelper.styles.getStyleNames(styleType);
        }
        return [];
    };
    /**
     * Gets the style objects on given style type.
     * @param styleType
     */
    DocumentEditor.prototype.getStyles = function (styleType) {
        if (this.viewer) {
            return this.documentHelper.styles.getStyles(styleType);
        }
        return [];
    };
    /**
     * Gets the bookmarks.
     */
    DocumentEditor.prototype.getBookmarks = function () {
        var bookmarks = [];
        if (this.viewer) {
            bookmarks = this.documentHelper.getBookmarks(true);
        }
        return bookmarks;
    };
    /**
     * Shows the dialog.
     * @param {DialogType} dialogType
     * @returns void
     */
    DocumentEditor.prototype.showDialog = function (dialogType) {
        switch (dialogType) {
            case 'Hyperlink':
                this.showHyperlinkDialog();
                break;
            case 'Table':
                this.showTableDialog();
                break;
            case 'Bookmark':
                this.showBookmarkDialog();
                break;
            case 'TableOfContents':
                this.showTableOfContentsDialog();
                break;
            case 'PageSetup':
                this.showPageSetupDialog();
                break;
            case 'List':
                this.showListDialog();
                break;
            case 'Styles':
                this.showStylesDialog();
                break;
            case 'Style':
                this.showStyleDialog();
                break;
            case 'Paragraph':
                this.showParagraphDialog();
                break;
            case 'Font':
                this.showFontDialog();
                break;
            case 'TableProperties':
                this.showTablePropertiesDialog();
                break;
            case 'BordersAndShading':
                this.showBordersAndShadingDialog();
                break;
            case 'TableOptions':
                this.showTableOptionsDialog();
                break;
        }
    };
    /**
     * Shows the options pane.
     */
    DocumentEditor.prototype.showOptionsPane = function () {
        if (!isNullOrUndefined(this.optionsPaneModule) && !isNullOrUndefined(this.viewer)) {
            this.optionsPaneModule.showHideOptionsPane(true);
        }
    };
    /**
     * Shows the restrict editing pane.
     */
    DocumentEditor.prototype.showRestrictEditingPane = function () {
        if (this.documentHelper && this.documentHelper.restrictEditingPane) {
            this.documentHelper.restrictEditingPane.showHideRestrictPane(true);
        }
    };
    /**
     * Destroys all managed resources used by this object.
     */
    DocumentEditor.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.destroyDependentModules();
        if (!isNullOrUndefined(this.documentHelper)) {
            this.documentHelper.destroy();
        }
        this.viewer = undefined;
        if (!isNullOrUndefined(this.element)) {
            this.element.classList.remove('e-documenteditor');
            this.element.innerHTML = '';
        }
        this.element = undefined;
        this.findResultsList = [];
        this.findResultsList = undefined;
    };
    /* tslint:disable */
    DocumentEditor.prototype.destroyDependentModules = function () {
        if (this.printModule) {
            this.printModule.destroy();
            this.printModule = undefined;
        }
        if (this.sfdtExportModule) {
            this.sfdtExportModule.destroy();
            this.sfdtExportModule = undefined;
        }
        if (this.optionsPaneModule) {
            this.optionsPaneModule.destroy();
            this.optionsPaneModule = undefined;
        }
        if (this.commentReviewPane) {
            this.commentReviewPane.destroy();
            this.commentReviewPane = undefined;
        }
        if (this.trackChangesPane) {
            this.trackChangesPane.destroy();
            this.trackChangesPane = undefined;
        }
        if (!isNullOrUndefined(this.hyperlinkDialogModule)) {
            this.hyperlinkDialogModule.destroy();
            this.hyperlinkDialogModule = undefined;
        }
        if (this.searchModule) {
            this.searchModule.destroy();
            this.searchModule = undefined;
        }
        if (this.contextMenuModule) {
            this.contextMenuModule.destroy();
            this.contextMenuModule = undefined;
        }
        if (this.editorModule) {
            this.editorModule.destroy();
            this.editorModule = undefined;
        }
        if (this.selectionModule) {
            this.selectionModule.destroy();
            this.selectionModule = undefined;
        }
        if (this.editorHistoryModule) {
            this.editorHistoryModule.destroy();
            this.editorHistoryModule = undefined;
        }
        if (!isNullOrUndefined(this.paragraphDialogModule)) {
            this.paragraphDialogModule.destroy();
            this.paragraphDialogModule = undefined;
        }
        if (this.pageSetupDialogModule) {
            this.pageSetupDialogModule.destroy();
            this.pageSetupDialogModule = undefined;
        }
        if (this.fontDialogModule) {
            this.fontDialogModule.destroy();
            this.fontDialogModule = undefined;
        }
        if (this.listDialogModule) {
            this.listDialogModule.destroy();
            this.listDialogModule = undefined;
        }
        if (this.imageResizerModule) {
            this.imageResizerModule.destroy();
            this.imageResizerModule = undefined;
        }
        if (this.tablePropertiesDialogModule) {
            this.tablePropertiesDialogModule.destroy();
            this.tablePropertiesDialogModule = undefined;
        }
        if (this.bordersAndShadingDialogModule) {
            this.bordersAndShadingDialogModule.destroy();
            this.bordersAndShadingDialogModule = undefined;
        }
        if (this.cellOptionsDialogModule) {
            this.cellOptionsDialogModule.destroy();
            this.cellOptionsDialogModule = undefined;
        }
        if (this.tableOptionsDialogModule) {
            this.tableOptionsDialogModule.destroy();
            this.tableOptionsDialogModule = undefined;
        }
        if (this.tableDialogModule) {
            this.tableDialogModule.destroy();
            this.tableDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule = undefined;
        }
        if (this.bookmarkDialogModule) {
            this.bookmarkDialogModule.destroy();
            this.bookmarkDialogModule = undefined;
        }
        if (this.styleDialogModule) {
            this.styleDialogModule.destroy();
            this.styleDialogModule = undefined;
        }
        if (this.textExportModule) {
            this.textExportModule.destroy();
            this.textExportModule = undefined;
        }
        if (this.wordExportModule) {
            this.wordExportModule.destroy();
            this.wordExportModule = undefined;
        }
        if (this.tableOfContentsDialogModule) {
            this.tableOfContentsDialogModule.destroy();
            this.tableOfContentsDialogModule = undefined;
        }
        if (this.spellCheckerModule) {
            this.spellCheckerModule.destroy();
            this.spellCheckerModule = undefined;
        }
    };
    var DocumentEditor_1;
    __decorate([
        Property('KeepSourceFormatting')
    ], DocumentEditor.prototype, "defaultPasteOption", void 0);
    __decorate([
        Property('Pages')
    ], DocumentEditor.prototype, "layoutType", void 0);
    __decorate([
        Property('')
    ], DocumentEditor.prototype, "currentUser", void 0);
    __decorate([
        Property('#FFFF00')
    ], DocumentEditor.prototype, "userColor", void 0);
    __decorate([
        Property(20)
    ], DocumentEditor.prototype, "pageGap", void 0);
    __decorate([
        Property('')
    ], DocumentEditor.prototype, "documentName", void 0);
    __decorate([
        Property('100%')
    ], DocumentEditor.prototype, "width", void 0);
    __decorate([
        Property('200px')
    ], DocumentEditor.prototype, "height", void 0);
    __decorate([
        Property('')
    ], DocumentEditor.prototype, "serviceUrl", void 0);
    __decorate([
        Property(1)
    ], DocumentEditor.prototype, "zoomFactor", void 0);
    __decorate([
        Property(2000)
    ], DocumentEditor.prototype, "zIndex", void 0);
    __decorate([
        Property(true)
    ], DocumentEditor.prototype, "isReadOnly", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enablePrint", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableSelection", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableEditor", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableEditorHistory", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableSfdtExport", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableWordExport", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTextExport", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableOptionsPane", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableContextMenu", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableHyperlinkDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableBookmarkDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTableOfContentsDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableSearch", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableParagraphDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableListDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTablePropertiesDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableBordersAndShadingDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enablePageSetupDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableStyleDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableFontDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTableOptionsDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTableDialog", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableImageResizer", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableSpellCheck", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableComment", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableTrackChanges", void 0);
    __decorate([
        Property(true)
    ], DocumentEditor.prototype, "enableFormField", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "acceptTab", void 0);
    __decorate([
        Property(true)
    ], DocumentEditor.prototype, "useCtrlClickToFollowHyperlink", void 0);
    __decorate([
        Property('#000000')
    ], DocumentEditor.prototype, "pageOutline", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableCursorOnReadOnly", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "enableLocalPaste", void 0);
    __decorate([
        Complex({}, DocumentEditorSettings)
    ], DocumentEditor.prototype, "documentEditorSettings", void 0);
    __decorate([
        Property({ systemClipboard: 'SystemClipboard', spellCheck: 'SpellCheck', restrictEditing: 'RestrictEditing' })
    ], DocumentEditor.prototype, "serverActionSettings", void 0);
    __decorate([
        Property([])
    ], DocumentEditor.prototype, "headers", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "showComments", void 0);
    __decorate([
        Property(false)
    ], DocumentEditor.prototype, "showRevisions", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "documentChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "viewChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "zoomFactorChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "selectionChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "requestNavigate", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "contentChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "keyDown", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "searchResultsChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "created", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "customContextMenuSelect", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "customContextMenuBeforeOpen", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "beforePaneSwitch", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "commentBegin", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "commentEnd", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "commentDelete", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "trackChange", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "beforeFormFieldFill", void 0);
    __decorate([
        Event()
    ], DocumentEditor.prototype, "afterFormFieldFill", void 0);
    DocumentEditor = DocumentEditor_1 = __decorate([
        NotifyPropertyChanges
    ], DocumentEditor);
    return DocumentEditor;
}(Component));
export { DocumentEditor };
/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor.
 */
var ServerActionSettings = /** @class */ (function (_super) {
    __extends(ServerActionSettings, _super);
    function ServerActionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('SystemClipboard')
    ], ServerActionSettings.prototype, "systemClipboard", void 0);
    __decorate([
        Property('SpellCheck')
    ], ServerActionSettings.prototype, "spellCheck", void 0);
    __decorate([
        Property('RestrictEditing')
    ], ServerActionSettings.prototype, "restrictEditing", void 0);
    return ServerActionSettings;
}(ChildProperty));
export { ServerActionSettings };
/**
 * Form field settings.
 */
var FormFieldSettings = /** @class */ (function (_super) {
    __extends(FormFieldSettings, _super);
    function FormFieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('#cfcfcf')
    ], FormFieldSettings.prototype, "shadingColor", void 0);
    __decorate([
        Property(true)
    ], FormFieldSettings.prototype, "applyShading", void 0);
    __decorate([
        Property('#cccccc')
    ], FormFieldSettings.prototype, "selectionColor", void 0);
    __decorate([
        Property('Popup')
    ], FormFieldSettings.prototype, "formFillingMode", void 0);
    __decorate([
        Property([])
    ], FormFieldSettings.prototype, "formattingExceptions", void 0);
    return FormFieldSettings;
}(ChildProperty));
export { FormFieldSettings };
/**
 * The `ServerActionSettings` module is used to provide the server action methods of Document Editor Container.
 */
var ContainerServerActionSettings = /** @class */ (function (_super) {
    __extends(ContainerServerActionSettings, _super);
    function ContainerServerActionSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('Import')
    ], ContainerServerActionSettings.prototype, "import", void 0);
    return ContainerServerActionSettings;
}(ServerActionSettings));
export { ContainerServerActionSettings };
