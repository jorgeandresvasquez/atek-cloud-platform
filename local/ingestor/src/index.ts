import mqtt from "mqtt";
import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { Client as Pg } from "pg";

const mqttUrl = process.env.MQTT_BROKER_URL ?? "mqtt://localhost:1883";
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: "us-east-1",
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY!, secretAccessKey: process.env.S3_SECRET_KEY! }
});
const bucket = "atek-local";

async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
  }
}

const pg = new Pg({ connectionString: process.env.DATABASE_URL });
await pg.connect();
await pg.query("create extension if not exists pgcrypto");
await pg.query(`create table if not exists readings(
  id uuid default gen_random_uuid() primary key,
  tenant_id text not null,
  device_id text not null,
  type text not null,
  value double precision not null,
  unit text not null,
  recorded_at timestamptz not null
)`);

await ensureBucket();

const client = mqtt.connect(mqttUrl);
client.on("connect", () => client.subscribe("readings/#"));
client.on("message", async (_topic, buf) => {
  const msg = JSON.parse(buf.toString());
  await pg.query(
    "insert into readings(tenant_id,device_id,type,value,unit,recorded_at) values($1,$2,$3,$4,$5,$6)",
    [msg.tenantId, msg.deviceId, msg.type, msg.value, msg.unit, msg.recordedAt]
  );
  const key = `raw/${msg.tenantId}/${msg.deviceId}/${Date.now()}.json`;
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: JSON.stringify(msg) }));
});
