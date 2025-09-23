# Telemetry Schema (v1)

**Why**: one universal shape for DNP3, BACnet, Modbus, and simulators so UI, analytics, and LLM don't care about protocol details.

- `Event`: time-series measurement (exactly one of value_num | value_bool | value_text)
- `ControlAction`: audit trail for requested/applied changes
- `Point`: catalog of all points with protocol addressing

See `src/shared/types/telemetry.ts` for TypeScript types and `src/shared/types/telemetry.zod.ts` for runtime validation.
