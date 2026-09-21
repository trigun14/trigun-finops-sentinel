/**
 * HTML Exporter for ScoutSuite-style AWS Audit & Cost Optimization Reports
 * Generates a self-contained offline static HTML report file
 */

function generateStandaloneHtmlReport(scanData) {
  const jsonStr = JSON.stringify(scanData);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trigun FinOps Audit Report - ${scanData.meta.accountAlias} (${scanData.meta.accountId})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg-dark: #090d16;
      --bg-card: #111827;
      --bg-card-hover: #1f293d;
      --border-color: #1f293d;
      --border-glow: rgba(99, 102, 241, 0.2);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --accent-green: #10b981;
      --accent-amber: #f59e0b;
      --accent-red: #ef4444;
      --accent-cyan: #06b6d4;
      --accent-purple: #a855f7;
      --font-main: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-code: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-main);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header Styling */
    header {
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, var(--primary), var(--accent-cyan));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: white;
      font-size: 1.3rem;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    }

    .brand-title h1 {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, #ffffff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-title p {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .meta-badges {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .badge {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      border: 1px solid transparent;
    }

    .badge-primary { background: rgba(99, 102, 241, 0.15); color: #818cf8; border-color: rgba(99, 102, 241, 0.3); }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }

    /* Main Layout */
    .app-container {
      display: flex;
      flex: 1;
    }

    /* Sidebar Navigation */
    aside {
      width: 280px;
      background: #0d121f;
      border-right: 1px solid var(--border-color);
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-group-title {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      padding: 0.5rem 0.75rem 0.25rem;
      font-weight: 700;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .nav-item:hover, .nav-item.active {
      background: var(--bg-card-hover);
      color: var(--text-main);
    }

    .nav-item.active {
      border-left: 3px solid var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }

    .nav-item-count {
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
    }

    /* Content Area */
    main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.3s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Summary Metric Cards Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--accent-cyan));
    }

    .metric-card.savings::before { background: linear-gradient(90deg, var(--accent-green), #34d399); }
    .metric-card.warning::before { background: linear-gradient(90deg, var(--accent-amber), #fbbf24); }

    .metric-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 0.35rem;
    }

    .metric-value {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .metric-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }

    /* Tables */
    .card-table-wrapper {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .table-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      font-size: 1rem;
      font-weight: 700;
    }

    .search-box {
      background: #0d121f;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0.4rem 0.75rem;
      color: var(--text-main);
      font-size: 0.8rem;
      width: 240px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
    }

    th {
      background: #0d121f;
      color: var(--text-muted);
      font-weight: 600;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
    }

    td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border-color);
      color: #d1d5db;
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg-card-hover); }

    .code-span {
      font-family: var(--font-code);
      background: rgba(255, 255, 255, 0.06);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #a5b4fc;
    }

    .btn-action {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action:hover {
      background: var(--primary);
      color: white;
    }

    /* Modal for CLI scripts */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-overlay.active { display: flex; }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      width: 90%;
      max-width: 650px;
      padding: 1.5rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.25rem;
      cursor: pointer;
    }

    .cli-box {
      background: #090d16;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      font-family: var(--font-code);
      font-size: 0.8rem;
      color: #34d399;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 1rem 0;
    }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem;
    }

    .chart-card h4 {
      font-size: 0.9rem;
      margin-bottom: 1rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-icon">T</div>
      <div class="brand-title">
        <h1>Trigun FinOps Sentinel</h1>
        <p>30-Day Metric Monitoring & AWS Cost Optimization Audit</p>
      </div>
    </div>
    <div class="meta-badges">
      <span class="badge badge-primary">Account: ${scanData.meta.accountAlias} (${scanData.meta.accountId})</span>
      <span class="badge badge-success">Region: ${scanData.meta.region}</span>
      <span class="badge badge-warning">Sentinel Grade: ${scanData.meta.overallGrade}</span>
    </div>
  </header>

  <div class="app-container">
    <aside>
      <div class="nav-group-title">AUDIT DASHBOARD</div>
      <a class="nav-item active" onclick="switchTab('overview')">
        <span>📊 Overview & Savings</span>
      </a>
      <a class="nav-item" onclick="switchTab('billing')">
        <span>💰 Billing & Top 10 Services</span>
      </a>

      <div class="nav-group-title">SERVICE DISCOVERY</div>
      <a class="nav-item" onclick="switchTab('ecr')">
        <span>📦 ECR Repos & Lifecycle</span>
        <span class="nav-item-count">${scanData.ecrAudit.summary.reposWithoutPolicy}</span>
      </a>
      <a class="nav-item" onclick="switchTab('ec2')">
        <span>🖥️ EC2 Right-Sizing</span>
        <span class="nav-item-count">${scanData.ec2Audit.summary.overProvisionedCount}</span>
      </a>
      <a class="nav-item" onclick="switchTab('rds')">
        <span>🛢️ Database (RDS) Over-provisioned</span>
        <span class="nav-item-count">${scanData.rdsAudit.summary.overProvisionedCount}</span>
      </a>
      <a class="nav-item" onclick="switchTab('s3')">
        <span>🪣 S3 Top 10 Buckets</span>
        <span class="nav-item-count">${scanData.s3Audit.summary.bucketsNeedingLifecycle}</span>
      </a>
      <a class="nav-item" onclick="switchTab('cloudwatch')">
        <span>🪵 CloudWatch Log Retention</span>
        <span class="nav-item-count">${scanData.logGroupsAudit.summary.logGroupsNeverExpire}</span>
      </a>

      <div class="nav-group-title">EBS & LOAD BALANCERS</div>
      <a class="nav-item" onclick="switchTab('ebs-gp3')">
        <span>⚡ EBS gp2 to gp3 Migration</span>
        <span class="nav-item-count">${scanData.ebsGp2Audit.summary.totalGp2Volumes}</span>
      </a>
      <a class="nav-item" onclick="switchTab('ebs-unattached')">
        <span>🔌 EBS Unattached (> 1 Year)</span>
        <span class="nav-item-count">${scanData.unattachedEbsAudit.summary.totalUnattachedVolumes}</span>
      </a>
      <a class="nav-item" onclick="switchTab('alb')">
        <span>⚖️ Zero-Request Load Balancers</span>
        <span class="nav-item-count">${scanData.idleAlbAudit ? scanData.idleAlbAudit.summary.idleLoadBalancersCount : 0}</span>
      </a>
      <a class="nav-item" onclick="switchTab('recommendations')">
        <span>🚀 Graviton & Recommendations</span>
      </a>
    </aside>

    <main>
      <!-- TAB 1: OVERVIEW -->
      <div id="tab-overview" class="tab-content active">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Monthly Account Spend</div>
            <div class="metric-value">$${scanData.billingSection.summary.totalAccountCost30dUSD.toLocaleString()}</div>
            <div class="metric-sub">Past 30 Days AWS Spend</div>
          </div>
          <div class="metric-card savings">
            <div class="metric-label">Identified Monthly Savings</div>
            <div class="metric-value" style="color: var(--accent-green);">$${scanData.billingSection.summary.totalIdentifiedMonthlySavingsUSD.toLocaleString()}</div>
            <div class="metric-sub">${scanData.billingSection.summary.savingsPercentage}% total cost reduction potential</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">ECR & Log Expired Repos</div>
            <div class="metric-value" style="color: var(--accent-amber);">${scanData.ecrAudit.summary.reposWithoutPolicy + scanData.logGroupsAudit.summary.logGroupsNeverExpire}</div>
            <div class="metric-sub">Missing retention policies</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Over-provisioned Instances</div>
            <div class="metric-value" style="color: #818cf8;">${scanData.ec2Audit.summary.overProvisionedCount + scanData.rdsAudit.summary.overProvisionedCount}</div>
            <div class="metric-sub">EC2 & RDS Right-sizing targets</div>
          </div>
        </div>

        <div class="charts-row">
          <div class="chart-card">
            <h4>Identified Monthly Cost Savings Breakdown ($)</h4>
            <canvas id="overviewSavingsChart"></canvas>
          </div>
          <div class="chart-card">
            <h4>Top 5 Monthly Spend Categories ($)</h4>
            <canvas id="overviewSpendChart"></canvas>
          </div>
        </div>
      </div>

      <!-- TAB 2: BILLING & TOP 10 SERVICES -->
      <div id="tab-billing" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Top 10 AWS Services by 30-Day Monthly Cost</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>AWS Service Name</th>
                <th>Monthly Cost ($)</th>
                <th>% of Account Spend</th>
                <th>FinOps Action</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.billingSection.top10Services.map(s => `
                <tr>
                  <td>#${s.rank}</td>
                  <td><strong>${s.serviceName}</strong></td>
                  <td style="color: var(--accent-green); font-weight: 700;">$${s.costUSD.toFixed(2)}</td>
                  <td>${s.percentage}%</td>
                  <td><span class="badge badge-primary">Review Spend</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="metric-card" style="margin-top: 1.5rem;">
          <div class="metric-label">CloudWatch Billing API Call Metric Audit</div>
          <div style="font-size: 1.1rem; font-weight: 700; margin: 0.5rem 0;" class="code-span">${scanData.billingSection.apiMetricsAudit.cloudWatchApiCalls30d.toLocaleString()} GetMetricData Calls</div>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${scanData.billingSection.apiMetricsAudit.recommendation}</p>
        </div>
      </div>

      <!-- TAB 3: ECR REPOS -->
      <div id="tab-ecr" class="tab-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Total ECR Repos</div>
            <div class="metric-value">${scanData.ecrAudit.summary.totalRepositories}</div>
          </div>
          <div class="metric-card warning">
            <div class="metric-label">Missing Lifecycle Policy</div>
            <div class="metric-value" style="color: var(--accent-amber);">${scanData.ecrAudit.summary.reposWithoutPolicy}</div>
          </div>
          <div class="metric-card savings">
            <div class="metric-label">Potential Storage Savings</div>
            <div class="metric-value" style="color: var(--accent-green);">${scanData.ecrAudit.summary.potentialStorageSavingsGB} GB</div>
            <div class="metric-sub">($${scanData.ecrAudit.summary.estimatedMonthlySavingsUSD}/mo)</div>
          </div>
        </div>

        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>ECR Repositories Storage Audit</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Repository Name</th>
                <th>Total Images</th>
                <th>Storage Size</th>
                <th>Lifecycle Policy</th>
                <th>Old Images (> 30d)</th>
                <th>Est. Savings</th>
                <th>Fix Script</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.ecrAudit.items.map(item => `
                <tr>
                  <td><span class="code-span">${item.repoName}</span></td>
                  <td>${item.totalImages}</td>
                  <td>${item.sizeGB} GB</td>
                  <td>
                    ${item.hasLifecyclePolicy 
                      ? '<span class="badge badge-success">Active</span>' 
                      : '<span class="badge badge-warning">Missing</span>'}
                  </td>
                  <td>${item.staleImages}</td>
                  <td style="color: var(--accent-green); font-weight:700;">$${item.monthlySavingsUSD.toFixed(2)}/mo</td>
                  <td>
                    ${item.hasLifecyclePolicy ? '-' : `<button class="btn-action" onclick="showCliModal('${encodeURIComponent(item.cliCommand)}')">Get CLI Fix</button>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: EC2 RIGHT-SIZING -->
      <div id="tab-ec2" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Over-Provisioned EC2 Instances (30-Day Metric Audit)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Instance Name / ID</th>
                <th>Current Type</th>
                <th>Max CPU (30d)</th>
                <th>Avg CPU</th>
                <th>Current Cost</th>
                <th>Recommended Type</th>
                <th>Monthly Savings</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.ec2Audit.items.map(ec2 => `
                <tr>
                  <td>
                    <strong>${ec2.name}</strong><br>
                    <span class="code-span">${ec2.instanceId}</span>
                  </td>
                  <td><span class="badge badge-warning">${ec2.instanceType}</span></td>
                  <td style="color: var(--accent-red); font-weight: 700;">${ec2.maxCpu30d}%</td>
                  <td>${ec2.avgCpu30d}%</td>
                  <td>$${ec2.currentCostUSD.toFixed(2)}</td>
                  <td><span class="badge badge-success">${ec2.recommendedType}</span></td>
                  <td style="color: var(--accent-green); font-weight:700;">$${ec2.monthlySavingsUSD.toFixed(2)}/mo</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 5: RDS DATABASES -->
      <div id="tab-rds" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Over-Provisioned RDS Database Instances</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>DB Identifier</th>
                <th>Engine</th>
                <th>Current Class</th>
                <th>Max CPU (30d)</th>
                <th>Avg Conn</th>
                <th>Recommended Class</th>
                <th>Monthly Savings</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.rdsAudit.items.map(db => `
                <tr>
                  <td><strong>${db.dbIdentifier}</strong></td>
                  <td>${db.engine}</td>
                  <td><span class="badge badge-warning">${db.class}</span></td>
                  <td style="color: var(--accent-amber); font-weight:700;">${db.maxCpu30d}%</td>
                  <td>${db.activeConnectionsAvg}</td>
                  <td><span class="badge badge-success">${db.recommendedClass}</span></td>
                  <td style="color: var(--accent-green); font-weight:700;">$${db.monthlySavingsUSD.toFixed(2)}/mo</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 6: S3 BUCKETS -->
      <div id="tab-s3" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Top 10 S3 Buckets by Size & Purge Recommendations</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Bucket Name</th>
                <th>Size (GB)</th>
                <th>Lifecycle Rule</th>
                <th>Recommendation</th>
                <th>Est. Savings</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.s3Audit.top10Buckets.map(b => `
                <tr>
                  <td>#${b.rank}</td>
                  <td><span class="code-span">${b.bucketName}</span></td>
                  <td><strong>${b.sizeGB.toLocaleString()} GB</strong></td>
                  <td>${b.hasLifecycleRule ? '<span class="badge badge-success">Configured</span>' : '<span class="badge badge-danger">Missing</span>'}</td>
                  <td style="font-size: 0.8rem; color: var(--text-muted);">${b.recommendation}</td>
                  <td style="color: var(--accent-green); font-weight:700;">$${b.potentialMonthlySavingsUSD.toFixed(2)}/mo</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 7: CLOUDWATCH LOGS -->
      <div id="tab-cloudwatch" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>CloudWatch Log Groups Retention Audit</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Log Group Name</th>
                <th>Stored Size</th>
                <th>Retention</th>
                <th>Monthly Cost</th>
                <th>Fix CLI</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.logGroupsAudit.unprotectedGroups.map(lg => `
                <tr>
                  <td><span class="code-span">${lg.logGroupName}</span></td>
                  <td>${lg.storedBytesGB} GB</td>
                  <td><span class="badge badge-danger">${lg.retentionInDays}</span></td>
                  <td>$${lg.monthlyCostUSD.toFixed(2)}</td>
                  <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(lg.cliCommand)}')">Apply 30-Day Retention</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 8: EBS GP2 TO GP3 -->
      <div id="tab-ebs-gp3" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>EBS gp2 to gp3 Migration Opportunities</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Volume ID / Name</th>
                <th>Size (GB)</th>
                <th>Attached Instance</th>
                <th>gp2 Cost</th>
                <th>gp3 Cost</th>
                <th>Monthly Savings</th>
                <th>Migrate CLI</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.ebsGp2Audit.items.map(v => `
                <tr>
                  <td>
                    <strong>${v.name}</strong><br>
                    <span class="code-span">${v.volumeId}</span>
                  </td>
                  <td>${v.sizeGB} GB</td>
                  <td style="font-size: 0.75rem;">${v.attachedTo}</td>
                  <td>$${v.currentGp2CostUSD.toFixed(2)}</td>
                  <td style="color: var(--accent-green);">$${v.gp3CostUSD.toFixed(2)}</td>
                  <td style="color: var(--accent-green); font-weight:700;">$${v.monthlySavingsUSD.toFixed(2)}/mo</td>
                  <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(v.cliCommand)}')">Get CLI Command</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 9: EBS UNATTACHED -->
      <div id="tab-ebs-unattached" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Unattached & Idle EBS Volumes (> 1 Year / Unused)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Volume ID / Name</th>
                <th>Size</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Wasted Cost</th>
                <th>Cleanup Script</th>
              </tr>
            </thead>
            <tbody>
              ${scanData.unattachedEbsAudit.items.map(uv => `
                <tr>
                  <td>
                    <strong>${uv.name}</strong><br>
                    <span class="code-span">${uv.volumeId}</span>
                  </td>
                  <td>${uv.sizeGB} GB</td>
                  <td><span class="badge badge-danger">${uv.status}</span></td>
                  <td>${uv.createdDate} (${uv.ageDays} days ago)</td>
                  <td style="color: var(--accent-red); font-weight:700;">$${uv.monthlyWastedUSD.toFixed(2)}/mo</td>
                  <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(uv.cliCommand)}')">Delete Volume</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 10: IDLE LOAD BALANCERS -->
      <div id="tab-alb" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>Idle Application & Network Load Balancers (Zero Requests over 30 Days)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Load Balancer Name / ARN</th>
                <th>Type</th>
                <th>Scheme</th>
                <th>Created Date</th>
                <th>30d Requests</th>
                <th>Wasted Cost</th>
                <th>Cleanup Script</th>
              </tr>
            </thead>
            <tbody>
              ${(scanData.idleAlbAudit ? scanData.idleAlbAudit.items : []).map(alb => `
                <tr>
                  <td>
                    <strong>${alb.loadBalancerName}</strong><br>
                    <span class="code-span" style="font-size:0.7rem;">${alb.loadBalancerArn}</span>
                  </td>
                  <td><span class="badge badge-primary">${alb.type}</span></td>
                  <td>${alb.scheme}</td>
                  <td>${alb.createdDate}</td>
                  <td><span class="badge badge-danger">0 Requests</span></td>
                  <td style="color: var(--accent-red); font-weight:700;">$${alb.monthlyWastedUSD.toFixed(2)}/mo</td>
                  <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(alb.cliCommand)}')">Delete ALB</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 11: RECOMMENDATIONS -->
      <div id="tab-recommendations" class="tab-content">
        <div class="card-table-wrapper">
          <div class="table-header">
            <h3>AWS Graviton, Dev Scheduler & FinOps Architecture Recommendations</h3>
          </div>
          <div style="padding: 1.25rem;">
            <h4 style="color: #818cf8; margin-bottom: 0.5rem;">1. AWS Graviton Architecture Migration</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Migrating EC2 worker nodes, EKS clusters, and RDS PostgreSQL databases from x86 to Graviton3 (c6g/m6g/r6g) delivers 20% lower instance pricing and up to 40% performance gain.
            </p>

            <h4 style="color: #fbbf24; margin-bottom: 0.5rem; margin-top: 1.5rem;">2. Non-Production Environment Auto Start-Stop Scheduler</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              Implementing an automated Mon-Fri (9 AM - 8 PM IST) start-stop schedule on Dev/Staging EC2 and RDS instances reduces non-prod uptime by 65%, saving an estimated $850/month.
            </p>

            <h4 style="color: #34d399; margin-bottom: 0.5rem; margin-top: 1.5rem;">3. Idle Resource Cleanup (EIPs & ALBs)</h4>
            <ul style="font-size: 0.85rem; color: var(--text-muted); margin-left: 1.25rem; line-height: 1.8;">
              <li>Release 8 unattached Elastic IP addresses ($28.80/month).</li>
              <li>Delete 3 unused Application Load Balancers ($67.50/month).</li>
              <li>Purge 45 orphaned AMI EBS snapshots older than 2 years ($180.00/month).</li>
            </ul>
          </div>
        </div>
      </div>

    </main>
  </div>

  <!-- MODAL FOR CLI SCRIPT -->
  <div id="cliModal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3>AWS CLI Remediation Command</h3>
        <button class="modal-close" onclick="closeCliModal()">✕</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted);">Copy and run this command in your terminal with appropriate AWS IAM permissions:</p>
      <div id="cliModalText" class="cli-box"></div>
      <button class="btn-action" style="width: 100%; padding: 0.6rem;" onclick="copyCliText()">Copy to Clipboard</button>
    </div>
  </div>

  <script>
    const reportData = ${jsonStr};

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      
      document.getElementById('tab-' + tabId).classList.add('active');
      event.currentTarget.classList.add('active');
    }

    function showCliModal(encodedCommand) {
      const command = decodeURIComponent(encodedCommand);
      document.getElementById('cliModalText').innerText = command;
      document.getElementById('cliModal').classList.add('active');
    }

    function closeCliModal() {
      document.getElementById('cliModal').classList.remove('active');
    }

    function copyCliText() {
      const text = document.getElementById('cliModalText').innerText;
      navigator.clipboard.writeText(text);
      alert('Command copied to clipboard!');
    }

    // Render Overview Charts
    window.addEventListener('DOMContentLoaded', () => {
      // Savings Chart
      const savingsCtx = document.getElementById('overviewSavingsChart').getContext('2d');
      new Chart(savingsCtx, {
        type: 'doughnut',
        data: {
          labels: ['EC2 Right-Sizing', 'RDS Downsizing', 'EBS gp3 Migration', 'ECR Storage', 'S3 Purge/Transition', 'Log Retention'],
          datasets: [{
            data: [1840, 2410, 97, 105, 412, 86],
            backgroundColor: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } }
        }
      });

      // Top Spend Chart
      const spendCtx = document.getElementById('overviewSpendChart').getContext('2d');
      new Chart(spendCtx, {
        type: 'bar',
        data: {
          labels: ['EC2', 'RDS', 'EKS', 'S3', 'ECR'],
          datasets: [{
            label: 'Monthly Spend ($)',
            data: [6420, 4850, 2150, 1240, 850],
            backgroundColor: '#6366f1',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { ticks: { color: '#9ca3af' } },
            y: { ticks: { color: '#9ca3af' } }
          },
          plugins: { legend: { display: false } }
        }
      });
    });
  </script>
</body>
</html>`;
}

module.exports = { generateStandaloneHtmlReport };
