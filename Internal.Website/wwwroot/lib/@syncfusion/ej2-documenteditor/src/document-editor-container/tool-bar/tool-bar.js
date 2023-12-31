import { createElement, isNullOrUndefined, EventHandler, classList } from '@syncfusion/ej2-base';
import { Toolbar as EJ2Toolbar } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { showSpinner, hideSpinner, DialogUtility } from '@syncfusion/ej2-popups';
import { XmlHttpRequestHandler } from '../../document-editor/base/ajax-helper';
var TOOLBAR_ID = '_toolbar';
var NEW_ID = '_new';
var OPEN_ID = '_open';
var UNDO_ID = '_undo';
var REDO_ID = '_redo';
var INSERT_IMAGE_ID = '_image';
var INSERT_IMAGE_LOCAL_ID = '_image_local';
var INSERT_IMAGE_ONLINE_ID = '_image_url';
var INSERT_TABLE_ID = '_table';
var INSERT_LINK_ID = '_link';
var BOOKMARK_ID = '_bookmark';
var COMMENT_ID = '_comment';
var TRACK_ID = '_track';
var TABLE_OF_CONTENT_ID = '_toc';
var HEADER_ID = '_header';
var FOOTER_ID = '_footer';
var PAGE_SET_UP_ID = '_page_setup';
var PAGE_NUMBER_ID = '_page_number';
var BREAK_ID = '_break';
var FIND_ID = '_find';
var CLIPBOARD_ID = '_use_local_clipboard';
var RESTRICT_EDITING_ID = '_restrict_edit';
var PAGE_BREAK = '_page_break';
var SECTION_BREAK = '_section_break';
var READ_ONLY = '_read_only';
var PROTECTIONS = '_protections';
var FORM_FIELDS_ID = '_form_fields';
var UPDATE_FIELDS_ID = '_update_fields';
var TEXT_FORM = '_text_form';
var CHECKBOX = '_checkbox';
var DROPDOWN = '_dropdown';
/**
 * Toolbar Module
 */
