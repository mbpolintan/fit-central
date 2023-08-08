/**
 * Enum toolbarItem for toolbar settings
 */
export declare type ToolbarItem = 'OpenOption' | 'PageNavigationTool' | 'MagnificationTool' | 'PanTool' | 'SelectionTool' | 'SearchOption' | 'PrintOption' | 'DownloadOption' | 'UndoRedoTool' | 'AnnotationEditTool' | 'CommentTool' | 'SubmitForm';
/**
 * Enum AnnotationToolbarItem for annotation toolbar settings
 */
export declare type AnnotationToolbarItem = 'HighlightTool' | 'UnderlineTool' | 'StrikethroughTool' | 'ShapeTool' | 'CalibrateTool' | 'ColorEditTool' | 'StrokeColorEditTool' | 'ThicknessEditTool' | 'OpacityEditTool' | 'AnnotationDeleteTool' | 'StampAnnotationTool' | 'HandWrittenSignatureTool' | 'InkAnnotationTool' | 'FreeTextAnnotationTool' | 'FontFamilyAnnotationTool' | 'FontSizeAnnotationTool' | 'FontStylesAnnotationTool' | 'FontAlignAnnotationTool' | 'FontColorAnnotationTool' | 'CommentPanelTool';
/**
 * Enum LinkTarget for hyperlink navigation
 */
export declare type LinkTarget = 'CurrentTab' | 'NewTab' | 'NewWindow';
/**
 * Enum InteractionMode for interaction mode
 */
export declare type InteractionMode = 'TextSelection' | 'Pan';
/**
 * Enum AnnotationType for specifying Annotations
 */
export declare type AnnotationType = 'None' | 'Highlight' | 'Underline' | 'Strikethrough' | 'Line' | 'Arrow' | 'Rectangle' | 'Circle' | 'Polygon' | 'Distance' | 'Perimeter' | 'Area' | 'Radius' | 'Volume' | 'FreeText' | 'HandWrittenSignature' | 'Ink' | 'Stamp' | 'Image' | 'StickyNotes';
/**
 * Enum LineHeadStyle for line and arrow annotation
 */
export declare type LineHeadStyle = 'None' | 'Closed' | 'Open' | 'Square' | 'Round' | 'Diamond';
/**
 * Enum unit for calibration annotation
 */
export declare type CalibrationUnit = 'pt' | 'in' | 'mm' | 'cm' | 'p' | 'ft' | 'ft_in' | 'm';
/**
 * Enum unit for ContextMenu Actions
 */
export declare type ContextMenuAction = 'None' | 'MouseUp' | 'RightClick';
/**
 * Enum unit for FormFieldType
 */
export declare type FormFieldType = 'Textbox' | 'Password' | 'CheckBox' | 'RadioButton' | 'DropDown' | 'ListBox' | 'SignatureField';
/**
 * Enum for font styles
 */
export declare enum FontStyle {
    None = 0,
    Bold = 1,
    Italic = 2,
    Underline = 4,
    Strikethrough = 8
}
/**
 * enum for context menu items
 */
export declare enum ContextMenuItem {
    Copy = 0,
    Highlight = 1,
    Cut = 2,
    Underline = 4,
    Paste = 8,
    Delete = 16,
    ScaleRatio = 32,
    Strikethrough = 64,
    Properties = 128,
    Comment = 256
}
/**
 * Enum unit for text alignment
 */
export declare type TextAlignment = 'Left' | 'Right' | 'Center' | 'Justify';
/**
 * Enum for annotation selector shapes
 */
export declare type AnnotationResizerShape = 'Square' | 'Circle';
/**
 * Enum for annotation resizer location
 */
export declare enum AnnotationResizerLocation {
    Corners = 1,
    Edges = 2
}
/**
 * set the ZoomMode on rendering
 */
export declare type ZoomMode = 'Default' | 'FitToWidth' | 'FitToPage';
/**
 * Enum for Print Mode
 */
export declare type PrintMode = 'Default' | 'NewWindow';
/**
 * Enum for cursor type
 */
export declare enum CursorType {
    auto = "auto",
    crossHair = "crosshair",
    e_resize = "e-resize",
    ew_resize = "ew-resize",
    grab = "grab",
    grabbing = "grabbing",
    move = "move",
    n_resize = "n-resize",
    ne_resize = "ne-resize",
    ns_resize = "ns-resize",
    nw_resize = "nw-resize",
    pointer = "pointer",
    s_resize = "s-resize",
    se_resize = "se-resize",
    sw_resize = "sw-resize",
    text = "text",
    w_resize = "w-resize"
}
/**
 * Enum type for Dynamic Stamp Items
 */
export declare enum DynamicStampItem {
    Revised = 1,
    Reviewed = 2,
    Received = 4,
    Approved = 8,
    Confidential = 16,
    NotApproved = 32
}
/**
 * Enum type for Sign Stamp Items
 */
export declare enum SignStampItem {
    Witness = 1,
    InitialHere = 2,
    SignHere = 4,
    Accepted = 8,
    Rejected = 16
}
/**
 * Enum type for Standard Business Stamp Items
 */
export declare enum StandardBusinessStampItem {
    Approved = 1,
    NotApproved = 2,
    Draft = 4,
    Final = 8,
    Completed = 16,
    Confidential = 32,
    ForPublicRelease = 64,
    NotForPublicRelease = 128,
    ForComment = 256,
    Void = 512,
    PreliminaryResults = 1024,
    InformationOnly = 2048
}
/**
 * Enum type for allowed interactions for locked annotations
 */
export declare enum AllowedInteraction {
    Select = "Select",
    Move = "Move",
    Resize = "Resize",
    Delete = "Delete",
    None = "None",
    PropertyChange = "PropertyChange"
}
