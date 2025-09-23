import { z } from "zod";

export const Protocol = z.enum(["dnp3", "bacnet", "modbus", "sim"]);
export const PointType = z.enum(["analog", "binary", "counter", "string"]);
export const Quality = z.enum([
  "good",
  "bad",
  "uncertain",
  "comm_lost",
  "out_of_range",
  "not_init",
]);

export const EventSchema = z
  .object({
    timestamp: z.string().datetime(),
    ingest_ts: z.string().datetime(),
    point_id: z.string(),
    source: z.string(),
    protocol: Protocol,
    type: PointType,
    value_num: z.number().optional(),
    value_bool: z.boolean().optional(),
    value_text: z.string().optional(),
    unit: z.string().optional(),
    quality: Quality,
    tags: z.record(z.string(), z.string()).optional(),
  })
  .refine(
    (e) =>
      [
        e.value_num !== undefined,
        e.value_bool !== undefined,
        e.value_text !== undefined,
      ].filter(Boolean).length === 1,
    {
      message: "Exactly one of value_num | value_bool | value_text must be set",
    }
  );

export const ControlActionSchema = z
  .object({
    id: z.string(),
    timestamp: z.string().datetime(),
    target_point_id: z.string(),
    proposed_value_num: z.number().optional(),
    proposed_value_bool: z.boolean().optional(),
    proposed_value_text: z.string().optional(),
    actor: z.enum(["ui", "llm", "sim", "api"]),
    requested_by: z.string().optional(),
    status: z.enum(["requested", "approved", "rejected", "applied", "failed"]),
    reason: z.string().optional(),
    correlation_id: z.string().optional(),
    approved_ts: z.string().datetime().optional(),
    applied_ts: z.string().datetime().optional(),
  })
  .refine(
    (c) =>
      [
        c.proposed_value_num !== undefined,
        c.proposed_value_bool !== undefined,
        c.proposed_value_text !== undefined,
      ].filter(Boolean).length === 1,
    { message: "Exactly one proposed_value* must be set" }
  );

export const PointSchema = z.object({
  point_id: z.string(),
  protocol: Protocol,
  source: z.string(),
  device_name: z.string().optional(),
  point_name: z.string(),
  type: PointType,
  unit: z.string().optional(),
  writable: z.boolean().optional(),
  normal_min: z.number().optional(),
  normal_max: z.number().optional(),
  proto_ref: z.object({
    dnp3: z
      .object({
        index: z.number(),
        group: z.number().optional(),
        variation: z.number().optional(),
      })
      .optional(),
    bacnet: z
      .object({
        objectType: z.string(),
        instance: z.number(),
        property: z.string().optional(),
      })
      .optional(),
    modbus: z
      .object({
        address: z.number(),
        function: z.number().optional(),
        length: z.number().optional(),
      })
      .optional(),
  }),
  tags: z.record(z.string(), z.string()).optional(),
  created_ts: z.string().datetime(),
  updated_ts: z.string().datetime().optional(),
});
