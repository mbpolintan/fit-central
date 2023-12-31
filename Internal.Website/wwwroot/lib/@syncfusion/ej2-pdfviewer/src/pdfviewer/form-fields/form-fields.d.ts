import { PdfViewer } from '../index';
import { PdfViewerBase } from '../index';
/**
 * The `FormFields` module is to render formfields in the PDF document.
 * @hidden
 */
export declare class FormFields {
    private pdfViewer;
    private pdfViewerBase;
    private maxTabIndex;
    private minTabIndex;
    private maintainTabIndex;
    private maintanMinTabindex;
    private isSignatureField;
    /**
     * @private
     */
    readOnlyCollection: any;
    private currentTarget;
    /**
     * @private
     */
    nonFillableFields: any;
    /**
     * @private
     */
    constructor(viewer: PdfViewer, base: PdfViewerBase);
    /**
     * @private
     */
    renderFormFields(pageIndex: number): void;
    /**
     * @private
     */
    formFieldCollections(): void;
    updateFormFieldValues(formFields: any): void;
    /**
     * @private
     */
    retriveFieldName(currentData: any): string;
    private retriveCurrentValue;
    /**
     * @private
     */
    downloadFormFieldsData(): any;
    private focusFormFields;
    private blurFormFields;
    private updateFormFields;
    /**
     * @private
     */
    drawSignature(): void;
    private updateFormFieldsValue;
    private changeFormFields;
    private checkSignatureWidth;
    /**
     * @private
     */
    updateDataInSession(target: any, signaturePath?: any, signatureBounds?: any): void;
    private applyCommonProperties;
    /**
     * @private
     */
    createFormFields(currentData: any, pageIndex: number, index?: number, printContainer?: any): void;
    private createTextBoxField;
    private checkIsReadonly;
    /**
     * @private
     */
    formFieldsReadOnly(isReadonly: boolean): void;
    private makeformFieldsReadonly;
    private applyTabIndex;
    private checkIsRequiredField;
    private applyDefaultColor;
    private addAlignmentPropety;
    private addBorderStylePropety;
    private createRadioBoxField;
    private createDropDownField;
    private createListBoxField;
    private createSignatureField;
    private addSignaturePath;
    private applyPosition;
    /**
     * @private
     */
    setStyleToTextDiv(textDiv: HTMLElement, left: number, top: number, fontHeight: number, width: number, height: number, isPrint: boolean): void;
    private renderExistingAnnnot;
    /**
     * @private
     */
    ConvertPointToPixel(number: any): any;
    /**
     * @private
     */
    destroy(): void;
    /**
     * @private
     */
    getModuleName(): string;
}
