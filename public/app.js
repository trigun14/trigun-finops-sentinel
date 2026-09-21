let currentScanResults = null;
let overviewSavingsChart = null;
let overviewSpendChart = null;

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

async function handleStartScan(event) {
  event.preventDefault();

  const accessKeyId = document.getElementById("accessKeyId").value.trim();
  const secretAccessKey = document.getElementById("secretAccessKey").value.trim();
  const sessionToken = document.getElementById("sessionToken").value.trim();
  const region = document.getElementById("region").value;
  const days = document.getElementById("days").value;
  const useMock = document.getElementById("useMockMode").checked;

  if (!useMock && (!accessKeyId || !secretAccessKey)) {
    alert("Please enter mandatory AWS Access Key ID and Secret Access Key, or enable Demo Mode.");
    return;
  }

  // Switch to Loading Screen
  document.getElementById("credentialsScreen").style.display = "none";
  document.getElementById("loadingScreen").style.display = "flex";

  const terminal = document.getElementById("terminalLogs");
  const progressBar = document.getElementById("progressBar");

  const steps = [
    { pct: 15, text: "[01/09] Authenticating Read-Only AWS Credentials & Validating STS Identity..." },
    { pct: 28, text: "[02/09] Fetching AWS Cost Explorer & Billing metrics (Past 30 Days)..." },
    { pct: 40, text: "[03/09] Auditing ECR Repositories, Image Counts, & Lifecycle Policies..." },
    { pct: 52, text: "[04/09] Fetching EC2 CloudWatch CPU/Memory Metrics (30-day window) & Right-sizing check..." },
    { pct: 65, text: "[05/09] Fetching RDS/Aurora CPU, IOPs, Connections Metrics & Database Right-sizing check..." },
    { pct: 76, text: "[06/09] Scanning S3 Bucket Storage, Inactive Data, & Storage Class Transition Opportunities..." },
    { pct: 85, text: "[07/09] Inspecting CloudWatch Log Groups for Retention Policies & Unnecessary Spend..." },
    { pct: 93, text: "[08/09] Calculating EBS gp2 -> gp3 Migration Savings & Unattached Idle Volume audit (> 1 year)..." },
    { pct: 100, text: "[09/09] Compiling Graviton, Dev Start-Stop, & FinOps Recommendations & Finalizing Audit Report..." }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (progressBar) progressBar.style.width = step.pct + "%";
    
    if (terminal) {
      const logDiv = document.createElement("div");
      logDiv.className = "log-line text-info";
      logDiv.innerText = step.text;
      terminal.appendChild(logDiv);
      terminal.scrollTop = terminal.scrollHeight;
    }

    // Simulate async scanning steps
    await new Promise(r => setTimeout(r, 350));
  }

  // Submit scan request to backend API
  try {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessKeyId, secretAccessKey, sessionToken, region, days, useMock })
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Scan failed.");
    }

    currentScanResults = result.data;
    renderDashboard(currentScanResults);

    // Transition to Dashboard Screen
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("dashboardScreen").style.display = "flex";
  } catch (err) {
    alert("Scan Error: " + err.message);
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("credentialsScreen").style.display = "flex";
  }
}

