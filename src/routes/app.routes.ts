import { Router } from "express";
import fs from "node:fs";
import path from "node:path";

const router = Router();

const UPDATES_DIR = path.join(process.cwd(), "updates");
const LATEST_FILE = path.join(UPDATES_DIR, "latest.json");

router.get("/version", (req, res) => {
  if (!fs.existsSync(LATEST_FILE)) {
    res.status(404).json({ error: "No update published yet" });
    return;
  }

  const raw = fs.readFileSync(LATEST_FILE, "utf-8").replace(/^﻿/, "");
  const latest = JSON.parse(raw);
  const url = `${req.protocol}://${req.get("host")}/updates/files/${latest.file}`;
  res.json({ version: latest.version, url });
});

export default router;
