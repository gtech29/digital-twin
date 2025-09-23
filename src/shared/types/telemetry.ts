// src/shared/types/telemetry.ts
export type Protocol = "dnp3" | "bacnet" | "modbus" | "sim";
export type PointType = "analog" | "binary" | "counter" | "string";
export type Quality =
  | "good"
  | "bad"
  | "uncertain"
  | "comm_lost"
  | "out_of_range"
  | "not_init";

export interface Event {
  /** when the device measured the value (ISO 8601) */
  timestamp: string;
  /** when our backend ingested it (server time, ISO 8601) */
  ingest_ts: string;

  /** stable ID for this point (e.g., "siteA:feeder-01:amps") */
  point_id: string;

  /** convenience fields */
  source: string; // "siteA/sub2/feeder-01"
  protocol: Protocol; // "dnp3" | "bacnet" | "modbus" | "sim"

  /** type + exactly one value* below */
  type: PointType;
  value_num?: number; // analog/counter
  value_bool?: boolean; // binary
  value_text?: string; // string

  unit?: string; // "A", "kW", "°C", etc.
  quality: Quality;

  /** extra labels (site, area, device class, phase, etc.) */
  tags?: Record<string, string>;
}

export type ControlActor = "ui" | "llm" | "sim" | "api";
export type ControlStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "applied"
  | "failed";

export interface ControlAction {
  id: string; // server-assigned
  timestamp: string; // created at (ISO)
  target_point_id: string; // FK to Points.point_id

  proposed_value_num?: number;
  proposed_value_bool?: boolean;
  proposed_value_text?: string;

  actor: ControlActor;
  requested_by?: string; // user id/email/service token
  status: ControlStatus;
  reason?: string; // rejection/failure reason

  correlation_id?: string;
  approved_ts?: string;
  applied_ts?: string;
}

export interface Point {
  point_id: string; // stable key
  protocol: Protocol;

  // device/location
  source: string; // "siteA/sub2/feeder-01"
  device_name?: string;

  // display & validation
  point_name: string; // "Feeder 01 Current"
  type: PointType;
  unit?: string;
  writable?: boolean;
  normal_min?: number;
  normal_max?: number;

  // protocol-specific addressing
  proto_ref: {
    dnp3?: { index: number; group?: number; variation?: number };
    bacnet?: { objectType: string; instance: number; property?: string };
    modbus?: { address: number; function?: number; length?: number };
  };

  tags?: Record<string, string>;
  created_ts: string;
  updated_ts?: string;
}
