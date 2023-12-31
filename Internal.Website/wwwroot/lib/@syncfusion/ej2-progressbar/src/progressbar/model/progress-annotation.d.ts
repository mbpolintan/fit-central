import { ProgressBar } from '../progressbar';
import { ProgressAnnotationSettings } from './progress-base';
import { AnnotationBase } from './annotation';
/**
 * Class for progress annotation
 */
export declare class ProgressAnnotation extends AnnotationBase {
    private progress;
    private annotations;
    parentElement: HTMLElement;
    private animation;
    /**
     * Constructor for ProgressBar annotation
     * @private
     */
    constructor(control: ProgressBar, annotations: ProgressAnnotationSettings[]);
    /**
     * Method to render the annotation for ProgressBar
     * @param element
     * @private
     */
    renderAnnotations(element: Element): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    destroy(control: ProgressBar): void;
}
