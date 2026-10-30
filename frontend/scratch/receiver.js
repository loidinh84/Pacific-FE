import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, "../src/assets/creatures");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let savedCount = 0;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { filename, base64 } = JSON.parse(body);
        const data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buf = Buffer.from(data, "base64");
        const filePath = path.join(outDir, filename);
        fs.writeFileSync(filePath, buf);
        savedCount++;
        console.log(`Saved [${savedCount}]: ${filename} (${buf.length} bytes)`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, filename }));
      } catch (err) {
        console.error("Error saving:", err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3333, () => {
  console.log("Receiver server running on http://localhost:3333");
});
