/**
 * Defines the position of ticks, labels, pointers, and ranges.
 * @private
 */
export declare type Position = 
/** Specifies the position of ticks, labels, pointers, and ranges to be placed inside the axis. */
'Inside' | 
/** Specifies the position of ticks, labels, pointers, and ranges to be placed outside the axis. */
'Outside' | 
/** Specifies the position of ticks, labels, pointers, and ranges to be placed on the axis. */
'Cross' | 
/** Specifies the position of ticks, labels, pointers, and ranges to be placed based on the available size in linear gauge. */
'Auto';
/**
 * Defines type of pointer in linear gauge.
 * @private
 */
export declare type Point = 
/** Specifies the pointer as marker type. */
'Marker' | 
/** Specifies the pointer as bar. */
'Bar';
/**
 * Defines theme supported for the linear gauge.
 * @private
 */
export declare type LinearGaugeTheme = 
/** Defines the linear gauge with material theme. */
'Material' | 
/** Defines the linear gauge with bootstrap theme. */
'Bootstrap' | 
/** Defines the linear gauge with highcontrast light theme. */
'HighContrastLight' | 
/** Defines the linear gauge with with fabric theme. */
'Fabric' | 
/** Defines the linear gauge with with material dark theme. */
'MaterialDark' | 
/** Defines the linear gauge with with fabric dark theme. */
'FabricDark' | 
/** Defines the linear gauge with with highcontrast dark theme. */
'HighContrast' | 
/** Defines the linear gauge with with bootstrap dark theme. */
'BootstrapDark' | 
/** Defines the linear gauge with with bootstrap4 theme. */
'Bootstrap4';
/**
 * Defines the type of marker.
 * @private
 */
export declare type MarkerType = 
/**
 * Specifies the marker as triangle.
 */
'Triangle' | 
/**
 * Specifies the marker as inverted triangle.
 */
'InvertedTriangle' | 
/**
 * Specifies the marker as diamond.
 */
'Diamond' | 
/**
 * Specifies the marker as rectangle.
 */
'Rectangle' | 
/**
 * Specifies the marker as circle.
 */
'Circle' | 
/**
 * Specifies the marker as arrow.
 */
'Arrow' | 
/**
 * Specifies the marker as inverted arrow.
 */
'InvertedArrow' | 
/**
 * Specifies the marker as image.
 */
'Image';
/**
 * Defines the place of the pointer.
 * @private
 */
export declare type Placement = 
/**
 * Specifies the pointer to be placed near the linear gauge.
 */
'Near' | 
/**
 * Specifies the pointer to be placed at the center of the linear gauge.
 */
'Center' | 
/**
 * Specifies the pointer to be placed far from the linear gauge.
 */
'Far' | 
/**
 * Specifies the pointer to be placed at default position.
 */
'None';
/**
 * Defines the type of gauge orientation.
 * @private
 */
export declare type Orientation = 
/**
 * Specifies the linear gauge to be placed horizontally.
 */
'Horizontal' | 
/**
 * Specifies the linear gauge to be placed vertically.
 */
'Vertical';
/**
 * Defines the container type.
 */
export declare type ContainerType = 
/** Specifies the container to be drawn as normal rectangle box. */
'Normal' | 
/**
 * Specifies the container to be drawn as the thermometer box.
 */
'Thermometer' | 
/**
 * Specifies the container to be drawn as the rounded rectangle box.
 */
'RoundedRectangle';
/**
 * Defines the export type.
 */
export declare type ExportType = 
/** Specifies the rendered linear gauge to be exported as png format */
'PNG' | 
/** Specifies the rendered linear gauge to be exported as jpeg format */
'JPEG' | 
/** Specifies the rendered linear gauge to be exported as svg format */
'SVG' | 
/** Specifies the rendered linear gauge to be exported as pdf format */
'PDF';
/**
 * Specifies the tooltip position for the range in linear gauge.
 */
export declare type TooltipPosition = 
/** Specifies the tooltip for the range to be placed at the start of the range. */
'Start' | 
/**
 * Specifies the tooltip for the range to be placed at the center of the range.
 */
'Center' | 
/**
 * Specifies the tooltip for the range to be placed at the end of the range.
 */
'End';