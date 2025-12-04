import { Polygon, Point, RuleSetInner } from './common';

/**
 * Fence schema from the OMLOX Hub API specification.
 * Represents geofences and virtual boundaries for trackable monitoring.
 */
export interface Fence {
    /** Must be a unique identifier (i.e. a UUID). When creating a fence, a unique id will be generated if it is not provided. */
    id: string;
    /** A GeoJSON geometry defining the region of the geofence. */
    region: Point | Polygon;
    /** If the region is a point, the radius defines a circular region around that point in meters. The radius value is ignored for polygonal regions. */
    radius?: number;
    /** The extrusion to be applied to the geometry in meters. Must be a positive number. If not set, or set to null, it will default to MAX_EXTRUSION. If not set, or set to null, and a floor is not specified, the extrusion is infinite. If not set, or set to null, and a floor is specified, the extrusion is clamped to the specified floor. If set to 0, the geometry will have an extrusion of 0m and will be treated as a slice/plane. If a z-coordinate is provided by a Location Provider, it MUST match with the extrusion. */
    extrusion?: number;
    /** The canonical representation of the floor level, where floor 0 is the ground floor. */
    floor?: number;
    /** The foreign_id represents a foreign unique identifier for the origin of a fence event, such as an UWB zone id or an iBeacon identifier. If a foreign_id is set, the foreign id MUST be resolved by the DeepHub. */
    foreign_id?: string;
    /** A textual representation of the fence. */
    name?: string;
    /** The timeout in milliseconds after which a location should expire and trigger a fence exit event (if no more location updates are sent). Must be a positive number or -1 in case of an infinite timeout. If not set, or set to null, it will default to infinite. */
    timeout?: number;
    /** The distance tolerance to a fence in meters before an exit event is triggered. Useful for locations nearby or on the border of a fence to avoid fluctuating fence  / exit events. For example, a location which was previously inside a fence will remain within the fence when its distance to the fence is less than or equal to the given tolerance. Must be a positive number. If not set, or null, the exit_tolerance will default to 0. */
    exit_tolerance?: number;
    /** The timeout in milliseconds after which a location outside of a fence, but still within exit_tolerance distance to that fence, should trigger a fence exit event. For example, assume an exit_tolerance of 1m: A location previously within the fence is now located 50cm outside of the fence and remains within the given exit_tolerance distance to that fence. An exit event is triggered after tolerance_timeout when the location remains outside of the fence. The provided number must be positive or -1 in case of an infinite tolerance_timeout. If not set, or null, tolerance_timeout will default to 0. */
    tolerance_timeout?: number;
    /** The delay in milliseconds in which an imminent exit event should wait for another location update. This is relevant for fast rate position updates with quick moving objects. For example, an RTLS provider may batch location updates into groups, resulting in distances being temporarily outdated and premature events between quick moving objects. The provided number must be positive or -1 in case of an infinite exit_delay. If not set, or null, exit_delay will default to 0. */
    exit_delay?: number;
    /** A projection identifier defining the projection of the fence region coordinates. The crs MUST be either a valid EPSG identifier (https://epsg.io) or 'local' if the fence region is provided as relative coordinates of a zone. If crs is not present, 'EPSG:4326' ("GPS") MUST be assumed as the default. */
    crs?: string;
    /** The zone id related to the fence's region. This field MUST be present in case crs projection is set to 'local'. */
    zone_id?: string;
    /** An elevation reference hint for the position's z component. If present, it MUST be either 'floor' or 'wgs84'. If set to 'floor' the z component MUST be assumed to be relative to the floor level. If set to 'wgs84' the z component MUST be treated as WGS84 ellipsoidal height. For the majority of applications an accurate geographic height may not be available. Therefore elevation_ref MUST be assumed 'floor' by default if this property is not present. */
    elevation_ref?: 'floor' | 'wgs84';
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
}

/**
 * Classification types for fence entities.
 */
