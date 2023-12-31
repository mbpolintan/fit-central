import { Maps } from '../../index';
import { LayerSettings, MarkerClusterData } from '../index';
/**
 * Marker class
 */
export declare class Marker {
    private maps;
    private isMarkerExplode;
    private trackElements;
    private markerSVGObject;
    private previousExplodeId;
    /**
     * @private
     */
    sameMarkerData: MarkerClusterData[];
    constructor(maps: Maps);
    markerRender(layerElement: Element, layerIndex: number, factor: number, type: string): void;
    /**
     * To find zoom level for individual layers like India, USA.
     */
    private calculateIndividualLayerMarkerZoomLevel;
    /**
     * To calculate center position and factor value dynamically
     */
    calculateZoomCenterPositionAndFactor(layersCollection: LayerSettings[]): void;
    /**
     * To check and trigger marker click event
     */
    markerClick(e: PointerEvent): void;
    /**
     * To check and trigger Cluster click event
     */
    markerClusterClick(e: PointerEvent): void;
    /**
     * To get marker from target id
     */
    private getMarker;
    /**
     * To check and trigger marker move event
     */
    markerMove(e: PointerEvent): void;
    /**
     * To check and trigger cluster move event
     */
    markerClusterMouseMove(e: PointerEvent): void;
    /**
     * Get module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    destroy(maps: Maps): void;
}
