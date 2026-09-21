/**
 * Comprehensive Mock Data Generator for Trigun FinOps Sentinel Audit
 * Simulates a realistic enterprise AWS account scanning result (30-day window)
 */

function generateMockScanResults(region = 'ap-south-1', days = 30) {
  const timestamp = new Date().toISOString();
  
  // 1. ECR Repositories Audit
  const ecrAudit = {
    summary: {
      totalRepositories: 18,
      reposWithoutPolicy: 11,
      reposWithPolicy: 7,
      totalStorageGB: 1420.5,
      totalImagesCount: 8450,
      staleImagesCount: 6120, // older than 30 days
      potentialStorageSavingsGB: 1050.2,
      estimatedMonthlySavingsUSD: 105.02 // $0.10/GB ECR storage
    },
    items: [
      {
        repoName: "dehaat-farmer-service",
        totalImages: 940,
        sizeGB: 165.4,
        hasLifecyclePolicy: false,
        staleImages: 890,
        oldestImageDate: "2024-03-12",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 148.0,
        monthlySavingsUSD: 14.80,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name dehaat-farmer-service --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "dehaat-payment-gateway",
        totalImages: 1120,
        sizeGB: 210.0,
        hasLifecyclePolicy: false,
        staleImages: 1040,
        oldestImageDate: "2023-11-05",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 191.0,
        monthlySavingsUSD: 19.10,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name dehaat-payment-gateway --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "dehaat-logistics-backend",
        totalImages: 780,
        sizeGB: 135.2,
        hasLifecyclePolicy: false,
        staleImages: 710,
        oldestImageDate: "2024-01-20",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 122.5,
        monthlySavingsUSD: 12.25,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name dehaat-logistics-backend --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "dehaat-analytics-worker",
        totalImages: 650,
        sizeGB: 118.0,
        hasLifecyclePolicy: false,
        staleImages: 580,
        oldestImageDate: "2024-02-14",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 107.0,
        monthlySavingsUSD: 10.70,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name dehaat-analytics-worker --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "dehaat-notification-engine",
        totalImages: 510,
        sizeGB: 92.5,
        hasLifecyclePolicy: false,
        staleImages: 460,
        oldestImageDate: "2024-04-01",
        remediation: "Apply policy to keep last 10 images",
        potentialSavingsGB: 84.0,
        monthlySavingsUSD: 8.40,
        cliCommand: `aws ecr put-lifecycle-policy --repository-name dehaat-notification-engine --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 10 tagged images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'`
      },
      {
        repoName: "dehaat-auth-service",
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

  // 2. EC2 Over-Provisioned Audit
  const ec2Audit = {
    summary: {
      totalInstancesScanned: 24,
      overProvisionedCount: 8,
      optimalCount: 16,
      currentMonthlySpendUSD: 4320.00,
      potentialMonthlySavingsUSD: 1840.00
    },
    items: [
      {
        instanceId: "i-08a91b2c3d4e5f67a",
        name: "prod-analytics-reporting-worker-01",
        instanceType: "c5.4xlarge",
        maxCpu30d: 12.4,
        avgCpu30d: 4.2,
        memoryUsageAvg: 28.5,
        currentCostUSD: 496.40,
        recommendedType: "c6g.xlarge", // Graviton right-sized
        recommendedCostUSD: 124.10,
        monthlySavingsUSD: 372.30,
        reasoning: "Peak CPU over 30 days is only 12.4%. Downsize from 16 vCPU to 4 vCPU Graviton (c6g.xlarge)."
      },
      {
        instanceId: "i-01f2e3d4c5b6a789b",
        name: "dev-keycloak-identity-server",
        instanceType: "m5.2xlarge",
        maxCpu30d: 8.1,
        avgCpu30d: 2.1,
        memoryUsageAvg: 34.0,
        currentCostUSD: 280.32,
        recommendedType: "t4g.medium",
        recommendedCostUSD: 24.50,
        monthlySavingsUSD: 255.82,
        reasoning: "Dev instance severely idle. Downsize to t4g.medium + implement start-stop schedule."
      },
      {
        instanceId: "i-0987654321fedcba0",
        name: "prod-search-elasticsearch-node-3",
        instanceType: "r5.2xlarge",
        maxCpu30d: 18.2,
        avgCpu30d: 6.8,
        memoryUsageAvg: 41.0,
        currentCostUSD: 364.80,
        recommendedType: "r6g.xlarge",
        recommendedCostUSD: 153.30,
        monthlySavingsUSD: 211.50,
        reasoning: "Over-provisioned RAM & CPU. Switch to r6g.xlarge Graviton3 instance."
      },
      {
        instanceId: "i-0a1b2c3d4e5f67891",
        name: "staging-api-gateway-node",
        instanceType: "c5.2xlarge",
        maxCpu30d: 14.5,
        avgCpu30d: 3.9,
        memoryUsageAvg: 22.0,
        currentCostUSD: 248.20,
        recommendedType: "c6g.large",
        recommendedCostUSD: 62.00,
        monthlySavingsUSD: 186.20,
        reasoning: "Non-prod API node peak CPU is < 15%. Downsize to c6g.large."
      }
    ]
  };

  // 3. Database (RDS / Aurora) Over-Provisioned Audit
  const rdsAudit = {
    summary: {
      totalDatabasesScanned: 8,
      overProvisionedCount: 4,
      currentMonthlySpendUSD: 6850.00,
      potentialMonthlySavingsUSD: 2410.00
    },
    items: [
      {
        dbIdentifier: "dehaat-prod-order-db",
        engine: "postgres (14.9)",
        class: "db.m5.4xlarge",
        maxCpu30d: 14.2,
        avgCpu30d: 5.1,
        avgIops: 240,
        activeConnectionsAvg: 18,
        currentCostUSD: 1480.00,
        recommendedClass: "db.m6g.xlarge",
        recommendedCostUSD: 410.00,
        monthlySavingsUSD: 1070.00,
        reasoning: "Max 30-day CPU is 14.2% with 18 avg connections. Downsize to Graviton db.m6g.xlarge."
      },
      {
        dbIdentifier: "dehaat-dev-inventory-db",
        engine: "postgres (15.3)",
        class: "db.r5.2xlarge",
        maxCpu30d: 9.8,
        avgCpu30d: 1.8,
        avgIops: 80,
        activeConnectionsAvg: 4,
        currentCostUSD: 720.00,
        recommendedClass: "db.t4g.medium",
        recommendedCostUSD: 52.00,
        monthlySavingsUSD: 668.00,
        reasoning: "Dev DB is oversized for light workload. Migrate to db.t4g.medium."
      },
      {
        dbIdentifier: "dehaat-staging-farmer-db",
        engine: "mysql (8.0)",
        class: "db.m5.2xlarge",
        maxCpu30d: 11.5,
        avgCpu30d: 3.0,
        avgIops: 110,
        activeConnectionsAvg: 6,
        currentCostUSD: 590.00,
        recommendedClass: "db.m6g.large",
        recommendedCostUSD: 195.00,
        monthlySavingsUSD: 395.00,
        reasoning: "Staging DB under-utilized. Downsize to db.m6g.large Graviton."
      },
      {
        dbIdentifier: "dehaat-prod-auth-redis",
        engine: "redis (cluster mode)",
        class: "cache.m5.xlarge",
        maxCpu30d: 16.0,
        avgCpu30d: 4.5,
        avgIops: 450,
        activeConnectionsAvg: 42,
        currentCostUSD: 380.00,
        recommendedClass: "cache.t4g.medium",
        recommendedCostUSD: 103.00,
        monthlySavingsUSD: 277.00,
        reasoning: "Redis cluster cache under 20% CPU. Downsize to cache.t4g.medium."
      }
    ]
  };

  // 4. S3 Top 10 Buckets & Purge / Transition Audit (Proportional Savings: $0.0105 per GB-month)
  const s3Audit = {
    summary: {
      totalBucketsScanned: 42,
      top10TotalSizeGB: 18450.0,
      bucketsNeedingLifecycle: 7,
      potentialMonthlySavingsUSD: 212.82
    },
    top10Buckets: [
      {
        rank: 1,
        bucketName: "dehaat-data-lake-raw-logs-prod",
        sizeGB: 6850.0,
        objectCount: 4250000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 180,
        recommendation: "Move data older than 30 days to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 71.93 // 6850 * 0.0105
      },
      {
        rank: 2,
        bucketName: "dehaat-db-backups-archive-mumbai",
        sizeGB: 4120.0,
        objectCount: 18400,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 120,
        recommendation: "Transition backups older than 90 days to S3 Standard-IA / Glacier.",
        potentialMonthlySavingsUSD: 43.26 // 4120 * 0.0105
      },
      {
        rank: 3,
        bucketName: "dehaat-kinesis-analytics-dump",
        sizeGB: 2890.0,
        objectCount: 8900000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 210,
        recommendation: "Transition temporary dump files to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 30.35 // 2890 * 0.0105
      },
      {
        rank: 4,
        bucketName: "dehaat-application-build-artifacts-temp",
        sizeGB: 1450.0,
        objectCount: 125000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 90,
        recommendation: "Configure 30-day lifecycle rule to transition to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 15.23 // 1450 * 0.0105
      },
      {
        rank: 5,
        bucketName: "dehaat-user-kyc-documents-prod",
        sizeGB: 980.0,
        objectCount: 450000,
        hasLifecycleRule: true,
        lastAccessedDaysAgo: 5,
        recommendation: "Active production bucket. (Optimal)",
        potentialMonthlySavingsUSD: 0.00
      },
      {
        rank: 6,
        bucketName: "dehaat-staging-media-uploads",
        sizeGB: 760.0,
        objectCount: 8900,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 150,
        recommendation: "Configure 30-day lifecycle rule to transition to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 7.98 // 760 * 0.0105
      },
      {
        rank: 7,
        bucketName: "dehaat-cloudfront-edge-logs-2023-2024",
        sizeGB: 540.0,
        objectCount: 1100000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 365,
        recommendation: "Transition log files to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 5.67 // 540 * 0.0105
      },
      {
        rank: 8,
        bucketName: "dehaat-ml-model-training-checkpoints",
        sizeGB: 380.0,
        objectCount: 4200,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 110,
        recommendation: "Transition interim weights to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 3.99 // 380 * 0.0105
      },
      {
        rank: 9,
        bucketName: "dehaat-static-assets-cdn-prod",
        sizeGB: 280.0,
        objectCount: 65000,
        hasLifecycleRule: true,
        lastAccessedDaysAgo: 1,
        recommendation: "Active CDN asset origin. (Optimal)",
        potentialMonthlySavingsUSD: 0.00
      },
      {
        rank: 10,
        bucketName: "dehaat-temp-exports-csv-reports",
        sizeGB: 200.0,
        objectCount: 15000,
        hasLifecycleRule: false,
        lastAccessedDaysAgo: 45,
        recommendation: "Transition CSV exports to S3 Standard-IA.",
        potentialMonthlySavingsUSD: 2.10 // 200 * 0.0105
      }
    ]
  };

  // 5. CloudWatch Log Groups Retention Audit ($0.035/GB proportional)
  const logGroupsAudit = {
    summary: {
      totalLogGroupsScanned: 38,
      logGroupsNeverExpire: 24,
      logGroupsWithRetention: 14,
      totalLogStorageGB: 2480.0,
      monthlyLogStorageCostUSD: 124.00,
      potentialMonthlySavingsUSD: 86.80
    },
    unprotectedGroups: [
      {
        logGroupName: "/aws/containerinsights/dehaat-eks-prod/application",
        storedBytesGB: 850.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 42.50,
        recommendedRetentionDays: 30,
        potentialSavingsUSD: 29.75, // 850 * 0.035
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/containerinsights/dehaat-eks-prod/application' --retention-in-days 30"
      },
      {
        logGroupName: "/aws/rds/instance/dehaat-prod-order-db/postgresql",
        storedBytesGB: 410.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 20.50,
        recommendedRetentionDays: 30,
        potentialSavingsUSD: 14.35, // 410 * 0.035
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/rds/instance/dehaat-prod-order-db/postgresql' --retention-in-days 30"
      },
      {
        logGroupName: "/aws/lambda/dehaat-pdf-generator-prod",
        storedBytesGB: 290.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 14.50,
        recommendedRetentionDays: 14,
        potentialSavingsUSD: 10.15, // 290 * 0.035
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/lambda/dehaat-pdf-generator-prod' --retention-in-days 14"
      },
      {
        logGroupName: "/aws/vpc/flowlogs-prod-mumbai",
        storedBytesGB: 240.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 12.00,
        recommendedRetentionDays: 7,
        potentialSavingsUSD: 8.40, // 240 * 0.035
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/vpc/flowlogs-prod-mumbai' --retention-in-days 7"
      },
      {
        logGroupName: "/aws/elasticbeanstalk/dehaat-dev-environment/syslog",
        storedBytesGB: 180.0,
        retentionInDays: "Never Expire",
        monthlyCostUSD: 9.00,
        recommendedRetentionDays: 7,
        potentialSavingsUSD: 6.30, // 180 * 0.035
        cliCommand: "aws logs put-retention-policy --log-group-name '/aws/elasticbeanstalk/dehaat-dev-environment/syslog' --retention-in-days 7"
      }
    ]
  };

  // 6. Cost & Billing Section
  const billingSection = {
    summary: {
      periodDays: days,
      totalAccountCost30dUSD: 18450.00,
      projectedAnnualSpendUSD: 221400.00,
      totalIdentifiedMonthlySavingsUSD: 5267.12,
      savingsPercentage: 28.5,
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

  // 7. EBS Volumes gp2 to gp3 Migration Audit ($0.02/GB proportional)
  const ebsGp2Audit = {
    summary: {
      totalGp2Volumes: 16,
      totalGp2ProvisionedGB: 4850,
      currentMonthlyGp2CostUSD: 485.00,
      projectedMonthlyGp3CostUSD: 388.00,
      monthlySavingsUSD: 97.00, // 4850 * 0.02
      annualSavingsUSD: 1164.00
    },
    items: [
      {
        volumeId: "vol-0a123b45c67d89e01",
        name: "prod-eks-worker-root-01",
        sizeGB: 500,
        iops: 1500,
        throughput: 128,
        attachedTo: "i-08a91b2c3d4e5f67a (prod-analytics-reporting-worker-01)",
        currentGp2CostUSD: 50.00,
        gp3CostUSD: 40.00,
        monthlySavingsUSD: 10.00, // 500 * 0.02
        cliCommand: "aws ec2 modify-volume --volume-id vol-0a123b45c67d89e01 --volume-type gp3"
      },
      {
        volumeId: "vol-0b234c56d78e90f12",
        name: "prod-db-postgres-data",
        sizeGB: 1000,
        iops: 3000,
        throughput: 250,
        attachedTo: "i-0987654321fedcba0 (prod-search-elasticsearch-node-3)",
        currentGp2CostUSD: 100.00,
        gp3CostUSD: 80.00,
        monthlySavingsUSD: 20.00, // 1000 * 0.02
        cliCommand: "aws ec2 modify-volume --volume-id vol-0b234c56d78e90f12 --volume-type gp3"
      },
      {
        volumeId: "vol-0c345d67e89f01a23",
        name: "dev-keycloak-data",
        sizeGB: 300,
        iops: 900,
        throughput: 128,
        attachedTo: "i-01f2e3d4c5b6a789b (dev-keycloak-identity-server)",
        currentGp2CostUSD: 30.00,
        gp3CostUSD: 24.00,
        monthlySavingsUSD: 6.00, // 300 * 0.02
        cliCommand: "aws ec2 modify-volume --volume-id vol-0c345d67e89f01a23 --volume-type gp3"
      },
      {
        volumeId: "vol-0d456e78f90a12b34",
        name: "staging-api-logs-vol",
        sizeGB: 400,
        iops: 1200,
        throughput: 128,
        attachedTo: "i-0a1b2c3d4e5f67891 (staging-api-gateway-node)",
        currentGp2CostUSD: 40.00,
        gp3CostUSD: 32.00,
        monthlySavingsUSD: 8.00, // 400 * 0.02
        cliCommand: "aws ec2 modify-volume --volume-id vol-0d456e78f90a12b34 --volume-type gp3"
      }
    ]
  };

  // 8. EBS Unattached & Idle Volumes Audit ($0.10/GB proportional)
  const unattachedEbsAudit = {
    summary: {
      totalUnattachedVolumes: 9,
      totalUnattachedGB: 2150,
      olderThan1YearCount: 6,
      monthlyWastedCostUSD: 215.00, // 2150 * 0.10
      annualWastedCostUSD: 2580.00
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
        monthlyWastedUSD: 80.00, // 800 * 0.10
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
        monthlyWastedUSD: 50.00, // 500 * 0.10
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
        monthlyWastedUSD: 40.00, // 400 * 0.10
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
        monthlyWastedUSD: 25.00, // 250 * 0.10
        cliCommand: "aws ec2 delete-volume --volume-id vol-06655443322110098"
      }
    ]
  };

  // 9. NEW AUDIT MODULE: IDLE LOAD BALANCERS (Zero Requests Over 30 Days)
  const idleAlbAudit = {
    summary: {
      totalLoadBalancersScanned: 11,
      idleLoadBalancersCount: 4,
      monthlyWastedCostUSD: 90.00, // $22.50/mo per idle ALB
      annualWastedCostUSD: 1080.00
    },
    items: [
      {
        loadBalancerName: "dehaat-dev-legacy-internal-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-dev-legacy-internal-alb/9876543210abcdef",
        type: "application",
        scheme: "internal",
        createdDate: "2023-09-14",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 22.50,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-dev-legacy-internal-alb/9876543210abcdef"
      },
      {
        loadBalancerName: "dehaat-staging-test-nlb-abandoned",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/net/dehaat-staging-test-nlb-abandoned/1234567890fedcba",
        type: "network",
        scheme: "internet-facing",
        createdDate: "2024-01-20",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 22.50,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/net/dehaat-staging-test-nlb-abandoned/1234567890fedcba"
      },
      {
        loadBalancerName: "dehaat-keycloak-dev-v1-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-keycloak-dev-v1-alb/1122334455667788",
        type: "application",
        scheme: "internet-facing",
        createdDate: "2023-11-05",
        requestCount30d: 0,
        activeTargetsCount: 1, // target unhealthy/zero requests
        monthlyWastedUSD: 22.50,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-keycloak-dev-v1-alb/1122334455667788"
      },
      {
        loadBalancerName: "dehaat-farmer-admin-old-alb",
        loadBalancerArn: "arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-farmer-admin-old-alb/8877665544332211",
        type: "application",
        scheme: "internal",
        createdDate: "2024-02-18",
        requestCount30d: 0,
        activeTargetsCount: 0,
        monthlyWastedUSD: 22.50,
        cliCommand: "aws elbv2 delete-load-balancer --load-balancer-arn arn:aws:elasticloadbalancing:ap-south-1:123456789012:loadbalancer/app/dehaat-farmer-admin-old-alb/8877665544332211"
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
        monthlyCostUSD: 90.00,
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
      accountAlias: "DeHaat-AWS-Production-Audit",
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
