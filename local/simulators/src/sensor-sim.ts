import mqtt from "mqtt";
import { randomUUID } from "node:crypto";

const client = mqtt.connect(process.env.MQTT_BROKER_URL ?? "mqtt://localhost:1883");
const tenantId = process.env.TENANT_ID ?? "tenant-dev-1";
const deviceId = process.env.DEVICE_ID ?? randomUUID();

client.on("connect", () => {
  console.log("Simulator connected", { tenantId, deviceId });
  setInterval(() => {
    const payload = {
      tenantId,
      deviceId,
      type: "temperature",
      value: +(3 + Math.random() * 5).toFixed(2),
      unit: "°C",
      recordedAt: new Date().toISOString(),
      seq: Date.now()
    };
    client.publish(`readings/${tenantId}/${deviceId}`, JSON.stringify(payload));
  }, 1000);
});
