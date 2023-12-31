import { LineStyle } from '../../base/types';
import { WCharacterFormat } from '../format/character-format';
/**
 * @private
 */
export declare class HtmlExport {
    private document;
    private characterFormat;
    private paragraphFormat;
    private prevListLevel;
    private isOrdered;
    /**
     * @private
     */
    fieldCheck: number;
    /**
     * @private
     */
    writeHtml(document: any): string;
    /**
     * @private
     */
    serializeSection(section: any): string;
    /**
     * @private
     */
    serializeParagraph(paragraph: any): string;
    private closeList;
    private getListLevel;
    private getHtmlList;
    /**
     * @private
     */
    serializeInlines(paragraph: any, blockStyle: string): string;
    /**
     * @private
     */
    serializeSpan(spanText: string, characterFormat: WCharacterFormat): string;
    /**
     * @private
     */
    getStyleName(style: string): string;
    /**
     * @private
     */
    serializeImageContainer(image: any): string;
    /**
     * @private
     */
    serializeCell(cell: any): string;
    /**
     * @private
     */
    serializeTable(table: any): string;
    /**
     * @private
     */
    serializeRow(row: any): string;
    /**
     * @private
     */
    serializeParagraphStyle(paragraph: any, className: string, isList: boolean): string;
    /**
     * @private
     */
    serializeInlineStyle(characterFormat: WCharacterFormat, className: string): string;
    /**
     * @private
     */
    serializeTableBorderStyle(borders: any): string;
    /**
     * @private
     */
    serializeCellBordersStyle(borders: any): string;
    /**
     * @private
     */
    serializeBorderStyle(border: any, borderPosition: string): string;
    /**
     * @private
     */
    convertBorderLineStyle(lineStyle: LineStyle): string;
    /**
     * @private
     */
    serializeCharacterFormat(characterFormat: any): string;
    /**
     * @private
     */
    serializeParagraphFormat(paragraphFormat: any, isList: boolean): string;
    /**
     * @private
     */
    createAttributesTag(tagValue: string, localProperties: string[]): string;
    /**
     * @private
     */
    createTag(tagValue: string): string;
    /**
     * @private
     */
    endTag(tagValue: string): string;
    /**
     * @private
     */
    createTableStartTag(table: any): string;
    /**
     * @private
     */
    createTableEndTag(): string;
    /**
     * @private
     */
    createRowStartTag(row: any): string;
    /**
     * @private
     */
    createRowEndTag(row: any): string;
    /**
     * @private
     */
    decodeHtmlNames(text: string): string;
}
