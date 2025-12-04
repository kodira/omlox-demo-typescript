import { Polygon, Point } from './common';

/**
 * Zone schema from the OMLOX Hub API specification.
 * Zones represent spatial reference systems for location positioning.
 */
export interface Zone {
    /** Must be a unique identifier (i.e. a UUID). When creating a zone, a unique id will be generated if it is not provided. */
    id: string;
    /** The positioning system type. */
    type: 'uwb' | 'wifi' | 'rfid' | 'ibeacon';
    /** A foreign identifier related to the zone (e.g. a RFID scanner or a Wi-Fi map hierarchy). */
    foreign_id?: string;
    /** The zone's position in EPSG:4326 (GPS) coordinates. For a complete configuration the position MUST be present for proximity based zones (RFID, iBeacon) and benchmark based zones, and is OPTIONAL for all other zone types. For proximity based positioning systems like RFID or iBeacon, the position represents the coordinates where the positioning system is located (e.g. the RFID scanner). For the benchmark based zone the position represents the global benchmark point. For all others, the position MAY be used as a hint for the location of the infrastructure. */
    position?: Point;
    /** For proximity based systems. Describes the zone as a circular region with a given radius in meters around the position. The radius MUST be ignored for non-proximity based position providers. */
    radius?: number;
    /** An array containing a mapping between geographic coordinates (longitude, latitude) in WGS84 and relative coordinates (x,y) provided by the positioning system of the zone. For a complete configuration this property MUST be present for non-proximity based positioning systems (UWB, Wi-Fi, etc). This property MUST NOT be present for proximity based positioning systems, as these refer to the fixed position. */
    ground_control_points?: number[][];
    /** Set to true to use an incomplete zone, which has to be further configured later. By default a complete configuration is required. */
    incomplete_configuration?: boolean;
    /** The timestamp identifying when the EPSG:4326 coordinates for the zone definition were recorded. Using this value for location data processing is OPTIONAL. This value MAY be used for advanced coordinate projection. For example, to reflect tectonic drift of WGS84 location data which is fixed at the North American plate. */
    measurement_timestamp?: string;
    /** Site identifier */
    site?: string;
    /** Building identifier */
    building?: string;
    /** The canonical representation of the floor level, where floor 0 is the ground floor. If no floor is set or floor is null, 0 is used. */
    floor?: number;
    /** Name of the zone. */
    name?: string;
    /** An optional description providing additional information for the zone. */
    description?: string;
    /** An address describing the location of the zone. */
    address?: string;
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
    /** The reference height of the zone in WGS84 coordinates. */
    wgs84_height?: number;
}

/**
 * Request structure for subscribing to WebSocket events.
 * Allows clients to subscribe to real-time updates for specific entities or events.
 */
export interface WebSocketSubscriptionRequest {
    /** Optional unique identifier for the subscription */
    id?: string;
    /** Type of events to subscribe to */
    type: WebSocketSubscriptionType;
    /** Subscribe to events for a specific trackable (optional filter) */
    trackable_id?: string;
    /** Subscribe to events for a specific fence (optional filter) */
    fence_id?: string;
    /** Subscribe to events for a specific zone (optional filter) */
    zone_id?: string;
    /** Additional subscription parameters */
    properties?: Record<string, any>;
}

/**
 * Types of WebSocket events that can be subscribed to.
 */
export enum WebSocketSubscriptionType {
    /** Real-time trackable position and motion updates */
    TRACKABLE_MOTION = 'trackable_motion',
    /** Fence enter/exit events */
    FENCE_EVENT = 'fence_event',
    /** Collision start/end events between trackables */
    COLLISION_EVENT = 'collision_event',
}

/**
 * Response received after attempting to create a WebSocket subscription.
 */
export interface WebSocketSubscriptionResponse {
    /** Unique identifier for the subscription */
    id: string;
    /** Status of the subscription request */
    status: WebSocketSubscriptionStatus;
    /** Optional error or informational message */
    message?: string;
}

/**
 * Status values for WebSocket subscription responses.
 */
export enum WebSocketSubscriptionStatus {
    /** Subscription was created successfully */
    SUCCESS = 'success',
    /** Subscription failed due to an error */
    ERROR = 'error',
}

/**
 * Structure of messages received through WebSocket connections.
 * Contains event data and metadata for subscribed events.
 */
export interface WebSocketMessage {
    /** Optional message identifier */
    id?: string;
    /** Type of event this message represents */
    type: WebSocketMessageType;
    /** Event-specific data payload */
    data: any;
    /** Unix timestamp when the event occurred */
    timestamp: number;
}

/**
 * Types of messages that can be received via WebSocket.
 */
export enum WebSocketMessageType {
    /** Trackable motion update message */
    TRACKABLE_MOTION = 'trackable_motion',
    /** Fence event message (enter/exit) */
    FENCE_EVENT = 'fence_event',
    /** Collision event message (start/end) */
    COLLISION_EVENT = 'collision_event',
}

/**
 * Error information for WebSocket connection or message processing failures.
 */
export interface WebSocketError {
    /** Error code indicating the type of error */
    code: number;
    /** Human-readable error message */
    message: string;
    /** Additional error details or context */
    details?: any;
}
