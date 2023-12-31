import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';
/**
 * HeaderIndentCellRenderer class which responsible for building header indent cell.
 * @hidden
 */
export declare class HeaderIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {
    element: HTMLElement;
    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    render(cell: Cell<Column>, data: Object): Element;
}
