# 🛡️ Trigun FinOps Sentinel: AWS Cloud Cost & Infrastructure Audit Suite

**Trigun FinOps Sentinel** is an automated AWS account audit, cost optimization, and metric scanner web application. It evaluates 10 key infrastructure dimensions using 30-day metric windows, calculates mathematically proportional cost savings, and exports standalone interactive HTML reports.

![Trigun FinOps Sentinel](https://img.shields.io/badge/FinOps-Sentinel-blue.svg)
![AWS SDK v3](https://img.shields.io/badge/AWS%20SDK-v3-orange.svg)
![Node.js](https://img.shields.io/badge/Node.js-v25-green.svg)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

---

## 🌟 Key Capabilities

- 🔒 **Read-Only IAM Credential Safety**: Mandatorily prompts for AWS Access Key ID, Secret Access Key, Session Token, Region, and 30-Day Monitoring window.
- 🧪 **Built-in Demo / Mock Account Mode**: Test and explore all dashboard features without entering live credentials.
- ⏳ **Real-Time Step Scanner (*"Hold tight, we are working for you..."*)**: Animated radar pulse scanner showing step-by-step terminal logs across 10 audit phases.
- 🧮 **Mathematically Proportional Cost Math**: All storage savings (S3, ECR, CloudWatch Logs, EBS gp2->gp3, unattached volumes) are strictly proportional to size in GB and resource baseline pricing.
- 📊 **10 Comprehensive Audit Modules**:
  1. **S3 Top 10 Buckets & Lifecycle Purge**: S3 Standard to Standard-IA savings ($0.0105/GB/mo).
  2. **Zero-Request Load Balancers**: Detects ALBs/NLBs with 0 requests in 30 days wasting $22.50/mo.
  3. **EC2 Right-Sizing**: CloudWatch 30-day max CPU/RAM audit & Graviton right-sizing.
  4. **RDS Database Over-Provisioned**: 30-day CPU, IOPS, and connection metric downsizing to Graviton `db.m6g`/`db.t4g`.
  5. **ECR Repos & Lifecycle Policies**: Missing retention policies & stale image storage savings ($0.10/GB/mo).
  6. **CloudWatch Log Retention**: Finds log groups set to `Never Expire` and calculates 30-day retention savings ($0.035/GB/mo).
  7. **Billing & Top 10 Services**: 30-day spend summary, top 10 services breakdown, and CloudWatch `GetMetricData` polling API cost audit.
  8. **EBS gp2 to gp3 Migration**: 20% cost reduction ($0.02/GB/mo saved) with auto-generated CLI fix scripts.
  9. **EBS Unattached Volumes (> 1 Year)**: Identifies unattached/available volumes wasting $0.10/GB/mo.
  10. **Graviton & FinOps Recommendations**: Graviton2/3 migration advice, Dev/Staging auto start-stop schedule (65% non-prod savings), and idle EIP release.
- 📄 **1-Click Standalone Interactive HTML Export**: Downloads a self-contained `.html` report with embedded Chart.js graphs, sidebar navigation tabs, filterable tables, and copyable AWS CLI remediation commands.

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/trigun14/trigun-finops-sentinel.git
cd trigun-finops-sentinel
npm install
```

### 2. Launch Server

```bash
npm start
```

Open your browser at: **`http://127.0.0.1:3000`**

---

## 🛡️ Required AWS IAM Permissions

Trigun FinOps Sentinel only requires **Read-Only** access. You can attach standard AWS Managed Policies:

1. `ReadOnlyAccess` (`arn:aws:iam::aws:policy/ReadOnlyAccess`)
2. `AWSBillingReadOnlyAccess` (`arn:aws:iam::aws:policy/AWSBillingReadOnlyAccess`)

---

## 📄 License

Distributed under the MIT License. Created by Trigun.
