import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { L10n } from '@syncfusion/ej2-base';
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { ChangeArgs } from '@syncfusion/ej2-buttons';
import { DocumentHelper } from '../viewer';
/**
 * The Page setup dialog is used to modify formatting of selected sections.
 */
export declare class PageSetupDialog {
    private target;
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    /**
     * @private
     */
    topMarginBox: NumericTextBox;
    /**
     * @private
     */
    bottomMarginBox: NumericTextBox;
    /**
     * @private
     */
    leftMarginBox: NumericTextBox;
    /**
     * @private
     */
    rightMarginBox: NumericTextBox;
    /**
     * @private
     */
    widthBox: NumericTextBox;
    /**
     * @private
     */
    heightBox: NumericTextBox;
    /**
     * @private
     */
    headerBox: NumericTextBox;
    /**
     * @private
     */
    footerBox: NumericTextBox;
    private paperSize;
    private checkBox1;
    private checkBox2;
    private landscape;
    private portrait;
    private isPortrait;
    private marginTab;
    private paperTab;
    private layoutTab;
    /**
     * @private
     */
    constructor(documentHelper: DocumentHelper);
    private getModuleName;
    /**
     * @private
     */
    initPageSetupDialog(locale: L10n, isRtl?: boolean): void;
    /**
     * @private
     */
    initMarginProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void;
    /**
     * @private
     */
    initPaperSizeProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void;
    /**
     * @private
     */
    initLayoutProperties(element: HTMLDivElement, locale: L10n, isRtl?: boolean): void;
    /**
     * @private
     */
    show(): void;
    /**
     * @private
     */
    loadPageSetupDialog: () => void;
    private setPageSize;
    /**
     * @private
     */
    closePageSetupDialog: () => void;
    /**
     * @private
     */
    onCancelButtonClick: () => void;
    /**
     * @private
     */
    keyUpInsertPageSettings: (event: KeyboardEvent) => void;
    /**
     * @private
     */
    applyPageSetupProperties: () => void;
    /**
     * @private
     */
    changeByPaperSize: (event: ChangeEventArgs) => void;
    /**
     * @private
     */
    onPortrait: (event: ChangeArgs) => void;
    /**
     * @private
     */
    onLandscape: (event: ChangeArgs) => void;
    /**
     * @private
     */
    unWireEventsAndBindings: () => void;
    /**
     * @private
     */
    destroy(): void;
}
