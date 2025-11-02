import {
  AlarmSeverity,
  MetricType,
  PrismaClient,
  Role,
  ThresholdDirection
} from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "atek-dev" },
    update: {},
    create: {
      slug: "atek-dev",
      name: "ATEK Development Tenant",
      description: "Default tenant for local development and automated tests."
    }
  });

  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: "admin@atek.dev"
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@atek.dev",
      displayName: "Platform Admin",
      hashedPassword: null
    }
  });

  await prisma.userRole.upsert({
    where: {
      tenantId_userId_role: {
        tenantId: tenant.id,
        userId: adminUser.id,
        role: Role.TENANT_ADMIN
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: adminUser.id,
      role: Role.TENANT_ADMIN
    }
  });

  const facility = await prisma.facility.upsert({
    where: {
      tenantId_code: {
        tenantId: tenant.id,
        code: "fac-main"
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      code: "fac-main",
      name: "Primary Manufacturing Facility",
      location: {
        type: "Point",
        coordinates: [-73.5673, 45.5017]
      },
      timezone: "America/Toronto"
    }
  });

  const temperatureMetric = await prisma.metricDefinition.upsert({
    where: {
      tenantId_key: {
        tenantId: tenant.id,
        key: "temperature"
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      key: "temperature",
      name: "Ambient Temperature",
      unit: "°C",
      type: MetricType.TEMPERATURE,
      description: "Ambient temperature captured by calibrated probes."
    }
  });

  const humidityMetric = await prisma.metricDefinition.upsert({
    where: {
      tenantId_key: {
        tenantId: tenant.id,
        key: "humidity"
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      key: "humidity",
      name: "Relative Humidity",
      unit: "%",
      type: MetricType.HUMIDITY,
      description: "Relative humidity percentage."
    }
  });

  const facilityTemperature = await prisma.facilityMetric.upsert({
    where: {
      facilityId_metricDefinitionId: {
        facilityId: facility.id,
        metricDefinitionId: temperatureMetric.id
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      facilityId: facility.id,
      metricDefinitionId: temperatureMetric.id,
      sampleIntervalSeconds: 60,
      isEnabled: true
    }
  });

  const facilityHumidity = await prisma.facilityMetric.upsert({
    where: {
      facilityId_metricDefinitionId: {
        facilityId: facility.id,
        metricDefinitionId: humidityMetric.id
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      facilityId: facility.id,
      metricDefinitionId: humidityMetric.id,
      sampleIntervalSeconds: 60,
      isEnabled: true
    }
  });

  await prisma.threshold.upsert({
    where: {
      facilityMetricId_direction_value: {
        facilityMetricId: facilityTemperature.id,
        direction: ThresholdDirection.ABOVE,
        value: 8
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      facilityMetricId: facilityTemperature.id,
      direction: ThresholdDirection.ABOVE,
      value: 8,
      severity: AlarmSeverity.CRITICAL,
      durationSeconds: 120
    }
  });

  await prisma.threshold.upsert({
    where: {
      facilityMetricId_direction_value: {
        facilityMetricId: facilityHumidity.id,
        direction: ThresholdDirection.BELOW,
        value: 30
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      facilityMetricId: facilityHumidity.id,
      direction: ThresholdDirection.BELOW,
      value: 30,
      severity: AlarmSeverity.WARNING,
      durationSeconds: 300
    }
  });

  console.log("Seeded tenant, facility, metrics, and thresholds for local development.");
}

main()
  .catch(err => {
    console.error("Database seed failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