function renderDashboard(data) {
  // Update header badges
  const badgesContainer = document.getElementById("headerMetaBadges");
  if (badgesContainer) {
    badgesContainer.innerHTML = `
      <span class="badge badge-primary">Account: ${data.meta.accountAlias} (${data.meta.accountId})</span>
      <span class="badge badge-success">Region: ${data.meta.region}</span>
      <span class="badge badge-warning">Sentinel Grade: ${data.meta.overallGrade}</span>
    `;
  }

  // Update counts on sidebar using safe helper
  setText("count-ecr", data.ecrAudit.summary.reposWithoutPolicy);
  setText("count-ec2", data.ec2Audit.summary.overProvisionedCount);
  setText("count-rds", data.rdsAudit.summary.overProvisionedCount);
  setText("count-s3", data.s3Audit.summary.bucketsNeedingLifecycle);
  setText("count-cw", data.logGroupsAudit.summary.logGroupsNeverExpire);
  setText("count-ebs-gp3", data.ebsGp2Audit.summary.totalGp2Volumes);
  setText("count-ebs-unattached", data.unattachedEbsAudit.summary.totalUnattachedVolumes);
  if (data.idleAlbAudit) setText("count-alb", data.idleAlbAudit.summary.idleLoadBalancersCount);

  // Overview metric cards
  setText("overviewSpendVal", `$${data.billingSection.summary.totalAccountCost30dUSD.toLocaleString()}`);
  setText("overviewSavingsVal", `$${data.billingSection.summary.totalIdentifiedMonthlySavingsUSD.toLocaleString()}`);
  setText("overviewSavingsPct", `${data.billingSection.summary.savingsPercentage}% total cost reduction potential`);
  setText("overviewUnprotectedVal", data.ecrAudit.summary.reposWithoutPolicy + data.logGroupsAudit.summary.logGroupsNeverExpire);
  setText("overviewOverprovisionedVal", data.ec2Audit.summary.overProvisionedCount + data.rdsAudit.summary.overProvisionedCount);

  // Render Charts
  renderOverviewCharts(data);

  // Render Billing Table
  const billingTbody = document.getElementById("billingTableBody");
  if (billingTbody) {
    billingTbody.innerHTML = data.billingSection.top10Services.map(s => `
      <tr>
        <td>#${s.rank}</td>
        <td><strong>${s.serviceName}</strong></td>
        <td style="color: var(--accent-green); font-weight:700;">$${s.costUSD.toFixed(2)}</td>
        <td>${s.percentage}%</td>
        <td><span class="badge badge-primary">Review Spend</span></td>
      </tr>
    `).join('');
  }

  setText("cwApiCallCount", `${data.billingSection.apiMetricsAudit.cloudWatchApiCalls30d.toLocaleString()} GetMetricData Calls`);
  setText("cwApiRecommendation", data.billingSection.apiMetricsAudit.recommendation);

  // Render ECR Table
  setText("ecrTotalCount", data.ecrAudit.summary.totalRepositories);
  setText("ecrMissingPolicyCount", data.ecrAudit.summary.reposWithoutPolicy);
  setText("ecrSavingsVal", `${data.ecrAudit.summary.potentialStorageSavingsGB} GB ($${data.ecrAudit.summary.estimatedMonthlySavingsUSD}/mo)`);

  const ecrTbody = document.getElementById("ecrTableBody");
  if (ecrTbody) {
    ecrTbody.innerHTML = data.ecrAudit.items.map(item => `
      <tr>
        <td><span class="code-span">${item.repoName}</span></td>
        <td>${item.totalImages}</td>
        <td>${item.sizeGB} GB</td>
        <td>${item.hasLifecyclePolicy ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-warning">Missing</span>'}</td>
        <td>${item.staleImages}</td>
        <td style="color: var(--accent-green); font-weight:700;">$${item.monthlySavingsUSD.toFixed(2)}/mo</td>
        <td>${item.hasLifecyclePolicy ? '-' : `<button class="btn-action" onclick="showCliModal('${encodeURIComponent(item.cliCommand)}')">Get CLI Fix</button>`}</td>
      </tr>
    `).join('');
  }

  // Render EC2 Table
  const ec2Tbody = document.getElementById("ec2TableBody");
  if (ec2Tbody) {
    ec2Tbody.innerHTML = data.ec2Audit.items.map(ec2 => `
      <tr>
        <td><strong>${ec2.name}</strong><br><span class="code-span">${ec2.instanceId}</span></td>
        <td><span class="badge badge-warning">${ec2.instanceType}</span></td>
        <td style="color: var(--accent-red); font-weight:700;">${ec2.maxCpu30d}%</td>
        <td>${ec2.avgCpu30d}%</td>
        <td>$${ec2.currentCostUSD.toFixed(2)}</td>
        <td><span class="badge badge-success">${ec2.recommendedType}</span></td>
        <td style="color: var(--accent-green); font-weight:700;">$${ec2.monthlySavingsUSD.toFixed(2)}/mo</td>
      </tr>
    `).join('');
  }

  // Render RDS Table
  const rdsTbody = document.getElementById("rdsTableBody");
  if (rdsTbody) {
    rdsTbody.innerHTML = data.rdsAudit.items.map(db => `
      <tr>
        <td><strong>${db.dbIdentifier}</strong></td>
        <td>${db.engine}</td>
        <td><span class="badge badge-warning">${db.class}</span></td>
        <td style="color: var(--accent-amber); font-weight:700;">${db.maxCpu30d}%</td>
        <td>${db.activeConnectionsAvg}</td>
        <td><span class="badge badge-success">${db.recommendedClass}</span></td>
        <td style="color: var(--accent-green); font-weight:700;">$${db.monthlySavingsUSD.toFixed(2)}/mo</td>
      </tr>
    `).join('');
  }

  // Render S3 Table
  const s3Tbody = document.getElementById("s3TableBody");
  if (s3Tbody) {
    s3Tbody.innerHTML = data.s3Audit.top10Buckets.map(b => `
      <tr>
        <td>#${b.rank}</td>
        <td><span class="code-span">${b.bucketName}</span></td>
        <td><strong>${b.sizeGB.toLocaleString()} GB</strong></td>
        <td>${b.hasLifecycleRule ? '<span class="badge badge-success">Configured</span>' : '<span class="badge badge-danger">Missing</span>'}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${b.recommendation}</td>
        <td style="color: var(--accent-green); font-weight:700;">$${b.potentialMonthlySavingsUSD.toFixed(2)}/mo</td>
      </tr>
    `).join('');
  }

  // Render CloudWatch Logs Table
  const cwTbody = document.getElementById("cwTableBody");
  if (cwTbody) {
    cwTbody.innerHTML = data.logGroupsAudit.unprotectedGroups.map(lg => `
      <tr>
        <td><span class="code-span">${lg.logGroupName}</span></td>
        <td>${lg.storedBytesGB} GB</td>
        <td><span class="badge badge-danger">${lg.retentionInDays}</span></td>
        <td>$${lg.monthlyCostUSD.toFixed(2)}</td>
        <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(lg.cliCommand)}')">Apply 30-Day Retention</button></td>
      </tr>
    `).join('');
  }

  // Render EBS gp3 Table
  const ebsGp3Tbody = document.getElementById("ebsGp3TableBody");
  if (ebsGp3Tbody) {
    ebsGp3Tbody.innerHTML = data.ebsGp2Audit.items.map(v => `
      <tr>
        <td><strong>${v.name}</strong><br><span class="code-span">${v.volumeId}</span></td>
        <td>${v.sizeGB} GB</td>
        <td style="font-size: 0.75rem;">${v.attachedTo}</td>
        <td>$${v.currentGp2CostUSD.toFixed(2)}</td>
        <td style="color: var(--accent-green);">$${v.gp3CostUSD.toFixed(2)}</td>
        <td style="color: var(--accent-green); font-weight:700;">$${v.monthlySavingsUSD.toFixed(2)}/mo</td>
        <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(v.cliCommand)}')">Get CLI Command</button></td>
      </tr>
    `).join('');
  }

  // Render EBS Unattached Table
  const ebsUnattachedTbody = document.getElementById("ebsUnattachedTableBody");
  if (ebsUnattachedTbody) {
    ebsUnattachedTbody.innerHTML = data.unattachedEbsAudit.items.map(uv => `
      <tr>
        <td><strong>${uv.name}</strong><br><span class="code-span">${uv.volumeId}</span></td>
        <td>${uv.sizeGB} GB</td>
        <td><span class="badge badge-danger">${uv.status}</span></td>
        <td>${uv.createdDate} (${uv.ageDays} days ago)</td>
        <td style="color: var(--accent-red); font-weight:700;">$${uv.monthlyWastedUSD.toFixed(2)}/mo</td>
        <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(uv.cliCommand)}')">Delete Volume</button></td>
      </tr>
    `).join('');
  }

  // Render Idle Load Balancers Table
  if (data.idleAlbAudit) {
    const albTbody = document.getElementById("albTableBody");
    if (albTbody) {
      albTbody.innerHTML = data.idleAlbAudit.items.map(alb => `
        <tr>
          <td><strong>${alb.loadBalancerName}</strong><br><span class="code-span" style="font-size:0.7rem;">${alb.loadBalancerArn}</span></td>
          <td><span class="badge badge-primary">${alb.type}</span></td>
          <td>${alb.scheme}</td>
          <td>${alb.createdDate}</td>
          <td><span class="badge badge-danger">0 Requests</span></td>
          <td style="color: var(--accent-red); font-weight:700;">$${alb.monthlyWastedUSD.toFixed(2)}/mo</td>
          <td><button class="btn-action" onclick="showCliModal('${encodeURIComponent(alb.cliCommand)}')">Delete ALB</button></td>
        </tr>
      `).join('');
    }
  }

  // Render FinOps Recommendations Page
  const recContent = document.getElementById("recommendationsContent");
  if (recContent) {
    recContent.innerHTML = `
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
    `;
  }
}

