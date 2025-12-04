/**
 * GeoJSON Point geometry representing a single coordinate position.
 * Used for specifying exact locations in 2D or 3D space.
 */
export interface Point {
    /** GeoJSON geometry type identifier */
    type: 'Point';
    /** Coordinate array: [longitude, latitude] or [longitude, latitude, altitude] */
    coordinates: [number, number] | [number, number, number];
}

/**
 * GeoJSON Polygon geometry representing a closed area.
 * Used for defining boundaries, zones, and fence regions.
 */
export interface Polygon {
    /** GeoJSON geometry type identifier */
    type: 'Polygon';
    /** Array of linear ring coordinate arrays defining the polygon */
    coordinates: number[][][];
}

/**
 * GeoJSON LineString geometry representing a series of connected points.
 * Used for defining paths, routes, or linear boundaries.
 */
export interface LineString {
    /** GeoJSON geometry type identifier */
    type: 'LineString';
    /** Array of coordinate arrays defining the line */
    coordinates: number[][];
}

/**
 * Union type for all supported GeoJSON geometry types.
 * Represents any geometric shape that can be used in the OMLOX system.
 */
export type Geometry = Point | Polygon | LineString;

/**
 * Locating rule schema from the OMLOX Hub API specification.
 * Defines conditions for location provider selection.
 */
export interface RuleSetInner {
    /** The conditions of the LocatingRule. Supported properties are: accuracy, provider_id, type, source, floor, speed, timestamp_diff. */
    expression?: string;
    /** The priority of the LocatingRule. The higher the value the higher the priority of the rule. */
    priority?: number;
}

/**
 * Standard error response structure for API operations.
 * Provides consistent error information across the system.
 */
export interface ModelError {
    /** Numeric error code for programmatic error handling */
    code?: number;
    /** Human-readable error description */
    message?: string;
}

/**
 * Proximity-based configuration for location services.
 * Defines spatial parameters for proximity detection and accuracy.
 */
export interface Proximity {
    /** X coordinate offset in meters */
    x?: number;
    /** Y coordinate offset in meters */
    y?: number;
    /** Z coordinate offset in meters */
    z?: number;
    /** Detection radius in meters */
    radius?: number;
    /** Accuracy tolerance in meters */
    accuracy?: number;
}

/**
 * Spatial transformation parameters for coordinate system conversion.
 * Used for translating and rotating coordinate systems.
 */
export interface SimpleTransform {
    /** Translation along X-axis in meters */
    x?: number;
    /** Translation along Y-axis in meters */
    y?: number;
    /** Translation along Z-axis in meters */
    z?: number;
    /** Rotation around Z-axis in degrees (heading/bearing) */
    yaw?: number;
    /** Rotation around Y-axis in degrees (elevation angle) */
    pitch?: number;
    /** Rotation around X-axis in degrees (bank/tilt angle) */
    roll?: number;
}
