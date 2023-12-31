import { Dictionary } from '../../base/dictionary';
import { FindOption } from '../../base/types';
import { TextPosition } from '../selection/selection-helper';
import { DocumentEditor } from '../../document-editor';
import { LineWidget, ElementBox } from '../viewer/page';
import { LayoutViewer, DocumentHelper } from '../index';
import { SearchWidgetInfo } from './text-search';
import { TextSearch } from '../search/text-search';
import { TextSearchResult } from '../search/text-search-result';
import { TextSearchResults } from '../search/text-search-results';
import { SearchResults } from './search-results';
import { ParagraphWidget } from '../viewer/page';
/**
 * Search module
 */
export declare class Search {
    private owner;
    /**
     * @private
     */
    textSearch: TextSearch;
    /**
     * @private
     */
    textSearchResults: TextSearchResults;
    /**
     * @private
     */
    searchResultsInternal: SearchResults;
    /**
     * @private
     */
    searchHighlighters: Dictionary<LineWidget, SearchWidgetInfo[]>;
    private isHandledOddPageHeader;
    private isHandledEvenPageHeader;
    private isHandledOddPageFooter;
    private isHandledEvenPageFooter;
    /**
     * @private
     */
    isRepalceTracking: boolean;
    /**
     * @private
     */
    readonly viewer: LayoutViewer;
    /**
     * Gets the search results object.
     * @aspType SearchResults
     * @blazorType SearchResults
     */
    readonly searchResults: SearchResults;
    /**
     * @private
     */
    constructor(owner: DocumentEditor);
    readonly documentHelper: DocumentHelper;
    /**
     * Get the module name.
     */
    private getModuleName;
    /**
     * Finds the immediate occurrence of specified text from cursor position in the document.
     * @param  {string} text
     * @param  {FindOption} findOption? - Default value of ‘findOptions’ parameter is 'None'.
     * @private
     */
    find(text: string, findOptions?: FindOption): void;
    /**
     * Finds all occurrence of specified text in the document.
     * @param  {string} text
     * @param  {FindOption} findOption? - Default value of ‘findOptions’ parameter is 'None'.
     */
    findAll(text: string, findOptions?: FindOption): void;
    /**
     * Replace the searched string with specified string
     * @param  {string} replaceText
     * @param  {TextSearchResult} result
     * @param  {TextSearchResults} results
     * @private
     */
    replace(replaceText: string, result: TextSearchResult, results: TextSearchResults): number;
    /**
     * Find the textToFind string in current document and replace the specified string.
     * @param  {string} textToFind
     * @param  {string} textToReplace
     * @param  {FindOption} findOptions? - Default value of ‘findOptions’ parameter is FindOption.None.
     * @private
     */
    replaceInternal(textToReplace: string, findOptions?: FindOption): void;
    /**
     * Replace all the searched string with specified string
     * @param  {string} replaceText
     * @param  {TextSearchResults} results
     * @private
     */
    replaceAll(replaceText: string, results: TextSearchResults): number;
    /**
     * Find the textToFind string in current document and replace the specified string.
     * @param  {string} textToFind
     * @param  {string} textToReplace
     * @param  {FindOption} findOptions? - Default value of ‘findOptions’ parameter is FindOption.None.
     * @private
     */
    replaceAllInternal(textToReplace: string, findOptions?: FindOption): void;
    /**
     * @private
     */
    navigate(textSearchResult: TextSearchResult): void;
    /**
     * @private
     */
    highlight(textSearchResults: TextSearchResults): void;
    /**
     * @private
     */
    highlightResult(result: TextSearchResult): void;
    /**
     * Highlight search result
     * @private
     */
    highlightSearchResult(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void;
    /**
     * @private
     */
    createHighlightBorder(lineWidget: LineWidget, width: number, left: number, top: number): void;
    /**
     * Adds search highlight border.
     * @private
     */
    addSearchHighlightBorder(lineWidget: LineWidget): SearchWidgetInfo;
    /**
     * @private
     */
    highlightSearchResultParaWidget(widget: ParagraphWidget, startIndex: number, endLine: LineWidget, endElement: ElementBox, endIndex: number): void;
    /**
     * @private
     */
    addSearchResultItems(result: string): void;
    /**
     * @private
     */
    addFindResultView(textSearchResults: TextSearchResults): void;
    /**
     * @private
     */
    addFindResultViewForSearch(result: TextSearchResult): void;
    /**
     * Clears search highlight.
     * @private
     */
    clearSearchHighlight(): void;
    /**
     * @private
     */
    destroy(): void;
}
