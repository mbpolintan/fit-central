import { HyperlinkType } from './types';
import { DocumentEditor } from '../document-editor';
import { DocumentEditorContainer } from '../../document-editor-container';
/**
 * ServiceFailureArgs
 */
export interface ServiceFailureArgs {
    /** Defines the status. */
    status: string;
    /** Defines the status text. */
    statusText: string;
    /** Defines the response url. */
    url: string;
}
/**
 * This event arguments provides the necessary information about form field fill event.
 */
export interface FormFieldFillEventArgs {
    /**
     * Specifies form field name.
     */
    fieldName?: string;
    /**
     * Specifies form field value.
     */
    value?: string | boolean | number;
    /**
     * Specifies whether form fill action is canceled or not.
     */
    isCanceled?: boolean;
}
/**
 * Specified form field data
 */
export interface FormFieldData {
    /**
     * Specifies form field name.
     */
    fieldName: string;
    /**
     * Specifies form field data.
     */
    value: string | boolean | number;
}
/**
 * This event arguments provides the necessary information about documentChange event.
 */
export interface DocumentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this documentChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about viewChange event.
 */
export interface ViewChangeEventArgs {
    /**
     * Specifies the page number that starts in the view port.
     */
    startPage: number;
    /**
     * Specifies the page number that ends in the view port.
     */
    endPage: number;
    /**
     * Specifies the source DocumentEditor instance which triggers this viewChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about zoomFactorChange event.
 */
export interface ZoomFactorChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this zoomFactorChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about selectionChange event.
 */
export interface SelectionChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this selectionChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about requestNavigate event.
 */
export interface RequestNavigateEventArgs {
    /**
     * Specifies the navigation link.
     */
    navigationLink: string;
    /**
     * Specifies the link type.
     */
    linkType: HyperlinkType;
    /**
     * Specifies the local reference if any.
     */
    localReference: string;
    /**
     * Specifies whether the event is handled or not.
     */
    isHandled: boolean;
    /**
     * Specifies the source DocumentEditor instance which triggers this requestNavigate event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about contentChange event.
 */
export interface ContentChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this contentChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about key down event.
 */
export interface DocumentEditorKeyDownEventArgs {
    /**
     * Key down event argument
     */
    event: KeyboardEvent;
    /**
     * Specifies whether the event is handled or not
     */
    isHandled: boolean;
    /**
     * Specifies the source DocumentEditor instance which triggers this key down event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about searchResultsChange event.
 */
export interface SearchResultsChangeEventArgs {
    /**
     * Specifies the source DocumentEditor instance which triggers this searchResultsChange event.

     */
    source: DocumentEditor;
}
/**
 * This event arguments provides the necessary information about customContentMenu event.
 */
export interface CustomContentMenuEventArgs {
    /**
     * Specifies the id of selected custom context menu item.
     */
    id: string;
}
/**
 * This event arguments provides the necessary information about BeforeOpenCloseCustomContentMenu event.
 */
export interface BeforeOpenCloseCustomContentMenuEventArgs {
    /**
     * Specifies the array of added custom context menu item ids.
     */
    ids: string[];
}
/**
 * This event args provides the necessary information about comment delete.
 */
export interface CommentDeleteEventArgs {
    /**
     * Comment author.
     */
    author: string;
    /**
     * Specifies whether the event is canceled or not.
     */
    cancel: boolean;
}
/**
 * This event args provides the necessary information about track change.
 */
export interface TrackChangeEventArgs {
    /**
     * Specifies whether the track changes enabled or not.
     */
    isTrackChangesEnabled: boolean;
}
/**
 * This event arguments provides the necessary information about onBeforePane switch.
 */
export interface BeforePaneSwitchEventArgs {
    /**
     * Specifies current pane type.
     */
    type: string;
}
/**
 * This event arguments provides the necessary information about DocumentEditorContainer's contentChange event.
 */
export interface ContainerContentChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this contentChange event.

     */
    source: DocumentEditorContainer;
}
/**
 * This event arguments provides the necessary information about DocumentEditorContainer's selectionChange event.
 */
export interface ContainerSelectionChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this selectionChange event.

     */
    source: DocumentEditorContainer;
}
/**
 * This event arguments provides the necessary information about DocumentEditorContainer's documentChange event.
 */
export interface ContainerDocumentChangeEventArgs {
    /**
     * Specifies the source DocumentEditorContainer instance which triggers this documentChange event.

     */
    source: DocumentEditorContainer;
}
/**
 * Defines customized toolbar items.
 */
export interface CustomToolbarItemModel {
    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     * @default ""
     */
    prefixIcon?: string;
    /**
     * Specifies the text to be displayed on the Toolbar button.
     * @default ""
     */
    tooltipText?: string;
    /**
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     * @default ""
     */
    id?: string;
    /**
     * Specifies the text to be displayed on the Toolbar button.
     * @default ""
     */
    text?: string;
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     * @default ""
     */
    cssClass?: string;
}
