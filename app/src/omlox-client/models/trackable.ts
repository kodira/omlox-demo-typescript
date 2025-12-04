import { Polygon, RuleSetInner, Point } from './common';

/**
 * Trackable entity schema from the OMLOX Hub API specification.
 * Represents entities that can be tracked within the positioning system.
 */
export interface Trackable {
    /** Must be a unique identifier (i.e. a UUID). When creating a trackable, a unique id will be generated if one is not provided. */
    id: string;
    /** Either 'omlox' or 'virtual'. An omlox™ compatible trackable knows it's location providers (e.g. embedded UWB, BLE, RFID hardware), and self-assigns it's location providers. A virtual trackable can be used to assign location providers to a logical asset. */
    type: TrackableType;
    /** A describing name. */
    name?: string;
    /** Geometry defining the trackable's shape */
    geometry?: Polygon;
    /** The extrusion to be applied to the geometry in meters. Must be a positive number. If not set, or set to null, it will default to MAX_EXTRUSION. If not set, or set to null, and a floor is not specified, the extrusion is infinite. If not set, or set to null, and a floor is specified, the extrusion is clamped to the specified floor. If set to 0, the geometry will have an extrusion of 0m and will be treated as a slice/plane. If a z-coordinate is provided by a Location Provider, it MUST match with the extrusion. */
    extrusion?: number;
    /** The location provider ids (e.g. MAC addresses) assigned to the trackable. A location provider can only be assigned to one trackable at a time. Note: An application may create virtual location providers and assign these to a trackable if desired. This allows applications to identify trackables for location providers which themselves do not have a unique identifier (e.g. certain GPS devices). */
    location_providers?: string[];
    /** The timeout in milliseconds after which a location should expire and trigger a fence exit event (if no more location updates are sent). Must be a positive number or -1 in case of an infinite timeout. If not set, or set to null, it will default to the fence setting. */
    fence_timeout?: number;
    /** The minimum distance in meters for a trackable to release from an ongoing collision. For example, for a trackable that was previously colliding with another trackable by being inside a trackable's radius, the collision event will not be released from the collision until its distance to the trackable's geometry is at least the given exit_tolerance. Must be a positive number. If not set, or set to null, it will default to the fence setting. */
    exit_tolerance?: number;
    /** The timeout in milliseconds after which a collision outside of a trackable, but within exit_tolerance distance to another obstacle, should release from a collision. Must be a positive number or -1 in case of an infinite timeout. If not set, or set to null, it will default to the fence setting. */
    tolerance_timeout?: number;
    /** The delay in milliseconds in which an imminent exit event should wait for another location update. This is relevant for fast rate position updates with quick moving objects. For example, an RTLS provider may batch location updates into groups, resulting in distances being temporarily outdated and premature events between quickly moving objects. The provided number must be positive or -1 in case of an infinite exit_delay. If not set, or set to null, it will default to the fence setting. */
    exit_delay?: number;
    /** A radius provided in meters, defining the approximate circumference of the trackable. If a radius value is set, all position updates from any of the Location Providers will generate a circular geometry for the trackable, where the position is the center and the circle will be generated with the given radius. */
    radius?: number;
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
    /** Locating rules for provider selection */
    locating_rules?: RuleSetInner[];
}

/**
 * Trackable type enumeration from the OMLOX Hub API specification.
 */
export enum TrackableType {
    /** Physical OMLOX-compliant device */
    OMLOX = 'omlox',
    /** Virtual or simulated trackable */
    VIRTUAL = 'virtual',
}

/**
 * Real-time motion data for a trackable entity.
 * Contains the trackable's current location and movement information.
 */
export interface TrackableMotion {
    /** Unique identifier of the trackable */
    id: string;
    /** Current location data */
    location: Location;
}

/**
 * Location information schema from the OMLOX Hub API specification.
 * Contains detailed positioning and timing data for trackables.
 */