var Toolbar = /** @class */ (function () {
    /**
     * @private
     */
    function Toolbar(container) {
        /**
         * @private
         */
        this.isCommentEditing = false;
        this.container = container;
        this.importHandler = new XmlHttpRequestHandler();
    }
    Object.defineProperty(Toolbar.prototype, "documentEditor", {
        /**
         * @private
         */
        get: function () {
            return this.container.documentEditor;
        },
        enumerable: true,
        configurable: true
    });
    Toolbar.prototype.getModuleName = function () {
        return 'toolbar';
    };
    /**
     * Enables or disables the specified Toolbar item.
     * @param  {number} itemIndex - Index of the toolbar items that need to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the toolbar item should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @blazorArgsType itemIndex|int,isEnable|Boolean
     * @returns void.
     */
    Toolbar.prototype.enableItems = function (itemIndex, isEnable) {
        this.toolbar.enableItems(itemIndex, isEnable);
    };
    /**
     * @private
     */
    Toolbar.prototype.initToolBar = function (items) {
        this.toolbarItems = items;
        this.renderToolBar();
        this.wireEvent();
    };
    // tslint:disable-next-line:max-func-body-length
    Toolbar.prototype.renderToolBar = function () {
        if (isNullOrUndefined(this.container)) {
            return;
        }
        var toolbarContainer = this.container.toolbarContainer;
        var toolbarWrapper = createElement('div', { className: 'e-de-tlbr-wrapper' });
        var toolbarTarget = createElement('div', { className: 'e-de-toolbar', styles: 'height:100%' });
        this.initToolbarItems();
        toolbarWrapper.appendChild(toolbarTarget);
        toolbarContainer.appendChild(toolbarWrapper);
        // Show hide pane button initialization 
        var propertiesPaneDiv = createElement('div', { className: 'e-de-ctnr-properties-pane-btn' });
        var buttonElement = createElement('button', { attrs: { type: 'button' } });
        propertiesPaneDiv.appendChild(buttonElement);
        var cssClassName = 'e-tbar-btn e-tbtn-txt e-control e-btn e-de-showhide-btn';
        var iconCss = 'e-icons e-de-ctnr-showhide';
        if (this.container.enableRtl) {
            cssClassName += '-rtl';
            iconCss = 'e-icons e-de-ctnr-showhide e-de-flip';
        }
        this.propertiesPaneButton = new Button({
            cssClass: cssClassName,
            iconCss: iconCss
        });
        this.propertiesPaneButton.appendTo(buttonElement);
        EventHandler.add(buttonElement, 'click', this.showHidePropertiesPane, this);
        toolbarContainer.appendChild(propertiesPaneDiv);
        this.toolbar.appendTo(toolbarTarget);
        this.initToolbarDropdown(toolbarTarget);
    };
    Toolbar.prototype.initToolbarDropdown = function (toolbarTarget) {
        var locale = this.container.localObj;
        var id = this.container.element.id + TOOLBAR_ID;
        if (this.toolbarItems.indexOf('Image') >= 0) {
            var imageButton = toolbarTarget.getElementsByClassName('e-de-image-splitbutton')[0].firstChild;
            var items = {
                items: [
                    {
                        text: locale.getConstant('Upload from computer'), iconCss: 'e-icons e-de-ctnr-upload',
                        id: id + INSERT_IMAGE_LOCAL_ID
                    }
                ],
                //,{ text: locale.getConstant('By URL'), iconCss: 'e-icons e-de-ctnr-link', id: id + INSERT_IMAGE_ONLINE_ID }],
                cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                iconCss: 'e-icons e-de-ctnr-image',
                select: this.onDropDownButtonSelect.bind(this),
            };
            this.imgDropDwn = new DropDownButton(items, imageButton);
        }
        if (this.toolbarItems.indexOf('Break') >= 0) {
            var breakButton = toolbarTarget.getElementsByClassName('e-de-break-splitbutton')[0].firstChild;
            var items = {
                items: [
                    { text: locale.getConstant('Page Break'), iconCss: 'e-icons e-de-ctnr-page-break', id: id + PAGE_BREAK },
                    { text: locale.getConstant('Section Break'), iconCss: 'e-icons e-de-ctnr-section-break', id: id + SECTION_BREAK }
                ],
                cssClass: 'e-caret-hide',
                iconCss: 'e-icons e-de-ctnr-break',
                select: this.onDropDownButtonSelect.bind(this),
            };
            this.breakDropDwn = new DropDownButton(items, breakButton);
        }
        this.filePicker = createElement('input', {
            attrs: { type: 'file', accept: '.doc,.docx,.rtf,.txt,.htm,.html,.sfdt' }, className: 'e-de-ctnr-file-picker'
        });
        this.imagePicker = createElement('input', {
            attrs: { type: 'file', accept: '.jpg,.jpeg,.png,.bmp' }, className: 'e-de-ctnr-file-picker'
        });
        if (this.toolbarItems.indexOf('LocalClipboard') >= 0) {
            this.toggleButton(id + CLIPBOARD_ID, this.container.enableLocalPaste);
        }
        if (this.toolbarItems.indexOf('TrackChanges') >= 0) {
            this.toggleButton(id + TRACK_ID, this.container.enableTrackChanges);
        }
        if (this.toolbarItems.indexOf('RestrictEditing') >= 0) {
            this.toggleButton(id + RESTRICT_EDITING_ID, this.container.restrictEditing);
            // tslint:disable-next-line:max-line-length
            var restrictEditing = toolbarTarget.getElementsByClassName('e-de-lock-dropdownbutton')[0].firstChild;
            var items = {
                items: [
                    { text: locale.getConstant('Read only'), id: id + READ_ONLY },
                    { text: locale.getConstant('Protections'), id: id + PROTECTIONS }
                ],
                cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                select: this.onDropDownButtonSelect.bind(this)
            };
            this.restrictDropDwn = new DropDownButton(items, restrictEditing);
        }
        if (this.toolbarItems.indexOf('FormFields') >= 0) {
            var breakButton = toolbarTarget.getElementsByClassName('e-de-formfields')[0].firstChild;
            var items = {
                items: [
                    { text: locale.getConstant('Text Form'), iconCss: 'e-icons e-de-textform', id: id + TEXT_FORM },
                    { text: locale.getConstant('Check Box'), iconCss: 'e-icons e-de-checkbox-form', id: id + CHECKBOX },
                    { text: locale.getConstant('DropDown'), iconCss: 'e-icons e-de-dropdownform', id: id + DROPDOWN }
                ],
                cssClass: 'e-de-toolbar-btn-first e-caret-hide',
                select: this.onDropDownButtonSelect.bind(this),
            };
            this.formFieldDropDown = new DropDownButton(items, breakButton);
        }
    };
    Toolbar.prototype.showHidePropertiesPane = function () {
        if (this.container.propertiesPaneContainer.style.display === 'none') {
            this.container.showPropertiesPane = true;
            this.container.trigger('beforePaneSwitch', { type: 'PropertiesPane' });
        }
        else if (this.container.previousContext.indexOf('Header') >= 0
            || this.container.previousContext.indexOf('Footer') >= 0) {
            this.container.showHeaderProperties = !this.container.showHeaderProperties;
        }
        else {
            this.container.showPropertiesPane = false;
        }
        this.enableDisablePropertyPaneButton(this.container.showPropertiesPane);
        this.container.showPropertiesPaneOnSelection();
        this.documentEditor.focusIn();
    };
    Toolbar.prototype.onWrapText = function (text) {
        var content = '';
        var index = text.lastIndexOf(' ');
        content = text.slice(0, index);
        text.slice(index);
        content += '<div class="e-de-text-wrap">' + text.slice(index) + '</div>';
        return content;
    };
    Toolbar.prototype.wireEvent = function () {
        this.propertiesPaneButton.on('click', this.togglePropertiesPane.bind(this));
        EventHandler.add(this.filePicker, 'change', this.onFileChange, this);
        EventHandler.add(this.imagePicker, 'change', this.onImageChange, this);
    };
    Toolbar.prototype.initToolbarItems = function () {
        this.toolbar = new EJ2Toolbar({
            enableRtl: this.container.enableRtl,
            clicked: this.clickHandler.bind(this),
            items: this.getToolbarItems()
        });
    };
    /**
     * @private
     */
    Toolbar.prototype.reInitToolbarItems = function (items) {
        var _this = this;
        this.toolbarItems = items;
        var toolbarTarget = this.container.toolbarContainer;
        this.toolbar.items = this.getToolbarItems();
        /* tslint:disable:align */
        this.toolbarTimer = setTimeout(function () {
            if (_this.toolbarTimer) {
                clearTimeout(_this.toolbarTimer);
            }
            _this.initToolbarDropdown(toolbarTarget);
            if (items.indexOf('Open') >= 0) {
                EventHandler.add(_this.filePicker, 'change', _this.onFileChange, _this);
            }
            if (items.indexOf('Image') >= 0) {
                EventHandler.add(_this.imagePicker, 'change', _this.onImageChange, _this);
            }
        }, 200);
    };
    /* tslint:disable:no-any */
    // tslint:disable-next-line:max-func-body-length
    Toolbar.prototype.getToolbarItems = function () {
        var locale = this.container.localObj;
        var id = this.container.element.id + TOOLBAR_ID;
        var toolbarItems = [];
        var className;
        var tItem = this.toolbarItems;
        for (var i = 0; i < this.toolbarItems.length; i++) {
            if (i === 0) {
                className = 'e-de-toolbar-btn-start';
            }
            else if ((tItem[i + 1] === 'Separator') && (tItem[i - 1] === 'Separator')) {
                className = 'e-de-toolbar-btn';
            }
            else if (tItem[i + 1] === 'Separator') {
                className = 'e-de-toolbar-btn-last';
            }
            else if (tItem[i - 1] === 'Separator') {
                className = 'e-de-toolbar-btn-first';
            }
            else if (i === (this.toolbarItems.length - 1)) {
                className = 'e-de-toolbar-btn-end';
            }
            else {
                className = 'e-de-toolbar-btn-middle';
            }
            switch (tItem[i]) {
                case 'Separator':
                    toolbarItems.push({
                        type: 'Separator', cssClass: 'e-de-separator'
                    });
                    break;
                case 'New':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-new', tooltipText: locale.getConstant('Create a new document'),
                        id: id + NEW_ID, text: locale.getConstant('New'), cssClass: className
                    });
                    break;
                case 'Open':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-open', tooltipText: locale.getConstant('Open a document'), id: id + OPEN_ID,
                        text: locale.getConstant('Open'), cssClass: className
                    });
                    break;
                case 'Undo':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-undo', tooltipText: locale.getConstant('Undo Tooltip'),
                        id: id + UNDO_ID, text: locale.getConstant('Undo'), cssClass: className
                    });
                    break;
                case 'Redo':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-redo', tooltipText: locale.getConstant('Redo Tooltip'),
                        id: id + REDO_ID, text: locale.getConstant('Redo'), cssClass: className
                    });
                    break;
                case 'Comments':
                    toolbarItems.push({
                        prefixIcon: 'e-de-cnt-cmt-add',
                        tooltipText: locale.getConstant('Show comments'),
                        id: id + COMMENT_ID, text: locale.getConstant('Comments'), cssClass: className
                    });
                    break;
                case 'TrackChanges':
                    toolbarItems.push({
                        prefixIcon: 'e-de-cnt-track',
                        tooltipText: locale.getConstant('Track Changes'),
                        id: id + TRACK_ID, text: this.onWrapText(locale.getConstant('TrackChanges')), cssClass: className
                    });
                    break;
                case 'Image':
                    toolbarItems.push({
                        tooltipText: locale.getConstant('Insert inline picture from a file.'), id: id + INSERT_IMAGE_ID,
                        text: locale.getConstant('Image'), cssClass: className + ' e-de-image-splitbutton e-de-image-focus'
                    });
                    break;
                case 'Table':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-table', tooltipText: locale.getConstant('Insert a table into the document'),
                        id: id + INSERT_TABLE_ID, text: locale.getConstant('Table'), cssClass: className
                    });
                    break;
                case 'Hyperlink':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-link',
                        tooltipText: locale.getConstant('Create Hyperlink'),
                        id: id + INSERT_LINK_ID, text: locale.getConstant('Link'), cssClass: className
                    });
                    break;
                case 'Bookmark':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-bookmark',
                        tooltipText: locale.getConstant('Insert a bookmark in a specific place in this document'),
                        id: id + BOOKMARK_ID, text: locale.getConstant('Bookmark'), cssClass: className
                    });
                    break;
                case 'TableOfContents':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-tableofcontent',
                        tooltipText: locale.getConstant('Provide an overview of your document by adding a table of contents'),
                        id: id + TABLE_OF_CONTENT_ID, text: this.onWrapText(locale.getConstant('Table of Contents')),
                        cssClass: className
                    });
                    break;
                case 'Header':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-header', tooltipText: locale.getConstant('Add or edit the header'),
                        id: id + HEADER_ID, text: locale.getConstant('Header'), cssClass: className
                    });
                    break;
                case 'Footer':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-footer', tooltipText: locale.getConstant('Add or edit the footer'),
                        id: id + FOOTER_ID, text: locale.getConstant('Footer'), cssClass: className
                    });
                    break;
                case 'PageSetup':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-pagesetup', tooltipText: locale.getConstant('Open the page setup dialog'),
                        id: id + PAGE_SET_UP_ID, text: this.onWrapText(locale.getConstant('Page Setup')),
                        cssClass: className
                    });
                    break;
                case 'PageNumber':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-pagenumber', tooltipText: locale.getConstant('Add page numbers'),
                        id: id + PAGE_NUMBER_ID, text: this.onWrapText(locale.getConstant('Page Number')),
                        cssClass: className
                    });
                    break;
                case 'Break':
                    toolbarItems.push({
                        tooltipText: locale.getConstant('Break'), text: locale.getConstant('Break'), id: BREAK_ID,
                        cssClass: className + ' e-de-break-splitbutton'
                    });
                    break;
                case 'Find':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-find', tooltipText: locale.getConstant('Find Text'),
                        id: id + FIND_ID, text: locale.getConstant('Find'), cssClass: className
                    });
                    break;
                case 'LocalClipboard':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-paste',
                        tooltipText: locale.getConstant('Toggle between the internal clipboard and system clipboard'),
                        id: id + CLIPBOARD_ID, text: this.onWrapText(locale.getConstant('Local Clipboard')),
                        cssClass: className
                    });
                    break;
                case 'RestrictEditing':
                    toolbarItems.push({
                        prefixIcon: 'e-de-ctnr-lock', tooltipText: locale.getConstant('Restrict editing'), id: id + RESTRICT_EDITING_ID,
                        text: this.onWrapText(locale.getConstant('Restrict Editing')), cssClass: className + ' e-de-lock-dropdownbutton'
                    });
                    break;
                case 'FormFields':
                    toolbarItems.push({
                        prefixIcon: 'e-de-formfield', tooltipText: locale.getConstant('Form Fields'), id: id + FORM_FIELDS_ID,
                        text: this.onWrapText(locale.getConstant('Form Fields')), cssClass: className + ' e-de-formfields'
                    });
                    break;
                case 'UpdateFields':
                    toolbarItems.push({
                        prefixIcon: 'e-de-update-field', tooltipText: locale.getConstant('Update cross reference fields'),
                        id: id + UPDATE_FIELDS_ID, text: this.onWrapText(locale.getConstant('Update Fields')),
                        cssClass: className + ' e-de-formfields'
                    });
                    break;
                default:
                    //Here we need to process the items
                    toolbarItems.push(tItem[i]);
                    break;
            }
        }
        return toolbarItems;
    };
    Toolbar.prototype.clickHandler = function (args) {
        var id = this.container.element.id + TOOLBAR_ID;
        switch (args.item.id) {
            case id + NEW_ID:
                this.container.documentEditor.openBlank();
                break;
            case id + OPEN_ID:
                this.filePicker.value = '';
                this.filePicker.click();
                break;
            case id + UNDO_ID:
                this.container.documentEditor.editorHistory.undo();
                break;
            case id + REDO_ID:
                this.container.documentEditor.editorHistory.redo();
                break;
            case id + INSERT_TABLE_ID:
                this.container.documentEditor.showDialog('Table');
                break;
            case id + INSERT_LINK_ID:
                this.container.documentEditor.showDialog('Hyperlink');
                break;
            case id + BOOKMARK_ID:
                this.container.documentEditor.showDialog('Bookmark');
                break;
            case id + COMMENT_ID:
                this.documentEditor.editor.insertComment('');
                break;
            case id + TRACK_ID:
                this.toggleTrackChangesInternal(args.item.id);
                break;
            case id + HEADER_ID:
                this.container.documentEditor.selection.goToHeader();
                this.container.statusBar.toggleWebLayout();
                break;
            case id + TABLE_OF_CONTENT_ID:
                this.onToc();
                break;
            case id + FOOTER_ID:
                this.container.documentEditor.selection.goToFooter();
                this.container.statusBar.toggleWebLayout();
                break;
            case id + PAGE_SET_UP_ID:
                this.container.documentEditor.showDialog('PageSetup');
                break;
            case id + PAGE_NUMBER_ID:
                this.container.documentEditor.editor.insertPageNumber();
                break;
            case id + FIND_ID:
                this.container.documentEditor.showOptionsPane();
                break;
            case id + CLIPBOARD_ID:
                this.toggleLocalPaste(args.item.id);
                break;
            case id + UPDATE_FIELDS_ID:
                this.documentEditor.updateFields();
                break;
            default:
                this.container.trigger('toolbarClick', args);
                break;
        }
        if (args.item.id !== id + FIND_ID && args.item.id !== id + INSERT_IMAGE_ID) {
            this.container.documentEditor.focusIn();
        }
    };
    Toolbar.prototype.toggleLocalPaste = function (id) {
        this.container.enableLocalPaste = !this.container.enableLocalPaste;
        this.toggleButton(id, this.container.enableLocalPaste);
    };
    Toolbar.prototype.toggleEditing = function (id) {
        this.container.restrictEditing = !this.container.restrictEditing;
        this.container.showPropertiesPane = !this.container.restrictEditing;
        // this.toggleButton(id, this.container.restrictEditing);
    };
    Toolbar.prototype.toggleButton = function (id, toggle) {
        var element = document.getElementById(id);
        if (toggle) {
            classList(element, ['e-btn-toggle'], []);
        }
        else {
            classList(element, [], ['e-btn-toggle']);
        }
    };
    Toolbar.prototype.toggleTrackChangesInternal = function (id, enable) {
        if (!isNullOrUndefined(enable)) {
            this.container.enableTrackChanges = !enable;
        }
        this.container.enableTrackChanges = !this.container.enableTrackChanges;
        this.container.documentEditor.showRevisions = this.container.enableTrackChanges;
        this.toggleButton(id, this.container.enableTrackChanges);
    };
    Toolbar.prototype.togglePropertiesPane = function () {
        this.container.showPropertiesPane = !this.container.showPropertiesPane;
    };
    Toolbar.prototype.onDropDownButtonSelect = function (args) {
        var _this = this;
        var parentId = this.container.element.id + TOOLBAR_ID;
        var id = args.item.id;
        if (id === parentId + PAGE_BREAK) {
            this.container.documentEditor.editorModule.insertPageBreak();
        }
        else if (id === parentId + SECTION_BREAK) {
            this.container.documentEditor.editorModule.insertSectionBreak();
        }
        else if (id === parentId + INSERT_IMAGE_LOCAL_ID) {
            this.imagePicker.value = '';
            this.imagePicker.click();
        }
        else if (id === parentId + INSERT_IMAGE_ONLINE_ID) {
            // Need to implement image dialog;
        }
        else if (id === parentId + READ_ONLY) {
            this.container.restrictEditing = !this.container.restrictEditing;
            this.container.showPropertiesPane = !this.container.restrictEditing;
        }
        else if (id === parentId + PROTECTIONS) {
            this.documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(true);
        }
        else if (id === parentId + CHECKBOX) {
            this.documentEditor.editor.insertFormField('CheckBox');
        }
        else if (id === parentId + DROPDOWN) {
            this.documentEditor.editor.insertFormField('DropDown');
        }
        else if (id === parentId + TEXT_FORM) {
            this.documentEditor.editor.insertFormField('Text');
        }
        setTimeout(function () { _this.documentEditor.focusIn(); }, 30);
    };
    Toolbar.prototype.onFileChange = function () {
        var _this = this;
        var file = this.filePicker.files[0];
        if (file) {
            if (file.name.substr(file.name.lastIndexOf('.')) === '.sfdt') {
                var fileReader_1 = new FileReader();
                fileReader_1.onload = function () {
                    _this.container.documentEditor.open(fileReader_1.result);
                };
                fileReader_1.readAsText(file);
            }
            else {
                this.convertToSfdt(file);
            }
            this.container.documentEditor.documentName = file.name.substr(0, file.name.lastIndexOf('.'));
        }
    };
    Toolbar.prototype.convertToSfdt = function (file) {
        showSpinner(this.container.containerTarget);
        this.importHandler.url = this.container.serviceUrl + this.container.serverActionSettings.import;
        this.importHandler.onSuccess = this.successHandler.bind(this);
        this.importHandler.onFailure = this.failureHandler.bind(this);
        this.importHandler.onError = this.failureHandler.bind(this);
        this.importHandler.customHeaders = this.container.headers;
        var formData = new FormData();
        formData.append('files', file);
        this.importHandler.send(formData);
    };
    /* tslint:disable:no-any */
    Toolbar.prototype.failureHandler = function (args) {
        if (args.name === 'onError') {
            // tslint:disable-next-line:max-line-length
            DialogUtility.alert({ content: this.container.localObj.getConstant('Error in establishing connection with web server'), closeOnEscape: true, showCloseIcon: true, position: { X: 'Center', Y: 'Center' } });
        }
        else {
            alert('Failed to load the file');
            this.documentEditor.fireServiceFailure(args);
        }
        hideSpinner(this.container.containerTarget);
    };
    Toolbar.prototype.successHandler = function (result) {
        this.container.documentEditor.open(result.data);
        hideSpinner(this.container.containerTarget);
    };
    /* tslint:enable:no-any */
    Toolbar.prototype.onImageChange = function () {
        var _this = this;
        var file = this.imagePicker.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function () {
            _this.insertImage(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    };
    Toolbar.prototype.insertImage = function (data) {
        var image = document.createElement('img');
        var container = this.container;
        image.addEventListener('load', function () {
            container.documentEditor.editor.insertImage(data, this.width, this.height);
        });
        image.src = data;
    };
    /**
     * @private
     */
    Toolbar.prototype.enableDisableInsertComment = function (enable) {
        this.isCommentEditing = !enable;
        var id = this.container.element.id + TOOLBAR_ID;
        var commentId = id + COMMENT_ID;
        var element = document.getElementById(commentId);
        if (!this.container.enableComment && element) {
            this.toolbar.removeItems(element.parentElement);
        }
        else if (element) {
            if (!isNullOrUndefined(this.documentEditor) && (this.documentEditor.isReadOnly ||
                this.documentEditor.documentHelper.isDocumentProtected)) {
                enable = false;
            }
            this.toolbar.enableItems(element.parentElement, enable);
        }
    };
    /**
     * @private
     *
     */
    Toolbar.prototype.toggleTrackChanges = function (enable) {
        var trackId = this.container.element.id + TOOLBAR_ID + TRACK_ID;
        var element = document.getElementById(trackId);
        if (element) {
            this.toggleTrackChangesInternal(trackId, enable);
        }
    };
    // /**
    //  * @private
    //  */
    // public enableDisableTrackChanges(enable: boolean): void {
    //     let id: string = this.container.element.id + TOOLBAR_ID + TRACK_ID;
    //     if (!isNullOrUndefined(this.documentEditor) && (this.documentEditor.isReadOnly ||
    //         this.documentEditor.documentHelper.isDocumentProtected)) {
    //         enable = false;
    //     }
    //     this.toggleTrackChanges(id, enable);
    // }
    /**
     * @private
     */
    Toolbar.prototype.enableDisableToolBarItem = function (enable, isProtectedContent) {
        var id = this.container.element.id + TOOLBAR_ID;
        for (var _i = 0, _a = this.toolbar.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var itemId = item.id;
            if (itemId !== id + NEW_ID && itemId !== id + OPEN_ID && itemId !== id + FIND_ID &&
                itemId !== id + CLIPBOARD_ID && itemId !== id + RESTRICT_EDITING_ID && itemId !== id + UPDATE_FIELDS_ID
                && item.type !== 'Separator') {
                if (enable && this.isCommentEditing && itemId === id + COMMENT_ID) {
                    continue;
                }
                if (itemId !== id + UNDO_ID && itemId !== id + REDO_ID && itemId !== id + INSERT_TABLE_ID &&
                    itemId !== id + INSERT_LINK_ID && itemId !== id + BOOKMARK_ID && itemId !== id + COMMENT_ID &&
                    itemId !== id + HEADER_ID && itemId !== id + TABLE_OF_CONTENT_ID && itemId !== id + FOOTER_ID &&
                    itemId !== id + PAGE_SET_UP_ID && itemId !== id + PAGE_NUMBER_ID && itemId !== id + INSERT_IMAGE_ID
                    && itemId !== id + FORM_FIELDS_ID && itemId !== BREAK_ID && itemId !== id + TRACK_ID) {
                    continue;
                }
                var element = document.getElementById(item.id);
                this.toolbar.enableItems(element.parentElement, enable);
            }
        }
        if (!isProtectedContent) {
            classList(this.propertiesPaneButton.element.parentElement, !enable ? ['e-de-overlay'] : [], !enable ? [] : ['e-de-overlay']);
        }
        if (enable || (this.documentEditor.documentHelper.isDocumentProtected &&
            this.documentEditor.documentHelper.protectionType === 'FormFieldsOnly')) {
            this.enableDisableUndoRedo();
        }
    };
    /**
     * @private
     */
    Toolbar.prototype.enableDisableUndoRedo = function () {
        var id = this.container.element.id + TOOLBAR_ID;
        if (this.toolbarItems.indexOf('Undo') >= 0) {
            // We can optimize this condition check to single bool validation instead of array collection.
            // tslint:disable-next-line:max-line-length
            this.toolbar.enableItems(document.getElementById(id + UNDO_ID).parentElement, this.container.documentEditor.editorHistory.canUndo());
        }
        if (this.toolbarItems.indexOf('Redo') >= 0) {
            // We can optimize this condition check to single bool validation instead of array collection.
            // tslint:disable-next-line:max-line-length
            this.toolbar.enableItems(document.getElementById(id + REDO_ID).parentElement, this.container.documentEditor.editorHistory.canRedo());
        }
    };
    Toolbar.prototype.onToc = function () {
        if (this.container.previousContext === 'TableOfContents' && this.container.propertiesPaneContainer.style.display === 'none') {
            this.container.showPropertiesPane = false;
            this.documentEditor.focusIn();
            return;
        }
        if (this.container.headerFooterProperties.element.style.display === 'block') {
            this.documentEditor.selection.closeHeaderFooter();
        }
        this.enableDisablePropertyPaneButton(false);
        this.container.showProperties('toc');
    };
    /**
     * @private
     */
    Toolbar.prototype.enableDisablePropertyPaneButton = function (isShow) {
        if (isShow) {
            classList(this.propertiesPaneButton.element.firstChild, ['e-pane-enabled'], ['e-pane-disabled']);
        }
        else {
            classList(this.propertiesPaneButton.element.firstChild, ['e-pane-disabled'], ['e-pane-enabled']);
        }
    };
    /**
     * @private
     */
    Toolbar.prototype.destroy = function () {
        if (this.restrictDropDwn) {
            this.restrictDropDwn.destroy();
            this.restrictDropDwn = undefined;
        }
        if (this.imgDropDwn) {
            this.imgDropDwn.destroy();
            this.imgDropDwn = undefined;
        }
        if (this.breakDropDwn) {
            this.breakDropDwn.destroy();
            this.breakDropDwn = undefined;
        }
        if (this.formFieldDropDown) {
            this.formFieldDropDown.destroy();
            this.formFieldDropDown = undefined;
        }
        if (this.toolbar) {
            var toolbarElement = this.toolbar.element;
            this.toolbar.destroy();
            this.toolbar = undefined;
            toolbarElement.parentElement.removeChild(toolbarElement);
        }
        if (this.container.toolbarContainer) {
            this.container.containerTarget.removeChild(this.container.toolbarContainer);
            this.container.toolbarContainer = undefined;
        }
        if (this.container.toolbarModule) {
            this.container.toolbarModule = undefined;
        }
        this.container = undefined;
    };
    return Toolbar;
}());
export { Toolbar };
