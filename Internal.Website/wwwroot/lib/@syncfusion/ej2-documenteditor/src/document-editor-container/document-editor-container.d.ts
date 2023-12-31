import { Component, INotifyPropertyChanged, ModuleDeclaration, L10n } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Toolbar } from './tool-bar/tool-bar';
import { DocumentEditorContainerModel } from './document-editor-container-model';
import { DocumentEditor } from '../document-editor/document-editor';
import { TextProperties } from './properties-pane/text-properties-pane';
import { HeaderFooterProperties } from './properties-pane/header-footer-pane';
import { ImageProperties } from './properties-pane/image-properties-pane';
import { TocProperties } from './properties-pane/table-of-content-pane';
import { TableProperties } from './properties-pane/table-properties-pane';
import { StatusBar } from './properties-pane/status-bar';
import { ContainerContentChangeEventArgs, ContainerSelectionChangeEventArgs, ContainerDocumentChangeEventArgs, CustomContentMenuEventArgs, BeforeOpenCloseCustomContentMenuEventArgs, BeforePaneSwitchEventArgs, LayoutType, CommentDeleteEventArgs } from '../document-editor/base';
import { ContainerServerActionSettingsModel, DocumentEditorSettingsModel } from '../document-editor/document-editor-model';
import { CharacterFormatProperties, ParagraphFormatProperties, SectionFormatProperties } from '../document-editor/implementation';
import { ToolbarItem } from '../document-editor/base/types';
import { CustomToolbarItemModel, TrackChangeEventArgs } from '../document-editor/base/events-helper';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
/**
 * Document Editor container component.
 */