export interface Location {
    /** Geographic position using GeoJSON Point format */
    position: Point;
    /** Represents the unique identifier of the RTLS system (zone_id or foreign_id) which generated this location object, or the id of a self-localizing device (e.g. a UWB tag / provider_id in GPS mode). */
    source: string;
    /** The location provider type which triggered this location update. */
    provider_type: 'uwb' | 'gps' | 'wifi' | 'rfid' | 'ibeacon' | 'virtual' | 'unknown';
    /** The location provider's unique identifier, e.g. the mac address of a UWB location provider. */
    provider_id: string;
    /** The timestamp when the location was calculated. The timestamp MUST be an ISO 8601 timestamp using UTC timezone and it SHOULD have millisecond precision to allow for precise speed and course calculations. */
    timestamp_generated?: string;
    /** The timestamp when the location was sent over the network. The timestamp MUST be an ISO 8601 timestamp using UTC timezone and it SHOULD have millisecond precision. Note: No delivery guarantee is made in case the data is lost in transit. */
    timestamp_sent?: string;
    /** A projection identifier defining the projection of the provided location coordinate. The crs MUST be either a valid EPSG identifier (https://epsg.io) or 'local' if the location is provided as a relative coordinate of the floor plan. For best interoperability and worldwide coverage, WGS84 (EPSG:4326) SHOULD be the preferred projection (as used also by GPS). If the crs field is not present, 'local' MUST be assumed as the default. */
    crs?: string;
    /** Whether a client is currently associated to a network. This property SHOULD be set if available for WiFi based positioning. */
    associated?: boolean;
    /** The horizontal accuracy of the location update in meters. */
    accuracy?: number;
    /** A logical and non-localized representation for a building floor. Floor 0 represents the floor designated as 'ground'. Negative numbers indicate floors below the ground floor and positive numbers indicate floors above the ground floor. When implemented, the floor value MUST match described logical numbering scheme, which can be different from any numbering used within a building. Values can be expressed as an integer value, or as a float as required for mezzanine floor levels. */
    floor?: number;
    /** An accurate orientation reading from a 'true' heading direction. The 'true' magnetic as opposed to the normal magnetic heading. Applications SHOULD prefer the true heading if available. An invalid or currently unavailable heading MUST be indicated by a negative value. */
    true_heading?: number;
    /** The magnetic heading direction, which deviates from the true heading by a few degrees and differs slightly depending on the location on the globe. */
    magnetic_heading?: number;
    /** The maximum deviation in degrees between the reported heading and the true heading. */
    heading_accuracy?: number;
    /** An elevation reference hint for the position's z component. If present it MUST be either 'floor' or 'wgs84'. If set to 'floor' the z component MUST be assumed to be relative to the floor level. If set to 'wgs84' the z component MUST be treated as WGS84 ellipsoidal height. For the majority of applications an accurate geographic height may not be available. Therefore elevation_ref MUST be assumed 'floor' by default if this property is not present. */
    elevation_ref?: 'floor' | 'wgs84';
    /** The current speed in meters per second. If the value is null or the property is not set, the current speed MAY be approximated by DeepHub based on the timestamp_generated value of a previous location update. */
    speed?: number;
    /** The current course ("compass direction"), which is the direction measured clockwise as an angle from true north on a compass (north is 0°, east is 90°, south is 180°, and west is 270°). If the value is null or the property is not set, the course will be approximated by DeepHub based on the previous location. */
    course?: number;
    /** Array of associated trackable UUIDs */
    trackables?: string[];
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
}

/**
 * Location provider schema from the OMLOX Hub API specification.
 * Represents systems or devices that provide positioning information.
 */
export interface LocationProvider {
    /** Must be a valid id for the specific location provider type (e.g. a MAC address of a UWB tag). Wherever applicable, the format of a MAC address MUST be an upper case EUI-64 hex-string representation, built from unsigned values, including leading zeros, without byte delimiters. Ids which can not be mapped to EUI-64 MAY deviate from this format. */
    id: string;
    /** Type of the location provider. A virtual location provider can be used for assigning a unique id to a location provider which does not have a unique identifier by itself. For example, an iOS app will not get the MAC address of the Wi-Fi interface for WiFi positioning. Instead, it will create a virtual location provider to identify the provider and the trackable (iOS device) for location updates. */
    type: 'uwb' | 'gps' | 'wifi' | 'rfid' | 'ibeacon' | 'virtual' | 'unknown';
    /** An optional name for the location provider. */
    name?: string;
    /** Sensor data related to a location provider. The actual structure of the sensor data is application defined. */
    sensors?: any;
    /** The timeout in milliseconds after which a location should expire and trigger a fence exit event (if no more location updates are sent). If not set or null the timeout will default to infinite. The provided number must be positive. */
    fence_timeout?: number;
    /** The minimum distance in meters to release from an ongoing collision or fence event. Must be a positive number. If not set or null exit_tolerance will default to 0. */
    exit_tolerance?: number;
    /** The timeout in milliseconds after which a collision outside of an obstacle but still within exit_tolerance distance should release from a collision or fence event. If not set or null the timeout will default to infinite. The provided number must be positive. */
    tolerance_timeout?: number;
    /** The delay in milliseconds in which an imminent exit event should wait for another location update. This is relevant for fast rate position updates with quick moving objects. For example, an RTLS provider may batch location updates into groups, resulting in distances being temporarily outdated and premature events between quickly moving objects. If not set or null, exit_delay will default to 0. */
    exit_delay?: number;
    /** Any additional application or vendor specific properties. An application implementing this object is not required to interpret any of the custom properties, but it MUST preserve the properties if set. */
    properties?: Record<string, any>;
}
