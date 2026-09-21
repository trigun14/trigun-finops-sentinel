const express = require("express");
const cors = require("cors");
const path = require("path");
const { runAwsScan } = require("./lib/scanner");
const { generateStandaloneHtmlReport } = require("./lib/htmlExporter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// POST /api/scan
app.post("/api/scan", async (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, sessionToken, region = "ap-south-1", days = 30, useMock = false } = req.body;

    console.log(`[SERVER] Received scan request. Region: ${region}, Days: ${days}, MockMode: ${useMock}`);
    
    // Perform audit scan
    const results = await runAwsScan({
      accessKeyId,
      secretAccessKey,
      sessionToken,
      region,
      days: parseInt(days, 10) || 30,
      useMock
    });

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error("[SERVER] Scan Error:", error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/export-html
app.post("/api/export-html", (req, res) => {
  try {
    const scanData = req.body;
    if (!scanData || !scanData.meta) {
      return res.status(400).json({ success: false, error: "Invalid scan data provided for export." });
    }

    const htmlContent = generateStandaloneHtmlReport(scanData);
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `attachment; filename=trigun-finops-audit-${scanData.meta.accountId}.html`);
    return res.send(htmlContent);
  } catch (error) {
    console.error("[SERVER] Export HTML Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`=======================================================`);
  console.log(`🚀 Trigun FinOps Sentinel Audit Suite running!`);
  console.log(`🌐 Dashboard URL: http://127.0.0.1:${server.address().port}`);
  console.log(`=======================================================`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} in use, retrying on port ${PORT + 1}...`);
    app.listen(PORT + 1, "127.0.0.1", function() {
      console.log(`=======================================================`);
      console.log(`🚀 Trigun FinOps Sentinel Audit Suite running!`);
      console.log(`🌐 Dashboard URL: http://127.0.0.1:${this.address().port}`);
      console.log(`=======================================================`);
    });
  }
});