export declare class DocumentEditorContainer extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Show or hide properties pane.
     * @default true
     */
    showPropertiesPane: boolean;
    /**
     * Enable or disable toolbar in document editor container.
     * @default true
     */
    enableToolbar: boolean;
    /**
     * Restrict editing operation.
     * @default false
     */
    restrictEditing: boolean;
    /**
     * Enable or disable spell checker in document editor container.
     * @default false
     */
    enableSpellCheck: boolean;
    /**
     * Enable or disable track changes in document editor container.
     * @default false
     */
    enableTrackChanges: boolean;
    /**
     * Layout Type
     * @default Pages
     */
    layoutType: LayoutType;
    /**
     * Current User
     * @default ''
     */
    currentUser: string;
    /**
     * User Selection Highlight Color
     * @default '#FFFF00'
     */
    userColor: string;
    /**
     * Enable local paste
     * @default false
     */
    enableLocalPaste: boolean;
    /**
     * Sfdt service URL.
     * @default ''
     */
    serviceUrl: string;
    /**
     * Specifies the z-order for rendering that determines whether the dialog is displayed in front or behind of another component.
     * @default 2000
     * @aspType int
     */
    zIndex: number;
    /**
     * Enable rendering with strict Content Security policy.
     */
    enableCsp: boolean;
    /**
     * Gets or set a value indicating whether comment is enabled or not
     * @default true
     */
    enableComment: boolean;
    /**
     * Defines the width of the DocumentEditorContainer component
     * @default '100%'
     */
    width: string;
    /**
     * Defines the height of the DocumentEditorContainer component
     * @default '320px'
     */
    height: string;
    /**
     * Triggers when the component is created
     * @event
     * @blazorproperty 'Created'
     */
    created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     * @event
     * @blazorproperty 'Destroyed'
     */
    destroyed: EmitType<Object>;
    /**
     * Triggers whenever the content changes in the document editor container.
     * @event
     * @blazorproperty 'ContentChanged'
     */
    contentChange: EmitType<ContainerContentChangeEventArgs>;
    /**
     * Triggers whenever selection changes in the document editor container.
     * @event
     * @blazorproperty 'SelectionChanged'
     */
    selectionChange: EmitType<ContainerSelectionChangeEventArgs>;
    /**
     * Triggers whenever document changes in the document editor container.
     * @event
     * @blazorproperty 'DocumentChanged'
     */
    documentChange: EmitType<ContainerDocumentChangeEventArgs>;
    /**
     * Triggers when toolbar item is clicked.
     * @event
     * @blazorproperty 'OnToolbarClick'
     * @blazorType Syncfusion.Blazor.Navigations.ClickEventArgs
     */
    toolbarClick: EmitType<ClickEventArgs>;
    /**
     * Triggers while selecting the custom context-menu option.
     * @event
     * @blazorproperty 'ContextMenuItemSelected'
     */
    customContextMenuSelect: EmitType<CustomContentMenuEventArgs>;
    /**
     * Triggers before opening the custom context-menu option.
     * @event
     * @blazorproperty 'OnContextMenuOpen'
     */
    customContextMenuBeforeOpen: EmitType<BeforeOpenCloseCustomContentMenuEventArgs>;
    /**
     * Trigger before switching panes in DocumentEditor.
     * @event
     * @blazorproperty 'BeforePaneSwitch'
     */
    beforePaneSwitch: EmitType<BeforePaneSwitchEventArgs>;
    /**
     * Triggers on deleting a comment.
     * @blazorproperty 'OnCommentDelete'
     * @event
     */
    commentDelete: EmitType<CommentDeleteEventArgs>;
    /**
     * Triggers Keyboard shortcut of TrackChanges.
     * @blazorproperty 'OnEnableTrackChanges'
     * @event
     */
    trackChange: EmitType<TrackChangeEventArgs>;
    /**
     * Document editor container's toolbar module
     * @private
     */
    toolbarModule: Toolbar;
    /**
     * @private
     */
    localObj: L10n;
    /**
     * Document Editor instance
     */
    private documentEditorInternal;
    /**
     * @private
     */
    toolbarContainer: HTMLElement;
    /**
     * @private
     */
    editorContainer: HTMLElement;
    /**
     * @private
     */
    propertiesPaneContainer: HTMLElement;
    /**
     * @private
     */
    statusBarElement: HTMLElement;
    /**
     * Text Properties
     * @private
     */
    textProperties: TextProperties;
    /**
     * Header footer Properties
     * @private
     */
    headerFooterProperties: HeaderFooterProperties;
    /**
     * Image Properties Pane
     * @private
     */
    imageProperties: ImageProperties;
    /**
     * @private
     */
    tocProperties: TocProperties;
    /**
     * @private
     */
    tableProperties: TableProperties;
    /**
     * @private
     */
    statusBar: StatusBar;
    /**
     * @private
     */
    containerTarget: HTMLElement;
    /**
     * @private
     */
    previousContext: string;
    /**
     * @private
     */
    characterFormat: CharacterFormatProperties;
    /**
     * @private
     */
    paragraphFormat: ParagraphFormatProperties;
    /**
     * @private
     */
    sectionFormat: SectionFormatProperties;
    /**
     * @private
     */
    showHeaderProperties: boolean;
    /**
     * Defines the settings for DocumentEditor customization.
     * @default {}
     */
    documentEditorSettings: DocumentEditorSettingsModel;
    /**
     * Defines the settings of the DocumentEditorContainer service.
     */
    serverActionSettings: ContainerServerActionSettingsModel;
    /**
     * Defines toolbar items for DocumentEditorContainer.
     * @default ['New','Open','Separator','Undo','Redo','Separator','Image','Table','Hyperlink','Bookmark','TableOfContents','Separator','Header','Footer','PageSetup','PageNumber','Break','Separator','Find','Separator','Comments','TrackChanges','LocalClipboard','RestrictEditing','Separator','FormFields']
     */
    toolbarItems: (CustomToolbarItemModel | ToolbarItem)[];
    /**
     * Add custom headers to XMLHttpRequest.
     * @default []
     */
    headers: object[];
    /**
     * Gets DocumentEditor instance.
     * @aspType DocumentEditor
     * @blazorType DocumentEditor
     */
    readonly documentEditor: DocumentEditor;
    /**
     * Gets toolbar instance.
     * @blazorType Toolbar
     */
    readonly toolbar: Toolbar;
    /**
     * Initialize the constructor of DocumentEditorContainer
     */
    constructor(options?: DocumentEditorContainerModel, element?: string | HTMLElement);
    /**
     * default locale
     * @private
     */
    defaultLocale: Object;
    /**
     * @private
     */
    getModuleName(): string;
    /**
     * @private
     */
    onPropertyChanged(newModel: DocumentEditorContainerModel, oldModel: DocumentEditorContainerModel): void;
    /**
     * @private
     */
    protected preRender(): void;
    /**
     * @private
     */
    protected render(): void;
    private setFormat;
    private setserverActionSettings;
    private customizeDocumentEditorSettings;
    /**
     * @private
     */
    getPersistData(): string;
    protected requiredModules(): ModuleDeclaration[];
    private initContainerElement;
    private createToolbarContainer;
    private initializeDocumentEditor;
    private onCommentBegin;
    private onCommentEnd;
    private onCommentDelete;
    private onTrackChange;
    private onBeforePaneSwitch;
    /**
     * @private
     */
    showHidePropertiesPane(show: boolean): void;
    /**
     * @private
     */
    onContentChange(): void;
    /**
     * @private
     */
    onDocumentChange(): void;
    /**
     * @private
     */
    onSelectionChange(): void;
    /**
     * @private
     */
    private onZoomFactorChange;
    /**
     * @private
     */
    private onRequestNavigate;
    /**
     * @private
     */
    private onViewChange;
    /**
     * @private
     */
    private onCustomContextMenuSelect;
    /**
     * @private
     */
    private onCustomContextMenuBeforeOpen;
    /**
     * @private
     */
    showPropertiesPaneOnSelection(): void;
    /**
     * @private
     * @param property
     */
    showProperties(property: string): void;
    /**
     * Set the default character format for document editor container
     * @param characterFormat
     */
    setDefaultCharacterFormat(characterFormat: CharacterFormatProperties): void;
    /**
     * Set the default paragraph format for document editor container
     * @param paragraphFormat
     */
    setDefaultParagraphFormat(paragraphFormat: ParagraphFormatProperties): void;
    /**
     * Set the default section format for document editor container
     * @param sectionFormat
     */
    setDefaultSectionFormat(sectionFormat: SectionFormatProperties): void;
    /**
     * Destroys all managed resources used by this object.
     */
    destroy(): void;
}
