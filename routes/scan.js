import express from "express";
import puppeteer from "puppeteer";
import axe from "axe-core";
import Scan from "../models/Scan.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // open website
    await page.goto(url, { waitUntil: "load" });

    // inject axe
    await page.addScriptTag({
      content: axe.source,
    });

    // run accessibility scan
    const results = await page.evaluate(async () => {
      return await axe.run();
    });
// format results
const formattedIssues = results.violations.map((item) => {
  let severity = "Low";

  if (item.impact === "critical" || item.impact === "serious") {
    severity = "High";
  } else if (item.impact === "moderate") {
    severity = "Medium";
  }

  return {
    issue: item.id,
    description: item.description,
    severity,
    help: item.help,
    helpUrl: item.helpUrl,
  };
});
    await browser.close();

// summary counts
const totalIssues = formattedIssues.length;

const high = formattedIssues.filter(i => i.severity === "High").length;
const medium = formattedIssues.filter(i => i.severity === "Medium").length;
const low = formattedIssues.filter(i => i.severity === "Low").length;

// simple score calculation
const score = Math.max(0, 100 - (high * 5 + medium * 3 + low * 1));

// save to DB
const newScan = new Scan({
  userId: req.user.id,
  url,
  results: {
    issues: formattedIssues,
    summary: {
      totalIssues,
      high,
      medium,
      low,
      score,
    }
  },
});

await newScan.save();

res.json({
  message: "Scan completed",
  scan: newScan,
});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Scan failed" });
  }
});

// GET USER SCANS (History)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      message: "Scan history fetched",
      scans,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

// GET SINGLE SCAN REPORT
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    // security: only owner can access
    if (scan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      message: "Scan fetched",
      scan,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching scan" });
  }
});
export default router;