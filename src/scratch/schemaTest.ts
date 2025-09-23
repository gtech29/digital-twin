import { Event } from "../shared/types/telemetry";
import { EventSchema } from "../shared/types/telemetry.zod"; 
const e: Event = {
  timestamp: new Date().toISOString(),
  ingest_ts: new Date().toISOString(),
  source: "siteA/sub2/feeder-01",
  protocol: "dnp3",
  point_id: "siteA:feeder-01:amps",
  type: "analog",
  value_num: 128.3,
  unit: "A",
  quality: "good",
  tags: { site: "siteA", device: "feeder-01" },
};

// If using zod:
EventSchema.parse(e);