export enum FenceType {
    /** Standard geographical fence for area monitoring */
    GEOFENCE = 'geofence',
    /** Collision detection fence between trackables */
    COLLISION = 'collision',
}

/**
 * Fence event schema from the OMLOX Hub API specification.
 * Represents enter/exit events for geofences.
 */
export interface FenceEvent {
    /** Optional unique identifier for the event */
    id?: string;
    /** Identifier of the fence that triggered the event */
    fence_id: string;
    /** Identifier of the trackable that caused the event */
    trackable_id: string;
    /** Type of fence event (enter or exit) */
    event_type: FenceEventType;
    /** Unix timestamp when the event occurred */
    timestamp: number;
    /** Location coordinates where the event was triggered */
    location?: {
        /** X coordinate in meters */
        x: number;
        /** Y coordinate in meters */
        y: number;
        /** Z coordinate in meters (optional) */
        z?: number;
    };
    /** Additional event-specific properties */
    properties?: Record<string, any>;
}

/**
 * Fence event type enumeration from the OMLOX Hub API specification.
 */
export enum FenceEventType {
    /** Trackable has entered the fence area */
    ENTER = 'enter',
    /** Trackable has exited the fence area */
    EXIT = 'exit',
}

/**
 * Collision schema from the OMLOX Hub API specification.
 * Represents collision information for colliding objects.
 */
export interface Collision {
    /** A unique identifier, e.g. representing the trackable id. */
    id: string;
    /** The object type associated to the id. */
    object_type: 'trackable';
    /** The original position of e.g. the location provider. */
    position?: Point;
    /** The trackable's polygon, e.g. generated by its radius. */
    geometry?: Polygon;
    /** A logical and non-localized representation for a building floor. Floor 0 represents the floor designated as 'ground'. Negative numbers designate floors below the ground floor, and positive numbers indicate floors above the ground floor. When implemented, the floor value MUST match described logical numbering scheme, which can be different from any numbering used within a building. Values can be expressed as an integer value, or as a float as required for mezzanine floor levels. If a value for the floor level is not provided, 0 MUST be assumed. */
    floor?: number;
}

/**
 * Collision event schema from the OMLOX Hub API specification.
 * Represents collision start/end events between objects.
 */
export interface CollisionEvent {
    /** A unique identifier for this event. */
    id: string;
    /** The collision event type. Either "collision_start", "colliding", or "collision_end". Type "collision_start" MUST be set when two objects collide, "colliding" MUST be set when two objects are still colliding after a position update, and "collision_end" MUST be set when two previously colliding objects separate from each other. */
    collision_type: 'collision_start' | 'colliding' | 'collision_end';
    /** The timestamp when the two objects first collided. The timestamp MUST be an ISO 8601 timestamp using UTC timezone and it SHOULD have millisecond precision. */
    start_time?: string;
    /** The timestamp when the two objects were released from a collision with each other. The timestamp MUST be an ISO 8601 timestamp using UTC timezone and it SHOULD have millisecond precision. */
    end_time?: string;
    /** The timestamp when the continuing collision event was triggered, e.g. two objects started colliding and a collision_start event was sent and continue colliding after another position update was sent. The timestamp MUST be an ISO 8601 timestamp using UTC timezone and it SHOULD have millisecond precision. */
    collision_time?: string;
    /** The two objects colliding with each other. The first object in the array MUST be the object which triggered the event. For example, location for trackable A was updated and is now colliding with trackable B, thus trackable A triggered this particular event and must come first. */
    collisions: [Collision, Collision];
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
}

/**
 * Collision event type enumeration from the OMLOX Hub API specification.
 */
export enum CollisionEventType {
    /** Collision between trackables has started */
    START = 'collision_start',
    /** Objects are still colliding after position update */
    COLLIDING = 'colliding',
    /** Collision between trackables has ended */
    END = 'collision_end',
}
