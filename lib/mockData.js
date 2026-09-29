/**
 * Comprehensive Mock Data Generator for Trigun FinOps Sentinel Audit
 * Calibrated specifically for AWS ap-south-1 (Mumbai) Region Pricing
 * Generic Enterprise Dataset
 */

function generateMockScanResults(region = 'ap-south-1', days = 30) {
  const timestamp = new Date().toISOString();
  
  // 1. ECR Repositories Audit (Mumbai: $0.10/GB-month)
  const ecrAudit = {
    summary: {
      totalRepositories: 18,
      reposWithoutPolicy: 11,
      reposWithPolicy: 7,
      totalStorageGB: 1420.5,
      totalImagesCount: 8450,
      staleImagesCount: 6120, // older than 30 days
      potentialStorageSavingsGB: 1050.2,
      estimatedMonthlySavingsUSD: 105.02 // 1050.2 GB * $0.10/GB
    },
    items: [
      {
        repoName: "api-gateway-service",
        totalImages: 940,
        sizeGB: 165.4,
        hasLifecyclePolicy: false,
        staleImages: 890,
        oldestImageDate: "2024-03-12",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 148.0,
        monthlySavingsUSD: 14.80, // 148 * $0.10
        cliCommand: `aws ecr put-lifecycle-policy --repository-name api-gateway-service --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "payment-processor-service",
        totalImages: 1120,
        sizeGB: 210.0,
        hasLifecyclePolicy: false,
        staleImages: 1040,
        oldestImageDate: "2023-11-05",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 191.0,
        monthlySavingsUSD: 19.10, // 191 * $0.10
        cliCommand: `aws ecr put-lifecycle-policy --repository-name payment-processor-service --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "logistics-engine-backend",
        totalImages: 780,
        sizeGB: 135.2,
        hasLifecyclePolicy: false,
        staleImages: 710,
        oldestImageDate: "2024-01-20",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 122.5,
        monthlySavingsUSD: 12.25,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name logistics-engine-backend --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "data-analytics-worker",
        totalImages: 650,
        sizeGB: 118.0,
        hasLifecyclePolicy: false,
        staleImages: 580,
        oldestImageDate: "2024-02-14",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 107.0,
        monthlySavingsUSD: 10.70,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name data-analytics-worker --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "notification-dispatcher",
        totalImages: 510,
        sizeGB: 92.5,
        hasLifecyclePolicy: false,
        staleImages: 460,
        oldestImageDate: "2024-04-01",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 84.0,
        monthlySavingsUSD: 8.40,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name notification-dispatcher --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "auth-identity-service",
        totalImages: 120,
        sizeGB: 22.0,
        hasLifecyclePolicy: true,
        staleImages: 0,
        oldestImageDate: "2026-08-15",
        remediation: "None (Policy Active)",
        potentialSavingsGB: 0,
        monthlySavingsUSD: 0.00,
        cliCommand: "# Lifecycle policy already configured"
      }
    ]
  };

  // 2. EC2 Over-Provisioned Audit (Calibrated for ap-south-1 Mumbai On-Demand Rates)
  const ec2Audit = {
    summary: {
      totalInstancesScanned: 24,
      overProvisionedCount: 8,
      optimalCount: 16,
      currentMonthlySpendUSD: 4890.00,
      potentialMonthlySavingsUSD: 2135.00
    },
    items: [
      {
        instanceId: "i-08a91b2c3d4e5f67a",
        name: "prod-analytics-reporting-worker-01",
        instanceType: "c5.4xlarge", // Mumbai: $553.00/mo
        maxCpu30d: 12.4,
        avgCpu30d: 4.2,
        memoryUsageAvg: 28.5,
        currentCostUSD: 553.00,
        recommendedType: "c6g.xlarge", // Graviton3 Mumbai: $110.85/mo
        recommendedCostUSD: 110.85,
        monthlySavingsUSD: 442.15,
        reasoning: "Peak CPU over 30 days is 12.4%. Downsize 16 vCPU c5.4xlarge to 4 vCPU Graviton3 (c6g.xlarge)."
      },
      {
        instanceId: "i-01f2e3d4c5b6a789b",
        name: "dev-keycloak-identity-server",
        instanceType: "m5.2xlarge", // Mumbai: $308.15/mo
        maxCpu30d: 8.1,
        avgCpu30d: 2.1,
        memoryUsageAvg: 34.0,
        currentCostUSD: 308.15,
        recommendedType: "t4g.medium", // Graviton2 Mumbai: $26.50/mo
        recommendedCostUSD: 26.50,
        monthlySavingsUSD: 281.65,
        reasoning: "Dev instance severely idle. Downsize to t4g.medium + implement start-stop schedule."
      },
      {
        instanceId: "i-0987654321fedcba0",
        name: "prod-search-elasticsearch-node-3",
        instanceType: "r5.2xlarge", // Mumbai: $397.40/mo
        maxCpu30d: 18.2,
        avgCpu30d: 6.8,
        memoryUsageAvg: 41.0,
        currentCostUSD: 397.40,
        recommendedType: "r6g.xlarge", // Graviton3 Mumbai: $154.00/mo
        recommendedCostUSD: 154.00,
        monthlySavingsUSD: 243.40,
        reasoning: "Over-provisioned RAM & CPU. Switch to r6g.xlarge Graviton3 instance."
      },
      {
        instanceId: "i-0a1b2c3d4e5f67891",
        name: "staging-api-gateway-node",
        instanceType: "c5.2xlarge", // Mumbai: $276.50/mo
        maxCpu30d: 14.5,
        avgCpu30d: 3.9,
        memoryUsageAvg: 22.0,
        currentCostUSD: 276.50,
        recommendedType: "c6g.large", // Graviton3 Mumbai: $55.40/mo
        recommendedCostUSD: 55.40,
        monthlySavingsUSD: 221.10,
        reasoning: "Non-prod API node peak CPU is < 15%. Downsize to c6g.large."
      }
    ]
  };

  // 3. Database (RDS / Aurora) Over-Provisioned Audit (Calibrated for ap-south-1 Mumbai RDS Rates)
  const rdsAudit = {
    summary: {
      totalDatabasesScanned: 8,
      overProvisionedCount: 4,
      currentMonthlySpendUSD: 7240.00,
      potentialMonthlySavingsUSD: 2680.00
    },
    items: [
      {
        dbIdentifier: "prod-transactional-order-db",
        engine: "postgres (14.9)",
        class: "db.m5.4xlarge", // Mumbai RDS: $1198.00/mo
        maxCpu30d: 14.2,
        avgCpu30d: 5.1,
        avgIops: 240,
        activeConnectionsAvg: 18,
        currentCostUSD: 1198.00,
        recommendedClass: "db.m6g.xlarge", // Mumbai RDS Graviton: $239.00/mo
        recommendedCostUSD: 239.00,
        monthlySavingsUSD: 959.00,
        reasoning: "Max 30-day CPU is 14.2% with 18 avg connections. Downsize to Graviton db.m6g.xlarge."
      },
      {
        dbIdentifier: "dev-inventory-service-db",
        engine: "postgres (15.3)",
        class: "db.r5.2xlarge", // Mumbai RDS: $720.00/mo
        maxCpu30d: 9.8,
        avgCpu30d: 1.8,
        avgIops: 80,
        activeConnectionsAvg: 4,
        currentCostUSD: 720.00,
        recommendedClass: "db.t4g.medium", // Mumbai RDS Graviton: $49.00/mo
        recommendedCostUSD: 49.00,
        monthlySavingsUSD: 671.00,
        reasoning: "Dev DB is oversized for light workload. Migrate to db.t4g.medium."
      },
      {
        dbIdentifier: "staging-user-account-db",
        engine: "mysql (8.0)",
        class: "db.m5.2xlarge", // Mumbai RDS: $599.00/mo
        maxCpu30d: 11.5,
        avgCpu30d: 3.0,
        avgIops: 110,
        activeConnectionsAvg: 6,
        currentCostUSD: 599.00,
        recommendedClass: "db.m6g.large", // Mumbai RDS Graviton: $119.50/mo
        recommendedCostUSD: 119.50,
        monthlySavingsUSD: 479.50,
        reasoning: "Staging DB under-utilized. Downsize to db.m6g.large Graviton."
      },
      {
        dbIdentifier: "prod-session-cache-redis",
        engine: "redis (cluster mode)",
        class: "cache.m5.xlarge", // Mumbai ElastiCache: $280.00/mo
        maxCpu30d: 16.0,
        avgCpu30d: 4.5,
        avgIops: 450,
        activeConnectionsAvg: 42,
        currentCostUSD: 280.00,
        recommendedClass: "cache.t4g.medium", // Mumbai ElastiCache Graviton: $84.00/mo
        recommendedCostUSD: 84.00,
        monthlySavingsUSD: 196.00,
        reasoning: "Redis cluster cache under 20% CPU. Downsize to cache.t4g.medium."
      }
    ]
  };

  // 4. S3 Top 10 Buckets & Purge / Transition Audit (Mumbai: S3 Standard $0.025/GB, Standard-IA $0.0135/GB -> Savings $0.0115 per GB-month)
  const s3Audit = {
    summary: {
      totalBucketsScanned: 42,
      top10TotalSizeGB: 18450.0,
      bucketsNeedingLifecycle: 7,
      potentialMonthlySavingsUSD: 212.18
    },
    top10Buckets: [
      {
        rank: 1,
        bucketName: "data-lake-raw-logs-prod",
        sizeGB: 6850.0,
        objectCount: 4250000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 180,
        recommendation: "Move data older than 30 days to S3 Standard-IA (Saves $0.0115/GB/mo in Mumbai).",
        potentialMonthlySavingsUSD: 78.78 // 6850 * 0.0115
      },
      {
        rank: 2,
        bucketName: "db-backups-archive-mumbai",
        sizeGB: 4120.0,
        objectCount: 18400,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 120,
        recommendation: "Transition backups older than 90 days to S3 Standard-IA / Glacier.",
        potentialMonthlySavingsUSD: 47.38 // 4120 * 0.0115
      },
      {
        rank: 3,
        bucketName: "kinesis-analytics-stream-dump",
        sizeGB: 2890.0,
        objectCount: 8900000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 210,
        recommendation: "Transition temporary dump files to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 33.24 // 2890 * 0.0115
      },
      {
        rank: 4,
        bucketName: "application-build-artifacts-temp",
        sizeGB: 1450.0,
        objectCount: 125000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 90,
        recommendation: "Configure 30-day lifecycle rule to transition to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 16.68 // 1450 * 0.0115
      },
      {
        rank: 5,
        bucketName: "user-documents-archive-prod",
        sizeGB: 980.0,
        objectCount: 450000,
        hasLifecycleRule: true,
        lastAccessedDaysAgo: 5,
        recommendation: "Active production bucket with Intelligent-Tiering configured. (Optimal)",
        potentialMonthlySavingsUSD: 0.00
      },
      {
        rank: 6,
        bucketName: "staging-media-uploads-bucket",
        sizeGB: 760.0,
        objectCount: 8900,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 150,
        recommendation: "Configure 30-day lifecycle rule to transition to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 8.74 // 760 * 0.0115
      },
      {
        rank: 7,
        bucketName: "cloudfront-edge-logs-archive",
        sizeGB: 540.0,
        objectCount: 1100000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 365,
        recommendation: "Transition log files to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 6.21 // 540 * 0.0115
      },
      {
        rank: 8,
        bucketName: "ml-model-training-checkpoints",
        sizeGB: 380.0,
        objectCount: 4200,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 110,
        recommendation: "Transition interim weights to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 4.37 // 380 * 0.0115
      },
      {
        rank: 9,
        bucketName: "static-assets-cdn-origin",
        sizeGB: 280.0,
        objectCount: 65000,
        hasLifecycleRule: true,
        lastAccessedDaysAgo: 1,
        recommendation: "Active CDN asset origin. (Optimal)",
        potentialMonthlySavingsUSD: 0.00
      },
      {
        rank: 10,
        bucketName: "temp-exports-csv-reports",
        sizeGB: 200.0,
        objectCount: 15000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 45,
        recommendation: "Transition CSV exports to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 2.30 // 200 * 0.0115
      }
    ]
  };

  // 5. CloudWatch Log Groups Retention Audit (Mumbai: Log Storage $0.033/GB-mo -> Retention Savings $0.0231/GB-mo)
  const logGroupsAudit = {
    summary: {
      totalLogGroupsScanned: 38,
      logGroupsNeverExpire: 24,
      logGroupsWithRetention: 14,
      totalLogStorageGB: 2480.0,
      monthlyLogStorageCostUSD: 81.84, // 2480 * 0.033
      potentialMonthlySavingsUSD: 57.29 // 2480 * 0.0231
    },
    unprotectedGroups: [
      {
        logGroupName: "/aws/containerinsights/production-eks-cluster/application",
        storedBytesGB: 850.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 28.05, // 850 * 0.033
        recommendedRetentionDays: 30,
        potentialSavingsUSD: 19.64, // 850 * 0.0231
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/containerinsights/production-eks-cluster/application' --retention-in-days 30"
      },
      {
        logGroupName: "/aws/rds/instance/prod-transactional-order-db/postgresql",
        storedBytesGB: 410.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 13.53, // 410 * 0.033
        recommendedRetentionDays: 30,
        potentialSavingsUSD: 9.47, // 410 * 0.0231
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/rds/instance/prod-transactional-order-db/postgresql' --retention-in-days 30"
      },
      {
        logGroupName: "/aws/lambda/pdf-generator-service-prod",
        storedBytesGB: 290.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 9.57, // 290 * 0.033
        recommendedRetentionDays: 14,
        potentialSavingsUSD: 6.70, // 290 * 0.0231
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/lambda/pdf-generator-service-prod' --retention-in-days 14"
      },
      {
        logGroupName: "/aws/vpc/flowlogs-prod-mumbai",
        storedBytesGB: 240.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 7.92, // 240 * 0.033
        recommendedRetentionDays: 7,
        potentialSavingsUSD: 5.54, // 240 * 0.0231
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/vpc/flowlogs-prod-mumbai' --retention-in-days 7"
      },
      {
        logGroupName: "/aws/elasticbeanstalk/dev-application-environment/syslog",
        storedBytesGB: 180.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 5.94, // 180 * 0.033
        recommendedRetentionDays: 7,
        potentialSavingsUSD: 4.16, // 180 * 0.0231
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/elasticbeanstalk/dev-application-environment/syslog' --retention-in-days 7"
      }
    ]
  };

  // 6. Cost & Billing Section
  const billingSection = {
    summary: {
      periodDays: days,
      totalAccountCost30dUSD: 18450.00,
      projectedAnnualSpendUSD: 221400.00,
      totalIdentifiedMonthlySavingsUSD: 5612.33,
      savingsPercentage: 30.4,
      estimatedCloudWatchApiCostUSD: 185.40,
      cloudWatchGetMetricDataCalls: 18540000
    },
    top10Services: [
      { rank: 1, serviceName: "Amazon Elastic Compute Cloud (EC2)", costUSD: 6420.00, percentage: 34.8 },
      { rank: 2, serviceName: "Amazon Relational Database Service (RDS)", costUSD: 4850.00, percentage: 26.3 },
      { rank: 3, serviceName: "Amazon Elastic Kubernetes Service (EKS)", costUSD: 2150.00, percentage: 11.7 },
      { rank: 4, serviceName: "Amazon Simple Storage Service (S3)", costUSD: 1240.00, percentage: 6.7 },
      { rank: 5, serviceName: "Amazon EC2 Container Registry (ECR)", costUSD: 850.00, percentage: 4.6 },
      { rank: 6, serviceName: "Amazon CloudWatch", costUSD: 720.00, percentage: 3.9 },
      { rank: 7, serviceName: "AWS Data Transfer / NAT Gateway", costUSD: 680.00, percentage: 3.7 },
      { rank: 8, serviceName: "Amazon ElastiCache", costUSD: 540.00, percentage: 2.9 },
      { rank: 9, serviceName: "Amazon Elastic Load Balancing (ALB/NLB)", costUSD: 480.00, percentage: 2.6 },
      { rank: 10, serviceName: "AWS Key Management Service (KMS)", costUSD: 520.00, percentage: 2.8 }
    ],
    apiMetricsAudit: {
      cloudWatchApiCalls30d: 18540000,
      getMetricDataRequests: 18540,
      estimatedCostUSD: 185.40,
      recommendation: "High volume of automated CloudWatch API polling detected (Datadog/Prometheus scraper interval: 10s). Increase scrape interval to 60s to save $140/month."
    }
  };

  // 7. EBS Volumes gp2 to gp3 Migration Audit (Mumbai: gp2 $0.114/GB-mo, gp3 $0.0912/GB-mo -> Savings $0.0228/GB-mo)
  const ebsGp2Audit = {
    summary: {
      totalGp2Volumes: 16,
      totalGp2ProvisionedGB: 4850,
      currentMonthlyGp2CostUSD: 552.90, // 4850 * 0.114
      projectedMonthlyGp3CostUSD: 442.32, // 4850 * 0.0912
      monthlySavingsUSD: 110.58, // 4850 * 0.0228
      annualSavingsUSD: 1326.96
    },
    items: [
      {
        volumeId: "vol-0a123b45c67d89e01",
        name: "prod-eks-worker-root-01",
        sizeGB: 500,
        iops: 1500,
        throughput: 128,
        attachedTo: "i-08a91b2c3d4e5f67a (prod-analytics-reporting-worker-01)",
        currentGp2CostUSD: 57.00, // 500 * 0.114
        gp3CostUSD: 45.60, // 500 * 0.0912
        monthlySavingsUSD: 11.40, // 500 * 0.0228
        cliCommand: "aws ec2 modify-volume --volume-id vol-0a123b45c67d89e01 --volume-type gp3"
      },
      {
        volumeId: "vol-0b234c56d78e90f12",
        name: "prod-db-postgres-data",
        sizeGB: 1000,
        iops: 3000,
        throughput: 250,
        attachedTo: "i-0987654321fedcba0 (prod-search-elasticsearch-node-3)",
        currentGp2CostUSD: 114.00, // 1000 * 0.114
        gp3CostUSD: 91.20, // 1000 * 0.0912
        monthlySavingsUSD: 22.80, // 1000 * 0.0228
        cliCommand: "aws ec2 modify-volume --volume-id vol-0b234c56d78e90f12 --volume-type gp3"
      },
      {
        volumeId: "vol-0c345d67e89f01a23",
        name: "dev-keycloak-data",
        sizeGB: 300,
        iops: 900,
        throughput: 128,
        attachedTo: "i-01f2e3d4c5b6a789b (dev-keycloak-identity-server)",
        currentGp2CostUSD: 34.20, // 300 * 0.114
        gp3CostUSD: 27.36, // 300 * 0.0912
        monthlySavingsUSD: 6.84, // 300 * 0.0228
        cliCommand: "aws ec2 modify-volume --volume-id vol-0c345d67e89f01a23 --volume-type gp3"
      },
      {
        volumeId: "vol-0d456e78f90a12b34",
        name: "staging-api-logs-vol",
        sizeGB: 400,
        iops: 1200,
        throughput: 128,
        attachedTo: "i-0a1b2c3d4e5f67891 (staging-api-gateway-node)",
        currentGp2CostUSD: 45.60, // 400 * 0.114
        gp3CostUSD: 36.48, // 400 * 0.0912
        monthlySavingsUSD: 9.12, // 400 * 0.0228
        cliCommand: "aws ec2 modify-volume --volume-id vol-0d456e78f90a12b34 --volume-type gp3"
      }
    ]
  };

  // 8. EBS Unattached & Idle Volumes Audit (Mumbai: gp2 unattached $0.114/GB-mo)
  const unattachedEbsAudit = {
    summary: {
      totalUnattachedVolumes: 9,
      totalUnattachedGB: 2150,
      olderThan1YearCount: 6,
      monthlyWastedCostUSD: 245.10, // 2150 * 0.114
      annualWastedCostUSD: 2941.20
    },
    items: [
      {
        volumeId: "vol-09988776655443321",
        name: "old-prod-mongo-backup-2023",
        sizeGB: 800,
        volumeType: "gp2",
        status: "available (unattached)",
        createdDate: "2023-04-12",
        ageDays: 1258,
        hasSnapshot: true,
        monthlyWastedUSD: 91.20, // 800 * 0.114
        cliCommand: "aws ec2 create-snapshot --volume-id vol-09988776655443321 --description 'Pre-delete backup' && aws ec2 delete-volume --volume-id vol-09988776655443321"
      },
      {
        volumeId: "vol-08877665544332210",
        name: "dev-temp-testing-disk-abandoned",
        sizeGB: 500,
        volumeType: "gp2",
        status: "available (unattached)",
        createdDate: "2023-08-01",
        ageDays: 1147,
        hasSnapshot: false,
        monthlyWastedUSD: 57.00, // 500 * 0.114
        cliCommand: "aws ec2 delete-volume --volume-id vol-08877665544332210"
      },
      {
        volumeId: "vol-07766554433221109",
        name: "staging-kafka-broker-orphaned",
        sizeGB: 400,
        volumeType: "gp2",
        status: "available (unattached)",
        createdDate: "2024-01-15",
        ageDays: 980,
        hasSnapshot: true,
        monthlyWastedUSD: 45.60, // 400 * 0.114
        cliCommand: "aws ec2 delete-volume --volume-id vol-07766554433221109"
      },
      {
        volumeId: "vol-06655443322110098",
        name: "legacy-jenkins-master-drive",
        sizeGB: 250,
        volumeType: "gp2",
        status: "available (unattached)",
        createdDate: "2023-11-20",
        ageDays: 1036,
        hasSnapshot: true,
        monthlyWastedUSD: 28.50, // 250 * 0.114
        cliCommand: "aws ec2 delete-volume --volume-id vol-06655443322110098"
      }
    ]
  };

  // 9. IDLE LOAD BALANCERS AUDIT (Mumbai ALB rate: $0.0225/hr * 720 hrs = $16.20/month per idle ALB)
  const idleAlbAudit = {
    summary: {
      totalLoadBalancersScanned: 11,
      idleLoadBalancersCount: 4,
      monthlyWastedCostUSD: 64.80, // 4 * $16.20/mo
      annualWastedCostUSD: 777.60
    },
    items: [
      {
        loadBalancerName: "dev-legacy-internal-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dev-legacy-internal-alb/9876543210abcdef",
        type: "application",
        scheme: "internal",
        createdDate: "2023-09-14",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 16.20, // 720 hrs * $0.0225/hr
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dev-legacy-internal-alb/9876543210abcdef"
      },
      {
        loadBalancerName: "staging-test-nlb-abandoned",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/net/staging-test-nlb-abandoned/1234567890fedcba",
        type: "network",
        scheme: "internet-facing",
        createdDate: "2024-01-20",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 16.20,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/net/staging-test-nlb-abandoned/1234567890fedcba"
      },
      {
        loadBalancerName: "dev-identity-auth-v1-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dev-identity-auth-v1-alb/1122334455667788",
        type: "application",
        scheme: "internet-facing",
        createdDate: "2023-11-05",
        requestCount30d: 0,
        activeTargetsCount: 1,
        monthlyWastedUSD: 16.20,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dev-identity-auth-v1-alb/1122334455667788"
      },
      {
        loadBalancerName: "admin-portal-legacy-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/admin-portal-legacy-alb/8877665544332211",
        type: "application",
        scheme: "internal",
        createdDate: "2024-02-18",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 16.20,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/admin-portal-legacy-alb/8877665544332211"
      }
    ]
  };

  // 10. Graviton, Dev Start-Stop & FinOps Recommendations Page
  const finopsRecommendations = {
    summary: {
      gravitonSavingsMonthlyUSD: 1420.00,
      devStartStopSavingsMonthlyUSD: 850.00,
      idleResourcesSavingsMonthlyUSD: 540.00,
      totalFinOpsRecommendationsUSD: 2810.00
    },
    gravitonRecommendations: [
      {
        resource: "EC2 & EKS Worker Nodes",
        currentArchitecture: "x86 (Intel c5/m5/r5)",
        targetArchitecture: "ARM64 (AWS Graviton3 c6g/m6g/r6g)",
        impact: "20% cost reduction + up to 40% performance gain for Node.js, Python, Go, and PostgreSQL.",
        potentialMonthlySavingsUSD: 940.00
      },
      {
        resource: "RDS Databases & ElastiCache",
        currentArchitecture: "x86 (db.m5 / cache.m5)",
        targetArchitecture: "ARM64 (db.m6g / cache.m6g)",
        impact: "Seamless engine parameter group swap. Instant 20% price drop per DB instance.",
        potentialMonthlySavingsUSD: 480.00
      }
    ],
    devSchedulerRecommendations: [
      {
        environment: "Dev & Staging Accounts (22 EC2s + 6 RDS)",
        strategy: "Auto Start-Stop Schedule (Mon-Fri 9 AM - 8 PM IST / Off on Weekends)",
        uptimeReduction: "65% Uptime Savings (Running 55 hrs/week instead of 168 hrs/week)",
        potentialMonthlySavingsUSD: 850.00,
        solution: "Deploy AWS Instance Scheduler or EventBridge + Lambda tag-based schedule (`Schedule=office-hours`)."
      }
    ],
    idleResourceCleanup: [
      {
        category: "Zero Request Application Load Balancers",
        count: 4,
        monthlyCostUSD: 64.80, // 4 * $16.20/mo
        remediation: "Delete ALBs with 0 requests over the past 30 days.",
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn <ALB-ARN>"
      },
      {
        category: "Unattached Elastic IPs",
        count: 8,
        monthlyCostUSD: 28.80,
        remediation: "Release idle EIPs ($0.005/hr when unattached).",
        cliCommand: "aws ec2 release-address --allocation-id eipalloc-0123456789abcdef0"
      },
      {
        category: "Stale EBS Snapshots (> 2 Years)",
        count: 45,
        monthlyCostUSD: 180.00,
        remediation: "Purge orphaned AMI snapshots no longer associated with active launch templates.",
        cliCommand: "aws ec2 delete-snapshot --snapshot-id snap-0123456789abcdef0"
      }
    ]
  };

  return {
    meta: {
      scannedAt: timestamp,
      region: region,
      monitoringPeriodDays: days,
      accountAlias: "AWS-Production-Environment-Audit",
      accountId: "1234-5678-9012",
      trigunVersion: "3.0.0-FinOps",
      overallGrade: "B-"
    },
    billingSection,
    ecrAudit,
    ec2Audit,
    rdsAudit,
    s3Audit,
    logGroupsAudit,
    ebsGp2Audit,
    unattachedEbsAudit,
    idleAlbAudit,
    finopsRecommendations
  };
}

module.exports = { generateMockScanResults };
