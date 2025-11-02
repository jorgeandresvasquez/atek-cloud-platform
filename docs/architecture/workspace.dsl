workspace "ATEK Cloud" {
  model {
    person user "Customer User"
    softwareSystem atek "ATEK Platform" {
      container web "Web" "Next.js" "UI"
      container api "API" "Lambda/Fastify"
      container iot "IoT Core" "MQTT"
      container ts "Timestream/Timescale"
      container aurora "Aurora PG"
      container s3 "S3 (WORM)"
      user -> web "Uses"
      web -> api "HTTPS"
      iot -> api "Rules/Lambda"
      api -> ts "W"
      api -> aurora "Tx+A"
      api -> s3 "WORM"
    }
  }
  views { container atek { include * autoLayout lr } }
}