function renderOverviewCharts(data) {
  if (overviewSavingsChart) overviewSavingsChart.destroy();
  if (overviewSpendChart) overviewSpendChart.destroy();

  const savingsElem = document.getElementById("overviewSavingsChart");
  if (savingsElem) {
    const savingsCtx = savingsElem.getContext("2d");
    overviewSavingsChart = new Chart(savingsCtx, {
      type: 'doughnut',
      data: {
        labels: ['EC2 Right-Sizing', 'RDS Downsizing', 'EBS gp3 Migration', 'ECR Storage', 'S3 Purge/Transition', 'Log Retention'],
        datasets: [{
          data: [
            data.ec2Audit.summary.potentialMonthlySavingsUSD,
            data.rdsAudit.summary.potentialMonthlySavingsUSD,
            data.ebsGp2Audit.summary.monthlySavingsUSD,
            data.ecrAudit.summary.estimatedMonthlySavingsUSD,
            data.s3Audit.summary.potentialMonthlySavingsUSD,
            data.logGroupsAudit.summary.potentialMonthlySavingsUSD
          ],
          backgroundColor: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } }
      }
    });
  }

  const spendElem = document.getElementById("overviewSpendChart");
  if (spendElem) {
    const spendCtx = spendElem.getContext("2d");
    overviewSpendChart = new Chart(spendCtx, {
      type: 'bar',
      data: {
        labels: data.billingSection.top10Services.slice(0, 5).map(s => s.serviceName.split(" ")[1] || s.serviceName),
        datasets: [{
          label: 'Monthly Spend ($)',
          data: data.billingSection.top10Services.slice(0, 5).map(s => s.costUSD),
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
  }
}

function switchDashboardTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

  const tabEl = document.getElementById("tab-" + tabId);
  const navEl = document.getElementById("nav-" + tabId);
  if (tabEl) tabEl.classList.add("active");
  if (navEl) navEl.classList.add("active");
}

function showCliModal(encodedCommand) {
  const command = decodeURIComponent(encodedCommand);
  const box = document.getElementById("cliModalText");
  if (box) box.innerText = command;
  const modal = document.getElementById("cliModal");
  if (modal) modal.classList.add("active");
}

function closeCliModal() {
  const modal = document.getElementById("cliModal");
  if (modal) modal.classList.remove("active");
}

function copyCliText() {
  const box = document.getElementById("cliModalText");
  if (box) {
    navigator.clipboard.writeText(box.innerText);
    alert("Command copied to clipboard!");
  }
}

async function downloadHtmlReport() {
  if (!currentScanResults) return;

  try {
    const response = await fetch("/api/export-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentScanResults)
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trigun-finops-audit-${currentScanResults.meta.accountId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export Error: " + err.message);
  }
}
